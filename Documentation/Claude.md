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
| `Todo_list.txt` | Active bugs and pending tasks |

---

## Workflow Rules

### File Handling
- **Always copy from uploaded files** (`/mnt/user-data/uploads/`) at the start of every session. Never copy from `/mnt/project/` — that path may be stale and not reflect the user's latest edits.
- **Never overwrite mid-session.** Once working files are copied at session start, do not re-copy from uploads or project again during the same session.
- **Deliver changes as outputs** from the working copies. The user merges outputs back into the project.
- **Use `str_replace` for targeted edits** — never use large Python block replacements that reproduce entire file sections verbatim. Large replacements require matching the exact current file content and silently overwrite any user edits in that block if the match is stale.

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
- DataMap entries within each DataMap object must be alphabetical by key.
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
ancestryDataMap
ancestryTalentDataMap
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

For talent DataMaps:

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

### `source: {}` Validation Checklist

When any entry is added or modified, check:
1. Does the `doc` key reference the correct rulebook translation key?
2. Is `version` the current document version (format: `"X.YYMMDD"`)?
3. Is `date` the correct ISO date string (`"YYYY-MM-DD"`)?
4. Is `section` the correct section translation key?
5. If data came from a **new rules update** (e.g., `Weapons_2026-03-27.docx`), update the version and date accordingly.

### DataMap `skill` field

When a DataMap entry references a skill (e.g. `vehiclesDataMap`), the `skill` field must hold the **exact key from `skillDataMap`** — e.g. `"drive_auto"`, `"pilot_aircraft"`. The apply function then looks up `skillDataMap[data.skill].bonus` for the sheet attribute name and `skillDataMap[data.skill].label` for the display name. Never store the sheet attribute name (e.g. `"drive_auto_mdr"`) directly in the DataMap `skill` field — that bypasses the skillDataMap and introduces a mapping layer that doesn't need to exist.

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

## Known Issues & Pending Work (from Todo_list.txt)

1. **Unhide buttons** in the manual section (bug).
2. **"special" economy value** — standardize to `special_immediate` or keep distinct.
3. **brawler, tactician careers** — populate stubs when ready.
4. **Full type/tag audit** across all DataMaps.
5. **ancestryTalentDataMap tag normalization** — 115/160 talents use display-name tags instead of snake_case (e.g. `"Observation"` → `"observation"`).
6. **Add Ancestry Traits to Summary Text**.
7. **Merge `ancestryTalentDataMap` into `ancestryDataMap`** (pending).
8. **Combat — Drones & Deployables** (not yet implemented).
9. **Combat — Bots & Autonomous Units** (not yet implemented).
10. **Inventory — MedTech Equipment & Strain Compounds** (redo).
11. **Inventory — Pharmaceuticals & Street Narcotics** (redo).
12. **Cyberware section** (not yet implemented).
13. **Vehicle section** ✓ implemented.
14. **NPC — Add MOV penalty**.
15. **NPC — Cap Condition Penalty to −20**.
16. **Clean-up** — Move skill rolls to sheet worker on click (single place to edit roll value).

---

## Lessons Learned — Do Not Repeat These Mistakes

### Formatting
- **Never use spaces for indentation.** The project uses tabs exclusively. Mixing causes visual inconsistency and diff noise.
- **Never append to the end of `translation.json`.** All keys must be inserted in their correct alphabetical position. Out-of-order keys have been a recurring source of review churn.
- **Never append DataMap entries at the bottom of a DataMap.** Alphabetical order is required within each DataMap section.

### DataMap Integrity
- **Always check `source: {}` when editing a DataMap entry.** If the rules text changed in a newer document version, the `version` and `date` fields must be updated too. Stale source metadata has caused confusion about which rulebook version the sheet reflects.
- **DataMaps are the source of truth.** Do not patch values directly into HTML option lists, roll formulas, or sheet worker logic without updating the DataMap first. Discrepancies between the DataMap and the HTML have caused bugs that were hard to trace.
- **`ancestryTalentDataMap` tags** — new entries must use snake_case tags (e.g. `"observation"`, not `"Observation"`). The normalization of the 115 legacy entries is a tracked to-do; do not add new mis-cased tags.
- **DataMap `skill` field must hold the skillDataMap key**, not the sheet attribute name. Use `skillDataMap[data.skill].bonus` in the apply function to get the attr name. Never store `"drive_auto_mdr"` directly — store `"drive_auto"` and look it up.

### translation.json
- **Every `data-i18n` attribute in HTML needs a matching key in `translation.json`.** Missing keys silently show the key string instead of translated text in Roll20.
- **Every new feature needs its translation keys added first**, before the HTML is written, to avoid forgetting them.
- **No duplicate keys.** Roll20 may silently use whichever duplicate it encounters first, leading to subtle display bugs.
- **Multi-key insertions must sort the whole affected range**, not append after an anchor. Use Python to extract the range, merge, sort, and write back.

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

### CSS
- **Respect section boundaries.** Always read the surrounding section start/end markers before inserting CSS. The Combat section fieldset reset block is Combat-only. Vehicle fieldset resets go in the Vehicle section. New gear sections get their own resets in the Gear section.
- **Use `sheet-val-roll-static` for value+roll columns.** Never create a separate button column next to a value column — merge them using the existing `sheet-val-roll-static` pattern. The column cell needs `position: relative`.
- **Tooltip bubble class is `sheet-tooltip-bubble`**, not `sheet-skill-tooltip-bubble`. The wrong class has no CSS hover rule.
- **Never set `overflow: hidden` on the tooltip wrapper or effect cell container.** Only the preview div (and its inner span) gets overflow clipping. The bubble must be able to overflow its container.
- **Tooltip preview width requires explicit flex rules.** The base `sheet-skill-tooltip` is `display: inline-flex` and sizes to content. Add `display: flex; width: 100%; min-width: 0` on the scoped tooltip rule, `flex: 1 1 0; min-width: 0` on the preview div, and `display: block; width: 100%` on the inner span. Scope all these rules to the specific effect cell class — do not apply globally.

### Roll20 API Scripts
- **API scripts are server-side only.** They cannot reference sheet HTML elements directly, and sheet workers cannot call API script functions. Communication is only through attribute changes and chat messages.
- **`on('ready', ...)` is required** as the entry point for all API scripts. Code outside this handler runs before the sandbox is initialized and will fail silently.

### General
- **Check the Todo_list.txt before starting any new section.** A feature may already be stubbed, partially implemented, or blocked on a dependency.
- **Cross-reference PDFs (First_2_sections_GoA.pdf, Gear_and_Loadout.pdf) and .docx updates** before writing any new DataMap data. The docx files (especially `Weapons_2026-03-27.docx`) may contain more recent rule text than the PDF, and `source: {}` must reflect the actual document used.
- **The sheet width is fixed at 840px** (`--cs_sheet_width`). Do not design sections that exceed this or assume a wider viewport.
