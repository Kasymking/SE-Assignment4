# Baseline analysis and improvement plan (written BEFORE any code was edited)

## 1. Baseline record (commit a3-baseline)
Commands run: `npm run build` (ok, 1565 modules), `npm run typecheck` (ok), `npm run lint` (ok), `wc -l` on source (311 lines),
`npx jscpd@4 src --min-lines 4 --min-tokens 30` (0 exact clones: the copies below differ in identifiers, so a token-based tool does not see them).
No automated tests exist in the project; Assignment 3 behavior was checked by a separate probe script and by hand.

## 2. Maintainability risks (with file/function references)
| # | Risk | Where (baseline) | Why it hurts the new feature | Priority |
|---|------|------------------|------------------------------|----------|
| R1 | One 225-line component mixes state, parsing, validation, handlers and all markup | `src/App.tsx` function `App` (lines 17-242) | Multi-room filtering would add more state and JSX to the same function; nothing can be tested in isolation | High |
| R2 | The single room is hard-coded at module level | `src/App.tsx` lines 5-7 (`NOW`, `EXISTING_BOOKINGS`, `ROOM_NAME`) | No Room type, no catalog, and the bookings passed to `canBook` come from one global constant, so a second room cannot exist | High |
| R3 | "Clear the old result" is copy-pasted by hand | `setResult(null)` at `App.tsx` lines 41, 89, 144, 165; result stored as state | Assignment 3 bug I2 was a missing copy. Selecting a room adds a fifth source of staleness (F5) | High |
| R4 | Duplicated parsing and validation | `startNum/endNum/startValid/endValid` (lines 23-27); two near-identical input blocks (lines 132-151 and 153-172); `Number.isInteger` also in `canBook.ts` line 21 | Every rule change must be made in several places | Medium |
| R5 | Magic numbers repeated in several files | `1440` in `canBook.ts` lines 7 and 34, `App.tsx` lines 11, 142, 149, 163, 170; `120` in `canBook.ts` lines 8 and 45 | A limit change can leave the UI and the rule out of sync | Medium |
| R6 | Result card duplicates the ok/error branch six times | `App.tsx` lines 199, 207, 210, 215, 222, 225 | New result kinds (e.g. "no room selected") would multiply the ternaries | Medium |
| R7 | Dead dependency and no test tooling | `package.json` (`@supabase/supabase-js` unused; no test script); `toHHMM` line 10 null check on a `number` | Unused dependency widens the attack surface; no safety net for refactoring | Low |

## 3. Prioritized plan (small steps, one commit each, tests run after every step)
1. **Safety net first.** Add Vitest + Testing Library (dev dependencies only). Write characterization tests for the existing behavior (AC1-AC5 rule cases, plus UI behavior such as the stale-result and blocked-first fixes) and run them against the UNCHANGED code. Addresses R7.
2. **Extract the domain layer** (`src/domain/`): types, rules (`canBook`, constants, message text), time helpers. Behavior must not change. Addresses R5, part of R4.
3. **Split the UI into components + one state hook** (`useAvailabilityForm`, result derived from state instead of stored). Still one room; the characterization tests must still pass. Addresses R1, R3, R4, R6.
4. **Add the room catalog and filtering logic** (`src/data/rooms.ts` with 5 fictional rooms, `src/domain/filter.ts`), with unit tests for F1, F2 and data integrity. Addresses R2.
5. **Add the filter UI, room list, room switching and empty state** (F4, F5), with integration tests (Testing Library) and a browser check.
6. **Clean-up and evidence**: remove the unused dependency, README, measurements, before/after diagram.

## 4. Design decisions made up front
- **D1 - result is derived, not stored.** The UI keeps only "a check was requested" plus the current inputs and room; the result is computed from them. Switching room therefore refreshes the result automatically (F5) and a stale result cannot happen.
- **D2 - blocked rooms stay visible.** Filtering uses only the user's requirements (capacity, equipment). A blocked room that matches is shown with a "Blocked" tag and the check reports "Room is blocked" (F3, AC3).
- **D3 - no state library.** `useReducer` in one hook is enough for four fields; Redux or Zustand would add a dependency for no benefit.
- **D4 - keep `canBook(start, end, now, blocked, existing)` signature.** It is the contract tested since Assignment 3; the room is passed in by the caller, so the rule cannot read another room's bookings.

## 5. How quality will be measured (no invented metrics)
- Tests passed/total: output of `npm test`.
- Duplicated logic locations: count of independent copies of the same rule, found with the grep commands in `scripts/measure.mjs`, run on the baseline commit and on the final commit; jscpd result reported too.
- Structure: number of source files/components and their one-line responsibilities, taken from the file tree and the largest-file line counts.
