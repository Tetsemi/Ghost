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
| `First_2_sections_GoA.pdf` | Core rulebook reference (world, skills, careers) |
| `Gear_and_Loadout.pdf` | Gear reference (cyberware, weapons, equipment) |
| `GoA_Rules_Update_Weapons_v2.docx` | Weapons rules update |
| `Weapons_2026-03-27.docx` | Latest weapons data |
| `GoA_Gear_Section_Template.docx` | Gear section template |
| `Todo_list.md` | Active bugs and pending tasks |

---

## Workflow Rules

### File Handling
- **Always copy from uploaded files** (`/mnt/user-data/uploads/`) at the start of every session. Never copy from `/mnt/project/` — that path may be stale and not reflect the user's latest edits.
- **Never overwrite mid-session.** Once working files are copied at session start, do not re-copy from uploads or project again during the same session.
- **Deliver changes as outputs** from the working copies. The user merges outputs back into the project.
- **Use `str_replace` for targeted edits** — never use large Python block replacements that reproduce entire file sections verbatim. Large replacements require matching the exact current file content and silently overwrite any user edits in that block if the match is stale.
- **Always verify which file is newer before working.** At session start, compare timestamps and sizes of uploads vs outputs: `ls -lt /mnt/user-data/uploads/ghost_of_arcadia.* /mnt/user-data/outputs/ghost_of_arcadia.*`. If outputs are newer or larger than uploads, the user has not merged the last session's output — use outputs as the base, not uploads. Blindly copying from uploads when outputs are ahead discards all intermediate fixes and recreates bugs already solved.
- **If no files are uploaded, always continue from `/mnt/user-data/outputs/`.** Never re-copy from uploads mid-session when the user simply continues without new files.
- **Verify the working base has key fixes before editing.** After copying the base file, spot-check one or two known-good markers (e.g. `grep -n "MedTech roll toggle" ghost_of_arcadia.css`) to confirm the correct version before making any changes.

---

## Verification Tooling

### Scripts

| Script | Purpose | Run when |
|---|---|---|
| `validate_presets.py` | Preset select ↔ DataMap invariants (W1–W5), spell schools (S1–S2), i18n (T1–T3), tag-layer lockstep (T4–T6), duplicate declarations (D1) | Before every delivery |
| `difftest_tags.js` | 12,096-combination differential test of `deriveWeaponTags` against the canonical derivation | After any tag-layer change |
| `verify_tag_derivations.py` | Static equivalence prover; takes `<html> <functionName>` | Before any positional collapse. Reports cleanly when a function is already converted |

Both validators exit non-zero on violation, so they drop into a pre-delivery gate.

### `node --check` Is Not Sufficient

`node --check` parses; it does **not** resolve identifiers. An undefined variable passes cleanly and throws at runtime. On 2026-08-01 a converted call site used `vals` where the callback parameter was `v`; `node --check` passed, the isolated unit test passed (it did not exercise call sites), and `refreshWeapon1Summary` threw on every sheet open.

**Any change touching variable references requires execution, not parsing.** Load the worker block into node with stubbed Roll20 globals (`on`, `getAttrs`, `setAttrs`, `getSectionIDs`, `getTranslationByKey`, `generateRowID`), then invoke the changed functions and assert no error. This also enables behavioural tests — firing a `change:` handler with a seeded store and asserting on the resulting writes.

**Corollary: confirm the test exercises the path you think it does.** A seeded-store test that accidentally hits the deselect branch returns "no error" while proving nothing about the apply branch.

### Static Analysis of JS Scope Is Unreliable

A script that walks upward for the nearest `getAttrs(..., (var) =>` will happily match a *different* enclosing function and report a confident wrong answer. The same lookback produced a **false negative** (wrong variable) and a **false positive** (prefix bound outside the lookback window) in a single run — and separately, a forward-scanning binding collector returned the *earliest* rather than the nearest binding, manufacturing a divergence that did not exist and leading to a redundant `overrides` argument being shipped.

Two rules follow. Resolve bindings by scanning **backward** from the use site, stopping at the enclosing function boundary. And confirm every result against the actual line before acting on it — a prover that has been wrong once must be re-verified, not trusted because it agrees with the previous run.

### Designing a Validator Check

A check that fires on hundreds of pre-existing instances is **worse than no check** — it trains everyone to ignore the output. The first duplicate-declaration rule flagged 197 instances; narrowing to the precise failure signature (hidden + visible + disagreeing defaults + never written) reduced it to 2, both real bugs.

**Negative-test every new check against the actual bug that motivated it**, and reconstruct the true pre-fix state to do so. A first attempt at negative-testing D1 reinstated the duplicate declaration but not the missing seed; the check correctly did not fire, which proved nothing. Only with both conditions restored did it catch the original defect.

**Verify the mutation actually happened.** A later negative test of T4/T5 reported PASS on both mutated files — because the harness read the CRLF source without `newline=""`, so Python translated the line endings and the `\r\n` patterns matched nothing, leaving the files byte-identical to the original. Always assert the mutation took effect (key count, substring presence) before interpreting the check's verdict.

### Byte-Level Edits

`assert count == exp` on every replacement caught three wrong-target edits in one session, including a 4-tab pattern that matched as a **substring** inside a 5-tab line — which happened to be the one call site needing different handling. Anchor on the preceding newline or a following distinctive line when a pattern could match at multiple indent depths.

Regex replacement across a CRLF file needs the same line-ending discipline as `str_replace`: a `\n` in a replacement string silently introduces a bare LF. Always re-check `bare LF == 0` after any regex-based edit. Note `Claude.md` itself uses **LF**, while the three sheet files use **CRLF**.

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

## translation.json Rules

- **Strictly alphabetical** by key. No exceptions.
- All keys use `-u` suffix for user-facing strings.
- Roll text keys use `-r-txt` suffix.
- Description keys use `_desc-u` suffix.
- All strings are in English (i18n-ready format).
- When adding a new feature, add **all** required translation keys before touching the HTML.
- Never duplicate a key.
- Check that every `data-i18n="key-u"` attribute in HTML has a corresponding entry in `translation.json`.
- **When inserting many keys across a range**, extract the full affected key range, add the new entries, sort the combined set, and write it back. Never use an anchor-after insertion strategy for multi-key additions — it produces out-of-order clumps.

### Key Naming Conventions

| Pattern | Use |
|---|---|
| `feature_name-u` | Display label |
| `feature_name_desc-u` | Tooltip / description body |
| `feature_name-r-txt` | Roll template text |
| `feature_name_rules-u` | Talent/ability rules text |
| `gear_item_name-u` | Gear item display name |
| `talent_ancestry_talent_key-u` | Ancestry talent name |
| `talent_ancestry_talent_key_rules-u` | Ancestry talent rules |

### Talent Rules Text Format

All `talent_*_rules-u` values follow one canonical format:

```
Type: {Economy} ({Tag Display Name}) • Cost: {— | 1d6 Strain | ...} • Usage: {At-will | 1/Scene | 1/Session} — {rules body}
```

Use the bullet `•` between segments and an em dash `—` before the body. Use typographic apostrophes (`'`) in rules bodies to match existing entries.

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

### Naming Conventions

- Sheet attribute inputs: `name="attr_snake_case_name"`
- CSS classes: `sheet-` prefix for all custom classes (Roll20 requirement)
- Repeating section fieldsets: `class="repeating_sectionname"`
- Repeating attribute keys inside a fieldset: no prefix (Roll20 prepends automatically)
- IDs: only used for checkbox `for`/`id` pairs; use descriptive snake_case

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

---

### Roll20 Render Behaviour — Unmatched `<select>` Values

**Roll20 does NOT write back an unmatched `<select>` value on render.** If a stored value matches no `<option>` in the rendered select, the browser displays the placeholder but the attribute retains its original value and **no `change:` event fires**. Verified 2026-08-01 across two full sheet-open logs with zero change events and intact attrs.

This is what makes an on-open reconciler viable: a stale or misplaced value is still readable and repairable *before* the player touches the row. The value is only destroyed once the player interacts with the select, at which point Roll20 commits the browser's index-0 fallback (empty).

Practical consequence: after any change to preset select membership, the repair window is "until the player next touches that row." Ship the reconciler in the same change, not the next one.

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

### Resolve the Firing Element From `eventInfo`

Never infer which control fired by comparing stored values. The weapon preset watcher resolved its key through a fixed `||` precedence chain and identified the active slot by value comparison, so a stale value in an earlier slot could hijack resolution and clear the select the user had just used.

Use `eventInfo.sourceAttribute` for the element and `eventInfo.newValue` for the value, with a stored-value fallback for init-driven calls. This also removes the stale-read hazard, since `getAttrs` inside a `change:` watcher may not see the triggering write.

### Init-Only Seeding Misses Rows Added Mid-Session

`initXxx` functions run on `sheet:opened`. A repeating row added during the session never passes through them, so any attr seeded only at init stays unset until the next reload — the symptom is a field that is blank when you add the row and correct after close/open.

Seed player-owned attrs on **both** the init path and the path that populates the row (usually the preset apply watcher), guarded on empty so a typed value is never overwritten.

### Parallel Section Functions Must Be Parameterised, Not Duplicated

`recalcWeaponManualSmartlink` and `recalcWeaponSmdrSmartlink` were two ~83-line functions whose bodies were byte-identical once the section name was normalised — one hardcoded `"repeating_weaponmanual"`, the other `"repeating_weaponsmdr"`. Two copies of a 20-key attr-fetch list is the same drift hazard that produced the 50/15/0 preset-attr gap, and they had already begun to diverge cosmetically.

Merge to `recalcWeaponSmartlink(section)` and keep the original names as one-line wrappers, so no call site moves and the blast radius stays inside the two bodies.

**Prove textual identity before merging**: canonicalise the section name in both bodies and diff. Zero residual lines means the merge is lossless. Then assert at runtime that each wrapper still calls `getSectionIDs` with *its own* section — a parameterisation bug that collapses both onto one section produces no error, just silently wrong rows.

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
- Sanity (MP) = POW × 5
- Luck = POW × 5
- Movement (MOV) = derived from STR/DEX/SIZ

### Currencies
Credits (Cr) — primary economy unit.

---

## Known Issues & Pending Work (from Todo_list.md)

### Bugs
- None currently tracked.

### Pending — Next Revision Pass
1. **brawler, tactician careers** — waiting on docs.
2. **Full type/tag audit across all DataMaps** — waiting on docs. (Includes the legacy ancestry talent tag normalization: display-name tags → snake_case.)
3. **Add Ancestry Traits to Summary Text** — waiting on docs.
4. **Fix Ancestry CSS Themes** — includes the Lyranni high-contrast theme application blocks, which still contain stale light-theme values after the `:root` reorganization.

### Clean-up / Questions / Wishlist
- Empty.

---

## Lessons Learned — Do Not Repeat These Mistakes

### Formatting
- **Never use spaces for indentation.** The project uses tabs exclusively. Mixing causes visual inconsistency and diff noise.
- **Never append to the end of `translation.json`.** All keys must be inserted in their correct alphabetical position. Out-of-order keys have been a recurring source of review churn.
- **Never append DataMap entries at the bottom of a DataMap.** Alphabetical order is required within each DataMap section.

### DataMap Integrity
- **Always check `source: {}` when editing a DataMap entry.** If the rules text changed in a newer document version, the `version` and `date` fields must be updated too. Stale source metadata has caused confusion about which rulebook version the sheet reflects.
- **Nested DataMap edits bump the parent entry's `source`.** Entries with nested objects (`ancestryDataMap[race].talents`, `.racials`, `careerDataMap[career].talents`) carry their `source: {}` at the top level of the parent entry, not per nested item. Any add/rename/remove/rules-text change inside the nested objects requires updating the parent's `version` and `date` in the same change — the absence of a `source` field at the layer being edited is not an exemption. When the change comes as a direct ruling from the rules author rather than a document, use the ruling date (`X.YYMMDD` with the major version unchanged) and confirm the number if a formal doc revision follows.
- **DataMaps are the source of truth.** Do not patch values directly into HTML option lists, roll formulas, or sheet worker logic without updating the DataMap first. Discrepancies between the DataMap and the HTML have caused bugs that were hard to trace.
- **Ancestry talent tags** (in `ancestryDataMap[race].talents`) — new entries must use snake_case tags (e.g. `"observation"`, not `"Observation"`). The normalization of the legacy entries is part of the tracked type/tag audit; do not add new mis-cased tags.
- **DataMap `skill` field must hold the skillDataMap key**, not the sheet attribute name. Use `skillDataMap[data.skill].bonus` in the apply function to get the attr name. Never store `"drive_auto_mdr"` directly — store `"drive_auto"` and look it up.

### translation.json
- **Every `data-i18n` attribute in HTML needs a matching key in `translation.json`.** Missing keys silently show the key string instead of translated text in Roll20.
- **Every new feature needs its translation keys added first**, before the HTML is written, to avoid forgetting them.
- **No duplicate keys.** Roll20 may silently use whichever duplicate it encounters first, leading to subtle display bugs.
- **Multi-key insertions must sort the whole affected range**, not append after an anchor. Use Python to extract the range, merge, sort, and write back.
- **Never round-trip `translation.json` values through `json.loads` + manual write.** `json.loads` decodes `\n` escape sequences into literal newline characters. A manual write loop that only re-escapes `\` and `"` will silently corrupt all multi-line values (rule text, talent descriptions, etc.), producing invalid JSON. The only safe pattern for inserting new keys is to work on the **raw string**: find the correct alphabetical insertion point by scanning raw key lines with regex, then splice the new raw JSON line in directly. Never deserialize values — only deserialize keys for position lookup.

### HTML / Sheet Workers
- **Manual section watcher functions must be `const` arrow functions, not IIFEs.**
- **Repeating section attribute keys inside `<fieldset>` do NOT get the `attr_` prefix** — Roll20 adds `repeating_sectionname_id_` automatically. But the `name` attribute still needs `attr_` inside the fieldset — be precise.
- **CSS classes must have the `sheet-` prefix.** Roll20 sandboxes the sheet CSS and strips classes without this prefix in some contexts.
- **Do not hard-code theme colors.** Always use CSS variables. Hard-coded colors break when the theme switches.
- **Checkbox values should be `value="1"`.**
- **Never hardcode display strings in sheet workers.** Every user-visible string written via `setAttrs` must use `tr()` against a translation key. This includes condition labels, speed categories, mod categories, fallback strings like "Any", and any computed display value. If the key doesn't exist, add it to `translation.json` first.
- **Never truncate text in JavaScript.** No `substring()` with hardcoded lengths, no appending `"…"`. CSS `text-overflow: ellipsis` handles all visual truncation. JS truncation hides the real value from the DOM and makes the problem invisible to debugging tools.
- **Roll names must use display attrs, not raw select values.** `@{vweapon_preset}` resolves to the DataMap key (e.g. `apex_aa_scattercannon`), not the display name. Always write a `_name_display_mdr` attr via `tr(data.name_key)` in the apply function and reference that in roll formulas.
- **`vweapon_effect_mdr` must hold effect/traits text, not the weapon name.** In `applyVehicleWeaponPreset`, `effectFull` should be built from traits/effect data, not from `tr(data.name_key)`.
- **Init functions must preserve player state.** Never unconditionally overwrite current HP or other player-editable values on `sheet:opened`. Fetch existing values and use a `preserveState` flag.
- **`@{attr}` in spans inside repeating fieldsets won't resolve top-level attrs.** If a repeating row needs to display a top-level character attribute (e.g. `gunnery_mdr`), write a per-row copy of that value as a hidden attr via the apply function and a sync watcher on `change:gunnery_mdr`.
- **Prefer `select_sep_*` options over `<optgroup>` inside repeating fieldsets.** Roll20 drops the group *headers*, but the child `<option>` values still resolve and persist correctly — verified 2026-08-01: `talon_s10_apex` is stored in `weapon_preset_smg_mdr`, whose select uses `<optgroup>`, and it renders and reloads correctly. The consequence is cosmetic (no visual grouping), not functional. Use `<option value="" disabled data-i18n="select_sep_KEY-u">── Label ──</option>` separators for consistency, but **do not treat an existing `<optgroup>` as the cause of a data-loss bug** — an earlier version of this rule claimed options were stripped entirely and sent an investigation down a false path.
- **All `<option>` elements in preset selects must have `data-i18n`.** This applies to both preset item options and separator options. The inline text is a fallback only — the displayed text comes from the i18n key. Follow the ancestry select pattern: `<option data-i18n="key-u" value="value">Fallback Text</option>`.
- **All separator options use `select_sep_*` keys** with the `── Label ──` format. Do not reuse existing keys (e.g. `armor_group_underlayer-u`, `vehicle_arcbikes-u`) for separators — those keys resolve to plain label text without the `──` decoration. The canonical separator key prefix is `select_sep_` and all values follow the `── Label ──` pattern exactly.
- **`tr` is function-scoped, not module-level.** Every top-level or standalone function that calls `tr()` must declare it locally: `const tr = (k) => (k && typeof getTranslationByKey === "function") ? (getTranslationByKey(k) || k) : (k || "");`. Functions declared as `function foo()` have no access to a `tr` defined in a sibling arrow function. The recurring failure mode is adding `tr()` calls inside an existing function without checking whether that function already has `tr` in scope. Always check before using it. The definitive long-term fix is to promote `tr` to a true module-level `const` at the top of the script block, above all DataMaps.
- **Tracker strain deduction — `tr` ReferenceError silently kills all tracker rolls.** `handleTrackerStrainDeduction` is called by every tracker checkbox `change:` event. If `tr` is used inside it without being declared in its scope, every tracker item check throws `ReferenceError: tr is not defined` and the roll never fires — the checkbox checks, nothing appears in chat. Always declare `tr` at the top of `handleTrackerStrainDeduction` and any other top-level handler function.
- **When building a new repeating section that parallels an existing one, audit every on() watcher that references the existing section and ask whether the new section needs the same.** For example, repeating_spellpreset was built as a parallel to repeating_spellsmdr, but the prepared-cost and XP-cost watchers were never cloned — they silently only counted manual rows. The rule: for every on("change:repeating_OLD_SECTION:...") watcher that computes a sheet-level aggregate (total_spellcost, spell_xp_spent, etc.), check whether the new section contributes to that same aggregate and if so expand the watcher to include both sections via nested getSectionIDs. This applies to any future parallel sections — medical gear, pharmaceuticals, cyberware, etc.
- **`initXxxPresets()` must only restore computed/mirror attrs — never call `applyXxxPreset` from init.** The init function runs on every `sheet:opened`. Calling `applyXxxPreset` from init re-fetches skill values and overwrites all preset display attrs, resetting the skill value and any other player-visible state to whatever the DataMap says at open time. The correct pattern: init only writes attrs that cannot persist on their own (e.g. `school_mirror` for CSS visibility). All other attrs are already stored in the sheet from when the player selected the preset — leave them alone. Add a separate `change:SKILL_ATTR` watcher to keep `skill_val_mdr` current when the underlying skill changes.
- **Tooltip preview and bubble serve different purposes and must hold different values.** The `_preview_mdr` attr holds the short terse summary (shown truncated inline). The `_mdr` bubble attr holds the full rich description (shown on hover). For gear sections backed by a DataMap with an `effect_summary_key`, write `tr(data.effect_summary_key)` to the bubble attr and the short constructed string to the preview attr. Never write the same value to both — the bubble text should be the full translated DataMap description.
- **`buildXxxEffectStr` helper functions may return `""` for valid presets.** For example, `buildGrenadeEffectStr` returns an empty string for presets whose damage type is `"structural"` with no save condition. If this empty string is written to the bubble attr, the bubble appears but is invisible. Always use `tr(data.effect_summary_key)` for the bubble when the DataMap entry has one. The short helper output is appropriate only for the inline preview.
- **Tooltip hover area collapses when preview text is empty.** If the preview span has no text content, the `display: inline-flex` tooltip wrapper collapses to zero height and there is nothing to hover over even though the `has-notes` class is present. Add `min-height: var(--cs_row_height)` to the scoped `.SECTION-effect .sheet-skill-tooltip` rule so the hover target always fills the row.
- **Absolutely-positioned buttons fill their `position: relative` ancestor, not just the visible label.** When a wrapper div spans `grid-column: 1 / -1` (full grid width) and has `position: relative`, an `opacity: 0; position: absolute; width: 100%; height: 100%` button inside it makes the entire row clickable. Fix: add `width: fit-content` (and `margin: 0 auto` if centering is needed) to the wrapper so the absolute button only covers the label element.
- **`@{attr}` in roll button `value=` strings inside repeating sections requires a `name="attr_X"` input in the same row.** Roll20 resolves `@{attr}` in roll formulas by looking for a named input within the repeating row's DOM scope. Attrs that only exist as `<span>` display elements or are only written via `setAttrs` without a corresponding `name="attr_X"` input will produce "No attribute found" errors at roll time. Every attr referenced in a `type="roll"` button `value=` string must have **exactly one** named element inside the same fieldset row `<div>`. If a visible input or `<select>` already declares the attr, do **not** add a hidden twin — the attr needs *initialising*, not a second declaration. See "Duplicate attr declarations" below.
- **Duplicate attr declarations: hidden + visible with disagreeing defaults and no worker write is a distinct bug class.** All three conditions are required. Roll20 never commits the hidden input's default, so the attr does not exist and the visible twin renders blank; a repeating row's re-render can then propagate the hidden default, so the value appears — and vanishes on reload. In a non-repeating block (e.g. `weapon1`) there is no row re-render, so the same defect presents differently, which masks the shared cause. Two instances found 2026-08-01: `weaponstrain_mdr` (hidden `"0"` + visible text) and `grenade_preset_mdr` (hidden `""` + select); both fixed by deleting the hidden twin. Plain duplication is common (197 instances sheet-wide) and usually harmless because a watcher keeps both in sync — check `D1` in `validate_presets.py` flags only the dangerous combination.
- **Roll20 does NOT initialise `type="hidden"` input `value=""` defaults into the attribute store.** The HTML `value="X"` on a hidden input is just a DOM default — Roll20 only persists attrs that have been explicitly written via `setAttrs`. If an attr has never been set, `getAttrs` returns `""` and the DOM attribute may be inconsistent. Always explicitly write initial values from `applyXxxPreset` or from `initXxxPresets` on `sheet:opened`. Never rely on HTML defaults for attrs that are read by roll formulas or CSS `[value=]` selectors.
- **An attr used in both a dice formula and a display span must hold a valid dice expression, not a display string.** If the same attr feeds into `{{diceroll=[[@{attr}]]}}` AND is shown in a `<span name="attr_X">`, setting it to a human-readable string like `"—"` or a translation key will cause a Roll20 dice parse error (`Expected "(", "f" or [0-9]`). Split into two attrs: one holding the dice-safe value (e.g. `"1d6+3"` or `"0"`), another holding the display string. Use the dice attr in roll formulas and the display attr in the span.
- **`setAttrs` with `""` (empty string) may not visually clear a `<span>` in Roll20.** The rest of this sheet consistently uses `" "` (a single space) when clearing display attrs, not `""`. Roll20 may not re-render a span when the attr is set to empty string vs a previous truthy value. Use `" "` for all display fields that should appear blank, matching the pattern used throughout the codebase.
- **DataMap `daily_limit: null` must be handled explicitly in apply functions.** `String(null)` produces `"null"`, which would display literally. Always guard: `entry.daily_limit !== null ? String(entry.daily_limit) : " "`.

- **`initXxxPresets` calling `applyXxxPreset` is correct for new sections that have no prior attr state.** The Claude.md rule about init not calling apply is specifically about not overwriting player-edited stateful values like current HP. For computed display attrs (name, rarity, roll type, effect text) that the player never edits directly, calling apply from init is correct and necessary — without it, rows created before the hidden input elements existed in HTML will have empty formula attrs on every reload.

- **Cyberware bonus stats (STR, HP, unarmed damage) must use the base+bonus pattern, not write back to the raw stat.** Store the player's raw entered value in a separate `attr_X_base` hidden input. Cyberware writes `attr_X = X_base + bonus_total`. When the player manually edits X, a `change:X` watcher back-calculates `X_base = X - bonus_total`. This prevents runaway loops and correctly separates player intent from cyberware contribution. Never write bonus totals directly into the stat and expect the existing stat handler to sort it out — it creates circular watcher chains.

- **`setAttrs` callbacks fire after writes are committed; `change:` watchers fire before.** When a recalc function needs to read attrs that were just written by `setAttrs`, it must be called in the `setAttrs` **callback**, not via a `change:` watcher on those attrs. Watchers fire before the write is readable by `getAttrs`, causing stale reads. This is especially critical for multi-row bonus aggregation (HP totals, STR totals, capacity used) — always use callbacks, never watch the computed output attrs.

- **Double-fire from watcher + callback: remove one.** If an `applyXxxPreset` function both (a) writes an attr that triggers a `change:` watcher which calls `recalcXxx`, AND (b) calls `recalcXxx` explicitly in its `setAttrs` callback, the recalc fires twice. Choose one path only — callbacks are preferred because they guarantee committed values.

- **Deselecting a preset must explicitly zero all computed bonus fields.** When the preset select returns to blank, the `change:preset` watcher must write `"0"` (or `" "` for display attrs) to every field the apply function would have set — including hidden bonus attrs like `int_str_bonus`, `int_hp_bonus`, `int_unarmed_bonus`, `limb_str`. If these are not zeroed, the old values persist in the attr store and `recalcXxx` reads stale data. The deselect `setAttrs` must also call `recalcXxx` in its callback.

- **Mod slot checkboxes must gate both capacity and stat bonuses.** When a mod slot has a checkbox that marks it as "installed", the capacity recalc and any stat bonus recalc must both check that checkbox before counting the mod's contribution. Read `show_modN` alongside `modN_capreq` and `modN_limb_str` in the same `getAttrs` call, and only accumulate when checked. Add `change:show_modN` watchers that fire both the capacity recalc and the bonus recalc. On init, gate `applyLimbModPreset` on the checkbox and explicitly write `limb_str: "0"` for unchecked mods even when the preset is set.

- **Cyberware mod slot debugging: always verify the mod slot equipped checkbox is checked first.** `cyberoptics_show_modN` must equal `"1"` or the slot is invisible to all JS logic regardless of preset. Check this before any code investigation.

- **Init with multiple async apply calls needs a barrier before the final recalc.** When `initXxxPresets` calls `applyXxxPreset` and `applyLimbModPreset` for multiple rows and slots in a loop, all those `setAttrs` calls are queued. The final `recalcCywerwareBonuses` must not fire until all writes are committed. Pattern: set `cwSuppressRecalc = true` before the loop, set it `false` after, then use a `getAttrs(barrier_keys, () => recalcXxx())` call — Roll20 processes `setAttrs` and `getAttrs` sequentially, so the `getAttrs` callback fires only after all prior `setAttrs` have committed.

- **STR watcher loop: `registerStatHandler` must not write back to `attr_str`.** If `attr_str` is in the watched array and `registerStatHandler` also writes `update["str"]`, every write triggers the watcher again — infinite loop. The fix: write `attr_str` outside `registerStatHandler` entirely (from `recalcCywareBonuses` using `str_base + bonus`), and keep `attr_str` in the watched array only so `registerStatHandler` fires when the player edits it manually to update damage bonus thresholds. `registerStatHandler` reads `attr_str` but never writes it.

- **`overflow: hidden` on an effect cell clips the absolutely-positioned tooltip bubble.** The bubble uses `position: absolute` and escapes its parent via stacking context, but `overflow: hidden` on any ancestor in the same stacking context clips it. Always use `overflow: visible` on the effect cell container — clip only the preview span itself. Match the pattern of the existing `cw-effect-cell` rule which explicitly sets `overflow: visible`.

- **Mod rows in static sections (optics, audio) need the same checkbox-gated capacity recalc as repeating sections.** `recalcOpticsCapacityUsed` and `recalcAudioCapacityUsed` originally summed all 8 mod capreq values unconditionally. They must read `cyberoptics_show_modN` / `cyberaudio_show_modN` alongside capreq and only count checked mods. Add `change:cyberoptics_show_modN` and `change:cyberaudio_show_modN` watchers calling the respective recalc.

- **Every new translation key referenced by `data-i18n` must exist in `translation.json` before the HTML is deployed.** A missing key silently renders the raw key string. When adding a column header like `cw_mod_equipped-u`, add the key to `translation.json` first in its correct alphabetical position. Do not assume a similar-sounding key (e.g. `armor_equipped-u`) can be reused — each section should have its own scoped key.

- **Regex-based HTML stripping of named block types will leave orphaned closing tags.** When using regex to remove `<div class="cw-manual-row">...</div>` blocks, the regex matches the opening tag and content but may not correctly match the closing `</div>` if indentation or line endings vary. Always verify after removal that no orphaned `</div>` tags or stale comments remain. A stale `</div>` closes the wrong ancestor and collapses all subsequent content into a flat layout. After any bulk HTML removal, grep for the removal marker (e.g. the comment text) and manually inspect each remnant.

- **CSS `~` sibling selector works for mod detail rows in both static and repeating section contexts.** In static sections (optics, audio), the pattern is `section-class input[name="attr_show_modN"]:checked ~ .detail-class`. In repeating sections (cyberlimbs), scope to the repcontainer: `.repcontainer[data-groupname="repeating_X"] input[name="attr_show_modN"]:checked ~ .detail-class`. The `~` resolves the input element anywhere in the subtree and finds subsequent siblings — the input does not need to be a direct sibling of the detail row.

- **Effect preview text shows from the end instead of the start when the container has no hard width constraint.** `text-overflow: ellipsis` only clips from the right when the element has a definite width to overflow against. If the parent `flex` container can grow, the span has no wall to clip against and renders all text (effectively right-aligned). Fix: set `overflow: hidden` on the **preview span** (not the cell), and ensure the cell has `flex: 1 1 0; min-width: 0` so flex constrains it. Do not set `overflow: hidden` on the cell itself — that clips the bubble.

- **Adding an Effect column to mod rows (optics, audio, cyberlimbs) follows the same pattern as the cyberlimb suite row.** Add a `cw-mod-effect-cell` flex cell after the Cost column in every mod row and the mod sub-header. Set `flex: 1 1 0` so it fills remaining space. Place the `sheet-skill-tooltip has-notes` inside it with preview and bubble spans. Scope CSS to `.cw-mod-effect-cell` — do not add tooltip markup inside the Name cell's select wrapper.

### Ancestry Talents & Session Tracker

- **Renaming or removing a DataMap talent key that players may have checked requires an attr migration shipped in the same change.** The enable/lock system assumes states that are only reachable through the UI. Orphaned attrs can create a checked-dependent / unchecked-prereq combination that deadlocks **both** checkboxes with no UI escape: the dependent's `_enabled` goes `"0"` (prereq unsatisfied, so it can't be unchecked), and the new prereq's `_lockflag` goes `"1"` (`isLocked()` sees the checked dependent, so it can't be checked). Toggling any other talent cannot break the cycle. Use the Attr Migration Pattern (see Sheet Workers section); reference implementation: `migrateRetiredAncestryTalents`.
- **`isLocked()` locks a prereq regardless of the prereq's own checked state.** It only asks whether a checked dependent relies on it. This is invisible in normal play (a checked dependent implies the prereq was checked) but is exactly what turns orphaned migration state into a deadlock. Any future attr write path (migration, API script, import) must never produce checked-dependent/unchecked-prereq states.
- **The tracker row visibility is CSS-enumerated per talent** — `input[name="attr_show_{race}_{key}"][value="1"] ~ .sheet-{race}-{key}` in the per-race `/* Racial Talent Tracker */` blocks. The JS writing `show_{race}_{key} = "1"` is **not** evidence the tracker works; a console log can show the attr correctly set while the row silently never renders because no CSS rule exists for that attr name. Only `usage_limit: "session"` talents get tracker rows and CSS rules; at-will passives get neither.
- **Never declare a file/layer out of scope based on the *kind* of change — grep every renamed or removed identifier across ALL project files.** "This is a data/HTML change, CSS isn't implicated" was exactly wrong for a talent rename: the tracker CSS enumerates attr names. The cheap safeguard after any rename/removal: `grep` for every old key, old attr name, and old CSS class (both snake_case and dash-case forms) across `ghost_of_arcadia.html`, `ghost_of_arcadia.css`, and `translation.json`, and confirm zero residual occurrences.
- **When a test console log shows no trace output from a newly added function, first check whether the log predates the build.** Trace logging (`debug_on_trace`) prints Start lines for every named function; a missing Start line with trace on means either the function isn't in the loaded sheet or the log is from an older sheet version. Compare the log export timestamp against the output file timestamp before debugging the code.

### CSS
- **Respect section boundaries.** Always read the surrounding section start/end markers before inserting CSS. The Combat section fieldset reset block is Combat-only. Vehicle fieldset resets go in the Vehicle section. New gear sections get their own resets in the Gear section.
- **Use `sheet-val-roll-static` for value+roll columns.** Never create a separate button column next to a value column — merge them using the existing `sheet-val-roll-static` pattern. The column cell needs `position: relative`.
- **Tooltip bubble class is `sheet-tooltip-bubble`**, not `sheet-skill-tooltip-bubble`. The wrong class has no CSS hover rule.
- **Never set `overflow: hidden` on the tooltip wrapper or effect cell container.** Only the preview div (and its inner span) gets overflow clipping. The bubble must be able to overflow its container.
- **Tooltip preview width requires explicit flex rules.** The base `sheet-skill-tooltip` is `display: inline-flex` and sizes to content. Add `display: flex; width: 100%; min-width: 0` on the scoped tooltip rule, `flex: 1 1 0; min-width: 0` on the preview div, and `display: block; width: 100%` on the inner span. Scope all these rules to the specific effect cell class — do not apply globally.
- **Tooltip bubble needs `white-space: normal` when content comes from translated DataMap text.** The base bubble rule does not set `white-space`. A long translated string from `effect_summary_key` may render as a single overflowing line. Add `white-space: normal` to the scoped `.SECTION-effect .sheet-tooltip-bubble` rule for any section whose bubble content is a full translated description.
- **Add `min-height: var(--cs_row_height)` to tooltip wrappers for effect cells.** When the preview string is empty (e.g. a preset type whose `buildXxxEffectStr` returns `""`), the wrapper collapses to zero height and hover does not trigger. The `min-height` rule ensures a hover target always exists regardless of preview content.
- **Duplicate `flex-row` rules in the same section are harmless but must be consolidated.** If two rules target the same selector (e.g. `.sheet-grenadeblock-grid-row > .flex-row` at two different line positions), the second wins for any conflicting properties. Before adding a new `flex-row` rule for a section, grep for existing rules targeting the same selector and merge rather than append.
- **Roll20 CSS toggle buttons for repeating sections: use the exact impale/noimpale pattern.** The working pattern is: one `input[type="hidden"]` with a combined value (e.g. `"restore-self"`, `"restore-other"`, `"none-self"`, `"none-other"`), updated by `setAttrs` from both the apply function and the `other` checkbox watcher, with buttons as immediate DOM siblings. CSS uses `[value="X"] + button.class` adjacent sibling selectors. Do not use two separate toggle inputs — one combined input matching the impale pattern is the only approach confirmed to work.
- **Roll toggle CSS hide rules must be placed AFTER the global `button[type="roll"].new-roll { display: flex }` rule and must include `button[type="roll"]` in the selector.** The global rule has specificity (0,5,1). Hide rules using only `.sheet-X-roll-Y` have specificity (0,4,0) and lose regardless of order. Hide rules using `button[type="roll"].sheet-X-roll-Y` have specificity (0,5,1) — a tie — and win only when declared later in the file. Show rules use `.sheet-X-roll-toggle[value="Z"] + button[type="roll"].sheet-X-roll-Y` at (0,6,1) and beat both. Always place the entire toggle block (hide + show rules) immediately after the `button[type="roll"]:hover.new-roll` rule, not near the top of the CSS file with the section column widths.
- **All flex-cell columns in a repeating section must have explicit `flex: 0 0 Xpx` to prevent alignment drift.** `flex-cell` defaults to `flex: 0 1 auto` and `flex-cell-wrapper` defaults to `flex: 1 1 6%` — both can cause columns to grow or shrink unpredictably based on content. Setting `flex: 0 0 Xpx` on every column class (not just the val-roll-static wrapper) locks each column to its declared pixel width in both header and data rows. Without this, headers and rows appear misaligned even when pixel widths sum correctly.
- **Verify column pixel totals sum to 813px (the sheet width minus borders) after any column change.** A single column width drift (e.g. `strain-used` changing from 50px to 60px) shifts the entire row right by the excess, misaligning every column that follows. Always run a total check: `python3 -c "print(sum([185,24,75,55,50,36,40,24,324]))"` after any column width edit.

### Roll20 API Scripts
- **API scripts are server-side only.** They cannot reference sheet HTML elements directly, and sheet workers cannot call API script functions. Communication is only through attribute changes and chat messages.
- **`on('ready', ...)` is required** as the entry point for all API scripts. Code outside this handler runs before the sandbox is initialized and will fail silently.

### General
- **Suspect the change you just made, but verify before blaming it.** Three separate defects in the 2026-08-01 session were assumed to originate in the recent Combat commits (`216c9ae`, `a7c7d5f`, 2026-07-19) and none did: the half-cleared weapon row (the deselect path has always behaved this way), the strain duplicate (introduced `81e3534`, 2026-02-17), and the 19-parameter tag function (grew `0d5bcc2` 2026-04-05 through `25d0302` 2026-05-07). Recent work draws attention to an area; the inspection then surfaces older issues. Use `git log -S '<identifier>'` to date a construct before attributing it. The one genuine regression from the tranq reclassification was **ammo gating** — `category: "rifle"`/`"handgun"` newly enabled five special ammo types on tranq platforms, which the rules forbid.
- **Check the Todo_list.md before starting any new section.** A feature may already be stubbed, partially implemented, or blocked on a dependency.
- **Cross-reference PDFs (First_2_sections_GoA.pdf, Gear_and_Loadout.pdf) and .docx updates** before writing any new DataMap data. The docx files (especially `Weapons_2026-03-27.docx`) may contain more recent rule text than the PDF, and `source: {}` must reflect the actual document used.
- **The sheet width is fixed at 840px** (`--cs_sheet_width`). Do not design sections that exceed this or assume a wider viewport.
- **CRLF line endings.** `ghost_of_arcadia.html`, `ghost_of_arcadia.css`, and `translation.json` use `\r\n`. For multi-line targeted edits, use Python byte-level replacement with `\r\n` normalization and an `assert count == 1` uniqueness check per replacement — the equivalent of `str_replace` but CRLF-safe.

### Lifestyle DataMaps
- **`districtDataMap` `tiers` array is index-ordered `[squatter, low, middle, high, luxury, enclave]`.** Value `0` = unavailable, `1` = available, `2` = restricted (GM adjudicates — do not block selection, show note text). Never reorder the array.
- **`cost_mod` is an integer percentage point offset, not a multiplier.** Apply as `Math.floor(base_cost * (1 + cost_mod / 100))`. A `cost_mod` of `0` means Base (no change); `25` means +25%; `-30` means −30%.
- **`lifestyleTierDataMap` `slots` and `cost` use `null` for unavailable size/tier combos** (e.g. studio at High+). Sheet workers must guard: if `tier.cost[size] === null`, reset size to `apartment` before computing cost.
- **`lifestyleFeatureDataMap` covers both `"feature"` and `"amenity"` types.** Only `"feature"` entries contribute to the mechanical slots-used count for the DT modifier summary. Both types consume a slot from the residence's slot total.
- **The zone → district cascading select pattern mirrors the weapon skill-class → preset pattern.** A hidden `input[type="hidden" name="attr_lifestyle_zone"]` is the CSS controller. `on("change:lifestyle_zone_select")` writes to it. Eight `input[value="ZONE"] ~ .district-zone-ZONE { display: block }` CSS rules then show the correct district `<select>`. Inside `repeating_safehouses`, scope with `.repcontainer[data-groupname="repeating_safehouses"] input[name="attr_safehouse_zone_ctrl"][value="ZONE"] ~ .district-zone-ZONE`.
- **Safehouse split ÷ N:** `safehouse_cost_mdr = Math.floor(finalCost / split)`. Guard divide-by-zero — treat split ≤ 0 as 1.
- **`districtDataMap` `note_key: ""` means no note** — the apply function must guard `data.note_key ? tr(data.note_key) : " "` and write `" "` (not `""`) to clear the display span.
- **`applyDistrictPreset` must call `applyLifestyleTierPreset` (not `recalcLifestyleTotals`) for the primary residence.** `recalcLifestyleTotals` reads the already-computed `lifestyle_final_cost_mdr` to sum the monthly budget — it does not recompute the cost itself. When district changes, the district's `cost_mod` must be applied to tier+size cost, which only `applyLifestyleTierPreset` does. Calling `recalcLifestyleTotals` directly after a district change skips the cost recalculation entirely.
- **Zone change must clear all district attrs before recomputing cost.** When zone changes, the zone watcher must write `""` to all eight zone-specific district selects, `""` to `lifestyle_district_mdr`, `" "` to the note display, and `0` to `lifestyle_dt_district_mdr` — all in a single `setAttrs` call. Only after that call's callback should `applyLifestyleTierPreset` run. Without this, the old district's `cost_mod` persists in the attr store and the cost doesn't reset.

### Roll20 CSS Sibling Selector Rules
- **CSS `~` only selects siblings with the exact same parent.** The `~` selector cannot cross a parent boundary. If `input[name="attr_X"]` is inside `div.A` and the target element is inside `div.B`, the selector fails even if both divs share a grandparent. Before writing any `~` based CSS rule, confirm in the HTML that the controller input and the target container share the **same immediate parent element**.
- **Roll20 renders `<fieldset class="repeating_X">` as `<div class="repcontainer" data-groupname="repeating_X">` in the live DOM.** Never use `.repeating_X` as a CSS class selector — it does not exist in the rendered DOM. Always use `.repcontainer[data-groupname="repeating_X"]` to target a repeating section container. Selectors using `.repeating_X` match nothing and silently fail.
- **A CSS controller input that must reach multiple repeating sections must be placed as a sibling of all their parent wrappers, not inside any one of them.** If Features and Amenities are each in their own `sheet-section-body` (separate collapsible sections), a hidden input inside the Features `sheet-section-body` can never reach the Amenities repcontainer via `~`. Place the controller input at the level above both collapsibles so it is a true sibling of both `sheet-colrow` wrappers. The CSS can then use `input ~ .sheet-colrow .repcontainer[data-groupname="repeating_X"] .target-class` to reach into each section as a descendant.
- **When a CSS controller hidden input is placed outside a repeating section, use `~ .sheet-colrow .repcontainer[data-groupname="X"]` (descendant) not `~ .repcontainer[data-groupname="X"]` (direct sibling).** The repcontainer is nested inside the collapsible wrapper div, so a direct `~` sibling selector won't find it. The full path must traverse the intermediate wrapper.

### Roll20 Repeating Section Row Add Behavior
- **Roll20 does NOT fire `change:` events reliably for all attrs on new row add.** Specifically: checkboxes (`value="1"`) initialise unchecked with no stored value — no change fires. Selects with an empty first option (`value=""`) fire `change:` with value `""` but a new row with no stored value is effectively a no-op change in some Roll20 versions. **Do not rely on any per-row watcher to initialise display state for a brand new row.**
- **Roll20 attribute attr names are always lowercase.** Roll20 normalises all attribute names to lowercase in its attr store and when firing `change:` events. Using uppercase letters in attr names (e.g. `attr_lf_loc_R`) causes silent failures: `getAttrs(["lf_loc_R"])` returns `""` because the stored key is `"lf_loc_r"`. Always use fully lowercase attr names throughout HTML, CSS, and JS.
- **Roll20 checkboxes must use `value="1"` for reliable change event firing.** Non-standard values (e.g. `value="R"`, `value="2"`) may not fire `change:` events consistently in repeating sections. If you need a checkbox that stores a location identifier, use `value="1"` with a unique attr name per location (e.g. `attr_lf_loc_r`, `attr_lf_loc_1`) and enforce exclusivity in JS. Never rely on same-name checkboxes with different values for radio-like behaviour — Roll20's handling of this pattern is unreliable.
- **The most reliable add-row proxy for a repeating section is `change:SECTION:ATTR` where ATTR is a select that initialises to a non-empty value, OR using a completely CSS-driven approach that requires no per-row JS write at all.** The CSS-driven approach (single global attr + CSS `~` reaching into the repcontainer) is always preferable for display state that depends on a count or state outside the row itself, because it requires no JS at row-add time and cannot race with Roll20's row initialisation sequence.
- **`getSectionIDs` called from a `change:` watcher that fires on row add may not include the new row's ID.** Roll20 fires `change:` before the new row's ID is fully registered in the section. Any code path that calls `getSectionIDs("repeating_X")` in response to a row-add event and iterates the result to write per-row attrs will silently miss the new row. The fix is either (a) write directly to the triggering row using its prefix extracted from `eventInfo.sourceAttribute`, or (b) eliminate the per-row write entirely using a global CSS controller.
