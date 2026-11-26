# Career talent strain: items for rules-author clarification

Source: `Source/GoA_Talent_Trees.json` (format 1.0.1, 2026-11-01) compared with the sheet's current `careerDataMap`. 630 talents in the JSON; 414 of them already exist on the sheet.

## 1. Strain costs the sheet cannot store as a number or dice (20)

The sheet stores strain as a whole number or a dice expression and charges it when the tracker box is ticked. These costs are prose. For each, the sheet's current parser would charge the amount shown, because it adds every number it finds; that is not always the intended amount.

- `None initially; 1 Strain per additional round` (sheet would charge 1)
  - **Hijack Protocol** (Combat Engineer, T4, Action, 1/Session)
- `1 additional Strain` (sheet would charge 1)
  - **Ready Before It Breaks** (Investigator, T2, Passive, 1/Scene)
  - **Layered Deception** (Dreamshaper, T2, Free Action, 1/Scene)
  - **Lingering Weakness** (Gravesinger, T2, Free Action, 1/Scene)
- `2 additional Strain` (sheet would charge 2)
  - **Preemptive Positioning** (Investigator, T4, Passive, 1/Scene)
  - **Cascade Override** (Codeweaver, T3, Free Action, 1/Scene)
  - **Command Injection** (Codeweaver, T4, Free Action, 1/Scene)
  - **Persistent Construct** (Dreamshaper, T3, Free Action, 1/Scene)
  - **Perfect Mask** (Dreamshaper, T4, Free Action, 1/Scene)
  - **Corpse Channel** (Gravesinger, T3, Free Action, 1/Scene)
  - **Deep Siphon** (Gravesinger, T3, Free Action, 1/Scene)
  - **Linked Suggestion** (Mindbender, T4, Free Action, 1/Scene)
- `2 Strain plus the spell’s normal cost` (sheet would charge 2)
  - **Arc-Thread Override** (Codeweaver, T3, Reaction, 1/Scene)
- `1–5 Strain` (sheet would charge 6)
  - **Warded Advance** (Sigilbound, T2, Free Action, 1/Scene)
- `1d4 additional Strain` (sheet would charge 1-4)
  - **Shared Resolve** (Spirit Warden, T4, Free Action, 1/Scene)
- `1d6 additional Strain` (sheet would charge 1-6)
  - **Unbound Power** (Stormweaver, T5, Free Action, 1/Session)
- `None / 2 Strain` (sheet would charge 2)
  - **Tendon Drive** (Bioforged, T3, Passive / Maneuver, At-will / 1/Turn)
- `Frame construction cost` (sheet would charge 0)
  - **Bonded Construct** (Soul Forger, T1, Downtime Activity, One personal construct)
- `Wisp construction cost` (sheet would charge 0)
  - **Workshop Wisp** (Soul Forger, T1, Downtime Activity, One Workshop Wisp)
- `+2 Strain` (sheet would charge 2)
  - **Linked Restoration** (Soul Forger, T3, Free Action, 1/Scene)

Questions:
- Is "additional Strain" (13 talents) charged on top of a spell's own strain, and should the sheet add it to the spell's cost or charge it separately when the talent box is ticked?
- `1–5 Strain` (Warded Advance): is the player choosing a number from 1 to 5? The sheet would charge 6.
- `None initially; 1 Strain per additional round` (Hijack Protocol): the first round is free, then 1 per round. The sheet would charge 1 on the first tick.
- `None / 2 Strain` (Tendon Drive): a passive that is free, with a Maneuver mode that costs 2. The sheet would charge 2 for the passive.
- `Frame construction cost` and `Wisp construction cost` (Soul Forger): what are the amounts? The sheet would charge 0.
- `2 Strain plus the spell's normal cost` (Arc Thread Override): confirm the spell's cost is charged by the spell itself and only the 2 belongs to the talent.
- `+2 Strain` (Linked Restoration): confirm this reads as an additional 2 and not a flat 2.

## 2. Existing talents whose strain changes (69)

These talents already exist on the sheet and the new JSON gives them a different cost. Please confirm each is intended, not a transcription difference. Format: sheet value to new value.

### Costs a strain where the sheet has none (26)
- **Field Stabilizer** (Combat Medic, T1, Free Action, 1/Scene): none -> 1
- **Tethered Assault AI** (Pilot, T4, Action, 1/Session): none -> 2
- **Combat Integration Mesh** (Pilot, T4, Free Action, 1/Scene): none -> 1
- **Phantom Reversal** (Shadowblade, T4, Free Action, 1/Scene): none -> 1
- **ICEbreaker Thread** (Slicer, T2, Free Action, 1/Scene): none -> 1
- **Null Pulse Routine** (Slicer, T2, Free Action, 1/Session): none -> 1
- **Predictive Override** (Slicer, T3, Free Action, 1/Scene): none -> 1
- **Silent Loop** (Slicer, T3, Free Action, 1/Scene): none -> 1
- **Kill-Switch Routine** (Slicer, T3, Free Action, 1/Scene): none -> 1
- **Command Fork** (Slicer, T3, Free Action, 1/Scene): none -> 1
- **ICEburn Protocol** (Slicer, T4, Free Action, 1/Session): none -> 2
- **Breath Before the Cut** (Street Ronin, T3, Free Action, 1/Scene): none -> 1
- **Draw Cut** (Street Ronin, T3, Free Action, 1/Scene): none -> 1
- **Ghost Step** (Street Ronin, T4, Free Action, 1/Scene): none -> 1
- **Steel Calm** (Street Ronin, T4, Free Action, 1/Scene): none -> 2
- **Covering Fire** (Vanguard, T2, Action, 1/Scene): none -> 1
- **Old Dog** (Vanguard, T5, Free Action, 1/Session): none -> 1d4
- **Crash Field** (Codeweaver, T4, Action, 1/Scene): none -> 3
- **Reality Patch** (Codeweaver, T5, Reaction, 1/Session): none -> 1d6+1d4
- **Shattered Confidence** (Dreamshaper, T4, Free Action, 1/Scene): none -> 2
- **Death Sense** (Gravesinger, T1, Maneuver, 1/Scene): none -> 1
- **Sigil of Anchoring** (Sigilbound, T2, Maneuver, 1/Scene): none -> 2
- **Null Field** (Sigilbound, T3, Action, 1/Scene): none -> 3
- **Glyph Warder** (Sigilbound, T4, Maneuver, 1/Scene): none -> 2
- **Killzone Instinct** (Stormweaver, T3, Free Action, 1/Scene): none -> 1
- **Reading the Weight** (Veil Dancer, T1, Free Action, 1/Scene): none -> 1

### Loses its strain cost entirely (1)
- **Exploit Misjudgment** (Dreamshaper, T2, Free Action, 1/Scene): 1 -> none

### Fixed cost raised (14)
- **Pulse Cloak Shell** (Slicer, T4, Reaction, 1/Session): 1 -> 2
- **Unit Anchor** (Vanguard, T4, Free Action, 1/Scene): 1 -> 2
- **Grind Them Down** (Vanguard, T4, Free Action, 1/Scene): 1 -> 2
- **False Terrain** (Dreamshaper, T3, Action, 1/Scene): 2 -> 3
- **Mirror Shroud** (Dreamshaper, T3, Action, 1/Scene): 2 -> 3
- **Sensory Overload** (Dreamshaper, T3, Action, 1/Scene): 2 -> 3
- **Perceptual Isolation** (Dreamshaper, T4, Action, 1/Scene): 3 -> 4
- **Phantom Formation** (Dreamshaper, T4, Action, 1/Scene): 3 -> 4
- **Veil Static Field** (Dreamshaper, T4, Action, 1/Scene): 2 -> 4
- **Deathmark** (Gravesinger, T4, Maneuver, 1/Scene): 2 -> 3
- **Stabilization Glyph** (Sigilbound, T2, Reaction, 1/Scene): 2 -> 3
- **Warding Matrix** (Sigilbound, T4, Action, 1/Scene): 3 -> 4
- **Impossible Footing** (Veil Dancer, T3, Maneuver, 1/Scene): 2 -> 3
- **Borrowed Horizon** (Veil Dancer, T4, Free Action, 1/Scene): 2 -> 3

### Dice cost changed, or dice replaced by a fixed cost (28)
- **Slip the Moment** (Faceman, T3, Reaction, 1/Scene): 1d4 -> 1
- **False Opening** (Faceman, T3, Maneuver, 1/Scene): 1d4 -> 1
- **Burn the Opening** (Faceman, T4, Free Action, 1/Scene): 1d4 -> 1
- **Digital Ghost State** (Slicer, T5, Free Action, 1/Session): 1d4 -> 1d6
- **Root Authority Rewrite** (Slicer, T5, Action, 1/Session): 1d8 -> 1d6
- **Interception Cut** (Street Ronin, T2, Reaction, 1/Scene): 1d4 -> 1
- **Last Round** (Vanguard, T4, Reaction, 1/Session): 1d4 -> 2
- **Weapon Platform** (Vanguard, T4, Maneuver, 1/Scene): 1d4 -> 2
- **Overcode Detonation** (Codeweaver, T5, Action, 1/Session): 1d6 -> 1d6+1d4
- **Unreality Cloak** (Dreamshaper, T5, Maneuver, 1/Session): 1d6 -> 2d6
- **Ghost Protocol** (Dreamshaper, T5, Action, 1/Session): 1d6+1d4 -> 2d6
- **Death Knell** (Gravesinger, T5, Action, 1/Session): 2d4 -> 2d6
- **The Last Word** (Gravesinger, T5, Action, 1/Session): 1d6 -> 2d6
- **Aegis Absolute** (Sigilbound, T5, Reaction, 1/Session): 1d6 -> 2d6
- **Draw Back from the Edge** (Soulmender, T5, Reaction, 1/Session): 1d8 -> 2d6
- **Purification Absolute** (Soulmender, T5, Action, 1/Session): 1d6 -> 2d6
- **The Body Remembers** (Soulmender, T5, Action, 1/Session): 1 -> 2d6
- **Zero-Point Mastery** (Veil Dancer, T5, Action, 1/Session): 1d6 -> 2d6
- **Stillness Between Heartbeats** (Veil Dancer, T5, Free Action, 1/Session): 1d8 -> 2d6
- **Falling Star Impact** (Veil Dancer, T5, Action, 1/Session): 1d6 -> 2d6
- **Disruptive Round** (Arcane Gunslinger, T2, Free Action, 1/Round): 1d4 -> 2
- **Flicker Ward** (Arcane Gunslinger, T2, Reaction, 1/Scene): 1d4 -> 2
- **Ward-Piercing Round** (Arcane Gunslinger, T2, Free Action, At-will): 1d4 -> 2
- **Break Contact** (Arcane Gunslinger, T3, Reaction, 1/Scene): 1d4 -> 1
- **Anchor Shot** (Arcane Gunslinger, T4, Action, 1/Scene): 1d4+1 -> 4
- **Perfected Fleshcraft** (Bioforged, T4, Free Action, 1/Session): 1d6+2 -> 4
- **Battlefield Reclamation** (Soul Forger, T3, Action, 1/Scene): 1d6 -> 3
- **Cathedral of Scrap** (Soul Forger, T4, Action, 1/Session): 1d8+2 -> 5

Questions:
- Several costs rise by 1 across whole families (Dreamshaper, Sigilbound, Veil Dancer, Vanguard). Is that a deliberate rebalance?
- Many `1d4` and `1d6` costs become `2d6` (Dreamshaper, Gravesinger, Sigilbound, Soulmender, Veil Dancer). Same question.
- Exploit Misjudgment (Dreamshaper) goes from 1 Strain to None. Confirm it is meant to be free.
- Many talents that the sheet shows as free now carry a cost (the first list). Were they free by mistake or is the new cost the rule?

## 3. Strain on talents that are used at will or each turn (21)

The sheet deducts strain only when a scene or session tracker box is ticked. Talents with no usage limit have no tracker box, so nothing is deducted for them. 23 talents on the sheet already carry a strain value with no usage limit and are never charged.

- **Scramble Protocol** (Codeweaver, T2, Maneuver, At-will): 2 Strain
- **Animate Corpse** (Gravesinger, T1, Action, At-will): 2 Strain
- **Shared Senses** (Gravesinger, T2, Action, At-will): 1 Strain
- **Spirit Companion** (Spirit Warden, T1, Action, At-will): 2 Strain
- **Spirit Courtesy** (Spirit Warden, T1, Action, At-will): 1 Strain
- **Spirit Strike** (Spirit Warden, T1, Action, At-will): 2 Strain
- **Companion’s Senses** (Spirit Warden, T2, Action, At-will): 1 Strain
- **Shelter the Displaced** (Spirit Warden, T2, 1 Minute, At-will): 1 Strain
- **Feather Step** (Veil Dancer, T1, Free Action, Once on each of your turns): 1 Strain
- **Passing Strike** (Veil Dancer, T3, Free Action, Once on each of your turns): 1 Strain
- **Distance Fold** (Arcane Gunslinger, T1, Free Action, At-will): 1 Strain
- **Sighting Mark** (Arcane Gunslinger, T1, Maneuver, At-will): 1 Strain
- **Veil Round** (Arcane Gunslinger, T1, Free Action, At-will): 1 Strain
- **Cover Bend** (Arcane Gunslinger, T2, Free Action, At-will): 2 Strain
- **Ward-Piercing Round** (Arcane Gunslinger, T2, Free Action, At-will): 2 Strain
- **Compression Anatomy** (Bioforged, T3, Maneuver, At-will): 2 Strain
- **Tendon Drive** (Bioforged, T3, Passive / Maneuver, At-will / 1/Turn): None / 2 Strain
- **Slipstream Cut** (Bladeweaver, T1, Free Action, Once on each of your turns): 1 Strain
- **Veil Temper** (Bladeweaver, T1, Free Action, At-will): 1 Strain
- **Weapon Recall** (Bladeweaver, T1, Maneuver, At-will): 1 Strain
- **Breaching Temper** (Bladeweaver, T2, Free Action, At-will): 2 Strain

Questions:
- For these talents, is the strain charged every use, once per scene, or once when the talent is activated?
- If it is every use, the sheet needs a per-use control for them. Which talents should get one?
