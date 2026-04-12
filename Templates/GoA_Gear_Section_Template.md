# Ghost of Arcadia — Gear Tab Section Template

*v4 — Vehicle tab patterns, tooltip fix, val+roll pattern, i18n enforcement*

---

## Overview

Each gear section on the Gear tab follows the same pattern established by the Clothing & Streetwear section. This guide covers every file that needs to change for each new section and provides copy-paste templates for all of them.

The four files changed for every new section are:

- `ghost_of_arcadia.html` — data map, HTML, JS functions, watchers, init call
- `ghost_of_arcadia.css` — column sizing and row rules
- `translation.json` — all i18n keys

> **New in v4**
>
> - Vehicle tab implemented as the reference pattern for complex sections with stat columns, val+roll cells, condition tracking, and skill sync.
> - Tooltip pattern clarified: bubble class must be `sheet-tooltip-bubble` (not `sheet-skill-tooltip-bubble`).
> - Val+roll pattern documented: use `sheet-val-roll-static` — never create a separate button column.
> - i18n enforcement: all display strings written via `setAttrs` must use `tr()`. No hardcoded English strings. No JS truncation.

---

## Naming Conventions

Replace `SECTION` throughout with your section's short identifier (e.g. `disguise`, `comms`, `bypass`). This must be consistent across all four files.

| Thing | Pattern | Clothing Example |
|---|---|---|
| Data map const | `SECTIONDataMap` | `clothingDataMap` |
| Section CSS classes | `sheet-SECTION-header/default` | `sheet-clothing-header` |
| Repeating fieldset | `repeating_SECTIONgear` | `repeating_clothinggear` |
| Manual fieldset | `repeating_SECTIONmanual` | `repeating_armormanual` |
| Static preset attrs | `attr_SECTION1_preset` | `attr_clothing1_preset` |
| Repeating preset attr | `attr_SECTION_preset` | `attr_clothing_preset` |
| Collapse checkbox id | `gear_SECTION_collapse` | `gear_clothing_collapse` |
| i18n key prefix | `SECTION_` | `clothing_` |
| CSS column classes | `.SECTION-name`, `.SECTION-rarity` etc. | `.clothing-name` |
| Apply function (repeating) | `applySECTIONPreset(p, key)` | `applyClothingPreset` |
| Apply function (static) | `applySECTIONPresetStatic(n, key)` | `applyClothingPresetStatic` |
| Init function | `initSECTIONPresets()` | `initClothingPresets` |

---

## Step 0 — Column Design

Before writing any code, decide what columns your section needs. The standard layout is: Name (select), Rarity (24px), Equipped (24px), Effect (tooltip text). Other sections may add or remove columns as needed.

Use fixed pixel widths for all columns — do **NOT** use flex percentages. The total of all column widths should stay within ~815px. The standard four-column layout totals 813px:

| Column type | Width | Notes |
|---|---|---|
| Name / select | 190px | Main item picker |
| Rarity | 24px | Single letter abbreviation — C/P/R/I. `text-align: center` |
| Equipped checkbox | 24px | Always 24px, matches armor section |
| Effect / description | 575px | Truncated with ellipsis + hover tooltip. `position: relative` |
| Short numeric | 60–80px | If replacing Effect — cost, rating, charges, etc. |
| Short text | 100–160px | If replacing Effect — category, skill ref, etc. |
| Val+Roll column | 50px | Numeric value that is also a roll button. `position: relative`. Use `sheet-val-roll-static`. No separate button column. |

> **RULE**
>
> Always adjust remaining column widths when adding or removing columns. The total must stay ~815px or content will overflow. When adding a 24px Rarity column, reduce the Effect column by 24px (e.g. 600px → 575px).

---

## Step 1 — Data Map (HTML)

Add the data map object inside the `<script>` block, grouped with the other data maps. Alphabetize entries within the map.

If the section references a skill, store the **skillDataMap key** (e.g. `"drive_auto"`) in the `skill` field — not the sheet attribute name. The apply function resolves `skillDataMap[data.skill].bonus` to get the attr name and `skillDataMap[data.skill].label` for display.

### Standard fields

```javascript
/* ══════════════════════════════════════════════════════
   SECTION DATA MAP
   Source: Gear & Loadout, section: SECTION_source_key
   Fields:
     name_key   — i18n key for display name
     cost       — credit cost (number)
     rarity     — "common" | "permit" | "restricted" | "illegal"
     effect_key — i18n key for effect description
   ══════════════════════════════════════════════════════ */
const SECTIONDataMap = {
	item_key: {
		name_key:   "SECTION_item_key-u",
		cost:       0,
		rarity:     "common",
		effect_key: "SECTION_item_key_effect-u",
		source: { doc: "gear_loadout-u", version: "2.260327",
		          date: "2026-03-27", section: "SECTION_source-u" },
	},
};
```

> **RARITY VALUES**
>
> Must be exactly one of: `"common"`, `"permit"`, `"restricted"`, `"illegal"`. The `rarityAbbrevKey` map (already in the codebase) converts these to C/P/R/I via i18n.

---

## Step 2 — Translation Keys (translation.json)

Add all keys in alphabetical order within the file. The four rarity abbreviation keys and `rarity-u` header key are already in the codebase — do not add them again.

**When inserting many keys that span an existing range**, extract the full affected key group, add the new entries, sort the combined set, and write it back using Python. Never use a sequential anchor-after insertion strategy for multi-key additions — it produces out-of-order clumps.

**If your apply function uses any display strings** (condition labels, speed categories, category names, fallback strings), add their translation keys here before writing any JS. Never hardcode English strings in `setAttrs` calls.

### Required keys for every section

```json
"SECTION_effect-u": "Effect",
"SECTION_equipped-u": "E",
"SECTION_item_name-u": "Item",
"SECTION_preset-u": "SECTION Preset",
"SECTION_rarity-u": "R",
"SECTION_select_placeholder-u": "--- select item ---",
"SECTION_source-u": "Section Display Name",
```

### Per-item keys

```json
"SECTION_item_key-u": "Display Name",
"SECTION_item_key_effect-u": "Full effect text as it appears in the sheet.",
```

> **ALPHABETICAL ORDER**
>
> `translation.json` must stay alphabetically ordered. Insert new keys at the correct position — do not append to the end.

---

## Step 3 — CSS (ghost_of_arcadia.css)

**Before writing any CSS, read the surrounding section start/end markers.** Insert rules inside the correct named section only. Never add CSS from one section into another section's boundary block.

Add the CSS block inside the appropriate section area. Also add the new fieldset names to the **fieldset reset block inside that same section** — not to the Combat section's reset block.

```css
/* ---- SECTION section flex-cell column sizing ---- */
.ui-dialog .tab-content .charsheet .SECTION-name    { width: 190px; }
.ui-dialog .tab-content .charsheet .SECTION-rarity  { width: 24px; text-align: center; }
.ui-dialog .tab-content .charsheet .SECTION-equipped { width: 24px; }
.ui-dialog .tab-content .charsheet .SECTION-effect  { width: 575px; position: relative; }

/* SECTION rows — standard fixed height */
.ui-dialog .tab-content .charsheet .sheet-SECTION-header .flex-row,
.ui-dialog .tab-content .charsheet .sheet-SECTION-default .flex-row,
.ui-dialog .tab-content .charsheet .repeating_SECTIONgear .flex-row,
.ui-dialog .tab-content .charsheet .repeating_SECTIONmanual .flex-row {
	display: flex; flex-wrap: nowrap; flex-direction: row;
	align-items: center; width: 100%; height: var(--cs_row_height);
	padding: 0; margin: 0; gap: 0;
}

/* Fieldset reset — inside this section's boundary, not Combat */
.ui-dialog .tab-content .charsheet fieldset.repeating_SECTIONgear,
.ui-dialog .tab-content .charsheet fieldset.repeating_SECTIONmanual {
	margin: 0; padding: 0; border: none;
}
```

### Tooltip effect cell CSS

When a section uses the `sheet-skill-tooltip has-notes` pattern for an effect cell, add these scoped rules to make the preview text fill the full cell width:

```css
.ui-dialog .tab-content .charsheet .SECTION-effect .sheet-skill-tooltip { display: flex; width: 100%; min-width: 0; align-items: stretch; }
.ui-dialog .tab-content .charsheet .SECTION-effect .sheet-skill-tooltip-preview { flex: 1 1 0; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-dialog .tab-content .charsheet .SECTION-effect .sheet-skill-tooltip-preview span { display: block; width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
```

**Never apply these rules globally** to `sheet-skill-tooltip-preview` — scope them to the specific effect cell class. A global rule will constrain preview text in other sections.

### Val+Roll columns

For columns that display a value and trigger a roll on click:

```css
.ui-dialog .tab-content .charsheet .SECTION-valcol { width: 50px; position: relative; }
```

Use `sheet-val-roll-static` in the HTML (see Step 4). No separate button column is needed or appropriate.

---

## Step 4 — HTML Section (ghost_of_arcadia.html)

Add the new section inside the `sheet-gear` tab div, after the closing `</div>` of the previous section.

### Tooltip effect cell HTML

```html
<div class="flex-cell SECTION-effect">
    <div class="sheet-skill-tooltip has-notes">
        <div class="sheet-skill-tooltip-preview"><span name="attr_SECTION_effect_preview_mdr"></span></div>
        <div class="sheet-tooltip-bubble"><span name="attr_SECTION_effect_mdr"></span></div>
    </div>
</div>
```

**Critical:** `sheet-tooltip-bubble` — not `sheet-skill-tooltip-bubble`. The wrong class has no CSS hover rule and the bubble never appears.

Both `attr_SECTION_effect_preview_mdr` and `attr_SECTION_effect_mdr` receive the **full effect text** from `tr(data.effect_key)`. CSS handles visual clipping of the preview. Never truncate in JS.

### Val+Roll cell HTML

```html
<div class="flex-cell SECTION-valcol">
    <div class="sheet-val-roll-static">
        <input type="text" name="attr_SECTION_val_mdr" readonly/>
        <button type="roll" name="roll_SECTION_check"
            value="&{template:coc-1} {{name=@{SECTION_name_display_mdr}}} {{success=[[@{SECTION_val_mdr}]]}} ...">
        </button>
    </div>
</div>
```

The button is `opacity: 0; position: absolute` covering the full cell — clicking the value triggers the roll. No separate button column needed.

### Roll name attribute

**Never use `@{SECTION_preset}` in a roll name field** — that resolves to the raw DataMap key (e.g. `cargo_van`), not a display name. Always write a `SECTION_name_display_mdr` attr via `tr(data.name_key)` in the apply function and reference `@{SECTION_name_display_mdr}` in the roll formula.

### Full section template

```html
<div class="sheet-colrow sheet-section sheet-gear-collapsible">
    <input type="checkbox" class="sheet-top-collapse" id="gear_SECTION_collapse"
        name="attr_gear_SECTION_collapse" value="1"/>
    <h4 class="sheet-section-head-collapsible">
        <span data-i18n="SECTION_source-u">Section Name</span>
        <label class="sheet-top-collapse-hit" for="gear_SECTION_collapse"></label>
    </h4>
    <div class="sheet-section-body">
        <div class="sheet-section">
            <!-- Column header -->
            <div class="sheet-SECTION-header">
                <div class="flex-row">
                    <div class="flex-cell SECTION-name"><span data-i18n="SECTION_preset-u">Item</span></div>
                    <div class="flex-cell SECTION-rarity"><span data-i18n="rarity-u">R</span></div>
                    <div class="flex-cell SECTION-equipped"><span data-i18n="SECTION_equipped-u">E</span></div>
                    <div class="flex-cell SECTION-effect"><span data-i18n="SECTION_effect-u">Effect</span></div>
                </div>
            </div>
            <!-- Repeating rows -->
            <fieldset class="repeating_SECTIONgear">
                <div>
                    <div class="flex-row">
                        <div class="flex-cell SECTION-name">
                            <select name="attr_SECTION_preset">
                                <option value="" data-i18n="SECTION_select_placeholder-u">--- select ---</option>
                                <!-- options -->
                            </select>
                        </div>
                        <div class="flex-cell SECTION-rarity">
                            <span name="attr_SECTION_rarity"></span>
                        </div>
                        <div class="flex-cell SECTION-equipped">
                            <input type="checkbox" name="attr_SECTION_equipped" value="1"/>
                        </div>
                        <div class="flex-cell SECTION-effect">
                            <div class="sheet-skill-tooltip has-notes">
                                <div class="sheet-skill-tooltip-preview"><span name="attr_SECTION_effect_preview_mdr"></span></div>
                                <div class="sheet-tooltip-bubble"><span name="attr_SECTION_effect_mdr"></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
</div>
```

---

## Step 5 — JS Apply Function

```javascript
/* ── Core: fill display attrs for one SECTION row (repeating) ─── */
function applySECTIONPreset(p, presetKey) {
	const entry = presetKey ? SECTIONDataMap[presetKey] : null;
	const tr = (k) => (k && typeof getTranslationByKey === "function") ? (getTranslationByKey(k) || k) : (k || "");
	const effectFull = entry ? tr(entry.effect_key) : " ";
	setAttrs({
		[p + "SECTION_name_display_mdr"]: entry ? tr(entry.name_key)                      : " ",
		[p + "SECTION_effect_preview_mdr"]: effectFull,
		[p + "SECTION_effect_mdr"]:         effectFull,
		[p + "SECTION_rarity"]:             entry ? tr(rarityAbbrevKey[entry.rarity] || "") : " ",
	});
}
```

**Rules:**
- Never use `if (!entry) return` — always call `setAttrs` so fields clear on deselect.
- Pass `" "` (single space) when clearing — Roll20 ignores `setAttrs` that set a value to `""`.
- `effectFull` goes to **both** `effect_preview_mdr` and `effect_mdr`. CSS handles visual clipping.
- All display strings (condition labels, speed, category, fallback "Any") must use `tr()`. If the key doesn't exist yet, add it to `translation.json` first.
- If the section has a `skill` field, look it up via `skillDataMap[entry.skill].bonus` for the attr name and `skillDataMap[entry.skill].label` for display — never hardcode the attr name.

---

## Step 6 — Manual Row Pattern

The manual fieldset is always separated from the preset fieldset by a divider rule and preceded by a duplicate column header row, so the header labels apply to both sections.

### 6a — HTML structure

```html
<!-- Divider + duplicate header above the manual fieldset -->
<hr class="sheet-armor-divider"/>
<div class="sheet-SECTION-header">
    <div class="flex-row">
        <!-- exact same header cells as the preset header above -->
        <div class="flex-cell SECTION-name"><span data-i18n="SECTION_item_name-u">Item</span></div>
        <div class="flex-cell SECTION-rarity"><span data-i18n="rarity-u">R</span></div>
        ...
    </div>
</div>
<fieldset class="repeating_SECTIONmanual">
    <div class="...">
        <!-- Hidden persistent attrs at grid-row level -->
        <!-- Main flex-row: text inputs replacing the preset selects -->
        <!-- Advanced panel (if the section has one) -->
    </div>
</fieldset>
```

### 6b — Key differences from the preset fieldset

| Preset fieldset | Manual fieldset |
|---|---|
| `<select>` drives all display fields | User types directly into `<input type="text">` fields |
| Name cell: `<select name="attr_SECTION_preset">` | Name cell: `<input type="text" name="attr_item_name_mdr">` |
| Rarity: `<span>` driven by `applyPreset` | Rarity: `<select>` with C/I/P/R options, `sheet-armor-rarity-select` |
| Read-only display attrs (span) | Editable inputs for every column the user should control |
| `applyPreset` writes all fields on select change | Watchers parse typed input and compute derived fields |
| No blast zone / mode button watchers | Named `const` function registers all button and change watchers |

### 6c — CSS additions

```css
/* Add manual fieldset to the fieldset reset block (inside this section's CSS boundary) */
.ui-dialog .tab-content .charsheet fieldset.repeating_SECTIONmanual {
	margin: 0; padding: 0; border: none;
}

/* Manual rows share the same flex-row sizing as the preset rows */
.ui-dialog .tab-content .charsheet .repeating_SECTIONmanual .flex-row {
	display: flex; flex-wrap: nowrap; flex-direction: row;
	align-items: center; width: 100%; height: var(--cs_row_height);
	padding: 0; margin: 0; gap: 0;
}
```

### 6d — JS: named `const` function for manual watchers

Each manual fieldset has its own named `const` arrow function. Declared in the **Initialization Section** (before `/* Initialization Section - End */`), called from `afterAllSets` inside `initializeSheetOnOpen`. Do not use an IIFE.

```javascript
const registerSECTIONManualWatchers = () => {
	const S = "repeating_SECTIONmanual";
	const id = (src) => {
		const m = (src || "").match(new RegExp(`^${S}_([^_]+)_`));
		return m ? m[1] : null;
	};

	on(`change:${S}:item_name_mdr`, (eventInfo) => {
		const rowId = id(eventInfo.sourceAttribute); if (!rowId) return;
		// ... resolve and setAttrs
	});
};
```

### 6e — Init function extension

```javascript
const initSECTIONManualAttrs = () => {
	getSectionIDs("repeating_SECTIONmanual", (ids) => {
		if (!ids.length) return;
		// fetch and resolve any display attrs for existing rows
	});
};

// In afterAllSets inside initializeSheetOnOpen:
initSECTIONPresets();
initSECTIONManualAttrs();
registerSECTIONManualWatchers();
```

---

## Known Gotchas

| Gotcha | What to do |
|---|---|
| Fields don't clear on deselect | Never use `if (!entry) return`. Always call `setAttrs`. Pass `" "` (not `""`) when clearing. |
| `class=` on named spans ignored | Use a wrapper div for styling. The rarity span is the exception — single letter, no truncation needed. |
| Column widths don't add up | When adding or removing a column, adjust the others. Standard 4-col total is ~813px: 190 + 24 + 24 + 575. |
| Tooltip bubble never appears | Bubble class must be `sheet-tooltip-bubble` — NOT `sheet-skill-tooltip-bubble`. The wrong class has no hover rule. Both `sheet-skill-tooltip` and `has-notes` must be on the wrapper div. |
| `overflow: hidden` clips tooltip bubble | Never set `overflow: hidden` on the effect cell or tooltip wrapper. Only the preview div and its inner span get it. |
| Preview text truncates too early | The base `sheet-skill-tooltip` is `display: inline-flex` and sizes to content. Add scoped rules: `display: flex; width: 100%; min-width: 0` on tooltip, `flex: 1 1 0; min-width: 0` on preview div, `display: block; width: 100%` on inner span. |
| Preview text truncated in wrong place | Never truncate in JS. No `substring()`, no hardcoded `"…"`. Write the full translated string to both `_preview_mdr` and `_mdr`. CSS `text-overflow: ellipsis` handles visual clipping. |
| Flex percentages don't work | Use `width: Npx` for all columns. Roll20's global `.flex-cell` rules fight `flex-basis` values. |
| Manual row ID extraction fails | Section name must have NO underscores after `repeating_`. Use `repeating_armormanual` not `repeating_armor_manual`. |
| Repeating section name breaks Roll20 | Roll20 splits repeating section names on underscores. `repeating_foo_bar` is treated as section `"foo"` with sub-key `"bar"`. Always use a single concatenated word after `repeating_`. |
| Roll name shows raw DataMap key | Never use `@{SECTION_preset}` in a roll name. Write `SECTION_name_display_mdr` via `tr(data.name_key)` in the apply function and reference that attr in the roll formula. |
| Val column shows dice icon, not value | Use `sheet-val-roll-static` — a wrapper with a `readonly` input showing the value and an `opacity:0` button covering the cell. The column needs `position: relative`. No separate button column. |
| Top-level attr unresolved in repeating span | `<span name="attr_gunnery_mdr">` inside a repeating fieldset won't resolve top-level attrs. Write a per-row copy of the value as a hidden attr via the apply function, and add a sync watcher on the source attr. |
| Hardcoded display strings break translation | Any string written to a display attr via `setAttrs` must use `tr()`. Add missing keys to `translation.json` before writing the JS. |
| CSS inserted in wrong section | Always read surrounding section start/end markers. Combat reset block is Combat-only. Vehicle resets go in Vehicle section. New gear resets go in Gear section. |
| Init overwrites player state | When re-applying presets on `sheet:opened`, fetch existing stateful values (HP, ammo, etc.) and pass a `preserveState` flag. Never unconditionally overwrite. |

---

## Implementation Checklist

### Preset section (Steps 1–5)

- [ ] `translation.json` — all name keys added and alphabetised
- [ ] `translation.json` — all effect keys added and alphabetised
- [ ] `translation.json` — section label, preset, placeholder, equipped, effect header keys added
- [ ] `translation.json` — any display strings used in apply function (condition labels, speed, category, fallbacks) added
- [ ] `translation.json` — do NOT add `rarity-u` or `rarity_abbrev_*-u` (already in codebase)
- [ ] HTML data map — all entries have `name_key`, `effect_key`, `cost`, `rarity`, `source`
- [ ] HTML data map — `rarity` value is exactly `"common"`, `"permit"`, `"restricted"`, or `"illegal"`
- [ ] HTML data map — `skill` field holds skillDataMap key, not sheet attr name
- [ ] HTML data map — entries alphabetised within the map
- [ ] HTML section — collapse checkbox `id` and `for=` match
- [ ] HTML section — both static rows present (`SECTION1` and `SECTION2`)
- [ ] HTML section — repeating fieldset class is `repeating_SECTIONgear`
- [ ] HTML section — rarity cell between name and equipped in every row and header
- [ ] HTML effect cells — wrapper div carries the class, not the named span
- [ ] HTML effect cells — tooltip div uses `class="sheet-skill-tooltip has-notes"` (both classes)
- [ ] HTML effect cells — bubble div uses `class="sheet-tooltip-bubble"` (NOT `sheet-skill-tooltip-bubble`)
- [ ] HTML effect cells — both `_preview_mdr` and `_mdr` attrs get full text; no JS truncation
- [ ] HTML roll names — use `SECTION_name_display_mdr` attr, not raw preset select attr
- [ ] HTML val+roll columns — use `sheet-val-roll-static` wrapper; no separate button column
- [ ] HTML rarity cells — plain named span, no wrapper div needed
- [ ] CSS — column widths in pixels, not flex percentages
- [ ] CSS — total column width ~813px (190 + 24 + 24 + 575)
- [ ] CSS — fieldset reset block inside this section's CSS boundary (not Combat)
- [ ] CSS — tooltip scoped rules added for preview width
- [ ] CSS — val+roll columns have `position: relative`
- [ ] JS — NO `if (!entry) return` — always call `setAttrs`
- [ ] JS — all display strings via `tr()`, no hardcoded English
- [ ] JS — no `substring()` or `"…"` truncation
- [ ] JS — `applySECTIONPreset` and `applySECTIONPresetStatic` defined
- [ ] JS — rarity written via `rarityAbbrevKey[entry.rarity]` in both apply functions
- [ ] JS — three change watchers registered (repeating + static 1 + static 2)
- [ ] JS — `initSECTIONPresets` defined and called in `sheet:opened`
- [ ] JS — init fetches existing stateful values before applying presets

### Manual section (Step 6)

- [ ] HTML — `<hr class="sheet-armor-divider"/>` before manual header
- [ ] HTML — duplicate header div with identical cells above manual fieldset
- [ ] HTML — manual fieldset class is `repeating_SECTIONmanual` (no mid-word underscores)
- [ ] HTML — hidden persistent attrs at grid-row level (not inside `flex-row`)
- [ ] HTML — rarity is a `<select>` not a `<span>` (user picks C/I/P/R)
- [ ] HTML — all display fields are `<input type="text">` (user editable)
- [ ] CSS — `repeating_SECTIONmanual` fieldset reset inside this section's CSS boundary
- [ ] CSS — `repeating_SECTIONmanual .flex-row` shares the same sizing rule
- [ ] JS — `registerSECTIONManualWatchers` declared as `const` arrow function, called from `afterAllSets`
- [ ] JS — `initSECTIONManualAttrs()` defined and called from `afterAllSets`

---

## Existing Data Maps Available

| Const name | Key prefix | Extra fields beyond name/cost/rarity/effect |
|---|---|---|
| `clothingDataMap` | `clothing_` | — (effect only) |
| `disguiseGearDataMap` | `gear_` | `skill_bonus_pct`, `skill_bonus_die`, `skill` |
| `bypassToolsDataMap` | `gear_` | `skill_bonus_pct` |
| `commsDataMap` | `gear_` | `skill_bonus_pct`, `skill` |
| `medtechDataMap` | `gear_` | `uses`, `skill_bonus_pct`, `roll_required`, `ticks_saturation` |
| `survivalGearDataMap` | `gear_` | `uses`, `skill_bonus_pct`, `skill_bonus_die`, `skill` |
| `generalUtilityGearDataMap` | `gear_` | `skill_bonus_pct`, `skill` |
| `arcaneSuppliesDataMap` | `gear_` | `uses` |
| `weaponDataMap` | `weapon_` | `category`, `damage`, `mode`, `cap`, `mod_slots`, `traits`, `m32_compatible` |
| `armorDataMap` | `armor_` | `physical`, `arcane`, `layer`, `category`, `traits` |
| `explosivesDataMap` | `explosive_` | `blast_primary`, `blast_secondary`, `save_stat`, `damage_primary`, `m32_compatible` |
| `vehiclesDataMap` | `vehicle_` | `skill` (skillDataMap key), `hp`, `dr`, `vs`, `defense`, `defense_hardened`, `speed`, `handling`, `crew_min`, `crew_max`, `hardpoints`, `mod_slots` |
| `vehicleWeaponsDataMap` | `vweapon_` | `damage`, `mode`, `mount`, `shots`, `shots_note`, `target_class`, `traits` |
| `vehicleModsDataMap` | `vmod_` | `category`, `mod_slots`, `vehicle_req` |
