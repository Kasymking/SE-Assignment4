import type { Booking } from '@/domain/types';
import { formatHHMM } from '@/domain/time';

export function BookingList({ bookings }: { bookings: readonly Booking[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Existing bookings (read-only)
      </h3>
      <ul className="mt-2 space-y-1.5">
        {bookings.map((b) => (
          <li
            key={`${b.start}-${b.end}`}
            className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="font-medium text-slate-700">
              {b.start}-{b.end}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">
              {formatHHMM(b.start)}–{formatHHMM(b.end)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
