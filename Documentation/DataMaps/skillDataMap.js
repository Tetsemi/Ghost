const skillDataMap = {
/* Combat */
	archery: {
		label:	"archery-u",
		base:	10,
		skill:	"archery_skill_mdr",
		bonus:	"archery_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"archery_desc-u"
	},
	dodge: {
		label:	"dodge-u",
		base:	0,
		skill:	"dodge_skill_mdr",
		bonus:	"dodge_mdr",
		group:	"combat",
		notes:	"dodge_desc-u"
	},
	gunnery: {
		label:	"gunnery-u",
		base:	10,
		skill:	"gunnery_skill_mdr",
		bonus:	"gunnery_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"gunnery_desc-u"
	},
	heavy_weapons: {
		label:	"heavy_weapons-u",
		base:	10,
		skill:	"heavy_weapons_skill_mdr",
		bonus:	"heavy_weapons_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"heavy_weapons_desc-u"
	},
	melee_weapons: {
		label:	"melee_weapons-u",
		base:	20,
		skill:	"melee_weapons_skill_mdr",
		bonus:	"melee_weapons_mdr",
		group:	[ "combat", "combat_melee" ],
		notes:	"melee_weapons_desc-u"
	},
	firearms_handgun: {
		label:	"firearms_handgun-u",
		base:	20,
		skill:	"firearms_handgun_skill_mdr",
		bonus:	"firearms_handgun_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"firearms_handgun_desc-u"
	},
	firearms_rifle:	{
		label:	"firearms_rifle-u",
		base:	25,
		skill:	"firearms_rifle_skill_mdr",
		bonus:	"firearms_rifle_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"firearms_rifle_desc-u"
	},
	firearms_shotgun:	{
		label:	"firearms_shotgun-u",
		base:	25,
		skill:	"firearms_shotgun_skill_mdr",
		bonus:	"firearms_shotgun_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"firearms_shotgun_desc-u"
	},
	firearms_smg: {
		label:	"firearms_smg-u",
		base:	15,
		skill:	"firearms_smg_skill_mdr",
		bonus:	"firearms_smg_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"firearms_smg_desc-u"
	},
	throw: {
		label:	"throw-u",
		base:	20,
		skill:	"throw_skill_mdr",
		bonus:	"throw_mdr",
		group:	[ "combat", "combat_ranged" ],
		notes:	"throw_desc-u"
	},
	unarmed: {
		label:	"unarmed-u",
		base:	25,
		skill:	"unarmed_skill_mdr",
		bonus:	"unarmed_mdr",
		group:	[ "combat", "combat_melee" ],
		notes:	"unarmed_desc-u"
	},
/* Language */
	language_own: {
		label:	"language_own-u",
		base:	75,
		skill:	"language_own_skill_mdr",
		bonus:	"language_own_mdr",
		group:	"language",
		notes:	"language_own_desc-u"
	},
	language_caltheran:	{
		label:	"language_caltheran-u",
		base:	 0,
		skill:	"language_caltheran_skill_mdr",
		bonus:	"language_caltheran_mdr",
		group:	"language",
		notes:	"language_caltheran_desc-u"
	},
	otherskill3: {
		label:	"otherskill3-u",
		base:	0,
		skill:	"otherskill3_skill_mdr",
		bonus:	"otherskill3_mdr",
		group:	"language",
		notes:	"otherskill3_desc-u"
	},
/* Magic */
	magic_alteration: {
		label:	"magic_alteration-u",
		base:	0,
		skill:	"magic_alteration_skill_mdr",
		bonus:	"magic_alteration_mdr",
		group:	"magic",
		notes:	"magic_alteration_desc-u"
	},
	magic_elemental: {
		label:	"magic_elemental-u",
		base:	0,
		skill:	"magic_elemental_skill_mdr",
		bonus:	"magic_elemental_mdr",
		group:	"magic",
		notes:	"magic_elemental_desc-u"
	},
	magic_enchantment: {
		label:	"magic_enchantment-u",
		base:	0,
		skill:	"magic_enchantment_skill_mdr",
		bonus:	"magic_enchantment_mdr",
		group:	"magic",
		notes:	"magic_enchantment_desc-u"
	},
	magic_illusion: {
		label:	"magic_illusion-u",
		base:	0,
		skill:	"magic_illusion_skill_mdr",
		bonus:	"magic_illusion_mdr",
		group:	"magic",
		notes:	"magic_illusion_desc-u"
	},
	magic_necromancy: {
		label:	"magic_necromancy-u",
		base:	0,
		skill:	"magic_necromancy_skill_mdr",
		bonus:	"magic_necromancy_mdr",
		group:	"magic",
		notes:	"magic_necromancy_desc-u"
	},
	magic_restoration: {
		label:	"magic_restoration-u",
		base:	0,
		skill:	"magic_restoration_skill_mdr",
		bonus:	"magic_restoration_mdr",
		group:	"magic",
		notes:	"magic_restoration_desc-u"
	},
	magic_summoning: {
		label:	"magic_summoning-u",
		base:	0,
		skill:	"magic_summoning_skill_mdr",
		bonus:	"magic_summoning_mdr",
		group:	"magic",
		notes:	"magic_summoning_desc-u"
	},
	magic_technomancy: {
		label:	"magic_technomancy-u",
		base:	0,
		skill:	"magic_technomancy_skill_mdr",
		bonus:	"magic_technomancy_mdr",
		group:	"magic",
		notes:	"magic_technomancy_desc-u"
	},
	magic_warding: {
		label:	"magic_warding-u",
		base:	0,
		skill:	"magic_warding_skill_mdr",
		bonus:	"magic_warding_mdr",
		group:	"magic",
		notes:	"magic_warding_desc-u"
	},
	magic_universal: {
		label:	"magic_universal-u",
		base:	0,
		skill:	"magic_universal_skill_mdr",
		bonus:	"magic_universal_mdr",
		group: 	"magic",
		notes: "magic_universal_desc-u"
	},
/* Perform */
	perform_acting: {
		label:	"perform_acting-u",
		base:	5,
		skill:	"perform_acting_skill_mdr",
		bonus:	"perform_acting_mdr",
		group:	"perform",
		notes:	"perform_acting_desc-u"
	},
	perform_dance: {
		label:	"perform_dance-u",
		base:	5,
		skill:	"perform_dance_skill_mdr",
		bonus:	"perform_dance_mdr",
		group:	"perform",
		notes:	"perform_dance_desc-u"
	},
	perform_impersonation: {
		label:	"perform_impersonation-u",
		base:	5,
		skill:	"perform_impersonation_skill_mdr",
		bonus:	"perform_impersonation_mdr",
		group:	"perform",
		notes:	"perform_impersonation_desc-u"
	},
	perform_instrument: {
		label:	"perform_instrument-u",
		base:	5,
		skill:	"perform_instrument_skill_mdr",
		bonus:	"perform_instrument_mdr",
		group:	"perform",
		notes:	"perform_instrument_desc-u"
	},
	perform_ritual: {
		label:	"perform_ritual-u",
		base:	5,
		skill:	"perform_ritual_skill_mdr",
		bonus:	"perform_ritual_mdr",
		group:	"perform",
		notes:	"perform_ritual_desc-u"
	},
	perform_vocal: {
		label:	"perform_vocal-u",
		base:	5,
		skill:	"perform_vocal_skill_mdr",
		bonus:	"perform_vocal_mdr",
		group:	"perform",
		notes:	"perform_vocal_desc-u"
	},
/* Physical */
	athletics: {
		label:	"athletics-u",
		base:	20,
		skill:	"athletics_skill_mdr",
		bonus:	"athletics_mdr",
		group:	"physical",
		notes:	"athletics_desc-u"
	},
	coordination: {
		label:	"coordination-u",
		base:	20,
		skill:	"coordination_skill_mdr",
		bonus:	"coordination_mdr",
		group:	"physical",
		notes:	"coordination_desc-u"
	},
	swim: {
		label:	"swim-u",
		base:	20,
		skill:	"swim_skill_mdr",
		bonus:	"swim_mdr",
		group:	"physical",
		notes:	"swim_desc-u" },
/* Pilot */
	drive_auto: {
		label:	"drive_auto-u",
		base:	20,
		skill:	"drive_auto_skill_mdr",
		bonus:	"drive_auto_mdr",
		group:	"pilot",
		notes:	"drive_auto_desc-u"
	},
	drone_operation: {
		label:	"drone_operation-u",
		base:	10,
		skill:	"drone_operation_skill_mdr",
		bonus:	"drone_operation_mdr",
		group:	"pilot",
		notes:	"drone_operation_desc-u"
	},
	pilotaircraft: {
		label:	"pilotaircraft-u",
		base:	1,
		skill:	"pilotaircraft_skill_mdr",
		bonus:	"pilotaircraft_mdr",
		group:	"pilot",
		notes:	"pilotaircraft_desc-u"
	},
	pilotarc: {
		label:	"pilotarc-u",
		base:	5,
		skill:	"pilotarc_skill_mdr",
		bonus:	"pilotarc_mdr",
		group:	"pilot",
		notes:	"pilotarc_desc-u"
	},
	pilotboat: {
		label:	"pilotboat-u",
		base:	1,
		skill:	"pilotboat_skill_mdr",
		bonus:	"pilotboat_mdr",
		group:	"pilot",
		notes:	"pilotboat_desc-u"
	},
/* Science */
	anthropology: {
		label:	"anthropology-u",
		base:	1,
		skill:	"anthropology_skill_mdr",
		bonus:	"anthropology_mdr",
		group:	"science",
		notes:	"anthropology_desc-u"
	},
	archaeology: {
		label:	"archaeology-u",
		base:	1,
		skill:	"archaeology_skill_mdr",
		bonus:	"archaeology_mdr",
		group:	"science",
		notes:	"archaeology_desc-u"
	},
	biology: {
		label:	"biology-u",
		base:	1,
		skill:	"biology_skill_mdr",
		bonus:	"biology_mdr",
		group:	"science",
		notes:	"biology_desc-u"
	},
	chemistry: {
		label:	"chemistry-u",
		base:	1,
		skill:	"chemistry_skill_mdr",
		bonus:	"chemistry_mdr",
		group:	"science",
		notes:	"chemistry_desc-u"
	},
	engineering: {
		label:	"engineering-u",
		base:	1,
		skill:	"engineering_skill_mdr",
		bonus:	"engineering_mdr",
		group:	"science",
		notes:	"engineering_desc-u"
	},
	physics: {
		label:	"physics-u",
		base:	1,
		skill:	"physics_skill_mdr",
		bonus:	"physics_mdr",
		group:	"science",
		notes:	"physics_desc-u"
	},
/* Knowledge */
	arcana: {
		label:	"arcana-u",
		base:	5,
		skill:	"arcana_skill_mdr",
		bonus:	"arcana_mdr",
		group:	"knowledge",
		notes:	"arcana_desc-u"
	},
	architecture: {
		label:	"architecture-u",
		base:	1,
		skill:	"architecture_skill_mdr",
		bonus:	"architecture_mdr",
		group:	"knowledge",
		notes:	"architecture_desc-u"
	},
	forbidden_lore: {
		label:	"forbidden_lore-u",
		base:	0,
		skill:	"forbidden_lore_skill_mdr",
		bonus:	"forbidden_lore_mdr",
		group:	["knowledge", "lore" ],
		notes:	"forbidden_lore_desc-u"
	},
	history: {
		label:	"history-u",
		base:	5,
		skill:	"history_skill_mdr",
		bonus:	"history_mdr",
		group:	"knowledge",
		notes:	"history_desc-u"
	},
	investigation: {
		label:	"investigation-u",
		base:	10,
		skill:	"investigation_skill_mdr",
		bonus:	"investigation_mdr",
		group:	"knowledge",
		notes:	"investigation_desc-u"
	},
	law: {
		label:	"law-u",
		base:	5,
		skill:	"law_skill_mdr",
		bonus:	"law_mdr",
		group:	"knowledge",
		notes:	"law_desc-u"
	},
	medicine: {
		label:	"medicine-u",
        base:	1,
		skill:	"medicine_skill_mdr",
		bonus:	"medicine_mdr",
		group:	"knowledge",
		notes:	"medicine_desc-u"
	},
	natural_world: {
		label: "natural_world-u",
		base: 10,
		skill: "natural_world_skill_mdr",
		bonus: "natural_world_mdr",
		group: "knowledge",
		notes: "natural_world_desc-u"
	},
	occult_lore: {
		label:	"occult_lore-u",
		base:	5,
		skill:	"occult_lore_skill_mdr",
		bonus:	"occult_lore_mdr",
		group:	[ "knowledge", "lore" ],
		notes:	"occult_lore_desc-u"
	},
	spirit_lore: {
		label:	"spirit_lore-u",
		base:	5,
		skill:	"spirit_lore_skill_mdr",
		bonus:	"spirit_lore_mdr",
		group:	["knowledge", "lore" ],
		notes:	"spirit_lore_desc-u"
	},
	tradecraft_creative: {
		label:	"tradecraft_creative-u",
		base:	5,
		skill:	"tradecraft_creative_skill_mdr",
		bonus:	"tradecraft_creative_mdr",
		group:	"knowledge",
		notes:	"tradecraft_creative_desc-u"
	},
	tradecraft_labor: {
		label:	"tradecraft_labor-u",
		base:	5,
		skill:	"tradecraft_labor_skill_mdr",
		bonus:	"tradecraft_labor_mdr",
		group:	"knowledge",
		notes:	"tradecraft_labor_desc-u"
	},
	tradecraft_media: {
		label:	"tradecraft_media-u",
		base:	5,
		skill:	"tradecraft_media_skill_mdr",
		bonus:	"tradecraft_media_mdr",
		group:	"knowledge",
		notes:	"tradecraft_media_desc-u"
	},
	veil_lore: {
		label:	"veil_lore-u",
		base:	5,
		skill:	"veil_lore_skill_mdr",
		bonus:	"veil_lore_mdr",
		group:	["knowledge", "lore" ],
		notes:	"veil_lore_desc-u"
	},
/* Social */
	bureaucracy: {
		label:	"bureaucracy-u",
		base:	5,
		skill:	"bureaucracy_skill_mdr",
		bonus:	"bureaucracy_mdr",
		group:	"social",
		notes:	"bureaucracy_desc-u"
	},
	charm: {
		label:	"charm-u",
		base:	15,
		skill:	"charm_skill_mdr",
		bonus:	"charm_mdr",
		group:	"social",
		notes:	"charm_desc-u"
	},
	deception: {
		label:	"deception-u",
		base:	5,
		skill:	"deception_skill_mdr",
		bonus:	"deception_mdr",
		group:	"social",
		notes:	"deception_desc-u"
	},
	disguise: {
		label:	"disguise-u",
		base:	5,
		skill:	"disguise_skill_mdr",
		bonus:	"disguise_mdr",
		group:	"social",
		notes:	"disguise_desc-u"
	},
	etiquette_alteri: {
		label:	"etiquette_alteri-u",
		base:	10,
		skill:	"etiquette_alteri_skill_mdr",
		bonus:	"etiquette_alteri_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_alteri_desc-u"
	},
	etiquette_draevi: {
		label:	"etiquette_draevi-u",
		base:	10,
		skill:	"etiquette_draevi_skill_mdr",
		bonus:	"etiquette_draevi_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_draevi_desc-u"
	},
	etiquette_corporate: {
		label:	"etiquette_corporate-u",
		base:	10,
		skill:	"etiquette_corporate_skill_mdr",
		bonus:	"etiquette_corporate_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_corporate_desc-u"
	},
	etiquette_high_society: {
		label:	"etiquette_high_society-u",
		base:	10,
		skill:	"etiquette_high_society_skill_mdr",
		bonus:	"etiquette_high_society_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_high_society_desc-u"
	},
	etiquette_lyranni: {
		label:	"etiquette_lyranni-u",
		base:	10,
		skill:	"etiquette_lyranni_skill_mdr",
		bonus:	"etiquette_lyranni_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_lyranni_desc-u"
	},
	etiquette_magi: {
		label:	"etiquette_magi-u",
		base:	10,
		skill:	"etiquette_magi_skill_mdr",
		bonus:	"etiquette_magi_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_magi_desc-u"
	},
	etiquette_military: {
		label:	"etiquette_military-u",
		base:	10,
		skill:	"etiquette_military_skill_mdr",
		bonus:	"etiquette_military_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_military_desc-u"
	},
	etiquette_underworld: {
		label:	"etiquette_underworld-u",
		base:	10,
		skill:	"etiquette_underworld_skill_mdr",
		bonus:	"etiquette_underworld_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_underworld_desc-u"
	},
	etiquette_other: {
		label:	"etiquette_other-u",
		base:	10,
		skill:	"etiquette_other_skill_mdr",
		bonus:	"etiquette_other_mdr",
		group:	[ "etiquette", "social" ],
		notes:	"etiquette_other_desc-u"
	},
	interrogation: {
		label:	"interrogation-u",
		base:	5,
		skill:	"interrogation_skill_mdr",
		bonus:	"interrogation_mdr",
		group:	"social",
		notes:	"interrogation_desc-u"
		},
	intimidate: {
		label:	"intimidate-u",
		base:	15,
		skill:	"intimidate_skill_mdr",
		bonus:	"intimidate_mdr",
		group:	"social",
		notes:	"intimidate_desc-u"
		},
	leadership: {
		label:	"leadership-u",
		base:	10,
		skill:	"leadership_skill_mdr",
		bonus:	"leadership_mdr",
		group:	"social",
		notes:	"leadership_desc-u"
		},
	persuade: {
		label:	"persuade-u",
		base:	10,
		skill:	"persuade_skill_mdr",
		bonus:	"persuade_mdr",
		group:	"social",
		notes:	"persuade_desc-u"
		},
	streetwise: {
		label:	"streetwise-u",
		base:	10,
		skill:	"streetwise_skill_mdr",
		bonus:	"streetwise_mdr",
		group:	"social",
		notes:	"streetwise_desc-u"
	},
/* Survival */
	animalhandling: {
		label:	"animalhandling-u",
		base:	5,
		skill:	"animalhandling_skill_mdr",
		bonus:	"animalhandling_mdr",
		group:	"survival",
		notes:	"animalhandling_desc-u"
	},
	first_aid: {
		label:	"first_aid-u",
		base:	30,
		skill:	"first_aid_skill_mdr",
		bonus:	"first_aid_mdr",
		group:	"survival",
		notes:	"first_aid_desc-u"
	},
	listen: {
		label:	"listen-u",
		base:	20,
		skill:	"listen_skill_mdr",
		bonus:	"listen_mdr",
		group:	"survival",
		notes:	"listen_desc-u"
	},
	navigate: {
		label:	"navigate-u",
		base: 	10,
		skill:	"navigate_skill_mdr",
		bonus:	"navigate_mdr",
		group:	"survival",
		notes:	"navigate_desc-u"
	},
	perception: {
		label:	"perception-u",
		base:	25,
		skill:	"perception_skill_mdr",
		bonus:	"perception_mdr",
		group:	"survival",
		notes:	"perception_desc-u"
	},
	sleight_of_hand: {
		label:	"sleight_of_hand-u",
		base:	10,
		skill:	"sleight_of_hand_skill_mdr",
		bonus:	"sleight_of_hand_mdr",
		group:	"survival",
		notes:	"sleight_of_hand_desc-u"
	},
	insight: {
		label:	"insight-u",
		base:	10,
		skill:	"insight_skill_mdr",
		bonus:	"insight_mdr",
		group:	"survival",
		notes:	"insight_desc-u"
		},
	stealth: {
		label:	"stealth-u",
		base:	20,
		skill:	"stealth_skill_mdr",
		bonus:	"stealth_mdr",
		group:	"survival",
		notes:	"stealth_desc-u"
	},
	survival_urban: {
		label:	"survival_urban-u",
		base:	10,
		skill:	"survival_urban_skill_mdr",
		bonus:	"survival_urban_mdr",
		group:	"survival",
		notes:	"survival_urban_desc-u"
	},
	survival_veil_touched: {
		label:	"survival_veil_touched-u",
		base:	10,
		skill:	"survival_veil_touched_skill_mdr",
		bonus:	"survival_veil_touched_mdr",
		group:	"survival",
		notes:	"survival_veil_touched_desc-u"
	},
	survival_wilderness: {
		label:	"survival_wilderness-u",
		base:	10,
		skill:	"survival_wilderness_skill_mdr",
		bonus:	"survival_wilderness_mdr",
		group:	"survival",
		notes:	"survival_wilderness_desc-u"
	},
	track: {
		label:	"track-u",
		base:	10,
		skill:	"track_skill_mdr",
		bonus:	"track_mdr",
		group:	"survival",
		notes:	"track_desc-u"
	},
/* Tech/Cyber */
	arcanotech: {
		label:	"arcanotech-u",
		base: 	1,
		skill:	"arcanotech_skill_mdr",
		bonus:	"arcanotech_mdr",
		group:	"techcyber",
		notes:	"arcanotech_desc-u"
	},
	computer_use: {
		label:	"computer_use-u",
		base:	10,
		skill:	"computer_use_skill_mdr",
		bonus:	"computer_use_mdr",
		group:	"techcyber",
		notes:	"computer_use_desc-u"
	},
	cybernetics: {
		label:	"cybernetics-u",
		base:	1,
		skill:	"cybernetics_skill_mdr",
		bonus:	"cybernetics_mdr",
		group:	"techcyber",
		notes:	"cybernetics_desc-u"
	},
	demolitions: {
		label:	"demolitions-u",
		base:	1,
		skill:	"demolitions_skill_mdr",
		bonus:	"demolitions_mdr",
		group:	"techcyber",
		notes:	"demolitions_desc-u"
	},
	electronics: {
		label: "electronics-u",
		base: 10,
		skill: "electronics_skill_mdr",
		bonus: "electronics_mdr",
		group: "techcyber",
		notes: "electronics_desc-u"
	},
	forgery: {
		label:	"forgery-u",
		base:	1,
		skill:	"forgery_skill_mdr",
		bonus:	"forgery_mdr",
		group:	"techcyber",
		notes:	"forgery_desc-u"
		},
	mechanics: {
		label:	"mechanics-u",
		base:	10,
		skill:	"mechanics_skill_mdr",
		bonus:	"mechanics_mdr",
		group:	"techcyber",
		notes:	"mechanics_desc-u"
	},
	security: {
		label:	"security-u",
		base:	1,
		skill:	"security_skill_mdr",
		bonus:	"security_mdr",
		group:	"techcyber",
		notes:	"security_desc-u"
		},
	slicing: {
		label:	"slicing-u",
		base:	5,
		skill:	"slicing_skill_mdr",
		bonus:	"slicing_mdr",
		group:	"techcyber",
		notes:	"slicing_desc-u"
	}
};
