# Implementation Contract — **Tracker** Career Talent Comment + Index Patch (Per-Scene / Per-Session)  
*(Canonical, Updated, Non-Conflicting, Blank-Line Safe, Indent-Safe)*

> **Purpose:** Insert cadence-group INDEX comment blocks and per-tracker-item wiring-detail header comments for a **single career** in the **Tracker** UI, while preserving existing formatting.  
> **Hard gates:** If any gate fails, stop and output only the failure report (Section 0).  
> **Key fix in this revision:** eliminates ambiguity that allowed **blank lines inside INDEX blocks** and **indent loss**.

---
# Addendum — Tracker Ordering Diagnosis Gate (Pre-INDEX)

**Purpose:** Detect tracker item interleaving, split cadence groups, and cadence contamination *before* inserting any `INDEX` blocks.

## When to run
- Run **after** Coverage Gate set-building (data vs tracker key equality) and **before** any INDEX insertion.

## Inputs
- Same single input HTML file already in scope.
- `CAREER_KEY`.

## Definitions
- A tracker item is identified by the career-scoped wiring pair:
  - `<input type="hidden" name="attr_show_<career>_<talentKey>" ... />`
  - followed by `<div class="sheet-tracker-item sheet-tracker-<cadence> sheet-<career>-<talentKey-dashed>"> ... </div>`
- `trackerCadence` is determined from the `.sheet-tracker-scene` / `.sheet-tracker-session` class.
- `dataCadence` is `careerDataMap.<career>.talents.<talentKey>.usage_limit`, normalized to `scene|session|campaign|none`.

## Required report output
Produce a **pure ordering diagnosis report** (no edits) containing:
1. **Provenance & Checks** (input size + SHA256).
2. **Cadence segments in file order** (e.g., `scene[1-12] → session[13-20]`).
3. **Interleaving flag** if cadence switches more than once.
4. **Cadence contamination list** where `trackerCadence != dataCadence`.
5. **Header label mismatch list** where the nearest non-empty legacy header comment claims `(scene)`/`(session)` that conflicts with the tracker item’s cadence class.
6. A **file-order table** with at least: sequence#, line#, talentKey, trackerCadence, dataCadence, nearest legacy header, issues.

## Gate outcome rule
- If **interleaving is detected** (more than one cadence switch), treat this as a **hard gate failure** for INDEX insertion.
- If **any cadence contamination exists** (`trackerCadence != dataCadence`), treat this as a **hard gate failure** for INDEX insertion.
- Only proceed to INDEX insertion when:
  - cadence segments are contiguous (0 or 1 switch max), AND
  - contamination count is 0.
  
---

## 0) Hard Gate Enforcement
If **any** gate fails at any point, **STOP immediately** and output **only**:
- **Gate Checklist Result** with PASS/FAIL per gate
- **Provenance & Checks** (input fingerprint + scope diff summary) **in a code block**
- **First failing condition** (what/where)
- **No files generated**

Any branch that would “skip” inserting an INDEX for a required cadence group is a **gate failure**, not best-effort.

---

## 1) Inputs and Fingerprint Gate
1. Read **only**: `/mnt/data/ghost_of_arcadia.html` (no other files; no memory/cache).
2. Compute input fingerprint:
	- Size: 2772105
	- SHA256: FC8D3201A10777E7E05B752C6FAA40DC5A321170B81382BED3F8E5CC2E0F346D
3. Compare to user-provided expected values.
4. If mismatch → **STOP**.

**Provenance requirement:** Always echo the **computed** size + SHA256 in **Provenance & Checks**, even if they match.

---

## 2) Career Scope Gate (Tracker DOM Container Lock)
5. All DOM searches MUST be scoped to the **Tracker** career container only (not the career talent list UI):
   - Find the **Tracker** section that contains the target career’s tracker items.
   - Scope lock must be based on an **unambiguous career-unique anchor** inside Tracker, e.g. the presence of:
     - `name="attr_show_<career>_<talentKey>"` hidden show inputs, and/or
     - `.sheet-<career>-<talentKey-dashed>` tracker item classes
6. If the tracker career container is not found → **STOP**.
7. Forbidden before scoping:
   - global searches for `.sheet-tracker-item`, `.sheet-tracker-session`, `.sheet-tracker-scene`, or `attr_used_*` patterns.

> **Note:** This contract intentionally targets **Tracker** markup (per-scene/per-session), not the career’s talent-tier UI.

---

## 3) Reference Pattern Lock (Non-Negotiable)
8. Treat **Career Codeweaver (Tracker)** as the **required target shape** for:
   - INDEX comment block format
   - INDEX block placement inside cadence groups
   - Per-item header comment format
   - Indentation / prefix preservation
   - Line spacing around

This is not inspiration. It is the required output shape.

---

## 4) Coverage Gate (Must PASS Before Any Edits)
9. Build sets from the same input HTML file:

### Data-side truth
- `TALENTS_IN_DATA`: from `careerDataMap.<career>.talents`
- `CADENCE_IN_DATA`: distinct `usage_limit` values across those talents, normalized to:
  - `scene`, `session`, `campaign`, `none` (only these strings)

### Tracker-side reality (scoped to the career tracker container)
- `TALENTS_IN_TRACKER`: distinct `<talentKey>` detected from tracker wiring:
  - `name="attr_show_<career>_<talentKey>"` (preferred), and/or
  - `name="attr_used_<cadence>_<career>_<talentKey>"` (if present), and/or
  - `.sheet-<career>-<talentKey-dashed>` (as a fallback identity check)

### Trackable coverage sets (scope-precise; prevents `usage_limit: ""/none` drift)
- `TALENTS_TRACKED_IN_DATA`: subset of `TALENTS_IN_DATA` where normalized `usage_limit ∈ { scene, session }`
  - (Include `campaign` in this set **only if** the Tracker UI for careers explicitly supports a campaign cadence list for that career.)
- `TALENTS_UNTRACKED_IN_DATA`: subset of `TALENTS_IN_DATA` where normalized `usage_limit == none`

10. Require:
- `TALENTS_TRACKED_IN_DATA == TALENTS_IN_TRACKER` (exact match; trackable-only)
- AND `TALENTS_UNTRACKED_IN_DATA` must have **zero** tracker wiring rows:
  - No `attr_show_<career>_<talentKey>` present in the tracker-scoped container for any `talentKey ∈ TALENTS_UNTRACKED_IN_DATA`
  - No `.sheet-<career>-<talentKey-dashed>` tracker item present for any `talentKey ∈ TALENTS_UNTRACKED_IN_DATA`
- AND cadence presence:
  - If any talent in data has normalized `usage_limit === "scene"`, a **scene** tracker group must exist for that career.
  - If any talent in data has normalized `usage_limit === "session"`, a **session** tracker group must exist for that career.
  - If `campaign` is included in `TALENTS_TRACKED_IN_DATA`, a **campaign** tracker group must exist for that career.

11. If mismatch → **STOP** and report:
- Missing talent keys on each side (trackable-only comparison)
- Any untracked talents that incorrectly appear in Tracker
- Summary of detected tracker anchors (counts + examples)
- Where detected (data section location + tracker node summaries)

---

## 5) Source of Truth (Talent Set, Cost, Cadence)
12. Source of truth for:
- talents that exist
- `cost`
- cadence (`usage_limit`)
is **`careerDataMap.<career>.talents`** in the **same input HTML file**.

13. Normalize cadence:
- Only accept: `none|scene|session|campaign`
- If data contains anything else → **STOP** (unknown cadence).

---

## 6) Tracker Item Identity (Per Scene / Per Session)
14. A tracker “item” is identified by the wiring pattern (career-scoped):
- A preceding show input:
  - `<input type="hidden" name="attr_show_<career>_<talentKey>" />` *(or the exact in-file equivalent)*
- Followed by a tracker item container:
  - `<div class="sheet-tracker-item sheet-tracker-<cadence> sheet-<career>-<talentKey-dashed>"> ... </div>`
- And a “used” checkbox attribute consistent with cadence:
  - `name="attr_used_<cadence>_<career>_<talentKey>"` *(or exact in-file equivalent)*

15. Cadence group membership is determined by the tracker item’s cadence class:
- `.sheet-tracker-scene` or `.sheet-tracker-session`
*(This contract is specifically for per-scene/per-session Tracker HTML.)*

---

## 7) INDEX Placement Rules (Tracker Cadence Groups)
For each required cadence group `C ∈ {scene, session}` that exists in `CADENCE_IN_DATA`:

16. `GROUP_NODE` = the **career-scoped** tracker group region that contains the relevant cadence items.
17. If `GROUP_NODE` missing → **STOP**.
18. If cadence group has **zero** tracker items → **STOP**.

### Placement rules (strict)
19. Insert the INDEX block as the **first content inside** the cadence group container that directly contains the list of `.sheet-tracker-item.sheet-tracker-<C>` for that career.

### Anchor + indentation prefix rule (strengthened)
20. Define `FIRST_ITEM_ANCHOR_LINE`:
- The opening line of the **first** tracker item in that cadence group (or, if the in-file style places a header comment immediately before it, that comment line).
21. **Every INDEX line must be prefixed with the exact indentation of `FIRST_ITEM_ANCHOR_LINE`.**
- No unindented INDEX lines
- No indentation normalization

### Structural prohibition (gate-enforced)
22. An INDEX block must **never** appear inside a `.sheet-tracker-item` block.
- If any INDEX line occurs after `<div class="sheet-tracker-item ...">` and before that item’s matching `</div>` → **STOP**.

---

## 8) Per-Item Header Replacement Rule (One-Line Lookback Only)
For every tracker item for the target career (scene + session):

23. Anchor: find the exact tracker item container associated to `<talentKey>` (Section 6).
24. Inspect only one line upward: nearest previous **non-empty** line. Do not scan further.

### Replace vs insert (mandatory legacy-cleanup guard)
25. Let `PREV` = nearest previous **non-empty** line above the tracker item opening line.
- If `PREV` is a single-line HTML comment
  - AND it does **not** contain `INDEX`
  - AND it does **not** contain `Tracker Career Talent:`
  - THEN treat it as legacy short header and **replace it** with wiring header, preserving `PREV` leading whitespace **byte-for-byte**.
- ELSE:
  - If `PREV` contains `Tracker Career Talent:` → **do nothing** (already wired).
  - Otherwise:
    - **Insert** wiring header immediately before the tracker item using the tracker item’s indentation prefix.
    - Then re-check nearest previous non-empty line:
      - If it is a legacy short header (single-line `<!-- ... -->` not INDEX and not Tracker Career Talent:) → **delete that legacy line entirely**
      - Deletion must not leave a blank-only line behind.

26. Forbidden: never inspect/parse/incorporate UI text (label spans, displayed name) into header content.

### Header comment format (exact)
27. Emit exactly one line:
`<!-- Tracker Career Talent: {Display Name} | key: {key} | cost: {N} XP | cadence: {scene|session|campaign|none} | attrs: {show}, {used} | i18n: {name} -->`

28. Whitespace lock:
- Replacement line leading whitespace must be **byte-identical** to original legacy comment’s leading whitespace.
- Comment must begin with `<!--` and end with `-->`.

29. Exactly **one** wiring header per tracker item. Legacy short header must not remain.

---

## 9) INDEX Block Content Rules (Blank-Line Safe)
Per cadence group:

30. INDEX block must be **contiguous** with **no blank-only lines anywhere inside the block**.

### Index block structure (required)
31. The INDEX block is exactly:
- 1 title line
- `T` item lines (one per tracker item in that cadence group for that career)
- 1 separator line

So total INDEX lines per cadence group: `T + 2`.

32. No blank-only lines:
- No empty line after title
- No empty lines between items
- No empty line before separator
- No empty line immediately after separator

33. Each item line format:
`<!-- - career_<career>_<talentKey> (<cost> XP, <cadence>) -->`

34. Ordering inside the cadence INDEX:
- Alphabetical by talent key (snake_case)
- Unless Codeweaver’s in-file index for that career+cadence shows a different ordering; then match it.

---

## 10) Validation Gates (Build MUST FAIL If Any Check Fails)
Per cadence group `C` (scene/session):

35. Count match:
`#(INDEX item lines) == #(tracker items in cadence group) == #(wiring headers in cadence group)`

36. Cadence purity:
- Every INDEX item’s talent key has `usage_limit === C` in data; no cross-cadence leakage.

37. Header completeness:
- Every tracker item has exactly one wiring header comment.

38. Style placement match:
- INDEX anchored exactly per Section 7 placement rules.

39. No malformed comments:
- No line begins with `!--` (missing `<`).

40. Whitespace lock:
- All unchanged lines byte-identical.
- Replaced header lines preserve original leading whitespace exactly.

41. No additional blank/empty lines:
- Net new blank-only lines must be **zero**.
- Additionally: each INDEX block contains **zero** blank-only lines (Section 9).

42. Coverage:
- For each required cadence present in data (`scene`, `session`), exactly one INDEX block exists in that cadence group in Tracker.

43. INDEX non-nesting:
- No INDEX comment line may occur between a tracker item’s opening `<div class="sheet-tracker-item ...">` and its closing `</div>`.

---

## 11) Output Rules
44. Produce **exactly two** files:
- Unified diff against the input file
- Full replacement HTML

45. Before links, print in a code block:
- Gate Checklist Result (PASS/FAIL per gate)
- Provenance & Checks:
  - computed input fingerprint (size + SHA256)
  - scope diff summary (concrete):
    - target career key
    - cadence groups processed (scene/session)
    - # INDEX blocks inserted
    - # legacy headers replaced vs deleted vs new headers inserted
    - total tracker items touched

46. If any gate fails → **no files**, only failure report.

---

## 12) Career Selector Clause (Set Once Per Request)
47. `CAREER_KEY = slicer` *(e.g., `marksman`, `icon`, `investigator`)*

All other steps are invariant.
