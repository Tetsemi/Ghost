# Ancestry Patch Instructions — Ghost of Arcadia
### Generic Ancestry Talent Updater — Operational Reference

---

## 0) Patch Parameters (edit ONLY this block per request)

**Files (always the same):**
- `ghost_of_arcadia.html`
- `ghost_of_arcadia.css`
- `translation.json`

**Target Ancestry + Scope:**
- `RACE_KEY`: *(e.g. `draevi`)* — must match the key in `ancestryTalentDataMap`
- `TARGET_TIER`: *(integer: 1, 2, 3, or 4)*
- `IN_SCOPE_SECTIONS` *(only these; nothing else)*:
  - `talents` *(required when tier work is requested)*

**Source Version:**
- `SOURCE_VERSION`: *(e.g. `2.260208`)*
- `SOURCE_DATE`: *(e.g. `2026-02-08`)*
- `SOURCE_DOC`: *(e.g. `draevi-u` — ancestry name key)*
- `SOURCE_SECTION`: `ancestry-u`

**Talent Inputs (tab-delimited: Name | Rules Text | Prerequisite Name):**
- `TIER_TALENTS_INPUT`:
```
<paste talent table here>
```

**Schema Reference:**
- `SCHEMA_REFERENCE_RACE`: *(another race key with complete schema — for field names/types only, never content. Prefer `khadra` or `feran` as they have the most complete field coverage.)*

---

## 1) Operational Workflow

### Phase 1 — Read Before Writing

Extract verbatim from the three files:

**From `ghost_of_arcadia.html`:**
- `ancestryTalentDataMap.<RACE_KEY>` — full object for the target race; note talents at TARGET_TIER and each talent's `source` field
- Tier HTML block: `<div class="sheet-talent-tier" data-tier="N">` for the race
- Tracker HTML rows for all talents at TARGET_TIER with `usage_limit: "scene"` or `"session"`
- `skillDataMap` — for skill key validation
- `ancestryDataMap.<RACE_KEY>` — to confirm the race exists and its key spelling

**From `ghost_of_arcadia.css`:**
- CSS show selectors for each in-scope talent at TARGET_TIER

**From `translation.json`:**
- All `talent_<race>_<talent_key>-u` and `talent_<race>_<talent_key>_rules-u` keys for in-scope talents

> **Gate:** If any block cannot be extracted verbatim, stop and report. Do not produce patches.

> **Key format note:** Race keys in `ancestryTalentDataMap` use `race: {` (no space before colon) for all races except `human`, which uses `human : {` (space before colon). Always match the existing spacing exactly in REMOVE blocks.

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

**`source` field on each talent:**
- Ancestry talents carry a `source` object on each individual talent (unlike career talents, which carry one source at the career object level).
- Format: `source: { doc: "<race>-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "ancestry-u" }`
- `version` and `date` come from SOURCE_VERSION / SOURCE_DATE — the document's publication date, not today's date.
- Bump `version` and `date` on every talent that is added or has content changed in this patch.
- Talents not touched in this patch retain their existing `source` values verbatim.

**Normalization — apply everywhere in changed content:**
- `Pistol` → `Handgun`, `pistol` → `handgun`
- `Archanotech` → `Arcanotech`, `archanotech` → `arcanotech`

---

### Phase 3 — Diff: Identify Actual Changes

For each surface, compare extract against input-derived target. If a surface already matches: **no output for it** (no identical REMOVE/ADD pairs).

| Surface | What to check |
|---|---|
| `ancestryTalentDataMap` talent objects | All fields: name_key, rule_text_key, affected_skill, prerequisite, tier, cost, strain, capstone, usage_limit, type, source |
| Field consistency | Any in-scope talent missing `strain: ""` gets it added; any missing `affected_skill: []` gets it added |
| Tier HTML | Comment header index, talent row markup, prereq spans, alphabetical order by key |
| Tracker HTML | show input + scene/session div for each usage_limit: scene/session talent |
| CSS | Show selectors for each scene/session talent |
| JSON | Name string and rules string for each in-scope talent |

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
- `usage_limit: ""` or at-will → no tracker rows unless the existing pattern explicitly has them
- Tracker rows for a race are gated in the HTML by the ancestry tracker section — verify the race's tracker block exists before adding rows

---

### Phase 5 — Produce Patch Files

Three downloadable files, each containing only REMOVE/ADD blocks:

**HTML patch** — in this order:
1. `ancestryTalentDataMap` object changes (talent objects with bumped source fields)
2. Tier HTML row changes
3. Tracker HTML row changes

**CSS patch** — show selector changes only

**JSON patch** — i18n key changes only, alphabetized by key string

**REMOVE block rules:**
- Must be copied byte-identical from the current file
- Includes comment headers, braces, exact indentation, trailing commas
- Match the existing indentation style for the race exactly (some races use spaces, some use tabs — never normalize)
- If byte-identical copy cannot be guaranteed: stop, do not produce patches

**ADD block rules:**
- Produced by editing the REMOVE excerpt only — never constructed from a template
- Unchanged lines within an ADD block are byte-identical to the REMOVE block
- Only changed contiguous blocks are included (minimality)

**No-op rule:** if a surface has no changes, produce a clearly labelled no-op comment rather than identical REMOVE/ADD blocks.

---

### Phase 6 — Provenance & Checks (chat output only)

Output exactly one code block in chat titled `Provenance & Checks`:

```
Files used: ghost_of_arcadia.html, ghost_of_arcadia.css, translation.json
Ancestry + tier: <RACE_KEY> | Tier <TARGET_TIER>
Counts: <N> talents updated/added, <N> i18n keys changed

Validations:
  [PASS|FAIL] REMOVE blocks extracted verbatim
  [PASS|FAIL] Talent key derivation
  [PASS|FAIL] Type/strain/usage_limit parsing
  [PASS|FAIL] Prerequisite keys exist at Tier N-1 in file
  [PASS|FAIL] Prerequisite tier = TARGET_TIER - 1
  [PASS|FAIL] affected_skill keys all in skillDataMap
  [PASS|FAIL] affected_skill field present on all edited talents ([] if none)
  [PASS|FAIL] strain field present as string on all edited talents
  [PASS|FAIL] type field present on all edited talents
  [PASS|FAIL] source field bumped on all edited talents
  [PASS|FAIL] Tracker coupling (HTML + CSS paired)
  [PASS|FAIL] Tracker in correct list (scene vs session)
  [PASS|FAIL] Indentation style preserved (no normalization)
  [PASS|FAIL] Alphabetization (talent keys in datamap, i18n keys in JSON, tracker rows by key)
  [PASS|FAIL] Normalization substitutions applied

Patch manifest:
  ancestryTalentDataMap: [CHANGED lines N–N | NO-OP]
  Tier HTML:             [CHANGED | NO-OP]
  Tracker HTML:          [CHANGED | NO-OP]
  CSS selectors:         [CHANGED | NO-OP]
  JSON keys:             [CHANGED | NO-OP]

Flags:
  - type.tag "<value>" on <talent_key>: not found in talentTagMap — needs map update or text review
  - (any other flags)
```

---

## 2) Field Reference

### Required fields on every talent object

| Field | Type | Notes |
|---|---|---|
| `name_key` | string | `"talent_<race>_<talent_key>-u"` |
| `rule_text_key` | string | `"talent_<race>_<talent_key>_rules-u"` |
| `affected_skill` | array of strings | Skill keys; `[]` if none. Always present. |
| `prerequisite` | string or array | Key at tier N−1, `""` for none/any, or `["key_a", "key_b"]` for multi-prereq |
| `tier` | integer | Must equal TARGET_TIER. Tier 1 = 10 XP, Tier 2 = 20 XP, Tier 3 = 30 XP, Tier 4 = 40 XP |
| `cost` | integer | Always `tier × 10` |
| `strain` | string | Always a string: `""`, `"1"`, `"1d4"`, etc. Always present. |
| `capstone` | boolean | `true` only for tier 4 capstones |
| `usage_limit` | string | `"scene"`, `"session"`, or `""` |
| `type` | object | `{ economy: "<string>", tag: "<string>" }`. Always present. |
| `source` | object | See source field format below. Always present. Per-talent (unlike career talents). |

### `source` field format (per-talent)

```javascript
source: { doc: "<race>-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "ancestry-u" }
```
- `doc`: race name key (e.g. `"draevi-u"`)
- `version` / `date`: from SOURCE_VERSION / SOURCE_DATE — the document's publication date
- `section`: always `"ancestry-u"`
- Lives inside each talent object, not at the race level

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
11. **`source` is per-talent**, not per-race. Bump only on talents that change. Do not touch source on unchanged talents.
12. **Preserve indentation style per race.** Some races use spaces, others use mixed tabs/spaces. Never normalize to a uniform style in a patch — match what is already there.
13. **No inline code blocks in chat.** All file content goes in the downloadable patch files. Chat output is limited to the `Provenance & Checks` block.

---

## 4) Known Schema Inconsistencies (do not propagate)

The following inconsistencies exist in the file due to races being authored at different times. Note them for awareness — do not fix them outside a dedicated cleanup patch, and never introduce them in new work:

| Race | Issue |
|---|---|
| `kitsu` | Missing `strain`, `type`, and `source` on most talents. Uses `skills:` instead of `affected_skill:` on some entries. Do not replicate. |
| `veyra` | Missing `strain`, `type`, and `source` on all talents. Do not replicate. |
| `alteri`, `draevi` | `strain` absent on most talents (predates the field being required). |
| `human` | Missing `affected_skill` on all talents. `human : {` has a space before the colon — preserve exactly in REMOVE blocks. |
| All races | `affected_skill` absent on some talents where it should be `[]`. Add it when touching those talents in a patch. |

When patching a race with these issues, add the missing fields to any talent you are already editing in scope. Do not do a wholesale backfill unless that is explicitly the stated purpose of the patch.
