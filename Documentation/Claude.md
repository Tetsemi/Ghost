# Claude.md — Ghost of Arcadia Roll20 Character Sheet

## Project Overview

**Ghost of Arcadia** is a custom Roll20 character sheet for a cyberpunk/fantasy tabletop RPG. The sheet requires Roll20 **Pro** (API) access. It is built on the Call of Cthulhu sheet architecture (percentile skill system, push rolls, bonus/penalty dice) heavily customized for the GoA ruleset.

### Files

| File | Purpose |
|---|---|
| `ghost_of_arcadia.html` | Sheet HTML + all embedded `<script>` sheet workers + all DataMaps + roll templates |
| `ghost_of_arcadia.css` | All styling, themes (Dark / Light / Cyberpunk / Ancestry), CSS variables |
| `translation.json` | All i18n string keys used by `data-i18n` attributes |
| `bonuspenalty.js` | Roll20 API script — seeds Bonus/Penalty ability on characters |
| `dexInitiative.js` | Roll20 API script — DEX-based initiative for PCs |
| `dexInitiativeNPC.js` | Roll20 API script — DEX-based initiative for NPCs |
| `moveNPC.js` | Roll20 API script — NPC movement helper |
| `GoA Core Rules 2026-07-01.pdf` | Core rulebook reference (world, skills, careers) |
| `Ghost Guide to the Arcane.pdf` | Spell reference (casting, schools, spells) |
| `Todo_list.md` | Active bugs and pending tasks |
| `GoA_UI_Framework.md` | Structural map of every UI region and tab, with the consolidation analysis the 2026-08-17 restructure rulings came out of |

---

## Workflow Rules

### File Handling
- **Always copy from uploaded files** (`/mnt/user-data/uploads/`) at the start of every session. Never copy from `/mnt/project/` — that path may be stale and not reflect the user's latest edits.
- **Never overwrite mid-session.** Once working files are copied at session start, do not re-copy from uploads or project again during the same session. Files uploaded *later* in a session that were not previously present (validation scripts, reference docs) are additions, not overwrites, and may be copied in freely.
- **Deliver changes as outputs** from the working copies. The user merges outputs back into the project.
- **Use `str_replace` for targeted edits** — never use large Python block replacements that reproduce entire file sections verbatim. Large replacements require matching the exact current file content and silently overwrite any user edits in that block if the match is stale.
- **Verify by content, never by mtime, and audit `/mnt/user-data/outputs/` before merging.** On 2026-08-06 the working container held files created by no action in the session — `find_orphans.js`, `edit2.py`, `edit3.py`, and a `difftest_dice.js` that also appeared in the outputs directory. `ghost_of_arcadia.html` carried a matching mtime while its md5 still matched the last delivery, so md5 was the only trustworthy signal — and that comparison was itself worthless, because it compared the working copy against the delivered copy and the phantom had modified both. **The only sound reference is the pristine upload plus the edits you can show.** Diffing working-vs-pristine and attributing every changed line is the check that actually works; 55 of 115 deleted lines turned out not to be mine, and had already shipped in two deliveries. One of those artifacts (`edit3.py`) wired the ammo AP lookup *before* the key-space rename — the exact silently-failing order that session's work was sequenced to avoid.
- **Diff working-vs-pristine before every delivery and attribute every changed line.** This is cheap and it is the check that catches both phantom edits and accidental scope creep. A four-line change should diff as four lines; anything else needs explaining before the files ship.
- **Always verify which file is newer before working.** At session start, compare timestamps and sizes of uploads vs outputs: `ls -lt /mnt/user-data/uploads/ghost_of_arcadia.* /mnt/user-data/outputs/ghost_of_arcadia.*`. If outputs are newer or larger than uploads, the user has not merged the last session's output — use outputs as the base, not uploads. Blindly copying from uploads when outputs are ahead discards all intermediate fixes and recreates bugs already solved.
- **If no files are uploaded, always continue from `/mnt/user-data/outputs/`.** Never re-copy from uploads mid-session when the user simply continues without new files.
- **Verify the working base has key fixes before editing.** After copying the base file, spot-check one or two known-good markers (e.g. `grep -n "MedTech roll toggle" ghost_of_arcadia.css`) to confirm the correct version before making any changes.

### Sandbox Tests

- **Every delivery names an explicit sandbox test**, in the same response as the
  files, alongside the commit message. The validation gate proves the code does
  what the code says; only Roll20 proves the sheet does what the *player* needs.
  Several defects this project has shipped passed the full gate — a missing
  `Silent` tag on open, a FAIL cell duplicating the PASS cell, an input clipping
  its own text — because no automated check looks at the rendered sheet.
- **Name the specific thing to look at, not "check it works."** The test should
  be one or two concrete actions with a stated expected result, chosen to
  exercise *the change*, not the feature around it. "Fit AP rounds to the
  Linecutter and confirm `AP (5)` and a 2d8 damage die" is a test. "Check the
  weapons tab" is not.
- **Target the failure mode the gate cannot see.** Prefer a test that would fail
  if the change were subtly wrong over one that merely shows the feature exists:
  on-open state (which no `change:` handler has recomputed), CSS visibility and
  clipping, roll-template output, and any value the player types that the sheet
  then rewrites.
- **Include the negative half where state can go stale.** Switching *away* from
  a state is where hidden attrs keep contributing — "switch the row to a
  Specialist and confirm the Ledger total returns to its previous value", not
  just "confirm N/A appears".
- **Wait for the result before stacking the next change.** Four commits went
  onto one file unvalidated on 2026-08-06; when a rebuild became necessary, none
  of them could be individually cleared.
- **Ask for a screenshot before theorising about render order or layout.** On
  2026-08-18 an ordering question about the Money Ledger produced two
  speculative mechanisms (a `.toLowerCase()` mismatch in
  `getSectionIDsOrdered`, a possibly-wrong `change:_reporder:` event name)
  before anyone looked at the rendered table. The screenshot settled it in one
  round and both theories were wrong. A console log proves what the worker
  computed; only a screenshot proves what the player sees, and the two questions
  are routinely confused.

### Commit Messages

- **Every delivery includes a commit message, unprompted.** Any change to
  `ghost_of_arcadia.html`, `ghost_of_arcadia.css`, `translation.json`, or the API
  scripts ships with its message in the same response as the files. Do not wait
  to be asked. If the session produced no file changes, there is no message.
- **One message per logical change group, not per file and not per session.** A
  change spanning DataMap + HTML + translation.json + CSS is one commit when it
  is one feature. Two unrelated fixes in one session are two messages even if
  they touch the same file.
- **Behavioural changes and cleanup stay separate.** Renames, dead-code removal,
  formatting, and orphan deletion go in their own commit from the change that
  alters what the sheet does. This keeps `git log -S '<identifier>'` able to date
  a construct precisely — which is the tool used to attribute defects, so
  polluting it costs real debugging time later.
- **Format:** imperative subject line under ~72 characters, blank line, then a
  body of wrapped prose. No bullet lists in the body. No trailing period on the
  subject.
- **The body explains why, not what.** The diff already shows what changed.
  State the defect or rules change that motivated it, and the reasoning that is
  not recoverable from reading the code.
- **The body must disclose, where applicable:**
  - which `source: {}` version/date was bumped and what document drove it
  - whether an attr migration or reconciler was shipped, and if not, the explicit
    reason it is safe to omit (see Attr Migration Pattern)
  - the evidence used to date a defect, when the commit corrects something older
    than the work that surfaced it
  - any layer deliberately left untouched, and why — silence reads as an
    oversight
- **Never claim a validator ran when it did not.** State which of
  `validate_presets.py` and the difftests were run and what they reported. If a
  script was not available in the session, say the gate is partial and name what
  is unverified. An unqualified message implies a full pre-delivery gate.
- **Claude does not run `git`.** There is no repository in the working
  environment. Messages are handed over for Kameron to apply; do not write as
  though the commit has been made.

---

## Verification Tooling

### Scripts

| Script | Purpose | Run when |
|---|---|---|
| `validate_presets.py` | Preset select ↔ DataMap invariants (W1–W8), spell schools (S1–S2), i18n (T1–T3), tag-layer lockstep (T4–T7), explosives conditions and immunity notes (C1–C2), duplicate declarations (D1) | Before every delivery |
| `difftest_tags.js` | 12,096-combination differential test of `deriveWeaponTags` against the canonical derivation | After any tag-layer change |
| `verify_tag_derivations.py` | Static equivalence prover; takes `<html> <functionName>` | Before any positional collapse. Reports cleanly when a function is already converted |
| `difftest_modbuttons.js` | Runs the retired literal `computeModButtonsLegacy` against the wired implementation across all 74 weapons x 13 mods | After any change to `weaponModDataMap` or the mod button logic |
| `difftest_modeffects.js` | Checks each mod's mechanical fields (die ranges, hit bonuses, mode restrictions) against their implementation | Same |
| `difftest_barrel.js` | Fires all barrel buttons in all scopes and diffs the resulting writes against a saved baseline (`--save` / `--check`) | Before and after any watcher consolidation. Covers barrel, internal-mod, optics, range, mode and ammo buttons: 387 cases, plus cap-counter and aim-cycle cases: 421 total |
| `difftest_ammo.js` | Transcribed pre-wiring ammo logic vs `ammoEffects` across 9 types × 3 active states; key-space bijection; per-scope CSS `[value=]` coverage; asserts the 8 unimplemented fields are present with their expected values. Takes `<html> [css]` | After any ammo change |
| `test_ammo_reconcile.js` | Executes the worker; `reconcileAmmoTypes` across all three ammo scopes, idempotency, non-destruction of unresolvable values, and that it is actually called from `afterAllSets` | After any ammo key-space change |
| `test_ammo_note.js` | Six roll buttons, both attack templates, `effect_summary_key` resolution, `translation.json` alphabetical position, and note-write ≥ label-write parity | After any ammo note or roll-template change |
| `test_grenade_i18n.js` | Asserts every grenade display string resolves through `tr()`, that each key exists in `translation.json`, and that each function declares its own local `tr` | After any grenade/explosives display change |
| `test_subsonic_bf.js` | Fires the real barrel and ammo click handlers in both orders; asserts subsonic lifts the Suppressor's BF cap and that Compensator, Silencer and other ammo do not. Harness dispatches `change:` events | After any mode-availability or ammo change |
| `test_stat_minimums.js` | Emptied stat restores to `stats[x].base`; a below-base value is flagged not clamped; asserts each below-min CSS rule **outranks** the per-stat edit-mode rule | After any stat-minimum or edit-mode CSS change |
| `test_ancestry_minimums.js` | The eight SIZ minimums and the INT 40 floor against the Core Rules, and that `applyRacialBaseStats` still clamps to `stats[x].base` | After any ancestry stat change |
| `test_career_bundle.js` | Asserts `career_type` and `skill_points_secondary` agree with the rules, that no primary-career conversion survives, that the N/A controller precedes its targets, the CSS swap rules exist, and that over-cap entries are deliberately NOT clamped | After any career XP or skill-bundle change |
| `test_tagfetch.js` | Records the keys actually passed to `getAttrs` at runtime and asserts every `deriveWeaponTags` consumer fetches every attr `weaponTagInputs` declares; also cross-checks each entry's `attrs` against the keys its `derive` closure reads | After any tag-layer or fetch-list change |
| `test_money_ledger.js` | Executes the worker; running-total accumulation in row order, balance order-independence, blank/malformed input, empty section, single registration on the credit event, and the `afterAllSets` call site asserted against comment-stripped source | After any money ledger, ledger-relocation or credits change |
| `find_orphans.js` | AST walk (acorn) reporting `const` bindings with zero resolved references. Regex use-counting gives false negatives on names that also appear as string literals on their own declaration line (`internal === "qst"`) | Before any orphan sweep |
| `difftest_offschool.js` | Executes the worker; full 10×10 school matrix, all three write paths, career-change recompute, declaration order | After any spell Strain or arcane career change |

`difftest_barrel.js` extracts its ammo button fixture from the sheet under test — do not reintroduce a literal copy (see *Test Fixtures That Copy Sheet Data Go Stale*).

**Baseline the gate against the pristine upload before editing.** Every script
above should be run against `/mnt/user-data/uploads/` at session start, and
`difftest_barrel.js --save` needs its baseline captured from the *pre-edit*
file. A green run after a change means nothing unless the same run was green
before it — and `--check` against a baseline saved from the edited file is
tautological in exactly the way *Equivalence Proofs After the Collapse Has
Shipped* describes.

### Deferred Rules Are Data, Not Gaps

Three `weaponModDataMap` fields declare rules the sheet deliberately does not mechanise:

| mod | field | why deferred |
|---|---|---|
| `compensator` | `sa_follow_up_reduction` | needs to recognise a follow-up shot as *immediately* following the initial one — requires an API script with access to logs, initiative order and action history |
| `quick_load_system` | `reload_as_free_action` | reload economy is GM-adjudicated; the sheet models no action economy |
| `thermal_scope` | `ignores_low_light_penalty` | lighting is GM-adjudicated; the sheet models no ambient state |

These are scoping decisions, not defects, and the data stays authoritative — a future API script could mechanise any of them. `difftest_modeffects.js` reports them as `DEFER` with the rationale inline, so a later reader does not mistake them for a defect list and "fix" them by deleting the fields.

**`weaponDataMap` traits are undocumented defer, not declared defer.** Unlike `weaponModDataMap`, its traits are consumed only by `traitLabelMap` (display strings) and nothing mechanises them. Worked example, `vaultline_torchwall_hmg`:

- `ap_2_heavy_targets` — the key names the *target-class* condition but encodes the *Physical Soak ≥ 4* one. Those are two different bullets in the rules text; `ap_2_soak_4` would name the actual condition.
- It matches `trait_ap` (`startsWith("ap_")`) but not `ap_total` (`/^ap_\d+$/`), so it shows "AP (2) Heavy" in the traits list and no AP in the numeric label. Defensible, but decide whether that split is intended.
- The "one die type higher against light vehicles, drones and walkers" rule is **absent from the DataMap entirely** — not deferred, just missing.
- The source text contradicts itself: "one die type higher (2d10 → 3d10)". A die *type* step from d10 is d12, the example adds a die instead, and the weapon's base damage is 3d10 so the example does not match its own weapon. Needs an author ruling before encoding.

Proposed tool: `difftest_weapontraits.js`, asserting every trait in `weaponDataMap` either has a code consumer or a declared defer with rationale.

**Assert deferred data is present, do not skip it.** The first version used `if (!declared) continue`, so deleting the field or flipping it to `false` passed silently. Deferred fields are now asserted to hold their expected value and report `DATA LOST` otherwise — verified by flipping `sa_follow_up_reduction` to `false` and confirming the check fires.

**Strip comments in every scanner from the outset.** This trap recurred a *third* time in one session: a literal scanner matched the string quoted inside the comment explaining what it had replaced. Worse, the `strip` helper added to fix it was declared *below* its first use and threw a TDZ `ReferenceError` — in the very file whose job is catching that class of fault. Declare the stripper above its consumers.

**Run regex census checks against comment-stripped source.** A check banning `ammoType.replace(/_/g` fired on the comment explaining what it had replaced. Any "this pattern must no longer appear" check needs `js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")` first. The same applies to "is the map read" metrics: prose mentioning `ammoDataMap[stored]` inflated a reads counter to 2 when the true count was 0. It applies equally to **call-site assertions**: a check that `recalcMoneyLedger()` appears inside `afterAllSets` would pass on a deleted call if the comment explaining the call survived.

**A test that calls a function directly does not prove the function runs.** Deleting `reconcileAmmoTypes()` from `afterAllSets` left the reconciler test fully green, because the test invoked it itself. Assert the call site exists: `/afterAllSets[\s\S]{0,4000}?fnName\s*\(\s*\)\s*;/`. `test_money_ledger.js` uses the same guard and is negative-tested against a mutant with the line removed.

**Coverage checks must be per-scope, not "exists somewhere."** A CSS check asking whether *a* `[value="X"]` rule existed passed when one of two scopes had been missed during a rename. Check `ammo_type` and `ammo_type_mdr` independently.

**A negative test must fail cleanly, not crash.** Removing the unknown-key guard from `ammoEffects` made the sweep throw; the run exited non-zero but printed a stack trace instead of naming the offending input. Wrap per-case invocation in try/catch and report `threw on <input>`.

**Line-anchored source scanning breaks under any edit.** A checker that read fetch lists by line number reported three handlers as missing every tag attr — the preceding edit had shifted the offsets and it was reading unrelated regions. Verify coverage by executing the code and recording what it asks for, not by scanning text at remembered positions. That also survives a list becoming generated, at which point the literals it searched for no longer exist.

**Two checks reading the same source cannot cross-validate each other.** Emptying a `weaponTagInputs.attrs` list passed both `test_tagfetch.js` (which compares handlers against the generator — both derive from that table) and `difftest_tags.js` (whose harness seeds the store directly rather than through a fetch list). Neither could see it. The gap closed only by cross-checking each entry's declared `attrs` against the keys its `derive` closure actually reads, in both directions. When a negative test passes, ask whether the two sides share an input.

**A test fixture's sidecar files must travel with the mutant.** A negative test put a mutated sheet in `/tmp` and ran a checker that resolves `translation.json` as a sibling of the file under test. It picked up a stale copy and failed on missing keys — a real non-zero exit, for a reason unrelated to the mutation, which was never exercised. Copy every sidecar the checker reads into the same directory, and read what the failure actually *says* before accepting it as proof.

**When behaviour changes, assertions encoding the old behaviour become false failures.** `test_grenade_i18n.js` asserted the raw condition key appeared in the FAIL cell. Once condition names resolved to display labels it failed six times on correct output. Update the assertion to resolve its expectation the same way the code does — and add the inverse check (the cell must *not* show the raw key where a resolution exists) so the fix cannot silently regress.

**A non-zero exit is not proof the check fired.** A six-way negative test of T7/W6/W8 reported all six caught. In fact the mutation script had thrown on its first anchor and written no files at all, so `validate_presets.py` was exiting 1 on *file-not-found* six times. A missing file and a caught defect are indistinguishable from the exit code alone. Assert each mutated file exists and that the reported failure names the expected check, not just that the run failed.

**A validator helper that fails soft is worse than one that throws.** `field()` matches only `name: "quoted"`, so it silently returned `None` for the numeric `ap: 3` and the new W6 check passed on data it had never actually read. Added `bare_field()` for numeric and object values. When a new check passes immediately on first run, confirm it is reading the values you think it is.

**When adding an attr that parallels an existing one, assert write-site parity by count.** Asserting note-writes ≥ label-writes caught two paths on the first run — the `sAmmoType` summary variant and the `weapon1` reset. Reading the code had not found either.

Both validators exit non-zero on violation, so they drop into a pre-delivery gate.

### `node --check` Is Not Sufficient

`node --check` parses; it does **not** resolve identifiers. An undefined variable passes cleanly and throws at runtime. On 2026-08-01 a converted call site used `vals` where the callback parameter was `v`; `node --check` passed, the isolated unit test passed (it did not exercise call sites), and `refreshWeapon1Summary` threw on every sheet open.

**Any change touching variable references requires execution, not parsing.** Load the worker block into node with stubbed Roll20 globals (`on`, `getAttrs`, `setAttrs`, `getSectionIDs`, `getTranslationByKey`, `generateRowID`), then invoke the changed functions and assert no error. This also enables behavioural tests — firing a `change:` handler with a seeded store and asserting on the resulting writes.

**A harness that does not dispatch `change:` events cannot test watcher-driven
behaviour.** A stubbed `setAttrs` that only mutates the store means every
`change:` handler is dead code during the test, so a fix that depends on one
appears to fail — or worse, an existing bug appears to pass. Have `setAttrs`
compare against the previous value and fire the handlers registered for each
changed attr, honouring `{ silent: true }`. Without this, the subsonic mode
recompute tested as broken after it had been correctly written.

**Corollary: confirm the test exercises the path you think it does.** A seeded-store test that accidentally hits the deselect branch returns "no error" while proving nothing about the apply branch.

### Derived `const`s Must Be Declared After Their Source

The sheet worker is one long top-level scope evaluated top to bottom at load. A `const` derived from another `const` placed *above* its source throws `ReferenceError: Cannot access 'X' before initialization` (the temporal dead zone) and **takes the entire worker down** — not one broken feature, every watcher and init.

Shipped 2026-08-01: `barrelModeRestrict` (line ~30335) was rewritten to derive from `weaponModBarrelLabel`, which sat at ~32535 alongside `computeModButtons`. Verifying that the *source data map* (`weaponModDataMap`) preceded its consumers was not sufficient — the check applies to every new binding in the chain, including the ones just written.

Nothing static caught it: `node --check` passed (it parses, it does not evaluate), and all three difftests passed because they extract functions individually and run them in isolation, so declaration order never arises. Only executing the whole module reproduced the load sequence.

**After adding any derived `const`, assert declaration order programmatically** — locate each identifier's declaration line and assert source < consumer for every pair.

The same trap catches ordinary locals, not just module-level derived constants. Adding `damage: dmgStr` to the `initWeapon1ModButtons` diagnostic dump put a reference *above* the `const dmgStr` declaration inside the same callback — `ReferenceError` on every sheet open, `node --check` clean. Three TDZ faults occurred in one session and all three were caught by executing the module, none by parsing it. When inserting a reference into an existing block, check where the identifier is declared relative to the insertion point.

**A call added to `afterAllSets` needs the same order check, for a different reason.** `afterAllSets` executes during `sheet:opened`, long after the module has finished evaluating, so a function it calls cannot hit a TDZ. But its *dependencies* can: `recalcMoneyLedger` reads `SECTION`, `getSectionIDsOrdered` and `toNum`, all module-level consts, and `test_money_ledger.js` asserts each precedes it. Add the pairs to the guard test rather than reasoning about them once.

### Proving a Thing Is Absent

Three false absence claims were made in one session (2026-08-06). Each came from a search that could not have found the thing it was looking for, and each nearly redirected the session toward building something that already existed.

- **An "X is never written" claim must cover every assignment form.** A search for `x:` and `["x"]` missed `update.ac = ...` and produced a confident, wrong "Arcane Capacity is never computed". Cover `x:`, `["x"]`, `.x =`, `x =`, and computed keys — and exclude DataMap literals that merely share the name, since `ap:` matched 250+ spell AC costs and buried the real writer.
- **A `readonly` input is evidence FOR a writer existing, not against it.** It was read as confirmation of the absence claim. Computed fields are readonly *because* something writes them.
- **Search for the encoding, not the concept.** Searching `affinity`, `alignment`, `natural_school`, `primary_school` returned nothing and produced "the sheet has no school alignment". The sheet encodes it as `primary_arcane_career` — the career IS the alignment. When a concept search comes back empty, search for the control (`<select`, `data-i18n`) and the surrounding domain nouns before concluding anything.
- **Scope every count to the thing being counted.** A file-wide count of a common field name (`compatible_categories`, `damage`) says nothing about whether a specific DataMap is read. To find real reads of a map, match property access — `mapName\s*[\[.]` — against comment-stripped source.

**An orphaned aggregate is not always the user-visible half.** `money_balance` was found written by `recalcMoneyLedger` with zero markup elements, and reported as "the sheet computes a balance and shows it nowhere". True, but it was the wrong headline: `money_running_total` — the per-row Total column the player actually reads — is written by the *same* function, and was equally stale. When an aggregate and its per-row siblings share one writer, check whether the siblings are displayed before deciding which absence matters. The fix was identical either way; the framing determined whether the change looked cosmetic or necessary.

### Static Analysis of JS Scope Is Unreliable

A script that walks upward for the nearest `getAttrs(..., (var) =>` will happily match a *different* enclosing function and report a confident wrong answer. The same lookback produced a **false negative** (wrong variable) and a **false positive** (prefix bound outside the lookback window) in a single run — and separately, a forward-scanning binding collector returned the *earliest* rather than the nearest binding, manufacturing a divergence that did not exist and leading to a redundant `overrides` argument being shipped.

Two rules follow. Resolve bindings by scanning **backward** from the use site, stopping at the enclosing function boundary. And confirm every result against the actual line before acting on it — a prover that has been wrong once must be re-verified, not trusted because it agrees with the previous run.

### Designing a Validator Check

A check that fires on hundreds of pre-existing instances is **worse than no check** — it trains everyone to ignore the output. The first duplicate-declaration rule flagged 197 instances; narrowing to the precise failure signature (hidden + visible + disagreeing defaults + never written) reduced it to 2, both real bugs.

**Negative-test every new check against the actual bug that motivated it**, and reconstruct the true pre-fix state to do so. A first attempt at negative-testing D1 reinstated the duplicate declaration but not the missing seed; the check correctly did not fire, which proved nothing. Only with both conditions restored did it catch the original defect.

**Attrs written through a computed name are invisible to a textual search.** After the button consolidation, `D1` reported `weapon1_mdr_range_band` as never written — a false positive, because the generated writer emits `[attr]: val` where `attr` comes from `weaponPresetAttrRep`/`W1`. The check now also treats any CORE name appearing in `weaponToggleFamilies` or `weaponPresetAttrDefaults` as written. When a static check fires on code you know is correct, fix the check.

**Verify the mutation actually happened.** A later negative test of T4/T5 reported PASS on both mutated files — because the harness read the CRLF source without `newline=""`, so Python translated the line endings and the `\r\n` patterns matched nothing, leaving the files byte-identical to the original. Always assert the mutation took effect (key count, substring presence) before interpreting the check's verdict.

**D1 does not cover visible+visible duplication.** It requires a hidden twin with a disagreeing default, which is the dangerous *silent* case. Two fully visible rows sharing one attr set — found 2026-08-17, `otherskill11` declared in both the Perform and Tradecraft skill groups — is a different defect: both render, both edit the same value, and typing in one changes the other. A separate check is wanted: no attr name appears on more than one visible input outside a repeating section.

### Hand-Maintained Link Tables Need a Lockstep Check

`weaponModBtnAttr` is the only hand-maintained link between `weaponModDataMap` and the sheet, and `computeModButtons` iterates the **link table**, not the map. Every way of breaking it is silent:

- a map entry with no link is never consulted — the mod simply does not exist
- a link whose attr has no HTML element writes to nothing
- a renamed attr leaves the worker writing the old name while CSS keys off the new one

**A generator nobody calls provides no protection.** `weaponTagAttrKeys` is built from `weaponTagInputs` and its own comment says it is "generated, so it cannot fall behind the table". It had zero callers — every handler kept a hand-written `getAttrs` list instead — and one of those lists had already fallen behind by one attr. `initWeaponComputedAttrs` did not fetch `weapon_trait_silent_mdr` while writing the tags display, so on every sheet open a silenced weapon lost its Silent tag until a control was touched. When a helper exists to prevent drift, check that something actually calls it; the comment is not the mechanism.

`traitLabelMap` is the second such table: it is the only link between a weapon's traits and what the player sees, and a renamed trait falls through `traitLabelMap[t] || t` to render the raw key in the traits list. Silent, and exactly what a vocabulary rework invites. `T7` asserts bidirectional coverage — 48 traits, 48 entries at the time of writing.

Checks `M1`-`M4` in `validate_presets.py` cover all four layers: link key exists in the map (M1), map entry has a link (M2), both `attr_weapon_*` and `attr_weapon1_*` elements exist (M3), and a CSS `[value=]` rule targets the attr (M4).

Note the scope prefixes: the apply path writes `prefix + attr`, so the elements are `attr_weapon_btn_*` and `attr_weapon1_btn_*`, never the bare attr name. A first version of M3 checked for the bare name and fired on all 13 entries — the "fires on everything" antipattern, and a signal that the checker's assumption was wrong, not the code.

### Read Every Orphan Before Removing It

`find_orphans.js` reports bindings with no resolved references; it does not
tell you *why*. Two of eleven in the 2026-08-06 sweep were nearly
misdiagnosed:

- `bgLimiterRegistered` sits beside `registeredSkillHandlers` and `talentSummaryRegistered`, both of which are consulted, so it read as "the background limiter has lost its re-entry guard" — a real defect. It has not: `registerBackgroundSkillLimiterV2` guards with the boolean `BG_LIMITER_V2_REGISTERED` twelve lines above, and the `Set` is a superseded earlier form.
- `slots` is declared six times across the worker and a file-wide count reports 52 uses. Only the declaration inside `initWeaponComputedAttrs` is unused, because `computeModButtons` takes the entry rather than the slot list.

**Unreferenced is not the same as dead — check the rules text.** A binding can
be unreferenced because a feature is unfinished, or because it is a copy-paste
of a mechanic that does not apply where it was pasted. `skillToXP` in the
primary-career XP watcher read `primary_career_skill_to_xp` and discarded it,
while the secondary-career version subtracts its equivalent. That looked first
like dead code, then like a live accounting bug, and was in fact neither: the
rules grant the 20-point skill bundle and its 1:1 Talent XP conversion only when
a career is taken as **secondary or later**, so no primary control was ever
built and the attr is never written. The correct fix was to remove the watcher,
the fetch entry and the local *together*, justified by the rule — not to sweep
one unused variable and leave the other two behind with nothing to explain them.
Before removing an orphan, ask what feature it belonged to and whether the rules
say that feature should exist there.

**Delete the local, not the watcher.** `iage`, `iedu` and `iwound` were parsed
and never read, but `age`, `edu` and `major_wounds` stay in
`registerStatHandler`'s watched array — the handler must still re-fire when
they change even though it does not read those parsed values.

**A multi-line declaration needs statement-level deletion.** One `talentSkills`
was a fourteen-line `.filter().map().filter()` chain; a line-at-a-time sweep
that asserts single-line `const` will refuse it. Scan to the terminating
semicolon at depth zero.

### Check What the Existing Aggregates Already Express

Before adding tracking, find out what is already tracked. The Skill→XP
conversion looked like it needed a separate "unspent bundle points" counter to
stop a player spending the same twenty points twice. It does not:
`total_skill_points_remain` is

```
primary + personal + secondary + ledgerGain + ledgerGainRoll
  − ledgerLost − spent + perk_linguist_sp
```

where `ledgerLost` sums every row's `secondary_career_skill_to_xp`. The
conversion already debits the same pool the skills are bought from, so a double
spend surfaces as a negative remainder. The only case the aggregate cannot
express is a career with **no** bundle at all, which is why the fix narrowed to
enforcing the Specialist zero and left over-cap entries alone.

The same reasoning retired the Cash field on 2026-08-18: the Money Ledger's
running total already reports available credits, so a second hand-typed balance
was a duplicate representation with no reconciliation between the two.

**A deliberate absence needs an assertion too.** `test_career_bundle.js` asserts
that no clamp exists on the over-cap case, so the decision is recorded in the
suite rather than in a commit message nobody re-reads. `test_money_ledger.js`
asserts that the balance is **order-independent**, which is the property that
made row placement a cosmetic question rather than a correctness one — if it
ever stops holding, the reasoning recorded in the retirement commit stops
holding with it.

### Test Fixtures That Copy Sheet Data Go Stale

`difftest_barrel.js` held its own literal copy of the ammo button values. When the stored values were renamed, its `self active` seed planted a value the handler no longer recognised, so every toggle-off case reported as a behaviour change when only the fixture was wrong — 12 false diffs that looked exactly like a real regression.

**Extract fixture data from the file under test.** Where the fixture object is serialised into a generated runner (as `OTHER` is), extraction cannot live inside the object literal — an embedded IIFE ends up in the runner with its escapes mangled. Extract in the main process and interpolate: `btns: ${JSON.stringify(AMMO_BTNS)}`, exactly as `TOGGLE_FAMILIES` already does.

This is the duplication-drift rule applied to the test suite. The suite is not exempt from it.

### Equivalence Proofs After the Collapse Has Shipped

Once a collapse has shipped, the original code is gone, and a differential written against the current file compares the new code to the source it now reads. That is tautological, and it looks like a passing proof.

Two legitimate options:

1. **Recover the pre-change revision** (`git show <rev>:ghost_of_arcadia.html`) and run old-vs-new over a swept input matrix.
2. **Transcribe the pre-change logic verbatim into the test** as the canonical reference, the way `difftest_tags.js` does. This is an independent restatement, not a second read of the source. `difftest_ammo.js` uses this form.

`difftest_ammo.js` was originally written to scrape the hardcoded literals and compare them to the map. That is the correct shape *before* wiring. The moment the literals were replaced the test had to be rewritten — expect this, and budget for it, whenever a difftest's job is to prove a duplication is safe to remove.

**Assert intended divergence precisely, not as "differs".** The ammo display name changed from a key-derived string to `tr(name_key)`. The test asserts the new value *equals the resolved translation*, with `getTranslationByKey` stubbed from the real `translation.json`, so a missing key falling back to the raw key string fails. "It changed" would have passed.

### Byte-Level Edits

`assert count == exp` on every replacement caught three wrong-target edits in one session, including a 4-tab pattern that matched as a **substring** inside a 5-tab line — which happened to be the one call site needing different handling. Anchor on the preceding newline or a following distinctive line when a pattern could match at multiple indent depths.

Regex replacement across a CRLF file needs the same line-ending discipline as `str_replace`: a `\n` in a replacement string silently introduces a bare LF. Always re-check `bare LF == 0` after any regex-based edit. Note `Claude.md` itself uses **LF**, while the three sheet files use **CRLF**.

The substring trap **recurred on 2026-08-06 in a new form**: an edit added a line to a 5-tab site, and the *next* replacement's 4-tab pattern then matched twice — once as a genuine site, once as a substring of the line just edited. The count was 1 before the earlier edit ran and 2 after. **Anchor indent-sensitive replacements on the preceding newline** (`CR + '\t\t\t\t...'`) by default, not after the assert fires.

Do not use `sed -i` to edit an edit script. A complex `sed` pattern mangled two lines mid-session; anything containing quotes or backslashes needs `str_replace` or a Python rewrite.

---

## Mandatory Formatting Rules

### Indentation
- **Tab-based only.** Never use spaces for indentation.
- This applies to HTML, CSS, JavaScript, and JSON alike.
- When editing existing code, match the surrounding tab depth exactly.

### Alphabetical Ordering
- All sections within a file must be ordered alphabetically where applicable.
- All entries within each section must be ordered alphabetically by key.
- **`translation.json`** is strictly alphabetical by key — always insert new keys in the correct alphabetical position. Never append to the end.
- DataMap entries within each DataMap object must be alphabetical by key. Ancestry talent entries are ordered **by tier, then alphabetically within each tier** — the tracker index comments, tracker rows, main talent rows, and CSS visibility selector lists are all alphabetical within their groupings.
- CSS variables within a block should be alphabetical where feasible.
- HTML `<option>` lists within a `<select>` should be alphabetical.

**`afterAllSets` is ordered by dependency, not alphabetically.** New on-open calls go beside the related recalcs, with an inline comment stating why the function cannot self-heal without them. Do not sort it.

### Weapon Terminology — Handgun, not Pistol

- **The canonical term is Handgun.** The skill key is `firearms_handgun`,
  `firearms_handgun-u` resolves to "Handgun", and `weaponDataMap` /
  `weaponModDataMap` use `category: "handgun"`. Any standalone "Pistol" or
  "Pistols" in a user-facing string, DataMap value, or `<option>` label is a
  defect and must be replaced with "Handgun" / "Handguns".
- **"Machine Pistol" is a legitimate compound and must be preserved.** A machine
  pistol is a *subcategory* of handgun — a handgun capable of fully automatic
  fire, including stockless handgun-style submachine guns. The subcategory key
  is `machine`, and `machine-u` / `select_sep_machine_pistols-u` are correct as
  written. Never rewrite these to "Machine Handgun".
- **Detect with a negative lookbehind, never a bare substring match.** A plain
  search for "Pistol" flags the compounds and trains you to ignore the output:
  `(?<!machine )(?<!Machine )\b[Pp]istols?\b`
- **This applies when source documents disagree.** GoA rulebook text still uses
  "Pistol" in places (e.g. the Arcane Gunslinger prerequisites and Close Orbit).
  The sheet is authoritative on terminology; transcribe rules text faithfully in
  substance but normalise Pistol → Handgun. Flag the divergence so the doc can be
  corrected, and do not "fix" the sheet to match the doc.

### Ancestry Terminology — Draevi, not Dravi

- **The canonical ancestry is Draevi.** DataMap key `draevi`, attrs such as
  `attr_ancestry_draevi_traits_open`, the CSS classes, and
  `"draevi-u": "Draevi"`. GoA Core Rules Chapter One (2026-07-01) says "Dravi".
- The sheet is authoritative; flag the divergence rather than changing the
  sheet. **Unlike Pistol → Handgun this is a proper noun**, so confirm with the
  author before correcting the doc.
- The eight ancestries are: alteri, draevi, feran, human, khadra, kitsu,
  lyranni, veyra.

### Legacy Internal Names Behind Current Labels

The sheet routinely carries a legacy identifier under a renamed label, and this
is the house pattern rather than an exception: `investigatorinfo-u` renders
"Ghost Info", `investigatorskills-u` renders "Skills", the HP maximum is
`pulphp_max`, and the whole roll-template family is still `coc-`.

**When a tab or section is renamed, change the translation value only.** The
`act_*` button name, the `attr_selected_tab` stored value, the
`.sheet-<tab>` class and its CSS rules all stay. Renaming them strands every
character whose `selected_tab` holds the old string on a blank bottom section —
no CSS rule matches, no `change:` fires, and nothing writes the attr back (see
*Roll20 Render Behaviour*). Reference: Inventory → **Possessions**, 2026-08-18,
which changed one value in `translation.json` and nothing else.

Where a retired *tab* value must genuinely disappear (a merge, not a rename),
keep the old value working with an **alias CSS rule** pointing at the merged
div rather than shipping a reconciler. It is cheaper, permanent, and cannot
fail silently.

---

## DataMaps — Source of Truth

DataMaps are the **single source of truth** for all game data. Do not hard-code values in HTML or sheet workers that should come from a DataMap. All gear presets, talents, skills, weapons, armor, etc. are driven by DataMaps.

### Complete List of DataMaps (in `ghost_of_arcadia.html`)

```
skillDataMap
conditionsDataMap
perkDataMap
flawDataMap
ancestryDataMap        (contains nested per-ancestry `racials` and `talents` objects — the former ancestryTalentDataMap is merged in)
backgroundDataMap
careerDataMap
weaponDataMap
ammoDataMap
explosivesDataMap
detonatorDataMap
weaponModDataMap
armorDataMap
clothingDataMap
disguiseGearDataMap
bypassToolsDataMap
commsDataMap
omniDevicesDataMap
omnidecksDataMap
surveillanceDataMap
arcaneSuppliesDataMap
medtechDataMap
strainCompoundsDataMap
pharmaceuticalsDataMap
utilityGearDataMap
survivalGearDataMap
dronesDataMap
botsDataMap
entertainmentDataMap
vehiclesDataMap
vehicleWeaponsDataMap
vehicleModsDataMap
districtDataMap
lifestyleFeatureDataMap
lifestyleTierDataMap
```

### DataMap Entry Structure

Every DataMap entry must include a `source: {}` object. When adding or editing an entry, **always validate** that the `source` is current and accurate.

```javascript
skill_name: {
	label:  "skill_name-u",
	base:   20,
	skill:  "skill_name_skill_mdr",
	bonus:  "skill_name_mdr",
	group:  [ "group_a", "group_b" ],
	notes:  "skill_name_desc-u",
	source: { doc: "welcome_to_new_arcadia-u", version: "2.260315", date: "2026-03-15", section: "skills-u" }
},
```

For ancestry talent entries (nested under `ancestryDataMap[race].talents`):

```javascript
talent_key: {
	tier: 1,
	cost: 10,
	capstone: false,
	name_key: "talent_group_talent_key-u",
	rule_text_key: "talent_group_talent_key_rules-u",
	type: { economy: "action", tag: "snake_case_tag" },
	strain: "1",
	usage_limit: "scene",
	affected_skill: [ "skill_a" ],
	prerequisite: [ "other_talent_key" ]
},
```

Nested talent/racial entries carry no `source: {}` of their own — the parent ancestry entry's top-level `source` covers everything nested inside it.

### `source: {}` Validation Checklist

When any entry is added or modified, check:
1. Does the `doc` key reference the correct rulebook translation key?
2. Is `version` the current document version (format: `"X.YYMMDD"`)?
3. Is `date` the correct ISO date string (`"YYYY-MM-DD"`)?
4. Is `section` the correct section translation key?
5. If data came from a **new rules update** (e.g., `Weapons_2026-03-27.docx`), update the version and date accordingly.
6. If the edit was to a **nested object** (`talents`, `racials`), the check applies to the **parent entry's** `source` — see the nested-edit rule under DataMap Integrity.

### DataMap `skill` field

When a DataMap entry references a skill (e.g. `vehiclesDataMap`), the `skill` field must hold the **exact key from `skillDataMap`** — e.g. `"drive_auto"`, `"pilot_aircraft"`. The apply function then looks up `skillDataMap[data.skill].bonus` for the sheet attribute name and `skillDataMap[data.skill].label` for the display name. Never store the sheet attribute name (e.g. `"drive_auto_mdr"`) directly in the DataMap `skill` field — that bypasses the skillDataMap and introduces a mapping layer that doesn't need to exist.

### `ancestryDataMap` — attribute floors and ceilings

```javascript
stats: { siz: { base: 35, max: 80 }, edu: { base: 40, max: 80 }, ... }
```

**`base` IS the enforced minimum.** `applyRacialBaseStats` raises any attribute
below it (`if (isNaN(current) || current < racialBase)`). No separate `min`
field exists or is needed.

Core Rules minimums: SIZ 35 default, **Veyra 25**, **Khadra 45**; EDU 40 and
INT 40 for all.

**`max` is the ANCESTRY ceiling, and it is deliberate design rather than a flat
cap** — values run 60 to 85 with per-ancestry character (Veyra SIZ 60, Lyranni
STR/SIZ 70, Khadra DEX 70, Alteri POW/APP 85, Kitsu INT 85). Several exceed the
document's universal *creation* cap of 80, so `max` reads as the **advancement**
ceiling. Do not "correct" them toward 80.

Neither bound is clamped during play. `registerStatHandler` follows the **skill
pattern**: an emptied field is restored to `base` (as
`calculateAndUpdateSkillValues` does on `isNaN`), while a value below `base` or
above `max` is left alone and flagged red-on-white via
`attr_<stat>_below_min_css` / `attr_<stat>_over_max_css`. Flagging beats
clamping here because an illegal figure the player typed should be visible, not
silently rewritten.

Caveat, unresolved: `applyRacialBaseStats` still clamps on sheet open, so a
flagged below-minimum value is forced up on reload while an over-maximum value
never is.

### `careerDataMap` — bundles and career type

```javascript
career_type: "core",              // "core" | "arcane" | "specialist"
skill_points_secondary: 20,       // the secondary-or-later skill bundle; 0 for specialist
```

Rules: a Core or Arcane career taken as a **secondary or later** career grants a
20-point skill bundle allocatable only to that career's Primary Skills and one
chosen Secondary Skill, no skill raised past 50%, and any unspent points convert
to Talent XP at 1:1 locked to that career's Talent Tree. Specialist careers get
no bundle. Primary careers have no conversion at all.

`skill_points_secondary` drives the per-row `secondary_career_bundle` CSS
controller: at `"0"` the Skill→XP input is replaced by the readonly `na-u`
placeholder, the same spacer the primary career row uses. The row update also
clears a stale `secondary_career_skill_to_xp`, because the Ledger sums it across
rows regardless of what is visible.

Two rules are **not** mechanised: the 50% ceiling on bundle-raised skills, and
the conversion being locked to that career's Talent Tree. Both are
GM-adjudicated.

### DataMap Values That Reach the Player

A DataMap value is not automatically safe to display. Three distinct failure
modes, all found in `explosivesDataMap` on 2026-08-06:

- **Prose where a key belongs.** `immunity_notes` held English sentences concatenated straight into the Condition panel, so the section could not be translated. Five entries, five strings, now `-u` keys. `C2` asserts the value ends in `-u` and that the key exists.
- **A key rendered raw.** `condition_on_fail` / `condition_on_success` hold `conditionsDataMap` keys, printed verbatim — the player saw `Fail: disoriented`. They now resolve through `conditionsDataMap[key].name_key` via `grenadeConditionLabel()`, with the raw key as a visible fallback.
- **A key that does not exist.** Three of fifteen condition references named nothing: `immobilized` (meant `entangled`), `unconscious` (not a condition at all), and `magic_suppressed` (not a condition either — and `suppressed` is a *different mechanic*, Full Auto suppressive fire, so mapping them together would be a rules error). `C1` catches these.

**Declare unresolved values, do not silently tolerate them.** `C1_EXCEPTIONS` lists the two open cases with their rationale and **self-clears**: if an exception becomes a real condition, the check fails and tells you to remove it. Copy that pattern whenever a defect cannot be fixed without an author ruling — it keeps the gap visible and bounded instead of letting it multiply.

### `weaponDataMap` — AP fields

```javascript
ap: 3,                                                    // unconditional AP
traits: ["silent", "scoped", "ap_3"],                     // display only
```

Conditional AP declares the magnitude without claiming it unconditionally:

```javascript
ap: 0,
ap_conditional: { value: 2, condition_key: "ap_2_heavy_targets" },
traits: ["tripod_required", "suppression", "ap_2_heavy_targets"],
```

All four `ap_total` derivations read `entry.ap`. Zero `/^ap_` regex derivations
remain. `W6`/`W7`/`W8` enforce: an `ap_*` trait requires a matching `ap` field
and the two must agree; an `ap` field requires a trait to display it; a trait
not of the form `ap_<n>` must declare `ap_conditional` with `ap: 0`.

### `ammoDataMap`

`ammoDataMap` was **entirely orphaned** until 2026-08-06 — the identifier appeared exactly once, its own declaration. Every ammo rule was hardcoded: the AP magnitude at ten sites, the die shift in a `reducingAmmo` array, the display name derived by stripping underscores from the key.

It is now wired through a single consumer, `ammoEffects(ammoType, ammoActive)`, returning `{ ap, dieShift, label, note }`. It returns zeroed effects for inactive ammo, `"standard"`, and unknown keys — **unknown must not throw**, since a stored value can outlive a map entry and every caller feeds either a dice expression or a display attr.

**Stored `ammo_type` values ARE `ammoDataMap` keys** as of 2026-08-06. They previously were not (`subsonic` vs `subsonic_rounds`), which made `ammoDataMap[stored]` undefined for four of six types. That fails **open**, not loud: an `ap_modifier` lookup returns 0 and looks correct, while subsonic would have silently lost its die step-down. `retiredAmmoKeyMap` + `reconcileAmmoTypes` repair stored rows; the map is append-only and permanent.

**`damage_die_shift` is constrained to `{0, -1}`.** `stepDownDie` applies exactly one step, so a `-2` would be silently under-applied. `difftest_ammo.js` rejects it as unrepresentable.

**Validate display strings before wiring them to output.** Two `name_key` values carried authoring annotations — `"AP Rounds (+AP2, −1 die)"` and `"Hollow Point (cond)"` — which would have rendered as `AP Rounds (+AP2, −1 die) · AP (2)`. Neither key was referenced from the HTML. A DataMap string being present does not mean it was written for the surface you are about to put it on.

#### Deferred vs enforceable ammo rules

Eight declared fields have no implementation. Six are **correctly** text-only — they depend on the target, which Roll20 cannot supply — and are surfaced in the roll output via `effect_summary_key` → `{{ammonote}}`, the same treatment as the tranq note: `veil_charged_rounds.damage_type_override`, `.on_fumble`, `shock_rounds.bonus_damage_condition`, `hollow_point.soak_modifier`, `breacher_slugs.structural_damage_multiplier`, `.forces_single_target`.

`subsonic_rounds.suppressed_bf_enabled` was **implemented** on 2026-08-07 (Suppressor only), leaving seven unimplemented fields rather than eight.

Two more are **enforceable sheet-side** but **deferred by author ruling
(2026-08-06)**. Unlike the six above, the sheet has the state it would need —
these are scoping decisions, not limitations, and the data stays authoritative:

| field | enforceable because | status |
|---|---|---|
| `subsonic_rounds.requires_suppressor` | the barrel state is in the same row; subsonic is currently selectable with no suppressor fitted | deferred — GM-adjudicated |
| `breacher_slugs.removes_trait: ["scatter_spray"]` / `forces_single_target` | the weapon's traits are known to the sheet | deferred — GM-adjudicated |

Do not "fix" these by deleting the fields. If `difftest_ammo.js` gains a DEFER
section, they belong in it with this rationale, the way `weaponModDataMap`'s
three deferrals are recorded.

### Lifestyle DataMap Schemas

**`districtDataMap`** — one entry per district. Keys are snake_case district names.

```javascript
district_key: {
	label:    "district_key-u",           // display name translation key
	zone:     "zone_id",                  // zone group: "arcology" | "ashfall" | "bay" | "core" | "fringe" | "midline" | "periphery" | "prestige"
	tiers:    [0, 1, 2, 0, 0, 0],        // [squatter, low, middle, high, luxury, enclave] — 0=unavailable, 1=available, 2=restricted
	cost_mod: -15,                        // integer %; 0=Base, 25=+25%, -30=-30%
	dt_mod:   -5,                         // integer DT modifier
	note_key: "district_key_note-u",      // restriction note — "" if none
	source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" },
},
```

`tiers` index map: `[0]`=squatter, `[1]`=low, `[2]`=middle, `[3]`=high, `[4]`=luxury, `[5]`=enclave. Value `2` = restricted (note shown, player can still select, GM adjudicates). `cost_mod` applies as `floor(base_cost × (1 + cost_mod / 100))`. Entries with no note use `note_key: ""`.

**`lifestyleTierDataMap`** — one entry per tier. Keys: `high`, `low`, `luxury`, `middle`, `protected_enclave`, `squatter`, `streets`.

```javascript
tier_key: {
	label:       "lifestyle_tier_key-u",
	dt_modifier: 5,                       // base DT modifier for this tier
	slots: { apartment: 3, compound: 5, residence: 4, studio: null },  // null = size unavailable at this tier
	cost:  { apartment: 20000, compound: 50000, residence: 35000, studio: null },
	source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" },
},
```

`null` in `slots` or `cost` means that size option does not exist at that tier (e.g. studio is `null` at High+). Sheet workers must guard against null combos and default size to `apartment` when tier changes to one with no studio.

**`lifestyleFeatureDataMap`** — covers both Features and Amenities. Keys are snake_case feature names.

```javascript
feature_key: {
	label:    "lifestyle_feature_key-u",
	desc_key: "lifestyle_feature_key_desc-u",
	type:     "feature",                  // "feature" | "amenity"
	slots:    1,                          // feature slot cost (2 for Medical Bay, Panic Room, Advanced Training)
	cost:     6000,                       // outright purchase cost in Cr
	upkeep:   0,                          // monthly upkeep in Cr; 0 = no upkeep
	source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" },
},
```

`upkeep: 0` means no monthly cost — do not display an upkeep field for those entries. `creature_quarters` upkeep is stored as 275 (midpoint of 150–400 Cr range); the range is documented in `_desc-u`. `automated_kitchen` upkeep (400 Cr/mo) applies at Middle tier and below only; the waiver rule is in `_desc-u` — the DataMap always stores 400.

---

## The Money Ledger and Credits

`repeating_moneyledger` is the **sole record of credits**. There is no second
balance field and no reconciliation to perform — the free-form `cash`,
`spending_level` and `assets`-as-currency reading were retired on 2026-08-18 on
the ruling that the running total already reports available credits.

### Choice semantics

`money_choice` values carry meanings the sheet does not enforce. They are
convention, and the convention matters because two queued features write rows:

| choice | meaning | side |
|---|---|---|
| `transfer_in` | money arriving free and clear — the 20,000 starting grant | credit |
| `debt` | money arriving that is **owed** — taking on a loan or a Debt tier | credit |
| `income` | earned money | credit |
| `sale` | proceeds of selling a possession | credit |
| `expense` | money leaving, **including repaying a debt** | debit |
| `purchase` | money leaving for an item | debit |
| `transfer_out` | money leaving free and clear | debit |

**Debt is the credit side, taking it on; repayment is an Expense.** Ruled
2026-08-18 after an initial reading had it backwards. This means the balance is
**cash on hand, not net worth** — it reads the same whether the character owes
nothing or owes 30,000, and nothing on the sheet records the obligation.

### Consequences for queued features

- **Todo 14 (Debt, Core Rules Ch. 4 Step 11)** — ruled 2026-08-18: the **tier
  lives as a field on the Debt feature**, alongside the holder and leverage, and
  the credit grant (+5,000 / +15,000 / +30,000) is written as a `debt` ledger
  row. The obligation gets a home; the ledger stays a pure cash book. Do not
  invent a separate credits field for it, and do not repurpose the freeform
  `debt` choice as the feature itself.
- **XP→Credits** — the `xp_credits` option in `repeating_ledger` totals into
  `xpledger_credits_cost` and the credits it buys currently land nowhere. It
  should feed or generate a `transfer_in` money ledger row.
- Nothing gates Credit against Debit per choice. Income filling Credit and
  Expense filling Debit is player discipline, not enforcement. Do not assume the
  pairing if anything downstream starts reading `money_choice`.

### Recalc behaviour

`recalcMoneyLedger` writes every row's `money_running_total` and the
sheet-level `money_balance`, and is registered on `change:` for credit and
debit, both reorder attrs, and `remove:`. It is **also called from
`afterAllSets`** as of 2026-08-18 — without that, a character whose rows had not
been edited since the handler shipped rendered blank Total cells, which became
user-visible the moment `cash` retired.

`money_balance` has no markup element. That is deliberate for now: the last
row's running total is the balance, and a summary readout is planned for the
Ledger tab when the section relocates. The attr is available for a Lifestyle
affordability readout without further work.

Row order comes from `getSectionIDsOrdered`, which honours
`_reporder_repeating_moneyledger` and appends any unlisted IDs. Verified against
a rendered screenshot 2026-08-18: iteration order matches screen order, and the
bottom row's total equals `money_balance`.

---

## The Three Tiers of Item Entry

Ruled 2026-08-18. The boundary between Gear and Possessions is decidable, and
stating it is most of what stops it feeling arbitrary:

1. **Preset** — the item is in a DataMap. Use the `…gear` table in the matching
   Gear section.
2. **Manual** — the category exists but the item does not. Use the `…manual`
   table in that same Gear section.
3. **Possessions** — no category fits at all. Use the Possessions tab.

A strange piece of surveillance kit is tier 2 (`surveillancemanual`). A family
heirloom is tier 3.

The Possessions tab carries **two row shapes mirroring Gear's two shapes**:
"Items" is the escape hatch for the plain 5-column gear row, and "Items
w/Applications" is the escape hatch for the use-tracking shape that Medtech,
Strain Compounds and Pharmaceuticals use. That is consistent design, not a
redundant tracking idiom.

The two free-form textareas (`gear_and_posessions`, `gear_and_posessions1`)
exist for **roleplay description** — flavor text and detail that will not fit a
table row. Items covers the mechanical case. Recorded because two
identically-styled adjacent textareas with near-identical attr names otherwise
read as an accident.

**Do not correct the `posessions` misspelling.** It is baked into the attr name;
renaming discards whatever players have written unless a migration ships with
it. The `-u` keys can be spelled correctly regardless — only the attrs are
stuck.

---

## HTML Architecture

### Structure Overview

```
<!-- Roll Templates (top of file, before sheet HTML) -->
<rolltemplate class="sheet-rolltemplate-*">...</rolltemplate>

<!-- Sheet HTML -->
<div class="sheet-layout">
    <!-- Top Section: Ghost Info + Characteristics -->
    <!-- Tab Navigation -->
    <!-- Tab Panels: Skills, Combat, Gear, Talents, Backstory, etc. -->
    <!-- NPC Section -->
</div>

<!-- Sheet Workers -->
<script type="text/worker">
    // DataMaps
    // Helper functions
    // Preset apply functions
    // on() event watchers
    // Init functions
</script>
```

`GoA_UI_Framework.md` holds the full structural map — every region, every tab,
line ranges, column sets, and the repeating-section inventory (64 fieldsets
across 19 tabs). Consult it before restructuring anything; it exists so that
work does not start with a re-survey.

### Naming Conventions

- Sheet attribute inputs: `name="attr_snake_case_name"`
- CSS classes: `sheet-` prefix for all custom classes (Roll20 requirement)
- Repeating section fieldsets: `class="repeating_sectionname"`
- Repeating attribute keys inside a fieldset: no prefix (Roll20 prepends automatically)
- IDs: only used for checkbox `for`/`id` pairs; use descriptive snake_case

### Tab Bar Geometry

`.sheet-tab-buttons button` is `flex: 1 1 100px; min-width: 100px;
max-width: 104.75px`. That maximum is `--cs_sheet_width` (840px) ÷ 8, which is
why the rows hold eight buttons — eight exactly fills the bar, and a shorter row
leaves ragged whitespace on the right because the container is
`justify-content: flex-start`.

**Any change to the buttons-per-row count needs that maximum changed to match**:
7 per row → 120px, 6 per row → 140px.

Two tab buttons hide at runtime, so a row can shorten without warning:

- `act_perks` hides when `attr_char_creation_lock` is checked. **Flaws stays
  visible on purpose** — Core Rules Step 9: Perks cannot be purchased after
  creation, while Flaws can be acquired through play and grant no retroactive
  XP. The worker freezes `xpledger_flaws_gain` at the lock.
- `act_spells` hides when `attr_awakened_css` is `"0"`.

A locked Mundane character therefore sees two fewer buttons than the markup
declares. Where a hiding button sits in its row is a layout decision, not an
arbitrary one.

### Theme System

Four themes are supported via CSS custom properties:

- `dark` (default)
- `light`
- `cyberpunk`
- `ancestry` (dynamic — changes based on selected ancestry)

All colors must use CSS variables defined in `:root` and overridden per theme block. **Never hard-code hex values** in layout rules; always reference a variable.

### Collapsible Sections

Pattern:
```html
<input type="checkbox" class="sheet-top-collapse" id="section_collapse" name="attr_section_collapse" value="1"/>
<h4 class="sheet-section-head-collapsible">
    <span data-i18n="section_label-u">Label</span>
    <label class="sheet-top-collapse-hit" for="section_collapse" title="Toggle section"></label>
</h4>
<div class="sheet-section-body">
    <!-- content -->
</div>
```

### Ancestry Talents Are a Four-Layer Feature

Any ancestry talent **add, rename, or removal** touches all of the following. Missing any one produces a silent partial failure:

1. **DataMap** — the entry under `ancestryDataMap[race].talents` (tier-then-alphabetical position), plus every `prerequisite` array that references the key, plus the parent ancestry entry's `source` version/date.
2. **HTML** — the main talent row in the ancestry tab (plus tier index comment and any `sheet-talent-prereq` spans naming the key), and, for `usage_limit: "session"` talents, the tracker row (`attr_show_{race}_{key}` hidden input + `sheet-tracker-item` div + tracker index comment).
3. **translation.json** — `talent_{race}_{key}-u` and `talent_{race}_{key}_rules-u`.
4. **CSS** — the per-talent visibility selector in the `/* Racial Talent Tracker - {Race} - Session */` block: `input[name="attr_show_{race}_{key}"][value="1"] ~ .sheet-{race}-{key-with-dashes}`. **The tracker row will never display without this rule**, no matter how correctly the JS writes the `show_` attr.

All sheet worker logic (watchers, XP, enables/locks, tracker mirror) is generic over DataMap keys — no per-talent JS exists or should be added.

---

## CSS Rules

- All CSS variables are defined in `:root`.
- Variables follow `--cs_category_description` naming.
- Theme overrides go in their respective theme block (`:root.sheet-theme-dark`, etc.).
- Tab indentation only.
- Group variables by logical category with inline comments.
- Never duplicate variable definitions.
- Keep layout constants (border-radius, font sizes, row heights) as variables, not magic numbers.

### CSS Section Boundaries

The CSS file is divided into named sections with start/end markers, e.g.:

```css
/* ------- Combat - Start ------- */
/* ------------------------------------ Combat - End ------------------------------------ */
/* --- Vehicles - Start --- */
/* --- Vehicle - End --- */
```

**Always read the surrounding section markers before inserting any CSS.** Insert rules inside the correct section only. Never add vehicle CSS to the Combat section, gear CSS to the Vehicle section, etc. The Combat fieldset reset block (inside the Combat section) is Combat-only — vehicle and new gear fieldset resets belong in their own sections.

**When a feature moves between tabs, its CSS moves with it.** Relocating the
Money Ledger to the Ledger tab means its `.money-*` rules leave the
`/* Gear and Inventory */` block; leaving them behind creates orphaned styling
in a section that no longer contains the feature.

### Val+Roll Pattern (sheet-val-roll-static)

When a row needs to display a numeric value that is also clickable to roll, use the existing `sheet-val-roll-static` wrapper — do **not** create separate value and button columns:

```html
<div class="flex-cell some-val-column">
    <div class="sheet-val-roll-static">
        <input type="text" name="attr_some_val_mdr" readonly/>
        <button type="roll" name="roll_some_check" value="..."></button>
    </div>
</div>
```

The CSS for `sheet-val-roll-static` already makes the button `position: absolute; opacity: 0` covering the full cell — the value is visible, the button is invisible but intercepts all clicks. The column cell needs `position: relative`. No separate button column is needed.

### Tooltip Pattern

The gear tooltip pattern uses two nested divs inside `sheet-skill-tooltip has-notes`:

```html
<div class="sheet-skill-tooltip has-notes">
    <div class="sheet-skill-tooltip-preview"><span name="attr_x_preview_mdr"></span></div>
    <div class="sheet-tooltip-bubble"><span name="attr_x_mdr"></span></div>
</div>
```

**Critical:** The bubble class is `sheet-tooltip-bubble` (no `skill-` prefix). Using `sheet-skill-tooltip-bubble` has no CSS hover rule and the bubble will never appear. The preview div uses `sheet-skill-tooltip-preview`.

For the preview to fill its container width, the tooltip and its container need:

```css
.ui-dialog .tab-content .charsheet .SECTION-effect .sheet-skill-tooltip { display: flex; width: 100%; min-width: 0; align-items: stretch; }
.ui-dialog .tab-content .charsheet .SECTION-effect .sheet-skill-tooltip-preview { flex: 1 1 0; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-dialog .tab-content .charsheet .SECTION-effect .sheet-skill-tooltip-preview span { display: block; width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
```

**Never truncate preview text in JavaScript** (no `substring`, no hardcoded `"…"`). CSS `text-overflow: ellipsis` handles all visual clipping. Truncating in JS hides the full value from the DOM and makes debugging impossible.

---

## Sheet Workers (JavaScript)

### Patterns

- All sheet workers live inside `<script type="text/worker">` at the bottom of the HTML.
- Use `const` and arrow functions throughout.
- DataMaps are declared at the top of the script block.
- Helper/apply functions follow DataMaps.
- `on()` event watchers follow helpers.
- `on('sheet:opened', ...)` init calls go at the very end.
- **On-open behavior belongs in `afterAllSets()` as explicit named-function calls** — never register `sheet:opened` handlers inside `bootstrapGlobalWatchersOnce` (that function itself runs during `sheet:opened` dispatch, so handlers registered there never fire).

### A Computed Attr Whose Only Writer Is a `change:` Handler Goes Stale

If a readonly display attr is written *only* from `change:` watchers, it is
correct only for characters edited since the watcher shipped. Everything else
renders whatever was last committed — or blank, if nothing ever was.

Found 2026-08-18 in the Money Ledger: `recalcMoneyLedger` writes every row's
`money_running_total` plus `money_balance`, and was registered on
`change:money_credit`, `change:money_debit`, both reorder attrs and `remove:`,
with no on-open call. Stored rows showed blank Total cells until a row was
touched.

The test is simple and worth applying to any new recalc: **open a character that
has the data and touch nothing.** If the display is blank or wrong, the recalc
belongs in `afterAllSets`. This is the same family as *Stored rows do not
self-heal unless something recomputes them* (`modes_available`) and
*Init parity between parallel scopes*.

### Repeating Section Pattern

```javascript
getSectionIDs("repeating_sectionname", (ids) => {
	if (!ids.length) return;
	const fetchKeys = ids.map(id => `repeating_sectionname_${id}_attr_key`);
	getAttrs(fetchKeys, (rows) => {
		ids.forEach(id => {
			const p = `repeating_sectionname_${id}_`;
			const val = rows[p + "attr_key"] || "";
			// process...
		});
	});
});
```

Where row **order** matters — anything accumulating a running total — use
`getSectionIDsOrdered`, which reads `_reporder_repeating_<section>` and appends
any IDs not listed in it. Plain `getSectionIDs` returns creation order, which is
not what the player sees once a row has been dragged.

### Preset Apply Pattern

When a `<select>` preset is chosen, an `applyXxxPreset(prefix, key)` function reads from the relevant DataMap and calls `setAttrs()` to populate related fields.

```javascript
const applyGearPreset = (prefix, key) => {
	const data = gearDataMap[key];
	if (!data) return;
	setAttrs({
		[prefix + "gear_rarity"]: data.rarity || "",
		[prefix + "gear_effect"]: tr(data.effect_key) || "",
	});
};
```

### i18n in Sheet Workers

**Never hardcode display strings in sheet worker logic.** All user-visible strings must go through `tr()`:

```javascript
const tr = (k) => (k && typeof getTranslationByKey === "function") ? (getTranslationByKey(k) || k) : (k || "");
```

This applies to:
- Condition labels (`tr("vehicle_condition_operational-u")` not `"Operational"`)
- Speed/category display maps (`tr("vehicle_speed_fast-u")` not `"Fast"`)
- Fallback strings (`tr("any-u")` not `"Any"`)
- Any computed display string written to an attr via `setAttrs`

If a translation key doesn't exist yet, **add it to `translation.json` first**, then use `tr()` in the sheet worker.

### HP / State Preservation on Init

When `initXxxPresets()` runs on `sheet:opened`, it must **not** overwrite values the player has already set (e.g. current HP). Fetch the existing value alongside the preset key and pass a `preserveState` flag:

```javascript
const initVehiclePresets = () => {
	getSectionIDs("repeating_vehiclegear", (ids) => {
		if (!ids.length) return;
		const fetchKeys = ids.flatMap(id => [
			`repeating_vehiclegear_${id}_vehicle_preset`,
			`repeating_vehiclegear_${id}_vehicle_hp_current`,
		]);
		getAttrs(fetchKeys, (rows) => {
			ids.forEach(id => {
				const p     = `repeating_vehiclegear_${id}_`;
				const key   = rows[p + "vehicle_preset"] || "";
				const hasHp = (rows[p + "vehicle_hp_current"] || "") !== "";
				if (key) applyVehiclePreset(p, key, hasHp);
			});
		});
	});
};
```

The apply function accepts `preserveHp = false` and only sets HP when `!preserveHp`.

### Attr Migration Pattern (renamed/removed DataMap keys)

When a DataMap key that players may have **checked or filled** is renamed or removed, ship a one-time migration in the same change:

```javascript
/* One-time attr migration for X renamed YYYY-MM-DD. Idempotent — old attrs
   are zeroed after transfer, so it never re-fires.
   Called from afterAllSets in initializeSheetOnOpen. */
const migrateRetiredX = () => {
	getAttrs([oldAttr, newAttr, ...trackerAttrs], (values) => {
		const updates = {};
		if (values[oldAttr] !== "1") return;
		updates[oldAttr] = "0";
		if (values[newAttr] !== "1") updates[newAttr] = "1";
		// transfer show_/used_session_ tracker state where applicable
		if (!Object.keys(updates).length) return;
		setAttrs(updates, () => {
			// recompute enables/locks against COMMITTED values — callback, not watcher
			updateTalentEnables(race);
		});
	});
};
```

- Idempotent by construction — no migration flag attr needed.
- Non-silent `setAttrs` so the existing `change:` watchers (XP, tracker mirror) fire their normal paths.
- The final recompute goes in the `setAttrs` **callback** per the committed-values rule.
- Reference implementation: `migrateRetiredAncestryTalents` (2026-07-04 talent renames).
- **Moving an `<option>` between preset `<select>`s is equally attr-affecting**, even when the DataMap key itself is unchanged. The stored value lives in an attr named after the select, so relocating the option relocates the value between attribute names and the old value silently stops resolving. Ship a reconciler pass or an attr migration with any such move, and run `validate_presets.py` before delivery. Reference implementation: `reconcileWeaponPresetSlots` (2026-08-01).

**Omitting a migration is a decision that must be stated, not a default.**
`cash` and `spending_level` were retired 2026-08-18 with no migration, on the
ruling that both were free-form leftovers and all money is already in the
ledger. The attrs orphan in the Roll20 store for existing characters — harmless
and unreachable, but a later export showing them should not be mistaken for a
defect, which is why the commit body names them.

---

### Roll20 Render Behaviour — Unmatched `<select>` Values

**Roll20 does NOT write back an unmatched `<select>` value on render.** If a stored value matches no `<option>` in the rendered select, the browser displays the placeholder but the attribute retains its original value and **no `change:` event fires**. Verified 2026-08-01 across two full sheet-open logs with zero change events and intact attrs.

This is what makes an on-open reconciler viable: a stale or misplaced value is still readable and repairable *before* the player touches the row. The value is only destroyed once the player interacts with the select, at which point Roll20 commits the browser's index-0 fallback (empty).

Practical consequence: after any change to preset select membership, the repair window is "until the player next touches that row." Ship the reconciler in the same change, not the next one.

**That rule is specific to `<select>`s. Button-driven attrs are more forgiving.** Roll20 never overwrites the stored string, so a stale value persists indefinitely and an on-open reconciler can repair it at any later date — there is no deadline. The only interim symptom is cosmetic: CSS `[value=]` rules keyed to the new name leave the button rendering unselected while the attr still holds the old value. Rename the CSS in the same commit and even that does not appear. Reference implementation: `retiredAmmoKeyMap` / `reconcileAmmoTypes` (2026-08-06).

**The same trap applies to `attr_selected_tab` and every other CSS tab controller.** The stored value drives a `[value="x"] ~ .sheet-x` rule; retire the value and no rule matches, so the bottom section renders empty with nothing to write it back. Merging or removing a tab therefore needs either an alias rule keeping the old value working, or a reconciler. Prefer the alias — two selector lines, permanent, and it cannot fail silently.

**Two-attr toggles move in lockstep.** The ammo handler writes `{type: val, active: "1"}` or `{type: "standard", active: "0"}` — there is no reachable "selected but switched off" state. Do not design logic that distinguishes them; do still gate consistently on `active === "1"`, so that attrs written outside the UI cannot make two displays disagree.

### Owned-Attr Sets Must Be Generated, Not Hand-Maintained

When a preset apply path writes N attrs, every reset path (deselect, filter change, migration) must cover the same N. Hand-maintained subsets drift: as of 2026-08-01 the weapon apply path wrote 50 attrs while the skill-change clear covered 15 and the deselect path covered 0, leaving rows half-populated and still rolling a discarded weapon.

The fix is a single declarative map consumed by all paths — `weaponPresetAttrDefaults` is the reference implementation. Each entry carries its own zero-state default, because a blanket `""` breaks any attr feeding a dice expression.

| Default | Use |
|---|---|
| `"0"` | anything inside `[[ ]]` or read via `parseInt` |
| `"10"` | `mode_num` (SS, the ×1 multiplier); `"0"` would zero the fire-mode term |
| `" "` | display spans (Roll20 may not re-render a span set to `""`) |
| `"zero"` / `"—"` | CSS sign controllers and display placeholders |
| `""` | text inputs, selects, CSS flags |

Derived attrs (e.g. the seven damage fields) are **not** listed; the blank builder calls the same helpers the apply path uses, so they cannot disagree.

Enforce with a round-trip assertion: rebuilding the attr names from the map must equal the apply path's key set exactly, **in both directions**.

Player-owned attrs (e.g. `weaponstrain_mdr`) stay out of the map — they are seeded, never reset by deselect.

**`weaponPresetAttrDefaults` does not universally reach the preset apply path.** There are two shapes in the file:

- `setAttrs(Object.assign(buildWeaponPresetBlank(scope, prefix), {...}))` — defaults flow through automatically.
- `setAttrs(Object.assign(clearOthers, strainSeed, baseDmg, effective, {...}))` — never touches the blank builder, so a new entry in the defaults map is never written here and an **explicit clear is required**.

Adding an owned attr means checking which shape each apply site uses, and asserting the explicit clear exists rather than assuming the map covers it.

### Check for an Existing Watcher Before Registering a New One

Before adding `on("change:...")`, search for the event string. If a handler is
already registered on those events, **fold the new work into it** rather than
registering a second one.

```
grep -n 'change:repeating_weaponsmdr:weapon_ammo_type_mdr' file
```

Two handlers on the same event both fire, in registration order, each with its
own `getAttrs`. That is not merely untidy: they cannot see each other's writes,
so any ordering assumption between them is silent and fragile, and a later
reader has no way to tell which one owns the attr. On 2026-08-07 a mode
recompute was registered on
`change:weapon_ammo_type_mdr change:weapon_ammo_active_mdr`, which already had
a handler doing the label, note, AP and effective-damage writes; folding it into
that handler's `setAttrs` callback both removed the duplicate and guaranteed it
reads committed values.

Assert the count after the edit — `registrations on those events: 1` — because
a duplicate is invisible at runtime until two handlers disagree.
`test_money_ledger.js` asserts exactly one handler on the credit event for the
same reason.

**A harness that stores one handler per event name silently drops duplicate
`on()` registrations.** If the test harness does `HANDLERS[ev] = fn` rather than
pushing to an array, the second registration overwrites the first and the
duplication the sheet actually has cannot be observed.

### Resolve the Firing Element From `eventInfo`

Never infer which control fired by comparing stored values. The weapon preset watcher resolved its key through a fixed `||` precedence chain and identified the active slot by value comparison, so a stale value in an earlier slot could hijack resolution and clear the select the user had just used.

Use `eventInfo.sourceAttribute` for the element and `eventInfo.newValue` for the value, with a stored-value fallback for init-driven calls. This also removes the stale-read hazard, since `getAttrs` inside a `change:` watcher may not see the triggering write.

### Init-Only Seeding Misses Rows Added Mid-Session

`initXxx` functions run on `sheet:opened`. A repeating row added during the session never passes through them, so any attr seeded only at init stays unset until the next reload — the symptom is a field that is blank when you add the row and correct after close/open.

Seed player-owned attrs on **both** the init path and the path that populates the row (usually the preset apply watcher), guarded on empty so a typed value is never overwritten.

### Init Parity Between Parallel Scopes

`weapon1` and `repeating_weaponsmdr` hold the same data under different attr names, and each has its own `init` function. Twice in one session a self-heal existed in one and not the other, and neither failure was visible until someone happened to look:

| attr | repeating | weapon1 (before) |
|---|---|---|
| `modes_available` | recomputed via `updateCapCounter` | never — kept a stale barrel cap |
| `damage_numdice` / `_dicesize` / `_bonus` | `parseDamageString` per row on open | never — stayed 0 until the field was edited |

The damage gap was spotted from a **console log asymmetry**: four `[parseDamageString] prefix:` lines for the four repeating rows and none for the static row. A missing trace line is worth chasing — it can indicate a missing *call*, not just missing logging.

**When two scopes hold the same data, diff what each `init` actually recomputes**, not just what it writes once. A rough check: list the functions each init calls and compare the sets. Anything present in one and absent in the other is either a deliberate delegation (weapon1 leaves 16 summary attrs to `refreshWeapon1Summary`) or a gap — and it should be obvious which.

### Parallel Section Functions Must Be Parameterised, Not Duplicated

`recalcWeaponManualSmartlink` and `recalcWeaponSmdrSmartlink` were two ~83-line functions whose bodies were byte-identical once the section name was normalised — one hardcoded `"repeating_weaponmanual"`, the other `"repeating_weaponsmdr"`. Two copies of a 20-key attr-fetch list is the same drift hazard that produced the 50/15/0 preset-attr gap, and they had already begun to diverge cosmetically.

Merge to `recalcWeaponSmartlink(section)` and keep the original names as one-line wrappers, so no call site moves and the blast radius stays inside the two bodies.

**Prove textual identity before merging**: canonicalise the section name in both bodies and diff. Zero residual lines means the merge is lossless. Then assert at runtime that each wrapper still calls `getSectionIDs` with *its own* section — a parameterisation bug that collapses both onto one section produces no error, just silently wrong rows.

### One Attr, Two Independent Restrictions

`weapon_modes_available_mdr` carries **two** restrictions that are computed in different places: the barrel cap (Silencer → SS only, from `barrelModeRestrict`) and the rounds-remaining gate in `updateCapCounter` (FA needs ≥3, BF ≥2). Each was written by rebuilding the attr from `modes_base`, which holds the weapon's *unrestricted* list — so whichever ran last silently discarded the other.

Symptom: fitting a Silencer to an SA-only pistol correctly showed SS, then clicking Ext Mag restored SA. Not specific to the magazine button — any cap change (firing, reloading, ticking a cap box) did the same. Latent since barrel restrictions were introduced.

Fix: `updateCapCounter` applies the barrel cap before the rounds gate, with the same empty-intersection fallback the barrel watcher uses. The barrel attr is derived by name substitution on `modesAvailAttr` (as `modesBaseAttr` already was), so none of the 13 call sites changed.

Two follow-ons the first fix missed:

- **Stored rows do not self-heal unless something recomputes them.** `initWeaponComputedAttrs` only seeded `modes_available` when it was *unset*, so rows carrying a stale value stayed wrong until the player touched a control. Both init paths now call `updateCapCounter` per row on open — idempotent, and it composes both restrictions.
- **Clamp the selection, not just the option list.** `updateCapCounter` reassigned `mode` only when *rounds* blocked it, so a Silencer left the row showing SS available with SA still selected. The test is now `!availList.includes(mode)`, which covers every reason a mode became unavailable.

**Enumerate the writers before patching one — the principle above is not self-executing.** On 2026-08-07 subsonic's suppressed-BF allowance was added to `updateCapCounter` and shipped, and the reported bug did not move: `modes_available` has **three** writers, not two. The barrel button handler computes the restriction independently through `applyBarrelModeRestriction`, and an ammo change recomputed nothing at all. Knowing the rule was not enough; the writers have to be listed.

```
grep -n 'modes_available' file          # every mention
grep -n 'updates\[.*modes_available\]' # assignments specifically
```

Then read each hit and classify it: writer, reader, or attr-name derivation. The fix is to put the composition in **one** function every writer calls — here `applyBarrelModeRestriction` gained the ammo parameters and `updateCapCounter` now delegates to it instead of duplicating the logic — rather than to patch each writer to match.

**When one attr encodes several independent rules, every writer must compose them, not recompute from the raw source.** The general alternative is to store each restriction separately and intersect on read; that is cleaner but a larger change.

### Branch on Data, Not on Code Shape

The barrel buttons existed as 15 hand-copied handlers across three scopes (143 lines): a `forEach` in `registerWeaponManualWatchers`, plus literal blocks for `repeating_weaponsmdr` and `weapon1`. The literals encoded the mode-restriction rule **structurally** — `sl`/`co`/`su` were written with the mode-restricting body, `pc`/`sb` with a plain toggle.

That is a rule expressed as code shape rather than data. A mod that newly gained a `mode_restriction` would need someone to notice and rewrite its handler by hand; nothing would fail loudly. The generated version branches at runtime on `barrelModeRestrict[barrelVal]`, which derives from `weaponModDataMap` — so the data drives the behaviour and no handler needs touching.

Merged to `registerWeaponBarrelWatchers(scope, section)`, 143 lines to 55. `weapon1` is not a repeating section (no rowId, different event name, different attr names, plus a `refreshWeapon1Summary` callback), so it takes a scope parameter and reuses `weaponPresetAttrRep` / `weaponPresetAttrW1` — the same adapter pattern as `buildWeaponPresetBlank`.

The internal-mod buttons (`bc`/`ir`/`ql`/`qt`/`sl`) and the optics buttons (`mag`/`ref`/`thm`) had the identical three-scope split. Both are the same mechanic — several buttons toggling one attr, where selecting a second clears the first — so rather than write a second near-copy they were generalised into `registerWeaponToggleWatchers`, driven by a `weaponToggleFamilies` table. Adding a family, or a button to one, is now a single table entry.

All click-button families (barrel, internal, optics, range, mode, ammo, aim) now run through two functions. The `weaponToggleFamilies` table gained a `kind` discriminator — `toggle` (one attr, click again to clear), `set` (plain assignment), `gated_set` (assign only if the mode is currently available), `ammo` (two attrs plus the tranq guard), `cycle` (two buttons over four states) — so families with genuinely different mechanics still share one registrar.

**Preserve incidental behaviour during the merge, then fix it as its own change.** The merge initially made every weapon1 family refresh the summary from the `setAttrs` callback. But `change:` watchers already cover `range_band`, `mode`, `ammo_type` and `ammo_active`, so that double-fired; only `optics` and `mod_internal` refreshed from the callback originally. A per-family `w1Refresh` flag preserved the original split exactly, keeping the consolidation purely structural.

The pre-existing double-fire (`optics`, `mod_internal` and `barrel` refreshed from BOTH the watcher and the callback — barrel three times, since it writes three watched attrs) was then removed as a separate commit: 54 cases changed, all weapon1, each click now writing only its own attr. Before the consolidation that would have been 13 edits; after, it was one line plus two flags. Verify the watcher actually covers the written attr first — `weapon1_mdr_modes_available` is NOT watched, but every barrel click also changes `weapon1_mdr_barrel`, which is.

**Normalise event names rather than special-casing them.** weapon1 mode buttons were `act_weapon1_mode_ss` (underscores) where every other weapon1 family uses hyphens, which needed an `evW1` override in the family table. CSS targets those buttons by class, not name, so renaming them to `act_weapon1-mode-ss` was HTML+JS only and let the override mechanism be deleted. Assert both directions afterwards: every registered event has a button, and every button has a registered event.

**Applicability decided by a name matching a regex is the same antipattern.** Numeric AP was derived by testing weapon traits against `/^ap_\d+$/`, so a trait named `ap_2` was unconditional while `ap_2_anything` was invisible to the numeric label — yet still set the AP-capable flag, which used the looser `startsWith("ap_")`. The rule lived in the naming convention, so renaming a trait silently changed mechanics. Fixed 2026-08-06 by declaring `ap: N` on the entry, with conditional AP as `ap_conditional: { value, condition_key }` alongside `ap: 0`. The `ap_*` trait stays for display via `traitLabelMap` but determines no number, and `W6`/`W7`/`W8` keep field and trait in agreement. Watch for this shape wherever a key's *format* rather than its *content* drives behaviour.

**When the second copy appears, generalise instead of duplicating the fix.** The optics merge could have been a third `registerWeaponXxxWatchers`; noticing it was structurally identical to the internal-mod case collapsed both into one function. Combined, the consolidations took **31 handlers and 277 lines down to 2 functions and ~90 lines**.

**Prove it with captured behaviour, not by reading.** `difftest_barrel.js` fires every button in every scope against seeded stores covering both branches and the empty-`avail` fallback, and records the resulting `setAttrs` writes. Capture a baseline with `--save` before the change and `--check` after: 135 cases, byte-identical output. This is the general recipe for consolidating watcher copies, and it is stronger than textual diffing because it covers the case where two copies *look* different but behave identically.

**Guard every `.match(...)[1]`, on values as well as `sourceAttribute`.** An unmatched pattern makes `[1]` throw a `TypeError` that kills the handler. Two distinct sites: `eventInfo.sourceAttribute.match(...)` (7 fixed) and attribute *values* such as `referenceString.match(/@{([^}]+)}/)` where the attr is unset or not an `@{}` reference (4 fixed). A scan for only the first form misses the second — grep for `.match(` followed by `[1]` regardless of receiver. All now use `?.[1]` with an early return, verified against malformed, missing and empty-store input.

**Copies drift in robustness, not just logic.** The retired internal-mod literals indexed `eventInfo.sourceAttribute.match(...)[1]` with no null check and would throw a `TypeError` on any non-matching attribute; the generated manual version had `if (!rowId) return;`. Merging adopted the guarded form. 13 unguarded `.match(...)[1]` dereferences remain elsewhere in the worker (cyberware and weapon summary handlers) — most use `?.[1]`, but a few do not.

### A Flag Describes One Branch, Not Both

`buildGrenadeSaveFailStr` tested `save_halves_damage` first and returned "half
dmg". That flag describes what a **successful** save does, so the FAIL and PASS
cells rendered identically and the failure outcome was never shown. Worse, the
early return swallowed `condition_on_fail` entirely — an incendiary grenade set
a failing target on fire and the sheet never said so.

When a boolean names the outcome of one branch, test it only in that branch and
build the other from the conditions that actually apply. Both outcomes are now
reported (`Burning + full dmg`).

Only two of thirteen entries set the flag, so the bug was invisible in the
common case — a rarely-taken branch deserves a test rather than an eyeball.

### Positional Argument Lists Over ~6 Parameters

`buildTagsStr` reached 19 positional parameters fed from 7 independently maintained `getAttrs` lists and 7 duplicated derivation blocks — **22 edits to add one trait**. Nine of the parameters were interchangeable `"1"`/`""` flags, so a transposition produced wrong output with no error, and an omitted argument arrived as `undefined` (falsy) and silently dropped the tag.

Collapse to a single declarative input table plus a generated bag (`weaponTagInputs` / `deriveWeaponTags`). The bag is complete by construction, so no consumer can read `undefined`. Cost of adding a trait drops from ~22 edits to 3, two of which are mechanically enforced.

**Prove equivalence before collapsing** — but verify the prover before trusting it. All 19 `buildTagsStr` positions and all 12 `computeWeaponDice` positions proved identical across all 7 sites. An earlier run reported `barrel` and `mode` as divergent at the barrel-toggle handler; that was **a false positive**. `collect_bindings` scanned its lookback window forward and kept the first hit, returning the *earliest* binding rather than the nearest preceding one, so `const barrel = cur === barrelVal ? "" : barrelVal` from a different function was attributed to a call site whose in-scope binding was the plain `v[p+"weapon_barrel_mdr"] || ""`. Fix: scan backward and stop at the enclosing function boundary.

An `overrides` argument was shipped on the strength of that false reading. It was harmless — it passed the same values the table derives — but it has been removed. `deriveWeaponTags` keeps the `overrides` parameter as a tested escape hatch with no current callers.

---

## Roll20 API Scripts

All `.js` files in the project root are **Roll20 API (Pro)** scripts, not browser scripts.

- They use `on('ready', ...)`, `findObjs()`, `createObj()`, `getObj()`, `setObj()`, `sendChat()` — Roll20 API globals.
- They do **not** run in the browser and cannot be imported into the sheet HTML.
- Upload them individually via the Roll20 API Script editor.

---

## Game System Reference

### Core Mechanic
Percentile (d100) skill rolls. Success = roll ≤ skill value.
- **Critical**: roll of 01 (always)
- **Extreme**: roll ≤ skill / 5
- **Hard**: roll ≤ skill / 2
- **Success**: roll ≤ skill
- **Fail**: roll > skill
- **Fumble**: roll of 100 (skill ≥ 50) or roll of 96–100 (skill < 50)

### Bonus/Penalty Dice
Roll 2d10, keep the tens die that is most favorable (bonus) or least favorable (penalty).

### Key Attributes
`STR, DEX, INT, CON, APP, POW, SIZ, EDU` — each 3–18 × 5 = 15–90 range.

### Derived Stats
- HP = (CON + SIZ) / 10 (rounded down) × 2
- Luck = POW × 5
- Movement (MOV) = derived from STR/DEX/SIZ
- Arcane Capacity (AC) = Vitality = POW − Cyberware Load, for Awakened characters only (Mundane get 0). Computed in `registerStatHandler` as `update.ac = ((iawakened === 1) ? ivit : 0)`. `attr_vitality` is written by `recalcCtVitalityTotal` as `Math.max(0, ipow - total)`; both `vitality` and `awakened` are in the handler's watched array, so installing cyberware retriggers the AC write. `attr_ac` is `readonly` because it is computed. Ghost Guide to the Arcane p.37.

**There is no Sanity system.** Zero occurrences of `sanity` in any of the three files. An earlier version of this file listed `Sanity (MP) = POW × 5`, inherited from the Call of Cthulhu base sheet; it was never true of GoA.

### Magic — School Alignment and Off-School Strain
Each Awakened character has one Primary Arcane Career, chosen on the Careers tab (`attr_primary_arcane_career`), which stores an `@{magic_X_mdr}` reference — **the career IS the school alignment**. Nine arcane careers map to nine schools; Universal has no career.

Casting outside the primary school costs a **flat +1 Strain** on top of the spell's listed cost. It is not graded by "distance" between schools — no such metric exists anywhere. Universal spells are exempt. Ghost Guide to the Arcane, PDF p.43 / printed p.37. Learning off-school also costs +2 XP (Common) or +5 XP (Rare), same page.

Doc defects to raise with the author: the Casting Quick Reference (printed p.240) states "additional Strain cost on cast" without the +1, and its Universal row says "use best Magic skill" where the p.37 body says Universal is cast using the school you trained in. Those diverge whenever a secondary school is rated above the primary. The sheet follows p.37.

### Currencies
Credits (Cr) — primary economy unit. Tracked exclusively in the Money Ledger;
see *The Money Ledger and Credits* for the choice semantics and the ruling that
retired the free-form Cash field.

---

## UI Restructure — Ruled 2026-08-17/18, Not Yet Shipped

These are author decisions with no code written. They came out of
`GoA_UI_Framework.md`. Recorded here so the sequencing survives a session
boundary.

1. **Merge Summary Text + Summary Type** into one Summary tab with a
   Source/Type grouping toggle. Both are readonly spans over the same selected
   talent set; zero attr risk. Keep the `?` rules drawer from Summary Type. The
   retired `summary_text` / `summary_type` tab values need alias CSS rules.
2. **Merge Perks + Flaws** into one tab, **Flaws above Perks**, with the
   creation lock hiding the `.sheet-perk-group` section rather than the tab
   button. The section that stays live goes above the section that disappears,
   so the tab shortens instead of gapping. The lock controller is a sibling of
   every `.sheet-tab-content`, so the existing `~` reach works with one extra
   descendant step. Retired tab value needs an alias rule. Displaying the
   **joint two-selection cap** becomes natural here and is its own behavioural
   commit — related to the unenforced +10 XP Flaw lockout and the orphaned
   `flaw5Keys` / `flaw10Keys`.
3. **Move Summary to row 1**, since all five of its sources are row-1 tabs.
4. **Rebalance to 6/6/5** with `max-width: 140px`:
   - Build — Skills, Ancestry, Background, Careers, Perks & Flaws, Summary
   - Play — Combat, Spells, Tracker, Cybertech, Gear, Vehicles
   - Records — Possessions, Lifestyle, Ledger, Backstory, NPCs
   Tracker moves to Play (it is pure play); Ledger stays adjacent to the tabs
   that spend against it.
5. **Bots & Autonomous Units and Drones & Deployables move from Gear to
   Vehicles**, which becomes **Vehicles & Drones**. They are deployable units
   currently rendering the 5-column coat shape while Vehicles carries HP, DR,
   Defense, Speed, Handling, Crew, Hardpoints and Mod Slots. Gear drops from 30
   fieldsets to 26. Section names do not change, so no attr migration.
6. **Possessions restructure** (next to ship) — retire `cash` and
   `spending_level`, relayout to full-width stacked, two new collapsibles, and
   the `inventory-u` relabel. Order: Items w/Applications, Items, Possessions
   (2 × 200px textarea), Assets (1 × 200px textarea). `.sheet-gear-flex` flips
   to `column`. `cashandassets-u` also has a typo ("Assests") and the header
   becomes just Assets.
7. **Money Ledger moves to the Ledger tab**, joining the Skill Point Tracker and
   XP Point Tracker so all three currencies (SP, XP, Cr) share one tab. Add a
   mirror of `lifestyle_monthly_total_mdr` — note it is written through
   `lsFmtCr` and is a **formatted string**, so a display mirror is fine but any
   arithmetic needs the raw number written alongside. The `.money-*` CSS moves
   with it. **Align the two ledger headers**: `repeating_ledger` is
   Choice · Value · SP Gain · Description and `repeating_moneyledger` is
   Choice · Credit · Debit · Description · Total; stacked on one tab with
   different column boundaries they will read as broken.

Deliberately **not** done: folding Vehicles into Gear (vehicle-mounted weapons
is a combat surface, and burying a live-play tab under 15 collapsibles costs a
scroll during a chase), and renaming Possessions into a container for hardware.

---

## Known Issues & Pending Work (from Todo_list.md)

### Bugs

- **`otherskill11` is declared twice as two visible rows** — line ~975 (Perform
  group) and ~2276 (Tradecraft group). Both are complete rows: checkbox, name
  input, `_skill_mdr`, `_mdr`, roll button. Typing a custom skill into one makes
  it appear in the other and the SP shows in both. There is no `otherskill13`,
  so the free-slot series is 1–12 with 11 used twice, and Etiquette
  (Ancestries) has no free slot at all. Not the `D1` class — see *Designing a
  Validator Check*. The fix is likely a new `otherskill13` for Tradecraft plus a
  ruling on whether the fixed free slots are still wanted now that
  `repeating_skillsmdr` exists.
- **The Stim Tracker meters are inert.** `attr_health_meter_1..5` and
  `attr_strain_meter_1..3` have no worker logic — no reads, no writes, no
  relationship to `attr_hp` or `attr_strain`. Their controllers
  `attr_show_health_meter` / `attr_show_strain_meter` are hardcoded `value="1"`
  in HTML and never written, so the CSS rules at `ghost_of_arcadia.css`
  ~9168–9169 always match. Their granularity (5 and 3) matches no formula on the
  sheet. Unfinished feature or vestige — needs a ruling either way.

### Pending — Next Revision Pass
1. **brawler, tactician careers** — waiting on docs.
2. **Full type/tag audit across all DataMaps** — waiting on docs. (Includes the legacy ancestry talent tag normalization: display-name tags → snake_case.)
3. **Add Ancestry Traits to Summary Text** — waiting on docs.
4. **Fix Ancestry CSS Themes** — includes the Lyranni high-contrast theme application blocks, which still contain stale light-theme values after the `:root` reorganization.
5. **Weapon rework** — the Torchwall items are parked until it lands: renaming `ap_2_heavy_targets` to name the real condition (Physical Soak ≥ 4, not a target class), adding the missing "one die type higher against light vehicles, drones and walkers" trait, and ruling on the source contradiction. `T7` and `W6`/`W7`/`W8` exist to make the rename safe.
6. **`weaponTagInputs` rename** — deferred with the weapon rework. The table now feeds `computeWeaponDice` as well as `buildTagsStr` and carries the dice-only `reduceEff`, so the "Tag" in the name no longer describes it. Renaming pollutes `git log -S 'weaponTagInputs'`, so it should be one deliberate commit rather than drift.
7. **`setup` field is orphaned** — six weapons declare a value and no code reads it. Wiring it would mechanise the Torchwall's "firing without full setup imposes two penalty dice" across all six at once. Enforceable sheet-side: setup is the character's own state, not the target's. Needs a per-row deployed control.
8. **Detonators are an unbuilt feature, not dead data.** `detonatorDataMap` has 5 entries with a full schema and **13 translation keys already written** — but zero HTML elements, zero CSS, zero code reads. `plastic_explosives`, `breaching_charge` and `arcshock_pulse_mine` all declare `requires_detonator: true`, and the sheet says a detonator is needed while giving nowhere to record which. **Do not delete it** — build the UI (a preset select in the explosives section) when the feature is wanted.
9. **Grenade condition rulings.** `knockout_gas_grenade.condition_on_fail = "unconscious"` still renders lowercase; unconsciousness may be a state (HP 0) rather than a condition. `nullburst_disruption_grenade.condition_on_fail = "magic_suppressed"` is never displayed and is dead data pending a delete-or-define ruling. Separately, `condition_duration: "dissolves_3min"` on the Scatterfoam puck renders as `dissolves_3min rd`.
10. **Orphan sweep REVERTED — eleven bindings still to adjudicate.** Reverted 2026-08-07 after `skillToXP` turned out to be a rules artefact, not dead code. `weaponTagAttrKeys` was wired up rather than deleted and stays. Remaining:
    - `flaw5Keys` / `flaw10Keys` in `registerFlawSummaryWatcher` — partition `flawDataMap` by 5- and 10-point cost. Very likely the start of the unenforced +10 XP Flaw lockout; treat as unfinished feature.
    - `talentSkills` in `calculateAndUpdateSkillValues` (a 14-line chain) and in `applyAllSkillBonuses`.
    - `iage` / `iedu` / `iwound` in `registerStatHandler` — confirm GoA has no age or wound modifier before removing.
    - `bgLimiterRegistered`, `slots` in `initWeaponComputedAttrs`, and `reflexRanges` in `buildTagsStr` are the three genuinely dead.
11. **Off-school Strain with no Primary Arcane Career selected** — ruled 2026-08-06 to stay unaligned (0). One ternary in `spellOffSchoolPenalty`.
12. **`difftest_dice.js`** — no dice equivalence proof exists in the suite. Needs the pre-refactor revision, or a transcription. Note a `difftest_dice.js` of unknown provenance appeared in the container on 2026-08-06 and was deleted unread; do not adopt it without review.
13. **Ammo effect tooltip on the on-sheet label** — effect strings run to 84 chars against a fixed 840px block, so this needs the preview + `sheet-tooltip-bubble` pattern and its own CSS commit.
14. **Debt (Chapter 4, Step 11) is an unbuilt feature — deferred 2026-08-09.** The book defines exactly one Debt, a Tier (Minor +5,000cr / Moderate +15,000cr / Major +30,000cr), and a recorded holder/leverage, never clearable via XP (p.46). **Ruled 2026-08-18: the tier lives as a field on the Debt feature, with the credit grant written as a `debt` money ledger row** — see *The Money Ledger and Credits*. Do not repurpose the freeform `debt` money choice as the feature itself; it has no tier or holder fields.
15. **Blood Debt / Debt mutual exclusivity is unenforced — deferred with Todo 14.** "Blood Debt cannot be taken alongside the Debt option in Step 11... do not stack" (p.42). The check belongs wherever the Debt tier is selected, gated on `flaw_blood_debt` being taken and vice versa.
16. **Four Ledger XP destinations have no home UI.** XP→Credits, XP→Allies, XP→Reputation and XP→Factions are selectable in `repeating_ledger` and totalled in the XP Point Tracker. Credits now has an obvious fix (write a `transfer_in` money ledger row). Allies partly overlaps Backstory contacts. **Reputation and Factions exist nowhere else on the sheet.**
17. **Gear prices exist in data and nowhere in the UI.** Every gear DataMap carries cost data; no Gear section renders it. Cybertech, Vehicles and Lifestyle all do.
18. **Call of Cthulhu vestiges in Backstory** — Phobias & Manias, Tomes/Spells/Artifacts, Encounters with Strange Entities. No GoA mechanic corresponds to any of the three. Rename or retire.

#### Shipped 2026-08-18 — money ledger on-open recalc
`recalcMoneyLedger()` added to `afterAllSets`. It was registered only on
`change:` for credit/debit, both reorder attrs and `remove:`, so stored rows
rendered blank `money_running_total` cells until a row was edited — which became
user-visible with the Cash field retiring. `test_money_ledger.js` added and
negative-tested against a mutant with the call removed. Sandbox-validated: log
and screenshot both confirmed on-open population, correct accumulation across
ten rows, and screen order matching iteration order.

#### Shipped 2026-08-07 — ammo labels and suppressed BF
`short_name_key` added to `ammoDataMap` so the 80px AMMO LOADED field stops
clipping, with full names retained in chat; the six ammo buttons i18n'd.
`subsonic_rounds.suppressed_bf_enabled` implemented — Suppressor only, by author
ruling — composed inside `applyBarrelModeRestriction` so all three writers of
`modes_available` agree. `test_subsonic_bf.js` added.

#### Shipped 2026-08-07 — careers
Primary-career Skill→XP vestiges removed (watcher, fetch entry, local) on the
rule that the conversion is secondary-or-later; Specialist secondary careers now
show N/A via the `secondary_career_bundle` controller, with the stale
conversion cleared so the Ledger stops debiting; duplicate `placeholder`
attribute dropped; `test_career_bundle.js` added.

#### Shipped 2026-08-06 — tag fetch list
`weaponTagAttrKeys` wired into `initWeaponComputedAttrs`, fixing a silenced
weapon losing its Silent tag on every sheet open; `test_tagfetch.js` added. The
orphan sweep delivered alongside it was reverted the next day — see Todo 10.

#### Shipped 2026-08-06 — grenades
Grenade display layer routed through `tr()` (7 helpers, 44 keys, skill names via
`skillDataMap`); the FAIL-cell branch bug fixed so failure and pass outcomes
differ; save-row widths reallocated 56/132/100; `immunity_notes` converted to
five `-u` keys; condition names resolved through `conditionsDataMap[key].name_key`;
`immobilized` corrected to `entangled`; checks `C1`/`C2` added.

#### Shipped 2026-08-06
Off-school Strain surcharge in both spell sections; ammo key-space rename plus
`reconcileAmmoTypes`; `ammoDataMap` wired through `ammoEffects`; the
`{{ammonote}}` roll-output row; the `computeWeaponDice` orphan sweep (53
bindings); the `trait_ap` chain removal (20 sites); AP as a `weaponDataMap`
field with `W6`/`W7`/`W8`; `T7` traitLabelMap lockstep.

### Clean-up / Questions / Wishlist
- **Doc corrections for the author**: Casting Quick Reference (printed p.240) omits the +1 Strain value and its Universal row says "use best Magic skill" where p.37 says the school you trained in; "Dravi" should be "Draevi"; Step 7's skill pool formula `(EDU × 3) + 80` is stale (the rule is `180 + (EDU × 2)`); Step 9's Ally cross-reference points at Step 11 instead of Step 10; TOC entry for Chapter 5.
- **Two `translation.json` display strings were cleaned on 2026-08-06** — `"AP Rounds (+AP2, −1 die)"` → `"AP Rounds"` and `"Hollow Point (cond)"` → `"Hollow Point"`. Neither key is referenced from the HTML. Revert if the annotations were intended for a control not yet built.
- **`cashandassets-u` reads "Cash and Assests"** — display-string typo with no attr behind it. Free fix, folded into the Possessions restructure.

---

## Lessons Learned — Do Not Repeat These Mistakes

### Formatting
- **Never use spaces for indentation.** The project uses tabs exclusively.
- **Never append to the end of `translation.json`.** All keys must be inserted in their correct alphabetical position.
- **Never append DataMap entries at the bottom of a DataMap.** Alphabetical order is required within each DataMap section.

### DataMap Integrity
- **Always check `source: {}` when editing a DataMap entry.** If the rules text changed in a newer document version, the `version` and `date` fields must be updated too.
- **Nested DataMap edits bump the parent entry's `source`.** Entries with nested objects (`ancestryDataMap[race].talents`, `.racials`, `careerDataMap[career].talents`) carry their `source: {}` at the top level of the parent entry, not per nested item. The absence of a `source` field at the layer being edited is not an exemption. When the change comes as a direct ruling from the rules author rather than a document, use the ruling date (`X.YYMMDD` with the major version unchanged).
- **DataMaps are the source of truth.** Do not patch values directly into HTML option lists, roll formulas, or sheet worker logic without updating the DataMap first.
- **Ancestry talent tags** must use snake_case (e.g. `"observation"`, not `"Observation"`). Normalization of legacy entries is part of the tracked type/tag audit; do not add new mis-cased tags.
- **DataMap `skill` field must hold the skillDataMap key**, not the sheet attribute name.

### translation.json
- **Every `data-i18n` attribute in HTML needs a matching key.** Missing keys silently show the key string instead of translated text in Roll20.
- **Every new feature needs its translation keys added first**, before the HTML is written.
- **No duplicate keys.** Roll20 may silently use whichever duplicate it encounters first.
- **Multi-key insertions must sort the whole affected range**, not append after an anchor.
- **Never round-trip `translation.json` values through `json.loads` + manual write.** `json.loads` decodes `\n` escape sequences into literal newline characters, and a manual write loop that only re-escapes `\` and `"` silently corrupts all multi-line values. Work on the **raw string**: find the alphabetical insertion point by scanning raw key lines with regex, then splice the new raw JSON line in directly. Never deserialize values — only deserialize keys for position lookup.

### HTML / Sheet Workers
- **Manual section watcher functions must be `const` arrow functions, not IIFEs.**
- **Repeating section attribute keys inside `<fieldset>` do NOT get the `attr_` prefix** — Roll20 adds `repeating_sectionname_id_` automatically. But the `name` attribute still needs `attr_` inside the fieldset.
- **CSS classes must have the `sheet-` prefix.**
- **Do not hard-code theme colors.** Always use CSS variables.
- **Checkbox values should be `value="1"`.**
- **Never hardcode display strings in sheet workers.** Every user-visible string written via `setAttrs` must use `tr()` against a translation key.
- **Never truncate text in JavaScript.** CSS `text-overflow: ellipsis` handles all visual truncation.
- **Roll names must use display attrs, not raw select values.** `@{vweapon_preset}` resolves to the DataMap key, not the display name. Write a `_name_display_mdr` attr via `tr(data.name_key)` and reference that.
- **`vweapon_effect_mdr` must hold effect/traits text, not the weapon name.**
- **Init functions must preserve player state.** Never unconditionally overwrite current HP or other player-editable values on `sheet:opened`.
- **`@{attr}` in spans inside repeating fieldsets won't resolve top-level attrs.** Write a per-row copy via the apply function and a sync watcher.
- **Prefer `select_sep_*` options over `<optgroup>` inside repeating fieldsets.** Roll20 drops the group *headers*, but the child `<option>` values still resolve and persist correctly — verified 2026-08-01. The consequence is cosmetic, not functional. Do not treat an existing `<optgroup>` as the cause of a data-loss bug.
- **All `<option>` elements in preset selects must have `data-i18n`.** The inline text is a fallback only.
- **All separator options use `select_sep_*` keys** with the `── Label ──` format. Do not reuse existing label keys.
- **`tr` is function-scoped, not module-level.** Every top-level or standalone function that calls `tr()` must declare it locally. Functions declared as `function foo()` have no access to a `tr` defined in a sibling arrow function. The definitive fix is to promote `tr` to a true module-level `const` above all DataMaps.
- **Tracker strain deduction — `tr` ReferenceError silently kills all tracker rolls.** `handleTrackerStrainDeduction` is called by every tracker checkbox `change:`. Without a local `tr`, every check throws and the roll never fires.
- **When building a new repeating section that parallels an existing one, audit every `on()` watcher that references the existing section.** `repeating_spellpreset` was built as a parallel to `repeating_spellsmdr` and the prepared-cost and XP-cost watchers were never cloned, so they silently only counted manual rows.
- **`initXxxPresets()` must only restore computed/mirror attrs — never call `applyXxxPreset` from init** where the row holds player-edited stateful values. For purely computed display attrs (name, rarity, roll type, effect text) that the player never edits, calling apply from init is correct and necessary.
- **Tooltip preview and bubble serve different purposes and must hold different values.** Preview = short terse summary; bubble = full rich description via `tr(data.effect_summary_key)`.
- **`buildXxxEffectStr` helpers may return `""` for valid presets**, which makes the bubble invisible. Use `tr(data.effect_summary_key)` for the bubble.
- **Tooltip hover area collapses when preview text is empty.** Add `min-height: var(--cs_row_height)`.
- **Absolutely-positioned buttons fill their `position: relative` ancestor, not just the visible label.** Add `width: fit-content` to the wrapper.
- **`@{attr}` in roll button `value=` strings inside repeating sections requires a `name="attr_X"` input in the same row** — **exactly one**. If a visible input already declares the attr, do not add a hidden twin.
- **Duplicate attr declarations: hidden + visible with disagreeing defaults and no worker write is a distinct bug class.** All three conditions are required. Roll20 never commits the hidden input's default, so the attr does not exist and the visible twin renders blank; a repeating row's re-render can then propagate the hidden default, so the value appears — and vanishes on reload. Plain duplication is common (197 instances sheet-wide) and usually harmless. `D1` flags only the dangerous combination. **It does not cover visible+visible duplication** — see `otherskill11` under Bugs.
- **Roll20 does NOT initialise `type="hidden"` input `value=""` defaults into the attribute store.** Always write initial values explicitly.
- **An attr used in both a dice formula and a display span must hold a valid dice expression, not a display string.** Split into two attrs. The same applies to any formatted value: `lifestyle_monthly_total_mdr` goes through `lsFmtCr` and is a display string, so arithmetic against it needs the raw number.
- **`setAttrs` with `""` may not visually clear a `<span>`.** Use `" "`.
- **DataMap `daily_limit: null` must be handled explicitly.** `String(null)` produces `"null"`.
- **Cyberware bonus stats must use the base+bonus pattern**, not write back to the raw stat. Store the player's raw value in `attr_X_base`; cyberware writes `attr_X = X_base + bonus_total`; a `change:X` watcher back-calculates `X_base`.
- **`setAttrs` callbacks fire after writes are committed; `change:` watchers fire before.** Multi-row bonus aggregation must use callbacks.
- **Double-fire from watcher + callback: remove one.** Callbacks are preferred.
- **Deselecting a preset must explicitly zero all computed bonus fields**, including hidden bonus attrs, and call the recalc in its callback.
- **Mod slot checkboxes must gate both capacity and stat bonuses.** Read `show_modN` alongside the values in the same `getAttrs`.
- **Cyberware mod slot debugging: always verify the mod slot equipped checkbox is checked first.** `cyberoptics_show_modN` must equal `"1"` or the slot is invisible to all JS logic regardless of preset. Check this before any code investigation.
- **Init with multiple async apply calls needs a barrier before the final recalc.** Set a suppress flag, then use a `getAttrs` callback as the barrier.
- **STR watcher loop: `registerStatHandler` must not write back to `attr_str`.**
- **`overflow: hidden` on an effect cell clips the absolutely-positioned tooltip bubble.** Use `overflow: visible` on the cell; clip only the preview span.
- **Mod rows in static sections need the same checkbox-gated capacity recalc as repeating sections.**
- **Regex-based HTML stripping of named block types will leave orphaned closing tags.** After any bulk HTML removal, grep for the removal marker and inspect each remnant. A stale `</div>` closes the wrong ancestor and collapses all subsequent content.

### Ancestry Talents & Session Tracker

- **Renaming or removing a DataMap talent key that players may have checked requires an attr migration shipped in the same change.** Orphaned attrs can create a checked-dependent / unchecked-prereq combination that deadlocks **both** checkboxes with no UI escape.
- **`isLocked()` locks a prereq regardless of the prereq's own checked state.** Any future attr write path must never produce checked-dependent/unchecked-prereq states.
- **The tracker row visibility is CSS-enumerated per talent.** The JS writing `show_{race}_{key} = "1"` is **not** evidence the tracker works; a console log can show the attr correctly set while the row silently never renders.
- **Never declare a file/layer out of scope based on the *kind* of change — grep every renamed or removed identifier across ALL project files.** "This is a data/HTML change, CSS isn't implicated" was exactly wrong for a talent rename.
- **When a test console log shows no trace output from a newly added function, first check whether the log predates the build.**

### CSS
- **Respect section boundaries.** Read the surrounding markers before inserting.
- **Use `sheet-val-roll-static` for value+roll columns.**
- **Tooltip bubble class is `sheet-tooltip-bubble`**, not `sheet-skill-tooltip-bubble`.
- **Never set `overflow: hidden` on the tooltip wrapper or effect cell container.**
- **Tooltip preview width requires explicit flex rules.**
- **Tooltip bubble needs `white-space: normal`** when content comes from translated DataMap text.
- **Add `min-height: var(--cs_row_height)` to tooltip wrappers for effect cells.**
- **Duplicate `flex-row` rules in the same section are harmless but must be consolidated.**
- **Roll20 CSS toggle buttons for repeating sections: use the exact impale/noimpale pattern** — one `input[type="hidden"]` with a combined value, buttons as immediate DOM siblings, `[value="X"] + button.class` adjacent sibling selectors. Two separate toggle inputs do not work.
- **Roll toggle CSS hide rules must be placed AFTER the global `button[type="roll"].new-roll { display: flex }` rule and must include `button[type="roll"]` in the selector.** Specificity: global (0,5,1); hide rules with only the class (0,4,0) lose regardless of order; with the element (0,5,1) they tie and win only when declared later; show rules at (0,6,1) beat both.
- **All flex-cell columns in a repeating section must have explicit `flex: 0 0 Xpx`** to prevent alignment drift.
- **An insert anchored on a preceding rule must not repeat that rule's text.** Count braces before and after every CSS edit.
- **Verify column pixel totals sum to 813px** (the sheet width minus borders) after any column change.

### Roll20 CSS: Per-Attribute Edit-Mode Rules Outrank State Colouring

The eight core attributes each have their **own** edit-mode rule —
`.sheet-layout .sheet-edit-controller[value="on"] ~ * input.sheet-edit-toggle-field[name="attr_siz"]`
— in both edit-on and edit-off variants, and both set `background-color` and
`color`. They sit at specificity **(0,8,1)**.

So any state colouring on those inputs must be written **against that selector
shape**, not in the usual controller-sibling form. The below-minimum flag first
shipped at (0,7,1) and never rendered, in any theme, at any file position.

`attr_bloodied_css ~ .sheet-hp-input` works only because `attr_hp` is **not**
one of the eight and has no per-stat edit-mode rule. Copying its shape onto a
stat input does not work.

The working form adds the wrapper and the controller's two attribute selectors
to the edit-mode shape, reaching (0,11,2):

```css
.ui-dialog .tab-content .charsheet .sheet-layout
  .sheet-edit-controller[value="off"] ~ * .sheet-siz-wrapper
  input[name="attr_siz_below_min_css"][value="1"] ~ input.sheet-edit-toggle-field[name="attr_siz"]
```

**Three diagnostic lessons from getting this wrong twice:**

- **A search that excludes the syntax you are looking for returns a confident zero.** The first hunt used a pattern ending `[^{\[]*`, which excludes any selector containing `[` — that is, all twenty-two of them. "No competitors found" meant "broken search", and it was read as evidence.
- **Recount specificity after every selector change.** Dropping an element+class compound to match a known-working rule took the rule from (0,7,2) to (0,7,1) — the "fix" made it strictly worse.
- **When a CSS change does not render, prove which layer is at fault before touching either.** A one-line `debug_on` log settled it in a single round; two speculative CSS rewrites preceded it and both were wasted.

**Extend the guard test in the same commit as the fix it guards.** `test_ancestry_minimums.js` asserted SIZ and INT but not EDU, because it was written while EDU was still a deferred fix. When EDU was corrected the test was not extended, so a negative test that reverted `edu.base` to 15 passed.

**Assert the relationship, not the existence.** `test_stat_minimums.js` computes the specificity of both rules and fails if the state rule does not outrank the edit-mode rule. A check that merely asserts a rule exists passes on a rule that never renders.

- **Inputs do not honour `text-overflow: ellipsis` — they clip silently.** When several inputs in one block hold very different content, a shared width is wrong in both directions. Reallocate per cell rather than widening all. Past roughly 22 characters, switch to the preview + `sheet-tooltip-bubble` pattern. Per-cell overrides can key off `input[name=]` with no markup change.

### Roll20 API Scripts
- **API scripts are server-side only.** Communication is only through attribute changes and chat messages.
- **`on('ready', ...)` is required** as the entry point. Code outside it runs before the sandbox is initialized and fails silently.

### General
- **Suspect the change you just made, but verify before blaming it.** Three separate defects in the 2026-08-01 session were assumed to originate in recent Combat commits and none did. Recent work draws attention to an area; the inspection then surfaces older issues. Use `git log -S '<identifier>'` to date a construct before attributing it.
- **Check the Todo_list.md before starting any new section.**
- **Cross-reference PDFs and .docx updates** before writing any new DataMap data. `source: {}` must reflect the actual document used.
- **The sheet width is fixed at 840px** (`--cs_sheet_width`).
- **CRLF line endings.** `ghost_of_arcadia.html`, `ghost_of_arcadia.css`, and `translation.json` use `\r\n`; `Claude.md` and `Todo_list.md` use LF. For multi-line targeted edits, use Python byte-level replacement with an `assert count == 1` uniqueness check per replacement.

### Lifestyle DataMaps
- **`districtDataMap` `tiers` array is index-ordered `[squatter, low, middle, high, luxury, enclave]`.** Never reorder it. `2` = restricted (GM adjudicates — do not block selection, show note text).
- **`cost_mod` is an integer percentage point offset, not a multiplier.** Apply as `Math.floor(base_cost * (1 + cost_mod / 100))`.
- **`lifestyleTierDataMap` `slots` and `cost` use `null` for unavailable size/tier combos.** Guard and reset size to `apartment`.
- **`lifestyleFeatureDataMap` covers both `"feature"` and `"amenity"` types.** Only `"feature"` entries contribute to the mechanical slots-used count for the DT modifier summary; both consume a slot from the residence total.
- **The zone → district cascading select pattern mirrors the weapon skill-class → preset pattern.** A hidden controller input plus eight `input[value="ZONE"] ~ .district-zone-ZONE` rules. Inside `repeating_safehouses`, scope with `.repcontainer[data-groupname="repeating_safehouses"]`.
- **Safehouse split ÷ N:** guard divide-by-zero — treat split ≤ 0 as 1.
- **`districtDataMap` `note_key: ""` means no note** — guard and write `" "` to clear.
- **`applyDistrictPreset` must call `applyLifestyleTierPreset` (not `recalcLifestyleTotals`) for the primary residence.** `recalcLifestyleTotals` reads the already-computed final cost; only `applyLifestyleTierPreset` applies the district `cost_mod`.
- **Zone change must clear all district attrs before recomputing cost** — all eight zone-specific selects, `lifestyle_district_mdr`, the note display and the DT modifier, in a single `setAttrs`, with `applyLifestyleTierPreset` in its callback.

### Roll20 CSS Sibling Selector Rules
- **CSS `~` only selects siblings with the exact same parent.** Confirm in the HTML that the controller input and the target container share the **same immediate parent element** before writing the rule.
- **Roll20 renders `<fieldset class="repeating_X">` as `<div class="repcontainer" data-groupname="repeating_X">`.** Never use `.repeating_X` as a CSS selector — it matches nothing.
- **A CSS controller input that must reach multiple repeating sections must be placed as a sibling of all their parent wrappers, not inside any one of them.** Then use `input ~ .sheet-colrow .repcontainer[data-groupname="repeating_X"] .target-class`.

### Roll20 Repeating Section Row Add Behavior
- **Roll20 does NOT fire `change:` events reliably for all attrs on new row add.** Checkboxes initialise unchecked with no stored value and no change fires. **Do not rely on any per-row watcher to initialise display state for a brand new row.**
- **Roll20 attribute names are always lowercase.** Using uppercase in an attr name causes silent failures.
- **Roll20 checkboxes must use `value="1"` for reliable change event firing.** Never rely on same-name checkboxes with different values for radio-like behaviour.
- **The most reliable add-row proxy is a select that initialises to a non-empty value, OR a fully CSS-driven approach that requires no per-row JS write at all.** The CSS-driven approach cannot race with Roll20's row initialisation sequence and is always preferable for display state.
- **`getSectionIDs` called from a `change:` watcher that fires on row add may not include the new row's ID.** Either write directly to the triggering row using its prefix from `eventInfo.sourceAttribute`, or eliminate the per-row write with a global CSS controller.
