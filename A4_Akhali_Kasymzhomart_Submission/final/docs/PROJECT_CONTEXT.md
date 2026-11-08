# Project context (given to the AI assistant before planning)

## What the project is
Smart Campus Room Availability Checker: a one-page React + TypeScript + Vite + Tailwind app.
Starting point = Assignment 3 final prototype (Bolt.new Version 4), git tag `a3-baseline`.
Fictional data only. No login, payments, live APIs or database.

## Repository map (baseline, 311 lines of source)
| File | Lines | Responsibility today |
|------|-------|----------------------|
| `src/main.tsx` | 10 | Mounts `<App />` |
| `src/App.tsx` | 242 | EVERYTHING in the UI: constants (`NOW`, `EXISTING_BOOKINGS`, `ROOM_NAME`), helper `toHHMM`, component `App` (state, parsing, validation, handlers, all markup) |
| `src/lib/canBook.ts` | 56 | Pure rule function `canBook(start, end, now, blocked, existing)` -> `{ok:true}` or `{ok:false, reason}` |
| `src/index.css` | 3 | Tailwind directives |
| `package.json` | - | scripts: dev, build, lint, typecheck. No test script. Unused dep `@supabase/supabase-js` |

## Acceptance criteria that must keep working (AC1-AC6)
- AC1: 0 <= start < end <= 1440, integer minutes, start strictly after now (now = 540).
- AC2: duration <= 120 (exactly 120 allowed, 121 rejected).
- AC3: blocked room rejects every request.
- AC4: overlap with an existing booking is rejected; touching endpoints is NOT an overlap.
- AC5: clear AVAILABLE / UNAVAILABLE result (text + icon); booking data is never modified.
- AC6: understandable messages; usable at 360 px width.
Known behavior from Assignment 3 fixes: editing an input or the blocked toggle clears the old result; a blocked room reports "Room is blocked" before any other message.

## New requirements (Assignment 4)
- F1 capacity >= requested attendees. F2 room must have ALL selected equipment. F3 blocked room is never reported available.
- F4 clear empty state when no room matches. F5 changing the selected room refreshes the result appropriately.
- At least 4 fictional rooms, each with id, name, capacity, equipment list, blocked status and its own bookings.
- The availability check must use the chosen room's bookings only.

## Constraints
- Extend the working app; do not rewrite it from scratch. One change at a time; run tests and review the diff after each change.
- Keep AC1-AC6 behavior identical. Keep the current visual style, responsive down to 360 px.
- No new runtime dependencies. Dev-only test tooling is allowed.
- No credentials or private data are shared with any tool.
