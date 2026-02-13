# Implementation Contract — Career Talent Comment + Index Patch (Canonical)

## 0) Hard Gate Enforcement
If **any** gate fails at any point, **STOP immediately** and output **only**:
- Gate Checklist Result with PASS/FAIL
- Provenance (input fingerprint)
- The first failing condition (what/where)
- **No files generated**

## 1) Inputs and Fingerprint Gate
1. Read **only** the file at the provided path (e.g., `/mnt/data/ghost_of_arcadia.html`).
2. Compute:
   - Size 2569730
   - SHA256 D6AE0FD173F8AECD1D2F5AC789EE0B8B326200144F69298D4134335967FE34F7
3. Compare to user-provided values.
   - If mismatch → **STOP**.

## 2) Reference Pattern Lock
4. Treat **Career Codeweaver** as the **reference** for:
   - INDEX comment block **format**
   - INDEX comment block **placement**
   - Per-talent header comment **format**
   - Indentation style (prefix preservation)

This is not “inspiration.” It is the required target shape.

## 3) Source of Truth for Talent Set and Tiering
5. The source of truth for:
   - which talents exist,
   - what tier they’re in,
   - cost,
   - cadence (`usage_limit`)
is **`careerDataMap.<career>.talents`** in the same HTML file.

6. **Tier extraction rule (no drift allowed):**
   - Only the talent object’s **top-level** `tier:` is valid.
   - Nested occurrences (e.g., `prerequisiteAny: { tier: … }`) must be ignored.
   - Implementation requirement: parse structurally (AST) or depth=1 scan of the talent object; never “first `tier:` match”.

## 4) Source of Truth for Where to Patch in HTML
7. Talent rows are identified by checkbox attrs:
   - `name="attr_<career>_<talentKey>"` and the corresponding lockflag.
8. Tier membership in the DOM is determined by the enclosing:
   - `<div class="sheet-career-talent-tier" data-tier="N">`

## 5) Placement Rules (Codeweaver-Equivalent)
For each tier **present for that career**:

9. **INDEX insertion anchor** (must match Codeweaver’s “feel”):
   - If the tier contains a career-specific container:
     - `<div class="sheet-career-block sheet-career-<career>">`
       - `<div class="sheet-career-talents">`
     - Then the INDEX block must be inserted as the **first content inside** `.sheet-career-talents`, before the first per-talent header comment.
   - If the tier does **not** include `.sheet-career-talents` for that career:
     - Insert the INDEX block immediately **before the first matching talent row** in that tier, using the same indentation prefix as the first talent’s existing header comment line.

No other placement is valid.

## 6) Per-Talent Header Replacement Rule

10. For every talent in the target career + tier:

	- **Anchor the talent row:** Find the exact `<div class="sheet-career-talent-row">` that contains the checkbox with `name="attr_<career>_<talentKey>"`.
	- **Inspect only one line upward:** Identify the **nearest previous non-empty line** (a line containing any non-whitespace characters). Do **not** scan beyond this single line.
	- **Replace vs insert:**
		- If that single line is a **single-line HTML comment** (starts with `<!--` and ends with `-->` on the same line) **and** it does **not** contain `INDEX` **and** it does **not** contain `Career Talent:`:
		- Treat it as the legacy short header (e.g., `<!-- Talent Name -->`) and **replace it**, preserving the original line’s **leading whitespace prefix** byte-for-byte.
	- Otherwise:
		- **Insert** the new wiring-detail header comment **immediately before** the anchored talent row, using the talent row’s **indentation prefix**.
	- **Forbidden source content:** Never inspect, parse, or incorporate toolbar/label/UI text (e.g., `<div class="sheet-career-talent-toolbar">`, `<label ...>`, tier headers, etc.) into a talent header comment.

Header comment format to emit:

`<!-- {TYPE}: {Display Name} | key: {key} | cost: {N} XP | cadence: {none|scene|session|campaign} | attrs: {main}, {lockflag} | i18n: {name} | {flavor} | {description} -->`

11. **Prefix preservation (whitespace lock):**
   - The replacement line’s leading whitespace must be **byte-identical** to the original comment line’s leading whitespace.
   - The comment must always begin with `<!--` and end with `-->` (no trimming heuristics).

12. The original short header comment must **not** remain. There must be **one** header per talent.

## 7) INDEX Block Content Rules
13. INDEX content per tier:
   - Title line uses Codeweaver format, including Tier number and `(key | cost, cadence)`
   - Entries list **only** that tier’s talents:
     - `<!-- - career_<career>_<talentKey> (<cost> XP, <cadence>) -->`
   - Separator line matches Codeweaver style.
14. Ordering inside the tier index:
   - Alphabetical by talent key (snake_case), unless Codeweaver index demonstrates a different ordering rule in-file (then match that).

## 8) Validation (Build Must Fail if Any Check Fails)
For each tier:
15. **Count match**
   - `#(INDEX items) == #(per-talent header comments produced for that tier)`
16. **Tier purity**
   - Every INDEX entry’s talent key has `tier === N` from the data object.
   - No talent from other tiers appears in this tier’s INDEX.
17. **Header completeness**
   - Every talent row in that tier has exactly one wiring header.
18. **Style placement match**
   - INDEX must be in the correct anchor location (inside `.sheet-career-talents` when present).
19. **No malformed comments**
   - No line begins with `!--` (missing `<`).
20. **Whitespace lock**
   - All unchanged lines are byte-identical.
   - All replaced header lines preserve original leading whitespace exactly.
21. **No additional blank/empty lines**
   - Net new empty lines in output must be zero.
   - Diff output must not contain added/removed blank-only lines.

## 9) Output Rules
22. Produce **exactly two** files:
   - Unified diff against the input file
   - Full replacement HTML
23. Before outputting links, print:
   - Gate Checklist Result (PASS/FAIL per gate)
   - Provenance & Checks (input fingerprint + scope diff summary)
24. If any gate fails → **no files**, only failure report.

## 10) Optional Career Selector Clause
Set once per request:
- `CAREER_KEY = combat_engineer` (e.g., `arcane_gunslinger`)

All other steps are invariant.
