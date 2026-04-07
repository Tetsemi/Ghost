# Ghost of Arcadia — Gear Tab Section Template

*v3 — includes Manual Row pattern (Armor, Weapons, Grenades)*

---

## Overview

Each gear section on the Gear tab follows the same pattern established by the Clothing & Streetwear section. This guide covers every file that needs to change for each new section and provides copy-paste templates for all of them.

The four files changed for every new section are:

- `ghost_of_arcadia.html` — data map, HTML, JS functions, watchers, init call
- `ghost_of_arcadia.css` — column sizing and row rules
- `translation.json` — all i18n keys

> **New in v3**
>
> Armor, Weapons, and Grenades & Explosives now each have a Manual Row section below the preset repeating fieldset.
>
> Manual rows share the same column header as the preset section above them, separated by a divider rule.
>
> Step 6 of this guide documents the Manual Row pattern for new sections.

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

> **RULE**
>
> Always adjust remaining column widths when adding or removing columns. The total must stay ~815px or content will overflow. When adding a 24px Rarity column, reduce the Effect column by 24px (e.g. 600px → 575px).

---

## Step 1 — Data Map (HTML)

Add the data map object inside the `<script>` block, grouped with the other data maps. Alphabetize entries within the map.

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

Add the CSS block inside the Gear Tab Collapsible Sections area, after the previous section's block.

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

/* Add repeating_SECTIONmanual to fieldset reset block */
.ui-dialog .tab-content .charsheet fieldset.repeating_SECTIONmanual { ... }
```

---

## Step 4 — HTML Section (ghost_of_arcadia.html)

Add the new section inside the `sheet-gear` tab div, after the closing `</div>` of the previous section.

### Full section template

```html
<div class="sheet-colrow sheet-section sheet-gear-collapsible">
	<input type="checkbox" class="sheet-top-collapse" id="gear_SECTION_collapse"
		name="attr_gear_SECTION_collapse" value="1"/>
	<h4 class="sheet-section-head-collapsible">
		<span data-i18n="SECTION_source-u">Section Display Name</span>
		<label class="sheet-top-collapse-hit" for="gear_SECTION_collapse"></label>
	</h4>
	<div class="sheet-section-body">
		<div class="sheet-section">
			<!-- Header row -->
			<div class="sheet-SECTION-header">
				<div class="flex-row">
					<div class="flex-cell SECTION-name"><span data-i18n="SECTION_item_name-u">Item</span></div>
					<div class="flex-cell SECTION-rarity"><span data-i18n="rarity-u">R</span></div>
					<div class="flex-cell SECTION-equipped"><span data-i18n="SECTION_equipped-u">E</span></div>
					<div class="flex-cell SECTION-effect"><span data-i18n="SECTION_effect-u">Effect</span></div>
				</div>
			</div>
			<!-- Static rows (SECTION1, SECTION2) -->
			<div class="sheet-SECTION-default"> ... </div>
			<!-- Preset repeating fieldset -->
			<fieldset class="repeating_SECTIONgear"> ... </fieldset>
		</div>
	</div>
</div>
```

---

## Step 5 — JavaScript (ghost_of_arcadia.html)

Three additions: the two apply functions, the change watchers, and the init function.

### 5a — Apply functions

```javascript
function applySECTIONPreset(p, presetKey) {
	const entry = presetKey ? SECTIONDataMap[presetKey] : null;
	const tr = (k) => (k && typeof getTranslationByKey === "function")
		? (getTranslationByKey(k) || k) : (k || "");
	setAttrs({
		[p + "SECTION_effect"]: entry && entry.effect_key ? tr(entry.effect_key) : "",
		[p + "SECTION_rarity"]: entry ? tr(rarityAbbrevKey[entry.rarity] || "") : "",
	});
}

function applySECTIONPresetStatic(index, presetKey) {
	const entry = presetKey ? SECTIONDataMap[presetKey] : null;
	const tr = (k) => (k && typeof getTranslationByKey === "function")
		? (getTranslationByKey(k) || k) : (k || "");
	setAttrs({
		[`SECTION${index}_effect`]: entry && entry.effect_key ? tr(entry.effect_key) : "",
		[`SECTION${index}_rarity`]: entry ? tr(rarityAbbrevKey[entry.rarity] || "") : "",
	});
}
```

### 5b — Watchers

```javascript
on("change:repeating_SECTIONgear:SECTION_preset", (eventInfo) => {
	const m = (eventInfo.sourceAttribute || "").match(/^repeating_SECTIONgear_([^_]+)_/);
	if (!m) return;
	const p = `repeating_SECTIONgear_${m[1]}_`;
	getAttrs([p + "SECTION_preset"], (v) => {
		applySECTIONPreset(p, v[p + "SECTION_preset"] || "");
	});
});

on("change:SECTION1_preset", () => {
	getAttrs(["SECTION1_preset"], (v) => { applySECTIONPresetStatic(1, v["SECTION1_preset"] || ""); });
});

on("change:SECTION2_preset", () => {
	getAttrs(["SECTION2_preset"], (v) => { applySECTIONPresetStatic(2, v["SECTION2_preset"] || ""); });
});
```

### 5c — Init function

```javascript
const initSECTIONPresets = () => {
	getAttrs(["SECTION1_preset", "SECTION2_preset"], (v) => {
		if (v["SECTION1_preset"]) applySECTIONPresetStatic(1, v["SECTION1_preset"]);
		if (v["SECTION2_preset"]) applySECTIONPresetStatic(2, v["SECTION2_preset"]);
	});
	getSectionIDs("repeating_SECTIONgear", (ids) => {
		if (!ids.length) return;
		const fetchKeys = ids.map(id => `repeating_SECTIONgear_${id}_SECTION_preset`);
		getAttrs(fetchKeys, (rows) => {
			ids.forEach(id => {
				const p = `repeating_SECTIONgear_${id}_`;
				const preset = rows[p + "SECTION_preset"] || "";
				if (preset) applySECTIONPreset(p, preset);
			});
		});
	});
};
```

---

## Step 6 — Manual Row Section (NEW in v3)

Some sections (Armor, Weapons, Grenades & Explosives) include a manual entry fieldset below the preset repeating section. This allows players to enter custom items not covered by the preset data map.

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
| No blast zone / mode button watchers | IIFE registers all button and change watchers |

### 6c — CSS additions

```css
/* Add manual fieldset to the fieldset reset block (alphabetical) */
.ui-dialog .tab-content .charsheet fieldset.repeating_SECTIONmanual,

/* Manual rows share the same flex-row sizing as the preset rows */
/* Add repeating_SECTIONmanual to the existing .flex-row rule: */
.ui-dialog .tab-content .charsheet .repeating_SECTIONmanual .flex-row {
	display: flex; flex-wrap: nowrap; flex-direction: row;
	align-items: center; width: 100%; height: var(--cs_row_height);
	padding: 0; margin: 0; gap: 0;
}
```

### 6d — JS: IIFE pattern for manual watchers

Each manual fieldset has its own IIFE that registers all button and change watchers for that section, placed immediately before the `initSECTIONPresets` function.

```javascript
(function registerSECTIONManualWatchers() {
	const S = "repeating_SECTIONmanual";
	const id = (src) => {
		const m = (src || "").match(new RegExp(`^${S}_([^_]+)_`));
		return m ? m[1] : null;
	};

	/* Fire on row creation to populate any derived display attrs */
	on(`change:${S}:item_name_mdr`, (eventInfo) => {
		const rowId = id(eventInfo.sourceAttribute); if (!rowId) return;
		// ... resolve and setAttrs
	});

	/* Other watchers: buttons, selects, checkboxes */
})();
```

### 6e — Init function extension

Add `initSECTIONManualAttrs()` alongside `initSECTIONPresets()` in the `sheet:opened` handler:

```javascript
const initSECTIONManualAttrs = () => {
	getSectionIDs("repeating_SECTIONmanual", (ids) => {
		if (!ids.length) return;
		// fetch and resolve any display attrs for existing rows
	});
};

// In afterAllSets / sheet:opened:
initSECTIONPresets();
initSECTIONManualAttrs();
```

---

## Known Gotchas

| Gotcha | What to do |
|---|---|
| Fields don't clear on deselect | Never use `if (!entry) return`. Always call `setAttrs`. Pass a single space `" "` (not empty string) when clearing — Roll20 ignores `setAttrs` calls that set a value to `""`. |
| `class=` on named spans ignored | Use a wrapper div for styling. The rarity span is the exception — single letter, no truncation needed. |
| Column widths don't add up | When adding or removing a column, adjust the others. Standard 4-col total is ~813px: 190 + 24 + 24 + 575. |
| `overflow: hidden` clips tooltip bubble | Never set `overflow: hidden` on the effect cell or tooltip wrapper. Only the preview div gets it. |
| Flex percentages don't work | Use `width: Npx` for all columns. Roll20's global `.flex-cell` rules fight `flex-basis` values. |
| Manual row ID extraction fails | Section name must have NO underscores after `repeating_`. Use `repeating_armormanual` not `repeating_armor_manual`. |
| Repeating section name breaks Roll20 | Roll20 splits repeating section names on underscores. `repeating_foo_bar` is treated as section `"foo"` with sub-key `"bar"`. Always use a single concatenated word after `repeating_`. |
| Manual row buttons all greyed | The skill/type select must fire a watcher that writes the `btn_*` flag attrs. These are what the CSS reads to enable buttons. `computeModButtons()` does this for weapons. |

---

## Implementation Checklist

### Preset section (Steps 1–5)

- [ ] `translation.json` — all name keys added and alphabetised
- [ ] `translation.json` — all effect keys added and alphabetised
- [ ] `translation.json` — section label, preset, placeholder, equipped, effect header keys added
- [ ] `translation.json` — do NOT add `rarity-u` or `rarity_abbrev_*-u` (already in codebase)
- [ ] HTML data map — all entries have `name_key`, `effect_key`, `cost`, `rarity`, `source`
- [ ] HTML data map — `rarity` value is exactly `"common"`, `"permit"`, `"restricted"`, or `"illegal"`
- [ ] HTML data map — entries alphabetised within the map
- [ ] HTML section — collapse checkbox `id` and `for=` match
- [ ] HTML section — both static rows present (`SECTION1` and `SECTION2`)
- [ ] HTML section — repeating fieldset class is `repeating_SECTIONgear`
- [ ] HTML section — rarity cell between name and equipped in every row and header
- [ ] HTML effect cells — wrapper div carries the class, not the named span
- [ ] HTML rarity cells — plain named span, no wrapper div needed
- [ ] CSS — column widths in pixels, not flex percentages
- [ ] CSS — total column width ~813px (190 + 24 + 24 + 575)
- [ ] JS — NO `if (!entry) return` — always call `setAttrs`
- [ ] JS — `applySECTIONPreset` and `applySECTIONPresetStatic` defined
- [ ] JS — rarity written via `rarityAbbrevKey[entry.rarity]` in both apply functions
- [ ] JS — three change watchers registered (repeating + static 1 + static 2)
- [ ] JS — `initSECTIONPresets` defined and called in `sheet:opened`

### Manual section (Step 6)

- [ ] HTML — `<hr class="sheet-armor-divider"/>` before manual header
- [ ] HTML — duplicate header div with identical cells above manual fieldset
- [ ] HTML — manual fieldset class is `repeating_SECTIONmanual` (no mid-word underscores)
- [ ] HTML — hidden persistent attrs at grid-row level (not inside `flex-row`)
- [ ] HTML — rarity is a `<select>` not a `<span>` (user picks C/I/P/R)
- [ ] HTML — all display fields are `<input type="text">` (user editable)
- [ ] CSS — `repeating_SECTIONmanual` added to fieldset reset block
- [ ] CSS — `repeating_SECTIONmanual .flex-row` shares the same sizing rule
- [ ] JS — IIFE registers all watchers for the manual section
- [ ] JS — `initSECTIONManualAttrs()` defined and called in `sheet:opened`

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
