# Smart Campus Room Availability Checker (Assignment 4)

One-page React + TypeScript + Vite + Tailwind app. It checks whether a time slot is free in one of five fictional rooms.
Rooms can be filtered by number of attendees and required equipment. Nothing is saved, and there is no login, payment, API or database.

Starting point: a Bolt.new React/TypeScript prototype of the same product, an equivalent reconstruction of the Assignment 3 prototype (git tag `a3-baseline`; see the report, section 1.0). This version: git tag `final`.

## Setup, run, test
Requires Node.js 20 or newer (tested with Node 22).

```bash
npm install          # install dependencies
npm run dev          # start the app at http://localhost:5173
npm test             # run all automated tests once (63 tests)
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run build        # production build into dist/
```

Extra checks used for the report (optional):
```bash
bash scripts/mutation-check.sh                 # plants 6 deliberate bugs one by one; every one must be detected by the tests
node scripts/measure.mjs .                     # counts files, lines and duplicated rule copies of the current tree
git archive a3-baseline | tar -x -C /tmp/a3 && node scripts/measure.mjs /tmp/a3   # same measures for the baseline
```

## What the app does
- Filter by attendees (room capacity must be >= attendees) and by equipment (the room must have ALL ticked items).
- The list shows only matching rooms; if none match, a clear empty state explains what to change.
- Select a room, enter Start and End (minutes after midnight, current time is fixed at 540 = 09:00) and press "Check availability".
- The answer uses only the selected room's own bookings. Changing the selected room refreshes the answer for the same times.
- A blocked room is tagged and is never reported as available.
- All Assignment 3 rules still apply: valid whole-minute times, start after now, 120-minute maximum, overlap rejected, touching allowed, bookings never modified.

## Project structure
```
src/
  domain/        pure TypeScript, no React
    constants.ts   NOW_MINUTES, DAY_MINUTES, MAX_DURATION (the only place these numbers are written)
    types.ts       Booking, Room, CheckResult, RoomRequirements
    rules.ts       canBook(): availability rules AC1-AC5 for ONE room
    filter.ts      filterRooms() (F1, F2) and parseAttendees()
    time.ts        formatHHMM(), parseWholeMinutes()
  data/rooms.ts    fictional catalog: 5 rooms + equipment options
  hooks/           useRoomSearch (filters, selected room), useAvailabilityForm (times, derived result)
  components/      presentational pieces: AppHeader, RoomFilters, RoomList, EmptyState, RoomPanel, BookingList,
                   AvailabilityForm, TimeField, ResultCard, BlockedBadge, EquipmentTags
  App.tsx          composes hooks and components (56 lines)
docs/              PROJECT_CONTEXT.md, PLAN.md (written before editing code), evidence/ (saved test runs)
scripts/           mutation-check.sh, measure.mjs
```

## Tests
`npm test` runs Vitest with Testing Library (jsdom). 63 tests in 5 files:
`src/domain/rules.test.ts` (AC1-AC5, 20 cases + immutability), `src/domain/filter.test.ts` (F1, F2, F3, attendees parsing),
`src/data/rooms.test.ts` (catalog integrity), `src/App.test.tsx` (Assignment 3 UI behavior), `src/App.integration.test.tsx` (F1-F5 through the real UI).

## Git history
Each step of the plan is one commit with a tag (`a3-baseline`, `step1-safety-net`, ..., `final`). `git log --oneline` shows them,
and `docs/evidence/` holds the test output saved after each step.
