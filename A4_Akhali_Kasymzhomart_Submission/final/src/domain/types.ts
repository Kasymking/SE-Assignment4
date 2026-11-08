export type Booking = { readonly start: number; readonly end: number };

export type CheckResult =
  | { ok: true }
  | { ok: false; reason: string };

export type EquipmentId = 'projector' | 'whiteboard' | 'video-conference' | 'computers';

/** One room of the fictional catalog. Bookings belong to the room and are read-only. */
export type Room = {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly equipment: readonly EquipmentId[];
  readonly blocked: boolean;
  readonly bookings: readonly Booking[];
};

/** What the user asks for. attendees = null means "no capacity requirement". */
export type RoomRequirements = {
  readonly attendees: number | null;
  readonly equipment: readonly EquipmentId[];
};
