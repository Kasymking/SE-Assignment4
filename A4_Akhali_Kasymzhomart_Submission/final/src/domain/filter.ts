import type { Room, RoomRequirements } from './types';

/** F1: capacity >= attendees. F2: the room has ALL required equipment. No requirement = every room matches.
 *  Blocked rooms are NOT removed here: they match on capacity/equipment and report "Room is blocked" when checked (F3). */
export function filterRooms(rooms: readonly Room[], req: RoomRequirements): Room[] {
  return rooms.filter((room) => {
    const enoughSeats = req.attendees === null || room.capacity >= req.attendees;
    const hasAllEquipment = req.equipment.every((item) => room.equipment.includes(item));
    return enoughSeats && hasAllEquipment;
  });
}

/** Text from the attendees field -> a whole number >= 1, or null (empty or invalid = no capacity requirement). */
export function parseAttendees(text: string): number | null {
  if (text.trim() === '') return null;
  const value = Number(text);
  return Number.isInteger(value) && value >= 1 ? value : null;
}
