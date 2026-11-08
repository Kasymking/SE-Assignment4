import { describe, expect, it } from 'vitest';
import { canBook, type Booking } from './rules';

// Characterization tests: they describe the behavior of the Assignment 3 final code.
// Base data from the assignment: now = 540, existing = [600-660].
const BASE: Booking[] = [{ start: 600, end: 660 }];
const MULTI: Booking[] = [{ start: 600, end: 660 }, { start: 700, end: 760 }];

type Case = [id: string, ac: string, start: number, end: number, blocked: boolean, existing: Booking[], ok: boolean, reason?: string];

const CASES: Case[] = [
  ['T1', 'AC4', 660, 720, false, BASE, true],
  ['T2', 'AC4', 630, 690, false, BASE, false, 'Overlaps booking 600-660'],
  ['T3', 'AC3', 660, 720, true, BASE, false, 'Room is blocked'],
  ['T4', 'AC2', 720, 840, false, BASE, true],
  ['T5', 'AC2', 720, 841, false, BASE, false, 'Duration cannot exceed 120 minutes'],
  ['T6', 'AC1', 540, 570, false, BASE, false, 'Start must be later than the current time (540)'],
  ['T7', 'AC1', 700, 650, false, BASE, false, 'End must be after start'],
  ['T8', 'AC1', 700, 700, false, BASE, false, 'End must be after start'],
  ['T9', 'AC1', -1, 59, false, BASE, false, 'Times must not be negative'],
  ['T10', 'AC1', 1380, 1441, false, BASE, false, 'End must not exceed 1440 (24:00)'],
  ['T11', 'AC1', 1380, 1440, false, BASE, true],
  ['T12', 'AC1', 541, 571, false, BASE, true],
  ['T13', 'AC4', 599, 600, false, BASE, true],
  ['T14', 'AC4', 610, 650, false, BASE, false, 'Overlaps booking 600-660'],
  ['T15', 'AC4', 660, 700, false, MULTI, true],
  ['T16', 'AC4', 650, 710, false, MULTI, false],
  ['T17', 'AC1', 600.5, 660.5, false, [], false, 'Start and End must be whole numbers'],
  ['T18', 'AC1', NaN, 700, false, BASE, false, 'Start and End must be whole numbers'],
  ['T19', 'AC3', 700, 650, true, BASE, false, 'Room is blocked'],
  ['T20', 'AC3', 540, 570, true, BASE, false, 'Room is blocked'],
];

describe('canBook regression (AC1-AC5, 20 cases from Assignment 3)', () => {
  it.each(CASES)('%s (%s) %i-%i blocked=%s', (_id, _ac, start, end, blocked, existing, ok, reason) => {
    const result = canBook(start, end, 540, blocked, existing);
    expect(result.ok).toBe(ok);
    if (reason) expect(result).toEqual({ ok: false, reason });
  });

  it('AC5: does not modify the bookings it receives', () => {
    const existing: Booking[] = [{ start: 700, end: 760 }, { start: 600, end: 660 }];
    const copy = JSON.parse(JSON.stringify(existing));
    canBook(660, 700, 540, false, existing);
    expect(existing).toEqual(copy);
  });
});
