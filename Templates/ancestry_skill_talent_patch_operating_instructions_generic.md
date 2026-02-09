### Operating Instructions (Unambiguous) — Ancestry Patch Template (Generic)

## 0) Patch Parameters (edit ONLY this block per request)
**Files (always the same):**
- `ghost_of_arcadia.html`
- `ghost_of_arcadia.css`
- `translation.json`

**Target Ancestry + Scope:**
- `TALENT_KEY`: `ancestryTalentDataMap.khadra`
- `TARGET_TIER`: `2`  *(integer; e.g., 1, 4, 5)*
- `TIER_FILTER`: `talents.<talent>.tier === TARGET_TIER` *(and include `capstone === true` only if the request says so)*
- `IN_SCOPE_SECTIONS` *(only these; nothing else)*:
  - `primary_skills` *(optional; include only if requested)*
  - `secondary_skills` *(optional; include only if requested)*
  - `talents` *(required when tier work is requested)*

**Skills Inputs (single source of truth for skills; leave blank if not in scope):**
- `PRIMARY_SKILLS_INPUT`: `<paste the primary skills line here>`
- `SECONDARY_SKILLS_INPUT`: `<paste the secondary skills line here>`
  - If any entry includes “(choose one)”, it MUST remain “choose one” and be represented as a choice group (see §4).

**Talent Inputs (single source of truth for tier content):**
- `TIER_TALENTS_INPUT`: `
Consult the Old Spirits Type: Action (Spiritual Consultation) • Cost: 1 Strain • Usage: 1/Scene — When you have a moment of calm, reverence, or preparation, roll Spirit Lore. On a success, choose one and mark it: Forewarning or Blessing . At any later point this scene, when circumstances align with that choice, you may expend the mark to either gain +1 bonus die on a single roll you make, or impose 1 penalty die on a single opposing roll directly related to that moment. This does not reveal hidden information or guarantee correctness. Stone-Set Focus
Endure to Completion Type: Reaction (Committed Effort) • Cost: 1 Strain • Usage: 1/Scene — When you fail a non-combat skill roll while attempting to complete a task, you may declare your commitment to see it through. If you do, you may immediately push the failed roll to complete the same task, gaining +1 bonus die on the pushed attempt. This pushed roll does not require the normal Strain cost for pushing, but all other push consequences apply normally. Burden Accepted
Oath Set Before the Storm Type: Free Action (Declared Oath) • Cost: — • Usage: 1/Scene — At the start of a scene, or during a clear pause before pressure or conflict begins, you may declare a specific course of action, duty, or boundary you intend to uphold. The first roll you make this scene that directly tests that oath gains +1 bonus die . If you voluntarily abandon or redefine the oath before that test occurs, the benefit is lost. No other penalty applies. Words Carved in Stone
Prepared, Not Rushed Type: Free Action (Deliberate Assessment) • Cost: — • Usage: 1/Scene — When you choose to delay action in order to observe, assess, or decide your approach rather than acting immediately, mark Prepared. The next skill roll or talent activation you make this scene that benefits from forethought, positioning, or deliberate choice gains +1 bonus die . This benefit is lost if the delay avoids engagement entirely or if circumstances change such that the preparation is no longer relevant. Stone-Set Focus
Work Without Turning Aside Type: Passive (Sustained Effort) • Cost: — • Usage: 1/Scene — When you make a second non-combat skill roll in the same scene to advance the same task or objective as a prior roll, without changing approach or abandoning the attempt, that second roll gains +1 bonus die . This benefit does not apply if the second roll uses a different method, addresses a different objective, or follows a deliberate change in plan. Deliberate Force
`

**Schema + Pattern References:**
- `SCHEMA_REFERENCE_TALENT`: `ancestryTalentDataMap.alteri` *(schema only; never copy content)*
- `HTML_CSS_PATTERN_REFERENCE`: `ghost_of_arcadia.html/.css` pattern for the same ancestry+tier (or nearest matching tier pattern if missing)

---

## 1) Allowed inputs and authority
1. I will **only** use the three uploaded files listed in Patch Parameters.
2. The pasted Inputs under Patch Parameters are authoritative; update the sheet to match them even if current files differ.

## 2) Scope and non-scope
3. Update **only** what is named in `IN_SCOPE_SECTIONS` for `TALENT_KEY` and `TARGET_TIER`.
4. Do **not** look ahead or modify other ancestrys, other tiers, or unrelated sections.

## 3) Reference/template rules
5. Use `SCHEMA_REFERENCE_TALENT` **only** for schema shape (field names/types), never as a content template.
6. For HTML/CSS structure and classes, copy the existing pattern found in the provided files for the targeted ancestry+tier, as declared in `HTML_CSS_PATTERN_REFERENCE`.
7. Follow existing sheet conventions strictly (do not invent new structure):
   - Roll20 selector scoping: `.ui-dialog .tab-content .charsheet ...`
   - Class prefixing with `sheet-`
   - Existing lock/enabled hidden fields where the pattern uses them
   - Existing tier layout conventions
8. **Do not invent new keys, enums, or fields**. If a required field doesn’t exist in the established schema/pattern, stop and report it in Provenance & Checks.

## 4) Skills representation requirements (when primary_skills / secondary_skills are in scope)
9. Skill identifiers must use **existing `skillDataMap` keys** from `ghost_of_arcadia.html` (never English labels).
10. **No plain text skill labels** are allowed in ancestry skill lists.
11. Skill display i18n must follow the sheet’s existing skill system; do not create a new skill-i18n scheme.
12. “(choose one)” is never a specific specialization:
   - If `SECONDARY_SKILLS_INPUT` contains `Survival (choose one)` (or any skill with “choose one”), represent it as a **choice group** containing **all matching specialization keys** in `skillDataMap`.
   - Do not guess or default to one specialization.
   - If only a generic base skill key exists (no specializations), the choice group contains only that key.
13. Choice group options must be alphabetized by skill key.
14. If choice-group options cannot be enumerated from `skillDataMap`, stop and list the missing/ambiguous requirement in Provenance & Checks (do not guess).

## 5) Talent key derivation and alphabetization
15. Talent key derivation (from displayed talent name):
   - lowercase
   - remove punctuation
   - spaces → underscores
16. **Alphabetization rules are by key (snake_case)**:
   - Talents: alphabetize by **talent key**
   - Skill lists: alphabetize by **skill key**
   - i18n keys: alphabetize by **i18n key string**
   - Tracker HTML rows and CSS selectors: alphabetize by **talent key**
17. Never infer ordering from the pasted Inputs; always apply the above sorting rules.

## 6) Required deliverables (files only)
18. Output **three separate downloadable files**:
   - **HTML patch/snippet** (only the in-scope sections) grouped in this order:
     1) `ancestryDataMap` object snippet for `TALENT_KEY` updates within scope
     2) Ancestry HTML rows for the requested tier/skills (only if the pattern includes those rows here)
     3) Tracker HTML rows (scene/session as required by usage_limit)
   - **CSS patch/snippet** (only the in-scope selectors) as one complete **ADD / REMOVE** block
   - **JSON patch/snippet** (only the in-scope i18n changes) as **ADD / REMOVE** blocks, alphabetized
19. Patches must be **ADD / REMOVE blocks only** (no +/- diffs; no loose fragments outside blocks).

## 7) Hard gate: REMOVE blocks must be verbatim
20. Any **REMOVE** block must be copied **verbatim** from the current file text:
   - includes comment headers, braces, exact spacing, and original indentation
21. If I cannot copy a REMOVE block verbatim, I must **STOP** and not produce patches.

## 8) Whitespace and formatting constraints
22. Use indentation and formatting exactly as in the files.
23. **No line may change leading whitespace unless that line’s content changes.**

## 9) Tracker coupling requirements
24. If a talent has `usage_limit` of **scene** or **session**, it must have:
   - Tracker HTML hooks:
     - `attr_show_<ancestry>_<talent>`
     - `attr_used_(scene|session)_<ancestry>_<talent>`
   - Matching Tracker CSS show selector(s) for the `attr_show_*` hook
25. Tracker coupling is mandatory:
   - Any tracker HTML ADD/REMOVE must have matching CSS selector ADD/REMOVE
   - A talent must appear in the correct tracker list (scene vs session), not the wrong one.
26. If `usage_limit` is `at_will` or `permanent`, do not create tracker rows unless the existing UI pattern explicitly does so.

## 10) Removal rules across all surfaces
27. If a talent is removed from the tier’s HTML/data, also remove (in the same patch):
   - its tracker HTML hooks
   - its tracker CSS show selectors
   - its i18n keys
28. “Removed” means removed from ALL required surfaces for this patch.

## 11) i18n rules (ancestry talents)
29. Ancestry-talent i18n changes must include name + rules/description.
30. Ancestry talent i18n key format must be exactly:
   - `talent_<ancestry>_<talent>-u`
   - `talent_<ancestry>_<talent>_rules-u`
31. No duplicate i18n keys may be created.
32. HTML `data-i18n` must reference keys that exist in the JSON snippet.

## 12) Ancestry data requirements (new source of truth)
33. Talent objects must use i18n keys (e.g., `name_key`, `rule_text_key`) rather than hydrated label attrs.
34. Each talent entry must include (as supported by the established schema/pattern):
   - `tier`
   - `cost`
   - `usage_limit`
   - `strain`
   - `prerequisite` expression
   - `type`
   - `source: { doc: "khadra-u", version: "2.260208", date: "2026-02-08", section: "ancestry-u" }`
   - any tracker/icon hooks required by the existing UI
35. Parse Inputs deterministically:
   - `Type:` → `type`
   - `Cost:` → `strain` (and/or cost field only as the schema supports)
   - `Usage:` → `usage_limit`
   - If any element doesn’t map cleanly to schema fields, stop and note it (do not invent a field).

## 13) Skill-key validation
36. Validate every referenced skill key against `skillDataMap` in `ghost_of_arcadia.html`.
37. If any key is missing/unknown: explicitly list it; do not guess replacements.

## 14) Mandatory correction substitutions
38. Apply these normalizations anywhere relevant to the edited section:
   - `Pistol` → `Handgun`
   - `pistol` → `handgun`
   - `Archanotech` → `Arcanotech`
   - `archanotech` → `arcanotech`

## 15) Chat output restrictions
39. Do not output inline HTML/CSS/JSON code blocks in chat.
40. In chat, include exactly one code block titled “Provenance & Checks” with:
   - Files used (the three filenames)
   - Ancestry + tier targeted (TALENT_KEY + TARGET_TIER)
   - Counts: talents updated/added, skills added/changed, i18n keys added/changed
   - Validations performed list
   - Patch Manifest lines for: ancestryDataMap, Tier rows, Tracker rows, CSS show-selectors, i18n keys, skill-key validation, JSON parse
41. If any gate fails, regenerate within the same response.
42. If there are no changes, produce a no-op (do not output identical ADD/REMOVE blocks).

