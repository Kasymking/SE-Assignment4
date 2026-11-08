import type { EquipmentId, Room } from '@/domain/types';

// All data below is fictional. Times are minutes after midnight (600 = 10:00).
export const EQUIPMENT_OPTIONS: readonly { id: EquipmentId; label: string }[] = [
  { id: 'projector', label: 'Projector' },
  { id: 'whiteboard', label: 'Whiteboard' },
  { id: 'video-conference', label: 'Video conference' },
  { id: 'computers', label: 'Computers' },
];

export const ROOMS: readonly Room[] = [
  {
    id: 'b-204', name: 'Room B-204', capacity: 12,
    equipment: ['projector', 'whiteboard'], blocked: false,
    bookings: [{ start: 600, end: 660 }], // the single room of Assignment 3, unchanged
  },
  {
    id: 'a-101', name: 'Lecture Hall A-101', capacity: 120,
    equipment: ['projector', 'whiteboard', 'video-conference'], blocked: false,
    bookings: [{ start: 570, end: 690 }, { start: 780, end: 900 }],
  },
  {
    id: 'c-310', name: 'Computer Lab C-310', capacity: 30,
    equipment: ['projector', 'computers'], blocked: false,
    bookings: [{ start: 660, end: 780 }],
  },
  {
    id: 'd-015', name: 'Seminar Room D-015', capacity: 8,
    equipment: ['whiteboard'], blocked: false,
    bookings: [],
  },
  {
    id: 'e-402', name: 'Studio E-402', capacity: 20,
    equipment: ['projector', 'whiteboard', 'video-conference'], blocked: true, // closed for maintenance
    bookings: [{ start: 600, end: 660 }],
  },
];
