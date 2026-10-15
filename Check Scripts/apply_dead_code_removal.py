#!/usr/bin/env python3
"""apply_dead_code_removal.py — Todo 10 dead-code removal, as a reviewable script.

    python3 apply_dead_code_removal.py <in.html> <out.html> --phase 1|2 [--pins]

Why a script and not hand edits: the sheet is CRLF, a 4.4 MB single file, and the
instructions below must be repeatable on the exact file the author has. Every
deletion is (a) located by an anchored regex, (b) asserted to occur exactly once,
(c) asserted to span the expected number of lines, and (d) pinned by the SHA-256 of
the text removed. If the file has drifted from the one this was written against,
the script ABORTS WITHOUT WRITING rather than deleting something else.

--pins  prints the (lines, sha256) of every block it would remove, for review.
Phase 1 removes unused locals/consts; phase 2 removes orphan functions.
Nothing is renamed, reordered or reformatted; no live code is touched.
"""
import hashlib
import re
import sys

args = sys.argv[1:]
if len(args) < 4 or "--phase" not in args:
    sys.exit(__doc__)
src, dst = args[0], args[1]
phase = args[args.index("--phase") + 1]
show_pins = "--pins" in args
if phase not in ("1", "2"):
    sys.exit("--phase must be 1 or 2")

with open(src, "rb") as fh:
    data = fh.read().decode("utf-8")
assert "\r\n" in data and "\n" not in data.replace("\r\n", ""), "expected pure CRLF input"
lines = data.split("\r\n")           # keep empty last element; re-joined with CRLF at the end
orig_count = len(lines)

removed = []                          # (label, first_line_no, n_lines, sha)

def sha(chunk):
    return hashlib.sha256("\r\n".join(chunk).encode("utf-8")).hexdigest()[:16]

def find_one(pattern, start=0, end=None, what=""):
    rx = re.compile(pattern)
    hits = [i for i in range(start, len(lines) if end is None else end) if rx.search(lines[i])]
    assert len(hits) == 1, f"{what or pattern!r}: expected exactly 1 match, found {len(hits)}"
    return hits[0]

def delete(label, lo, hi, expect_lines, expect_sha):
    """Delete lines[lo:hi] (hi exclusive) after asserting size and content pin."""
    chunk = lines[lo:hi]
    assert expect_lines is None or len(chunk) == expect_lines, f"{label}: expected {expect_lines} lines, span is {len(chunk)}"
    got = sha(chunk)
    removed.append((label, lo + 1, len(chunk), got))
    assert expect_sha is None or got == expect_sha, f"{label}: content pin mismatch ({got} != {expect_sha}); file has drifted"
    del lines[lo:hi]

def delete_line(label, pattern, expect_sha):
    i = find_one(pattern, what=label)
    delete(label, i, i + 1, 1, expect_sha)

def delete_pair(label, first_pattern, second_pattern, expect_sha):
    i = find_one(first_pattern, what=label)
    assert re.search(second_pattern, lines[i + 1]), f"{label}: second line of pair does not match"
    delete(label, i, i + 2, 2, expect_sha)

def delete_function(label, name, expect_lines, expect_sha):
    """Delete `function name(...) {...}` including its leading comment and one trailing blank line."""
    s = find_one(r"^function " + re.escape(name) + r"\(", what=label)
    e = next(i for i in range(s + 1, len(lines)) if lines[i] == "}")
    lo = s
    # leading comment: // lines, or one /* ... */ block ending on the line above
    if lines[lo - 1].rstrip().endswith("*/"):
        j = lo - 1
        while not lines[j].lstrip().startswith("/*"):
            j -= 1
        lo = j
    else:
        while lines[lo - 1].lstrip().startswith("//"):
            lo -= 1
    hi = e + 1
    if hi < len(lines) and lines[hi].strip() == "":
        hi += 1
    delete(label, lo, hi, expect_lines, expect_sha)

PIN = {
    # SHA-256 (first 16 hex) of the exact text each block removes, from the 2026-10-15 upload (sheet v2.26.07.26 line set).
    "bgLimiterRegistered": "f8974cf48de3795d", "flaw5Keys": "c3fde31632afbf23", "flaw_let": "81a4b05b5ec68ecf",
    "flaw_inc": "9b27ba19c3560db7", "perk_let": "202cab82b5b494b5", "perk_inc": "3688e48c93c4f53f",
    "talentSkills_calc": "1f7b16ce1937d324", "iage": "1dec57fd3724ae24", "iedu": "50f1ede6f54978a9",
    "iwound": "26d89aa2b65699d0", "slots": "c4c040e3d82ca945", "reflexRanges": "4107be342fa364c6",
    "applyAllSkillBonuses": "6904358ece11bd62", "getAllTalentSkills": "7cbad3b01ad4eaf8", "handleRaceChange": "a516fcf6e58f64f2",
    "lastRaceHandled": "df9ffc92c2fcfbb5", "removeExhaustedStatus": "6b8bddf7924ec6ef", "applyTiredStatus": "55bdbf63192c6406",
    "removeTiredStatus": "f4b0703169e579f9", "computeWeaponAPTotal": "6460e4529e703a1a",
}

if phase == "1":
    delete_line("bgLimiterRegistered",       r"^const bgLimiterRegistered = new Set\(\);$", PIN.get("bgLimiterRegistered"))
    delete_pair("flaw5Keys/flaw10Keys",      r"^\s*const flaw5Keys\s*=", r"^\s*const flaw10Keys\s*=", PIN.get("flaw5Keys"))
    delete_pair("flaw let picked5/picked10", r"^\s*let picked5  = 0;$", r"^\s*let picked10 = 0;$", PIN.get("flaw_let"))
    delete_pair("flaw picked5++/picked10++", r"^\s*if \(cost === 5\)  picked5\+\+;$", r"^\s*if \(cost === 10\) picked10\+\+;$", PIN.get("flaw_inc"))
    delete_pair("perk let picked10/picked15", r"^\s*let picked10   = 0;$", r"^\s*let picked15   = 0;$", PIN.get("perk_let"))
    # the perk increment pair is located via its UNIQUE second line, to avoid matching the flaw one
    i = find_one(r"^\s*if \(cost === 15\) picked15\+\+;$", what="perk picked15++")
    assert re.search(r"^\s*if \(cost === 10\) picked10\+\+;$", lines[i - 1]), "perk picked10++ not directly above picked15++"
    delete("perk picked10++/picked15++", i - 1, i + 1, 2, PIN.get("perk_inc"))
    # talentSkills chain inside calculateAndUpdateSkillValues: from its `const` to the `.filter(Boolean);` + blank
    s = find_one(r"^\s*const talentSkills = Object\.entries\(ancestryDataMap\[racePrefix\]", what="talentSkills chain")
    e = next(i for i in range(s, s + 20) if lines[i].strip() == ".filter(Boolean);")
    hi = e + 1 + (1 if lines[e + 1].strip() == "" else 0)
    delete("talentSkills (calculateAndUpdateSkillValues)", s, hi, hi - s, PIN.get("talentSkills_calc"))
    delete_line("iage",   r"^\s*const iage\s*=\s*parseInt\(values\.age, 10\) \|\| 0;$", PIN.get("iage"))
    delete_line("iedu",   r"^\s*const iedu\s*=\s*parseInt\(values\.edu, 10\) \|\| 0;$", PIN.get("iedu"))
    delete_line("iwound", r"^\s*const iwound\s*=\s*parseInt\(values\.major_wounds, 10\) \|\| 0;$", PIN.get("iwound"))
    delete_line("slots (initWeaponComputedAttrs)", r"^\s*const slots = entry\.mod_slots \|\| \[\];$", PIN.get("slots"))
    delete_line("reflexRanges", r"^\s*const reflexRanges\s*=\s*\[\"engaged\", \"short\", \"medium\"\];$", PIN.get("reflexRanges"))
else:
    # callers are deleted before their callees (applyAllSkillBonuses before getAllTalentSkills)
    delete_function("applyAllSkillBonuses",  "applyAllSkillBonuses",  11, PIN.get("applyAllSkillBonuses"))
    delete_function("getAllTalentSkills",    "getAllTalentSkills",    22, PIN.get("getAllTalentSkills"))
    delete_function("handleRaceChange",      "handleRaceChange",      23, PIN.get("handleRaceChange"))
    delete_line("lastRaceHandled", r"^let lastRaceHandled = null;$", PIN.get("lastRaceHandled"))
    delete_function("removeExhaustedStatus", "removeExhaustedStatus", 12, PIN.get("removeExhaustedStatus"))
    delete_function("applyTiredStatus",      "applyTiredStatus",      26, PIN.get("applyTiredStatus"))
    delete_function("removeTiredStatus",     "removeTiredStatus",     13, PIN.get("removeTiredStatus"))
    delete_function("computeWeaponAPTotal",  "computeWeaponAPTotal",  17, PIN.get("computeWeaponAPTotal"))

out = "\r\n".join(lines)
assert "\n" not in out.replace("\r\n", ""), "bare LF introduced"       # Claude.md: bare LF == 0
assert out.count("\r\n") == orig_count - 1 - sum(r[2] for r in removed), "line accounting mismatch"
if True:
    print(f"phase {phase}: {len(removed)} blocks, {sum(r[2] for r in removed)} lines (line numbers shown are after earlier deletions in this run)")
    for label, first, n, h in removed:
        print(f"  {label:<44} line {first:>6}  lines {n:>3}  sha {h}")
if not show_pins:
    with open(dst, "wb") as fh:
        fh.write(out.encode("utf-8"))
    print("wrote", dst)
