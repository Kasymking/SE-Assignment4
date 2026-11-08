import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Assignment 3 behavior that must survive the multi-room extension. These nine tests were written
// against the unchanged baseline (step 1). Three were adapted in step 4b because the demo toggle was
// replaced by per-room blocked data and the room name now appears twice (list card + heading).
async function check(start: string, end: string) {
  const user = userEvent.setup();
  if (start) await user.type(screen.getByLabelText(/^Start/), start);
  if (end) await user.type(screen.getByLabelText(/^End/), end);
  await user.click(screen.getByRole('button', { name: /check availability/i }));
  return user;
}

describe('Assignment 3 behavior in the multi-room UI', () => {
  it('shows the room, the current time and the read-only booking list', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Room B-204' })).toBeInTheDocument(); // adapted: name is now also in the list
    expect(screen.getByText(/540 min \(09:00\)/)).toBeInTheDocument();
    expect(screen.getByText('600-660')).toBeInTheDocument();
  });

  it('disables the check button until both times are whole numbers', async () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /check availability/i });
    expect(button).toBeDisabled();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Start/), '660');
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText(/^End/), '720');
    expect(button).toBeEnabled();
  });

  it('shows an HH:MM hint under a valid time', async () => {
    render(<App />);
    await userEvent.setup().type(screen.getByLabelText(/^Start/), '660');
    expect(screen.getByText('Hint: 11:00')).toBeInTheDocument();
  });

  it('660-720 is AVAILABLE (touching a booking is allowed)', async () => {
    render(<App />);
    await check('660', '720');
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
  });

  it('630-690 is UNAVAILABLE with the overlap reason', async () => {
    render(<App />);
    await check('630', '690');
    expect(screen.getByText('UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('Overlaps booking 600-660')).toBeInTheDocument();
  });

  it('blocked room reports "Room is blocked" before any other reason (Fix 2, now via room data)', async () => {
    render(<App />);
    await userEvent.setup().click(screen.getByRole('button', { name: /Studio E-402/ })); // adapted: was the demo toggle
    await check('700', '650');
    expect(screen.getByText('Room is blocked')).toBeInTheDocument();
  });

  it('a blocked room can never replace an AVAILABLE answer with an available one (Fix 1/F3, adapted from the toggle test)', async () => {
    render(<App />);
    await check('700', '760');
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: /Studio E-402/ })); // adapted: was the demo toggle
    expect(screen.queryByText('AVAILABLE')).not.toBeInTheDocument();
    expect(screen.getByText('Room is blocked')).toBeInTheDocument();
  });

  it('editing an input clears the old result (Fix 1)', async () => {
    render(<App />);
    const user = await check('660', '720');
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/^End/), '0');
    expect(screen.queryByText('AVAILABLE')).not.toBeInTheDocument();
    expect(screen.queryByText('UNAVAILABLE')).not.toBeInTheDocument();
  });

  it('Reset empties the form and the result', async () => {
    render(<App />);
    const user = await check('630', '690');
    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.queryByText('UNAVAILABLE')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^Start/)).toHaveValue(null);
  });
});
