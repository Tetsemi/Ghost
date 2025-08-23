# Adding a New Race (Khadra) — High‑Level Integration Guide (Roll20 Character Sheet)

This document compiles two parts:
1) A high‑level checklist to add a new race (e.g., **khadra**) using **Alteri** as the template, calling out where and what data to add.
2) The missing piece: adding **Racial Talent** trackers (per‑scene / per‑session) to the **Tracker** section so they mirror your career trackers.

---

## 1) Core Data Maps (in `ghost_of_arcadia.html`)

Add entries for the new race **khadra** in the same structures used by **alteri**.

### a) `raceDataMap` — language label + stat baselines
**What to add:**
```js
raceDataMap.khadra = {
  language: "Khadra",
  stats: {
    str: { base: 0 },
    dex: { base: 0 },
    pow: { base: 0 },
    con: { base: 0 },
    app: { base: 0 },
    edu: { base: 0 },
    siz: { base: 0 },
    int: { base: 0 },
    mag: { base: 0 }
  }
};
```
**Why:** On race change, the sheet sets the race language label and enforces racial base minimums from these `stats.*.base` values.

---

### b) `talentDataMap` — talent metadata per race
**What to add (shape example):**
```js
talentDataMap.khadra = {
  stone_ward:  { tier: 1, name: "Stone Ward",  description: "Brief desc...", cost: 5 },
  dune_reader: { tier: 2, name: "Dune Reader", description: "Brief desc...", cost: 10, prerequisite: "stone_ward" },
  // ...
  bedrock_will: { tier: 5, name: "Bedrock Will", description: "Capstone...", cost: 30, capstone: true }
};
```
**Why:** Talent labels, descriptions, enabling/locking, summaries, and XP logic enumerate this map by race.

---

### c) `talentSkillMap` — which skills each talent affects
**What to add (shape example):**
```js
talentSkillMap.khadra = {
  stone_ward:  { resilience: 10 },               // +10 to a fixed skill
  dune_reader: { insight: 10, survival: 0 },     // multiple skills (example)
  maskwrights_grace: { impersonation: 10 },      // sample pattern
  // If a talent offers a choice, use your existing selector approach (checkbox or show_* flag)
};
```
**Why:** The sheet’s talent–skill handlers aggregate “talent‑affected” skills by race from this object.

---

### d) `backgroundDataMap` — backgrounds per race
**What to add (shape example):**
```js
backgroundDataMap.khadra = {
  sandline_scout: {
    trained_skills: ["navigate", "survival", "perception"],
    // other background metadata as used in your system
  },
  echo_carver: {
    trained_skills: ["insight", "disguise"],
  },
  // ...
};
```
**Why:** Background skill options, locks, and sync logic reference `trained_skills` per race/background.

---

## 2) Watchers & Initialization (already generic)

If you add **khadra** to the maps above, you typically **do not** need new watchers:
- Race change handlers already pick up the currently selected race and run the initialize pipeline (language label, racial base stats, default talent bonuses, recomputes).
- Talent summary/enabling and background talent watchers enumerate races/talents from the maps, so Khadra is auto‑discovered.

---

## 3) UI: HTML Attributes the Watchers Expect

### a) Race picker + container
- Add an option value `"khadra"` to your race control (the one that sets `showracials` / race selector).
- Add a Khadra racials section (e.g., `.sheet-racialsX`) using the same block structure as Alteri.

### b) Background blocks (per Khadra background)
Use Alteri/Draevi blocks as templates. Key attributes:
- Background choice: `name="attr_khadra_background_choice"`
- Background‑granted talents: checkbox `name="attr_bg_khadra_talent"` with `value="khadra_<talent_key>"`
- Hidden lock/flag fields mirroring your existing pattern, e.g. `name="attr_khadra_<talent_key>_from_background" value="0"`

### c) Talent checkboxes (main Khadra talent list)
- Talent toggle checkbox: `name="attr_khadra_<talent_key>"` (value `"1"`)
- Optional skill‑choice/lock controls for talents that expose a skill picker:
  - `name="attr_khadra_<talent_key>_mdr_checkbox"`
  - `name="attr_khadra_<talent_key>_lockflag_skill"`
  - optional visibility flag: `name="attr_show_<talent_key>_bonus"`

---

## 4) CSS: Race Section Visibility

If you create a new `.sheet-racialsN` container, extend (or generalize) the global hide/show rules so the Khadra block displays when the race is selected. Follow the same selectors you used for Alteri/Draevi/Human/Lyranni.

---

## 5) Translations (`translation.json`)

Add i18n keys referenced by your Khadra HTML:
- Race label, language display, background names, talent names, short descriptions, etc.
- Reuse the `data-i18n="..."` + `<span name="..._label"></span>` pattern you already employ.

---

## 6) Defaulting & Recompute

The init path already handles:
- Reset to base skill values (`resetAllMDRToBase`),
- Apply racial baselines (`applyRacialBaseStats` from `raceDataMap.khadra.stats`),
- Apply default talent bonuses (`setDefaultTalentBonuses`),
- Trigger a recompute pass.

Once Khadra is present in the data maps, this flow applies automatically.

---

# 7) Racial Talents in the Tracker (Per‑Scene / Per‑Session)

Mirror your **Career** tracker pattern for any **Khadra** racial talent that has limited uses. Passive talents don’t need tracker rows.

## 7.1 Tracker HTML (two rows per trackable talent)

> Place these in the **Tracker** tab under a “Racial Talents” sub‑section. Put the hidden `show_…` input immediately before its rows. Both rows share a **common class** so one flag reveals both.

```html
<!-- ===================== Racial Talent Trackers (Khadra) ===================== -->

<!-- Example Talent: Stone Ward -->
<input type="hidden" name="attr_show_khadra_stone_ward" value="0" />

<!-- Scene use -->
<div class="sheet-tracker-item sheet-tracker-scene sheet-khadra-stone-ward">
    <input type="checkbox" name="attr_used_scene_khadra_stone_ward" class="sheet-tracker-checkbox" value="1" />
    <span class="sheet-tracker-label">
        <span name="khadra_stone_ward_label"></span>
    </span>
</div>

<!-- Session use -->
<div class="sheet-tracker-item sheet-tracker-session sheet-khadra-stone-ward">
    <input type="checkbox" name="attr_used_session_khadra_stone_ward" class="sheet-tracker-checkbox" value="1" />
    <span class="sheet-tracker-label">
        <span name="khadra_stone_ward_label"></span>
    </span>
</div>
```

**Naming rules:**
- Show flag: `attr_show_khadra_<talentkey>` → controls visibility.
- Scene checkbox: `attr_used_scene_khadra_<talentkey>` (value `"1"`).
- Session checkbox: `attr_used_session_khadra_<talentkey>` (value `"1"`).
- Label span: `name="khadra_<talentkey>_label"` (no `attr_` prefix).

---

## 7.2 CSS (hide by default; show when enabled)

If your tracker already has generic styles (`.sheet-tracker-item`, `.sheet-tracker-scene`, `.sheet-tracker-session`), add only the show/hide rules (and optionally a race tint).

```css
/* Hide by default */
.ui-dialog .tab-content .charsheet .sheet-tracker-item.sheet-khadra-stone-ward { display: none; }

/* Show when talent is enabled */
.ui-dialog .tab-content .charsheet
input[name="attr_show_khadra_stone_ward"][value="1"] ~ .sheet-khadra-stone-ward { display: flex; }

/* Optional Khadra tint */
.ui-dialog .tab-content .charsheet .sheet-tracker-item.sheet-khadra-stone-ward {
  background: rgba(120, 180, 160, 0.10);
  border-left: 3px solid rgba(120, 180, 160, 0.6);
}
```

> If you use a more generic “show by flag” rule, keep using that—just ensure both rows share the same class and live after the corresponding `attr_show_…` input.

---

## 7.3 Sheetworker Touchpoint

Your enable logic (e.g., `updateTalentEnables`) should set the flag to reveal tracker rows when the talent is learned and clear it when unlearned:

```js
// When enabling:
update["show_khadra_stone_ward"] = "1";
// When disabling:
update["show_khadra_stone_ward"] = "0";
update["used_scene_khadra_stone_ward"] = "0";
update["used_session_khadra_stone_ward"] = "0";
```

If your logic already enumerates races from `talentDataMap`, adding the Khadra talents there is sufficient—no additional watcher wiring is needed.

---

## 7.4 Translations / Labels

Populate the label span (no `attr_` prefix) from your talent data or i18n:

```js
setAttrs({ khadra_stone_ward_label: getTranslationByKey("khadra_stone_ward-u") || "Stone Ward" });
```

Add the string(s) to `translation.json` if you localize.

---

## 7.5 Quick Checklist (Tracker Add‑On)

- [ ] For each **trackable** Khadra talent: add **one** `attr_show_khadra_<key>` hidden input.
- [ ] Add **two** tracker rows (scene + session) sharing a class like `.sheet-khadra-<key>`.
- [ ] CSS: hide by default; show when `show_…` = 1; (optional) apply race tint.
- [ ] Sheetworker: set/clear `show_khadra_<key>` and zero out `used_*` on disable.
- [ ] Label: set `khadra_<key>_label` from data/i18n.

---

## Final “Diff” Summary for Adding **Khadra**

1. **Data**: add `raceDataMap.khadra`, `talentDataMap.khadra`, `talentSkillMap.khadra`, `backgroundDataMap.khadra`.
2. **HTML**: race option + `.sheet-racialsX` section; background/talent controls using Khadra‑prefixed attribute names.
3. **CSS**: extend race visibility rules; add optional tracker tint styles.
4. **Translations**: insert the i18n keys referenced by the Khadra UI.
5. **Tracker**: for trackable racial talents, add the hidden `show_…` flag + scene/session rows + show/hide rules.

Once those are in place, the existing race/talent/background initialization and watchers will pick up **Khadra** automatically.
