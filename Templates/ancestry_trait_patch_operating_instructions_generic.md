### Operating Instructions (Unambiguous) — Ancestry Patch Template (Generic)

## 0) Patch Parameters (edit ONLY this block per request)
**Files (always the same):**
- `ghost_of_arcadia.html`
- `ghost_of_arcadia.css`
- `translation.json`

**Target Ancestry + Scope:**
- `TRAIT_KEY`: `ancestryDataMap.khadra.traits.items`
- `IN_SCOPE_SECTIONS` *(only these; nothing else)*:
  - `traits` 

**Trait Inputs (single source of truth for trait content):**
- `TRAITS_INPUT`: `
Unyielding Frame
A Khadra’s body is built for extreme strain and impact. While you lack external plating, your dense bone structure and pressure-made musculature allow you to absorb shocks that would leave others reeling. You don’t falter when the pressure mounts; you simply tighten your grip.
Rules: Once per session, when you would suffer a condition that disrupts your ability to act—such as Impaired or Shaken—you may ignore that condition entirely. The triggering effect still occurs narratively, and any damage or secondary consequences still apply, but you act normally on your next turn. This cannot negate effects that remove control entirely, such as paralysis or unconsciousness.

Stone-Set Discipline
You are trained to find your center and stay there. Whether it’s a shifting floor, a panicked crowd, or a sudden explosion, you possess the internal stillness required to finish what you started without being distracted by the chaos around you.
Rules: Once per scene, when environmental pressure, crowd movement, or sudden disruption would force you to abandon a task, lose focus, or reposition against your will, you may choose to continue as intended. This does not prevent direct damage or grapples, but it allows you to resist interruptions caused by panic, confusion, or instability.

Oathbound Bearing
Your words carry a specific resonance—a weight that outsiders can feel even if they don't share your heritage. When you commit yourself to a course of action aloud, your presence shifts, making it clear that your position is a foundational reality rather than a temporary stance.
Rules: Once per session, when you openly invoke an oath, vow, or sworn responsibility, the GM may treat your stance as "weight-bearing" for the interaction. This can be used to establish seriousness in a negotiation, delay an escalation, or frame your position as being too costly for an opponent to challenge without serious consequences.

Burden of the Oath
For the Khadra, an oath is a weight-bearing pillar. If you choose to remove it, the structure of your identity and your standing in the world suffers the crack.
Rules: If you voluntarily abandon or knowingly act against an oath you invoked during the current scene, the GM introduces a meaningful complication tied to trust, reputation, or spiritual unease. This complication creates lasting narrative friction—doors that were open may close, and allies may look at you with newfound caution. If circumstances beyond your control make the oath impossible to fulfill, this complication does not trigger.
`

**Schema + Pattern References:**
- `SCHEMA_REFERENCE_TRAIT`: `ancestryDataMap.alteri.traits.items` *(schema only; never copy content)*
- `HTML_CSS_PATTERN_REFERENCE`: `ghost_of_arcadia.html/.css` pattern for the same ancestry+trait (or nearest matching trait pattern if missing)

---

## 1) Allowed inputs and authority
1. I will **only** use the three uploaded files listed in Patch Parameters.
2. The pasted Inputs under Patch Parameters are authoritative; update the sheet to match them even if current files differ.

## 2) Scope and non-scope
3. Update **only** what is named in `IN_SCOPE_SECTIONS` for `TRAIT_KEY`
4. Do **not** look ahead or modify other ancestrys, other traits, or unrelated sections.

## 3) Reference/template rules
5. Use `SCHEMA_REFERENCE_TRAIT` **only** for schema shape (field names/types), never as a content template.
6. For HTML/CSS structure and classes, copy the existing pattern found in the provided files for the targeted ancestry+trait, as declared in `HTML_CSS_PATTERN_REFERENCE`.
7. Follow existing sheet conventions strictly (do not invent new structure):
   - Roll20 selector scoping: `.ui-dialog .tab-content .charsheet ...`
   - Class prefixing with `sheet-`
   - Existing lock/enabled hidden fields where the pattern uses them
   - Existing trait layout conventions
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

## 5) Trait key derivation and alphabetization
15. Trait key derivation (from displayed trait name):
   - lowercase
   - remove punctuation
   - spaces → underscores
16. **Alphabetization rules are by key (snake_case)**:
   - Traits: alphabetize by **trait key**
   - Skill lists: alphabetize by **skill key**
   - i18n keys: alphabetize by **i18n key string**
   - Tracker HTML rows and CSS selectors: alphabetize by **trait key**
17. Never infer ordering from the pasted Inputs; always apply the above sorting rules.

## 6) Required deliverables (files only)
18. Output **three separate downloadable files**:
   - **HTML patch/snippet** (only the in-scope sections) grouped in this order:
     1) `ancestryDataMap` object snippet for `TRAIT_KEY` updates within scope
     2) Ancestry HTML rows for the requested traits (only if the pattern includes those rows here)
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
24. If a trait has `usage_limit` of **scene** or **session**, it must have:
   - Tracker HTML hooks:
     - `attr_show_<ancestry>_<trait>`
     - `attr_used_(scene|session)_<ancestry>_<trait>`
   - Matching Tracker CSS show selector(s) for the `attr_show_*` hook
25. Tracker coupling is mandatory:
   - Any tracker HTML ADD/REMOVE must have matching CSS selector ADD/REMOVE
   - A trait must appear in the correct tracker list (scene vs session), not the wrong one.
   - Only create trait tracker rows if the existing tracker pattern in ghost_of_arcadia.html shows ancestry traits are tracked (it does), and use that exact pattern.
26. If `usage_limit` is `at_will` or `permanent`, do not create tracker rows unless the existing UI pattern explicitly does so.
   - If a trait is at_will/permanent (or has no usage_limit), do not add tracker rows.
   
## 10) Removal rules across all surfaces
27. If a trait is removed from the trait’s HTML/data, also remove (in the same patch):
   - its tracker HTML hooks
   - its tracker CSS show selectors
   - its i18n keys
28. “Removed” means removed from ALL required surfaces for this patch.

## 11) i18n rules (ancestry traits)
29. Ancestry-trait i18n changes must include name + rules/description.
30. Ancestry trait i18n key format must be exactly:
   - `racial_<ancestry>_<trait>-u`
   - `racial_<ancestry>_<trait>_rules-u`
31. No duplicate i18n keys may be created.
32. HTML `data-i18n` must reference keys that exist in the JSON snippet.

## 12) Ancestry data requirements (new source of truth)
33. Trait objects must use i18n keys (e.g., `name_key`, `rule_text_key`) rather than hydrated label attrs.
34. Each trait entry must include (as supported by the established schema/pattern):
   - `name_key`
   - `rule_text_key`
   - `affected_skill`
   - any tracker/icon hooks required by the existing UI
35. Parse Inputs deterministically:
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
   - Ancestry + trait targeted (TRAIT_KEY)
   - Counts: traits updated/added, skills added/changed, i18n keys added/changed
   - Validations performed list
   - Patch Manifest lines for: ancestryDataMap, Tier rows, Tracker rows, CSS show-selectors, i18n keys, skill-key validation, JSON parse
41. If any gate fails, regenerate within the same response.
42. If there are no changes, produce a no-op (do not output identical ADD/REMOVE blocks).

