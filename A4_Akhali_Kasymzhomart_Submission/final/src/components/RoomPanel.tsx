import type { ReactNode } from 'react';
import { Clock, DoorOpen } from 'lucide-react';
import type { Booking } from '@/domain/types';
import { formatHHMM } from '@/domain/time';
import { BookingList } from './BookingList';

type Props = { name: string; nowMinutes: number; bookings: readonly Booking[]; toolbar?: ReactNode };

export function RoomPanel({ name, nowMinutes, bookings, toolbar }: Props) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>
              Current time:{' '}
              <span className="font-medium text-slate-700">
                {nowMinutes} min ({formatHHMM(nowMinutes)})
              </span>
            </span>
          </div>
        </div>
        {toolbar}
      </div>
      <BookingList bookings={bookings} />
    </section>
  );
}
