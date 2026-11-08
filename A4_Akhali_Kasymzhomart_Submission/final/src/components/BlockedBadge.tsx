import { Lock } from 'lucide-react';

export function BlockedBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
      <Lock className="h-4 w-4" />
      Room blocked
    </span>
  );
}
