# Ghost of Arcadia — Character Sheet UI Framework

**Derived from** `ghost_of_arcadia.html` (uploaded 2026-08-17, 4,466,716 bytes), `ghost_of_arcadia.css`, `translation.json`.
All line numbers refer to that upload and to the **markup** portion of the file (lines 1–40,476); the sheet worker begins at byte 3,020,186.

This document has two jobs. Sections 0–3 are a **map** — what exists, where it lives, and what drives it. Sections 4–7 are **analysis** — where the same subject is spread across tabs, where a shape is duplicated, and where presentation could carry more meaning. Every item in 4–7 is a proposal for author decision, not a change already made.

---

## 0. Global shell

| Element | Line | Attr | Notes |
|---|---|---|---|
| Theme controller (pre-meta) | 1–5 | `attr_theme` | Placed before the meta row so themes apply to both |
| Sheet version | 7–11 | `attr_sheet_version`, `attr_sheet_version_display` | |
| Theme picker + version row | 13–34 | `attr_theme_mode` | Radio: Dark / Light / Cyberpunk (default) / Ancestry |
| Edit-mode controller | 37–38 | `attr_edit_mode` | Hidden `on`/`off`; drives 22 per-attribute edit rules at specificity (0,8,1) |
| Sheet width | — | `--cs_sheet_width: 840px` | Hard ceiling for every column layout |

**Scale of the markup surface**

| Measure | Count |
|---|---|
| Distinct `attr_*` names in markup | 6,675 |
| Repeating fieldset instances | 64 |
| Collapsible section headers | 39 |
| Roll buttons | 211 |
| Action buttons | 229 |
| Roll templates | 17 |
| Talent/perk/flaw checkbox rows | 856 (160 ancestry + 630 career + 19 perk + 15 flaw + 32 ancestry traits) |
| Tracker checkbox items | 719 (351 scene, 368 session) |

Three macro regions: `.sheet-top` (41–331), `.sheet-middle` (333–405), `.sheet-bottom` (407–35,150).

---

## 1. Top Section — `.sheet-top` (lines 41–331)

Always visible. Two rows.

### 1.1 Row 1a — Ghost Info (`.sheet-top-2col`, left half, 44–87)

Single collapse checkbox `attr_top_collapse` governs **both** halves of this row.

| Field | Attr | Type |
|---|---|---|
| Player | `attr_player` | text |
| Real Name | `attr_name` | text — referenced by five roll formulas; label only was renamed |
| Ghost Name | `attr_ghost_name` | text |
| Occupation | `attr_occupation` | text |
| Age / Sex | `attr_age`, `attr_sex` | text |
| **Mundane / Awakened** | `attr_awakened` | checkbox styled as a two-label toggle |
| Residence | `attr_residence` | text |
| Birthplace | `attr_birthplace` | text |
| Career | `attr_career` | **free text** |
| Other | `attr_other` | text |

### 1.2 Row 1b — Characteristics (right half, 89–267)

Grid of 3 rows × (3 attributes + divider + a pool), then a lower strip.

- **Eight core attributes** — `str dex pow con edu siz int app`. Each is a wrapper carrying two hidden CSS flags (`attr_X_below_min_css`, `attr_X_over_max_css`), a value input, and an invisible full-cell roll button.
- **Pools** — Vitality (`attr_vitality` / `attr_vitality_max`), Strain (`attr_strain` / `attr_strain_max`, plus `attr_strained_css`), HP (`attr_hp` / `attr_pulphp_max`, plus `attr_bloodied_css`).
- **Attribute Mode block** (143–168) — mutually exclusive pairs gated by `attr_show_awakened_mode`: Mundane = Focused / Balanced; Awakened = Physical / Aptitude.
- **Lower strip** (231–266) — Build (readonly), Move rate + chase-initiative roll, **Arc. Cap.** (`attr_ac`, readonly), Init (mirrors `attr_dex`, fires `!initdex` API), Luck.

### 1.3 Row 2 — four-column strip (272–330)

| Column | Content |
|---|---|
| Ancestry | `attr_showracials` select, 8 ancestries + placeholder. Doubles as the CSS controller for the entire Ancestry tab and the Tracker's ancestry rows |
| Damage Bonus | `attr_damage_bonus` select, −2 … +10d6 |
| Spenders | AS (physical) `attr_total_phys_attr_points_spent`, AS (aptitude) `attr_total_apt_attr_points_spent`, SPS `attr_total_skill_points_spent`, plus two budget-state mirrors |
| Edit Mode | `act_edit_mode` action button |

---

## 2. Middle Section — `.sheet-middle` (lines 333–405)

Four columns in one row (`.sheet-middle-3col`, despite the name).

| Block | Line | Contents |
|---|---|---|
| Dice Rolls | 337–355 | 1D3/4/5/6/7/8/10/12/20, Hit Loc. (`coc-body-hit-loc`), custom expression `attr_dice_roll` |
| Dice Modifiers | 357–371 | ±10 / ±20 target-number action buttons writing `attr_dice_modifier_checkbox` and `attr_dice_modifier_manual` |
| Wounds | 373–393 | Major Wounds (readonly count + toggle), Unconscious, Dying |
| Statuses | 395–403 | Four free-text slots `attr_status1..4` |

---

## 3. Bottom Section — `.sheet-bottom` (lines 407–35,150)

### 3.0 Tab machinery

| Element | Line | Attr |
|---|---|---|
| Tab controller | 411 | `attr_selected_tab` (default `skills`) |
| Creation lock | 414 | `attr_char_creation_lock` — hidden mirror of the Ledger checkbox; gates XP/skill editing |
| Awakened gate | 417 | `attr_awakened_css` — hides the Spells tab button for Mundane characters |

**19 tabs in three button rows** (420–444):

- Row 1 — Skills, Ancestry, Background, Careers, Summary Text, Summary Type, Tracker, Ledger
- Row 2 — Combat, Spells, Cybertech, Gear, Inventory, Backstory, Lifestyle, Vehicles
- Row 3 — Perks, Flaws, NPCs

Row 1 is broadly *character construction*, Row 2 *play and possessions*, Row 3 an unlabelled remainder. That grouping is close to meaningful but not stated anywhere, and Perks/Flaws are construction items sitting in Row 3 while Summary Text/Type are reference readouts sitting in Row 1.

---

### 3.1 Skills — lines 447–2,348 (1,902)

**Structure:** three `.sheet-skill-column`s holding fourteen groups, then a summary band.

Groups, in render order: Combat · Language · Magic · Perform · Physical · Pilot · Science/Knowledge · Etiquette (Ancestries) · Etiquette (General) · Social · Survival · Tech/Cyber · Tradecraft · Other.

**Row shape** (4 cells): Trained checkbox `attr_X_mdr_checkbox` · label with improved-indicator + tooltip bubble · SP input `attr_X_skill_mdr` (`.skill-input`) · value + invisible roll button `attr_X_mdr` (`.sheet-skill-input`, readonly).

- 114 fixed rows, of which 13 are free `otherskillN` slots and 101 are named skills.
- `repeating_skillsmdr` at 2,301 — a further free-form skill list, using a *different* row shape.
- **Summary band** (2,315–2,344): five readonly spans — Ancestry Traits, Perk, Flaw, Ancestry Talents, Career Talents skill summaries.

**Workflow notes**

- **The Magic group (10 skills) is the roll surface for the Spells tab.** A caster reads spell rows on one tab and the governing skill on another. A compact "your Magic skills" strip at the top of Spells would remove the round trip.
- The summary band is the only place on the sheet that answers *"why is this skill at this number?"*, but it sits 1,900 lines below the skills and renders as five untargeted text blobs. Making the improved-indicator on each row a tooltip carrying that row's own contributions would put the answer where the question is asked.
- Free slots are inconsistent: Etiquette (Ancestries) has none, Perform and Tradecraft **share** `otherskill11` (see §7.1), and `repeating_skillsmdr` provides unlimited slots anyway. Either the fixed free slots or the repeating section is redundant.

---

### 3.2 Ancestry — lines 2,349–5,329 (2,981)

Eight parallel blocks, one per ancestry, shown by `attr_showracials`.

Each block = **Senses & Ancestral Traits** (4 traits, 32 total, `racial_<ancestry>_<key>`) + **four tier headers** (10/20/30/40 XP, tier 4 = Capstone) each holding 5 talent rows. 160 talent rows total, each with `attr_<race>_<key>` checkbox, `_lockflag` hidden input, label, description, and prerequisite spans.

**Workflow notes**

- Selecting a talent here and *using* it in play (Tracker) are 20,000 lines apart with no link in either direction.
- Tiers 2–4 are collapsed behind toggles; tier 1 is not. Consistent default state (all collapsed, or remember state) would reduce scroll.
- Prerequisites are rendered as text spans; the lock state is enforced in JS. A visual prereq line (arrow, indent, or a "requires X" chip that lights when satisfied) would make the tree legible as a tree.

---

### 3.3 Background — lines 5,330–7,095 (1,766)

`attr_background_locked_choice` select (13 backgrounds) + `attr_background_choice` CSS controller + 13 action buttons + 13 blocks. Each block: a named feature with description, then Trained-skill columns (e.g. "5 of 7") with per-skill `attr_bg_<skill>_mdr_checkbox` and `_lock`.

**Workflow notes** — this tab uses **both** a select and a button row for the same navigation, which is a pattern worth standardising across Background / Careers / Ancestry (Ancestry uses a select in the top section; Careers uses both).

---

### 3.4 Careers — lines 7,096–20,711 (13,616 — the largest tab)

**Header grid** (7,108–7,214): columns Career · Starting Skill Points · Skill→XP · Career XP Spent · Career XP Total · Total Spell XP · Primary Arcane Career. One primary row (`attr_primary_career`, `attr_primary_arcane_career`) plus `repeating_secondarycareer` rows.

**Career detail** — three button rows (9 Arcane, 15 Core, 4 Specialist) and **28 career blocks**, each with:

- `attr_<career>_ready` controller and a locked overlay showing `attr_<career>_prereq_text`
- collapsible **Career Skills** panel — Primary Skills / Secondary Skills, each a checkbox list with `_lock` mirrors
- **five talent tiers** (5/10/15/20/30 XP, tier 5 = Capstone). 630 career talent rows sheet-wide.

**Workflow notes**

- The header grid is the only cross-career view. It carries five numeric columns per row but not the one a player checks most — remaining XP — which lives on the Ledger.
- 28 blocks are reachable only through a 28-button strip. A "show only my careers" filter driven by the already-existing `_ready` controllers would collapse the strip to 1–3 buttons in normal play, with a "browse all" toggle for shopping.
- Specialist careers have no `skill_points_secondary` bundle and already render N/A; that N/A appears in the grid but the *reason* does not.

---

### 3.5 Combat — lines 20,712–22,505 (1,794)

| Block | Line | Contents |
|---|---|---|
| Dodge quick-roll | 20,714 | `sheet-val-roll-static` |
| **Armor** | 20,723 | Armor totals strip, `repeating_armorsmdr` (preset), `repeating_armormanual` |
| **Weapons** | 20,896 | Column header, Unarmed default row, **fixed Weapon 1** (20,957–21,391), `repeating_weaponsmdr`, `repeating_weaponmanual` |
| **Grenades & Explosives** | 22,113 | `repeating_grenadesmdr`, `repeating_grenademanual` |
| **OmniDecks** | 22,405 | `repeating_omnidecksmdr` |
| **Programs** | 22,470 | `repeating_programsmdr` |

**Weapon row columns:** Name · R(arity) · I(mpale) · Skill · Val+roll · Dam · DB · Range · Attacks · Cap · Malf · Contested · Strain · ▼

**Weapon advanced drawer:** six preset selects by skill class; a summary strip (Active Tags, Bonus / Net Penalty / Net Roll, Dice Bonus / Penalty / Net, Ammo Type, Range Band, Traits); and six button families — Mode, Loadout, Ammo Type, Range Band, Optics, Barrel, Internal.

**Workflow notes**

- **Weapon 1 is 435 lines of static markup duplicating the repeating row.** Every feature since has needed parity work in both scopes, and the project history records several defects that existed only in one. It is the single largest structural liability in the tab.
- Armor sits here; Clothing & Streetwear (which also has an Equipped flag and contributes protection-adjacent effects) sits on Gear. A player asking "what am I wearing?" checks two tabs.
- The advanced drawer is the densest part of the sheet and is per-row; with three weapons open, the tab is unreadable. A single "active weapon" detail pane below a compact row list would trade a scroll for a click.

---

### 3.6 Spells — lines 22,506–23,211 (706)

- **Spell Tracker** (22,507): Strain current/max, Prep spell cost, Arcane Capacity, Primary/Secondary career XP, XP→Spells, Spell XP spent/remaining.
- **Spell Reactions** (22,557): generated summary — Name · Reflexive · Damage · Strain.
- **Spells** (22,580): `repeating_spellpreset` (18 fields incl. AC cost, cast time, duration, damage type, soak ignore, XP cost, rarity) and `repeating_spellsmdr` (manual, near-identical field set).

**Workflow notes**

- Strain and Arcane Capacity are *mirrored* here from the top section — correct, and one of the few places the sheet already does this well. It is the model for the Careers/Ledger XP duplication.
- Preset and manual spell rows have nearly the same fields; the manual row swaps `spell_damage_type` for `spell_element`. That divergence is invisible to a player and worth reconciling.

---

### 3.7 Tracker — lines 23,212–29,394 (6,183 — second largest)

- **Stim Tracker** (23,214): Health Meter (5 checkboxes) and Strain Meter (3 checkboxes).
- **Death Save** (23,270): CON roll without penalty.
- **Rest** (23,281): Brief Catch / Short Rest / Extended Rest / Full Rest; a Long Rest group for long-rest-limited talents.
- **Talent Tracker** (23,323): two columns — Scene-Limited (351 items, `act_clear_scene_uses`) and Session-Limited (368 items) — each grouped Perks · Flaws · Ancestry Traits · Ancestry Talents · Backgrounds · Career Talents · Other Tracking, and ending in `repeating_scene` / `repeating_session` free rows.

**Workflow notes**

- **The Health and Strain meters are not connected to `attr_hp` or `attr_strain`.** They are bare checkboxes with no worker logic; `show_health_meter` / `show_strain_meter` are hardcoded to `"1"` and never written. The player maintains two representations of the same state, and the meters' granularity (5 and 3) matches no formula on the sheet. This is either an unfinished feature or a vestige — worth an explicit ruling either way.
- Every tracker row is enumerated in HTML *and* in a per-talent CSS visibility rule. This is the highest-cost layer to extend and the one where a missing CSS line fails silently.
- The tracker is where a talent is actually *used*, but it shows only a name — no rules text, no strain cost, no action economy. Those exist on Summary Type, one tab away.

---

### 3.8 Ledger — lines 29,395–29,556 (162)

- **Creation lock** checkbox (`attr_char_creation_lock`).
- **Skill Point Tracker**: primary/secondary career SP, Sec. Career Skill→XP, personal SP, spent, XP→SP, XP→SP (roll), Perk→Linguist, remaining.
- **XP Point Tracker**: Background XP start (forced to 30), gained, ancestry talent spent, career talent spent, specialist spent, XP→Spells, XP→SP, XP→SP (roll), XP→Credits, XP→Allies, XP→Rep, XP→Factions, XP→Flaws (gain), XP→Perks, **XP Pool Remaining**.
- **Ledger** (`repeating_ledger`): Choice select (9 XP options) · Value · SP Gain · Description.

**Workflow notes**

- This is the sheet's accounting core and it is 162 lines — one of the smallest tabs and the most information-dense. It deserves more room, not less.
- **Four ledger destinations have no home UI**: XP→Credits, XP→Allies, XP→Reputation, XP→Factions. Credits land in the Inventory money block only by hand; Allies partly overlap Backstory contacts; Reputation and Factions exist nowhere else on the sheet.

---

### 3.9 Summary Text — lines 29,557–29,627 (71)

Five collapsible readonly spans: Chosen Perks · Chosen Flaws · Ancestry Talents · Primary Career Talents · Secondary Career Talents. Grouped **by source**.

### 3.10 Summary Type — lines 29,628–29,854 (227)

Nine collapsible readonly spans grouped **by action economy**: Reaction · Special Immediate · Special · Action · Maneuver · Free Action · Active · Passive · Downtime Creation. Each has a `?` drawer holding the rules text for that type.

**Workflow notes** — these two tabs render *the same underlying set of selected talents* under two different groupings. They are the clearest consolidation candidate on the sheet: one tab, one "group by: Source | Type" control. The `?` drawer pattern from Summary Type should survive the merge; the per-source split becomes a filter rather than a tab.

---

### 3.11 Cybertech — lines 29,855–30,854 (1,000)

Totals strip: Vitality totals, Neuralware slot totals. Then seven collapsible sections:

| Section | Storage | Columns |
|---|---|---|
| Cosmeticware | `repeating_cosmeticware` | Name · Cost · Rarity |
| Neuralware | `repeating_neuralware` | Name · Vitality · Slots · Rarity · Cost (+ prerequisites, stat bonus) |
| Cyber Optics | static, 8 mod slots | Name · Vitality · Capacity · … |
| Cyber Audio | static, 8 mod slots | as Optics |
| Internal | `repeating_internal` | |
| Cyberlimbs | `repeating_cyberlimbs` | with 8 mod slots per limb |
| Tech/Cyber | `repeating_ct` | |

**Workflow notes**

- Optics and Audio are static blocks while every other category is repeating — the same static/repeating asymmetry as Weapon 1, with the same parity-maintenance cost (documented separately: the mod-slot equipped checkbox is a recurring debugging trap).
- Cyberware load drives **Arcane Capacity**, which is displayed in the top strip and on the Spells tab, but nothing on this tab states that relationship. A one-line "POW − Load = AC" readout in the totals strip would close the loop.

---

### 3.12 Gear — lines 30,855–32,817 (1,963)

**Fifteen collapsible sections, thirty repeating fieldsets** (a `…gear` preset table and a `…manual` table for each):

Clothing & Streetwear · Omni Devices · Disguise & Identity · Lockpicks & Bypass · Communications & Signal · Surveillance · Arcane Supplies · Medtech · Strain Compounds · Pharmaceuticals & Street Narcotics · General Utility · Survival Kits · Entertainment & Software · Bots & Autonomous Units · Drones & Deployables.

**Twelve of fifteen use an identical column set**: Name · Rarity · Equipped · Quantity · Effect (tooltip preview + bubble). Three differ:

| Section | Extra columns |
|---|---|
| Medtech | Uses · Used · Roll Req · Bonus · Other · Use |
| Strain Compounds | Restore · Daily Limit · Used Today · Other · Use |
| Pharmaceuticals | Use |

**Workflow notes**

- **No gear section has a Cost column**, though every gear DataMap prices its entries and the Ledger tracks XP→Credits. Purchases cannot be reconciled against Cash.
- Twelve identical tables × 2 (preset/manual) = 24 fieldsets that differ only in which DataMap fills the select. This is the single largest consolidation opportunity in the sheet.
- Bots and Drones are deployable units with no stat block here, while Vehicles (own tab) and Companions (NPCs tab) both have full stat blocks. A drone is closer to a vehicle than to a coat.

---

### 3.13 Inventory — lines 32,818–32,986 (169)

- **Cash and Assets**: Spending Level · Cash · Assets.
- **Items w/Applications** (`repeating_inventory-item-appl`): Name · Qty · Uses · Used · Uses/Scene · Used/Scene · Uses/Session · Used/Session · Short Description.
- **Items** (`repeating_inventory-item`): Name · Qty · Short Description · Properties.
- **Money Ledger** (`repeating_moneyledger`): Choice · Credit · Debit · Description · Running Total.

**Workflow notes**

- Inventory and Gear are two answers to one question. Gear holds the DataMap-backed catalogue with Equipped flags; Inventory holds free-text possessions and the money trail. The boundary is not stated in the UI.
- "Items w/Applications" duplicates the scene/session use-tracking that the Tracker tab already does for talents, with a third tracking idiom (paired uses/used counters rather than checkboxes).

---

### 3.14 Backstory — lines 32,987–33,077 (91)

- **Contacts and Allies** (`repeating_contacts`): Type · Name · Cost · Level · Description.
- **Backstory** free-text blocks: Personal Description · Ideology/Beliefs · Significant People · Meaningful Locations · Treasured Possessions · Traits · Injuries & Scars · Phobias & Manias · Tomes, Spells & Artifacts · Encounters with Strange Entities.

**Workflow notes**

- The last three blocks are Call of Cthulhu vestiges. "Phobias & Manias" has no GoA mechanic; "Tomes, Spells & Artifacts" overlaps the Spells tab; "Encounters with Strange Entities" has no GoA referent. Renaming or retiring them is cheap and removes a source of confusion at the table.
- Contacts carry a **Cost** column that pairs with the Ledger's XP→Allies line, but the two are not linked, and there is no Debt structure (a known unbuilt feature — Core Rules Ch. 4 Step 11).

---

### 3.15 Lifestyle — lines 33,078–33,972 (895)

| Section | Contents |
|---|---|
| Primary Residence | Tier · Zone · District (cascading select, 8 zone-scoped selects) · Size · Monthly Cost · Split · Slots · District Note |
| Security Add-Ons | Basic / Enhanced / Private, each Cost + DT modifier |
| Safehouses (`repeating_safehouses`) | Name · Zone · District · Tier · Size · Slots · Split · Cost |
| Features (`repeating_lifestylefeatures`) | Installed · Location · Feature · Training Skill · Slots · Cost · Upkeep |
| Amenities (`repeating_lifestyleamenities`) | Installed · Location · Amenity · Slots · Cost · Upkeep |
| Downtime & Budget Summary | DT: tier / district / security / total; Budget: residence / safehouses / security / feature upkeep / monthly total |

**Workflow notes** — the best-designed tab on the sheet: cascading selects, a per-row location control, and a summary that names its own inputs. **It is the model the Gear tab should follow.** Its one gap is that the monthly total does not reach the Inventory cash trail.

---

### 3.16 Vehicles — lines 33,973–34,482 (510)

Three collapsible sections, each preset+manual:

- **Vehicles**: Name · Rarity · HP tracker · DR · Defense · Speed · Handling · Crew · Hardpoints · Mod Slots · Condition · Skill Val · Gunnery Val; drawer with VS, Skill, Impact Attack, Notes.
- **Vehicle-Mounted Weapons**: Name · Rarity · Skill · Damage · Mode · Mount · Shots · Target · Traits.
- **Vehicle Modifications**: Name · Rarity · Category · Mod Slots · Effect.

**Workflow notes** — Hardpoints and Mod Slots are shown as vehicle capacities, but the weapons and mods that consume them are in sibling tables with no per-vehicle association and no consumed/total readout. Same class of gap the Cybertech capacity totals already solve.

---

### 3.17 Perks — lines 34,483–34,700 (218) / 3.18 Flaws — 34,701–34,872 (172)

Flat lists in cost groups (Perks: 13 × 10 XP, 6 × 15 XP. Flaws: 7 × 5 XP, 8 × 10 XP). Row shape: `_lockflag` hidden · checkbox · label · flavor span · description span. Group-level `attr_perk10_slots_full` / `attr_flaw5_slots_full` controllers.

**Workflow notes** — these are the only two tabs whose rows carry their rules text inline. They are also the shortest tabs. They belong beside Ancestry and Careers in the construction flow rather than in the Row-3 remainder, and could reasonably be one tab with two sections given their combined selection cap.

---

### 3.19 NPCs — lines 34,873–35,150 (278)

`repeating_minion` — "Companions and Mounts". Per companion: Information (Name, HP|Strain, Wounds, MOV, DB, Dodge, Athletics, Armor) · Statuses · Talents · Attributes (all eight) · Skills · Initiative · Move · Weapons table (Name · Skill · Skill Value · Dmg · Max Dmg · Malf · Strain · No-Imp Roll · Imp Roll).

**Workflow notes** — a full second character sheet in miniature, structurally unrelated to Backstory's contacts even though a purchased Ally may need exactly this.

---

## 4. Cross-cutting observations

### 4.1 One subject, many tabs

| Subject | Where it lives | Cost to the player |
|---|---|---|
| **A talent** | Selected on Ancestry / Careers / Perks / Flaws → skill effect on Skills → used on Tracker → rules text on Summary Text **and** Summary Type | Five tabs to run one ability. The tab that shows the rules is not the tab with the checkbox that spends the use |
| **XP** | Ledger (authoritative) · Careers header grid (per career) · Spells tracker (spell XP) · Spenders box (not shown) | Three partial views, no single "XP remaining" in persistent chrome |
| **Skill points** | Ledger · Spenders box (SPS only) · Skills rows (SP per skill) · Careers (bundle) · Background (trained picks) | Five |
| **Credits** | Inventory (Cash/Assets/Money Ledger) · Lifestyle (monthly budget) · Cybertech (cost) · Vehicles (cost) · Ledger (XP→Credits) · Gear (**no cost at all**) | Nothing reconciles |
| **Strain** | Top strip · Spells tracker · Tracker meters (unlinked) · Gear Strain Compounds · weapon rows · spell rows | Four displays, one of which is decoupled |
| **People** | Backstory contacts · NPCs companions · Ledger XP→Allies | Three |
| **Worn/carried protection** | Combat armor · Gear clothing | Two |
| **Deployables** | Gear bots/drones (no stats) · Vehicles (stats) · NPCs (stats) | Three idioms |

### 4.2 Duplicated row shapes

- **Preset/manual twin pattern**: 15 pairs in Gear, 3 in Vehicles, 3 in Combat (armor, weapons, grenades) = **21 duplicated table definitions**, each with its own column header, CSS block, and watcher set. The functional difference is only whether a select fills the fields.
- **Static/repeating twin pattern**: Weapon 1 vs `repeating_weaponsmdr`; Cyber Optics and Cyber Audio vs the repeating cyberware sections. Same data, two markup shapes, permanent parity obligation.
- **Twelve identical gear tables** differing only in DataMap.

### 4.3 Tracking idioms

The sheet tracks limited-use resources four different ways: talent checkboxes with per-item CSS (Tracker), uses/used counter pairs (Inventory items w/applications), daily-limit counters (Strain Compounds), and per-row use buttons (Medtech, Pharmaceuticals). A player learns four interaction patterns for one concept.

### 4.4 Navigation

19 tabs in 3 rows, 3 of which (Summary Text, Summary Type, Ledger) are pure readouts and 4 of which (Ancestry, Background, Careers, Perks/Flaws) are used almost exclusively during creation. In a play session, roughly six tabs matter: Skills, Combat, Spells, Tracker, Gear, Inventory. Nothing in the UI expresses that.

---

## 5. Consolidation candidates, ranked

Ranked by (value to the player) ÷ (risk of attr churn). Roll20 attr renames need migrations per the established pattern; candidates that avoid renames are cheaper.

| # | Change | Effect | Attr risk |
|---|---|---|---|
| 1 | **Merge Summary Text + Summary Type into one tab** with a Source/Type grouping toggle | −1 tab; one place for "what do my abilities do" | **None** — both are readonly spans; the merge is layout + one controller |
| 2 | **Collapse the 12 uniform Gear sections into one table** with a per-row Category select driving the preset list (the Lifestyle zone→district and weapon skill→preset cascades are the working precedent) | 24 fieldsets → 2; one place to look for any item | **High** — every gear row's attrs move section. Needs a reconciler; do it as its own commit |
| 3 | **Add a Cost column to Gear and a purchases line to the Money Ledger** | Closes the credits loop | Low — additive |
| 4 | **Put XP Remaining and Skill Points Remaining in the top Spenders box** | The two numbers most often checked become always-visible | Low — mirror writes only |
| 5 | **Fold Perks and Flaws into one tab** (two sections, shared cap display) | −1 tab; the selection cap is joint in the rules | None — layout only |
| 6 | **Give tracker rows their rules text** via the Summary Type `?` drawer pattern, or link each row to its source | Removes the most common cross-tab hop in play | Low — reuses an existing pattern |
| 7 | **Merge Backstory contacts and NPCs into one "Contacts & Crew" tab**, light rows promoting to stat blocks | −1 tab; XP→Allies gets a home | Medium — `repeating_contacts` and `repeating_minion` stay separate sections, so no attr moves if they simply share a tab |
| 8 | **Retire Weapon 1 in favour of a pinned repeating row** | Removes an entire class of parity defect | **High** — 50+ attrs, needs migration. Author call |
| 9 | **Retire the preset/manual split** by adding a "Custom" option at the top of each preset select | Halves 21 table definitions | High — same class as #2 |
| 10 | **Move Bots and Drones from Gear to Vehicles** (or a "Deployables" section there) | Puts statted units together | Medium |

---

## 6. Presentation improvements

**Sheet-wide**

- **State the tab groups.** Three unlabelled button rows currently sort tabs by accident. Labelling them (Build / Play / Reference) or reordering to match — Row 1 build, Row 2 play, Row 3 reference — costs nothing and orients a new player immediately.
- **Standardise the section-navigation idiom.** Ancestry uses a top-section select; Background uses a select *and* a button row; Careers uses a select *and* three button rows. Pick one.
- **Collapse state should be uniform.** Ancestry tier 1 is open while 2–4 are closed; Gear sections default open; Combat sections default open. With 39 collapsibles the default matters.
- **Density.** At 840px with 13-column weapon rows and 9-column vehicle rows, several tables are at their limit. Where a column is a flag rather than a value (Impale, Equipped, Installed), an icon column recovers width.

**Per tab**

- *Skills* — move the five summary blobs into per-row tooltips on the improved-indicator; resolve the free-slot inconsistency (§7.1).
- *Ancestry / Careers* — render prerequisites as structure rather than prose; filter the career strip to selected careers by default.
- *Combat* — single active-weapon detail pane instead of per-row drawers; surface the Malf/Cap state more prominently than the trait list.
- *Spells* — add a Magic-skills strip; reconcile the preset/manual field divergence (`damage_type` vs `element`).
- *Tracker* — link or retire the Health/Strain meters; add rules text to rows.
- *Ledger* — give it more room; add the four orphan destinations (Credits, Allies, Reputation, Factions) somewhere real.
- *Cybertech* — show `POW − Load = AC` in the totals strip.
- *Vehicles* — hardpoints/mod slots consumed vs total, per vehicle.
- *Backstory* — retire or rename the three CoC-vestige blocks.
- *Lifestyle* — no changes proposed; use it as the reference pattern.

---

## 7. Defects surfaced while mapping

Each of these is a finding, not a change.

### 7.1 `otherskill11` is declared twice, as two visible rows

| Line | Group |
|---|---|
| 975 | Perform |
| 2,276 | Tradecraft |

Both are complete rows — checkbox `attr_otherskill11_mdr_checkbox`, name input, `attr_otherskill11_skill_mdr`, `attr_otherskill11_mdr`, and a roll button. Two visible rows sharing one attr set means **typing a custom skill into Perform makes it appear in Tradecraft**, and the SP spent shows in both. The numbering also has no `otherskill13`, so the free-slot series is 1–12 with 11 used twice.

This is not the `D1` hidden+visible duplicate class and would not be caught by the existing validator, which requires a hidden twin with a disagreeing default. A separate check — *no attr name appears on more than one visible input outside a repeating section* — would catch it. Also note Etiquette (Ancestries) has no free slot at all, so the correct fix is likely a new `otherskill13` for Tradecraft plus a decision about whether the fixed free slots are still needed now that `repeating_skillsmdr` exists.

### 7.2 The Stim Tracker meters are inert

`attr_health_meter_1..5` and `attr_strain_meter_1..3` have no worker logic — no reads, no writes, no relationship to `attr_hp` or `attr_strain`. Their controllers `attr_show_health_meter` / `attr_show_strain_meter` are hardcoded `value="1"` in HTML and never written, so the CSS rules at `ghost_of_arcadia.css:9168–9169` always match. Either an unfinished feature or a vestige.

### 7.3 Four Ledger destinations have no UI

XP→Credits, XP→Allies, XP→Reputation, XP→Factions are selectable in `repeating_ledger` and totalled in the XP Point Tracker, but Reputation and Factions appear nowhere else on the sheet, and Credits/Allies only in unlinked form (Inventory cash, Backstory contacts).

### 7.4 Gear prices exist in data and nowhere in the UI

Every gear DataMap carries cost data; no Gear section renders it. Cybertech, Vehicles and Lifestyle all do.

### 7.5 Call of Cthulhu vestiges in Backstory

Phobias & Manias · Tomes, Spells & Artifacts · Encounters with Strange Entities — no GoA mechanic corresponds to any of the three.

---

## Appendix A — Repeating sections by tab (64 instances)

| Tab | Count | Sections |
|---|---|---|
| Skills | 1 | `skillsmdr` |
| Careers | 1 | `secondarycareer` |
| Combat | 8 | `armorsmdr`, `armormanual`, `weaponsmdr`, `weaponmanual`, `grenadesmdr`, `grenademanual`, `omnidecksmdr`, `programsmdr` |
| Spells | 2 | `spellpreset`, `spellsmdr` |
| Tracker | 2 | `scene`, `session` |
| Ledger | 1 | `ledger` |
| Cybertech | 5 | `cosmeticware`, `neuralware`, `internal`, `cyberlimbs`, `ct` |
| Gear | 30 | 15 × (`…gear`, `…manual`): clothing, omnidevice, disguise, bypass, comms, surveillance, arcanesupply, medtech, strain, pharma, utility, survival, entertainment, bots, drones |
| Inventory | 3 | `inventory-item-appl`, `inventory-item`, `moneyledger` |
| Backstory | 1 | `contacts` |
| Lifestyle | 3 | `safehouses`, `lifestylefeatures`, `lifestyleamenities` |
| Vehicles | 6 | `vehiclegear`, `vehiclemanual`, `vehicleweapongear`, `vehicleweaponmanual`, `vehiclemodgear`, `vehiclemodmanual` |
| NPCs | 1 | `minion` |

Ancestry, Background, Summary Text, Summary Type, Perks and Flaws contain none — all six are fully enumerated markup.

## Appendix B — Tab sizes

| Tab | Lines | Share |
|---|---|---|
| Careers | 13,616 | 39.2% |
| Tracker | 6,183 | 17.8% |
| Ancestry | 2,981 | 8.6% |
| Gear | 1,963 | 5.7% |
| Skills | 1,902 | 5.5% |
| Combat | 1,794 | 5.2% |
| Background | 1,766 | 5.1% |
| Cybertech | 1,000 | 2.9% |
| Lifestyle | 895 | 2.6% |
| Spells | 706 | 2.0% |
| Vehicles | 510 | 1.5% |
| NPCs | 278 | 0.8% |
| Summary Type | 227 | 0.7% |
| Perks | 218 | 0.6% |
| Flaws | 172 | 0.5% |
| Inventory | 169 | 0.5% |
| Ledger | 162 | 0.5% |
| Backstory | 91 | 0.3% |
| Summary Text | 71 | 0.2% |

Careers and Tracker together are 57% of the bottom section. Both are fully enumerated rather than generated, and both are the tabs where a missing HTML row or CSS rule fails silently.
