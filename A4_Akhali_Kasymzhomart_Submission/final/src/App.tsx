import { NOW_MINUTES } from '@/domain/constants';
import { ROOMS } from '@/data/rooms';
import { useRoomSearch } from '@/hooks/useRoomSearch';
import { useAvailabilityForm } from '@/hooks/useAvailabilityForm';
import { AppHeader } from '@/components/AppHeader';
import { AvailabilityForm } from '@/components/AvailabilityForm';
import { BlockedBadge } from '@/components/BlockedBadge';
import { EmptyState } from '@/components/EmptyState';
import { ResultCard } from '@/components/ResultCard';
import { RoomFilters } from '@/components/RoomFilters';
import { RoomList } from '@/components/RoomList';
import { RoomPanel } from '@/components/RoomPanel';

function App() {
  const search = useRoomSearch(ROOMS);
  const room = search.selectedRoom;
  const form = useAvailabilityForm(room, NOW_MINUTES);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <AppHeader />
        <RoomFilters
          attendeesText={search.attendeesText} attendeesInvalid={search.attendeesInvalid}
          equipment={search.equipment}
          matchCount={search.matches.length} totalRooms={search.totalRooms}
          onAttendeesChange={search.setAttendeesText} onToggleEquipment={search.toggleEquipment}
        />
        {room === null ? (
          <EmptyState onClear={search.clearFilters} />
        ) : (
          <>
            <RoomList rooms={search.matches} selectedId={room.id} onSelect={search.selectRoom} />
            <RoomPanel
              name={room.name} nowMinutes={NOW_MINUTES} bookings={room.bookings}
              toolbar={room.blocked ? <BlockedBadge /> : undefined}
            />
            <AvailabilityForm
              start={form.start} end={form.end}
              startMinutes={form.startMinutes} endMinutes={form.endMinutes}
              canCheck={form.canCheck}
              onStartChange={form.setStart} onEndChange={form.setEnd}
              onCheck={form.check} onReset={form.reset}
            />
            {form.result && <ResultCard result={form.result} roomName={room.name} />}
          </>
        )}
        <footer className="mt-8 text-center text-xs text-slate-400">
          This tool only checks availability. It does not create, save, or confirm any booking.
        </footer>
      </div>
    </div>
  );
}

export default App;
