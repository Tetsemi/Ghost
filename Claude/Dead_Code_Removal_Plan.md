# Todo 10 — Dead-code removal: procedure and test plan

Scope: Todo 10 ("Orphan sweep REVERTED"), re-done under the Todo's own rule — *each binding gets a rules/usage check before removal* — plus the orphan functions found in `Sheet_Workers.md`. I read "W10" as Todo 10; if you meant watcher W010 (`registerBackgroundTalentWatcher`), it contains no dead code (ESLint and the AST scan both report nothing in lines 68103–68111).

Everything below was run against **your 2026-10-15 upload** (`ghost_of_arcadia.html`, 79,254 lines, md5 `bc8a52a87b833546e2d9a73c441a33e3`), not the repo copy: the two differ, and the line numbers moved by about 3.

## 1. What is dead, and why it is safe

Thirteen declarations are unused locals or consts; eight more are orphan function-level declarations. Line numbers are in the upload.

| # | Binding | Line | Function | Why it is dead | Rules/usage gate |
|---|---|---|---|---|---|
| 1 | `bgLimiterRegistered` | 67242 | module | Superseded `Set`; `registerBackgroundSkillLimiterV2` guards on the boolean `BG_LIMITER_V2_REGISTERED` (67660). | Harness census: a second call registers 0 extra handlers. |
| 2–3 | `flaw5Keys`, `flaw10Keys` | 67549–50 | `registerFlawSummaryWatcher` | **Todo's "unfinished feature" note is out of date.** The +10 XP / two-selection lock *has shipped* inside the same function (`flawPicked`, `selFull`, `(xpGain + cost) > 10`, lines 67612–67624), and its comment says it "replaces a per-cost-band lock". | Answer to the Todo question *"does the flaw summary owe a per-tier point total?"* — no. Core Rules Step 9 caps the total, which is what `test_perk_flaw_limits.js` asserts. |
| 4–5 | `picked5`, `picked10` (flaw) | 67564–65, 67604–05 | same | Written (`++`), never read. **Not in the Todo**; `find_orphans.js` only sees `const`, so these `let`s were invisible to it. | Write-only. |
| 6–7 | `picked10`, `picked15` (perk) | 67409–10, 67456–57 | `registerPerkSummaryWatcher` | Same: write-only `let`s. | Write-only. |
| 8 | `talentSkills` | 67967 | `calculateAndUpdateSkillValues` | The live path is `talentBonus` (67994–), built from the same `${race}_${talentKey}_mdr_checkbox` values and *added into the skill total*. The list form is a leftover. | Answers *"is another path already applying them?"* — yes. `skillcalc/talents` scenario pins it. |
| 9 | `iage` | 73986 | `registerStatHandler` | Parsed, never read. `age` is a free-text field with no mechanic in code or `translation.json`. | See note A. |
| 10 | `iedu` | 73994 | same | Never read; `values.edu` is used directly (`rawStat`, language calc). | — |
| 11 | `iwound` | 73998 | same | `major_wounds` is a **computed output**: the handler writes it (`update["major_wounds"]`, the Major Wound threshold) and its input is `readonly` (HTML 378). Reading the prior value is meaningless. | — |
| 12 | `slots` | 70157 | `initWeaponComputedAttrs` | `computeModButtons(entry, …)` takes the entry, not the slot list. | `open/*` scenarios fix a handgun and a rifle row and **reach this line** (probe-verified). |
| 13 | `reflexRanges` | 74926 | `buildTagsStr` | Unused local. **Todo's rationale is wrong:** nothing reads `weaponModDataMap.reflex_sight.hit_bonus_range_limit`. The reflex range lives as a literal `["short","medium"]` in two places (`computeWeaponHit` 74841 and `buildTagsStr` 74939). Removal is behaviour-neutral. | See note B. |
| 14 | `applyAllSkillBonuses` | 73434 | — | No callers. Its only effect was `setDefaultTalentBonuses(race, {apply:false})`; `initializeRaceState` already does the live version. Holds the second `talentSkills`. | Zero references (AST + ESLint). |
| 15 | `getAllTalentSkills` | 73386 | — | Referenced only by #14. | Dies with #14. |
| 16 | `handleRaceChange` | 73875 | — | No callers. Its three steps are inlined at 70617–70627 (`applyRaceState` in `initializeSheetOnOpen`) and 77707–77710 (the `showracials` watcher). | Zero references. |
| 17 | `lastRaceHandled` | 67223 | module | Guard state for #16 only. | Dies with #16. |
| 18–20 | `removeExhaustedStatus`, `applyTiredStatus`, `removeTiredStatus` | 74668, 74680, 74706 | — | Zero callers. The live Exhausted/Tired logic is inline in the `change:strain` watcher (W111); only `applyExhaustedStatus` is still called (by `handleTrackerStrainDeduction`) and **stays**. | `status/strain-hp` scenario pins the live logic. |
| 21 | `computeWeaponAPTotal` | 75014 | — | No callers, and **broken**: it reads `entry.ap` with no `entry` in scope, so any call would throw. AP now flows through `ammoEffects` plus the `weaponDataMap.ap` field. | Zero references. |

**Note A — age.** I could not read the Core Rules PDF (it is not in the project docs), so I cannot confirm from the book that GoA has no age modifier. That question is about a possibly *missing feature*, not about this deletion: the parsed value is unused today, so removing it changes nothing either way. If the book does define an age rule, add it to the Todo as a feature; do not keep a dead local as a placeholder.

**Note B — reflex.** After #13 is gone the rule is still duplicated in code rather than driven by the DataMap. That is the same "rule as code shape" antipattern as the AP field; it belongs with the weapon rework (Todo 5), not here. The two literals are asserted as *retained* so this commit cannot silently disturb them.

**Deliberately not touched.** `detonatorDataMap` is the only other unused binding (ESLint and `find_orphans.js` both list it). Todo 8 says do not delete it. The `age`, `edu` and `major_wounds` entries stay in `registerStatHandler`'s `watched` array (Claude.md: *delete the local, not the watcher*). No CSS, `translation.json`, DataMap or `source: {}` is changed.

## 2. Tools

Both scripts are in the outputs next to this file; put them in `Check Scripts/`.

| File | Purpose |
|---|---|
| `apply_dead_code_removal.py` | Performs the deletions. Each block is located by an anchored regex, must match exactly once, must span the expected line count, and is pinned by SHA-256 of the removed text. If your file has drifted it aborts **without writing**. Checks bare LF = 0 and exact line accounting. `--pins` is a dry run. |
| `test_dead_code_removal.js` | Static inventory + differential behaviour test. Executes the whole worker under stub Roll20 globals (`setAttrs` fires `change:` handlers, honours `silent`). No dependencies. |
| ESLint 9 (optional) | `no-unused-vars` with `vars: "all"`. This is what found items 4–7. Config below. |

## 3. Procedure

Run phase 1 and phase 2 as **separate commits**, with a Roll20 sandbox check between them (Claude.md: wait for the result before stacking the next change; cleanup is not mixed with behaviour).

**Step 0 — confirm the base.** `ls -lt` uploads vs outputs; use the newer. Then:

```
node test_dead_code_removal.js ghost_of_arcadia.html --phase pre
```

Expect 39 `ok` lines and PASS. This proves the plan matches the file (every target present exactly once, every protected binding present). If it fails, stop; the file has changed since this plan was written.

**Step 1 — baseline.** From the *unmodified* file:

```
node test_dead_code_removal.js ghost_of_arcadia.html --phase pre --coverage --save baseline.json.gz
```

`--coverage` plants a probe before each of the 12 removal targets that has executable code and fails if any is never reached (a differential test that never executes the deleted line proves nothing). Expect 12 `reached` lines. The baseline is 85 KB; keep it out of the repo.

**Step 2 — phase 1 (locals and consts).**

```
python3 apply_dead_code_removal.py ghost_of_arcadia.html p1.html --phase 1
```

Expect `12 blocks, 29 lines`. (Line numbers it prints are after earlier deletions in the same run; ignore the offsets, trust the pins.)

**Step 3 — test phase 1.**

```
node test_dead_code_removal.js p1.html --phase post --scope phase1 --check baseline.json.gz
```

Expect PASS and every scenario `identical`. Then the existing suite (section 4, TC-30).

**Step 4 — commit 1**, replace the working file with `p1.html`, run the sandbox test S1 (section 5). Wait for the result.

**Step 5 — phase 2 (orphan functions).**

```
python3 apply_dead_code_removal.py ghost_of_arcadia.html p2.html --phase 2     # on the file that now contains phase 1
node test_dead_code_removal.js p2.html --phase post --check baseline.json.gz
```

Expect `8 blocks, 125 lines`, PASS. Then the existing suite again, then ESLint (below): the only remaining report must be `detonatorDataMap`.

**Step 6 — commit 2**, sandbox test S2.

ESLint check (run before and after):

```
npm i eslint@9
# eslint.config.js
module.exports=[{files:["**/*.js"],languageOptions:{ecmaVersion:2022,sourceType:"commonjs"},
  rules:{"no-unused-vars":["warn",{vars:"all",args:"none",caughtErrors:"none",ignoreRestSiblings:true}]}}];
sed -n '40477,79254p' ghost_of_arcadia.html > worker.js   # adjust the end line to the file
npx eslint worker.js
```

Before: 21 findings. After both phases: 1 (`detonatorDataMap`). ESLint does not chase chains, which is why `getAllTalentSkills` and `lastRaceHandled` only appear after their parents are gone; the harness's own static check covers both.

**Rollback.** Each phase is one script run on one file; reverting the commit restores it. Nothing writes to attrs, so no sheet data migrates and none needs repair.

## 4. Test cases

### Static (`test_dead_code_removal.js`, both phases)

| TC | Check | Pre | Post |
|---|---|---|---|
| 01 | Worker parses (`new Function`). | pass | pass |
| 02 | Each of 20 targets has exactly its expected declaration count (`picked10` expects 2). | present | **0** |
| 03 | No residual occurrence of any retired identifier in comment-stripped source. `slots` and the second `talentSkills` are exempt in phase 1 only. | — | 0 |
| 04 | None of the 7 retired functions is referenced anywhere after phase 2. | — | 0 |
| 05 | 18 protected bindings still present: `flawKeys` (≥4 uses), the `BG_LIMITER_V2_REGISTERED` guard (≥3), `"age"`, `"edu"`, `"major_wounds"` in the watched array, the `update["major_wounds"]` write, `talentBonus`, `setDefaultTalentBonuses`, `ensureRaceWatchers`, `initializeRaceState`, `detonatorDataMap`, `computeModButtons`, `closeRanges`, the reflex literal in `computeWeaponHit`, `reflexActive`, `ammoEffects`, the inline `getConditionLabel("exhausted")`. | pass | pass |

### Behavioural (differential: original vs cleaned, byte-identical write logs)

16 scenarios, each on a fresh module instance. A scenario fails on any handler error, any difference in the ordered `setAttrs` log, or any change in the watcher-registration census.

| TC | Scenario | Exercises | Writes (baseline) |
|---|---|---|---|
| 10 | `open/<ancestry>` ×8 and `open/unselected` | The whole `sheet:opened` path: bootstrap, race state, every init, three weapon rows including a handgun and a rifle preset (reaches `slots`). | 704–1,389 each |
| 11 | `census/bootstrap` | `bootstrapGlobalWatchersOnce` then `registerBackgroundSkillLimiterV2` again: **0 extra handlers** (replaces `bgLimiterRegistered`). 3,602 events / 6,160 handlers. | 31 |
| 12 | `flaw/grid` | 2 lock states × 3 perk counts × 7 flaw combinations of 5/10-cost flaws. | 1,512 |
| 13 | `perk/grid` | 2 × 3 × 8 combinations incl. 10- and 15-cost perks (what the dead `picked10/15` counted). | 2,448 |
| 14 | `stat/grid` | 4 ancestries × `age` {"",16,45,99} × `major_wounds` {"",4,99} × `edu` {"",15,40,85} × awakened {0,1} = 384 firings of the real `registerStatHandler`. These are exactly the inputs `iage/iedu/iwound` parse. | 56,544 |
| 15 | `skillcalc/talents` | `calculateAndUpdateSkillValues` with a talent-granted skill selected, for every ancestry, plus background bonus and "none". | 3,663 |
| 16 | `tags/sweep` | `buildTagsStr` and `computeWeaponHit` over 4 optics × 4 aim × 6 ranges × 2 smartlink × 5 categories (reflexRanges). | 1,920 |
| 17 | `status/strain-hp` | The live `change:strain` and `change:hp` watchers: Exhausted/Tired/Bloodied apply and clear, including full slots. | 85 |

Phase 1 coverage (`--coverage`): all 12 executable removal targets are reached.

### Existing project suite (regression)

TC-30: run each of `difftest_ammo`, `difftest_modbuttons`, `difftest_modeffects`, `difftest_offschool`, `difftest_tags`, `test_ammo_note`, `test_ammo_reconcile`, `test_ancestry_minimums`, `test_career_bundle`, `test_grenade_i18n`, `test_money_ledger`, `test_perk_flaw_limits`, `test_stat_minimums`, `test_subsonic_bf`, `test_tagfetch` as `node "<script>" ghost_of_arcadia.html ghost_of_arcadia.css`; `python3 validate_presets.py ghost_of_arcadia.html`; and `difftest_barrel.js` with `--save` on the original and `--check` on the cleaned file. Compare exit code and full output original vs cleaned.

### Negative tests (does the gate actually fire?)

Run on the fully cleaned file; each mutation was verified to have taken effect (the mutated file differs from its source) and the failure was read, not just the exit code.

| Mutation | Result |
|---|---|
| Drop `"major_wounds"` from the stat watched array | FAIL — protected binding damaged; census 3602 → 3601 events |
| Delete `const flawKeys` instead of `flaw5Keys` | FAIL — `flawKeys is not defined` in 11 scenarios (clean failure, no crash) |
| Remove `talentBonus` from the skill total | FAIL — `skillcalc/talents` diverges at write 350 (`archery_mdr 25 → 15`) |
| Delete the `BG_LIMITER_V2_REGISTERED` early-return | FAIL — second call registers 64 extra handlers |
| Rename the `major_wounds` write | FAIL — protected binding + `open/alteri` diverges |
| Leave a call to `handleRaceChange` | FAIL — residual reference |
| Change the inline Tired threshold `/2` → `/3` | FAIL — `status/strain-hp` diverges at write 12 |

Two defects were found in the harness while doing this and fixed: a `--check` crash when a scenario throws (it must fail cleanly), and a first inline-strain mutation that actually hit the live `applyExhaustedStatus` instead, which the harness correctly did not flag because nothing in the scenarios calls the tracker path. See limits.

### Dry-run result on your upload

| Step | Result |
|---|---|
| Phase 1 | 79,254 → 79,225 lines (−29), 12 blocks, PASS, 16/16 identical |
| Phase 2 | → 79,100 lines (−125 more, −154 total), 8 blocks, PASS, 16/16 identical |
| Existing suite (15 scripts) | exit code 0 and identical output, original vs cleaned |
| `validate_presets.py` | PASS, identical output |
| `difftest_barrel.js` | 421 cases, 0 diffs |
| ESLint | 21 findings → 1 (`detonatorDataMap`) |

## 5. Sandbox tests (Roll20)

The harness proves the code does what the code says; only Roll20 shows the rendered sheet. A removed local that was not actually dead fails as a `ReferenceError` *inside a callback*, so it appears only when that callback runs. Open the browser console with trace on.

**S1 — after phase 1.**
1. Open a character with `showracials` = Draevi and at least one weapon row with a handgun preset. Expect no `ReferenceError` / "is not defined" anywhere in the open log.
2. Flaws tab: tick one 10 XP Flaw. Expect every other Flaw to lock and `xpledger_flaws_gain` = 10. Untick it; expect all unlocked.
3. Perks tab: with no Flaws ticked, tick a 15-cost Perk. Expect the perk summary text to appear and `perk_selected_count` to read 1.
4. Edit **STR** (any value). Expect HP, damage bonus and Major Wound threshold to recompute and no error. Edit **EDU** to an empty value; expect it to restore to the ancestry base.
5. Change a skill value on a talent-granted skill. Expect the total to include the talent bonus.
6. Weapon row: set range to Short with Reflex Sight and Quick Aim. Expect the summary to show `Reflex Sight +10%` and the hit % to include +10.

**S2 — after phase 2.**
1. Change ancestry from Draevi to Feran, then back. Expect talents, language and racial summary to refresh (this replaces `handleRaceChange`'s three steps, which were already inlined).
2. Set Strain to 0: Exhausted and Tired both appear in the status slots. Set it to half of max: Tired only. Raise it to max: both clear.
3. Check a session-limited talent tracker box that costs Strain (calls `handleTrackerStrainDeduction`, the one live user of `applyExhaustedStatus`). Expect the Strain deduction and, if it empties Strain, an Exhausted status.
4. Fire a weapon with AP ammo loaded: the chat card shows `AP (N)` and the summary AP matches.

## 6. Commit messages

Handed over for you to apply; I do not run git. Per Claude.md these are cleanup commits, kept separate from any behaviour change.

```
Remove unused locals flagged by the Todo 10 orphan sweep

The sweep was reverted on 2026-08-07 because skillToXP turned out to be a
rules artefact. This redoes it with the rules check first. flaw5Keys and
flaw10Keys are superseded by the creation-only 2-selection / +10 XP lock
that now lives in the same function; talentSkills is superseded by
talentBonus in calculateAndUpdateSkillValues; bgLimiterRegistered is
superseded by BG_LIMITER_V2_REGISTERED; iage, iedu and iwound are parsed
and never read, and major_wounds is a computed output, not an input.
picked5, picked10 and picked15 were write-only; find_orphans.js scans
const only, so ESLint no-unused-vars found them. reflexRanges is dead
but its Todo rationale was wrong: no code reads hit_bonus_range_limit and
the reflex range remains a literal in computeWeaponHit and buildTagsStr.

No source: {} was bumped and no attr migration or reconciler is shipped:
no attr, DataMap entry, HTML, CSS or translation key changed, and the
deleted bindings never reached setAttrs. age, edu and major_wounds stay
in registerStatHandler's watched array. detonatorDataMap is untouched per
Todo 8.

Gate: test_dead_code_removal.js, 16 scenarios, byte-identical write logs
against a pre-change baseline, all 12 executable targets probe-verified as
reached; the 15 project test scripts, validate_presets.py and
difftest_barrel.js (421 cases) identical before and after; seven
mutations each caught. Not covered: the Roll20 sandbox, which is run
separately (S1).
```

```
Remove unreferenced orphan functions from the sheet worker

applyAllSkillBonuses, getAllTalentSkills, handleRaceChange (with its
lastRaceHandled guard), removeExhaustedStatus, applyTiredStatus,
removeTiredStatus and computeWeaponAPTotal have no callers. The first
three were superseded when the race-state steps were inlined into
initializeSheetOnOpen and the showracials watcher; the Exhausted and
Tired helpers by the inline logic in the change:strain watcher; the AP
helper by ammoEffects and weaponDataMap.ap. computeWeaponAPTotal was
also broken, reading entry.ap with no entry in scope. applyExhaustedStatus
is still called by handleTrackerStrainDeduction and stays.

No source: {} bump and no migration: no attrs, DataMap entries, HTML,
CSS or translation keys changed. Evidence for "no callers": AST
reachability (Sheet_Workers.md section 2) and ESLint no-unused-vars; the
test also asserts zero residual references after removal.

Gate: as for the previous commit, with ESLint now reporting only
detonatorDataMap. Roll20 sandbox S2 is run separately.
```

## 7. Edits to propose for Todo_list.md and Claude.md

Todo 10 — replace its body with: *Done* (once merged), plus three carry-overs: (a) `reflexRanges` rationale corrected, and the reflex range remains a literal in two places — fold into the weapon rework (Todo 5); (b) Core Review line 55 ("flaw5Keys/flaw10Keys are very likely an unfinished feature") is superseded by the shipped lock and should be struck; (c) if the Core Rules define an age rule, it is a missing feature, not a reason to keep `iage`.

Claude.md, *Verification Tooling*: add `test_dead_code_removal.js` and `apply_dead_code_removal.py`; and under *Read Every Orphan Before Removing It* note that `find_orphans.js` covers `const` only, so write-only `let` locals (`picked5`, `picked10`, `picked15`) need `eslint no-unused-vars`.

## 8. Limits of this test, stated plainly

- **The sandbox is not replaced.** Nothing here sees CSS, rendering, or roll-template output. The harness stubs Roll20; it does not emulate Roll20's event ordering beyond change-on-differing-value.
- **Scenarios are finite.** 16 scenarios, a few hundred seeded firings. They cover each deleted line's surroundings and every watcher the deleted functions' siblings feed, but not every attr combination.
- **Phase 2 is proved by reference analysis, not by execution.** An unreferenced function cannot be reached by any scenario. The evidence is zero references (AST, ESLint, and the post-removal residual check) plus the open-sheet and strain scenarios showing the live copies unaffected. `typeof x === "function"` guards are the one pattern that could reference a function by a string-free name; none of the eight names appears in one.
- **`handleTrackerStrainDeduction` is not exercised** (it rolls dice); its one dependency on this work, `applyExhaustedStatus`, is untouched and covered by sandbox S2 step 3.
- **Rules questions I could not close.** The Core Rules PDF was not available to me; note A stands.
