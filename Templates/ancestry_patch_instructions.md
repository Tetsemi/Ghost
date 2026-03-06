# Ancestry Patch Instructions — Ghost of Arcadia
### Generic Ancestry Talent Updater — Operational Reference

---

## 0) Patch Parameters (edit ONLY this block per request)

**Files (always the same):**
- `ghost_of_arcadia.html`
- `ghost_of_arcadia.css`
- `translation.json`

**Target Ancestry + Scope:**
- `RACE_KEY`: `veyra`*(e.g. `draevi`)* — must match the key in `ancestryTalentDataMap`
- `TARGET_TIER`: `1`*(integer: 1, 2, 3, or 4)*
- `IN_SCOPE_SECTIONS` *(only these; nothing else)*:
  - `talents` *(required when tier work is requested)*
  - `traits` *(required when ancestryDataMap trait work is requested)*

**Source Version:**
- `SOURCE_VERSION`: `2.260305`*(e.g. `2.260208`)*
- `SOURCE_DATE`: `2026-03-05`*(e.g. `2026-02-08`)*
- `SOURCE_DOC`: `ancestrry-u`*(e.g. `draevi-u` — ancestry name key)*
- `SOURCE_SECTION`: `<RACE_KEY>-u`

**Talent Inputs (tab-delimited: Name | Rules Text | Prerequisite Name):**
- `TIER_TALENTS_INPUT`:
```
Compression Instinct	Type: Passive (Structural Familiarity) • Cost: — • Usage: At-will — Tight spaces — collapsed corridors, maintenance shafts, low-clearance ducts — count as normal terrain for you. You do not suffer movement penalties or additional Maneuver costs when traversing them.
Dark Geometry	Type: Passive (Acoustic Navigation) • Cost: — • Usage: At-will — You do not suffer penalty dice on Stealth, Athletics, or Coordination rolls from darkness or obscured visibility. If you are Deafened or in an environment that actively distorts sound, this feature is suppressed until resolved.
Pressure Map	Type: Free Action (Spatial Read) • Cost: — • Usage: 1/Scene — When you enter a physical space, or after its layout changes — collapse, an opening, movement of obstacles — roll Perception. On a success, you gain +1 bonus die on your next roll this scene to navigate, reposition, find cover, or detect hidden movement within that space. This functions in total darkness and does not require line of sight.
Read the Fault	Type: Free Action (Mechanical Assessment) • Cost: — • Usage: 1/Scene — When you first interact with or closely observe a damaged, malfunctioning, or improvised device, you immediately learn whether it is functional, partially functional, or beyond field repair, and which component is responsible for its current state. No roll is required.
Still as the Shaft	Type: Passive (Movement Stealth) • Cost: — • Usage: At-will — Moving at standard pace does not impose penalty dice on Stealth checks. This does not apply to sprinting or combat movement.
```

**Trait Inputs (tab-delimited: Name | Rules Text):**
- `TRAIT_INPUTS`:
```
```

**Schema Reference:**
- `SCHEMA_REFERENCE_RACE`: `draevi`*(another race key with complete schema — for field names/types only, never content. Prefer `khadra` or `feran` as they have the most complete field coverage.)*

- `OPERATION`: `replace_tier`
  - `replace_tier`: TIER_TALENTS_INPUT is the complete and final talent list for TARGET_TIER.
    Talents in the file at TARGET_TIER not present in the input must be REMOVED (datamap object,
    tier HTML row, tracker HTML, CSS, and JSON keys).
  - `add`: TIER_TALENTS_INPUT contains new talents only. Existing talents at TARGET_TIER are untouched.
  - `update`: TIER_TALENTS_INPUT contains modified versions of existing talents. Keys must match.
---

## 1) Operational Workflow

### Phase 1 — Read Before Writing

Extract verbatim from the three files:

**From `ghost_of_arcadia.html`:**
- `ancestryTalentDataMap.<RACE_KEY>` — full object for the target race; note talents at TARGET_TIER and each talent's `source` field
- Tier HTML block: `<div class="sheet-talent-tier" data-tier="N">` for the race
- Tracker HTML rows for all talents at TARGET_TIER with `usage_limit: "scene"` or `"session"`
- `skillDataMap` — for skill key validation
- `ancestryDataMap.<RACE_KEY>` — to confirm the race exists, its key spelling, and (when `traits` is in scope) the full `traits.items` object and race-level `source` field
- Trait HTML block: `<div class="sheet-racial-traits">` for the race *(when `traits` is in scope)*

**From `ghost_of_arcadia.css`:**
- CSS show selectors for each in-scope talent at TARGET_TIER

**From `translation.json`:**
- All `talent_<race>_<talent_key>-u` and `talent_<race>_<talent_key>_rules-u` keys for in-scope talents
- All `racial_<race>_<trait_key>-u` and `racial_<race>_<trait_key>_rules-u` keys for in-scope traits *(when `traits` is in scope)*

> **Gate:** If any block cannot be extracted verbatim, stop and report. Do not produce patches.

---

### Phase 2 — Parse Inputs

**Talent key derivation** (from displayed talent name):
- Lowercase
- Remove all punctuation
- Spaces → underscores

**Rules text parsing** (deterministic, column 2):

| Input field | Maps to | Notes |
|---|---|---|
| `Type:` | `type.economy` | See mapping table below |
| `Cost:` | `strain` | `—` or blank → `""`; `N Strain` → `"N"`; dice → `"1d4"` etc. Always a string. |
| `Usage:` | `usage_limit` | `1/Scene` → `"scene"`; `1/Session` → `"session"`; absent → `""` |

**`type.economy` mapping:**

| Input | Value |
|---|---|
| Reaction | `"reaction"` |
| Free Action | `"free_action"` |
| Passive | `"passive"` |
| Special Immediate | `"special_immediate"` |
| Active | `"active"` |
| Maneuver | `"maneuver"` |
| Action | `"action"` |

**`type.tag`:**
- If talent already exists in file: preserve the existing value.
- If talent is new or tag is absent: derive the closest descriptive string from the rules text.
- Flag any tag not found in `talentTagMap` in Provenance & Checks: `"tag: <value>" — not found in talentTagMap, needs map update or text review`.
- Never leave the field structurally absent on a talent being added or edited.

**`affected_skill` derivation:**
- Include a skill key for every skill that appears mechanically in the rules text: rolling it, opposing it, comparing against it, or referenced as a trigger or condition.
- This is a relevance index for the skill summary page — include rather than omit when uncertain.
- If no skills appear mechanically: use `[]` (empty array). Do not omit the field.
- Validate all keys against `skillDataMap`. List any unresolved references in Provenance & Checks.
- If editing an existing talent and `affected_skill` is incomplete, correct it in the same patch.
- **Note on `affected_skill_group`:** Some existing lyranni and kitsu talents use `affected_skill_group: "social"` instead of enumerating individual skills. If the race being patched already uses this pattern, preserve it. Do not introduce it for races that don't already use it.

**Prerequisite derivation** (column 3):
- Apply same key derivation rule as talent keys.
- Validate the resulting key exists in the file at tier TARGET_TIER − 1.
- Exception: `""` (empty string) represents "Any 1 Tier N−1 talent" — a soft requirement enforced by the sheet worker, not a specific key reference. Tier 1 talents always have `""`.
- If a prerequisite key is missing from tier N−1 in the file, flag it and halt that talent's output. Do not write a broken reference.
- Tiers are processed in order (1 → 2 → 3 → 4). By the time tier N is patched, tiers 1 through N−1 are already correct in the file and can be trusted.

**`source` field — talent blocks:**
- Ancestry talent blocks carry a single `source` line at the **end of the race object** in `ancestryTalentDataMap`, after all talent entries. It is not on individual talent objects.
- Format: `source: { doc: "ancestry-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "<race>-u" }`
- `version` and `date` come from SOURCE_VERSION / SOURCE_DATE — the document's publication date, not today's date.
- Bump `version` and `date` on the race-level source line whenever any talent in the race is added or has content changed in this patch.
- If the existing file has per-talent source fields (legacy pattern), leave them in place on untouched talents; remove them only from talents being rewritten, and ensure the race-level source line is present and bumped.

**Normalization — apply everywhere in changed content:**
- `Pistol` → `Handgun`, `pistol` → `handgun`
- `Archanotech` → `Arcanotech`, `archanotech` → `arcanotech`

---a

### Phase 3 — Diff: Identify Actual Changes

For each surface, compare extract against input-derived target. If a surface already matches: **no output for it** (no identical REMOVE/ADD pairs).

| Surface | What to check |
|---|---|
| `ancestryTalentDataMap` talent objects | All fields in canonical order — see §2 |
| Field consistency | Any in-scope talent missing `strain: ""` gets it added; any missing `affected_skill: []` gets it added |
| Tier HTML | Comment header index, talent row markup, prereq spans, alphabetical order by key |
| Tracker HTML | show input + scene/session div for each usage_limit: scene/session talent |
| CSS | Show selectors for each scene/session talent |
| JSON | Name string and rules string for each in-scope talent |

When `OPERATION`: `replace_tier`, the diff target for the tier is exclusively the input list — any existing talent key absent from the input is treated as deleted and all three of its surfaces (datamap, HTML, tracker+CSS, JSON) get REMOVE blocks with no paired ADD.

---

### Phase 4 — Tracker Coupling (Mandatory)

Every talent with `usage_limit: "scene"` or `"session"` requires all three of:

**Tracker HTML (in the scene or session tracker block for the race, alphabetical by talent key):**
```html
<!-- Ancestry Talent: <Display Name> (<scene|session>) -->
<input type="hidden" name="attr_show_<race>_<talent_key>"/>
<div class="sheet-tracker-item sheet-tracker-<scene|session> sheet-<race>-<talent-hyphenated>">
    <input type="checkbox" name="attr_used_<scene|session>_<race>_<talent_key>" class="sheet-tracker-checkbox"/>
    <span class="sheet-tracker-label" data-i18n="talent_<race>_<talent_key>-u"></span>
</div>
```

**CSS show selector:**
```css
.ui-dialog .tab-content .charsheet input[name="attr_show_<race>_<talent_key>"][value="1"] ~ .sheet-<race>-<talent-hyphenated> {
    display: flex;
}
```

**Talent row in tier HTML** must include a `sheet-<race>-<talent-hyphenated>` class on its wrapper div so the CSS selector can reach it:
```html
<input type="hidden" name="attr_<race>_<talent_key>_lockflag" value="0"/>
<div class="sheet-talent-row sheet-<race>-<talent-hyphenated>">
    <input type="checkbox" name="attr_<race>_<talent_key>" class="sheet-talent-checkbox" value="1"/>
    <span class="sheet-talent-label" data-i18n="talent_<race>_<talent_key>-u"></span>
    <span class="sheet-talent-description" data-i18n="talent_<race>_<talent_key>_rules-u"></span>
    <span class="sheet-talent-prereq" data-i18n="<prereq_i18n_key_or_empty>"></span>
</div>
```

Rules:
- Talent added → add all three if missing
- Talent removed → remove all three in same patch
- A tracker HTML ADD must always have a matching CSS ADD (and vice versa)
- `usage_limit: ""` → no tracker rows unless the existing pattern explicitly has them

---

### Phase 5 — Produce Patch Files

Three downloadable files, each containing only REMOVE/ADD blocks:

**HTML patch** — in this order:
1. `ancestryTalentDataMap` talent object changes *(when `talents` is in scope)*
2. Tier HTML row changes *(when `talents` is in scope)*
3. Tracker HTML row changes *(when `talents` is in scope)*
4. `ancestryDataMap` trait object changes *(when `traits` is in scope)*
5. Trait HTML row changes *(when `traits` is in scope)*
6. Trait tracker HTML row changes *(when `traits` is in scope and any trait has `usage_limit: "scene"` or `"session"`)*

**CSS patch** — in this order:
1. Talent show selectors *(when `talents` is in scope)*
2. Trait tracker selectors (`attr_showracials` pattern) *(when `traits` is in scope and any trait has `usage_limit: "scene"` or `"session"`)*

**JSON patch** — i18n key changes only, alphabetized by key string

**REMOVE block rules:**
- Must be copied byte-identical from the current file
- Includes comment headers, braces, exact indentation, trailing commas
- If byte-identical copy cannot be guaranteed: stop, do not produce patches

**ADD block rules:**
- Produced by editing the REMOVE excerpt only — never constructed from a template
- Unchanged lines within an ADD block are byte-identical to the REMOVE block
- Includes comment headers, braces, exact indentation, trailing commas
- Only changed contiguous blocks are included (minimality)

**No-op rule:** if a surface has no changes, produce a clearly labelled no-op comment rather than identical REMOVE/ADD pairs.

---

### Phase 6 — Provenance & Checks (chat output only)

Output exactly one code block in chat titled `Provenance & Checks`:

```
Files used: ghost_of_arcadia.html, ghost_of_arcadia.css, translation.json
Ancestry + tier: <RACE_KEY> | Tier <TARGET_TIER> | Scope: <talents|traits|talents+traits>
Counts: <N> talents updated/added, <N> traits updated/added, <N> i18n keys changed

Validations:
  [PASS|FAIL] REMOVE blocks extracted verbatim
  [PASS|FAIL] Talent key derivation
  [PASS|FAIL] Trait key derivation
  [PASS|FAIL] Type/strain/usage_limit parsing (talents)
  [PASS|FAIL] usage_limit parsing (traits)
  [PASS|FAIL] Prerequisite keys exist at Tier N-1 in file
  [PASS|FAIL] Prerequisite tier = TARGET_TIER - 1
  [PASS|FAIL] affected_skill keys all in skillDataMap
  [PASS|FAIL] affected_skill field present on all edited talents ([] if none)
  [PASS|FAIL] strain field present as string on all edited talents
  [PASS|FAIL] type field present on all edited talents
  [PASS|FAIL] source bumped at race level (talents block)
  [PASS|FAIL] source bumped at race level (traits block)
  [PASS|FAIL] Tracker coupling (HTML + CSS paired)
  [PASS|FAIL] Tracker in correct list (scene vs session)
  [PASS|FAIL] Indentation style preserved (no normalization)
  [PASS|FAIL] Alphabetization (talent/trait keys in datamap, i18n keys in JSON, tracker rows by key)
  [PASS|FAIL] Normalization substitutions applied
  [PASS|FAIL] Canonical talent field order applied
  [PASS|FAIL] Canonical trait field order applied

Patch manifest:
  ancestryTalentDataMap: [CHANGED lines N–N | NO-OP]
  Tier HTML:             [CHANGED | NO-OP]
  Tracker HTML (talents):[CHANGED | NO-OP]
  CSS selectors (talents):[CHANGED | NO-OP]
  ancestryDataMap:       [CHANGED lines N–N | NO-OP]
  Trait HTML:            [CHANGED | NO-OP]
  Tracker HTML (traits): [CHANGED | NO-OP]
  CSS selectors (traits):[CHANGED | NO-OP]
  JSON keys:             [CHANGED | NO-OP]

Flags:
  - type.tag "<value>" on <talent_key>: not found in talentTagMap — needs map update or text review
  - (any other flags)
```

---

## 2) Field Reference

### Canonical talent field order

All ancestry talent objects must use this field order. The cleanup pass standardized `feran`, `khadra`, `human`, `alteri`, `draevi`, `lyranni` to this order — new and edited talents must match it:

```javascript
talent_key: {
    tier: N,
    cost: N,
    capstone: false,
    name_key: "talent_<race>_<talent_key>-u",
    rule_text_key: "talent_<race>_<talent_key>_rules-u",
    type: { economy: "<string>", tag: "<string>" },
    strain: "",
    usage_limit: "",
    affected_skill: [],
    affected_skill_group: "...",   // omit if not used
    affected_stat: "...",          // omit if not used
    prerequisite: "",
},
// ... more talents ...
source: { doc: "<SOURCE_DOC>-u", version: "<SOURCE_VERSION>", date: "<SOURCE_DATE>", section: "ancestry-u" }
```

The `source` line appears **once, at the end of the race object**, after all talent entries — not inside individual talent objects. **Optional fields** (`affected_skill_group`, `affected_stat`) are omitted entirely when not applicable.

### Required fields on every talent object

| Field | Type | Notes |
|---|---|---|
| `tier` | integer | Must equal TARGET_TIER. Tier 1 = 10 XP, Tier 2 = 20 XP, Tier 3 = 30 XP, Tier 4 = 40 XP |
| `cost` | integer | Always `tier × 10` |
| `capstone` | boolean | `true` only for tier 4 capstones |
| `name_key` | string | `"talent_<race>_<talent_key>-u"` |
| `rule_text_key` | string | `"talent_<race>_<talent_key>_rules-u"` |
| `type` | object | `{ economy: "<string>", tag: "<string>" }`. Always present. |
| `strain` | string | Always a string: `""`, `"1"`, `"1d4"`, etc. Always present. |
| `usage_limit` | string | `"scene"`, `"session"`, or `""` |
| `affected_skill` | array of strings | Skill keys; `[]` if none. Always present. |
| `prerequisite` | string or array | Key at tier N−1, `""` for none/any, or `["key_a", "key_b"]` for multi-prereq | Single-key prerequisites must still be written as a single-element array ["key"], not a bare string. |

The race object also carries a single `source` line after all talent entries — see `source` field format below.

### `source` field format (race-level, talents block)

```javascript
source: { doc: "<race>-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "ancestry-u" }
```
- `doc`: race name key (e.g. `"draevi-u"`)
- `version` / `date`: from SOURCE_VERSION / SOURCE_DATE — the document's publication date
- `section`: always `"ancestry-u"` for the talent block
- Lives **at the end of the race object** in `ancestryTalentDataMap`, after all talent entries — not inside individual talent objects

### i18n key format

| Key | Format |
|---|---|
| Name | `talent_<race>_<talent_key>-u` |
| Rules | `talent_<race>_<talent_key>_rules-u` |

*(Note: ancestry uses `talent_` prefix; career uses `career_` prefix — never mix)*

### Tracker attribute naming

| Attribute | Format |
|---|---|
| Show hook | `attr_show_<race>_<talent_key>` |
| Scene used | `attr_used_scene_<race>_<talent_key>` |
| Session used | `attr_used_session_<race>_<talent_key>` |

### CSS and HTML class naming

| Element | Format |
|---|---|
| Talent div class | `sheet-<race>-<talent-key-hyphenated>` |
| Tracker div class | `sheet-<race>-<talent-key-hyphenated>` (same) |

*(Hyphenated = underscores replaced with hyphens in class names)*

### Tier HTML comment header format

```html
<!-- Ancestry Talent: <Display Name> | key: <talent_key> | cost: <N> XP | cadence: <scene|session|none> | attrs: attr_<race>_<talent_key>, attr_<race>_<talent_key>_lockflag | i18n: talent_<race>_<talent_key>-u | — | talent_<race>_<talent_key>_rules-u -->
```

### Tier HTML index block format

```html
<!-- ================== <RACE> TALENTS: INDEX (Tier N) (key | cost | cadence) ================== -->
<!-- - talent_<race>_<key_a> (N XP, <scene|session|none>) -->
<!-- - talent_<race>_<key_b> (N XP, none) -->
<!-- ============================================================================================================== -->
```

### Tier container HTML structure

```html
<div class="sheet-talent-tier sheet-ancestry-tier-collapsible" data-tier="N">
    <input type="checkbox" class="sheet-top-collapse" id="ancestry_<race>_tierN_collapse" name="attr_ancestry_<race>_tierN_collapse" value="1"/>
    <h4 class="sheet-section-head sheet-talent-tier-header">
        <span data-i18n="tierN_talents-u">Tier N Talents (N×10 XP)</span>
        <label class="sheet-top-collapse-hit" for="ancestry_<race>_tierN_collapse" title="Toggle section"></label>
    </h4>
    <div class="sheet-section-body">
        <!-- index block -->
        <!-- talent rows, alphabetical by key -->
    </div>
</div>
```

---

## 3) Hard Rules (never violate)

1. **Only edit what is named in `IN_SCOPE_SECTIONS` for `RACE_KEY` and `TARGET_TIER`.**
2. **REMOVE blocks must be byte-identical to the file.** If not possible, stop.
3. **No invented keys, fields, enums, or tag values.** If a required field has no established value, flag it.
4. **No new HTML/CSS structure.** Follow patterns found in the existing files for the targeted race and tier.
5. **Alphabetize everything by key:** talent keys in ancestryTalentDataMap, i18n keys in JSON, tracker rows by talent key, CSS selectors by talent key.
6. **Tiers process in order 1 → 4.** Do not look ahead or correct higher-tier entries while patching a lower tier.
7. **Prerequisite chain:** every Tier N talent's prerequisite must be a Tier N−1 talent key (or `""`). Flag violations; do not silently write them.
8. **Tracker coupling is mandatory** for all scene/session talents. HTML and CSS additions/removals are always paired.
9. **`strain` is always a string**, even for plain integers. Always present.
10. **`affected_skill` is always an array**, even when empty (`[]`). Always present.
11. **`source` is race-level, not per-entry.** One `source` line lives at the end of the race object in `ancestryTalentDataMap` (after all talent entries) and one at the race level in `ancestryDataMap` (after the `traits` block). Bump it when any entry in that race changes. Do not add per-talent or per-trait source fields.
12. **Canonical field order is mandatory** on all new and edited talent objects. See §2.
13. **Preserve indentation style per race.** Some races use spaces, others use mixed tabs/spaces. Never normalize to a uniform style in a patch — match what is already there.
14. **No inline code blocks in chat.** All file content goes in the downloadable patch files. Chat output is limited to the `Provenance & Checks` block.

---

## 4) Known Schema Inconsistencies (do not propagate)

The following inconsistencies exist in the file due to races being authored at different times. Note them for awareness — do not fix them outside a dedicated cleanup patch, and never introduce them in new work:

| Race | Issue |
|---|---|
| `kitsu` | Missing `strain`, `type`, and `source` on most talents. Uses `skills:` instead of `affected_skill:` on some entries. Do not replicate. |
| `veyra` | Missing `strain`, `type`, and `source` on all talents. Do not replicate. |



The following races were fully cleaned up in the 2026-03 schema pass and are fully canonical:
- `alteri`, `draevi`, `feran`, `human`, `khadra`, `lyranni`

When patching a race with remaining inconsistencies, add the missing fields to any talent you are already editing in scope. Do not do a wholesale backfill unless that is explicitly the stated purpose of the patch.

---

## 5) HTML Structure Reference

### Tier container

```html
<div class="sheet-talent-tier sheet-ancestry-tier-collapsible" data-tier="N">
    <input type="checkbox" class="sheet-top-collapse" id="ancestry_<race>_tierN_collapse" name="attr_ancestry_<race>_tierN_collapse" value="1"/>
    <h4 class="sheet-section-head sheet-talent-tier-header">
        <span data-i18n="tierN_talents-u">Tier N Talents (N×10 XP)</span>
        <label class="sheet-top-collapse-hit" for="ancestry_<race>_tierN_collapse" title="Toggle section"></label>
    </h4>

    <div class="sheet-section-body">
        <!-- index block -->

        <!-- Tier 1: talent rows directly here, no prereq toggle -->

        <!-- Tiers 2–4: prereq toggle + sheet-ancestry wrapper -->
        <!-- Toggle -->
        <!-- controller (stays before .sheet-ancestry) -->
        <input type="checkbox" id="show_<race>_talent_prereqs_tN" class="sheet-prereq-toggle" name="attr_show_<race>_talent_prereqs_tN" value="1"/>

        <!-- visual control -->
        <div class="sheet-talent-toolbar">
            <label class="sheet-prereq-toggle-label" for="show_<race>_talent_prereqs_tN">
                <span data-i18n="show_prereqs-u">Show prerequisites</span>
            </label>
        </div>

        <div class="sheet-ancestry">
            <!-- talent rows -->
        </div>
    </div>
</div>
```

**Tier 4 header** uses a slightly different i18n string that includes "Capstone": `tier4_talents-u` = "Tier 4 Talents (40 XP - Capstone)"

### Index block format

```html
<!-- ================== <RACE_UPPER> TALENTS: INDEX (Tier N) (key | cost | cadence) ================== -->
<!-- - talent_<race>_<key_a> (N XP, <scene|session|none>) -->
<!-- - talent_<race>_<key_b> (N XP, none) -->
<!-- ============================================================================================================== -->
```

- Race name is uppercased: `FERAN`, `DRAEVI`, `COMBAT_ENGINEER` etc.
- No `ANCESTRY` prefix — just `<RACE_UPPER> TALENTS:` (distinct from career's `CAREER <CAREER_UPPER> TALENTS:`)
- Entries alphabetized by talent key
- Cadence is `scene`, `session`, or `none`

### Talent comment header format

```html
<!-- Ancestry Talent: <Display Name> | key: <talent_key> | cost: N XP | cadence: <scene|session|none> | attrs: attr_<race>_<talent_key>, attr_<race>_<talent_key>_lockflag | i18n: talent_<race>_<talent_key>-u | — | talent_<race>_<talent_key>_rules-u -->
```

Note: the `key:` field uses just the bare talent key (e.g. `anglecraft`), not the prefixed form — unlike the index block which uses the full `talent_<race>_<talent_key>` form.

### Talent row — Tier 1

No `_enabled` field, no prereq span, no `sheet-ancestry` wrapper:

```html
<!-- Ancestry Talent: <Display Name> | key: <talent_key> | ... -->
<div class="sheet-talent-row">
    <input type="hidden" name="attr_<race>_<talent_key>_lockflag" value="0"/>
    <input type="checkbox" name="attr_<race>_<talent_key>" value="1" class="sheet-talent-checkbox"/>
    <label class="sheet-talent-label"><span data-i18n="talent_<race>_<talent_key>-u"></span></label>
    <span class="sheet-talent-description" data-i18n="talent_<race>_<talent_key>_rules-u"></span>
</div>
```

### Talent row — Tiers 2–3

Adds `_enabled`, prereq span, and lives inside the `<div class="sheet-ancestry">` wrapper:

```html
<!-- Ancestry Talent: <Display Name> | key: <talent_key> | ... -->
<div class="sheet-talent-row">
    <input type="hidden" name="attr_<race>_<talent_key>_enabled" value="0"/>
    <input type="hidden" name="attr_<race>_<talent_key>_lockflag" value="0"/>
    <input type="checkbox" name="attr_<race>_<talent_key>" value="1" class="sheet-talent-checkbox"/>
    <label class="sheet-talent-label"><span data-i18n="talent_<race>_<talent_key>-u"></span></label>
    <span class="sheet-talent-description" data-i18n="talent_<race>_<talent_key>_rules-u"></span>
    <span class="sheet-talent-prereq" data-i18n="talent_<race>_<prerequisite_key>-u"></span>
</div>
```

### Talent row — Tier 4 (capstone)

Same as tiers 2–3 but adds `sheet-tier4-checkbox` to the checkbox class:

```html
<input type="checkbox" name="attr_<race>_<talent_key>" value="1" class="sheet-talent-checkbox sheet-tier4-checkbox"/>
```

Note: ancestry capstones use `sheet-tier4-checkbox`, not `sheet-capstone-checkbox` (which is the career pattern).

### Attribute naming in HTML

Note that the `key:` in the comment header is the bare talent key without the race prefix. The full prefixed form only appears in the index block and i18n attributes:

| Context | Format |
|---|---|
| Comment header `key:` | `<talent_key>` (e.g. `anglecraft`) |
| Index block entry | `talent_<race>_<talent_key>` |
| HTML `attr_` name | `attr_<race>_<talent_key>` |
| i18n key | `talent_<race>_<talent_key>-u` |
| `ancestryTalentDataMap` talent key | `<talent_key>` (bare, inside race object) |


---

## 6) Ancestry Traits — `ancestryDataMap` Patch Reference

Traits are distinct from talents. They live in `ancestryDataMap.<RACE_KEY>.traits.items`, have their own HTML block, their own JSON key prefix, and simpler schema. This section covers everything needed to add, remove, or update traits.

### When traits are in scope

Set `traits` in `IN_SCOPE_SECTIONS`. Traits do not use `TARGET_TIER` (they are not tiered). All other §0 parameters (`RACE_KEY`, `SOURCE_VERSION`, `SOURCE_DATE`, `SOURCE_DOC`, `SOURCE_SECTION`, `OPERATION`) apply normally.

`OPERATION` semantics for traits:
- `replace_all`: TRAIT_INPUTS is the complete and final trait list. Traits in the file not present in the input are removed (datamap entry, HTML row, JSON keys).
- `add`: TRAIT_INPUTS contains new traits only. Existing traits are untouched.
- `update`: TRAIT_INPUTS contains modified versions of existing traits. Keys must match.

**Trait input format (tab-delimited: Name | Rules Text):**
- `TRAIT_INPUTS`:
```
<insert here>
```
No prerequisite column — traits have no prerequisites.

---

### Trait schema — `ancestryDataMap.traits.items`

Each trait entry under `traits.items`:

```javascript
trait_key: {
    name_key: "racial_<race>_<trait_key>-u",
    rule_text_key: "racial_<race>_<trait_key>_rules-u",
    affected_skill: [ "skill_key" ],    // omit if not applicable
    affected_skill_group: [ "group" ],  // omit if not applicable
    affected_stat: "stat_key",          // omit if not applicable
    usage_limit: ""                     // "", "scene", or "session"
},
```

The race object in `ancestryDataMap` carries a single `source` line after the `traits` block:
```javascript
source: { doc: "<race>-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "traits-u" }
```
- `section` is `"traits-u"` for the traits source (not `"ancestry-u"`)
- Bump `version` and `date` whenever any trait in the race is added or changed

**Canonical trait field order:**
1. `name_key`
2. `rule_text_key`
3. `affected_skill` *(omit if absent)*
4. `affected_skill_group` *(omit if absent)*
5. `affected_stat` *(omit if absent)*
6. `usage_limit`

**Trait key derivation** (from display name): same rule as talent keys — lowercase, remove all punctuation, spaces → underscores.

**`affected_skill` on traits:** include skill keys that appear mechanically in the rules text. Omit the field entirely if no skills apply (unlike talent objects, where `affected_skill: []` is always present). If the existing trait has the field, preserve or correct it in scope.

**`usage_limit` on traits:** `""` (passive/always-on), `"scene"`, or `"session"`. Parsed from rules text the same way as talents.

---

### Trait HTML — `<div class="sheet-racial-traits">`

Traits with `usage_limit: "scene"` or `"session"` **do** require tracker rows and CSS selectors — but the pattern differs significantly from talent trackers.

#### Container structure (for reference — do not patch outside trait rows)

```html
<div class="sheet-racial-traits">
    <input type="checkbox" class="sheet-top-collapse" id="sheet-ancestry-<race>-traits" name="attr_ancestry_<race>_traits_open" value="1"/>
    <h4 class="sheet-section-head">
        <span data-i18n="senses_and_ancestral_traits-u">Senses &amp; Ancestral Traits</span>
        <label class="sheet-top-collapse-hit" for="sheet-ancestry-<race>-traits" title="Toggle section"></label>
    </h4>
    <div class="sheet-section-body">
        <div class="sheet-racial-trait-list">
            <!-- index block -->
            <!-- trait rows, alphabetical by key -->
        </div>
    </div>
</div>
```

#### Trait index block format

```html
<!-- ================== <RACE_UPPER> ANCESTRY TRAITS: INDEX (key | cost | cadence) ================== -->
<!-- - racial_<race>_<key_a> (0 XP, none) -->
<!-- - racial_<race>_<key_b> (0 XP, none) -->
<!-- ======================================================================= -->`
```

- Cost is always `0 XP`
- Cadence is always `none` in the index, regardless of `usage_limit` in the datamap
- Race name uppercased: `ALTERI`, `KITSU` etc.
- Entries alphabetized by trait key

#### Trait comment header format

```html
<!-- Ancestry Trait: <Display Name> | key: racial_<race>_<trait_key> | cost: 0 XP | cadence: none | attrs: —, — | i18n: racial_<race>_<trait_key>-u | — | racial_<race>_<trait_key>_rules-u -->
```

Note: the `key:` field uses the **full prefixed key** (`racial_<race>_<trait_key>`) — unlike the talent comment header which uses the bare key. This matches the index block format.

#### Trait row format

```html
<!-- Ancestry Trait: <Display Name> | key: racial_<race>_<trait_key> | cost: 0 XP | cadence: none | attrs: —, — | i18n: racial_<race>_<trait_key>-u | — | racial_<race>_<trait_key>_rules-u -->
<div class="sheet-racial-trait-row sheet-<race>-<trait-key-hyphenated>">
    <div class="sheet-racial-trait-name" data-i18n="racial_<race>_<trait_key>-u"><Display Name></div>
    <div class="sheet-racial-trait-text" data-i18n="racial_<race>_<trait_key>_rules-u">rule text</div>
</div>
```

- Inner elements are `<div>` not `<span>`
- The static text content (`<Display Name>` and `rule text`) is a fallback placeholder — always use the display name as shown and the literal string `rule text` for the rules div
- No `_enabled`, `_lockflag`, `attr_show_`, or checkbox inputs — traits have none of these
- Class on the row div: `sheet-racial-trait-row sheet-<race>-<trait-key-hyphenated>` (hyphenated = underscores → hyphens)

---

### Trait JSON keys

| Key | Format |
|---|---|
| Name | `racial_<race>_<trait_key>-u` |
| Rules | `racial_<race>_<trait_key>_rules-u` |

Use `racial_` prefix — never `talent_`. Alphabetized by key string within the race's key block in `translation.json`.

---

### Trait tracker coupling

Every trait with `usage_limit: "scene"` or `"session"` requires both a tracker HTML row and a CSS selector. The pattern differs from talent trackers in three key ways:

1. **No `attr_show_` hidden input** — trait tracker rows have no show hook input preceding them
2. **CSS selector is race-keyed, not show-input-keyed** — visibility is driven by the active ancestry selection (`attr_showracials`), not a per-trait hidden input
3. **Index key prefix is `ancestry_`** — not `racial_` or `talent_`

#### Trait tracker HTML row

```html
<!-- Tracker Ancestry Trait: <Display Name> | key: <trait_key> | cost: 0 XP | cadence: <scene|session> | attrs: —, attr_used_<scene|session>_<race>_<trait_key> | i18n: racial_<race>_<trait_key>-u -->
<div class="sheet-tracker-item sheet-tracker-<scene|session> sheet-<race>-<trait-key-hyphenated>">
    <input type="checkbox" name="attr_used_<scene|session>_<race>_<trait_key>" class="sheet-tracker-checkbox"/>
    <span class="sheet-tracker-label" data-i18n="racial_<race>_<trait_key>-u"><Display Name></span>
</div>
```

- No `<input type="hidden" name="attr_show_..."/>` before the div — traits have no show hook
- The `attrs:` field in the comment header shows `—` for the first slot (no show attr)
- The `<span>` includes a static fallback display name (not `rule text`)
- Rows for a race are grouped under their own index block, alphabetical by trait key
- Placed in the scene or session tracker block according to `usage_limit`

#### Trait tracker index block format

```html
<!-- ================== TRACKER <RACE_UPPER> TRAITS: INDEX (<scene|session>) (key | cost) ================== -->
<!-- - ancestry_<race>_<key_a> (0 XP, <scene|session>) -->
<!-- - ancestry_<race>_<key_b> (0 XP, <scene|session>) -->
<!-- ============================================================================================================== -->
```

Note: index entries use `ancestry_` prefix, not `racial_`.

#### Trait CSS selector

Each race's scene traits share one rule block; session traits share another. The selector pattern is:

```css
/* Racial Trait Tracker - <Scene|Session> */
.ui-dialog .tab-content .charsheet .sheet-tab-content.sheet-tracker input[name="attr_showracials"][value="<race>"] ~ .sheet-tracker-section .sheet-<race>-<trait-key-hyphenated> {
	display: flex;
}
```

When a race has multiple traits in the same cadence, they share a single rule block with comma-separated selectors (one per line), matching the pattern used by other races in the file:

```css
.ui-dialog .tab-content .charsheet .sheet-tab-content.sheet-tracker input[name="attr_showracials"][value="<race>"] ~ .sheet-tracker-section .sheet-<race>-<trait-a-hyphenated>,
.ui-dialog .tab-content .charsheet .sheet-tab-content.sheet-tracker input[name="attr_showracials"][value="<race>"] ~ .sheet-tracker-section .sheet-<race>-<trait-b-hyphenated> {
	display: flex;
}
```

---

### Trait-specific hard rules

- **Tracker coupling is required** for `usage_limit: "scene"` or `"session"` traits — HTML tracker rows and CSS selectors must be added/removed together.
- **No `attr_show_` hidden input** for traits — unlike talent trackers, there is no show hook input before the tracker div.
- **CSS selector uses `attr_showracials` pattern** — not the `attr_show_<race>_<key>` pattern used by talent trackers.
- **Index key prefix is `ancestry_`** in trait tracker index blocks.
- **`affected_skill` is omitted** when empty (not written as `[]`) — unlike talents where `[]` is always required.
- **`source.section` is `"traits-u"`** for `ancestryDataMap` source lines, not `"ancestry-u"`.
- **Trait HTML comment header uses the full prefixed key** (`racial_<race>_<trait_key>`), not the bare key.
- **Trait HTML index cadence is always `none`** regardless of actual `usage_limit` — cadence only appears correctly in the tracker index blocks.
- **Indentation discipline applies identically** to traits: ADD blocks produced by editing the REMOVE excerpt only, never constructed from a template.
