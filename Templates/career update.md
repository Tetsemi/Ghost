### Operating Instructions (Unambiguous)

#### 0) Allowed inputs and authority
1. I will **only** use these three uploaded files as references (and nothing else):
   - `ghost_of_arcadia.html`
   - `ghost_of_arcadia.css`
   - `translation.json`
2. The **pasted “Inputs” text is authoritative**. If it conflicts with current sheet content, I must update the sheet to match the pasted Inputs.

#### 1) Exact scope of work
3. Target **only**:
   - `careerDataMap.street_ronin`
   - `primary_skills`
   - `secondary_skills`
   - `talents.<talent>.tier === 1
4. I must **not** look ahead, update, or touch any other careers, tiers, sections, or unrelated content.

#### 2) Reference/template rules
5. Use `careerDataMap.combat_engineer` **only** as a **schema reference** (field names/shape), **not** as a content/template to copy.
6. For **HTML/CSS structure and classes**, I must copy the **existing pattern** used in the current `ghost_of_arcadia.html/.css` for the **Street Ronin career Tier 1** (or nearest matching existing Tier 1 capstone pattern in those files if Street Ronin Tier 1 exists there).
7. Follow existing sheet conventions strictly:
   - Roll20 selector scoping: `.ui-dialog .tab-content .charsheet ...`
   - Class prefixing with `sheet-`
   - Existing lock/enabled hidden fields where the current pattern uses them
   - Existing tier layout conventions
   - **Do not invent new structure**

#### 3) Talent key derivation and alphabetization
8. Every talent gets a **talent key** derived from the talent name:
   - lowercase
   - remove punctuation
   - spaces → underscores
9. All ordering must be **alphabetical by talent key (snake_case)** — **not** by label text — consistently across:
   - `careerDataMap` talent entries
   - Tier 1 Career HTML talent rows
   - Tracker HTML rows
   - Tracker CSS show selectors
   - i18n keys in `translation.json`

#### 4) Required deliverables (files only)
10. I must output **three separate downloadable files**:
   - **HTML patch/snippet** (this section only) containing grouped blocks in this order:
     1) `careerDataMap` object snippet for street_ronin Tier 1 capstones
     2) Street Ronin Tier 1 Career HTML rows including skills if needed
     3) Tracker HTML rows (scene/session as required)
   - **CSS patch/snippet** (this section only) as **one complete ADD/REMOVE block**
   - **JSON patch/snippet** (this section only) as **ADD/REMOVE blocks**, alphabetized
11. Patches must be **ADD / REMOVE blocks only** (not +/- diffs, not inline fragments without the ADD/REMOVE framing).

#### 5) Hard gate: REMOVE blocks must be verbatim
12. Any **REMOVE** block must be copied **verbatim** from the current file text:
   - includes comment headers, braces, exact spacing, and original indentation
13. If I cannot copy a REMOVE block verbatim (because I can’t find the exact block in the file), I must **STOP** and not produce patches.

#### 6) Whitespace and formatting constraints
14. Use the existing indentation and formatting from the files.
15. **No line may change leading whitespace unless that line’s content changes.**

#### 7) Tracker coupling requirements
16. If a talent has `usage_limit` of **scene** or **session**, it must have:
   - Tracker HTML hooks:
     - `attr_show_<career>_<talent>`
     - `attr_used_(scene|session)_<career>_<talent>`
   - Matching Tracker CSS show selector(s) for the `attr_show_*` hook
17. **Tracker coupling is mandatory**:
   - Any Tracker HTML ADD/REMOVE must have matching CSS selector ADD/REMOVE
   - A talent must appear in the **correct** tracker list (scene vs session), and **not** the wrong one.

#### 8) Removal rules across all surfaces
18. If a talent is removed from the tier’s HTML/data, I must also remove, in the same patch:
   - its tracker HTML hooks
   - its tracker CSS show selectors
   - its i18n keys
19. “Removed” means removed from **all three surfaces**:
   - `careerDataMap` entry
   - Career HTML row(s)
   - Tracker HTML/CSS hooks and translation keys  
   …even if other tiers *currently* reference them (the instruction says remove them anyway).

#### 9) i18n rules
20. i18n updates must be complete for each talent:
   - **name** key and **rules/description** key
21. Career talent i18n key format must be exactly:
   - `career_<career>_<talent>-u`
   - `career_<career>_<talent>_rules-u`
22. I must ensure:
   - No duplicate i18n keys are introduced
   - The HTML `data-i18n` references keys that exist in the JSON snippet

#### 10) Career data requirements (new source of truth)
23. Update/create the Tier 1 capstone talent objects using **i18n keys** (e.g., `name_key`, `rule_text_key`, etc.), not hydrated label attrs.
24. Each talent entry must include (per existing schema/pattern):
   - `tier`
   - `cost`
   - `usage_limit` (scene/session)
   - `strain`
   - `prerequisite` expression (as used by existing system)
   - `type`
   - any tracker/icon hooks required by existing UI patterns
25. The “section” includes and must stay consistent across:
   - `careerDataMap` entries
   - Tier 1 talent UI rows
   - tracker rows/CSS affected by usage_limit

#### 11) Skill-key validation
26. Validate every referenced skill key against **`skillDataMap` inside `ghost_of_arcadia.html`**.
27. If any skill key is missing/unknown:
   - explicitly list it as missing/unknown
   - **do not guess** a replacement

#### 12) Mandatory correction substitutions
28. Apply these exact text normalizations anywhere relevant to the updated section:
   - `Pistol` → `Handgun`
   - `pistol` → `handgun`
   - `Archanotech` → `Arcanotech`
   - `archanotech` → `arcanotech`

#### 13) Chat output restrictions
29. In chat, I must **not** include inline code blocks containing HTML/CSS/JSON.
30. In chat, I must include **exactly one** code block titled **“Provenance & Checks”** containing:
   - the 3 filenames used
   - career + section targeted
   - counts: talents updated/added, skills added/changed, i18n keys added/changed
   - validations performed list
   - Patch Manifest lines (careerDataMap, Tier rows, Tracker rows, CSS show-selectors, i18n keys, skill-key validation, JSON parse)
31. If any gate fails, I must **regenerate within the same response** (not defer).
32. If there are **no changes**, produce a **no-op** (do not output identical ADD/REMOVE blocks).

---

Inputs:

Primary Skills: Melee Weapons, Athletics, Dodge, Coordination
Secondary Skills: Stealth, Insight, Perception, Unarmed, Intimidate, Survival (choose one)

Street Ronin – Tier 1 Talents (5 XP)
Talent	Description

Clean Entry	Type: Action (Draw & Strike) • Cost: — • Usage: At-will — Draw and strike with a melee weapon as a single Action. If you begin the scene undetected or neutral, your first melee attack of that scene gains +1 bonus die.
Combat Rhythm	Type: Reaction (Flow) • Cost: — • Usage: 1/Scene — After you successfully Dodge an attack, gain +1 bonus die on your next Melee Weapons or Coordination roll before the end of your next turn. This bonus represents momentary control gained through evasion and applies even if no follow-up attack is made.
Disciplined Focus	Type: Free Action (Ignore Penalty) • Cost: 1 Strain • Usage: 1/Scene — Declare before making an attack, defense, or Initiative roll; ignore 1 penalty die on that roll.
Strain Buffer	Type: Passive • Cost: — • Usage: Permanent — Increase your maximum Strain by +1. (This talent may appear in multiple Career Trees.)
Urban Footwork	Type: Free Action (Terrain) • Cost: — • Usage: 1/Scene — Until the end of the current round, gain +1 bonus die on Dodge or Athletics rolls made as part of your own movement through tight spaces, vertical terrain, or cluttered urban environments.
