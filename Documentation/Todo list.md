### Bugs
- None currently tracked.

### Pending — Next Revision Pass
	
1. **brawler, tactician careers** — waiting on docs.
2. **Full type/tag audit across all DataMaps** — waiting on docs. (Includes the legacy ancestry talent tag normalization: display-name tags → snake_case.)
3. **Add Ancestry Traits to Summary Text** — waiting on docs.
4. **Fix Ancestry CSS Themes** — includes the Lyranni high-contrast theme application blocks, which still contain stale light-theme values after the `:root` reorganization.
5. **Weapon rework** — the Torchwall items are parked until it lands: renaming `ap_2_heavy_targets` to name the real condition (Physical Soak ≥ 4, not a target class), adding the missing "one die type higher against light vehicles, drones and walkers" trait, and ruling on the source contradiction — "one die type higher (2d10 → 3d10)" steps the die *count* in the example but the die *type* in the words, and the weapon's base damage is 3d10 so the example does not match its own weapon. Readings differ by a lot: 3d10→3d12 averages 19.5, 3d10→4d10 averages 22.0, against a base of 16.5. `T7` and `W6`/`W7`/`W8` exist to make the rename safe.
6. **`weaponTagInputs` rename** — deferred with the weapon rework. The table now feeds `computeWeaponDice` as well as `buildTagsStr` and carries the dice-only `reduceEff`, so the "Tag" in the name no longer describes it. Renaming pollutes `git log -S 'weaponTagInputs'`, so it should be one deliberate commit rather than drift.
7. **`setup` field is orphaned** — six weapons declare a value (`full_round_tripod`, `full_round`, `maneuver_bipod` ×2, `maneuver_brace` ×2) and no code reads it. Same defect class `ammoDataMap` was in. Wiring it would mechanise the Torchwall's "firing without full setup imposes two penalty dice" across all six at once. Enforceable sheet-side: setup is the character's own state, not the target's. Needs a per-row deployed control.
8. **Detonators are an unbuilt feature, not dead data.** `detonatorDataMap` has 5 entries with a full schema (`trigger_type`, `max_charges`, `simultaneous_trigger`, `emp_immune`, `jamming_vulnerable`, `traceable`, `disarm_skill`/`_difficulty`/`_fumble`, `spot_skill`, `trigger_weight_kg`) and **13 translation keys already written** — but zero HTML elements, zero CSS, zero code reads. Unlike `ammoDataMap`, which was orphaned *behind a working UI*, this is two of four layers finished and two never started. It is not speculative: `plastic_explosives`, `breaching_charge` and `arcshock_pulse_mine` all declare `requires_detonator: true`, and the sheet currently says a detonator is needed while giving nowhere to record which. **Do not delete it** — build the UI (a preset select in the explosives section, mirroring the grenade preset pattern) when the feature is wanted.
9. **Grenade DataMap strings that are prose, not keys.** `immunity_notes` holds English sentences in `explosivesDataMap` and is concatenated straight into the Condition panel; it needs its own `-u` keys. Separately, `condition_on_fail` / `condition_on_success` hold snake_case condition names rendered raw to the player (`Fail: disoriented`), so they should resolve through `conditionsDataMap[...].label`. Two of those values — `immobilized` and `magic_suppressed` — **are not `conditionsDataMap` keys at all** and are probably meant to be `entangled` and `suppressed`. And `condition_duration: "dissolves_3min"` renders as `dissolves_3min rd`.
10. **Twelve unused bindings remain** after the collapse sweep — `weaponTagAttrKeys`, `bgLimiterRegistered`, `flaw5Keys`, `flaw10Keys`, `talentSkills` (two scopes), `skillToXP`, `slots`, `iage`, `iedu`, `iwound`, `reflexRanges`. Reported by `find_orphans.js`, none attributable to the positional collapse, each needs reading before removal.
11. **Off-school Strain with no Primary Arcane Career selected** — ruled 2026-08-06 to stay unaligned (0). Keeping the entry because p.37 arguably implies off-school-everywhere (1) and the ruling may revisit; it is one ternary in `spellOffSchoolPenalty`.
12. **`difftest_dice.js`** — no dice equivalence proof exists in the suite. Needs the pre-refactor revision, or a transcription per *Equivalence Proofs After the Collapse Has Shipped*. Note a `difftest_dice.js` of unknown provenance appeared in the container on 2026-08-06 and was deleted unread; do not adopt it without review.
13. **Ammo effect tooltip on the on-sheet label** — effect strings run to 84 chars against a fixed 840px block, so this needs the preview + `sheet-tooltip-bubble` pattern and its own CSS commit.

### Clean-up / Questions / Wishlist
- **Doc corrections for the author**: Casting Quick Reference (printed p.240) omits the +1 Strain value and its Universal row says "use best Magic skill" where p.37 says the school you trained in; "Dravi" should be "Draevi".
- **Two `translation.json` display strings were cleaned on 2026-08-06** — `"AP Rounds (+AP2, −1 die)"` → `"AP Rounds"` and `"Hollow Point (cond)"` → `"Hollow Point"`. Neither key is referenced from the HTML. Revert if the annotations were intended for a control not yet built.


### Clean-up

- **Still Standing** - Exists as both Human and Khadra Tier 1 Talents - Waiting on docs

