import { describe, expect, it } from 'vitest';
import { EQUIPMENT_OPTIONS, ROOMS } from './rooms';
import { DAY_MINUTES } from '@/domain/constants';

describe('room catalog integrity', () => {
  it('has at least four rooms with unique ids', () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ROOMS.map((r) => r.id)).size).toBe(ROOMS.length);
  });

  it('every room has id, name, positive whole capacity, known equipment and a blocked flag', () => {
    const known = EQUIPMENT_OPTIONS.map((e) => e.id);
    for (const r of ROOMS) {
      expect(r.id && r.name).toBeTruthy();
      expect(Number.isInteger(r.capacity) && r.capacity > 0).toBe(true);
      expect(r.equipment.every((e) => known.includes(e))).toBe(true);
      expect(typeof r.blocked).toBe('boolean');
    }
  });

  it('bookings are well-formed (0 <= start < end <= 1440) and do not overlap inside one room', () => {
    for (const r of ROOMS) {
      const sorted = [...r.bookings].sort((a, b) => a.start - b.start);
      sorted.forEach((b, i) => {
        expect(b.start >= 0 && b.start < b.end && b.end <= DAY_MINUTES).toBe(true);
        if (i > 0) expect(b.start).toBeGreaterThanOrEqual(sorted[i - 1].end);
      });
    }
  });

  it('includes at least one blocked room and rooms with different bookings', () => {
    expect(ROOMS.some((r) => r.blocked)).toBe(true);
    expect(new Set(ROOMS.map((r) => JSON.stringify(r.bookings))).size).toBeGreaterThan(1);
  });

  it('keeps the Assignment 3 room: B-204, booking 600-660', () => {
    const b204 = ROOMS.find((r) => r.id === 'b-204');
    expect(b204?.bookings).toEqual([{ start: 600, end: 660 }]);
  });
});
