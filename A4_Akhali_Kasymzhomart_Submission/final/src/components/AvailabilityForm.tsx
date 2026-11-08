import { Check } from 'lucide-react';
import { TimeField } from './TimeField';

type Props = {
  start: string;
  end: string;
  startMinutes: number | null;
  endMinutes: number | null;
  canCheck: boolean;
  onStartChange: (text: string) => void;
  onEndChange: (text: string) => void;
  onCheck: () => void;
  onReset: () => void;
};

export function AvailabilityForm(p: Props) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Check availability</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TimeField id="start" label="Start (minutes after midnight)" placeholder="e.g. 540"
          value={p.start} minutes={p.startMinutes} onChange={p.onStartChange} />
        <TimeField id="end" label="End (minutes after midnight)" placeholder="e.g. 660"
          value={p.end} minutes={p.endMinutes} onChange={p.onEndChange} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={p.onCheck}
          disabled={!p.canCheck}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check className="h-4 w-4" />
          Check availability
        </button>
        <button
          type="button"
          onClick={p.onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
