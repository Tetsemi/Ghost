# Implementation Contract — Career Talent Comment + Index Patch (Canonical, Updated, Non-Conflicting, Blank-Line Safe)

> **Purpose:** Insert per-tier INDEX comment blocks and per-talent wiring-detail header comments for a single career, while preserving existing formatting.  
> **Hard gates:** If any gate fails, stop and output only the failure report (Section 0).  
> **Key fix in this revision:** eliminates ambiguity that allowed **blank lines inside INDEX blocks** and **indent loss** (your Marksman Tier 5 example).

---

## 0) Hard Gate Enforcement
If **any** gate fails at any point, **STOP immediately** and output **only**:
- **Gate Checklist Result** with PASS/FAIL per gate
- **Provenance & Checks** (input fingerprint + scope diff summary) **in a code block**
- **First failing condition** (what/where)
- **No files generated**

Any branch that would “skip” inserting an INDEX for a tier is a **gate failure**, not best-effort.

---

## 1) Inputs and Fingerprint Gate
1. Read **only**: `/mnt/data/ghost_of_arcadia.html` (no other files; no memory/cache).
2. Compute input fingerprint:
	- Size: 2678300
	- SHA256: 9B5E7EFE1E83EFFF810F6F4965A13E72FA5006835FCBD09BCFCB26B7B0B12C87
3. Compare to user-provided expected values.
4. If mismatch → **STOP**.

**Provenance requirement:** Always echo the **computed** size + SHA256 in **Provenance & Checks**, even if they match.

---

## 2) Career Scope Gate (DOM Container Lock)
5. All DOM searches MUST be scoped to the career container only:
   - `<div class="sheet-career-tab sheet-tab-<career>"> ... </div>`
6. If that container is not found → **STOP**.
7. Forbidden: global searches for `.sheet-career-talents`, `.sheet-career-talent-tier`, or `data-tier` prior to scoping.

---

## 3) Reference Pattern Lock (Non-Negotiable)
8. Treat **Career Codeweaver** as the **required target shape** for:
   - INDEX comment block format
   - INDEX comment block placement
   - Per-talent header comment format
   - Indentation / prefix preservation

This is not inspiration. It is the required output shape.

---

## 4) Tier Coverage Gate (Must PASS Before Any Edits)
9. Build:
   - `TIERS_IN_DATA`: distinct **top-level** `tier` values across `careerDataMap.<career>.talents` (see Section 5).
   - `TIERS_IN_DOM`: distinct `data-tier="N"` values inside the **career-scoped** DOM block.
10. Require:
   - `TIERS_IN_DATA == TIERS_IN_DOM`
   - AND if `1 ∈ TIERS_IN_DATA`, Tier 1 must be present in DOM.
11. If mismatch → **STOP** and report:
   - Missing tier numbers on each side
   - Where detected (data section location + DOM tier nodes summary)

---

## 5) Source of Truth (Talent Set, Tiering, Cost, Cadence)
12. Source of truth for:
   - talents that exist
   - `tier`
   - `cost`
   - cadence (`usage_limit`)
is **`careerDataMap.<career>.talents`** in the **same input HTML file**.

### Tier extraction rule (no drift allowed)
13. Only the talent object’s **top-level** `tier:` is valid.
14. Ignore nested occurrences (e.g., `prerequisiteAny: { tier: … }`).
15. Implementation requirement:
   - Parse structurally (AST) **or**
   - Perform a **depth=1** scan per talent object
   - Never “first `tier:` match” heuristics.

---

## 6) Talent Row Identity and Tier Membership in DOM
16. A talent row is identified by:
   - checkbox `name="attr_<career>_<talentKey>"`
   - plus corresponding lockflag input (as used in-file for that career)
17. Tier membership is determined by enclosing:
   - `<div class="sheet-career-talent-tier" data-tier="N">`

---

## 7) INDEX Placement Rules (Codeweaver-Equivalent, Tier 1 Included)
For each `N ∈ TIERS_IN_DOM` ascending:

18. `TIER_NODE` = career-scoped node `.sheet-career-talent-tier[data-tier="N"]`
19. If missing → **STOP**
20. If tier has **zero** talent rows → **STOP**

### Placement rules (strict; nesting forbidden; non-conflicting with Section 8)
21. If `TIER_NODE` contains `.sheet-career-talents`:
- Insert the INDEX block as the **first content inside** that `.sheet-career-talents`.

Else (Tier 1 pattern in some careers):
- Identify the **first anchored talent row** in the tier:
  - first `<div class="sheet-career-talent-row">` that contains checkbox `name="attr_<career>_<talentKey>"`
- Identify `HEADER_ANCHOR_LINE`:
  - Let `PREV` = nearest previous **non-empty** line above the row opening line.
  - If `PREV` is a single-line HTML comment (`<!-- ... -->`), then `HEADER_ANCHOR_LINE = PREV`,
  - else `HEADER_ANCHOR_LINE =` the talent row opening line.
- Insert INDEX block on its own lines **immediately before** `HEADER_ANCHOR_LINE`:
  - “Immediately before” means INDEX block’s **last line** is directly above `HEADER_ANCHOR_LINE` with **no intervening non-empty lines**.

### Structural prohibition (gate-enforced)
22. An INDEX block must **never** appear inside a `.sheet-career-talent-row` block.
- If any INDEX line occurs after `<div class="sheet-career-talent-row">` and before that row’s matching `</div>` → **STOP**.

### Indentation prefix rule (strengthened)
23. **Every INDEX line must be prefixed with the exact indentation of `HEADER_ANCHOR_LINE`** (the whitespace prefix of that specific line).
- Do **not** emit any unindented INDEX lines.
- Do **not** “normalize” indentation.

**Gate:** If `1 ∈ TIERS_IN_DATA`, Tier 1 INDEX must exist in Tier 1 DOM container after patch.

---

## 8) Per-Talent Header Replacement Rule (One-Line Lookback Only)
For every talent in the target career (within each tier):

24. Anchor: find the exact `<div class="sheet-career-talent-row">` containing checkbox `name="attr_<career>_<talentKey>"`.
25. Inspect only one line upward: nearest previous **non-empty** line. Do not scan further.

### Replace vs insert (mandatory legacy-cleanup guard)
26. Let `PREV` = nearest previous **non-empty** line above the talent row (inspect only this one line).
- If `PREV` is a single-line HTML comment
  - AND it does **not** contain `INDEX`
  - AND it does **not** contain `Career Talent:`
  - THEN treat it as legacy short header and **replace it** with wiring header, preserving `PREV` leading whitespace **byte-for-byte**.
- ELSE:
  - If `PREV` contains `Career Talent:` → **do nothing** (already wired).
  - Otherwise:
    - **Insert** wiring header immediately before the talent row using the talent row’s indentation prefix.
    - Then re-check nearest previous non-empty line:
      - If it is a legacy short header (single-line `<!-- ... -->` not INDEX and not Career Talent:) → **delete that legacy line entirely**
      - Deletion must not leave a blank-only line behind.

27. Forbidden: never inspect/parse/incorporate toolbar/label/UI text into header content.

### Header comment format (exact)
28. Emit exactly one line:
`<!-- {TYPE}: {Display Name} | key: {key} | cost: {N} XP | cadence: {none|scene|session|campaign} | attrs: {main}, {lockflag} | i18n: {name} | {flavor} | {description} -->`

29. Whitespace lock:
- Replacement line leading whitespace must be **byte-identical** to original legacy comment’s leading whitespace.
- Comment must begin with `<!--` and end with `-->`.

30. Exactly **one** wiring header per talent row. Legacy short header must not remain.

---

## 9) INDEX Block Content Rules (Blank-Line Safe)
31. INDEX block per tier must be **contiguous** with **no blank-only lines anywhere inside the block**.

### Index block structure (required)
32. The INDEX block is exactly:
- 1 title line
- `T` item lines (one per talent row in that tier)
- 1 separator line

So total INDEX lines per tier: `T + 2`.

33. No blank-only lines:
- **No empty line after title**
- **No empty lines between items**
- **No empty line before separator**
- **No empty line immediately after separator**

34. Each item line format:
`<!-- - career_<career>_<talentKey> (<cost> XP, <cadence>) -->`

35. Ordering inside a tier INDEX:
- Alphabetical by talent key (snake_case)
- Unless Codeweaver’s in-file index for that career shows a different ordering; then match it.

---

## 10) Validation Gates (Build MUST FAIL If Any Check Fails)
Per tier `N`:

36. Count match:
`#(INDEX item lines) == #(talent rows in tier) == #(wiring headers in tier)`

37. Tier purity:
- Every INDEX item’s talent key has `tier === N` in data; no cross-tier leakage.

38. Header completeness:
- Every talent row has exactly one wiring header comment.

39. Style placement match:
- INDEX anchored exactly per Section 7 placement rules.

40. No malformed comments:
- No line begins with `!--` (missing `<`).

41. Whitespace lock:
- All unchanged lines byte-identical.
- Replaced header lines preserve original leading whitespace exactly.

42. No additional blank/empty lines:
- Net new blank-only lines must be **zero**.
- **Additionally:** each INDEX block contains **zero** blank-only lines (Section 9).

43. Tier coverage:
- For every `N ∈ TIERS_IN_DATA`, exactly one INDEX block exists in that tier’s DOM node.

44. INDEX non-nesting:
- No INDEX comment line may occur between a talent row’s opening `<div class="sheet-career-talent-row">` and that row’s closing `</div>`.

45. Tier-1 adjacency validation (tiers without `.sheet-career-talents`):
- First non-empty line after the INDEX separator must be either:
  - wiring header (`<!-- Career Talent:`), OR
  - legacy short header (`<!-- ... -->` not INDEX and not Career Talent:), OR
  - the first talent-row opening line only if Section 8 will insert a header.
- It must not be inside a talent-row block.

---

## 11) Output Rules
46. Produce **exactly two** files:
- Unified diff against the input file
- Full replacement HTML

47. Before links, print in a code block:
- Gate Checklist Result (PASS/FAIL per gate)
- Provenance & Checks:
  - computed input fingerprint (size + SHA256)
  - scope diff summary (concrete):
    - target career key
    - tiers processed
    - # INDEX blocks inserted
    - # legacy headers replaced vs deleted vs new headers inserted
    - total talent rows touched

48. If any gate fails → **no files**, only failure report.

---

## 12) Career Selector Clause (Set Once Per Request)
49. `CAREER_KEY = codeweaver` (e.g., `marksman`, `icon`, `investigator`)

All other steps are invariant.
