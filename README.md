# Ghost of Arcadia — Roll20 Character Sheet

A fully custom Roll20 character sheet for **Ghost of Arcadia**, a cyberpunk/fantasy tabletop RPG set in the neon-lit sprawl of **New Arcadia**. Built on the Call of Cthulhu percentile (d100) architecture and heavily extended for the GoA ruleset: ancestries, cyberware, magic schools, lifestyle districts, vehicles, and more.

> **Requires Roll20 Pro** — the API scripts depend on Roll20's server-side sandbox.

---

## Repository Structure

### Sheet Files

| File | Purpose |
|---|---|
| `ghost_of_arcadia.html` | The entire sheet: HTML layout, all embedded sheet worker JavaScript, all DataMaps, and roll templates. This is the file you paste into Roll20's HTML editor. |
| `ghost_of_arcadia.css` | All styling — four themes (Dark, Light, Cyberpunk, Ancestry), CSS variables, section layouts, collapsible panels, tooltip system, and roll toggle patterns. Paste into Roll20's CSS editor. |
| `translation.json` | All i18n strings used by `data-i18n` attributes throughout the sheet. Strictly alphabetical by key. Paste into Roll20's Translation editor. |

### Roll20 API Scripts

These are **server-side only** — upload each one individually via the Roll20 API Script editor (Pro required). They cannot be imported into the sheet HTML.

| File | Command | Purpose |
|---|---|---|
| `bonuspenalty.js` | `!seed-bonus` | Seeds a `bonuspenalty` token action on every character. Rolls `1d10−1` using the CoC bonus/penalty dice template. Auto-seeds new characters on creation. |
| `dexInitiative.js` | *(triggered by player)* | DEX-based initiative for PCs. Reads the character's `dex` and `dice_modifier_checkbox` attributes, rolls d100, determines tier (Critical / Extreme / Hard / Normal / Fail / Fumble), and adds the character to the Roll20 turn order. |
| `dexInitiativeNPC.js` | `!initdexnpc <Name> <DEX> [modifier]` | Same DEX initiative logic for NPCs. DEX and optional modifier are passed as arguments rather than read from a character sheet. |
| `moveNPC.js` | `!movenpc <Name> <MoveStat> [modifier]` | Chase/movement initiative for NPCs. Rolls `1d10`, adds MoveStat and optional modifier, outputs a roll template, and adds the NPC to the turn order. |

---

## Sheet Tabs

The sheet is organised into the following tabs:

| Tab | Contents |
|---|---|
| **Skills** | All percentile skills, grouped by category. Includes ancestry-specific etiquette skills. |
| **Combat** | Weapons, armor, grenades, explosives, and detonators. Smartlink/SATA conditional hit bonus. |
| **Cybertech** | Cosmeticware, neuralware, cyber optics, cyber audio, internal cyberware, and cyberlimbs with mod slots. |
| **Gear** | Ten gear categories: bypass tools, comms, omni-devices, omnidecks, surveillance, arcane supplies, MedTech, strain compounds, pharmaceuticals, utility gear, survival gear, drones, bots, and entertainment. |
| **Spells** | 281 spell entries across 10 magic schools with damage, damage type, and soak ignore fields. |
| **Vehicles** | Vehicle gear and mounted weapons with preset system. |
| **Lifestyle** | Primary residence, safehouses, features, and amenities. District/zone cascading selects, split-rent system, DT modifier summary. |
| **Ancestry** | Eight ancestries (Alteri, Draevi, Feran, Human, Khadra, Kitsu, Lyranni, Veyra) with traits and tiered talents. |
| **Careers** | Career selection and career talent trees. |
| **Perks / Flaws** | Perk and flaw tracker with roll support. |
| **Backstory** | Free-text biographical fields. |
| **Tracker** | Condition and resource tracker with strain deduction. |
| **Ledger** | Credits and financial tracking. |
| **NPCs** | Separate NPC/Minion sheet section with condition penalty cap and impale roll support. |
| **Summary** | Auto-generated character summary text and type display. |

---

## Core Game Mechanic

Ghost of Arcadia uses a **percentile (d100)** skill system derived from Call of Cthulhu.

| Result | Condition |
|---|---|
| **Critical** | Roll of 01 (always) |
| **Extreme** | Roll ≤ skill ÷ 5 |
| **Hard** | Roll ≤ skill ÷ 2 |
| **Success** | Roll ≤ skill value |
| **Fail** | Roll > skill value |
| **Fumble** | Roll of 100 (skill ≥ 50) or 96–100 (skill < 50) |

**Bonus/Penalty Dice:** Roll 2d10 for the tens digit, keep the most (bonus) or least (penalty) favorable result.

**Key Attributes:** STR, DEX, INT, CON, APP, POW, SIZ, EDU — range 15–90.

**Derived Stats:** HP = `⌊(CON + SIZ) / 10⌋ × 2` · MP = `POW × 5` · Luck = `POW × 5` · MOV = `min(14, ⌊(DEX + Athletics) / 10⌋)`

---

## DataMaps

All game data lives in **DataMaps** — JavaScript objects declared at the top of the sheet worker block in `ghost_of_arcadia.html`. They are the single source of truth; nothing is hard-coded in HTML or sheet worker logic.

<details>
<summary>Full DataMap list (43 maps)</summary>

`ammoDataMap` · `ancestryDataMap` · `ancestryTalentDataMap` · `arcaneSuppliesDataMap` · `armorDataMap` · `backgroundDataMap` · `botsDataMap` · `bypassToolsDataMap` · `careerDataMap` · `clothingDataMap` · `commsDataMap` · `conditionsDataMap` · `cosmeticwareDataMap` · `cyberAudioDataMap` · `cyberAudioModDataMap` · `cyberOpticsDataMap` · `cyberOpticsModDataMap` · `cyberlimbDataMap` · `cyberlimbModDataMap` · `detonatorDataMap` · `disguiseGearDataMap` · `districtDataMap` · `dronesDataMap` · `entertainmentDataMap` · `explosivesDataMap` · `flawDataMap` · `internalCyberDataMap` · `lifestyleFeatureDataMap` · `lifestyleTierDataMap` · `medtechDataMap` · `neuralwareDataMap` · `omniDevicesDataMap` · `omnidecksDataMap` · `perkDataMap` · `pharmaceuticalsDataMap` · `skillDataMap` · `strainCompoundsDataMap` · `surveillanceDataMap` · `survivalGearDataMap` · `utilityGearDataMap` · `vehicleModsDataMap` · `vehicleWeaponsDataMap` · `vehiclesDataMap` · `weaponDataMap` · `weaponModDataMap`

</details>

Every DataMap entry includes a `source: {}` object recording the rulebook document, version, date, and section it was drawn from.

---

## Themes

Four visual themes are selectable from the sheet header:

- **Dark** — default dark UI
- **Light** — light UI
- **Cyberpunk** — high-contrast neon aesthetic (default on new sheets)
- **Ancestry** — dynamically changes color palette based on the character's selected ancestry

---

## Development Notes

- **Indentation:** tabs only throughout HTML, CSS, JS, and JSON.
- **Ordering:** all DataMap entries, CSS variables, translation keys, and `<option>` lists are alphabetical.
- **i18n:** every user-visible string goes through `data-i18n` in HTML or `tr()` in sheet workers — no hard-coded display text.
- **Sheet width:** fixed at 840px.
- **Architecture notes**, failure modes, and corrected patterns are maintained in `Claude.md` at the repository root.
