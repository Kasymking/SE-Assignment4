import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Integration tests: the real App with the real catalog, driven through the UI like a user.
const user = () => userEvent.setup();
const roomButton = (name: RegExp) => screen.getByRole('button', { name });
const roomList = () => within(screen.getByRole('region', { name: 'Matching rooms' }));
const listedNames = () => roomList().queryAllByRole('button').map((b) => b.textContent ?? '');

async function typeTimes(u: ReturnType<typeof userEvent.setup>, start: string, end: string) {
  await u.type(screen.getByLabelText(/^Start/), start);
  await u.type(screen.getByLabelText(/^End/), end);
}
const press = (u: ReturnType<typeof userEvent.setup>) => u.click(screen.getByRole('button', { name: /check availability/i }));

describe('room catalog and selection', () => {
  it('lists all five fictional rooms with capacity and equipment, and selects the first one', () => {
    render(<App />);
    expect(listedNames()).toHaveLength(5);
    expect(roomList().getByText('Seats 120')).toBeInTheDocument();
    expect(roomButton(/Room B-204/)).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('5 of 5 rooms match')).toBeInTheDocument();
  });
});

describe('F1 capacity filter in the UI', () => {
  it('exact capacity: 30 attendees keeps the 30-seat lab', async () => {
    render(<App />);
    await user().type(screen.getByLabelText('Attendees'), '30');
    expect(listedNames().join(' ')).toMatch(/Lecture Hall A-101/);
    expect(listedNames().join(' ')).toMatch(/Computer Lab C-310/);
    expect(listedNames()).toHaveLength(2);
  });

  it('insufficient capacity: 31 attendees removes the 30-seat lab', async () => {
    render(<App />);
    await user().type(screen.getByLabelText('Attendees'), '31');
    expect(listedNames()).toHaveLength(1);
    expect(listedNames()[0]).toMatch(/Lecture Hall A-101/);
  });

  it('an invalid attendees value is explained and does not filter', async () => {
    render(<App />);
    await user().type(screen.getByLabelText('Attendees'), '0');
    expect(screen.getByText('Enter a whole number of 1 or more')).toBeInTheDocument();
    expect(listedNames()).toHaveLength(5);
  });
});

describe('F2 equipment filter in the UI', () => {
  it('requires ALL selected items', async () => {
    render(<App />);
    const u = user();
    await u.click(screen.getByLabelText('Projector'));
    await u.click(screen.getByLabelText('Whiteboard'));
    expect(listedNames()).toHaveLength(3); // B-204, A-101, E-402
    await u.click(screen.getByLabelText('Video conference'));
    expect(listedNames()).toHaveLength(2); // A-101, E-402
  });
});

describe('F4 empty state', () => {
  it('shows a clear message when no room matches, hides the form, and Clear filters restores the list', async () => {
    render(<App />);
    const u = user();
    await u.click(screen.getByLabelText('Computers'));
    await u.click(screen.getByLabelText('Video conference'));
    expect(screen.getByRole('status')).toHaveTextContent('No rooms match your requirements');
    expect(screen.getByText('0 of 5 rooms match')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /check availability/i })).not.toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(listedNames()).toHaveLength(5);
    expect(screen.getByRole('button', { name: /check availability/i })).toBeInTheDocument();
  });
});

describe('F5 room switching and "use the chosen room\'s own bookings"', () => {
  it('the same slot gets a different answer in each room, using that room\'s bookings only', async () => {
    render(<App />);
    const u = user();
    await typeTimes(u, '660', '720');
    await press(u);
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument(); // B-204: booking ends at 660, touching
    expect(screen.getByText('Checked for Room B-204')).toBeInTheDocument();

    await u.click(roomButton(/Lecture Hall A-101/)); // A-101 booked 570-690
    expect(screen.getByText('UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('Overlaps booking 570-690')).toBeInTheDocument();
    expect(screen.getByText('Checked for Lecture Hall A-101')).toBeInTheDocument();

    await u.click(roomButton(/Computer Lab C-310/)); // C-310 booked 660-780
    expect(screen.getByText('Overlaps booking 660-780')).toBeInTheDocument();

    await u.click(roomButton(/Seminar Room D-015/)); // D-015 has no bookings
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('Checked for Seminar Room D-015')).toBeInTheDocument();
  });

  it('switching room does not invent a result when no check was requested', async () => {
    render(<App />);
    await user().click(roomButton(/Lecture Hall A-101/));
    expect(screen.queryByText('AVAILABLE')).not.toBeInTheDocument();
    expect(screen.queryByText('UNAVAILABLE')).not.toBeInTheDocument();
  });

  it('a filter change that removes the selected room moves to the first remaining match and refreshes', async () => {
    render(<App />);
    const u = user();
    await typeTimes(u, '660', '720');
    await press(u);
    expect(screen.getByText('Checked for Room B-204')).toBeInTheDocument();
    await u.type(screen.getByLabelText('Attendees'), '31'); // only A-101 remains
    expect(screen.getByRole('heading', { name: 'Lecture Hall A-101' })).toBeInTheDocument();
    expect(screen.getByText('Checked for Lecture Hall A-101')).toBeInTheDocument();
    expect(screen.getByText('Overlaps booking 570-690')).toBeInTheDocument();
  });
});

describe('F3 blocked room', () => {
  it('is tagged, listed when it matches, and never reported as available', async () => {
    render(<App />);
    const u = user();
    expect(within(roomButton(/Studio E-402/)).getByText('Blocked')).toBeInTheDocument();
    await u.click(roomButton(/Studio E-402/));
    expect(screen.getByText('Room blocked')).toBeInTheDocument(); // badge in the room panel
    await typeTimes(u, '700', '760'); // a slot that is free in every other way
    await press(u);
    expect(screen.getByText('UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('Room is blocked')).toBeInTheDocument();
    expect(screen.queryByText('AVAILABLE')).not.toBeInTheDocument();
  });
});
