import { describe, expect, it } from 'vitest';
import { filterRooms, parseAttendees } from './filter';
import { ROOMS } from '@/data/rooms';

const ids = (rooms: { id: string }[]) => rooms.map((r) => r.id);
const NONE = { attendees: null, equipment: [] } as const;

describe('F1 capacity filter (capacity >= attendees)', () => {
  it('exact capacity matches: 30 attendees keep the 30-seat lab', () => {
    expect(ids(filterRooms(ROOMS, { ...NONE, attendees: 30 }))).toEqual(['a-101', 'c-310']);
  });
  it('insufficient capacity does not match: 31 attendees drop the 30-seat lab', () => {
    expect(ids(filterRooms(ROOMS, { ...NONE, attendees: 31 }))).toEqual(['a-101']);
  });
  it('more attendees than any room can hold gives no match', () => {
    expect(filterRooms(ROOMS, { ...NONE, attendees: 121 })).toEqual([]);
  });
});

describe('F2 equipment filter (ALL selected items required)', () => {
  it('one item: video conference', () => {
    expect(ids(filterRooms(ROOMS, { ...NONE, equipment: ['video-conference'] }))).toEqual(['a-101', 'e-402']);
  });
  it('two items need both, not either', () => {
    expect(ids(filterRooms(ROOMS, { ...NONE, equipment: ['projector', 'whiteboard'] }))).toEqual(['b-204', 'a-101', 'e-402']);
  });
  it('items that no single room combines give no match', () => {
    expect(filterRooms(ROOMS, { ...NONE, equipment: ['computers', 'video-conference'] })).toEqual([]);
  });
});

describe('combined requirements and F3 (blocked rooms)', () => {
  it('capacity AND equipment must both hold', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 15, equipment: ['whiteboard'] }))).toEqual(['a-101', 'e-402']);
  });
  it('no requirements returns every room, in catalog order', () => {
    expect(ids(filterRooms(ROOMS, NONE))).toEqual(ids([...ROOMS]));
  });
  it('a blocked room that meets the requirements is still listed (it is reported as blocked when checked)', () => {
    expect(ids(filterRooms(ROOMS, { attendees: 20, equipment: ['video-conference'] }))).toContain('e-402');
  });
  it('filtering never changes the catalog', () => {
    const before = JSON.stringify(ROOMS);
    filterRooms(ROOMS, { attendees: 10, equipment: ['projector'] });
    expect(JSON.stringify(ROOMS)).toBe(before);
  });
});

describe('parseAttendees', () => {
  it.each([['', null], ['  ', null], ['0', null], ['-3', null], ['2.5', null], ['abc', null], ['1', 1], ['30', 30]])(
    '%j -> %j', (text, expected) => expect(parseAttendees(text)).toBe(expected));
});
