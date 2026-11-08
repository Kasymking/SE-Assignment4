export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <section role="status" className="mb-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <h2 className="text-lg font-semibold">No rooms match your requirements</h2>
      <p className="mt-1 text-sm text-slate-500">
        Try a smaller group or remove some of the required equipment.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Clear filters
      </button>
    </section>
  );
}
