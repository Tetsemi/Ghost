#!/usr/bin/env python3
"""
Ghost of Arcadia — buildTagsStr derivation equivalence prover.

Step 2 of the tag-layer refactor. Before collapsing seven independently
maintained derivation blocks into one `weaponTagInputs` table, we have to prove
they actually agree. This does that statically rather than by sampling inputs:
for every one of the 19 arguments, at each of the 7 call sites, it resolves the
local `const` chain down to raw attribute reads, normalises the three naming
conventions to a common form, and compares.

Static beats a runtime matrix here because it covers every possible input rather
than the combinations we happened to think of.

Normalised forms:
    g(core)   a row attribute, scope-independent
    G(name)   a global (non-row) attribute

Exit 0 = all 19 positions agree across all sites. Exit 1 = divergence found,
which must be adjudicated before the refactor proceeds.
"""

import re
import sys
from collections import defaultdict

HTML = sys.argv[1] if len(sys.argv) > 1 else "ghost_of_arcadia.html"
FUNC = sys.argv[2] if len(sys.argv) > 2 else "buildTagsStr"

# Argument order per function — position i is this logical input.
POSITION_MAP = {
    "buildTagsStr": ["optics", "sl", "barrel", "irs", "qst", "qls", "biocoded",
                     "mode", "range", "category", "maxRange", "cq", "aim",
                     "prone", "cover", "ap", "concealable", "loadout", "silent"],
    "computeWeaponDice": ["optics", "aim", "mode", "reduceEff", "range",
                          "category", "maxRange", "barrel", "cq", "prone",
                          "cover", "ap"],
}
POSITIONS = POSITION_MAP[FUNC]

BARE = {"attacks", "damage", "malf", "name", "range"}


def normalise(expr):
    """Collapse the three naming conventions onto g(core) / G(name)."""
    s = expr
    # rows[`repeating_weaponsmdr_${id}_weapon_X_mdr`]
    s = re.sub(r'rows\[`repeating_weaponsmdr_\$\{id\}_weapon_([a-z0-9_]+)_mdr`\]', r'g(\1)', s)
    s = re.sub(r'rows\[`repeating_weaponsmdr_\$\{id\}_weapon([a-z0-9]+)_mdr`\]', r'g(\1)', s)
    # v[p+"weapon_X_mdr"] / v[p + "weapon_X_mdr"] / sv[...]
    s = re.sub(r'\b\w*v\[\s*p\s*\+\s*"weapon_([a-z0-9_]+)_mdr"\s*\]', r'g(\1)', s)
    s = re.sub(r'\b\w*v\[\s*p\s*\+\s*"weapon([a-z0-9]+)_mdr"\s*\]', r'g(\1)', s)
    # v.weapon1_mdr_X  and  v["weapon1_mdr_X"]
    s = re.sub(r'\bv\.weapon1_mdr_([a-z0-9_]+)', r'g(\1)', s)
    s = re.sub(r'\bv\[\s*"weapon1_mdr_([a-z0-9_]+)"\s*\]', r'g(\1)', s)
    s = re.sub(r'\bv\.weapon1_([a-z0-9_]+)', r'g(\1)', s)
    # globals (rows[] is the same store under a different local name)
    s = re.sub(r'\brows\[\s*"([a-z0-9_]+)"\s*\]', r'G(\1)', s)
    s = re.sub(r'\b\w*v\[\s*"([a-z0-9_]+)"\s*\]', r'G(\1)', s)
    s = re.sub(r'\bv\.([a-z0-9_]+)\b', r'G(\1)', s)
    # cosmetic
    s = re.sub(r'\s+', ' ', s).strip()
    s = s.replace('( ', '(').replace(' )', ')')
    # Redundant parens around a comparison, and defensive || defaults that
    # cannot change the comparison result, are noise not behaviour.
    for _ in range(4):
        s = re.sub(r'\((g\([a-z0-9_]+\) === "[^"]*")\)', r'\1', s)
        s = re.sub(r'\(g\(([a-z0-9_]+)\) \|\| "[^"]*"\) === ', r'g(\1) === ', s)
    # undefined and "" are both falsy and used interchangeably as "flag off"
    s = re.sub(r':\s*undefined\b', ': ""', s)
    return s


# A line that begins a new top-level construct — do not look past it, or
# bindings from a *different* function get attributed to this call site.
_BOUNDARY = re.compile(r'^(?:on\(|function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)|\w+)\s*=>\s*\{)')


def collect_bindings(lines, upto):
    """Nearest-preceding `const NAME = EXPR;` bindings visible at a call site.

    Scans BACKWARD so the nearest binding wins, matching JS shadowing. An
    earlier version scanned forward and kept the first hit, which returned the
    *earliest* binding in the window — and on 2026-08-01 that attributed
    `const barrel = cur === barrelVal ? "" : barrelVal` from the barrel-toggle
    handler to a call site in a different function, manufacturing a divergence
    that does not exist. Also stops at the enclosing function boundary.
    """
    out = {}
    for n in range(upto - 1, max(-1, upto - 400), -1):
        line = lines[n]
        m = re.match(r'\s*const\s+([A-Za-z_]\w*)\s*=\s*(.+?);\s*$', line)
        if m and m.group(1) not in out:
            out[m.group(1)] = m.group(2)
        if _BOUNDARY.match(line):
            break
    return out


# Scope markers and helpers — these identify WHICH row, not how a value is
# derived. Inlining them destroys the attr-access pattern normalise() matches
# and manufactures false divergence between sites.
OPAQUE = {"p", "id", "S", "prefix", "rowId", "v", "sv", "rows", "eventInfo",
          "values", "attrs", "idx", "i", "n"}


def inline(expr, binds, depth=0):
    """Recursively substitute local names until only g()/G()/literals remain."""
    if depth > 12:
        return expr
    changed = False

    def sub(m):
        nonlocal changed
        name = m.group(0)
        if name in OPAQUE:
            return name
        if name in binds:
            changed = True
            return "(" + binds[name] + ")"
        return name

    new = re.sub(r'(?<![.\w"])[A-Za-z_]\w*(?!\s*\()', sub, expr)
    return inline(new, binds, depth + 1) if changed else new


def main():
    raw = open(HTML, "rb").read().decode("utf-8", "replace")
    js = re.search(r'<script type="text/worker">(.*?)</script>', raw, re.S).group(1)
    lines = js.split("\r\n")

    sites = []
    converted = 0
    for i, l in enumerate(lines):
        if (FUNC + "(") not in l or ("function " + FUNC) in l:
            continue
        if ("return " + FUNC + "(") in l:      # the object-form shim
            continue
        m = re.search(FUNC + r'\(([^()]*)\)', l)
        if not m:                            # nested call = already converted
            converted += 1
            continue
        sites.append((i, [a.strip() for a in m.group(1).split(",")]))

    print(f"[{FUNC}] positional call sites: {len(sites)}   converted call sites: {converted}")
    if not sites:
        print("\nNothing to compare — all call sites use deriveWeaponTags.")
        print("This prover is superseded by difftest_tags.js; keep it for the")
        print("next positional collapse (e.g. computeWeaponDice).")
        return 0

    results = defaultdict(lambda: defaultdict(list))
    for idx, (line_no, args) in enumerate(sites, start=1):
        binds = collect_bindings(lines, line_no)
        for pos, arg in enumerate(args):
            if pos >= len(POSITIONS):
                break
            expr = binds.get(arg, arg)
            results[POSITIONS[pos]][normalise(inline(expr, binds))].append(idx)

    diverged, unresolved = [], []
    for name in POSITIONS:
        variants = results[name]
        for expr in variants:
            if re.search(r'(?<![\w.])(?!g\(|G\(|true|false|null|undefined)[A-Za-z_]\w*(?!\s*\()', expr):
                if not re.fullmatch(r'"[^"]*"|\d+|g\([a-z0-9_]+\)', expr.strip()):
                    unresolved.append((name, expr))
        if len(variants) > 1:
            diverged.append((name, variants))
        cover = sorted({s for v in variants.values() for s in v})
        flag = "  <-- DIVERGENT" if len(variants) > 1 else ""
        print(f"\n{name:12s} sites={cover} variants={len(variants)}{flag}")
        for expr, who in variants.items():
            print(f"    {who}: {expr[:150]}")

    print("\n" + "=" * 60)
    if diverged:
        print(f"DIVERGENCE in {len(diverged)} position(s): {[d[0] for d in diverged]}")
        print("Adjudicate before collapsing — one site behaves differently.")
        return 1
    print(f"EQUIVALENT — all {len(POSITIONS)} positions derive identically at all sites.")
    print("Safe to collapse into weaponTagInputs.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
