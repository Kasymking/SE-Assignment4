import { useMemo, useState } from 'react';
import { filterRooms, parseAttendees } from '@/domain/filter';
import type { EquipmentId, Room } from '@/domain/types';

/** Filter state + which room is selected. Matches and the selected room are derived, never stored. */
export function useRoomSearch(rooms: readonly Room[]) {
  const [attendeesText, setAttendeesText] = useState('');
  const [equipment, setEquipment] = useState<readonly EquipmentId[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const attendees = parseAttendees(attendeesText);
  const matches = useMemo(() => filterRooms(rooms, { attendees, equipment }), [rooms, attendees, equipment]);

  // If nothing was picked, or the picked room no longer matches, fall back to the first match.
  const selectedRoom = matches.find((r) => r.id === selectedId) ?? matches[0] ?? null;

  return {
    attendeesText,
    attendeesInvalid: attendeesText.trim() !== '' && attendees === null,
    equipment,
    matches,
    totalRooms: rooms.length,
    selectedRoom,
    setAttendeesText,
    toggleEquipment: (id: EquipmentId) =>
      setEquipment((now) => (now.includes(id) ? now.filter((e) => e !== id) : [...now, id])),
    selectRoom: (id: string) => setSelectedId(id),
    clearFilters: () => { setAttendeesText(''); setEquipment([]); },
  };
}
