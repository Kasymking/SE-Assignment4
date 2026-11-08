import { DoorClosed } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
          <DoorClosed className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold leading-tight sm:text-2xl">
            Smart Campus Room Availability Checker
          </h1>
          <p className="text-sm text-slate-500">Check only — no bookings are created or saved.</p>
        </div>
      </div>
    </header>
  );
}
