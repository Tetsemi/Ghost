#!/usr/bin/env python3
"""
Ghost of Arcadia — preset select invariant checker.

Run before delivering any change that touches weaponDataMap, spellDataMap, or
the preset <select> lists. A weapon's (or spell's) preset value is stored in an
attr named after the <select> it appears in, so moving a key between selects
moves it between attribute names and silently orphans every stored value in the
field. This catches that at authoring time, before it can ship.

Checks
  Weapons (7 weapon1 selects + 7 repeating selects)
    W1  every option value exists as a key in weaponDataMap
    W2  every key sits in the select matching weaponDataMap[key].skill
    W3  no key appears in two selects within the same block
    W4  the weapon1 and repeating blocks list identical key sets
    W5  every weaponDataMap key appears in exactly one select
  Spells (10 school selects)
    S1  every option value exists under spellDataMap[<school>]
    S2  every key sits in the select matching its parent school
  Shared
    T1  every <option> carries data-i18n
    T2  every data-i18n key exists in translation.json
    T3  separator options use the select_sep_ prefix

Usage:  python3 validate_presets.py [html] [translation.json]
Exit:   0 = all invariants hold, 1 = at least one violation
"""

import re
import sys

DEFAULT_HTML = "ghost_of_arcadia.html"
DEFAULT_I18N = "translation.json"

# Order is authoritative — must match weaponPresetSlots in the sheet worker.
WEAPON_SLOTS = ["melee", "throw", "handgun", "shotgun", "rifle", "smg", "heavy"]

# Must match weaponPresetSlotBySkill in the sheet worker.
SLOT_BY_SKILL = {
    "firearms_handgun": "handgun",
    "firearms_rifle": "rifle",
    "firearms_shotgun": "shotgun",
    "firearms_smg": "smg",
    "heavy_weapons": "heavy",
    "melee_weapons": "melee",
    "throw": "throw",
}

failures = []


def fail(code, msg):
    failures.append(f"[{code}] {msg}")


def brace_match(seg, start):
    """Return the {...} block beginning at seg[start], honouring nesting."""
    depth = 0
    for i in range(start, len(seg)):
        if seg[i] == "{":
            depth += 1
        elif seg[i] == "}":
            depth -= 1
            if depth == 0:
                return seg[start:i + 1]
    return ""


def top_level_entries(seg):
    """Parse `\\n\\tkey: { ... }` entries with correct brace matching."""
    out = {}
    for m in re.finditer(r"\n\t([a-z0-9_]+):\s*\{", seg):
        out[m.group(1)] = brace_match(seg, m.end() - 1)
    return out


def field(body, name):
    m = re.search(r'%s:\s*"([^"]*)"' % name, body)
    return m.group(1) if m else None


def datamap_segment(raw, name, *end_markers):
    i = raw.find(name + " = {")
    if i < 0:
        i = raw.find("const " + name)
    if i < 0:
        return ""
    ends = [raw.find(mk, i + 10) for mk in end_markers]
    ends = [e for e in ends if e > 0]
    return raw[i:min(ends)] if ends else raw[i:]


def selects(raw, pattern):
    """Return { group: [ (value, i18n_key, disabled) ] } for a select name regex."""
    out = {}
    for m in re.finditer(
        r'<select[^>]*name="%s"[^>]*>(.*?)</select>' % pattern, raw, re.S
    ):
        opts = []
        for o in re.finditer(r"<option\b([^>]*)>", m.group(1)):
            attrs = o.group(1)
            val = re.search(r'value="([^"]*)"', attrs)
            i18n = re.search(r'data-i18n="([^"]*)"', attrs)
            opts.append(
                (
                    val.group(1) if val else None,
                    i18n.group(1) if i18n else None,
                    "disabled" in attrs,
                )
            )
        out[m.group(1) if m.lastindex is None else m.group(0)] = opts
        # re-key by the captured group name
        g = re.search(r'name="%s"' % pattern, m.group(0))
        if g:
            out.pop(list(out.keys())[-1])
            out[g.group(0)] = opts
    return out


def grouped_selects(raw, pattern):
    """Return { captured_group: [ (value, i18n, disabled) ] }."""
    out = {}
    for m in re.finditer(
        r'<select[^>]*name="%s"[^>]*>(.*?)</select>' % pattern, raw, re.S
    ):
        group = m.group(1)
        body = m.group(2)
        opts = []
        for o in re.finditer(r"<option\b([^>]*)>", body):
            attrs = o.group(1)
            val = re.search(r'value="([^"]*)"', attrs)
            i18n = re.search(r'data-i18n="([^"]*)"', attrs)
            opts.append(
                (
                    val.group(1) if val else None,
                    i18n.group(1) if i18n else None,
                    "disabled" in attrs,
                )
            )
        out[group] = opts
    return out


def main():
    html_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_HTML
    i18n_path = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_I18N

    raw = open(html_path, "rb").read().decode("utf-8", "replace")
    i18n_raw = open(i18n_path, "rb").read().decode("utf-8", "replace")
    i18n_keys = set(re.findall(r'^\s*"([^"]+)"\s*:', i18n_raw, re.M))

    # ---------------- weapons ----------------
    wseg = datamap_segment(raw, "weaponDataMap", "\nconst ammoDataMap")
    weapons = top_level_entries(wseg)
    wskill = {k: field(b, "skill") for k, b in weapons.items()}

    blocks = {
        "weapon1": grouped_selects(raw, r"attr_weapon1_mdr_weapon_preset_([a-z]+)"),
        "repeating": grouped_selects(raw, r"attr_weapon_preset_([a-z]+)_mdr"),
    }

    keysets = {}
    for block, sels in blocks.items():
        missing_slots = [s for s in WEAPON_SLOTS if s not in sels]
        if missing_slots:
            fail("W0", f"{block}: missing preset select(s) {missing_slots}")
        seen = {}
        for slot, opts in sels.items():
            for val, i18n, disabled in opts:
                if not val:
                    if not i18n:
                        fail("T1", f"{block}/{slot}: separator option has no data-i18n")
                    elif disabled and not i18n.startswith("select_sep_"):
                        fail(
                            "T3",
                            f"{block}/{slot}: separator uses '{i18n}', expected select_sep_*",
                        )
                    if i18n and i18n not in i18n_keys:
                        fail("T2", f"{block}/{slot}: i18n key '{i18n}' not in translation.json")
                    continue
                if not i18n:
                    fail("T1", f"{block}/{slot}: option '{val}' has no data-i18n")
                elif i18n not in i18n_keys:
                    fail("T2", f"{block}/{slot}: i18n key '{i18n}' not in translation.json")
                if val not in weapons:
                    fail("W1", f"{block}/{slot}: '{val}' is not a weaponDataMap key")
                    continue
                skill = wskill.get(val)
                want = SLOT_BY_SKILL.get(skill)
                if want is None:
                    fail("W2", f"{block}/{slot}: '{val}' has unmapped skill '{skill}'")
                elif want != slot:
                    fail(
                        "W2",
                        f"{block}: '{val}' is in the {slot} select but skill "
                        f"'{skill}' places it in {want}",
                    )
                if val in seen:
                    fail("W3", f"{block}: '{val}' appears in both {seen[val]} and {slot}")
                seen[val] = slot
        keysets[block] = set(seen)

    if len(keysets) == 2:
        a, b = keysets["weapon1"], keysets["repeating"]
        for k in sorted(a - b):
            fail("W4", f"'{k}' is in weapon1 but not in the repeating block")
        for k in sorted(b - a):
            fail("W4", f"'{k}' is in the repeating block but not in weapon1")

    for k in sorted(set(weapons) - keysets.get("repeating", set())):
        fail("W5", f"weaponDataMap key '{k}' appears in no preset select")

    # ---------------- spells ----------------
    sseg = datamap_segment(raw, "spellDataMap", "\nconst ", "\nspellSchool")
    schools = top_level_entries(sseg)
    spell_school = {}
    for school, body in schools.items():
        for m in re.finditer(r"\n\t\t([a-z0-9_]+):\s*\{", body):
            spell_school.setdefault(m.group(1), school)

    if not spell_school:
        fail("S0", "spellDataMap parsed 0 spells — check the segment markers")

    for group, opts in grouped_selects(raw, r"attr_spellpreset_spell_([a-z]+)").items():
        want_school = "magic_" + group
        for val, i18n, disabled in opts:
            if not val:
                continue
            if not i18n:
                fail("T1", f"spell/{group}: option '{val}' has no data-i18n")
            elif i18n not in i18n_keys:
                fail("T2", f"spell/{group}: i18n key '{i18n}' not in translation.json")
            # Spell options store a composite "<school>::<key>" value, which is
            # why the spell selects are already immune to the slot-drift failure
            # the weapon selects have: the school travels with the value.
            if "::" not in val:
                fail("S1", f"spell/{group}: '{val}' is not in <school>::<key> form")
                continue
            declared, key = val.split("::", 1)
            got = spell_school.get(key)
            if got is None:
                fail("S1", f"spell/{group}: '{key}' is not a spellDataMap key")
                continue
            if declared != got:
                fail("S2", f"spell/{group}: '{val}' declares {declared} but lives under {got}")
            if got != want_school:
                fail("S2", f"spell: '{key}' is in the {group} select but lives under {got}")

    # ---------------- duplicate declarations ----------------
    # D1: an attr declared by BOTH a hidden and a visible element, with
    # disagreeing value= defaults, that no worker code ever writes.
    #
    # This is the exact shape of the weaponstrain_mdr bug: Roll20 never commits
    # a hidden input's value= default to the attribute store, so the attr does
    # not exist; the visible twin renders blank; and a repeating row's re-render
    # can propagate the hidden default, making the value appear and vanish.
    #
    # Deliberately narrow. Plain duplication is common and usually harmless
    # (197 instances sheet-wide, nearly all kept in sync by a watcher), so a
    # check that flagged all of them would just be noise.
    html_only = raw[:raw.find('<script type="text/worker">')]
    css_raw = ""
    try:
        css_raw = open("ghost_of_arcadia.css", "rb").read().decode("utf-8", "replace")
    except OSError:
        pass
    js_all = re.search(r'<script type="text/worker">(.*?)</script>', raw, re.S)
    js_all = js_all.group(1) if js_all else ""

    # Attrs written through a computed name — e.g. `[attr]: val` where attr comes
    # from weaponPresetAttrRep/W1 — are invisible to a textual search. Collect the
    # CORE names the generated writers cover so they are not reported as unwritten.
    dynamic_cores = set()
    for m in re.finditer(r'\bcore:\s*"([a-z0-9_]+)"', js_all):
        dynamic_cores.add(m.group(1))
    defaults = re.search(r'const weaponPresetAttrDefaults = \{(.*?)\n\};', js_all, re.S)
    if defaults:
        dynamic_cores |= set(re.findall(r'\n\t([a-z0-9_]+):\s*\{', defaults.group(1)))

    def core_of(a):
        c = a[:-4] if a.endswith("_mdr") else a
        for pre in ("weapon1_mdr_", "weapon1_", "weapon_"):
            if c.startswith(pre):
                return c[len(pre):]
        return c

    def attr_is_written(a):
        if core_of(a) in dynamic_cores:
            return True
        return (bool(re.search(r'["\'`\[]\s*(?:\w+\s*\+\s*)?["\'`]?%s["\'`]?\s*\]?\s*:' % re.escape(a), js_all))
                or bool(re.search(r'\b%s\s*:' % re.escape(a), js_all))
                or bool(re.search(r'%s`\]' % re.escape(a), js_all)))

    dup_scopes = {m.group(1): m.group(2) for m in
                  re.finditer(r'<fieldset class="(repeating_\w+)">(.*?)</fieldset>', html_only, re.S)}
    dup_scopes["(top-level)"] = re.sub(r'<fieldset class="repeating_\w+">.*?</fieldset>', "",
                                       html_only, flags=re.S)

    for scope_name, seg in dup_scopes.items():
        els = {}
        for m in re.finditer(r'<(input|select|textarea)\b([^>]*)name="attr_([a-z0-9_]+)"([^>]*)>', seg):
            a = m.group(3)
            tag_attrs = m.group(2) + m.group(4)
            t = re.search(r'type="(\w+)"', tag_attrs)
            val = re.search(r'value="([^"]*)"', tag_attrs)
            els.setdefault(a, []).append((t.group(1) if t else m.group(1),
                                          val.group(1) if val else None))
        for a, lst in els.items():
            if len(lst) < 2:
                continue
            kinds = {k for k, _ in lst}
            if "hidden" not in kinds or kinds == {"hidden"}:
                continue
            if len({v for _, v in lst}) < 2:
                continue
            if attr_is_written(a):
                continue
            fail("D1", f"{scope_name}: '{a}' declared hidden+visible with differing "
                       f"defaults {lst} and never written by a sheet worker")

    # ---------------- tag layer ----------------
    # T4/T5: weaponTagInputs must stay in lockstep with what buildTagsStr reads.
    # Handles both the positional signature and the post-refactor object form,
    # so this check survives the conversion rather than needing a rewrite.
    js = re.search(r'<script type="text/worker">(.*?)</script>', raw, re.S)
    js = js.group(1) if js else ""
    tbl = re.search(r'const weaponTagInputs = \{(.*?)\n\};', js, re.S)
    if not tbl:
        fail("T4", "weaponTagInputs table not found")
    else:
        keys = set(re.findall(r'\n\t([A-Za-z]\w*):\s*\{', tbl.group(1)))
        # The table is shared by both consumers, so an entry need only be read
        # by one of them — union the reads before comparing.
        all_reads = set()
        for fname in ("buildTagsStr", "computeWeaponDice"):
            sig = re.search(r'function %s\(([^)]*)\)' % fname, js)
            if not sig:
                fail("T4", f"{fname} not found")
                continue
            params = [x.strip() for x in sig.group(1).split(",")]
            body = js[sig.end():sig.end() + 8000]
            if len(params) == 1:
                destr = re.search(r'const \{([^}]*)\}\s*=\s*%s\s*;' % re.escape(params[0]), body)
                reads = ({x.strip() for x in destr.group(1).split(",")} if destr
                         else set(re.findall(r'\b%s\.([A-Za-z]\w*)' % re.escape(params[0]), body)))
            else:
                reads = set(params)
            for k in sorted(reads - keys):
                fail("T4", f"{fname} reads '{k}' but weaponTagInputs has no such entry")
            all_reads |= reads
        for k in sorted(keys - all_reads):
            fail("T5", f"weaponTagInputs declares '{k}' but neither consumer reads it")
        # T6: every attr a tag input needs must resolve to a real core name
        for m in re.finditer(r'attrs:\s*\[([^\]]*)\]', tbl.group(1)):
            for core in re.findall(r'"([a-z0-9_]+)"', m.group(1)):
                if not re.search(r'name="attr_(?:weapon_%s_mdr|weapon%s_mdr)"' % (core, core), raw) \
                   and not re.search(r'weapon_%s_mdr' % core, js):
                    fail("T6", f"weaponTagInputs references core '{core}' with no matching attr")

    # ---------------- weapon mod wiring ----------------
    # M1-M3: weaponModBtnAttr is the only hand-maintained link between
    # weaponModDataMap and the sheet. computeModButtons iterates the LINK table,
    # not the map, so a map entry with no link is silently never consulted, and
    # a link whose attr has no HTML element writes to nothing. Both are silent
    # partial failures of exactly the kind the four-layer talent rule describes.
    link = re.search(r'const weaponModBtnAttr = \{(.*?)\n\};', js_all, re.S)
    modmap = re.search(r'const weaponModDataMap = \{(.*?)\n\};', js_all, re.S)
    if not link:
        fail("M1", "weaponModBtnAttr table not found")
    elif not modmap:
        fail("M1", "weaponModDataMap not found")
    else:
        links = dict(re.findall(r'\n\t([a-z0-9_]+):\s*"([a-z0-9_]+)"', link.group(1)))
        mods = set(re.findall(r'\n\t([a-z0-9_]+):\s*\{', modmap.group(1)))
        for k in sorted(set(links) - mods):
            fail("M1", f"weaponModBtnAttr links '{k}' but weaponModDataMap has no such entry")
        for k in sorted(mods - set(links)):
            fail("M2", f"weaponModDataMap declares '{k}' but weaponModBtnAttr has no link — "
                       f"computeModButtons will never consult it")
        # The apply path writes `prefix + attr`, where prefix is "weapon_" for
        # repeating rows and "weapon1_" for the static block — so the element
        # names are attr_weapon_btn_* and attr_weapon1_btn_*, not the bare attr.
        for k, attr in sorted(links.items()):
            for scope_prefix in ("weapon_", "weapon1_"):
                if not re.search(r'name="attr_%s%s"' % (scope_prefix, re.escape(attr)), html_only):
                    fail("M3", f"'{k}' links to '{attr}' but no element declares "
                               f"attr_{scope_prefix}{attr}")
            # CSS drives button visibility off [value="1"]; without a rule the
            # button never appears no matter what the worker writes.
            if not re.search(r'attr_weapon1?_%s"\]\[value=' % re.escape(attr), css_raw):
                fail("M4", f"'{k}' links to '{attr}' but no CSS [value=] rule targets it")

    # ---------------- report ----------------
    print(f"weaponDataMap keys : {len(weapons)}")
    print(f"spellDataMap spells: {len(spell_school)}")
    print(f"translation keys   : {len(i18n_keys)}")
    print()
    if failures:
        print(f"FAIL — {len(failures)} violation(s):\n")
        for f in failures:
            print("  " + f)
        return 1
    print("PASS — all preset invariants hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
