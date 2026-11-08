export type Booking = { start: number; end: number };

export type CheckResult =
  | { ok: true }
  | { ok: false; reason: string };

const DAY_MINUTES = 1440;
const MAX_DURATION = 120;

export function canBook(
  start: number,
  end: number,
  now: number,
  blocked: boolean,
  existing: Booking[],
): CheckResult {
  if (blocked) {
    return { ok: false, reason: 'Room is blocked' };
  }

  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { ok: false, reason: 'Start and End must be whole numbers' };
  }

  if (start >= end) {
    return { ok: false, reason: 'End must be after start' };
  }

  if (start < 0 || end < 0) {
    return { ok: false, reason: 'Times must not be negative' };
  }

  if (end > DAY_MINUTES) {
    return { ok: false, reason: 'End must not exceed 1440 (24:00)' };
  }

  if (start <= now) {
    return {
      ok: false,
      reason: `Start must be later than the current time (${now})`,
    };
  }

  if (end - start > MAX_DURATION) {
    return { ok: false, reason: 'Duration cannot exceed 120 minutes' };
  }

  for (const b of existing) {
    const overlaps = start < b.end && end > b.start;
    if (overlaps) {
      return { ok: false, reason: `Overlaps booking ${b.start}-${b.end}` };
    }
  }

  return { ok: true };
}
