import { EQUIPMENT_OPTIONS } from '@/data/rooms';
import type { EquipmentId } from '@/domain/types';

type Props = {
  attendeesText: string;
  attendeesInvalid: boolean;
  equipment: readonly EquipmentId[];
  matchCount: number;
  totalRooms: number;
  onAttendeesChange: (text: string) => void;
  onToggleEquipment: (id: EquipmentId) => void;
};

export function RoomFilters(p: Props) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Find a room</h2>

      <label htmlFor="attendees" className="mb-1 block text-sm font-medium text-slate-700">
        Attendees
      </label>
      <input
        id="attendees"
        type="number"
        inputMode="numeric"
        min={1}
        value={p.attendeesText}
        onChange={(e) => p.onAttendeesChange(e.target.value)}
        placeholder="e.g. 25"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 sm:max-w-xs"
      />
      <p className={`mt-1 text-xs ${p.attendeesInvalid ? 'text-red-700' : 'text-slate-500'}`}>
        {p.attendeesInvalid ? 'Enter a whole number of 1 or more' : 'Leave empty for any group size'}
      </p>

      <fieldset className="mt-4">
        <legend className="mb-1 text-sm font-medium text-slate-700">Required equipment</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {EQUIPMENT_OPTIONS.map((item) => (
            <label key={item.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={p.equipment.includes(item.id)}
                onChange={() => p.onToggleEquipment(item.id)}
                className="h-4 w-4 rounded border-slate-300"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-4 text-sm text-slate-500" aria-live="polite">
        {p.matchCount} of {p.totalRooms} rooms match
      </p>
    </section>
  );
}
