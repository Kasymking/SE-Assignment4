import { EQUIPMENT_OPTIONS } from '@/data/rooms';
import type { EquipmentId } from '@/domain/types';

const LABEL = new Map(EQUIPMENT_OPTIONS.map((e) => [e.id, e.label]));

export function EquipmentTags({ items }: { items: readonly EquipmentId[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((id) => (
        <li key={id} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {LABEL.get(id)}
        </li>
      ))}
    </ul>
  );
}
