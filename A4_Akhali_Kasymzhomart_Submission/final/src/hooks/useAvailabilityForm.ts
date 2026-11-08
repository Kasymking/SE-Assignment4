import { useMemo, useReducer } from 'react';
import { canBook } from '@/domain/rules';
import { parseWholeMinutes } from '@/domain/time';
import type { CheckResult, Room } from '@/domain/types';

type State = { start: string; end: string; checked: boolean };
type Action =
  | { type: 'start'; text: string }
  | { type: 'end'; text: string }
  | { type: 'check' }
  | { type: 'reset' };

const INITIAL: State = { start: '', end: '', checked: false };

// Editing a time hides the old result in ONE place (checked = false).
// Switching room does not touch `checked`, so the result is simply re-derived for the new room (F5).
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start': return { ...state, start: action.text, checked: false };
    case 'end': return { ...state, end: action.text, checked: false };
    case 'check': return { ...state, checked: true };
    case 'reset': return INITIAL;
  }
}

export function useAvailabilityForm(room: Room | null, nowMinutes: number) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const startMinutes = parseWholeMinutes(state.start);
  const endMinutes = parseWholeMinutes(state.end);
  const canCheck = room !== null && startMinutes !== null && endMinutes !== null;

  // Derived from the CURRENT room and inputs: it uses this room's bookings and can never be stale.
  const result: CheckResult | null = useMemo(() => {
    if (!state.checked || room === null || startMinutes === null || endMinutes === null) return null;
    return canBook(startMinutes, endMinutes, nowMinutes, room.blocked, room.bookings);
  }, [state.checked, room, startMinutes, endMinutes, nowMinutes]);

  return {
    start: state.start, end: state.end,
    startMinutes, endMinutes, canCheck, result,
    setStart: (text: string) => dispatch({ type: 'start', text }),
    setEnd: (text: string) => dispatch({ type: 'end', text }),
    check: () => { if (canCheck) dispatch({ type: 'check' }); },
    reset: () => dispatch({ type: 'reset' }),
  };
}
