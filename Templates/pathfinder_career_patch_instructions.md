# Career Patch Instructions — Ghost of Arcadia
### Generic Career Updater — Operational Reference

---

## 0) Patch Parameters (edit ONLY this block per request)

**Files (always the same):**
- `ghost_of_arcadia.html`
- `ghost_of_arcadia.css`
- `translation.json`

**Target Career + Scope:**
- `CAREER_KEY`: 
	- `pathfinder` *(e.g. `marksman`)* — must match the key in `careerDataMap`
- `TARGET_TIER`:
	- `1` *(integer: 1, 2, 3, 4, or 5)*
- `IN_SCOPE_SECTIONS` *(only these; nothing else)*:
  - `primary_skills` *(include only if requested)*
  - `secondary_skills` *(include only if requested)*
  - `talents` *(required when tier work is requested)*

**Source Version (for career object — comes from the document, not today's date):**
- `SOURCE_VERSION`: 
	- `2.260306`*(e.g. `2.260208`)*
- `SOURCE_DATE`:
	- `2026-03-06` *(e.g. `2026-02-08`)*
- `SOURCE_DOC`:
	- `careers-u` *(e.g. `careers-u`)*
- `SOURCE_SECTION`:
	- `<CAREER_KEY>-u`

**Skills Inputs (leave blank if not in scope):**
- `PRIMARY_SKILLS_INPUT`:
	-`Track, Navigate, Survival (choose one specialization), Perception` *(paste the primary skills line here)*
- `SECONDARY_SKILLS_INPUT`:
	-`Natural World, Stealth, Athletics, Listen, First Aid, Veil Lore` *(paste the secondary skills line here)*
  - Any `(choose one)` entry must be represented via `exclusive_skill_sets` — see §5.

**Talent Inputs (tab-delimited: Name | Rules Text | Prerequisite Name):**
- `TIER_TALENTS_INPUT`:
```
Blood and Dust	Type: Passive (Tracking Enhancement) • Cost: — • Usage: At-will — When you succeed on a Track roll, you automatically extract additional detail based on your success tier. Regular Success: number of targets, direction of travel, and approximate time since passage. Hard Success: physical condition of the quarry (wounded, burdened, exhausted) and pace of movement. Extreme or Critical Success: behavioral state of the quarry (fleeing, hunting, disoriented) and whether they are aware they are being followed. This information is provided in addition to any other successful Track results and does not require an additional roll.
Dead Ground	Type: Passive (Terrain Movement) • Cost: — • Usage: At-will — Moving through natural difficult terrain — undergrowth, unstable rubble, steep slopes, deep water, ley-burned ground — costs you one fewer Maneuver than normal, to a minimum of one. This talent does not apply to terrain made difficult by spells, constructed barriers, or technology.
Hollow Watch	Type: Free Action (Observation) • Cost: — • Usage: 1/Scene — Declare before making a Perception or Listen roll. You have not voluntarily moved this round. Gain +1 bonus die on that roll.
Read the Wind	Type: Reaction (Field Awareness) • Cost: — • Usage: At-will — When you would be Surprised by a creature or person, you may immediately make a Perception roll before the Surprised condition is applied. On any success, the Surprised condition is negated. This talent applies in natural terrain, ruins, collapsed districts, fringe zones, and other environments where concealment is shaped primarily by terrain rather than active urban surveillance or formal interior security. This talent does not apply to supernatural sources of surprise — spirits, Veil entities, and arcane concealment effects may still Surprise you normally.
Strain Buffer	Type: Passive • Cost: — • Usage: Permanent — Increase your maximum Strain by +1. (This talent may appear in multiple Career Trees.)
```

**Schema Reference:**
- `SCHEMA_REFERENCE_CAREER`:
 - `codeweaver` *(another career key with complete schema — for field names/types only, never content. Prefer `faceman`, `investigator`, or `combat_engineer` as they have full field coverage.)*

- `OPERATION`: `add`
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
- `careerDataMap.<CAREER_KEY>` — full object; note talents at TARGET_TIER and the bottom-level `source` field
- Tier HTML block: `<div data-tier="N">` for the career
- Skill block HTML: `<div class="sheet-career-skill-block">` for the career (when `primary_skills` or `secondary_skills` is in scope)																																	 
- Tracker HTML rows for all career talents at TARGET_TIER with `usage_limit: "scene"` or `"session"`
- `skillDataMap` — for skill key validation

**From `ghost_of_arcadia.css`:**
- CSS show selectors for each in-scope talent at TARGET_TIER

**From `translation.json`:**
- All `career_<career>_<talent>-u` and `career_<career>_<talent>_rules-u` keys for in-scope talents

> **Gate:** If any block cannot be extracted verbatim, stop and report. Do not produce patches.

> **Exception — new career population:** If `CAREER_KEY` is a known stub (see §5), an empty or absent tier block and empty `talents: {}` are expected. Proceed with construction rather than extraction for those surfaces. The gate applies only to the career-level object itself (schema, `entry_requirements`, `source`) which must still be extracted verbatim.

> **Career type note:** The three career types are `"core"`, `"arcane"`, and `"specialist"`. Specialist careers use `career_cost` instead of `base_skill_points`/`skill_points_primary_formula`, and `skill_points_primary_display: "—"`. See §4 for full specialist schema differences.

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
- Example: a talent that says "make a Perception roll opposed by the attacker's Stealth" → `affected_skill: ["perception", "stealth"]`
- If no skills appear mechanically: use `[]` (empty array). Do not omit the field.
- Validate all keys against `skillDataMap`. List any unresolved references in Provenance & Checks.
- If editing an existing talent and `affected_skill` is incomplete, correct it in the same patch.

**Prerequisite derivation** (column 3):
- Apply same key derivation rule as talent keys.
- Validate the resulting key exists in the file at tier TARGET_TIER − 1.
- Exception: `""` (empty string) represents "Any 1 Tier N−1 talent" — a soft requirement enforced by the sheet worker, not a specific key reference. Tier 1 talents always have `""`.
- Some talents use an array `["key_a", "key_b"]` to indicate either prerequisite satisfies the requirement — preserve this when editing, derive it from multi-prerequisite talent descriptions.
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
| `careerDataMap` talent objects | All fields in canonical order — see §2 |
| `careerDataMap` talent fields — consistency | Any in-scope talent missing `strain: ""` gets it added; any missing `affected_skill: []` gets it added |
| Career `source` field | Bump version and date if anything in scope changed |
| Skill block HTML | One `sheet-career-skill-wrapper` per skill key in each column, alphabetical by key (when `primary_skills` or `secondary_skills` in scope) — see §6 |																																											
| Tier HTML | Comment header index, talent row markup, prereq spans, alphabetical order by key |
| Tracker HTML | show input + scene/session div for each usage_limit: scene/session talent |
| CSS | Show selectors for each scene/session talent |
| JSON | Name string and rules string for each in-scope talent |

> **New career population:** If the tier has no existing talent entries (stub career), skip the diff — treat all input talents as ADD-only. There are no REMOVE blocks for talent objects, tier HTML rows, tracker rows, CSS selectors, or JSON keys. For the skill block, the stub REMOVE is the empty header-only block; the ADD replaces it with fully populated wrapper rows.

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
- The tracker index comment block is a required REMOVE/ADD surface whenever any scene or session talent is added or removed — same treatment as the tier HTML index block.
- The tracker section always replaces the entire career block as one REMOVE/ADD to maintain global alphabetical order. 

**Prerequisite text color CSS** is a separate, one-time surface also required for new career population — see §6 Prereq text color CSS subsection.																																					 

---

### Phase 5 — Skills (when in scope)

**Key validation:** every referenced skill must exist in `skillDataMap`. List any unknown keys in Provenance & Checks; do not guess replacements.

**`(choose one)` handling:**
- All matching specialization keys appear individually in `primary_skills` or `secondary_skills` as normal entries.
- The group is encoded in `exclusive_skill_sets: [["key_a", "key_b", "key_c"]]` — the sheet worker locks out unchosen options once one is selected.
- Options within each exclusive set are alphabetized by skill key.
- If specialization keys cannot be enumerated from `skillDataMap`, stop and list the ambiguity.
- If no choose-one groups exist: `exclusive_skill_sets: []`.

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
- Includes comment headers, braces, exact indentation, trailing commas
- Only changed contiguous blocks are included (minimality)

**No-op rule:** if a surface has no changes, produce a clearly labelled no-op comment rather than identical REMOVE/ADD blocks.

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
  [PASS|FAIL] affected_skill field present on all edited talents ([] if none)
  [PASS|FAIL] strain field present as string on all edited talents
  [PASS|FAIL] Tracker coupling (HTML + CSS paired)
  [PASS|FAIL] Tracker in correct list (scene vs session)
  [PASS|FAIL] Skill key validation (if in scope)
  [PASS|FAIL] Alphabetization (talent keys, skill keys, i18n keys)
  [PASS|FAIL] Normalization substitutions applied
  [PASS|FAIL] source field bumped (or NO-OP reason)
  [PASS|FAIL] Canonical talent field order applied

Patch manifest:
  careerDataMap:  [CHANGED lines N–N | NO-OP]
  source field:   [bumped to <version> | NO-OP — no content changed]
  Skill HTML:     [CHANGED | NO-OP — skills not in scope]														   
  Tier HTML:      [CHANGED | NO-OP]
  Tracker HTML:   [CHANGED | NO-OP]
  CSS selectors:  [CHANGED | NO-OP]
  Prereq CSS:     [CHANGED — added <career> to <arcane|core|specialist> block | NO-OP — already present | NO-OP — not first population]																																			 
  JSON keys:      [CHANGED | NO-OP]

Flags:
  - type.tag "<value>" on <talent_key>: not found in talentTagMap — needs map update or text review
  - (any other flags)
```

---

## 2) Field Reference

### Canonical talent field order

All career talent objects must use this field order exactly. The cleanup pass has standardized all existing careers to this order — new and edited talents must match it:

```javascript
talent_key: {
    tier: N,
    cost: N,
    capstone: false,
    name_key: "career_<career>_<talent_key>-u",
    rule_text_key: "career_<career>_<talent_key>_rules-u",
    type: { economy: "<string>", tag: "<string>" },
    strain: "",
    usage_limit: "",
    affected_skill: [],
    affected_skill_group: "...",   // omit if not used
    affected_stat: "...",          // omit if not used
    prerequisite: "",
    prerequisiteAny: { ... }       // omit if not used
}
```

**Optional fields** (`affected_skill_group`, `affected_stat`, `prerequisiteAny`) are omitted entirely when not applicable — do not write them as empty values.

### Required fields on every talent object

| Field | Type | Notes |
|---|---|---|
| `tier` | integer | Must equal TARGET_TIER |
| `cost` | integer | XP cost (5 × tier) |
| `capstone` | boolean | `true` only for tier 5 capstone talents |
| `name_key` | string | `"career_<career>_<talent_key>-u"` |
| `rule_text_key` | string | `"career_<career>_<talent_key>_rules-u"` |
| `type` | object | `{ economy: "<string>", tag: "<string>" }`. Always present. |
| `strain` | string | Always a string: `""`, `"1"`, `"1d4"`, etc. Always present. |
| `usage_limit` | string | `"scene"`, `"session"`, or `""` |
| `affected_skill` | array of strings | Skill keys; `[]` if none. Always present. |
| `prerequisite` | string or array | Talent key at tier N−1, `""` for none/any, or `["key_a", "key_b"]` for either-or |

### Indentation

All `careerDataMap` content uses **tabs** throughout. Canonical indent levels:
- Career key: `\t` (1 tab)
- Career fields: `\t\t` (2 tabs)
- Talent key: `\t\t\t` (3 tabs)
- Talent fields: `\t\t\t\t` (4 tabs)

### Career object `source` field

Located at the **bottom of the career object, outside `talents`**. One source per career, not per talent (unlike ancestry):

```javascript
source: { doc: "<SOURCE_DOC>-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "<SOURCE_SECTION>-u" }
```
- `doc`: always `"<SOURCE_DOC>-u"`
- `section`: always `"<SOURCE_SECTION>-u"`
- `version` / `date`: from SOURCE_VERSION / SOURCE_DATE — the document's publication date, not today's date
- Bump whenever any content in the career object changes

### i18n key format

| Key | Format |
|---|---|
| Name | `career_<career>_<talent_key>-u` |
| Rules | `career_<career>_<talent_key>_rules-u` |

*(Note: career uses `career_` prefix; ancestry uses `talent_` prefix — never mix)*

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

## 3) Career Schema by Type

### Core careers

```javascript
career_key: {
    name: "Display Name",
    career_type: "core",
    career_type_name: "Core",
    base_skill_points: 180,
    skill_points_primary_formula: {
        attributes: ["EDU"],
        multipliers: [2]
    },
    skill_points_primary_display: "base_skill_points + EDU x 2",
    skill_points_secondary: 20,
    spell_xp_primary: 0,
    spell_xp_secondary: 0,
    primary_skills: { ... },
    secondary_skills: { ... },
    exclusive_skill_sets: [],         // or [["key_a","key_b"]] for choose-one groups
    entry_requirements: {},           // empty = no prerequisites; see arcane/specialist for populated examples
    talents: { ... },
    source: { doc: "careers-u", version: "2.YYMMDD", date: "YYYY-MM-DD", section: "careers-u" }
}
```

### Arcane careers

Same as core except:
- `career_type: "arcane"`, `career_type_name: "Arcane"`
- `spell_xp_primary: 30` (typically)
- `entry_requirements: { all: [{ type: "awakened" }] }` (Awakened required)

### Specialist careers

```javascript
career_key: {
    name: "Display Name",
    career_type: "specialist",
    career_type_name: "Specialist",
    career_cost: 0,                   // replaces base_skill_points + formula
    skill_points_primary_display: "—",
    skill_points_secondary: 0,
    spell_xp_primary: 0,
    spell_xp_secondary: 0,
    primary_skills: {},
    secondary_skills: {},
    entry_requirements: { all: [ ... ] },   // always has requirements
    talents: { ... },
    source: { ... }
}
```

Note: specialist careers have **no** `base_skill_points`, `skill_points_primary_formula`, or `exclusive_skill_sets` fields.

---

## 4) Hard Rules (never violate)

1. **Only edit what is named in `IN_SCOPE_SECTIONS` for `CAREER_KEY` and `TARGET_TIER`.**
2. **REMOVE blocks must be byte-identical to the file.** If not possible, stop.
3. **No invented keys, fields, enums, or tag values.** If a required field has no established value, flag it.
4. **No new HTML/CSS structure.** Follow patterns found in the existing files for the targeted career and tier.
5. **Alphabetize everything by key:** talent keys in careerDataMap, skill keys in skill lists, i18n keys in JSON, tracker rows by talent key, CSS selectors by talent key.
6. **Tiers process in order 1 → 5.** Do not look ahead or correct higher-tier entries while patching a lower tier.
7. **Prerequisite chain:** every Tier N talent's prerequisite must be a Tier N−1 talent key (or `""`). Flag violations; do not silently write them.
8. **Tracker coupling is mandatory** for all scene/session talents. HTML and CSS additions/removals are always paired.
9. **`strain` is always a string**, even for plain integers. Always present.
10. **`affected_skill` is always an array**, even when empty (`[]`). Always present.
11. **Canonical field order is mandatory** on all new and edited talent objects. See §2.
12. **Indentation is tabs only.** Never mix spaces into `careerDataMap` content.
13. **`source` is per-career**, not per-talent. One source object at the bottom of the career, outside `talents`. Bump on any content change.
14. **`entry_requirements: {}` means no prerequisites.** The sheet worker treats an empty object as "no requirements" — do not add an `all: []` or any structure to a career that has none.
15. **No inline code blocks in chat.** All file content goes in the downloadable patch files. Chat output is limited to the `Provenance & Checks` block.

---

## 5) Known Stubs (careers awaiting content)

The following careers exist in `careerDataMap` with empty `talents: {}` and placeholder `source` fields. Do not add talent content to them until explicitly tasked:

| Key | Type |
|---|---|
| `brawler` | core |
| `breacher` | core |
| `pathfinder` | core |
| `tactician` | core |
| `dreamshaper` | arcane |
| `gravesinger` | arcane |
| `soulmender` | arcane |

These stubs have `entry_requirements: {}` (core) or `entry_requirements: { all: [{ type: "awakened" }] }` (arcane) already set correctly.

**Populating a stub:** When a stub career is being fully populated for the first time, `IN_SCOPE_SECTIONS` will typically include `primary_skills`, `secondary_skills`, and `talents`. All five tiers are processed in order (1 → 5) across one or more sessions. Remove the career from this table once Tier 1 content has been committed to the file.

---

## 6) HTML Structure Reference

### Tier container

```html
<div class="sheet-career-talent-tier sheet-career-tier-collapsible" data-tier="N">
    <!-- <Career Name> career content goes here -->
    <input type="checkbox" class="sheet-top-collapse sheet-career-tier-toggle" id="career_<career>_tierN_collapse" name="attr_career_<career>_tierN_collapse" value="1"/>
    <h4 class="sheet-section-head sheet-career-tier-head">
        <span data-i18n="tierN_careers-u">Tier N Talents (NN XP)</span>
        <label class="sheet-top-collapse-hit" for="career_<career>_tierN_collapse" title="Toggle section"></label>
    </h4>

    <div class="sheet-section-body">
        <div class="sheet-career-block sheet-career-<career>">
            <!-- index block -->

            <!-- Tier 1: talent rows directly here — no prereq toggle toolbar -->

            <!-- Tier 2–5 only: prereq toggle toolbar above talent rows -->
            <input type="checkbox" id="show_career_<career>_prereqs_tN" class="sheet-career-prereq-toggle" name="attr_show_career_<career>_prereqs_tN" value="1"/>
            <div class="sheet-career-talent-toolbar">
                <label class="sheet-career-prereq-toggle-label" for="show_career_<career>_prereqs_tN">
                    <span data-i18n="show_career_prereqs-u">Show prerequisites</span>
                </label>
            </div>
            <div class="sheet-career-talents">
                <!-- talent rows (Tiers 2–5) -->
            </div>
        </div>
    </div>
</div>
```

**Tier header i18n keys:** `tier1_careers-u` through `tier5_careers-u`

**First-time tier insertion:** When adding a tier block to a career that has no tier HTML yet, insert it as a new `<div class="sheet-career-talent-tier ...">` container, ordered tier 1–5 top to bottom within the career's section.

### Index block format

```html
<!-- ================== CAREER <CAREER_KEY_UPPER> TALENTS: INDEX (Tier N) (key | cost, cadence) ================== -->
<!-- - career_<career>_<key_a> (N XP, <scene|session|none>) -->
<!-- - career_<career>_<key_b> (N XP, none) -->
<!-- ============================================================================================================== -->
```

- Career name is uppercased and uses underscores: `COMBAT_ENGINEER`, `STREET_RONIN`, etc.
- Entries alphabetized by talent key
- Cadence is `scene`, `session`, or `none`

### Talent comment header format

```html
<!-- Career Talent: <Display Name> | key: career_<career>_<talent_key> | cost: N XP | cadence: <scene|session|none> | attrs: attr_<career>_<talent_key>, attr_<career>_<talent_key>_lockflag | i18n: career_<career>_<talent_key>-u | — | career_<career>_<talent_key>_rules-u -->
```

### Talent row — Tier 1

Tier 1 rows have **no** `_enabled` hidden input, **no** `sheet-career-prereq-toggle` toolbar, **no** `sheet-career-talents` sub-div, and **no** prerequisite span. Talent rows sit directly inside the `sheet-career-block`:

```html
<!-- Career Talent: <Display Name> | key: career_<career>_<talent_key> | cost: 5 XP | cadence: <scene|session|none> | attrs: attr_<career>_<talent_key>, attr_<career>_<talent_key>_lockflag | i18n: career_<career>_<talent_key>-u | — | career_<career>_<talent_key>_rules-u -->
<div class="sheet-career-talent-row">
    <input type="hidden" name="attr_<career>_<talent_key>_lockflag" value="0"/>
    <input type="checkbox" name="attr_<career>_<talent_key>" value="1" class="sheet-career-talent-checkbox"/>
    <label class="sheet-career-talent-label"><span data-i18n="career_<career>_<talent_key>-u"></span></label>
    <span class="sheet-career-talent-description" data-i18n="career_<career>_<talent_key>_rules-u"></span>
</div>
```

### Talent row — Tiers 2–4 (non-capstone)

Tiers 2–4 add an `_enabled` hidden input and a prerequisite span:

```html
<!-- Career Talent: <Display Name> | key: career_<career>_<talent_key> | cost: N XP | cadence: <scene|session|none> | attrs: attr_<career>_<talent_key>, attr_<career>_<talent_key>_lockflag | i18n: career_<career>_<talent_key>-u | — | career_<career>_<talent_key>_rules-u -->
<div class="sheet-career-talent-row">
    <input type="hidden" name="attr_<career>_<talent_key>_enabled" value="0"/>
    <input type="hidden" name="attr_<career>_<talent_key>_lockflag" value="0"/>
    <input type="checkbox" name="attr_<career>_<talent_key>" value="1" class="sheet-career-talent-checkbox"/>
    <label class="sheet-career-talent-label"><span data-i18n="career_<career>_<talent_key>-u"></span></label>
    <span class="sheet-career-talent-description" data-i18n="career_<career>_<talent_key>_rules-u"></span>
    <span class="sheet-career-talent-prereq" data-i18n="career_<career>_<prerequisite_key>-u"></span>
</div>
```

### Talent row — Tier 5 (capstone)

Same as tiers 2–4 but the checkbox adds `sheet-capstone-checkbox` to its class:

```html
<input type="checkbox" name="attr_<career>_<talent_key>" value="1" class="sheet-career-talent-checkbox sheet-capstone-checkbox"/>
```

### Attribute naming in HTML

Note that HTML attribute names use `attr_<career>_<talent_key>` — **without** the `career_` prefix that appears in i18n keys and the `careerDataMap`. For example:

| Context | Format |
|---|---|
| HTML `attr_` name | `attr_combat_engineer_breachfinders_eye` |
| i18n key | `career_combat_engineer_breachfinders_eye-u` |
| `careerDataMap` talent key | `breachfinders_eye` (inside `combat_engineer.talents`) |

---

### Skill block

The skill block lives inside `sheet-career-interactive-block`, above the Trained Skills Summary Strip and all tier containers. It has a left column (primary) and a right column (secondary). Each skill in both columns is rendered as a `sheet-career-skill-wrapper` row.

**Attribute naming:**

| Element | Format |
|---|---|
| Lock hidden input | `attr_cs_<career>_<skill_key>_mdr_checkbox_lock` |
| Checkbox | `attr_cs_<career>_<skill_key>_mdr_checkbox` |

**Single skill row:**
```html
<div class="sheet-career-skill-wrapper">
    <input type="hidden" name="attr_cs_<career>_<skill_key>_mdr_checkbox_lock" value="0"/>
    <input type="checkbox" name="attr_cs_<career>_<skill_key>_mdr_checkbox" value="1"/>
    <label><span data-i18n="<skill_key>-u"></span></label>
</div>
```

**Full block structure:**
```html
<div class="sheet-career-skill-block">
    <div class="sheet-career-skill-columns">
        <!-- Left Column: Primary -->
        <div class="sheet-career-skill-col">
            <h3 class="sheet-career-skill-header"><span data-i18n="career_primary_skills-u">Primary Skills</span></h3>
            <!-- one sheet-career-skill-wrapper per primary skill, alphabetical by key -->
        </div>

        <!-- Right Column: Secondary -->
        <div class="sheet-career-skill-col">
            <h3 class="sheet-career-skill-header"><span data-i18n="career_secondary_skills-u">Secondary Skills</span></h3>
            <!-- one sheet-career-skill-wrapper per secondary skill, alphabetical by key -->
        </div>
    </div>
</div>
```

**Rules:**
- Skill wrapper rows are alphabetized by key string within each column — same order as in `careerDataMap`
- All skills in `exclusive_skill_sets` groups render as normal individual rows — no special HTML markup; the sheet worker handles locking at runtime
- Skill HTML is in scope whenever `primary_skills` or `secondary_skills` is in `IN_SCOPE_SECTIONS`
- The skill block is a required Phase 3 diff surface whenever skills are in scope
- For stub population, the REMOVE block is the empty stub (header elements only, no wrapper rows); the ADD replaces it with the fully populated block

**Stub REMOVE pattern** (when populating a stub career for the first time):
```html
<div class="sheet-career-skill-block">
    <div class="sheet-career-skill-columns">
        <!-- Left Column: Primary -->
        <div class="sheet-career-skill-col">
            <h3 class="sheet-career-skill-header"><span data-i18n="career_primary_skills-u">Primary Skills</span></h3>
        </div>
        <!-- Right Column: Secondary -->
        <div class="sheet-career-skill-col">
            <h3 class="sheet-career-skill-header"><span data-i18n="career_secondary_skills-u">Secondary Skills</span></h3>
        </div>
    </div>
</div>
```   

---

### Prereq text color CSS

The prerequisite text visibility is controlled by a **shared multi-career selector block** in `ghost_of_arcadia.css`. When the "Show prerequisites" toggle is checked for any tier, `.sheet-career-talent-prereq` spans in that tier become visible.

**Selector pattern per career (t2–t5):**
```css
.ui-dialog .tab-content .charsheet .sheet-career-block.sheet-career-<career> input[name="attr_show_career_<career>_prereqs_t2"]:checked ~ .sheet-career-talents .sheet-career-talent-prereq,
.ui-dialog .tab-content .charsheet .sheet-career-block.sheet-career-<career> input[name="attr_show_career_<career>_prereqs_t3"]:checked ~ .sheet-career-talents .sheet-career-talent-prereq,
.ui-dialog .tab-content .charsheet .sheet-career-block.sheet-career-<career> input[name="attr_show_career_<career>_prereqs_t4"]:checked ~ .sheet-career-talents .sheet-career-talent-prereq,
.ui-dialog .tab-content .charsheet .sheet-career-block.sheet-career-<career> input[name="attr_show_career_<career>_prereqs_t5"]:checked ~ .sheet-career-talents .sheet-career-talent-prereq {
  display: block;
  color: white;
  width: 120px;
}
```

**Three shared blocks exist** — one per career type. New careers append to the correct block:

| Block | Career types | Tiers covered | Declaration |
|---|---|---|---|
| Block 1 | arcane | t2–t5 | `display: block; color: white; width: 120px;` |
| Block 2 | core | t2–t5 | `display: block; color: white; width: 120px;` |
| Block 3 | specialist | t2–t4 only (no t5) | `display: block; color: white; width: 120px;` |

**Important:** This is a shared declaration block — all careers within a block share one `{ ... }`. A new career's four selectors are inserted into the existing block (before the closing `{`), not written as a standalone block.

**Scope rule:** Prereq CSS is in scope only when `talents` is in scope **and** the career is being populated for the first time (i.e., it was a known stub with no prior tier HTML). It is a **one-time addition per career** — once a career's selectors are present in the block, no further changes are needed for higher tiers.

**Procedure:**
1. Check whether the career already appears in the correct block. If present: **no-op**.
2. If absent: REMOVE the entire block (all selectors + declaration), ADD it back with the new career's four selectors inserted in alphabetical order by career key.
3. Maintain alphabetical order within the block by career key string.
4. Note: some stubs were pre-populated into the block when the file was first authored. Always verify before writing.

> **CSS sweep note:** These three blocks are candidates for consolidation into a single shared rule during the planned CSS sweep. Until then, treat them as three separate surfaces and append only to the correct one.