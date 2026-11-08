import type { Room } from '@/domain/types';
import { EquipmentTags } from './EquipmentTags';

type Props = { rooms: readonly Room[]; selectedId: string; onSelect: (id: string) => void };

export function RoomList({ rooms, selectedId, onSelect }: Props) {
  return (
    <section className="mb-6" aria-label="Matching rooms">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rooms.map((room) => {
          const selected = room.id === selectedId;
          return (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => onSelect(room.id)}
                aria-pressed={selected}
                className={`h-full w-full rounded-2xl border p-4 text-left shadow-sm transition ${
                  selected ? 'border-slate-900 bg-white ring-2 ring-slate-900/10' : 'border-slate-200 bg-white hover:border-slate-400'
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-semibold">{room.name}</span>
                  {room.blocked && (
                    <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Blocked</span>
                  )}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">Seats {room.capacity}</span>
                <EquipmentTags items={room.equipment} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
