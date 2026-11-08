import { Check, X } from 'lucide-react';
import type { CheckResult } from '@/domain/types';

// One table instead of six ok/error ternaries: a new kind of result is one new entry.
const LOOK = {
  available: {
    box: 'border-emerald-200 bg-emerald-50', badge: 'bg-emerald-600 text-white',
    title: 'text-emerald-800', text: 'text-emerald-700', label: 'AVAILABLE', Icon: Check,
  },
  unavailable: {
    box: 'border-red-200 bg-red-50', badge: 'bg-red-600 text-white',
    title: 'text-red-800', text: 'text-red-700', label: 'UNAVAILABLE', Icon: X,
  },
} as const;

export function ResultCard({ result, roomName }: { result: CheckResult; roomName: string }) {
  const look = result.ok ? LOOK.available : LOOK.unavailable;
  const message = result.ok ? 'This time slot is free. No booking was made.' : result.reason;
  return (
    <section className={`rounded-2xl border p-5 shadow-sm ${look.box}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${look.badge}`}>
          <look.Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-lg font-bold tracking-wide ${look.title}`}>{look.label}</p>
          <p className={`mt-0.5 text-sm ${look.text}`}>{message}</p>
          <p className="mt-1 text-xs text-slate-500">Checked for {roomName}</p>
        </div>
      </div>
    </section>
  );
}
