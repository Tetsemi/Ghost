# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Full reference documentation is in [`Documentation/Claude.md`](Documentation/Claude.md). This file covers the rules most likely to cause bugs if missed.

## Project Overview

**Ghost of Arcadia** is a custom Roll20 character sheet for a cyberpunk/fantasy TTRPG, built on the Call of Cthulhu 7th Ed architecture (percentile d100 skill system, bonus/penalty dice).

| File | Purpose |
|---|---|
| `ghost_of_arcadia.html` | Sheet HTML + embedded sheet workers + all DataMaps + roll templates |
| `ghost_of_arcadia.css` | All styling; four themes via CSS custom properties |
| `translation.json` | All i18n string keys — **strictly alphabetical** |
| `API Scripts/*.js` | Roll20 Pro API scripts (server-side only) |
| `sheet.json` | Roll20 sheet manifest |
| `Documentation/Claude.md` | Comprehensive architecture, schemas, and lessons learned |
| `Documentation/DataMaps/` | Standalone DataMap reference files |
| `Documentation/Todo list.md` | Active bugs and pending tasks — check before starting any new section |

---

## Mandatory Formatting Rules

- **Tab indentation only** — no spaces, ever. Applies to HTML, CSS, JS, and JSON.
- **`translation.json` is strictly alphabetical by key.** Insert at the correct position; never append. For multi-key insertions, extract the full affected range, merge and sort, then write back.
- **DataMap entries are alphabetical within each map.** Never append to the bottom of a DataMap.
- **Never hard-code hex color values.** All colors use CSS variables defined in `:root`.

---

## DataMaps

DataMaps in `ghost_of_arcadia.html` are the **single source of truth** for all game data. Do not hard-code values in HTML or sheet workers that belong in a DataMap.

Every entry requires a `source: {}` object — update `version` and `date` whenever rule text changes:

```javascript
skill_name: {
	label:  "skill_name-u",
	base:   20,
	skill:  "skill_name_skill_mdr",
	bonus:  "skill_name_mdr",
	source: { doc: "welcome_to_new_arcadia-u", version: "2.260315", date: "2026-03-15", section: "skills-u" }
},
```

The `skill` field in DataMaps must hold the **`skillDataMap` key** (e.g. `"drive_auto"`), never the sheet attribute name (e.g. `"drive_auto_mdr"`). Apply functions look up `skillDataMap[data.skill].bonus` to get the attr name.

---

## translation.json Rules

- All user-facing keys use `-u` suffix; roll text keys use `-r-txt`; description keys use `_desc-u`.
- Add **all** required translation keys before touching the HTML — missing keys silently render the raw key string in Roll20.
- No duplicate keys.
- Never round-trip values through `json.loads` + manual write — `json.loads` decodes `\n` into literal newlines, corrupting multi-line values. Work on the raw string: find the alphabetical insertion point by scanning raw key lines with regex, then splice the new raw JSON line in directly.

---

## HTML / Sheet Workers

- All sheet workers live in `<script type="text/worker">` at the bottom of the HTML.
- Use `const` and arrow functions throughout; DataMaps first, then helpers, then `on()` watchers, then `on('sheet:opened', ...)` init at the very end.
- All CSS classes require the `sheet-` prefix (Roll20 sandbox requirement).
- Repeating section `fieldset` attribute `name` values still need the `attr_` prefix inside the fieldset even though Roll20 prepends `repeating_sectionname_id_` automatically.
- Roll20 renders `<fieldset class="repeating_X">` as `<div class="repcontainer" data-groupname="repeating_X">` in the live DOM — never use `.repeating_X` as a CSS selector; it matches nothing.
- Roll20 attribute names are always lowercased — never use uppercase letters in attr names.
- Checkboxes must use `value="1"` for reliable `change:` event firing.

### i18n in Sheet Workers

Never hardcode display strings. All user-visible strings written via `setAttrs` must use `tr()`:

```javascript
const tr = (k) => (k && typeof getTranslationByKey === "function") ? (getTranslationByKey(k) || k) : (k || "");
```

`tr` is function-scoped — declare it locally inside every top-level handler that needs it. A missing `tr` in `handleTrackerStrainDeduction` silently kills all tracker rolls.

### Init Functions

`initXxxPresets()` runs on every `sheet:opened`. It must **not** call `applyXxxPreset` for sections with player-editable stateful values (e.g. current HP) — that overwrites player data on every reload. Fetch existing values and pass a `preserveState` flag to the apply function. For purely computed display attrs with no prior attr state (new sections), calling apply from init is correct.

### `setAttrs` vs `change:` Timing

`setAttrs` callbacks fire after writes are committed; `change:` watchers fire before the write is readable by `getAttrs`. When a recalc must read attrs just written by `setAttrs`, call it in the `setAttrs` **callback**, never via a `change:` watcher on those attrs.

### Repeating Section Row Add

Roll20 does not fire `change:` events reliably for checkboxes or empty selects on new row add. Never rely on a per-row watcher to initialise display state for a brand new row. The preferred pattern is a global CSS controller input + CSS `~` sibling selectors.

---

## CSS Rules

- CSS section boundaries are marked with `/* ------- Section - Start ------- */` / `/* --- Section - End --- */` comments. Always read surrounding markers before inserting CSS; insert inside the correct section only.
- The sheet is fixed at **840px wide** (`--cs_sheet_width`). Column pixel widths must sum to 813px (840 minus borders).
- **Tooltip bubble class is `sheet-tooltip-bubble`** (no `sheet-skill-` prefix). Using `sheet-skill-tooltip-bubble` has no CSS hover rule — the bubble never appears.
- Never set `overflow: hidden` on the tooltip wrapper or effect cell container — only the preview span gets overflow clipping. The bubble must be able to overflow.
- Roll toggle CSS hide rules must come **after** the global `button[type="roll"].new-roll { display: flex }` rule and must include `button[type="roll"]` in the selector to win specificity.
- For value+roll columns, use the `sheet-val-roll-static` wrapper — never add a separate button column.

### CSS `~` Sibling Selector

`~` only selects siblings with the **exact same parent**. Confirm that the controller input and target element share the same immediate parent in the rendered HTML before writing a `~` rule. A controller outside a repeating section reaches into it via: `input ~ .sheet-colrow .repcontainer[data-groupname="repeating_X"] .target-class`.

---

## Roll20 API Scripts

`API Scripts/*.js` are **server-side Roll20 Pro** scripts — they use `on('ready', ...)`, `findObjs()`, `createObj()`, `sendChat()`, etc. They do not run in the browser and cannot be imported into the sheet HTML. Upload individually via the Roll20 API Script editor.

---

## Core Mechanic Reference

Percentile (d100) system: success = roll ≤ skill value. Critical = 01, Extreme = ≤ skill/5, Hard = ≤ skill/2, Fumble = 100 (or 96–100 if skill < 50). Stats: STR, DEX, INT, CON, APP, POW, SIZ, EDU (range 15–90). Currency: Credits (Cr).
