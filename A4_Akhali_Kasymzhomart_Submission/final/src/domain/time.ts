import { DAY_MINUTES } from './constants';

/** Minutes after midnight -> "HH:MM". Anything that is not a finite number gives "--:--". */
export function formatHHMM(minutes: number): string {
  if (!Number.isFinite(minutes)) return '--:--';
  const clamped = Math.max(0, Math.min(DAY_MINUTES, minutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Text from a number field -> whole minutes, or null when it is empty or not a whole number. */
export function parseWholeMinutes(text: string): number | null {
  if (text === '') return null;
  const value = Number(text);
  return Number.isInteger(value) ? value : null;
}
