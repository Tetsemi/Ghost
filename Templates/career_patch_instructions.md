# Career Patch Instructions — Ghost of Arcadia
### Generic Career Updater — Operational Reference

---

## 0) Patch Parameters (edit ONLY this block per request)

**Files (always the same):**
- `ghost_of_arcadia.html`
- `ghost_of_arcadia.css`
- `translation.json`

**Target Career + Scope:**
- `CAREER_KEY`: *(e.g. `careerDataMap.marksman`)*
- `TARGET_TIER`: *(integer: 1, 2, 3, 4, or 5)*
- `IN_SCOPE_SECTIONS` *(only these; nothing else)*:
  - `primary_skills` *(include only if requested)*
  - `secondary_skills` *(include only if requested)*
  - `talents` *(required when tier work is requested)*

**Source Version (for career object — comes from the document, not today's date):**
- `SOURCE_VERSION`: *(e.g. `2.260208`)*
- `SOURCE_DATE`: *(e.g. `2026-02-08`)*
- `SOURCE_DOC`: *(e.g. `marksman-u` — career name until full doc is published)*
- `SOURCE_SECTION`: `career-u`

**Skills Inputs (leave blank if not in scope):**
- `PRIMARY_SKILLS_INPUT`: *(paste the primary skills line here)*
- `SECONDARY_SKILLS_INPUT`: *(paste the secondary skills line here)*
  - Any `(choose one)` entry must be represented via `exclusive_skill_sets` — see §4.

**Talent Inputs (tab-delimited: Name | Rules Text | Prerequisite Name):**
- `TIER_TALENTS_INPUT`:
```
<paste talent table here>
```

**Schema Reference:**
- `SCHEMA_REFERENCE_CAREER`: *(another career key — for field names/types only, never content)*

---

## 1) Operational Workflow

### Phase 1 — Read Before Writing

Extract verbatim from the three files:

**From `ghost_of_arcadia.html`:**
- `careerDataMap.<CAREER_KEY>` — full object; note talents at TARGET_TIER and the bottom-level `source` field
- Tier HTML block: `<div data-tier="N">` for the career
- Tracker HTML rows for all career talents at TARGET_TIER
- `skillDataMap` — for skill key validation

**From `ghost_of_arcadia.css`:**
- CSS show selectors for each in-scope talent

**From `translation.json`:**
- All `career_<career>_<talent>-u` and `career_<career>_<talent>_rules-u` keys for in-scope talents

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
| Special immediate | `"special_immediate"` |
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
- Example: a talent that says "make a Perception roll opposed by the attacker's Stealth" → `affected_skill: ["perception", "stealth"]`
- Validate all keys against `skillDataMap`. List any unresolved references in Provenance & Checks.
- If editing an existing talent and `affected_skill` is incomplete, correct it in the same patch.

**Prerequisite derivation** (column 3):
- Apply same key derivation rule as talent keys.
- Validate the resulting key exists in the file at tier TARGET_TIER − 1.
- Exception: `""` (empty string) represents "Any 1 Tier N−1 talent" — a soft requirement enforced by the sheet worker, not a specific key reference.
- If a prerequisite key is missing from tier N−1 in the file, flag it and halt that talent's output. Do not write a broken reference.
- Tiers are processed in order (1 → 2 → 3 → 4 → 5). By the time tier N is patched, tiers 1 through N−1 are already correct in the file and can be trusted.

**Normalization — apply everywhere in changed content:**
- `Pistol` → `Handgun`, `pistol` → `handgun`
- `Archanotech` → `Arcanotech`, `archanotech` → `arcanotech`

---

### Phase 3 — Diff: Identify Actual Changes

For each surface, compare extract against input-derived target. If a surface already matches: **no output for it** (no identical REMOVE/ADD pairs).

| Surface | What to check |
|---|---|
| `careerDataMap` talent objects | All fields: name_key, rule_text_key, affected_skill, prerequisite, tier, cost, strain, capstone, usage_limit, type |
| `careerDataMap` talent fields — consistency | Any in-scope talent missing `strain: ""` gets it added |
| Career `source` field | Bump version and date if anything in scope changed |
| Tier HTML | Comment header index, talent row markup, prereq spans, alphabetical order by key |
| Tracker HTML | show input + scene/session div for each usage_limit: scene/session talent |
| CSS | Show selectors for each scene/session talent |
| JSON | Name string and rules string for each in-scope talent |

---

### Phase 4 — Tracker Coupling (Mandatory)

Every talent with `usage_limit: "scene"` or `"session"` requires all three of:

**Tracker HTML (in the scene or session tracker block, alphabetical by talent key):**
```html
<input type="hidden" name="attr_show_<career>_<talent_key>"/>
<div class="sheet-tracker-item sheet-tracker-<scene|session> sheet-<career>-<talent-hyphenated>">
    <input type="checkbox" name="attr_used_<scene|session>_<career>_<talent_key>" class="sheet-tracker-checkbox"/>
    <span class="sheet-tracker-label" data-i18n="career_<career>_<talent_key>-u"></span>
</div>
```

**CSS show selector:**
```css
.ui-dialog .tab-content .charsheet input[name="attr_show_<career>_<talent_key>"][value="1"] ~ .sheet-<career>-<talent-hyphenated> {
    display: flex;
}
```

Rules:
- Talent added → add all three if missing
- Talent removed → remove all three in same patch
- A tracker HTML ADD must always have a matching CSS ADD (and vice versa)
- `usage_limit: ""` or `at_will` or `permanent` → no tracker rows unless the existing pattern explicitly has them

---

### Phase 5 — Skills (when in scope)

**Key validation:** every referenced skill must exist in `skillDataMap`. List any unknown keys in Provenance & Checks; do not guess replacements.

**`(choose one)` handling:**
- All matching specialization keys appear individually in `primary_skills` or `secondary_skills` as normal entries.
- The group is encoded in `exclusive_skill_sets: [["key_a", "key_b", "key_c"]]` — the sheet worker locks out unchosen options once one is selected.
- Options within each exclusive set are alphabetized by skill key.
- If specialization keys cannot be enumerated from `skillDataMap`, stop and list the ambiguity.

**Alphabetization:** skill keys in `primary_skills` and `secondary_skills` alphabetized by key string.

---

### Phase 6 — Produce Patch Files

Three downloadable files, each containing only REMOVE/ADD blocks:

**HTML patch** — in this order:
1. `careerDataMap` object changes (talent objects + `source` field)
2. Tier HTML row changes
3. Tracker HTML row changes

**CSS patch** — show selector changes only

**JSON patch** — i18n key changes only, alphabetized by key string

**REMOVE block rules:**
- Must be copied byte-identical from the current file
- Includes comment headers, braces, exact indentation, trailing commas
- If byte-identical copy cannot be guaranteed: stop, do not produce patches

**ADD block rules:**
- Produced by editing the REMOVE excerpt only — never constructed from a template
- Unchanged lines within an ADD block are byte-identical to the REMOVE block
- Only changed contiguous blocks are included (minimality)

**No-op rule (§42):** if a surface has no changes, produce a clearly labelled no-op comment file rather than identical REMOVE/ADD blocks.

---

### Phase 7 — Provenance & Checks (chat output only)

Output exactly one code block in chat titled `Provenance & Checks`:

```
Files used: ghost_of_arcadia.html, ghost_of_arcadia.css, translation.json
Career + tier: <CAREER_KEY> | Tier <TARGET_TIER>
Counts: <N> talents updated/added, <N> i18n keys changed, <N> skills changed

Validations:
  [PASS|FAIL] REMOVE blocks extracted verbatim
  [PASS|FAIL] Talent key derivation
  [PASS|FAIL] Type/strain/usage_limit parsing
  [PASS|FAIL] Prerequisite keys exist at Tier N-1 in file
  [PASS|FAIL] Prerequisite tier = TARGET_TIER - 1
  [PASS|FAIL] affected_skill keys all in skillDataMap
  [PASS|FAIL] Tracker coupling (HTML + CSS paired)
  [PASS|FAIL] Tracker in correct list (scene vs session)
  [PASS|FAIL] Skill key validation (if in scope)
  [PASS|FAIL] Alphabetization (talent keys, skill keys, i18n keys)
  [PASS|FAIL] Normalization substitutions applied
  [PASS|FAIL] strain field present as string on all edited talents
  [PASS|FAIL] source field bumped (or NO-OP reason)

Patch manifest:
  careerDataMap:  [CHANGED lines N–N | NO-OP]
  source field:   [bumped to <version> | NO-OP — no content changed]
  Tier HTML:      [CHANGED | NO-OP]
  Tracker HTML:   [CHANGED | NO-OP]
  CSS selectors:  [CHANGED | NO-OP]
  JSON keys:      [CHANGED | NO-OP]

Flags:
  - type.tag "<value>" on <talent_key>: not found in talentTagMap — needs map update or text review
  - (any other flags)
```

---

## 2) Field Reference

### Required fields on every talent object

| Field | Type | Notes |
|---|---|---|
| `name_key` | string | `"career_<career>_<talent_key>-u"` |
| `rule_text_key` | string | `"career_<career>_<talent_key>_rules-u"` |
| `affected_skill` | array of strings | Skill keys; `[]` if none. Derived from rules text. |
| `prerequisite` | string | Talent key at tier N−1, or `""` for none / any |
| `tier` | integer | Must equal TARGET_TIER |
| `cost` | integer | XP cost (5 × tier) |
| `strain` | string | Always a string: `""`, `"1"`, `"1d4"`, etc. |
| `capstone` | boolean | `true` only for tier 5 capstone talents |
| `usage_limit` | string | `"scene"`, `"session"`, or `""` |
| `type` | object | `{ economy: "<string>", tag: "<string>" }` |

### Career object `source` field (bottom of career object, outside `talents`)

```javascript
source: { doc: "<career>-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "career-u" }
```
- `doc`: career name key until the full document is published
- `version` / `date`: from SOURCE_VERSION / SOURCE_DATE in Patch Parameters — the document's publication date, not today's date
- Bump whenever any content in the career object changes

### i18n key format

| Key | Format |
|---|---|
| Name | `career_<career>_<talent_key>-u` |
| Rules | `career_<career>_<talent_key>_rules-u` |

### Tracker attribute naming

| Attribute | Format |
|---|---|
| Show hook | `attr_show_<career>_<talent_key>` |
| Scene used | `attr_used_scene_<career>_<talent_key>` |
| Session used | `attr_used_session_<career>_<talent_key>` |

### CSS class naming

| Element | Format |
|---|---|
| Tracker div class | `sheet-<career>-<talent-key-hyphenated>` |
| Career block class | `sheet-career-<career>` |

*(Hyphenated = underscores replaced with hyphens in class names)*

---

## 3) Hard Rules (never violate)

1. **Only edit what is named in `IN_SCOPE_SECTIONS` for `CAREER_KEY` and `TARGET_TIER`.**
2. **REMOVE blocks must be byte-identical to the file.** If not possible, stop.
3. **No invented keys, fields, enums, or tag values.** If a required field has no established value, flag it.
4. **No new HTML/CSS structure.** Follow patterns found in the existing files for the targeted career and tier.
5. **Alphabetize everything by key:** talent keys in careerDataMap, skill keys in skill lists, i18n keys in JSON, tracker rows by talent key, CSS selectors by talent key.
6. **Tiers process in order 1 → 5.** Do not look ahead or correct higher-tier entries while patching a lower tier.
7. **Prerequisite chain:** every Tier N talent's prerequisite must be a Tier N−1 talent key (or `""`). Flag violations; do not silently write them.
8. **Tracker coupling is mandatory** for all scene/session talents. HTML and CSS additions/removals are always paired.
9. **`strain` is always a string**, even for plain integers.
10. **No inline code blocks in chat.** All file content goes in the downloadable patch files. Chat output is limited to the `Provenance & Checks` block.
