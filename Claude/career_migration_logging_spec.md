# Career talent migration: Change Log design

Status: agreed in principle 2026-11-25. Not built. Depends on the retired-talent ruling (still open).

## Rulings feeding this spec
- Career removal does NOT auto-clean. Clear Inactive Careers stays manual (ruled 2026-11-25). It is the accidental-removal safety net: re-adding a career restores its ticked talents.
- The Change Log exists (built 2026-11-25) and is where migration results are recorded.
- Still open: how survivors are handled (refund only / auto-untick / flag-don't-clamp). This spec defines only how the outcome is logged, whichever is chosen.

## Why the Clear button's row format is not reused
`cleanupInactiveCareers` writes one row per career listing every cleared talent name. A fully ticked career can name about 25 talents, which wraps to roughly ten tooltip lines at the 380px bubble. The preview already leads with the count, but the tooltip is hard to scan.

## Row design
1. One row per career AND outcome. Outcomes: Refunded (talent retired), Unticked (prerequisite lost or locker removed), Kept and flagged (only if flag-don't-clamp is chosen). The count and the reason lead each row.
2. Names grouped by tier in the detail: `Tier 1: A, B / Tier 2: C`.
3. No hidden names. If one outcome exceeds about 8 names, split into a further row for the same career. Never write "and N more".
4. All migration rows are By Sheet, with a "Migrated" tag in the detail, so they are distinguishable from a player's manual Clear.
5. One summary row per sheet: "Migrated to 3.X", with totals (refunded, unticked, flagged) and the date. The per-career rows follow it.
6. Only what changed for that character is logged. The tree is never listed in full. Careers the character does not hold write nothing.

## Cap interaction (decision pending)
`CHANGELOG_MAX_ROWS` is 300 and pruning drops the oldest rows by stored timestamp. A migration is bursty and could push out older player history on a nearly full log. Options: raise the cap while the migration runs (author's lean, because exempt rows would live forever), or exempt migration rows from pruning. Confirm before building.

## Idempotence and gating
- The migration must be idempotent by construction (nothing left to change on a second open), so a re-run writes no rows.
- Migration rows are written with `opts.always`, bypassing the creation-lock gate, because a character still in creation can be migrated too.

## Tests required when built
- A character with a fully ticked retired career writes the summary row plus per-outcome rows, with no row over the name cap.
- A second run writes nothing.
- Migration rows carry By Sheet and the Migrated tag.
- Rows are written with the lock off and the opt-in unticked.
- Pruning cannot drop the summary row of the migration that just ran.
