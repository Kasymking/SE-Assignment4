import { useMemo, useState } from 'react';
import { Clock, DoorClosed, DoorOpen, Lock, Unlock, Check, X } from 'lucide-react';
import { canBook, type Booking, type CheckResult } from '@/lib/canBook';

const NOW = 540;
const EXISTING_BOOKINGS: Booking[] = [{ start: 600, end: 660 }];
const ROOM_NAME = 'Room B-204';

function toHHMM(min: number): string {
  if (Number.isNaN(min) || min === null || min === undefined) return '--:--';
  const clamped = Math.max(0, Math.min(1440, min));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function App() {
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [blocked, setBlocked] = useState<boolean>(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  const startNum = start === '' ? null : Number(start);
  const endNum = end === '' ? null : Number(end);

  const startValid = startNum !== null && Number.isInteger(startNum);
  const endValid = endNum !== null && Number.isInteger(endNum);

  const canCheck = startValid && endValid;

  const handleCheck = () => {
    if (!canCheck) return;
    const res = canBook(startNum!, endNum!, NOW, blocked, EXISTING_BOOKINGS);
    setResult(res);
  };

  const handleReset = () => {
    setStart('');
    setEnd('');
    setBlocked(false);
    setResult(null);
  };

  const resultLabel = useMemo(() => {
    if (!result) return null;
    return result.ok ? 'AVAILABLE' : 'UNAVAILABLE';
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* Header */}
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

        {/* Room card */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-semibold">{ROOM_NAME}</h2>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>
                  Current time:{' '}
                  <span className="font-medium text-slate-700">
                    {NOW} min ({toHHMM(NOW)})
                  </span>
                </span>
              </div>
            </div>

            {/* Demo toggle */}
            <button
              type="button"
              onClick={() => { setBlocked((b) => !b); setResult(null); }}
              aria-pressed={blocked}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                blocked
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {blocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              Room blocked: {blocked ? 'On' : 'Off'}
            </button>
          </div>

          {/* Existing bookings */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Existing bookings (read-only)
            </h3>
            <ul className="mt-2 space-y-1.5">
              {EXISTING_BOOKINGS.map((b) => (
                <li
                  key={`${b.start}-${b.end}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="font-medium text-slate-700">
                    {b.start}-{b.end}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">
                    {toHHMM(b.start)}–{toHHMM(b.end)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Input form */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Check availability</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Start */}
            <div>
              <label htmlFor="start" className="mb-1 block text-sm font-medium text-slate-700">
                Start (minutes after midnight)
              </label>
              <input
                id="start"
                type="number"
                inputMode="numeric"
                min={0}
                max={1440}
                value={start}
                onChange={(e) => { setStart(e.target.value); setResult(null); }}
                placeholder="e.g. 540"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
              <p className="mt-1 text-xs text-slate-500">
                {startValid ? `Hint: ${toHHMM(startNum!)}` : 'Enter a whole number 0–1440'}
              </p>
            </div>

            {/* End */}
            <div>
              <label htmlFor="end" className="mb-1 block text-sm font-medium text-slate-700">
                End (minutes after midnight)
              </label>
              <input
                id="end"
                type="number"
                inputMode="numeric"
                min={0}
                max={1440}
                value={end}
                onChange={(e) => { setEnd(e.target.value); setResult(null); }}
                placeholder="e.g. 660"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
              <p className="mt-1 text-xs text-slate-500">
                {endValid ? `Hint: ${toHHMM(endNum!)}` : 'Enter a whole number 0–1440'}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={!canCheck}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-4 w-4" />
              Check availability
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Result */}
        {result && resultLabel && (
          <section
            className={`rounded-2xl border p-5 shadow-sm ${
              result.ok
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  result.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {result.ok ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </div>
              <div>
                <p
                  className={`text-lg font-bold tracking-wide ${
                    result.ok ? 'text-emerald-800' : 'text-red-800'
                  }`}
                >
                  {resultLabel}
                </p>
                <p
                  className={`mt-0.5 text-sm ${
                    result.ok ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {result.ok
                    ? 'This time slot is free. No booking was made.'
                    : result.reason}
                </p>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          This tool only checks availability. It does not create, save, or confirm any booking.
        </footer>
      </div>
    </div>
  );
}

export default App;
