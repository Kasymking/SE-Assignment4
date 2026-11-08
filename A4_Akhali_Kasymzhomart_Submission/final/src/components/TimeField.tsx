import { DAY_MINUTES } from '@/domain/constants';
import { formatHHMM } from '@/domain/time';

type Props = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  minutes: number | null; // parsed value, null while the text is empty or not a whole number
  onChange: (text: string) => void;
};

/** One labelled minutes input with its HH:MM hint. Used for both Start and End. */
export function TimeField({ id, label, placeholder, value, minutes, onChange }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={DAY_MINUTES}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
      <p className="mt-1 text-xs text-slate-500">
        {minutes !== null ? `Hint: ${formatHHMM(minutes)}` : `Enter a whole number 0–${DAY_MINUTES}`}
      </p>
    </div>
  );
}
