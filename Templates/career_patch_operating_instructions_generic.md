### Operating Instructions (Unambiguous) — Career Patch Template (Generic)

## 0) Patch Parameters (edit ONLY this block per request)
**Files (always the same):**
- `ghost_of_arcadia.html`
- `ghost_of_arcadia.css`
- `translation.json`

**Target Career + Scope:**
- `CAREER_KEY`: `careerDataMap.street_ronin`
- `TARGET_TIER`: `5`  *(integer; e.g., 1, 4, 5)*
- `TIER_FILTER`: `talents.<talent>.tier === TARGET_TIER, capstone === true` *(and include `capstone === true` only if the request says so)*
- `IN_SCOPE_SECTIONS` *(only these; nothing else)*:
  - `primary_skills` *(optional; include only if requested)*
  - `secondary_skills` *(optional; include only if requested)*
  - `talents` *(required when tier work is requested)*

**Skills Inputs (single source of truth for skills; leave blank if not in scope):**
- `PRIMARY_SKILLS_INPUT`: `<paste the primary skills line here>`
- `SECONDARY_SKILLS_INPUT`: `<paste the secondary skills line here>`
  - If any entry includes “(choose one)”, it MUST remain “choose one” and be represented as a choice group (see §4).

**Talent Inputs (single source of truth for tier content):**
- `TIER_TALENTS_INPUT`: `<paste the tier talents table/text here verbatim>`

**Schema + Pattern References:**
- `SCHEMA_REFERENCE_CAREER`: `careerDataMap.combat_engineer` *(schema only; never copy content)*
- `HTML_CSS_PATTERN_REFERENCE`: `ghost_of_arcadia.html/.css` pattern for the same career+tier (or nearest matching tier pattern if missing)

---

## 1) Allowed inputs and authority
1. I will **only** use the three uploaded files listed in Patch Parameters.
2. The pasted Inputs under Patch Parameters are authoritative; update the sheet to match them even if current files differ.

## 2) Scope and non-scope
3. Update **only** what is named in `IN_SCOPE_SECTIONS` for `CAREER_KEY` and `TARGET_TIER`.
4. Do **not** look ahead or modify other careers, other tiers, or unrelated sections.

## 3) Reference/template rules
5. Use `SCHEMA_REFERENCE_CAREER` **only** for schema shape (field names/types), never as a content template.
6. For HTML/CSS structure and classes, copy the existing pattern found in the provided files for the targeted career+tier, as declared in `HTML_CSS_PATTERN_REFERENCE`.
7. Follow existing sheet conventions strictly (do not invent new structure):
   - Roll20 selector scoping: `.ui-dialog .tab-content .charsheet ...`
   - Class prefixing with `sheet-`
   - Existing lock/enabled hidden fields where the pattern uses them
   - Existing tier layout conventions
8. **Do not invent new keys, enums, or fields**. If a required field doesn’t exist in the established schema/pattern, stop and report it in Provenance & Checks.

## 4) Skills representation requirements (when primary_skills / secondary_skills are in scope)
9. Skill identifiers must use **existing `skillDataMap` keys** from `ghost_of_arcadia.html` (never English labels).
10. **No plain text skill labels** are allowed in career skill lists.
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
     1) `careerDataMap` object snippet for `CAREER_KEY` updates within scope
     2) Career HTML rows for the requested tier/skills (only if the pattern includes those rows here)
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
     - `attr_show_<career>_<talent>`
     - `attr_used_(scene|session)_<career>_<talent>`
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

## 11) i18n rules (career talents)
29. Career-talent i18n changes must include name + rules/description.
30. Career talent i18n key format must be exactly:
   - `career_<career>_<talent>-u`
   - `career_<career>_<talent>_rules-u`
31. No duplicate i18n keys may be created.
32. HTML `data-i18n` must reference keys that exist in the JSON snippet.

## 12) Career data requirements (new source of truth)
33. Talent objects must use i18n keys (e.g., `name_key`, `rule_text_key`) rather than hydrated label attrs.
34. Each talent entry must include (as supported by the established schema/pattern):
   - `tier`
   - `cost`
   - `usage_limit`
   - `strain`
   - `prerequisite` expression
   - `type`
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
   - Career + tier targeted (CAREER_KEY + TARGET_TIER)
   - Counts: talents updated/added, skills added/changed, i18n keys added/changed
   - Validations performed list
   - Patch Manifest lines for: careerDataMap, Tier rows, Tracker rows, CSS show-selectors, i18n keys, skill-key validation, JSON parse
41. If any gate fails, regenerate within the same response.
42. If there are no changes, produce a no-op (do not output identical ADD/REMOVE blocks).

Inputs: 
The pasted Inputs are authoritative; update the sheet to match them even if the current files differ.

Street Ronin – Tier 5 Capstones (30 XP) — Choose One
Talent	Description	Prerequisite

Duelmaster’s Claim	Type: Free Action (Mark Rival) • Cost: 1d4 Strain • Usage: 1/Session — Declare one opponent as your focused rival. Until the end of the scene, gain +1 bonus die on melee attacks, Dodge, and Reaction-based talents against that target. If you reduce the rival to 0 HP, immediately make one melee attack against another target in Engaged range or gain +1 bonus die on all melee attacks for the remainder of the scene.	Hold the Line
Final Cut Doctrine	Type: Reaction (Counter — Finisher) • Cost: 1d4 Strain • Usage: 1/Session — When making a melee counterattack, you may declare Final Cut before rolling. If your counterattack succeeds, it deals maximum weapon damage instead of rolling damage and you may apply one Tier 1–3 Street Ronin talent effect that normally triggers on a successful hit. If the counterattack fails, it resolves normally. This attack cannot itself trigger additional Street Ronin talents unless explicitly stated.	Flow Reversal
Ghost Walk	Type: Special immediate (Burst) • Cost: 1d6 Strain • Usage: 1/Session — Move up to Medium range as a Free Action and make one melee attack. If the target is unaware or has not yet acted this scene, deal +1d6 bonus damage and force a POW test; on failure, the target is Stunned until the end of the target’s next turn. 	Ghost Step
Last Breath	Type: Special immediate (End the Exchange) • Cost: 1d6 Strain • Usage: 1/Session — Declare after an enemy you are Engaged with completes an attack against you. Immediately resolve one melee attack against that enemy; if this attack hits, both you and the target cannot take Actions for the remainder of the current round, and the target suffers 1 penalty die on all rolls until the end of their next turn. This attack cannot itself trigger additional Street Ronin talents unless explicitly stated.	Moment Severed
Measured Finality	Type: Free Action (Commitment) • Cost: 1d6 Strain • Usage: 1/Session — At the start of your turn, designate one enemy you can see within Short range. Until the end of the scene, you cannot make attacks against other targets, but gain +1 bonus die on all melee attacks, Dodge, and Reaction-based talents against the designated enemy; if either of you is reduced to 0 HP, the effect immediately ends.	Steel Calm
