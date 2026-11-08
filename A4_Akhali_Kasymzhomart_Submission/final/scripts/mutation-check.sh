#!/usr/bin/env bash
# Plants one deliberate defect at a time and checks that the test suite notices it.
cd "$(dirname "$0")/.."
run() { # name, file, sed-expression
  local name="$1" file="$2" expr="$3"
  cp "$file" /tmp/orig.bak
  sed -i "$expr" "$file"
  if cmp -s "$file" /tmp/orig.bak; then echo "MUTATION NOT APPLIED: $name"; return; fi
  out=$(npx vitest run 2>&1 | sed 's/\x1b\[[0-9;]*m//g')
  failed=$(echo "$out" | grep -E "^ +Tests " | head -1)
  if echo "$out" | grep -qE "Tests .*failed"; then verdict="DETECTED"; else verdict="MISSED"; fi
  echo "[$verdict] $name -> $failed"
  cp /tmp/orig.bak "$file"
}
run "M1 capacity uses > instead of >=" src/domain/filter.ts 's/room.capacity >= req.attendees/room.capacity > req.attendees/'
run "M2 equipment uses some() instead of every()" src/domain/filter.ts 's/req.equipment.every(/req.equipment.some(/'
run "M3 overlap test uses <= (touching rejected)" src/domain/rules.ts 's/start < b.end \&\& end > b.start/start <= b.end \&\& end >= b.start/'
run "M4 duration limit off by one (>= 120)" src/domain/rules.ts 's/end - start > MAX_DURATION/end - start >= MAX_DURATION/'
run "M5 blocked flag ignored in the check" src/hooks/useAvailabilityForm.ts 's/room.blocked, room.bookings/false, room.bookings/'
run "M6 check always uses the FIRST room bookings" src/hooks/useAvailabilityForm.ts 's/room.blocked, room.bookings/room.blocked, ROOMS0/; s#^import { canBook }#import { ROOMS as ROOMS_ } from "@/data/rooms";\nconst ROOMS0 = ROOMS_[0].bookings;\nimport { canBook }#'
