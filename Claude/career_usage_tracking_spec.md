# Career talent usage tracking — shared-use groups and use counters

Status: built 2026-11-26 (tracker only), revised the same day to put the checkbox back on counted talents. Awaiting Roll20 sandbox confirmation. The Strain ruling and the data swap are migration work and are deliberately not part of this change.

## Why

The new career trees (`Source/GoA_Talent_Trees.json`) use 17 distinct `usage` strings. The sheet tracks only Scene, Session and Long Rest. 23 talents fit none of them, and 10 of those cost Strain. Strain is deducted only when a tracker control changes, so a talent with no control never costs Strain.

## Rulings (Kameron, 2026-11-26)

1. Table-adjudicated, no control: Veil-Sign, Steady Channel, Bonded Construct, Workshop Wisp, the secondary effects on Crimson Cascade and Cultural Gravity, Instinctive Partnership, Momentum Slice.
2. Stormweaver channels: one shared use per scene. A character may own any subset; if they own two or more, ticking one marks the others used.
3. Per-target talents (Resonant Patch, Emergency Restart): a counter after the talent name, incremented once per use.
4. Per-turn and per-round Strain talents: the same counter, and incrementing it applies the Strain.
5. The Strain ruling is a migration task, not a tracker task. The tracker is built first and charges per use by default.
6. Counter layout (after the first screenshot): the row keeps its checkbox. Ticking it moves the counter from 0 to 1 and rolls Strain; the player raises the counter from there.

## Data schema (additive, on any talent/trait entry that already carries `usage_limit`)

| field | values | meaning |
|---|---|---|
| `usage_limit` | `"scene"`, `"session"`, `"long_rest"` (unchanged) | When the control resets. A counter still needs a cadence: it clears with Clear Scene / Clear Session / Full Rest. |
| `usage_tracker` | `"counter"` | The row carries a use count beside its checkbox. Omitted means checkbox alone. |
| `usage_group` | string key | Talents under the same owner (career or ancestry) with the same key share one use. |

Attrs: the checkbox keeps its name, `used_<cadence>_<owner>_<talent>`, so `getUsageLimitedTalentNames`, `lookupTalentData`, the clear handlers and the Strain worker reach it unchanged. A counted talent adds a number attr, `used_<cadence>_<owner>_<talent>_uses`. The count is watched but is not a tracked box: it is not in `allTrackerAttrs` or `getUsageLimitedTalentNames`, so Clear Scene / Clear Session never write it directly.

Generator mapping (for the data swap):

| JSON `usage` | `usage_limit` | extra |
|---|---|---|
| `1/Scene` | `scene` | |
| `1/Session` | `session` | |
| `1/Scene, shared across channels` | `scene` | `usage_group: "channels"` |
| `1/Scene per target` | `scene` | `usage_tracker: "counter"` |
| `1/Turn`, `1/Round`, `Once on each of your turns`, `Once on your turn`, `Once per turn`, `At-will / 1/Turn` | `scene` | `usage_tracker: "counter"` only where the talent costs Strain; otherwise untracked |
| `At-will` with Strain | `scene` | `usage_tracker: "counter"` |
| everything else in ruling 1 | none | untracked |

The original `usage` string should be kept alongside the mapped value so the mapping loses no information.

## Behaviour

Counter:
- Ticking the box is the first use. The count becomes 1 (written silently, so the count's own handler does not charge it again) and Strain is charged once through the existing path.
- Raising the count from n to m charges (m - n) uses and posts one chat line (`×N` when N > 1; a dice Strain is rolled N times and summed).
- Lowering the count, an equal value, an emptied field and a non-number deduct nothing and refund nothing, which matches unticking a checkbox.
- Unticking the box, or Clear Scene / Clear Session, zeroes the count with no refund. The next scene's first tick charges again and restarts at 1.
- If Strain is 0 the use is blocked. A blocked tick resets the box to 0 (which zeroes the count); a blocked step restores the previous count and leaves the box ticked.
- The count is hidden by CSS until the box is checked (`input.sheet-tracker-checkbox:checked ~ input.sheet-tracker-counter`), `min="1"`.
- `cleanupInactiveCareers` writes silently, so it zeroes each counted talent's count itself.

Shared group: ticking one member silently ticks the other members; unticking any member silently unticks all. Writes are silent so propagated ticks cost nothing and post no chat lines. Only the member the player ticked pays Strain. Propagation is skipped while `clearing_tracker` is set, and a blocked tick resets the ticked member to 0, which propagates the untick. A talent is a counter or a group member, not both (validated).

Neither control enforces the rule it records: a counter cannot tell a new target from a repeated one or a new turn from the same turn. It is a Strain ledger and a reminder.

## Implementation (2026-11-26)

- `usageGroupSiblings`: a constant built from the DataMaps (careers, ancestry talents and traits), mapping each grouped attr to its siblings. Declared after `getUsageLimitedTalentNames`.
- `trackerCounterAttrs`: the tracked boxes whose talent is `usage_tracker: "counter"`; their `_uses` attrs are appended to `trackerChangeEvent`.
- `handleTrackerStrainDeduction(attrName, opts)`: `opts.uses`, `opts.restore` and `opts.restoreAttr` (the attr to restore when blocked, default the box); the default call is unchanged.
- The one existing handler on `trackerChangeEvent` branches: a `_uses` change, a counted box, a grouped box, a plain box. No second handler was registered.
- Tracker HTML: a counted row is checkbox, label, then `<input type="number" class="sheet-tracker-counter" min="1">` named `attr_used_<cadence>_..._uses`.

## Pilot

Arcane Gunslinger's Disruptive Round (Strain `1d4`, previously no usage limit and therefore never charged) is the one live counter, so the control can be seen in Roll20 before the data swap. It is a data change to a talent the swap will replace: revert by setting `usage_limit: ""` and removing `usage_tracker`, then removing its tracker row. No talent on the current sheet shares a usage group, so the group mechanism is covered by tests only until the Stormweaver channels arrive with the swap.

## Tests

`test_usage_tracking.js`: data validity (D), HTML/CSS lockstep (L), counter behaviour (C), unchanged checkbox behaviour (B), group behaviour (G) and wiring (W). Synthetic grouped and counted talents are injected into a copy of the worker because the group index and the event list are computed at load. Negative-tested with 21 mutants. The one unobservable mutant is removing the `clearing_tracker` guard from group propagation: the end state is the same with or without it, so only Roll20 timing could show a difference. The cleanup-counts check (W6) is static, because `cleanupInactiveCareers` needs a full career selection to execute.

The lockstep check is strict for career talents (zero gaps today) and for any counted or grouped talent. For every other tracked attr it asserts only that an HTML element exists, with one declared exception (`used_scene_alteri_social_resonance`). 33 ancestry, perk and background attrs have no `show_` input or CSS reveal rule today; that is pre-existing and not asserted.

## Open

Whether Strain is charged per use or once per scene for these talents is a Strain-ruling question and belongs to the migration. The counter charges per use by default.
