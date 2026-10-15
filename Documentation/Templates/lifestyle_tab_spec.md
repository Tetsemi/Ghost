# Lifestyle Tab — Implementation Specification

Source documents: `Lifestyles_-_Ghost_of_Arcadia.pdf`, `District_Lifestyle_Matrix.html`
DataMap source version: to be set as `{ doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }`

---

## 1 — New DataMaps

### 1a — `lifestyleTierDataMap`

Key order (alphabetical by key): `high`, `low`, `luxury`, `middle`, `protected_enclave`, `squatter`, `streets`

```javascript
const lifestyleTierDataMap = {
	high: {
		label:       "lifestyle_tier_high-u",
		dt_modifier: 5,
		slots: { apartment: 3, compound: 5, residence: 4, studio: null },
		cost:  { apartment: 20000, compound: 50000, residence: 35000, studio: null },
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	low: {
		label:       "lifestyle_tier_low-u",
		dt_modifier: -5,
		slots: { apartment: 1, compound: 3, residence: 2, studio: 0 },
		cost:  { apartment: 2500, compound: 6000, residence: 4000, studio: 1500 },
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	luxury: {
		label:       "lifestyle_tier_luxury-u",
		dt_modifier: 10,
		slots: { apartment: 4, compound: 6, residence: 5, studio: null },
		cost:  { apartment: 65000, compound: 120000, residence: 85000, studio: null },
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	middle: {
		label:       "lifestyle_tier_middle-u",
		dt_modifier: 0,
		slots: { apartment: 2, compound: 4, residence: 3, studio: 1 },
		cost:  { apartment: 5000, compound: 10000, residence: 7500, studio: 3500 },
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	protected_enclave: {
		label:       "lifestyle_tier_protected_enclave-u",
		dt_modifier: 20,
		slots: { apartment: 5, compound: 7, residence: 6, studio: null },
		cost:  { apartment: 165000, compound: 300000, residence: 220000, studio: null },
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	squatter: {
		label:       "lifestyle_tier_squatter-u",
		dt_modifier: -10,
		slots: { apartment: null, compound: null, residence: null, studio: null },
		cost:  { apartment: null, compound: null, residence: null, studio: 400 },
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	streets: {
		label:       "lifestyle_tier_streets-u",
		dt_modifier: -20,
		slots: { apartment: null, compound: null, residence: null, studio: null },
		cost:  { apartment: null, compound: null, residence: null, studio: 0 },
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
};
```

**Notes on Squatter/Streets:** Squatter has no formal size — treat as studio-only with a cost range (300–500 Cr; store midpoint 400). Streets cost is 0. Both have 0 feature slots. The `null` size slots mean that size option is unavailable for that tier — the sheet worker must guard against selecting an unavailable combo and should default to `studio` when tier changes drop to squatter/streets.

---

### 1b — `districtDataMap`

Key format: snake_case of district name. Zone field matches the zone `id` from the matrix HTML.
`tiers` array order: `[squatter, low, middle, high, luxury, enclave]` — `0`=unavailable, `1`=available, `2`=restricted.

```javascript
const districtDataMap = {
	// ── Arcologies ──
	civic_crown: {
		label:   "district_civic_crown-u",
		zone:    "arcology",
		tiers:   [0, 2, 1, 0, 0, 0],
		cost_mod: 0,
		dt_mod:   0,
		note_key: "district_civic_crown_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	hollowspire: {
		label:   "district_hollowspire-u",
		zone:    "arcology",
		tiers:   [1, 1, 2, 0, 0, 0],
		cost_mod: -25,
		dt_mod:   -10,
		note_key: "district_hollowspire_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	luminous_reliquary: {
		label:   "district_luminous_reliquary-u",
		zone:    "arcology",
		tiers:   [0, 0, 0, 2, 2, 2],
		cost_mod: 35,
		dt_mod:   10,
		note_key: "district_luminous_reliquary_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	praxis_spire: {
		label:   "district_praxis_spire-u",
		zone:    "arcology",
		tiers:   [0, 0, 1, 1, 2, 0],
		cost_mod: 25,
		dt_mod:   10,
		note_key: "district_praxis_spire_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Ashfall Expanse ──
	breakwater_reach: {
		label:   "district_breakwater_reach-u",
		zone:    "ashfall",
		tiers:   [0, 1, 1, 2, 0, 0],
		cost_mod: -15,
		dt_mod:   -5,
		note_key: "district_breakwater_reach_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	cinderpoint: {
		label:   "district_cinderpoint-u",
		zone:    "ashfall",
		tiers:   [1, 1, 2, 0, 0, 0],
		cost_mod: -20,
		dt_mod:   -5,
		note_key: "district_cinderpoint_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	crownshore_parklands: {
		label:   "district_crownshore_parklands-u",
		zone:    "ashfall",
		tiers:   [0, 1, 1, 2, 0, 0],
		cost_mod: -15,
		dt_mod:   -5,
		note_key: "district_crownshore_parklands_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	greybridge_hold: {
		label:   "district_greybridge_hold-u",
		zone:    "ashfall",
		tiers:   [0, 1, 1, 0, 0, 0],
		cost_mod: -15,
		dt_mod:   0,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Bay and Industrial ──
	bayside_heights: {
		label:   "district_bayside_heights-u",
		zone:    "bay",
		tiers:   [0, 1, 1, 2, 0, 0],
		cost_mod: -5,
		dt_mod:   -5,
		note_key: "district_bayside_heights_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	driftmarrow: {
		label:   "district_driftmarrow-u",
		zone:    "bay",
		tiers:   [0, 1, 1, 2, 0, 0],
		cost_mod: 0,
		dt_mod:   -5,
		note_key: "district_driftmarrow_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	halcyon_quay: {
		label:   "district_halcyon_quay-u",
		zone:    "bay",
		tiers:   [0, 1, 2, 0, 0, 0],
		cost_mod: -15,
		dt_mod:   -5,
		note_key: "district_halcyon_quay_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	ironwake_flats: {
		label:   "district_ironwake_flats-u",
		zone:    "bay",
		tiers:   [1, 1, 2, 0, 0, 0],
		cost_mod: -30,
		dt_mod:   -10,
		note_key: "district_ironwake_flats_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	verdant_reach: {
		label:   "district_verdant_reach-u",
		zone:    "bay",
		tiers:   [1, 1, 1, 0, 0, 0],
		cost_mod: -25,
		dt_mod:   -10,
		note_key: "district_verdant_reach_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Core Districts ──
	bastion_circle: {
		label:   "district_bastion_circle-u",
		zone:    "core",
		tiers:   [0, 0, 2, 1, 0, 0],
		cost_mod: 20,
		dt_mod:   10,
		note_key: "district_bastion_circle_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	civic_meridian: {
		label:   "district_civic_meridian-u",
		zone:    "core",
		tiers:   [0, 0, 0, 2, 0, 0],
		cost_mod: 25,
		dt_mod:   10,
		note_key: "district_civic_meridian_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	pinnacle_ward: {
		label:   "district_pinnacle_ward-u",
		zone:    "core",
		tiers:   [0, 0, 0, 1, 1, 0],
		cost_mod: 50,
		dt_mod:   10,
		note_key: "district_pinnacle_ward_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	sovereign_row: {
		label:   "district_sovereign_row-u",
		zone:    "core",
		tiers:   [0, 0, 0, 1, 1, 0],
		cost_mod: 35,
		dt_mod:   10,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	writstone_circle: {
		label:   "district_writstone_circle-u",
		zone:    "core",
		tiers:   [0, 0, 2, 1, 2, 0],
		cost_mod: 30,
		dt_mod:   10,
		note_key: "district_writstone_circle_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Fringe Districts ──
	greenveil_district: {
		label:   "district_greenveil_district-u",
		zone:    "fringe",
		tiers:   [1, 1, 2, 0, 0, 0],
		cost_mod: -30,
		dt_mod:   -5,
		note_key: "district_greenveil_district_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	hollowfield: {
		label:   "district_hollowfield-u",
		zone:    "fringe",
		tiers:   [1, 1, 2, 0, 0, 0],
		cost_mod: -30,
		dt_mod:   -10,
		note_key: "district_hollowfield_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	kilnreach: {
		label:   "district_kilnreach-u",
		zone:    "fringe",
		tiers:   [0, 1, 2, 0, 0, 0],
		cost_mod: -25,
		dt_mod:   -10,
		note_key: "district_kilnreach_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	the_stacks: {
		label:   "district_the_stacks-u",
		zone:    "fringe",
		tiers:   [1, 1, 0, 0, 0, 0],
		cost_mod: -35,
		dt_mod:   -10,
		note_key: "district_the_stacks_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	tidebreak_sector: {
		label:   "district_tidebreak_sector-u",
		zone:    "fringe",
		tiers:   [1, 1, 2, 0, 0, 0],
		cost_mod: -35,
		dt_mod:   -10,
		note_key: "district_tidebreak_sector_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Midline Districts ──
	crossline_ward: {
		label:   "district_crossline_ward-u",
		zone:    "midline",
		tiers:   [0, 1, 1, 1, 0, 0],
		cost_mod: 0,
		dt_mod:   -5,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	merchants_row: {
		label:   "district_merchants_row-u",
		zone:    "midline",
		tiers:   [1, 1, 1, 0, 0, 0],
		cost_mod: -10,
		dt_mod:   -5,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	midlight: {
		label:   "district_midlight-u",
		zone:    "midline",
		tiers:   [1, 1, 1, 0, 0, 0],
		cost_mod: -10,
		dt_mod:   -5,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	spirebelt_commons: {
		label:   "district_spirebelt_commons-u",
		zone:    "midline",
		tiers:   [0, 2, 1, 1, 0, 0],
		cost_mod: 10,
		dt_mod:   5,
		note_key: "district_spirebelt_commons_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	veilcrest: {
		label:   "district_veilcrest-u",
		zone:    "midline",
		tiers:   [0, 0, 1, 1, 0, 0],
		cost_mod: 15,
		dt_mod:   5,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Periphery ──
	ashline_corridor: {
		label:   "district_ashline_corridor-u",
		zone:    "periphery",
		tiers:   [0, 1, 2, 0, 0, 0],
		cost_mod: -15,
		dt_mod:   -5,
		note_key: "district_ashline_corridor_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	bramble_district: {
		label:   "district_bramble_district-u",
		zone:    "periphery",
		tiers:   [0, 1, 1, 0, 0, 0],
		cost_mod: -10,
		dt_mod:   -5,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	meridian_reach: {
		label:   "district_meridian_reach-u",
		zone:    "periphery",
		tiers:   [0, 2, 1, 0, 0, 0],
		cost_mod: 0,
		dt_mod:   0,
		note_key: "district_meridian_reach_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	portfall_flats: {
		label:   "district_portfall_flats-u",
		zone:    "periphery",
		tiers:   [1, 1, 2, 0, 0, 0],
		cost_mod: -20,
		dt_mod:   -5,
		note_key: "district_portfall_flats_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Prestige Districts ──
	azurefall_coast: {
		label:   "district_azurefall_coast-u",
		zone:    "prestige",
		tiers:   [0, 0, 0, 1, 1, 1],
		cost_mod: 40,
		dt_mod:   10,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	glasswake_terrace: {
		label:   "district_glasswake_terrace-u",
		zone:    "prestige",
		tiers:   [0, 0, 0, 1, 1, 0],
		cost_mod: 30,
		dt_mod:   10,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	spirecrest_enclaves: {
		label:   "district_spirecrest_enclaves-u",
		zone:    "prestige",
		tiers:   [0, 0, 0, 1, 1, 1],
		cost_mod: 50,
		dt_mod:   10,
		note_key: "",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	veilspire_hill: {
		label:   "district_veilspire_hill-u",
		zone:    "prestige",
		tiers:   [0, 0, 0, 1, 1, 2],
		cost_mod: 35,
		dt_mod:   10,
		note_key: "district_veilspire_hill_note-u",
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
};
```

**Zone order for `select_sep_*` separators (alphabetical by label):**
`arcology` → `ashfall` → `bay` → `core` → `fringe` → `midline` → `periphery` → `prestige`

**`cost_mod` encoding:** integer percentage points. `0` = Base, `25` = +25%, `-30` = −30%. The apply function computes: `floor(base_cost * (1 + cost_mod / 100))`.

**`tiers` index map:** `[0]=squatter`, `[1]=low`, `[2]=middle`, `[3]=high`, `[4]=luxury`, `[5]=enclave`. Value `2` = restricted (display a note, not blocked — player can still select, GM adjudicates).

---

### 1c — `lifestyleFeatureDataMap`

All features and amenities. `slots` = number of feature slots consumed. `type` = `"feature"` or `"amenity"`.

```javascript
const lifestyleFeatureDataMap = {
	// ── Features ──
	arcane_workspace: {
		label:      "lifestyle_feature_arcane_workspace-u",
		desc_key:   "lifestyle_feature_arcane_workspace_desc-u",
		type:       "feature",
		slots:      1,
		cost:       12000,
		upkeep:     350,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	armory: {
		label:      "lifestyle_feature_armory-u",
		desc_key:   "lifestyle_feature_armory_desc-u",
		type:       "feature",
		slots:      1,
		cost:       6000,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	medical_bay: {
		label:      "lifestyle_feature_medical_bay-u",
		desc_key:   "lifestyle_feature_medical_bay_desc-u",
		type:       "feature",
		slots:      2,
		cost:       15000,
		upkeep:     500,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	panic_room: {
		label:      "lifestyle_feature_panic_room-u",
		desc_key:   "lifestyle_feature_panic_room_desc-u",
		type:       "feature",
		slots:      2,
		cost:       20000,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	research_archive: {
		label:      "lifestyle_feature_research_archive-u",
		desc_key:   "lifestyle_feature_research_archive_desc-u",
		type:       "feature",
		slots:      1,
		cost:       5000,
		upkeep:     200,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	secure_comms_hub: {
		label:      "lifestyle_feature_secure_comms_hub-u",
		desc_key:   "lifestyle_feature_secure_comms_hub_desc-u",
		type:       "feature",
		slots:      1,
		cost:       9000,
		upkeep:     300,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	signal_dampener: {
		label:      "lifestyle_feature_signal_dampener-u",
		desc_key:   "lifestyle_feature_signal_dampener_desc-u",
		type:       "feature",
		slots:      1,
		cost:       8500,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	slicing_station: {
		label:      "lifestyle_feature_slicing_station-u",
		desc_key:   "lifestyle_feature_slicing_station_desc-u",
		type:       "feature",
		slots:      1,
		cost:       10000,
		upkeep:     400,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	smugglers_cache: {
		label:      "lifestyle_feature_smugglers_cache-u",
		desc_key:   "lifestyle_feature_smugglers_cache_desc-u",
		type:       "feature",
		slots:      1,
		cost:       4500,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	street_contact_network: {
		label:      "lifestyle_feature_street_contact_network-u",
		desc_key:   "lifestyle_feature_street_contact_network_desc-u",
		type:       "feature",
		slots:      1,
		cost:       6000,
		upkeep:     500,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	training_facility_advanced: {
		label:      "lifestyle_feature_training_facility_advanced-u",
		desc_key:   "lifestyle_feature_training_facility_advanced_desc-u",
		type:       "feature",
		slots:      2,
		cost:       15000,
		upkeep:     500,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	training_facility_basic: {
		label:      "lifestyle_feature_training_facility_basic-u",
		desc_key:   "lifestyle_feature_training_facility_basic_desc-u",
		type:       "feature",
		slots:      1,
		cost:       3000,
		upkeep:     100,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	training_facility_standard: {
		label:      "lifestyle_feature_training_facility_standard-u",
		desc_key:   "lifestyle_feature_training_facility_standard_desc-u",
		type:       "feature",
		slots:      1,
		cost:       7000,
		upkeep:     250,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	workshop: {
		label:      "lifestyle_feature_workshop-u",
		desc_key:   "lifestyle_feature_workshop_desc-u",
		type:       "feature",
		slots:      1,
		cost:       8000,
		upkeep:     300,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	// ── Amenities ──
	automated_kitchen: {
		label:      "lifestyle_amenity_automated_kitchen-u",
		desc_key:   "lifestyle_amenity_automated_kitchen_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       7000,
		upkeep:     400,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	bunk_configuration: {
		label:      "lifestyle_amenity_bunk_configuration-u",
		desc_key:   "lifestyle_amenity_bunk_configuration_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       2000,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	concierge_terminal: {
		label:      "lifestyle_amenity_concierge_terminal-u",
		desc_key:   "lifestyle_amenity_concierge_terminal_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       4500,
		upkeep:     150,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	creature_quarters: {
		label:      "lifestyle_amenity_creature_quarters-u",
		desc_key:   "lifestyle_amenity_creature_quarters_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       2500,
		upkeep:     275,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	dreamfeed_station: {
		label:      "lifestyle_amenity_dreamfeed_station-u",
		desc_key:   "lifestyle_amenity_dreamfeed_station_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       14000,
		upkeep:     200,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	gallery: {
		label:      "lifestyle_amenity_gallery-u",
		desc_key:   "lifestyle_amenity_gallery_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       3500,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	garden: {
		label:      "lifestyle_amenity_garden-u",
		desc_key:   "lifestyle_amenity_garden_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       5500,
		upkeep:     150,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	home_bar: {
		label:      "lifestyle_amenity_home_bar-u",
		desc_key:   "lifestyle_amenity_home_bar_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       3000,
		upkeep:     300,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	meditation_chamber: {
		label:      "lifestyle_amenity_meditation_chamber-u",
		desc_key:   "lifestyle_amenity_meditation_chamber_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       5000,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	private_terrace: {
		label:      "lifestyle_amenity_private_terrace-u",
		desc_key:   "lifestyle_amenity_private_terrace_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       8000,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	sauna_thermal_suite: {
		label:      "lifestyle_amenity_sauna_thermal_suite-u",
		desc_key:   "lifestyle_amenity_sauna_thermal_suite_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       4000,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	sonic_suite: {
		label:      "lifestyle_amenity_sonic_suite-u",
		desc_key:   "lifestyle_amenity_sonic_suite_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       4500,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	spacious_quarters: {
		label:      "lifestyle_amenity_spacious_quarters-u",
		desc_key:   "lifestyle_amenity_spacious_quarters_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       3500,
		upkeep:     0,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
	veil_aquarium: {
		label:      "lifestyle_amenity_veil_aquarium-u",
		desc_key:   "lifestyle_amenity_veil_aquarium_desc-u",
		type:       "amenity",
		slots:      1,
		cost:       9000,
		upkeep:     250,
		source: { doc: "lifestyles-u", version: "1.260416", date: "2026-04-16", section: "lifestyles-u" }
	},
};
```

**`creature_quarters` upkeep:** 275 is the midpoint of the 150–400 Cr range. Store this value; note the range in the `_desc-u` key.
**`automated_kitchen` upkeep:** 400 Cr/mo applies at Middle and below only. The rule text goes in the `_desc-u` key. The apply function stores 400; the player zeros it manually if their primary tier is High+.

---

## 2 — HTML Structure

### 2a — Tab button (add in the tab bar, alphabetically by label)

```html
<button type="action" name="act_lifestyle" data-i18n="lifestyle-u">Lifestyle</button>
```

Insert between `act_ledger` and `act_npcs`.

### 2b — Tab panel scaffold

```html
<!-- -------------------------- Lifestyle ------------------------- -->
<div class="sheet-tab-content sheet-lifestyle">

	<!-- ─── Primary Residence ─── -->
	<div class="sheet-colrow sheet-lifestyle-collapsible">
		<input type="checkbox" class="sheet-top-collapse" id="lifestyle_primary_collapse" name="attr_lifestyle_primary_collapse" value="1"/>
		<h4 class="sheet-section-head-collapsible">
			<span data-i18n="lifestyle_primary_residence-u">Primary Residence</span>
			<label class="sheet-top-collapse-hit" for="lifestyle_primary_collapse" title="Toggle section"></label>
		</h4>
		<div class="sheet-section-body">
			<!-- Zone select (filters district select via CSS) -->
			<!-- hidden zone controller -->
			<input type="hidden" name="attr_lifestyle_zone" value=""/>
			<!-- Zone select (visible) -->
			<select name="attr_lifestyle_zone_select">
				<option value="" data-i18n="lifestyle_select_zone-u">── Select Zone ──</option>
				<option value="arcology"  data-i18n="zone_arcology-u">Arcologies</option>
				<option value="ashfall"   data-i18n="zone_ashfall-u">Ashfall Expanse</option>
				<option value="bay"       data-i18n="zone_bay-u">Bay &amp; Industrial</option>
				<option value="core"      data-i18n="zone_core-u">Core Districts</option>
				<option value="fringe"    data-i18n="zone_fringe-u">Fringe Districts</option>
				<option value="midline"   data-i18n="zone_midline-u">Midline Districts</option>
				<option value="periphery" data-i18n="zone_periphery-u">Periphery</option>
				<option value="prestige"  data-i18n="zone_prestige-u">Prestige Districts</option>
			</select>

			<!-- Per-zone district selects (CSS show/hide on attr_lifestyle_zone value) -->
			<!-- One block per zone, class="lifestyle-district-group district-zone-ZONEID" -->
			<!-- Each contains: hidden input attr_lifestyle_district + visible select -->
			<!-- ... (see Section 4 — CSS pattern below) ... -->

			<!-- Tier + Size -->
			<select name="attr_lifestyle_tier">
				<option value="streets"           data-i18n="lifestyle_tier_streets-u">Streets</option>
				<option value="squatter"          data-i18n="lifestyle_tier_squatter-u">Squatter</option>
				<option value="low"               data-i18n="lifestyle_tier_low-u">Low</option>
				<option value="middle"            data-i18n="lifestyle_tier_middle-u">Middle</option>
				<option value="high"              data-i18n="lifestyle_tier_high-u">High</option>
				<option value="luxury"            data-i18n="lifestyle_tier_luxury-u">Luxury</option>
				<option value="protected_enclave" data-i18n="lifestyle_tier_protected_enclave-u">Protected Enclave</option>
			</select>

			<select name="attr_lifestyle_size">
				<option value="studio"    data-i18n="lifestyle_size_studio-u">Studio</option>
				<option value="apartment" data-i18n="lifestyle_size_apartment-u">Apartment</option>
				<option value="residence" data-i18n="lifestyle_size_residence-u">Residence</option>
				<option value="compound"  data-i18n="lifestyle_size_compound-u">Compound</option>
			</select>

			<!-- Display attrs (written by sheet worker) -->
			<input type="hidden" name="attr_lifestyle_base_cost_mdr"  value=""/>
			<input type="hidden" name="attr_lifestyle_final_cost_mdr" value=""/>
			<input type="hidden" name="attr_lifestyle_slots_total_mdr" value="0"/>
			<input type="hidden" name="attr_lifestyle_slots_used_mdr"  value="0"/>
			<input type="hidden" name="attr_lifestyle_dt_tier_mdr"    value="0"/>
			<input type="hidden" name="attr_lifestyle_dt_district_mdr" value="0"/>
			<!-- Visible spans for computed values -->
			<span name="attr_lifestyle_final_cost_mdr"></span>
			<span name="attr_lifestyle_slots_used_mdr"></span> / <span name="attr_lifestyle_slots_total_mdr"></span>

			<!-- District note (written by applyDistrictPreset) -->
			<input type="hidden" name="attr_lifestyle_district_note_mdr" value=""/>
			<span name="attr_lifestyle_district_note_mdr"></span>
		</div>
	</div>

	<!-- ─── Safehouses (repeating) ─── -->
	<div class="sheet-colrow sheet-lifestyle-collapsible">
		<input type="checkbox" class="sheet-top-collapse" id="lifestyle_safehouses_collapse" name="attr_lifestyle_safehouses_collapse" value="1"/>
		<h4 class="sheet-section-head-collapsible">
			<span data-i18n="lifestyle_safehouses-u">Safehouses</span>
			<label class="sheet-top-collapse-hit" for="lifestyle_safehouses_collapse" title="Toggle section"></label>
		</h4>
		<div class="sheet-section-body">
			<!-- Column header -->
			<div class="sheet-lifestyle-safehouse-header">
				<div class="flex-row">
					<div class="flex-cell ls-name"><span data-i18n="lifestyle_safehouse_name-u">Name / Location</span></div>
					<div class="flex-cell ls-zone"><span data-i18n="lifestyle_zone-u">Zone</span></div>
					<div class="flex-cell ls-tier"><span data-i18n="lifestyle_tier-u">Tier</span></div>
					<div class="flex-cell ls-size"><span data-i18n="lifestyle_size-u">Size</span></div>
					<div class="flex-cell ls-slots"><span data-i18n="lifestyle_slots-u">Slots</span></div>
					<div class="flex-cell ls-split"><span data-i18n="lifestyle_split-u">÷</span></div>
					<div class="flex-cell ls-cost"><span data-i18n="lifestyle_monthly_cost-u">Mo. Cost</span></div>
				</div>
			</div>
			<fieldset class="repeating_safehouses">
				<div class="sheet-lifestyle-safehouse-row">
					<div class="flex-row">
						<div class="flex-cell ls-name">
							<input type="text" name="attr_safehouse_name" placeholder="—"/>
						</div>
						<div class="flex-cell ls-zone">
							<select name="attr_safehouse_zone">
								<option value="" data-i18n="lifestyle_select_zone-u">—</option>
								<option value="arcology"  data-i18n="zone_arcology-u">Arcologies</option>
								<option value="ashfall"   data-i18n="zone_ashfall-u">Ashfall</option>
								<option value="bay"       data-i18n="zone_bay-u">Bay</option>
								<option value="core"      data-i18n="zone_core-u">Core</option>
								<option value="fringe"    data-i18n="zone_fringe-u">Fringe</option>
								<option value="midline"   data-i18n="zone_midline-u">Midline</option>
								<option value="periphery" data-i18n="zone_periphery-u">Periphery</option>
								<option value="prestige"  data-i18n="zone_prestige-u">Prestige</option>
							</select>
						</div>
						<div class="flex-cell ls-tier">
							<!-- same pattern as primary: zone hidden input + per-zone district groups -->
							<input type="hidden" name="attr_safehouse_zone_ctrl" value=""/>
							<!-- Per-zone district select groups go here -->
							<select name="attr_safehouse_tier">
								<option value="streets"           data-i18n="lifestyle_tier_streets-u">Streets</option>
								<option value="squatter"          data-i18n="lifestyle_tier_squatter-u">Squatter</option>
								<option value="low"               data-i18n="lifestyle_tier_low-u">Low</option>
								<option value="middle"            data-i18n="lifestyle_tier_middle-u">Middle</option>
								<option value="high"              data-i18n="lifestyle_tier_high-u">High</option>
								<option value="luxury"            data-i18n="lifestyle_tier_luxury-u">Luxury</option>
								<option value="protected_enclave" data-i18n="lifestyle_tier_protected_enclave-u">Enclave</option>
							</select>
						</div>
						<div class="flex-cell ls-size">
							<select name="attr_safehouse_size">
								<option value="studio"    data-i18n="lifestyle_size_studio-u">Studio</option>
								<option value="apartment" data-i18n="lifestyle_size_apartment-u">Apt</option>
								<option value="residence" data-i18n="lifestyle_size_residence-u">Res</option>
								<option value="compound"  data-i18n="lifestyle_size_compound-u">Cmpd</option>
							</select>
						</div>
						<div class="flex-cell ls-slots">
							<input type="hidden" name="attr_safehouse_slots_total_mdr" value="0"/>
							<input type="hidden" name="attr_safehouse_slots_used_mdr" value="0"/>
							<span name="attr_safehouse_slots_used_mdr"></span>/<span name="attr_safehouse_slots_total_mdr"></span>
						</div>
						<div class="flex-cell ls-split">
							<input type="text" name="attr_safehouse_split" value="1"/>
						</div>
						<div class="flex-cell ls-cost">
							<input type="hidden" name="attr_safehouse_cost_mdr" value=""/>
							<span name="attr_safehouse_cost_mdr"></span>
						</div>
					</div>
				</div>
			</fieldset>
		</div>
	</div>

	<!-- ─── Security Add-Ons ─── (non-repeating, attached to primary residence) -->
	<!-- Three checkboxes: lifestyle_sec_basic, lifestyle_sec_enhanced, lifestyle_sec_private -->
	<!-- Each writes its DT modifier to a hidden attr; recalcTotalDT sums all modifiers -->

	<!-- ─── Features (repeating_lifestylefeatures) ─── -->
	<!-- One row per installed feature. Columns: Location (primary/safehouse name), Feature preset, Skill (training only), Slots, Cost, Upkeep, Installed checkbox -->

	<!-- ─── Amenities (repeating_lifestyleamenities) ─── -->
	<!-- Same structure as Features but without Skill column -->

	<!-- ─── DT Summary + Monthly Budget ─── -->
	<!-- Computed display-only section. All values written by recalcLifestyleTotals(). -->

</div>
```

---

## 3 — Cascading Zone → District Select Pattern

The weapon tab uses CSS `input[value="X"] ~ .group-X { display: block }`. The district select uses the same mechanism.

**HTML pattern (primary residence):**
```html
<input type="hidden" name="attr_lifestyle_zone" value=""/>

<div class="lifestyle-district-group district-zone-arcology">
	<select name="attr_lifestyle_district_arcology">
		<option value="" data-i18n="lifestyle_select_district-u">── Select District ──</option>
		<option value="civic_crown"         data-i18n="district_civic_crown-u">Civic Crown</option>
		<option value="hollowspire"         data-i18n="district_hollowspire-u">Hollowspire</option>
		<option value="luminous_reliquary"  data-i18n="district_luminous_reliquary-u">Luminous Reliquary</option>
		<option value="praxis_spire"        data-i18n="district_praxis_spire-u">Praxis Spire</option>
	</select>
</div>

<div class="lifestyle-district-group district-zone-ashfall">
	<select name="attr_lifestyle_district_ashfall">
		<!-- ... districts ... -->
	</select>
</div>
<!-- etc. for all 8 zones -->
```

**CSS show/hide:**
```css
.ui-dialog .tab-content .charsheet .lifestyle-district-group {
	display: none;
}
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="arcology"]  ~ .district-zone-arcology,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="ashfall"]   ~ .district-zone-ashfall,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="bay"]       ~ .district-zone-bay,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="core"]      ~ .district-zone-core,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="fringe"]    ~ .district-zone-fringe,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="midline"]   ~ .district-zone-midline,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="periphery"] ~ .district-zone-periphery,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="prestige"]  ~ .district-zone-prestige {
	display: block;
}
```

**Sheet worker:** `on("change:lifestyle_zone_select", ...)` writes `attr_lifestyle_zone` from the visible select's value. Then `on("change:lifestyle_district_arcology change:lifestyle_district_ashfall ...")` calls `applyDistrictPreset`.

**Repeating safehouses:** Same pattern but scoped with `attr_safehouse_zone_ctrl` as the hidden input, and 8 per-zone select groups inside each row. The zone select `on("change:repeating_safehouses:safehouse_zone", ...)` writes `safehouse_zone_ctrl`, making the correct group visible.

---

## 4 — Training Facility Skill Double-Select Pattern

In `repeating_lifestylefeatures`, when the selected feature preset is a `training_facility_*` key, show two additional selects: skill group, then skills within that group.

**HTML (inside the repeating feature row):**
```html
<input type="hidden" name="attr_lf_preset" value=""/>
<input type="hidden" name="attr_lf_training_skill_group_ctrl" value=""/>

<!-- Only visible when preset is training_facility_* (CSS) -->
<div class="lf-training-select-block">
	<select name="attr_lf_training_skill_group">
		<option value="" data-i18n="lifestyle_skill_group_select-u">── Skill Group ──</option>
		<option value="combat"    data-i18n="skill_group_combat-u">Combat</option>
		<option value="knowledge" data-i18n="skill_group_knowledge-u">Knowledge</option>
		<option value="magic"     data-i18n="skill_group_magic-u">Magic</option>
		<option value="physical"  data-i18n="skill_group_physical-u">Physical</option>
		<option value="social"    data-i18n="skill_group_social-u">Social</option>
		<option value="techcyber" data-i18n="skill_group_techcyber-u">Tech / Cyber</option>
	</select>

	<!-- Per-group skill selects — hidden/shown by CSS on attr_lf_training_skill_group_ctrl -->
	<div class="lf-skill-group-block skill-group-combat">
		<select name="attr_lf_training_skill_combat">
			<option value="" data-i18n="lifestyle_select_skill-u">── Select Skill ──</option>
			<option value="archery"           data-i18n="archery-u">Archery</option>
			<option value="dodge"             data-i18n="dodge-u">Dodge</option>
			<option value="firearms_handgun"  data-i18n="firearms_handgun-u">Firearms (Handgun)</option>
			<option value="firearms_rifle"    data-i18n="firearms_rifle-u">Firearms (Rifle)</option>
			<option value="firearms_shotgun"  data-i18n="firearms_shotgun-u">Firearms (Shotgun)</option>
			<option value="firearms_smg"      data-i18n="firearms_smg-u">Firearms (SMG)</option>
			<option value="gunnery"           data-i18n="gunnery-u">Gunnery</option>
			<option value="heavy_weapons"     data-i18n="heavy_weapons-u">Heavy Weapons</option>
			<option value="melee_weapons"     data-i18n="melee_weapons-u">Melee Weapons</option>
			<option value="unarmed"           data-i18n="unarmed-u">Unarmed Combat</option>
		</select>
	</div>
	<!-- ... blocks for each group ... -->
</div>
```

The sheet worker `on("change:repeating_lifestylefeatures:lf_training_skill_group", ...)` writes `attr_lf_training_skill_group_ctrl`, showing the correct skill select. The final selected skill key is written to `attr_lf_training_skill_mdr` for display.

**CSS:**
```css
.ui-dialog .tab-content .charsheet .lf-skill-group-block { display: none; }
.ui-dialog .tab-content .charsheet input[name="attr_lf_training_skill_group_ctrl"][value="combat"]    ~ .skill-group-combat,
/* ... other groups ... */
{ display: block; }

/* Only show the training select block when preset is a training_facility key */
.ui-dialog .tab-content .charsheet .lf-training-select-block { display: none; }
.ui-dialog .tab-content .charsheet input[name="attr_lf_preset"][value="training_facility_basic"]    ~ .lf-training-select-block,
.ui-dialog .tab-content .charsheet input[name="attr_lf_preset"][value="training_facility_standard"] ~ .lf-training-select-block,
.ui-dialog .tab-content .charsheet input[name="attr_lf_preset"][value="training_facility_advanced"] ~ .lf-training-select-block {
	display: block;
}
```

---

## 5 — Sheet Worker Functions

### Key attributes (primary residence)

| Attr | Description |
|---|---|
| `attr_lifestyle_zone` | Hidden zone controller (drives CSS) |
| `attr_lifestyle_zone_select` | Visible zone select |
| `attr_lifestyle_district_ZONE` | One per zone; active one holds the selected district key |
| `attr_lifestyle_district_mdr` | Resolved district key (written by worker from whichever zone select changed) |
| `attr_lifestyle_tier` | Tier key |
| `attr_lifestyle_size` | Size key |
| `attr_lifestyle_base_cost_mdr` | Base cost from DataMap |
| `attr_lifestyle_final_cost_mdr` | After district cost_mod applied |
| `attr_lifestyle_slots_total_mdr` | From tier+size DataMap |
| `attr_lifestyle_slots_used_mdr` | Sum of slots from installed features/amenities tagged to primary |
| `attr_lifestyle_dt_tier_mdr` | DT from tier |
| `attr_lifestyle_dt_district_mdr` | DT from district |
| `attr_lifestyle_district_note_mdr` | Restriction note text |

### Watcher list

```
change:lifestyle_zone_select
  → setAttrs({ lifestyle_zone: value }) → CSS shows correct district group

change:lifestyle_district_arcology change:lifestyle_district_ashfall
change:lifestyle_district_bay change:lifestyle_district_core
change:lifestyle_district_fringe change:lifestyle_district_midline
change:lifestyle_district_periphery change:lifestyle_district_prestige
  → applyDistrictPreset("lifestyle_", resolvedKey)

change:lifestyle_tier change:lifestyle_size
  → applyLifestyleTierPreset()

change:lifestyle_sec_basic change:lifestyle_sec_enhanced change:lifestyle_sec_private
  → recalcLifestyleTotals()

change:repeating_safehouses:safehouse_zone
  → setAttrs({ safehouse_zone_ctrl: value })

change:repeating_safehouses:safehouse_district_arcology
  (etc. per zone)
  → applyDistrictPreset(prefix, resolvedKey)  [safehouse variant]

change:repeating_safehouses:safehouse_tier
change:repeating_safehouses:safehouse_size
change:repeating_safehouses:safehouse_split
  → recalcSafehouseCost(prefix)

change:repeating_lifestylefeatures:lf_preset
  → applyFeaturePreset(prefix, key)

change:repeating_lifestylefeatures:lf_training_skill_group
  → setAttrs({ lf_training_skill_group_ctrl: value })

change:repeating_lifestylefeatures:lf_training_skill_combat
  (etc. per group)
  → setAttrs({ lf_training_skill_mdr: tr(skillDataMap[key].label) })

change:repeating_lifestylefeatures:lf_installed
  → recalcSlotsUsed(); recalcMonthlyBudget()

change:repeating_lifestyleamenities:la_preset
  → applyAmenityPreset(prefix, key)

change:repeating_lifestyleamenities:la_installed
  → recalcSlotsUsed(); recalcMonthlyBudget()
```

### `applyDistrictPreset(prefix, districtKey)`

```javascript
const applyDistrictPreset = (prefix, districtKey) => {
	const tr = (k) => (k && typeof getTranslationByKey === "function") ? (getTranslationByKey(k) || k) : (k || "");
	const data = districtDataMap[districtKey];
	if (!data) return;
	setAttrs({
		[prefix + "district_mdr"]:      districtKey,
		[prefix + "dt_district_mdr"]:   data.dt_mod,
		[prefix + "district_note_mdr"]: data.note_key ? tr(data.note_key) : " ",
	}, {}, () => recalcLifestyleTotals());
};
```

### `applyLifestyleTierPreset()`

```javascript
const applyLifestyleTierPreset = () => {
	const tr = (k) => (k && typeof getTranslationByKey === "function") ? (getTranslationByKey(k) || k) : (k || "");
	getAttrs(["lifestyle_tier", "lifestyle_size", "lifestyle_district_mdr"], (v) => {
		const tierKey     = v["lifestyle_tier"]     || "middle";
		const sizeKey     = v["lifestyle_size"]     || "apartment";
		const districtKey = v["lifestyle_district_mdr"] || "";
		const tier     = lifestyleTierDataMap[tierKey];
		const district = districtDataMap[districtKey];
		if (!tier) return;
		const baseCost    = tier.cost[sizeKey] ?? 0;
		const costMod     = district ? district.cost_mod : 0;
		const finalCost   = Math.floor(baseCost * (1 + costMod / 100));
		const slotsTotal  = tier.slots[sizeKey] ?? 0;
		setAttrs({
			lifestyle_base_cost_mdr:   baseCost,
			lifestyle_final_cost_mdr:  finalCost,
			lifestyle_slots_total_mdr: slotsTotal,
			lifestyle_dt_tier_mdr:     tier.dt_modifier,
		}, {}, () => recalcLifestyleTotals());
	});
};
```

### `recalcLifestyleTotals()`

Reads tier DT + district DT + security checkbox DT modifiers. Reads feature/amenity upkeeps from repeating sections. Sums and writes to display attrs: `lifestyle_dt_total_mdr`, `lifestyle_monthly_total_mdr`.

Uses the `setAttrs`-then-`getAttrs`-barrier pattern to ensure all prior writes are committed before reading:

```javascript
const recalcLifestyleTotals = () => {
	// 1. Read primary residence DT components
	// 2. Read security checkbox states
	// 3. getSectionIDs("repeating_safehouses", ...) for safehouse costs
	// 4. getSectionIDs("repeating_lifestylefeatures", ...) for upkeeps
	// 5. getSectionIDs("repeating_lifestyleamenities", ...) for upkeeps
	// 6. Sum all, setAttrs display totals
};
```

### `initLifestylePresets()` — called from `sheet:opened`

Only restores computed display attrs. Does NOT call apply functions that would overwrite player values.

```javascript
const initLifestylePresets = () => {
	// Read lifestyle_tier, lifestyle_size, lifestyle_district_mdr
	// Recalc base/final cost, slots total, DT components
	// Do NOT overwrite lifestyle_final_cost_mdr if the player has never
	// selected a tier (i.e. value is already "" — leave it)
	getAttrs(["lifestyle_tier", "lifestyle_size", "lifestyle_district_mdr"], (v) => {
		if (!v["lifestyle_tier"]) return;
		applyLifestyleTierPreset();
	});
	// Similarly for each safehouse row: read tier+size+district, recalc cost
	getSectionIDs("repeating_safehouses", (ids) => {
		// ... recalc per row
	});
};
```

---

## 6 — CSS Section

Place inside a new `/* ------- Lifestyle - Start ------- */` / `/* ------- Lifestyle - End ------- */` block, after Inventory and before Backstory (alphabetically by section name: Inventory → Lifestyle → NPCs).

```css
/* ------- Lifestyle - Start ------- */

/* Fieldset resets */
.ui-dialog .tab-content .charsheet fieldset.repeating_lifestylefeatures,
.ui-dialog .tab-content .charsheet fieldset.repeating_lifestyleamenities,
.ui-dialog .tab-content .charsheet fieldset.repeating_safehouses {
	margin: 0; padding: 0; border: none;
}

/* Column sizing — Safehouses header + rows */
.ui-dialog .tab-content .charsheet .ls-cost     { flex: 0 0 80px; text-align: right; }
.ui-dialog .tab-content .charsheet .ls-name     { flex: 1 1 180px; min-width: 0; }
.ui-dialog .tab-content .charsheet .ls-size     { flex: 0 0 70px; }
.ui-dialog .tab-content .charsheet .ls-slots    { flex: 0 0 50px; text-align: center; }
.ui-dialog .tab-content .charsheet .ls-split    { flex: 0 0 36px; text-align: center; }
.ui-dialog .tab-content .charsheet .ls-tier     { flex: 0 0 90px; }
.ui-dialog .tab-content .charsheet .ls-zone     { flex: 0 0 90px; }

/* Safehouse rows */
.ui-dialog .tab-content .charsheet .sheet-lifestyle-safehouse-header .flex-row,
.ui-dialog .tab-content .charsheet .sheet-lifestyle-safehouse-row .flex-row,
.ui-dialog .tab-content .charsheet .repeating_safehouses .flex-row {
	display: flex; flex-wrap: nowrap; flex-direction: row;
	align-items: center; width: 100%; height: var(--cs_row_height);
	padding: 0; margin: 0; gap: 0;
}

/* District group show/hide (primary residence) */
.ui-dialog .tab-content .charsheet .lifestyle-district-group { display: none; }
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="arcology"]  ~ .district-zone-arcology,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="ashfall"]   ~ .district-zone-ashfall,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="bay"]       ~ .district-zone-bay,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="core"]      ~ .district-zone-core,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="fringe"]    ~ .district-zone-fringe,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="midline"]   ~ .district-zone-midline,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="periphery"] ~ .district-zone-periphery,
.ui-dialog .tab-content .charsheet input[name="attr_lifestyle_zone"][value="prestige"]  ~ .district-zone-prestige { display: block; }

/* Safehouse district group show/hide — scoped to repeating container */
.ui-dialog .tab-content .charsheet .repcontainer[data-groupname="repeating_safehouses"] .lifestyle-district-group { display: none; }
.ui-dialog .tab-content .charsheet .repcontainer[data-groupname="repeating_safehouses"] input[name="attr_safehouse_zone_ctrl"][value="arcology"]  ~ .district-zone-arcology,
/* ... (same 8 rules as above, scoped to repcontainer) ... */
{ display: block; }

/* Training skill group show/hide */
.ui-dialog .tab-content .charsheet .lf-skill-group-block  { display: none; }
.ui-dialog .tab-content .charsheet .lf-training-select-block { display: none; }

.ui-dialog .tab-content .charsheet input[name="attr_lf_preset"][value="training_facility_basic"]    ~ .lf-training-select-block,
.ui-dialog .tab-content .charsheet input[name="attr_lf_preset"][value="training_facility_standard"] ~ .lf-training-select-block,
.ui-dialog .tab-content .charsheet input[name="attr_lf_preset"][value="training_facility_advanced"] ~ .lf-training-select-block { display: block; }

.ui-dialog .tab-content .charsheet input[name="attr_lf_training_skill_group_ctrl"][value="combat"]    ~ .skill-group-combat,
.ui-dialog .tab-content .charsheet input[name="attr_lf_training_skill_group_ctrl"][value="knowledge"] ~ .skill-group-knowledge,
.ui-dialog .tab-content .charsheet input[name="attr_lf_training_skill_group_ctrl"][value="magic"]     ~ .skill-group-magic,
.ui-dialog .tab-content .charsheet input[name="attr_lf_training_skill_group_ctrl"][value="physical"]  ~ .skill-group-physical,
.ui-dialog .tab-content .charsheet input[name="attr_lf_training_skill_group_ctrl"][value="social"]    ~ .skill-group-social,
.ui-dialog .tab-content .charsheet input[name="attr_lf_training_skill_group_ctrl"][value="techcyber"] ~ .skill-group-techcyber { display: block; }

/* Collapsible sections */
.ui-dialog .tab-content .charsheet .sheet-lifestyle .sheet-lifestyle-collapsible input.sheet-top-collapse:checked
~ h4 .sheet-top-collapse-hit::after { content: "+"; }

.ui-dialog .tab-content .charsheet .sheet-lifestyle .sheet-lifestyle-collapsible input.sheet-top-collapse:checked
~ .sheet-section-body { display: none; }

/* ------- Lifestyle - End ------- */
```

---

## 7 — Tab visibility CSS (add to the existing tab-controller rule block)

Two additions needed:

```css
/* In the display:block rule (add alongside existing entries): */
.ui-dialog .tab-content .charsheet .sheet-tab-controller[value="lifestyle"] ~ .sheet-lifestyle { display: block; }

/* In the active tab button highlight rule: */
.ui-dialog .tab-content .charsheet .sheet-tab-controller[value="lifestyle"] ~ .sheet-tab-buttons button[name="act_lifestyle"] { ... }
```

---

## 8 — translation.json keys to add

All keys alphabetical. Below is the full set needed for this feature; insert each in its correct position.

```
district_ashline_corridor-u
district_ashline_corridor_note-u
district_azurefall_coast-u
district_bastion_circle-u
district_bastion_circle_note-u
district_bayside_heights-u
district_bayside_heights_note-u
district_bramble_district-u
district_breakwater_reach-u
district_breakwater_reach_note-u
district_cinderpoint-u
district_cinderpoint_note-u
district_civic_crown-u
district_civic_crown_note-u
district_civic_meridian-u
district_civic_meridian_note-u
district_crossline_ward-u
district_crownshore_parklands-u
district_crownshore_parklands_note-u
district_driftmarrow-u
district_driftmarrow_note-u
district_glasswake_terrace-u
district_greenveil_district-u
district_greenveil_district_note-u
district_greybridge_hold-u
district_halcyon_quay-u
district_halcyon_quay_note-u
district_hollowfield-u
district_hollowfield_note-u
district_hollowspire-u
district_hollowspire_note-u
district_ironwake_flats-u
district_ironwake_flats_note-u
district_kilnreach-u
district_kilnreach_note-u
district_luminous_reliquary-u
district_luminous_reliquary_note-u
district_merchants_row-u
district_meridian_reach-u
district_meridian_reach_note-u
district_midlight-u
district_pinnacle_ward-u
district_pinnacle_ward_note-u
district_portfall_flats-u
district_portfall_flats_note-u
district_praxis_spire-u
district_praxis_spire_note-u
district_sovereign_row-u
district_spirebelt_commons-u
district_spirebelt_commons_note-u
district_spirecrest_enclaves-u
district_the_stacks-u
district_the_stacks_note-u
district_tidebreak_sector-u
district_tidebreak_sector_note-u
district_verdant_reach-u
district_verdant_reach_note-u
district_veilcrest-u
district_veilspire_hill-u
district_veilspire_hill_note-u
district_writstone_circle-u
district_writstone_circle_note-u
lifestyle-u
lifestyle_amenity_automated_kitchen-u
lifestyle_amenity_automated_kitchen_desc-u
lifestyle_amenity_bunk_configuration-u
lifestyle_amenity_bunk_configuration_desc-u
lifestyle_amenity_concierge_terminal-u
lifestyle_amenity_concierge_terminal_desc-u
lifestyle_amenity_creature_quarters-u
lifestyle_amenity_creature_quarters_desc-u
lifestyle_amenity_dreamfeed_station-u
lifestyle_amenity_dreamfeed_station_desc-u
lifestyle_amenity_gallery-u
lifestyle_amenity_gallery_desc-u
lifestyle_amenity_garden-u
lifestyle_amenity_garden_desc-u
lifestyle_amenity_home_bar-u
lifestyle_amenity_home_bar_desc-u
lifestyle_amenity_meditation_chamber-u
lifestyle_amenity_meditation_chamber_desc-u
lifestyle_amenity_private_terrace-u
lifestyle_amenity_private_terrace_desc-u
lifestyle_amenity_sauna_thermal_suite-u
lifestyle_amenity_sauna_thermal_suite_desc-u
lifestyle_amenity_sonic_suite-u
lifestyle_amenity_sonic_suite_desc-u
lifestyle_amenity_spacious_quarters-u
lifestyle_amenity_spacious_quarters_desc-u
lifestyle_amenity_veil_aquarium-u
lifestyle_amenity_veil_aquarium_desc-u
lifestyle_dt_district-u
lifestyle_dt_security-u
lifestyle_dt_tier-u
lifestyle_dt_total-u
lifestyle_feature_arcane_workspace-u
lifestyle_feature_arcane_workspace_desc-u
lifestyle_feature_armory-u
lifestyle_feature_armory_desc-u
lifestyle_feature_medical_bay-u
lifestyle_feature_medical_bay_desc-u
lifestyle_feature_panic_room-u
lifestyle_feature_panic_room_desc-u
lifestyle_feature_research_archive-u
lifestyle_feature_research_archive_desc-u
lifestyle_feature_secure_comms_hub-u
lifestyle_feature_secure_comms_hub_desc-u
lifestyle_feature_signal_dampener-u
lifestyle_feature_signal_dampener_desc-u
lifestyle_feature_slicing_station-u
lifestyle_feature_slicing_station_desc-u
lifestyle_feature_smugglers_cache-u
lifestyle_feature_smugglers_cache_desc-u
lifestyle_feature_street_contact_network-u
lifestyle_feature_street_contact_network_desc-u
lifestyle_feature_training_facility_advanced-u
lifestyle_feature_training_facility_advanced_desc-u
lifestyle_feature_training_facility_basic-u
lifestyle_feature_training_facility_basic_desc-u
lifestyle_feature_training_facility_standard-u
lifestyle_feature_training_facility_standard_desc-u
lifestyle_feature_workshop-u
lifestyle_feature_workshop_desc-u
lifestyle_monthly_budget-u
lifestyle_monthly_cost-u
lifestyle_primary_residence-u
lifestyle_safehouse_name-u
lifestyle_safehouses-u
lifestyle_sec_basic-u
lifestyle_sec_enhanced-u
lifestyle_sec_private-u
lifestyle_select_district-u
lifestyle_select_skill-u
lifestyle_select_zone-u
lifestyle_size-u
lifestyle_size_apartment-u
lifestyle_size_compound-u
lifestyle_size_residence-u
lifestyle_size_studio-u
lifestyle_skill_group_select-u
lifestyle_slots-u
lifestyle_split-u
lifestyle_tier-u
lifestyle_tier_high-u
lifestyle_tier_low-u
lifestyle_tier_luxury-u
lifestyle_tier_middle-u
lifestyle_tier_protected_enclave-u
lifestyle_tier_squatter-u
lifestyle_tier_streets-u
lifestyle_zone-u
lifestyles-u
select_sep_zone_arcology-u
select_sep_zone_ashfall-u
select_sep_zone_bay-u
select_sep_zone_core-u
select_sep_zone_fringe-u
select_sep_zone_midline-u
select_sep_zone_periphery-u
select_sep_zone_prestige-u
skill_group_combat-u
skill_group_knowledge-u
skill_group_magic-u
skill_group_physical-u
skill_group_social-u
skill_group_techcyber-u
zone_arcology-u
zone_ashfall-u
zone_bay-u
zone_core-u
zone_fringe-u
zone_midline-u
zone_periphery-u
zone_prestige-u
```

---

## 9 — Constraints and Edge Cases

**Tier/size mismatch:** Studio is unavailable at High, Luxury, Protected Enclave. When tier changes to one of these, if `lifestyle_size` is `studio`, reset size to `apartment`. Guard in `applyLifestyleTierPreset`.

**Squatter:** Treat as a single-slot studio-only. The size select should be hidden or locked to studio when tier is `squatter` or `streets`. The `slots` DataMap entry for squatter is `null` for all sizes except studio (which is `0`).

**Streets:** No safehouse. Streets characters can contribute to another character's safehouse (tracked on that character). No mechanical need to block this in the sheet; just a rules note.

**`tiers: 2` (restricted):** Write the `note_key` text to `attr_lifestyle_district_note_mdr`. Player can still select the combo; the note signals GM adjudication is needed. Do not prevent selection.

**Safehouse split ÷ N:** `safehouse_cost_mdr = Math.floor(finalCost / split)`. Guard divide-by-zero: if split ≤ 0, treat as 1.

**Slots used vs available:** `slots_used` is the sum of `lf_slots` across all installed (checkbox checked) features and amenities tagged to that location. Use a compound location key: `"primary"` or the safehouse's repeating row ID. The feature row should have a select: `attr_lf_location` with options `"primary"` and one per safehouse row (populated by `getSectionIDs("repeating_safehouses", ...)`).

**`automated_kitchen` upkeep at High+:** The apply function always writes upkeep = 400. Add a note in the `_desc-u` key that upkeep is waived at High lifestyle and above. If mechanical enforcement is desired, a `change:lifestyle_tier` watcher can zero `automated_kitchen_upkeep_mdr` when tier ≥ high. Treat as a phase 2 addition.

**`creature_quarters` upkeep range:** Store 275 (midpoint). Note in `_desc-u`: "150–400 Cr depending on species."

---

## 10 — New DataMaps Summary (add to Claude.md list)

```
lifestyleFeatureDataMap
lifestyleTierDataMap
districtDataMap
```
