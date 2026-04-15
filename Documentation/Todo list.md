BUGS:

To-do:
	
## Pending — Next Revision Pass

1. **brawler, tactician**  - Waiting on docs

2. **Full type/tag audit across all DataMaps** - Waiting on docs

3. **Add Ancestry Traits to Summary Text** - Waiting on docs

4. **Merge ancestryTalentDataMap into ancestryDataMap**

7. **Cyberware section**

Implementation sequence (unchanged from before, now more precise)
~~Phase 1 — All 9 DataMaps + all translation keys. No HTML yet.~~
~~Phase 2 — Static Optics block + Static Audio block. These are self-contained, touch no repeating logic, and can be tested independently.~~
~~Phase 3 — repeating_cosmeticware. Simplest repeating section — no Vitality, no mods. Good warm-up for the pattern.~~
Phase 4 — repeating_neuralware. Introduces Vitality recalc and neuralware slot counting.
Phase 5 — repeating_internal. Introduces HP bonus recalc and hp_max modification.
Phase 6 — repeating_cyberlimbs. Most complex — has mods, limb side, capacity tracking.
Phase 7 — Wire the unified Vitality recalc: getAttrs for static optics/audio Vitality, then nested getSectionIDs for the 4 repeating sections, with a counter to gate the final setAttrs.

Clean-up:

Questions:

Wishlist:
