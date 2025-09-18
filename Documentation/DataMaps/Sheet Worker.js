<!-- WORKERS -->
<script type="text/worker">
const debug_on = false;
const debug_on_trace = false;
const debug_on_watcher = false;

const registeredRaces = new Set();
let talentWatchersRegistered = false;
let backgroundTalentWatchersRegistered = false;

// === Unified guard utilities (single source of truth) ===
let IS_BOOTSTRAPPING = false;   // short, synchronous batches
let SILENT_DEPTH = 0;           // async-safe silencing across setAttrs bursts

const beginSilent = () => { SILENT_DEPTH += 1; };
const endSilent   = () => { SILENT_DEPTH = Math.max(0, SILENT_DEPTH - 1); };

// Use this in ALL watcher callbacks
const guarded = (fn) => (...args) => {
  if (IS_BOOTSTRAPPING || SILENT_DEPTH > 0) return;
  fn(...args);
};

on("sheet:opened", function () {
	if (debug_on_trace) console.log("[sheet:opened] Translation");

	const translationFields = [
		"str_txt", "dex_txt", "pow_txt", "con_txt", "app_txt", "edu_txt", "siz_txt", "int_txt", "mag_txt", "luck_txt",
		"animalhandling_txt", "anthropology_txt", "arcana_txt", "archaeology_txt", "archanotech_txt", "archery_txt", "architecture_txt", "biology_txt", "bureaucracy_txt",
		"chant_txt", "charm_txt", "chemistry_txt", "climb_txt", "computer_use_txt", "creditrating_txt", "cthulhumythos_txt",
		"cybernetics_txt", "dance_txt", "demolitions_txt", "disguise_txt", "deception_txt", "dodge_txt", "drive_auto_txt",
		"drone_operation_txt", "elecrepair_txt", "engineering_txt", "etiquette_high_society_txt", "etiquette_lyranni_txt", "etiquette_underworld_txt",
		"fasttalk_txt", "fighting_brawl_txt", "firearms_hg_txt", "firearms_rifle_txt", "firearms_smg_txt", "first_aid_txt", "forbidden_lore_txt",
		"forgery_txt", "gunnery_txt", "heavy_weapons_txt", "history_txt", "impersonation_txt", "instrument_txt",
		"intimidate_txt", "interrogation_txt", "insight_txt", "investigation_txt", "jump_txt", "law_txt", "leadership_txt", "libraryuse_txt",
		"listen_txt", "locksmith_txt", "magic_alteration_txt", "magic_elemental_txt", "magic_enchantment_txt",
		"magic_illusion_txt", "magic_necromancy_txt", "magic_restoration_txt", "magic_summoning_txt", "magic_technomancy_txt",
		"magic_warding_txt", "magic_universal_txt", "mechrepair_txt", "mechanics_txt", "medicine_txt", "melee_weapons_txt",
		"naturalworld_txt", "navigate_txt", "occult_txt", "ophvmachine_txt", "perception_txt", "persuade_txt", "physics_txt",
		"pilotaircraft_txt", "pilotarc_txt", "pilotboat_txt", "psychology_txt", "psychoanalysis_txt", "ride_txt", "security_txt",
		"singing_txt", "sleightofhand_txt", "slicing_txt", "spirit_lore_txt", "spothidden_txt", "stealth_txt", "streetwise_txt",
		"survival_wilderness_txt", "athletics_txt", "coordination_txt", "swim_txt", "throw_txt", "track_txt", "unarmed_txt", "veil_lore_txt",
		"electronics_txt", "etiquette_alteri_txt", "etiquette_other_txt", "survival_urban_txt",
		"perform_acting_txt", "perform_dance_txt", "perform_impersonation_txt", "perform_instrument_txt", "perform_vocal_txt"
	];

	// Special-case keys that don't follow the default "<base>-r-txt" pattern
	const EXCEPTIONS = {
		luck_txt: "luck-u",
		unarmed_txt: "unarmed-z",
		str_txt: "STR-r-txt",
		dex_txt: "DEX-r-txt",
		pow_txt: "POW-r-txt",
		con_txt: "CON-r-txt",
		app_txt: "APP-r-txt",
		edu_txt: "EDU-r-txt",
		siz_txt: "SIZ-r-txt",
		int_txt: "INT-r-txt",
		mag_txt: "MAG-r-txt"
	};

	getAttrs(translationFields, values => {
		const updates = {};
		const missing = [];

		translationFields.forEach(field => {
			const base = field.replace(/_txt$/, "");
			// Prefer exception key, otherwise try "<base>-r-txt" then "<base>-u"
			const candidates = EXCEPTIONS[field]
				? [EXCEPTIONS[field]]
				: [`${base}-r-txt`, `${base}-u`];

			let text = "";
			for (let i = 0; i < candidates.length; i++) {
				const t = getTranslationByKey(candidates[i]);
				if (t) { text = t; break; }
			}

			if (!text) {
				missing.push(field);
				return;
			}
			if (values[field] !== text) {
				updates[field] = text;
			}
		});

		if (Object.keys(updates).length > 0) {
			setAttrs(updates);
		}

		if (missing.length && typeof debug_on !== "undefined" && debug_on) {
			console.warn("[sheet:opened] Missing i18n keys for:", missing.join(", "));
		}
	});
});

// Maps //

const skillMapTable = {
 /* Combat */
 "Archery": 				{ label: "archery", base: "10", skill: "archery_skill_mdr", bonus: "archery_mdr", group: "Combat", notes: "Archery" },
 "Dodge (DEX/2)": 			{ label: "dodge", base: "0", skill: "dodge_skill_mdr", bonus: "dodge_mdr", group: "Combat", notes: "Half of your DEX score" },
 "Gunnery": 				{ label: "gunnery", base: "10", skill: "gunnery_skill_mdr", bonus: "gunnery_mdr", group: "Combat", notes: "Vehicle-mounted or automated weapons" },
 "Heavy Weapons": 			{ label: "heavy_weapons", base: "10", skill: "heavy_weapons_skill_mdr", bonus: "heavy_weapons_mdr", group: "Combat", notes: "Heavy Weapons" },
 "Melee Weapons": 			{ label: "melee_weapons", base: "20", skill: "melee_weapons_skill_mdr", bonus: "melee_weapons_mdr", group: "Combat", notes: "Melee Weapons" },
 "Pistols": 				{ label: "firearms_handgun", base: "20", skill: "firearms_handgun_skill_mdr", bonus: "firearms_handgun_mdr", group: "Combat", notes: "Pistols" },
 "Rifles/Shotguns": 		{ label: "firearms_rifle", base: "25", skill: "firearms_rifle_skill_mdr", bonus: "firearms_rifle_mdr", group: "Combat", notes: "Rifles/Shotguns" },
 "Submachine Guns (SMGs)": 	{ label: "firearms_smg", base: "15", skill: "firearms_smg_skill_mdr", bonus: "firearms_smg_mdr", group: "Combat", notes: "Submachine Guns (SMGs)" },
 "Thrown Weapons": 			{ label: "throw", base: "20", skill: "throw_skill_mdr", bonus: "throw_mdr", group: "Combat", notes: "Thrown Weapons" },
 "Unarmed": 				{ label: "unarmed", base: "25", skill: "unarmed_skill_mdr", bonus: "unarmed_mdr", group: "Combat", notes: "Unarmed combat" },
 /* Language */
 "Language(Racial)": 	{ label: "language_own", base: "75", skill: "language_own_skill_mdr", bonus: "language_own_mdr", group: "Language", notes: "Racial Language" },
 "Language(Caltheran)": { label: "language_caltheran", base: "0", skill: "language_caltheran_skill_mdr", bonus: "language_caltheran_mdr", group: "Language", notes: "Calthern language" },
 "Language(Other)": { label: "otherskill3", base: "0", skill: "otherskill3_skill_mdr", bonus: "otherskill3_mdr", group: "Language", notes: "Other language" },
 /* Magic */
 "Alteration": 		{ label: "magic_alteration", base: "0", skill: "magic_alteration_skill_mdr", bonus: "magic_alteration_mdr", group: "Magic", notes: "Enhances physical attributes or alters the physical world. Includes speed, strength, resilience, and spatial shifts." },
 "Elemental": 		{ label: "magic_elemental", base: "0", skill: "magic_elemental_skill_mdr", bonus: "magic_elemental_mdr", group: "Magic", notes: "The art of shaping and controlling natural elements such as fire, water, air, and earth through arcane force. Focuses on raw power and environmental manipulation." },
 "Enchantment": 	{ label: "magic_enchantment", base: "0", skill: "magic_enchantment_skill_mdr", bonus: "magic_enchantment_mdr", group: "Magic", notes: "Mental influencing magic that alters thoughts, emotions, or behavior. Includes charms, compulsions, and emotional sway." },
 "Illusion": 		{ label: "magic_illusion", base: "0", skill: "magic_illusion_skill_mdr", bonus: "magic_illusion_mdr", group: "Magic", notes: "Magic of trickery and perception. Creates false images, alters appearances, or hides things through manipulation of the senses." },
 "Necromancy": 		{ label: "magic_necromancy", base: "0", skill: "magic_necromancy_skill_mdr", bonus: "magic_necromancy_mdr", group: "Magic", notes: "Manipulates the forces of death and the soul. Involves raising the dead, draining life, or communicating with spirits of the deceased." },
 "Restoration": 	{ label: "magic_restoration", base: "0", skill: "magic_restoration_skill_mdr", bonus: "magic_restoration_mdr", group: "Magic", notes: "Healing, cleansing, and regeneration magic that mends wounds, purifies corruption, or restores vitality." },
 "Summoning": 		{ label: "magic_summoning", base: "0", skill: "magic_summoning_skill_mdr", bonus: "magic_summoning_mdr", group: "Magic", notes: "Calls forth spirits, creatures, or arcane constructs from beyond to aid, defend, or serve the caster." },
 "Technomancy": 	{ label: "magic_technomancy", base: "0", skill: "magic_technomancy_skill_mdr", bonus: "magic_technomancy_mdr", group: "Magic", notes: "The fusion of magic with technology. Enables interaction with archanotech, digital constructs, and spell-driven machines." },
 "Warding": 		{ label: "magic_warding", base: "0", skill: "magic_warding_skill_mdr", bonus: "magic_warding_mdr", group: "Magic", notes: "Protective magic used to shield, block, or dispel incoming threats both physical and magical." },
 "Universal": 		{ label: "magic_universal", base: "0", skill: "magic_universal_skill_mdr", bonus: "magic_universal_mdr", group: "Magic", notes: "Covers basic arcane techniques used across traditions detecting, sensing, or disrupting magical phenomena." },
 /* Perform */ 
 "Perform Acting": 			{ label: "perform_acting", base: "5", skill: "perform_acting_skill_mdr", bonus: "perform_acting_mdr", group: "Perform", notes: "Acting" },
 "Perform Dance": 			{ label: "perform_dance", base: "5", skill: "perform_dance_skill_mdr", bonus: "perform_dance_mdr", group: "Perform", notes: "Dance" },
 "Perform Impersonation": 	{ label: "perform_impersonation", base: "5", skill: "perform_impersonation_skill_mdr", bonus: "perform_impersonation_mdr", group: "Perform", notes: "Impersonation" },
 "Perform Instrument": 		{ label: "perform_instrument", base: "5", skill: "perform_instrument_skill_mdr", bonus: "perform_instrument_mdr", group: "Perform", notes: "Instrument" },
 "Perform Vocal": 			{ label: "perform_vocal", base: "5", skill: "perform_vocal_skill_mdr", bonus: "perform_vocal_mdr", group: "Perform", notes: "Vocal" },
 /* Physical */
 "Athletics": 		{ label: "athletics", base: "20", skill: "athletics_skill_mdr", bonus: "athletics_mdr", group: "Physical", notes: "Running, jumping, climbing, endurance" },
 "Coordination": 	{ label: "coordination", base: "20", skill: "coordination_skill_mdr", bonus: "coordination_mdr", group: "Physical", notes: "Balance, agility, acrobatics" },
 "Swim": 			{ label: "swim", base: "20", skill: "swim_skill_mdr", bonus: "swim_mdr", group: "Physical", notes: "Swim" },
 /* Pilot */
 "Drive (Ground Vehicles)": { label: "drive_auto", base: "20", skill: "drive_auto_skill_mdr", bonus: "drive_auto_mdr", group: "Pilot", notes: "Drive (Ground Vehicles)" },
 "Drone Operation": 		{ label: "drone_operation", base: "10", skill: "drone_operation_skill_mdr", bonus: "drone_operation_mdr", group: "Pilot", notes: "Drone Operation" },
 "Pilot (Aircraft)":		{ label: "pilotaircraft", base: "1", skill: "pilotaircraft_skill_mdr", bonus: "pilotaircraft_mdr", group: "Pilot", notes: "Pilot (Aircraft)" },
 "Pilot (ARC)":				{ label: "pilotarc", base: "5", skill: "pilotarc_skill_mdr", bonus: "pilotarc_mdr", group: "Pilot", notes: "Pilot (ARC)" },
 "Pilot (Boat)":   			{ label: "pilotboat", base: "1", skill: "pilotboat_skill_mdr", bonus: "pilotboat_mdr", group: "Pilot", notes: "Pilot (Boat)" },
 /* Science */
 "Alchemy":         { label: "alchemy",         base: "1",  skill: "alchemy_skill_mdr",         bonus: "alchemy_mdr",         group: "Science",  notes: "Science (Alchemy)" },
 "Anthropology":    { label: "anthropology",    base: "1",  skill: "anthropology_skill_mdr",    bonus: "anthropology_mdr",    group: "Science",  notes: "Science (Anthropology)" },
 "Archaeology":     { label: "archaeology",     base: "1",  skill: "archaeology_skill_mdr",     bonus: "archaeology_mdr",     group: "Science",  notes: "Science (Archaeology)" },
 "Biology":         { label: "biology",         base: "1",  skill: "biology_skill_mdr",         bonus: "biology_mdr",         group: "Science",  notes: "Science (Biology)" },
 "Chemistry":       { label: "chemistry",       base: "1",  skill: "chemistry_skill_mdr",       bonus: "chemistry_mdr",       group: "Science",  notes: "Science (Chemistry)" },
 "Engineering":     { label: "engineering",     base: "1",  skill: "engineering_skill_mdr",     bonus: "engineering_mdr",     group: "Science",  notes: "Science (Engineering)" },
 "Physics":         { label: "physics",         base: "1",  skill: "physics_skill_mdr",         bonus: "physics_mdr",         group: "Science",  notes: "Science (Physics)" },
 /* Knowledge */
 "Arcana":          { label: "arcana",          base: "5",  skill: "arcana_skill_mdr",          bonus: "arcana_mdr",          group: "Knowledge", notes: "Understanding of magical theory and principles" },
 "Architecture":    { label: "architecture",    base: "1",  skill: "architecture_skill_mdr",    bonus: "architecture_mdr",    group: "Knowledge", notes: "Architecture and built environments" },
 "Forbidden Lore":  { label: "forbidden_lore",  base: "0",  skill: "forbidden_lore_skill_mdr",  bonus: "forbidden_lore_mdr",  group: "Knowledge", notes: "Cosmic horrors, veiled truths" },
 "History":         { label: "history",         base: "5",  skill: "history_skill_mdr",         bonus: "history_mdr",         group: "Knowledge", notes: "History" },
 "Investigation":   { label: "investigation",   base: "10", skill: "investigation_skill_mdr",   bonus: "investigation_mdr",   group: "Knowledge", notes: "Used to reconstruct events, analyze clues, interpret evidence, and solve mysteries." },
 "Law":             { label: "law",             base: "5",  skill: "law_skill_mdr",             bonus: "law_mdr",             group: "Knowledge", notes: "Law" },
 "Medicine":        { label: "medicine",        base: "1",  skill: "medicine_skill_mdr",        bonus: "medicine_mdr",        group: "Knowledge", notes: "Medicine" },
 "Natural World":   { label: "natural_world",   base: "10", skill: "natural_world_skill_mdr",   bonus: "natural_world_mdr",   group: "Knowledge", notes: "Natural World" },
 "Occult Lore":     { label: "occult",          base: "5",  skill: "occult_skill_mdr",          bonus: "occult_mdr",          group: "Knowledge", notes: "Non-practitioner knowledge of magic and the supernatural" },
 "Spirit Lore":     { label: "spirit_lore",     base: "5",  skill: "spirit_lore_skill_mdr",     bonus: "spirit_lore_mdr",     group: "Knowledge", notes: "Spirit Lore" },
 "Veil Lore":       { label: "veil_lore",       base: "5",  skill: "veil_lore_skill_mdr",       bonus: "veil_lore_mdr",       group: "Knowledge", notes: "Veil Lore" },
 /* Social */
 "Bureaucracy": 				{ label: "bureaucracy", base: "5", skill: "bureaucracy_skill_mdr", bonus: "bureaucracy_mdr", group: "Social", notes: "Understanding and navigating administrative, legal, and governmental systems." },
 "Charm": 						{ label: "charm", base: "15", skill: "charm_skill_mdr", bonus: "charm_mdr", group: "Social", notes: "Charm" },
 "Deception": 					{ label: "deception", base: "5", skill: "deception_skill_mdr", bonus: "deception_mdr", group: "Social", notes: "Deception" },
 "Disguise": 					{ label: "disguise", base: "5", skill: "disguise_skill_mdr", bonus: "disguise_mdr", group: "Social", notes: "Disguise" },
 "Etiquette (Alteri)": 			{ label: "etiquette_alteri", base: "10", skill: "etiquette_alteri_skill_mdr", bonus: "etiquette_alteri_mdr", group: "Social", notes: "Etiquette (Alteri)" },
 "Etiquette (High Society)": 	{ label: "etiquette_high_society", base: "10", skill: "etiquette_high_society_skill_mdr", bonus: "etiquette_high_society_mdr", group: "Social", notes: "Etiquette (High Society)" },
 "Etiquette (Lyranni)": 		{ label: "etiquette_lyranni", base: "10", skill: "etiquette_lyranni_skill_mdr", bonus: "etiquette_lyranni_mdr", group: "Social", notes: "Etiquette (Lyranni)" },
 "Etiquette (Underworld)": 		{ label: "etiquette_underworld", base: "10", skill: "etiquette_underworld_skill_mdr", bonus: "etiquette_underworld_mdr", group: "Social",  notes: "Etiquette (Underworld)" },		
 "Etiquette (Other)": 			{ label: "etiquette_other", base: "10", skill: "etiquette_other_skill_mdr", bonus: "etiquette_other_mdr", group: "Social", notes: "Etiquette may be specialized: (Corporate), (Military), (Racial), etc." },
 "Leadership":					{ label: "leadership", base: "10", skill: "leadership_skill_mdr", bonus: "leadership_mdr", group: "Social", notes: "Leadership" },
 "Forgery": 					{ label: "forgery", base: "1", skill: "forgery_skill_mdr", bonus: "forgery_mdr", group: "Social", notes: "Creating falsified documents, IDs, credentials physical or digital." },
 "Insight": 					{ label: "insight", base: "10", skill: "insight_skill_mdr", bonus: "insight_mdr", group: "Social", notes: "Insight" },
 "Intimidate": 					{ label: "intimidate", base: "15", skill: "intimidate_skill_mdr", bonus: "intimidate_mdr", group: "Social", notes: "Lying, bluffing, maintaining covers, and creating false narratives across a wide range of scenarios." },
 "Interrogation": 				{ label: "interrogation", base: "5", skill: "interrogation_skill_mdr", bonus: "interrogation_mdr", group: "Social", notes: "Extracting information through questioning, pressure, or manipulation." },
 "Persuade": 					{ label: "persuade", base: "10", skill: "persuade_skill_mdr", bonus: "persuade_mdr", group: "Social", notes: "Persuade" },
 "Streetwise": 					{ label: "streetwise", base: "10", skill: "streetwise_skill_mdr", bonus: "streetwise_mdr", group: "Social", notes: "Streetwise" },
 /* Survival */
 "Animal Handling": 		{ label: "animalhandling", base: "5", skill: "animalhandling_skill_mdr", bonus: "animalhandling_mdr", group: "Survival", notes: "Animal Handling" },
 "First Aid": 				{ label: "first_aid", base: "30", skill: "first_aid_skill_mdr", bonus: "first_aid_mdr", group: "Survival", notes: "First Aid" },
 "Listen":				 	{ label: "listen", base: "20", skill: "listen_skill_mdr", bonus: "listen_mdr", group: "Survival", notes: "Listen" },
 "Navigate": 				{ label: "navigate", base: "10", skill: "navigate_skill_mdr", bonus: "navigate_mdr", group: "Survival", notes: "Navigate" },
 "Perception": 				{ label: "perception", base: "25", skill: "perception_skill_mdr", bonus: "perception_mdr", group: "Survival", notes: "Perception" },
 "Sleight of Hand": 		{ label: "sleight_of_hand", base: "10", skill: "sleight_of_hand_skill_mdr", bonus: "sleight_of_hand_mdr", group: "Survival", notes: "Sleight of Hand" },
 "Stealth": 				{ label: "stealth", base: "20", skill: "stealth_skill_mdr", bonus: "stealth_mdr", group: "Survival", notes: "Stealth" },
 "Survival (Urban)": 		{ label: "survival_urban", base: "10", skill: "survival_urban_skill_mdr", bonus: "survival_urhan_mdr", group: "Survival", notes: "Survival (Urban)" },
 "Survival (Wilderness)":	{ label: "survival_wilderness", base: "10", skill: "survival_wilderness_skill_mdr", bonus: "survival_wilderness_mdr", group: "Survival", notes: "Survival (Wilderness)" },
 "Track": 					{ label: "track", base: "10", skill: "track_skill_mdr", bonus: "track_mdr", group: "Survival", notes: "Track" },
 /* Tech/Cyber */
 "Archanotech": 		{ label: "archanotech", base: "1", skill: "archanotech_skill_mdr", bonus: "archanotech_mdr", group: "Tech/Cyber", notes: "Construction, repair, and interfacing with arcane-tech hybrids" },
 "Computer Use": 		{ label: "computer_use", base: "10", skill: "computer_use_skill_mdr", bonus: "computer_use_mdr", group: "Tech/Cyber", notes: "General software and system operation" },
 "Cybernetics": 		{ label: "cybernetics", base: "1", skill: "cybernetics_skill_mdr", bonus: "cybernetics_mdr", group: "Tech/Cyber", notes: "Installing and maintaining cyberware" },
 "Demolitions": 		{ label: "demolitions", base: "1", skill: "demolitions_skill_mdr", bonus: "demolitions_mdr", group: "Tech/Cyber", notes: "Demolitions" },
 "Electronics": 		{ label: "electronics", base: "10", skill: "electronics_skill_mdr", bonus: "electronics_mdr", group: "Tech/Cyber", notes: "circuitry, electronic repair" },
 "Mechanics": 			{ label: "mechanics", base: "10", skill: "mechanics_skill_mdr", bonus: "mechanics_mdr", group: "Tech/Cyber", notes: "Mechanics" },
 "Security Systems": 	{ label: "security", base: "1", skill: "security_skill_mdr", bonus: "security_mdr", group: "Tech/Cyber", notes: "Understanding and bypassing surveillance, sensors, magitech security, and physical/digital alarm systems." },
 "Slicing": 			{ label: "slicing", base: "5", skill: "slicing_skill_mdr", bonus: "slicing_mdr", group: "Tech/Cyber", notes: "Digital infiltration, cybersecurity" } 
};

/* ===== Perks Data Map (i18n) ===== */
const perkDataMap = {
    blood_born_survivor: {
        name: "perk_blood_born_survivor-u",
        flavor: "perk_blood_born_survivor_flavor-u",
        description: "perk_blood_born_survivor_description-u",
        cost: 15,
        usage_limit: ["scene", "session"]
    },
    combat_veteran: {
        name: "perk_combat_veteran-u",
        flavor: "perk_combat_veteran_flavor-u",
        description: "perk_combat_veteran_description-u",
        cost: 10,
        usage_limit: "session"
    },
    corp_groomed: {
        name: "perk_corp_groomed-u",
        flavor: "perk_corp_groomed_flavor-u",
        description: "perk_corp_groomed_description-u",
        cost: 10,
        usage_limit: "session"
    },
    danger_sense: {
        name: "perk_danger_sense-u",
        flavor: "perk_danger_sense_flavor-u",
        description: "perk_danger_sense_description-u",
        cost: 15,
        usage_limit: "session"
    },
    dirty_fighter: {
        name: "perk_dirty_fighter-u",
        flavor: "perk_dirty_fighter_flavor-u",
        description: "perk_dirty_fighter_description-u",
        cost: 10,
        usage_limit: "scene"
    },
    forgettable_presence: {
        name: "perk_forgettable_presence-u",
        flavor: "perk_forgettable_presence_flavor-u",
        description: "perk_forgettable_presence_description-u",
        cost: 10,
        usage_limit: ""
    },
    linguist: {
        name: "perk_linguist-u",
        flavor: "perk_linguist_flavor-u",
        description: "perk_linguist_description-u",
        cost: 10,
        usage_limit: ""
    },
    mind_leash: {
        name: "perk_mind_leash-u",
        flavor: "perk_mind_leash_flavor-u",
        description: "perk_mind_leash_description-u",
        cost: 15,
        usage_limit: "session"
    },
    photographic_recall: {
        name: "perk_photographic_recall-u",
        flavor: "perk_photographic_recall_flavor-u",
        description: "perk_photographic_recall_description-u",
        cost: 10,
        usage_limit: ""
    },
    resilient_frame: {
        name: "perk_resilient_frame-u",
        flavor: "perk_resilient_frame_flavor-u",
        description: "perk_resilient_frame_description-u",
        cost: 10,
        usage_limit: ""
    },
    scorched_soul: {
        name: "perk_scorched_soul-u",
        flavor: "perk_scorched_soul_flavor-u",
        description: "perk_scorched_soul_description-u",
        cost: 10,
        usage_limit: ""
    },
    shadow_mark: {
        name: "perk_shadow_mark-u",
        flavor: "perk_shadow_mark_flavor-u",
        description: "perk_shadow_mark_description-u",
        cost: 15,
        usage_limit: ""
    },
    tactical_instinct: {
        name: "perk_tactical_instinct-u",
        flavor: "perk_tactical_instinct_flavor-u",
        description: "perk_tactical_instinct_description-u",
        cost: 15,
        usage_limit: "session"
    },
    veil_drenched_intuition: {
        name: "perk_veil_drenched_intuition-u",
        flavor: "perk_veil_drenched_intuition_flavor-u",
        description: "perk_veil_drenched_intuition_description-u",
        cost: 15,
        usage_limit: "session"
    }
};

/* ===== Flaws Data Map (i18n) ===== */
const flawDataMap = {
    addiction_major: {
        name: "flaw_addiction_major-u",
        flavor: "flaw_addiction_major_flavor-u",
        description: "flaw_addiction_major_description-u",
        cost: 10,
        usage_limit: ""
    },
    addiction_minor: {
        name: "flaw_addiction_minor-u",
        flavor: "flaw_addiction_minor_flavor-u",
        description: "flaw_addiction_minor_description-u",
        cost: 5,
        usage_limit: ""
    },
    compulsive_gambler: {
        name: "flaw_compulsive_gambler-u",
        flavor: "flaw_compulsive_gambler_flavor-u",
        description: "flaw_compulsive_gambler_description-u",
        cost: 5,
        usage_limit: ""
    },
    cyber_rejection: {
        name: "flaw_cyber_rejection-u",
        flavor: "flaw_cyber_rejection_flavor-u",
        description: "flaw_cyber_rejection_description-u",
        cost: 5,
        usage_limit: ""
    },
    distinctive_look: {
        name: "flaw_distinctive_look-u",
        flavor: "flaw_distinctive_look_flavor-u",
        description: "flaw_distinctive_look_description-u",
        cost: 5,
        usage_limit: ""
    },
    hunted: {
        name: "flaw_hunted-u",
        flavor: "flaw_hunted_flavor-u",
        description: "flaw_hunted_description-u",
        cost: 10,
        usage_limit: "session" // GM may introduce a threat once per session
    },
    mental_scar: {
        name: "flaw_mental_scar-u",
        flavor: "flaw_mental_scar_flavor-u",
        description: "flaw_mental_scar_description-u",
        cost: 10,
        usage_limit: "session" // at least once per session if thematically possible
    },
    soul_flare: {
        name: "flaw_soul_flare-u",
        flavor: "flaw_soul_flare_flavor-u",
        description: "flaw_soul_flare_description-u",
        cost: 10,
        usage_limit: "scene" // once per scene surge check
    },
    veil_touched: {
        name: "flaw_veil_touched-u",
        flavor: "flaw_veil_touched_flavor-u",
        description: "flaw_veil_touched_description-u",
        cost: 5,
        usage_limit: ""
    },
    wanted_low_priority: {
        name: "flaw_wanted_low_priority-u",
        flavor: "flaw_wanted_low_priority_flavor-u",
        description: "flaw_wanted_low_priority_description-u",
        cost: 5,
        usage_limit: "session" // GM may introduce interference once per session
    }
};

const raceDataMap = {
  "alteri": {
    label: "Alteri",
    language: "Nualeth",
    stats: {
      str: { base: 15, max: 75 }, dex: { base: 15, max: 80 }, con: { base: 15, max: 75 },
      siz: { base: 40, max: 80 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 85 }, app: { base: 15, max: 85 }, mag: { base: 0, max: 80 }
    },
	traits: {
	  group_label_key: "senses_and_racial_traits-u",
	  items: {
		arcane_sensitivity: {
		  name_key:        "racial_alteri_arcane_sensitivity-u",
		  rule_text_key:   "racial_alteri_arcane_sensitivity_rules-u",
		  usage_limit:     "session"
		},	  
		empathic_instinct: {
		  name_key:        "racial_alteri_empathic_instinct-u",
		  rule_text_key:   "racial_alteri_empathic_instinct_rules-u",
		  usage_limit:     "scene"
		},
		fixed_tell: {
		  name_key:        "racial_alteri_fixed_tell-u",
		  rule_text_key:   "racial_alteri_fixed_tell_rules-u"
		},
		shifting_form: {
		  name_key:        "racial_alteri_shifting_form-u",
		  rule_text_key:   "racial_alteri_shifting_form_rules-u"
        }
	  }
	}
  },
  "draevi": {
    label: "Draevi",
    language: "Khevala",
    stats: {
      str: { base: 15, max: 70 }, dex: { base: 15, max: 80 }, con: { base: 15, max: 90 },
      siz: { base: 40, max: 80 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 80 }
    },
	traits: {
  	  group_label_key: "senses_and_racial_traits-u",
      items: {
        instinctive_balance: {
          name_key:      "racial_draevi_instinctive_balance-u",
          rule_text_key: "racial_draevi_instinctive_balance_rules-u",
		  usage_limit:     "scene"
        },
        keen_environmental_awareness: {
          name_key:      "racial_draevi_keen_environmental_awareness-u",
          rule_text_key: "racial_draevi_keen_environmental_awareness_rules-u"
        },
        low_light_vision: {
          name_key:      "racial_draevi_low_light_vision-u",
          rule_text_key: "racial_draevi_low_light_vision_rules-u"
        },
        primal_resilience: {
          name_key:      "racial_draevi_primal_resilience-u",
          rule_text_key: "racial_draevi_primal_resilience_rules-u"
        },
        tattooed_memory: {
          name_key:      "racial_draevi_tattooed_memory-u",
          rule_text_key: "racial_draevi_tattooed_memory_rules-u"
        }
      }
    }
  },
  "feran": {
    label: "Feran",
    language: "Halvrenn",
    stats: {
      str: { base: 15, max: 80 }, dex: { base: 15, max: 90 }, con: { base: 15, max: 80 },
      siz: { base: 35, max: 70 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 80 }
    },
    traits: {
      group_label_key: "senses_and_racial_traits-u",
      items: {
        natural_weapons: {
          name_key:      "racial_feran_natural_weapons-u",
          rule_text_key: "racial_feran_natural_weapons_rules-u"
        },
        night_honed_vision: {
          name_key:      "racial_feran_night_honed_vision-u",
          rule_text_key: "racial_feran_night_honed_vision_rules-u"
        },
        pack_instinct: {
          name_key:      "racial_feran_pack_instinct-u",
          rule_text_key: "racial_feran_pack_instinct_rules-u",
		  usage_limit:     "scene"
        },
        predator_reflexes: {
          name_key:      "racial_feran_predator_reflexes-u",
          rule_text_key: "racial_feran_predator_reflexes_rules-u",
		  usage_limit:     "session"
        },
        wallrunners_grace: {
          name_key:      "racial_feran_wallrunners_grace-u",
          rule_text_key: "racial_feran_wallrunners_grace_rules-u"
        }
      }
    }
  },
  "human": {
    label: "Human",
    language: "Caltheran",
    stats: {
      str: { base: 15, max: 80 }, dex: { base: 15, max: 80 }, con: { base: 15, max: 80 },
      siz: { base: 40, max: 80 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 80 }
    },
    traits: {
      group_label_key: "senses_and_racial_traits-u",
      items: {
        innate_adaptability: {
          name_key:      "racial_human_innate_adaptability-u",
          rule_text_key: "racial_human_innate_adaptability_rules-u",
		  usage_limit:     "scene"
        },
        jack_of_all_trades: {
          name_key:      "racial_human_jack_of_all_trades-u",
          rule_text_key: "racial_human_jack_of_all_trades_rules-u"
        },
        resilient_spirit: {
          name_key:      "racial_human_resilient_spirit-u",
          rule_text_key: "racial_human_resilient_spirit_rules-u",
		  usage_limit:     "session"
        },
        unshaped_by_the_veil: {
          name_key:      "racial_human_unshaped_by_the_veil-u",
          rule_text_key: "racial_human_unshaped_by_the_veil_rules-u",
		  usage_limit:     "session"
        },
        versatile_origin: {
          name_key:      "racial_human_versatile_origin-u",
          rule_text_key: "racial_human_versatile_origin_rules-u"
        }
      }
    }
  },
  "khadra": {
    label: "Khadra",
    language: "Torahn",
    stats: {
      str: { base: 15, max: 90 }, dex: { base: 15, max: 70 }, con: { base: 15, max: 80 },
      siz: { base: 50, max: 90 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 70 }
    },
    traits: {
      group_label_key: "senses_and_racial_traits-u",
      items: {
        natural_armor: {
          name_key:      "racial_khadra_natural_armor-u",
          rule_text_key: "racial_khadra_natural_armor_rules-u"
        },
        oathweight_presence: {
          name_key:      "racial_khadra_oathweight_presence-u",
          rule_text_key: "racial_khadra_oathweight_presence_rules-u",
		  usage_limit:     "scene"
        },
        stonebound_endurance: {
          name_key:      "racial_khadra_stonebound_endurance-u",
          rule_text_key: "racial_khadra_stonebound_endurance_rules-u",
		  usage_limit:     "session"
        },
        unshaken_resolve: {
          name_key:      "racial_khadra_unshaken_resolve-u",
          rule_text_key: "racial_khadra_unshaken_resolve_rules-u",
		  usage_limit:     "session"
        },
        weight_of_stone: {
          name_key:      "racial_khadra_weight_of_stone-u",
          rule_text_key: "racial_khadra_weight_of_stone_rules-u"
        }
      }
    }
  },
  "kitsu": {
    label: "Kitsu",
    language: "Nari",
    stats: {
      str: { base: 15, max: 75 }, dex: { base: 15, max: 80 }, con: { base: 15, max: 80 },
      siz: { base: 35, max: 75 }, int: { base: 40, max: 85 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 85 }
    },
    traits: {
      group_label_key: "senses_and_racial_traits-u",
      items: {
        cyber_mystic_synergy: {
          name_key:      "racial_kitsu_cyber_mystic_synergy-u",
          rule_text_key: "racial_kitsu_cyber_mystic_synergy_rules-u"
        },
        cyber_spirit_instinct: {
          name_key:      "racial_kitsu_cyber_spirit_instinct-u",
          rule_text_key: "racial_kitsu_cyber_spirit_instinct_rules-u",
		  usage_limit:     "session"
        },
        fox_eared_reflexes: {
          name_key:      "racial_kitsu_fox_eared_reflexes-u",
          rule_text_key: "racial_kitsu_fox_eared_reflexes_rules-u",
		  usage_limit:     "session"
        },
        mask_of_the_foxfire: {
          name_key:      "racial_kitsu_mask_of_the_foxfire-u",
          rule_text_key: "racial_kitsu_mask_of_the_foxfire_rules-u",
		  usage_limit:     "session"
        },
        strain_the_moment: {
          name_key:      "racial_kitsu_strain_the_moment-u",
          rule_text_key: "racial_kitsu_strain_the_moment_rules-u",
		  usage_limit:     "session"
        }
      }
    }
  },
  "lyranni": {
    label: "Lyranni",
    language: "Thal’Resh",
    stats: {
      str: { base: 15, max: 70 }, dex: { base: 15, max: 80 }, con: { base: 15, max: 80 },
      siz: { base: 30, max: 70 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 90 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 90 }
    },
    traits: {
      group_label_key: "senses_and_racial_traits-u",
      items: {
        arcane_resonance: {
          name_key:      "racial_lyranni_arcane_resonance-u",
          rule_text_key: "racial_lyranni_arcane_resonance_rules-u",
		  usage_limit:     "session"
        },
        cultural_elegance: {
          name_key:      "racial_lyranni_cultural_elegance-u",
          rule_text_key: "racial_lyranni_cultural_elegance_rules-u",
		  usage_limit:     "session"
        },
        low_light_vision: {
          name_key:      "racial_lyranni_low_light_vision-u",
          rule_text_key: "racial_lyranni_low_light_vision_rules-u"
        },
        unseen_grace: {
          name_key:      "racial_lyranni_unseen_grace-u",
          rule_text_key: "racial_lyranni_unseen_grace_rules-u",
		  usage_limit:     "session"
        },
        veil_sensitivity: {
          name_key:      "racial_lyranni_veil_sensitivity-u",
          rule_text_key: "racial_lyranni_veil_sensitivity_rules-u",
		  usage_limit:     "session"
        }
      }
    }
  },
  "veyra": {
    label: "Veyra",
    language: "Chirr",
    stats: {
      str: { base: 15, max: 80 }, dex: { base: 15, max: 80 }, con: { base: 15, max: 80 },
      siz: { base: 30, max: 60 }, int: { base: 40, max: 90 }, edu: { base: 40, max: 90 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 80 }
    },
    traits: {
      group_label_key: "senses_and_racial_traits-u",
      items: {
        quietstep: {
          name_key:      "racial_veyra_quietstep-u",
          rule_text_key: "racial_veyra_quietstep_rules-u",
		  usage_limit:     "scene"
        },
        sensitive_to_light: {
          name_key:      "racial_veyra_sensitive_to_light-u",
          rule_text_key: "racial_veyra_sensitive_to_light_rules-u"
        },
        tech_instinct: {
          name_key:      "racial_veyra_tech_instinct-u",
          rule_text_key: "racial_veyra_tech_instinct_rules-u"
        },
        tinkers_touch: {
          name_key:      "racial_veyra_tinkers_touch-u",
          rule_text_key: "racial_veyra_tinkers_touch_rules-u"
        },
        ultrasonic_perception: {
          name_key:      "racial_veyra_ultrasonic_perception-u",
          rule_text_key: "racial_veyra_ultrasonic_perception_rules-u"
        }
      }
    }
  }
};

const backgroundDataMap = {
  alteri: {
    soft_year_drifter: {
      trained_skills: ["coordination", "deception", "disguise", "perform_impersonation", "insight", "stealth", "streetwise"],
      starting_item: "mask_journal-u",
      starting_talents: ["second_skin", "reflexive_shift", "grace_of_the_many"]
    },
	veilhaven_attendant: {
	  trained_skills: ["arcana", "insight", "disguise", "history", "etiquette_alteri", "perform_impersonation", "occult"],
	  starting_item: "kin_token-u",
	  starting_talents: ["maskwrights_grace", "whisper_touched", "social_chameleon"]
	},
	ghostline_runner: {
	  trained_skills: ["slicing", "streetwise", "stealth", "electronics", "deception", "insight", "perform_impersonation"],
	  starting_item: "burner_id_package-u",
	  starting_talents: ["ghost_protocol", "shaped_for_subtlety", "echoed_voice"]
	},
    legacy_bearer: {
      trained_skills: ["perform_impersonation", "history", "insight", "arcana", "etiquette_alteri", "disguise", "occult"],
      starting_item: "legacy_ritual_item-u",
      starting_talents: ["echoed_voice", "maskwrights_grace", "second_skin"]
    },
    break_faced_radical: {
      trained_skills: ["persuade", "deception", "perform_impersonation", "insight", "streetwise", "disguise", "charm"],
      starting_item: "digital_mask_manifest-u",
      starting_talents: ["social_chameleon", "reflexive_shift", "shaped_for_subtlety"]
    }
  },
  draevi: {
    horn_carved_wanderer: {
      trained_skills: ["veil_lore", "occult", "survival_wilderness", "first_aid", "insight", "track", "arcana"],
      starting_item: "clan_ritual_token-u",
      starting_talents: ["spirits_in_stone", "clan_blooded", "iron_stomach"]
    },
    spiritbound_techshaper: {
      trained_skills: ["slicing", "spirit_lore", "electronics", "arcana", "insight", "mechanics", "streetwise"],
      starting_item: "ram_shell_unfinished-u",
      starting_talents: ["spirits_in_stone", "scavengers_edge", "clan_blooded"]
    },
    tradition_keeper: {
      trained_skills: ["survival_wilderness", "navigate", "perception", "athletics", "occult", "track", "first_aid"],
      starting_item: "rite_of_passage_horn-u",
      starting_talents: ["trailborn_reflexes", "iron_stomach", "spirits_in_stone"]
    },
    urban_tread: {
      trained_skills: ["athletics", "streetwise", "stealth", "coordination", "perception", "mechanics", "climb"],
      starting_item: "repurposed_clan_token-u",
      starting_talents: ["gutter_stalker", "urban_climber", "trailborn_reflexes"]
    },
    forgeblood_scavenger: {
      trained_skills: ["mechanics", "electronics", "insight", "streetwise", "coordination", "perception", "survival_wilderness"],
      starting_item: "salvaged_veil_artifact-u",
      starting_talents: ["scavengers_edge", "iron_stomach", "urban_climber"]
    }
  },
  feran: {
    clawbound_kin_warder: {
      trained_skills: ["athletics", "first_aid", "insight", "perception", "streetwise", "track", "unarmed"],
      starting_item: "claw_etched_oathstone-u",
      starting_talents: ["preadtors_focus", "silent_leap", "threadrunners_poise"]
    },
    packborn_drifter: {
      trained_skills: ["athletics", "dodge", "insight", "navigate", "perception", "stealth", "survival_wilderness"],
      starting_item: "scent_marked_scrap-u",
      starting_talents: ["predators_focus", "threadrunners_poise", "wallrunners_step"]
    },
    scorchborn_fugitive: {
      trained_skills: ["deception", "dodge", "insight", "stealth", "streetwise", "survival_wilderness", "track"],
      starting_item: "blade_or_relic_salvaged-u",
      starting_talents: ["razorstep_pounce", "threadrunners_poise", "wallrunners_step"]
    },
    urban_stalkkit: {
      trained_skills: ["athletics", "coordination", "dodge", "navigate", "sleight_of_hand", "stealth", "streetwise"],
      starting_item: "harness_rig-u",
      starting_talents: ["silent_leap", "threadrunners_poise", "wallrunners_step"]
    },
    veil_hunters_cub: {
      trained_skills: ["arcana", "athletics", "firearms_rifle", "insight", "perception", "survival_wilderness", "track"],
      starting_item: "veil_creature_token-u",
      starting_talents: ["predators_focus", "scent_of_the_kill", "threadrunners_poise"]
    }
  },  
  human: {
    scavsteel_whelp: {
      trained_skills: ["mechanics", "electronics", "streetwise", "insight", "slicing", "survival_urban", "perception"],
      starting_item: ["trusted_toolset-u", "modded_wearable-u"],
      starting_talents: ["quick_fixer", "hard_lesson", "skilled_focus"]
    },
    enclave_born: {
      trained_skills: ["etiquette_high_society", "persuade", "insight", "perform_vocal", "charm", "bureaucracy", "history"],
      starting_item: "pristine_id_code_uptier_zone-u",
      starting_talents: ["social_versatility", "instinct_over_training", "battle_tested_gut"]
    },
    gutterfire_youth: {
      trained_skills: ["stealth", "streetwise", "sleight_of_hand", "deception", "perception", "dodge", "slicing"],
      starting_item: "personal_survival_kit-u",
      starting_talents: ["social_versatility", "hard_lesson", "skilled_focus"]
    },
    outpost_raised: {
      trained_skills: ["survival_wilderness", "firearms_rifle", "mechanics", "navigate", "first_aid", "insight", "drive"],
      starting_item: "outpost_keepsake-u",
      starting_talents: ["battle_tested_gut", "no_stranger_to_pain", "hard_lesson"]
    },
    data_hatched: {
      trained_skills: ["slicing", "science", "electronics", "insight", "occult", "bureaucracy", "perform_vocal"],
      starting_item: ["memory_shard-u", "ai_record-u"],
      starting_talents: ["instinct_over_training", "quick_fixer", "skilled_focus"]
    },
    ash_war_refugee: {
      trained_skills: ["first_aid", "insight", "athletics", "dodge", "survival_urban", "perception", "stealth"],
      starting_item: "faded_token_of_past-u",
      starting_talents: ["makeshift_medic", "no_stranger_to_pain", "hard_lesson"]
    }
  },
  khadra: {
	stonehold_disciple: {
	  trained_skills: ["athletics", "dodge", "insight", "history", "melee_weapons", "first_aid", "survival_wilderness"],
	  starting_item: "stonehold_ward_token-u",
	  starting_talents: ["oathbound_grit", "still_as_judgment", "unbreakable_focus"]
	},
	cliffborn_laborer: {
	  trained_skills: ["mechanics", "athletics", "perception", "coordination", "survival_urban", "drive_auto", "history"],
	  starting_item: "cliffborn_work_harness-u",
	  starting_talents: ["measured_advance", "legacy_of_iron", "anchorpoint"]
	},
	oathbreakers_kin: {
	  trained_skills: ["unarmed", "streetwise", "insight", "intimidate", "dodge", "survival_urban", "first_aid"],
	  starting_item: "oathbreakers_kin_oathstone-u",
	  starting_talents: ["slow_to_bleed", "unbreakable_focus", "steady_as_stone"]
	},
	wardens_apprentice: {
	  trained_skills: ["perception", "insight", "intimidate", "dodge", "law", "melee_weapons", "track"],
	  starting_item: "wardens_apprentice_discipline_token-u",
	  starting_talents: ["still_as_judgment", "anchorpoint", "steady_as_stone"]
	},
	dust_seer_novice: {
	  trained_skills: ["veil_lore", "arcana", "insight", "history", "survival_wilderness", "occult_lore", "magic_warding"],
	  starting_item: "dust_seer_focus_stone-u",
	  starting_talents: ["oathbound_grit", "legacy_of_iron", "still_as_judgment"]
	}
  },
  kitsu: {
	shrine_den_scion: {
	  trained_skills: ["spirit_lore", "insight", "magic_enchantment", "veil_lore", "charm", "perform_vocal", "coordination"],
      starting_item: "ceremonial_talisman-u",
      starting_talents: ["veil_sniff", "whisperstep", "aether_flick"]
	},
	ghostline_whelp: {
	  trained_skills: ["stealth", "slicing", "spirit_lore", "insight", "electronics", "magic_illusion", "streetwise" ],
	  starting_item: "veil_modulator-u",
	  starting_talents: ["veil_sniff", "aether_flick", "twitch_reflex"]
	},
	contract_born: {
      trained_skills: ["persuade", "etiquette_underworld", "deception", "insight", "melee_weapons", "charm", "streetwise"],
      starting_item: "sigil_etched_blade-u",
      starting_talents: ["streetwise_instincts", "mask_of_the_moment", "twitch_reflex"]
	},
	run_shadow_cub: {
	  trained_skills: ["athletics", "dodge", "stealth", "navigate", "perception", "survival_urban", "coordination"],
	  starting_item: "enchanted_cloak-u",
	  starting_talents: ["whisperstep", "twitch_reflex", "mask_of_the_moment"]
	},
	code_seer_prodigy: {
	  trained_skills: ["electronics", "magic_illusion", "alchemy", "anthropology", "archaeology", "biology", "chemistry", "engineering", "physics", "spirit_lore", "insight", "slicing", "arcana"],
	  starting_item: "encrypted_dataplate-u",
	  starting_talents: ["aether_flick", "veil_sniff", "mask_of_the_moment"]
	}	
  },  
  lyranni: {
	whisper_walker: {
		trained_skills: ["perception", "occult", "spirit_lore", "insight", "survival_wilderness", "stealth", "magic_warding"],
		starting_item: "veilmark_living-sigil-u",
		starting_talents: ["threadwalker", "veilsight", "veil_blooded_sense"]
	},
	zurethkai_flameborn: {
		trained_skills: ["slicing", "magic_technomancy", "electronics", "arcana", "deception", "magic_illusion", "insight"],
		starting_item: "symbolic_magitech_mod-u",
		starting_talents: ["aether_override", "veil_blooded_sense", "echo_in_the_veins"]
	},
	aelvareth_devotee: {
		trained_skills: ["occult", "etiquette_lyranni", "arcana", "perform_vocal", "magic_warding", "bureaucracy", "veil_lore"],
		starting_item: "aelvareth_veilmark-u",
		starting_talents: ["threadwalker", "legacy_spark", "veilsight"]
	},
    echoborne: {
      trained_skills: ["arcana", "etiquette_lyranni", "occult", "history", "insight", "perform_vocal", "bureaucracy"],
      starting_item: "ancestral_veilmark-u",
      starting_talents: ["legacy_spark", "veilsight", "threadwalker"]
    },
	glide_spire_scion: {
		trained_skills: ["persuade", "streetwise", "charm", "insight", "etiquette_high_society", "perform_dance", "deception"],
		starting_item: "veil_threaded_accessory-u",
		starting_talents: ["social_ghost", "echo_in_the_veins", "legacy_spark"]
	}
  },
  veyra: {
	hatchwarren_drifter: {
	  trained_skills: ["stealth", "streetwise", "security", "perception", "coordination", "mechanics", "survival_urban"],
	  starting_item: "signal_mask-u",
	  starting_talents: ["slip_between", "cache_sense", "reflex_map"]
	},
	loop_minder_initiate: {
	  trained_skills: ["slicing", "electronics", "computer_use", "insight", "perception", "occult", "archanotech"],
	  starting_item: "neural_interface_plug-u",
	  starting_talents: ["signal_ghost", "circuit_whisperer", "mask_the_signal"]
	},
	corpsepath_reclaimer: {
      trained_skills: ["magic_necromancy", "cybernetics", "medicine", "mechanics", "first_aid", "occult", "veil_lore" ],
	  starting_item: "bone_tagged_surgical_injector-u",
	  starting_talents: ["patchwork_fixer", "circuit_whispers", "cache_sense"]
	},
	shatterlink_courier: {
	  trained_skills: ["navigate", "stealth", "dodge", "streetwise", "athletics", "drive_auto", "magic_illusion" ],
	  starting_item: "bonded_courier_node-u",
	  starting_talents: ["no_footprints", "mask_the_signal", "echo_sense"]
	},
	cross_signal_raised: {
	  trained_skills: ["insight", "persuade", "deception", "disguise", "streetwise", "etiquette_other", "otherskill3" ],
	  starting_item: "translation_implant-u",
	  starting_talents: ["echo_sense", "reflex_map", "no_footprints"]
	}
  }
};

const talentDataMap = {
  alteri: {
    echoed_voice: {
      name_key:  "talent_alteri_echoed_voice-u",
      rule_text_key: "talent_alteri_echoed_voice_rules-u",
      name: "Echoed Voice",
      description: "Once per session, mimic the voice and speech of someone known to you or studied for at least one full scene. Grants a bonus die to Performance (Impersonation) or any roll to pass as the individual.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    ghost_protocol: {
      name_key:  "talent_alteri_ghost_protocol-u",
      rule_text_key: "talent_alteri_ghost_protocol_rules-u",
      name: "Ghost Protocol",
      description: "Once per session, erase your trail. Gain a bonus die to Stealth or Slicing when spoofing ID, bypassing basic surveillance, or escaping recognition. If followed by a successful Disguise, it leaves no trace.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    grace_of_the_many: {
      name_key:  "talent_alteri_grace_of_the_many-u",
      rule_text_key: "talent_alteri_grace_of_the_many_rules-u",
      name: "Grace of the Many",
      description: "Once per session, reroll a failed Disguise, Insight, or Stealth check. Take the better result.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    maskwrights_grace: {
      name_key:  "talent_alteri_maskwrights_grace-u",
      rule_text_key: "talent_alteri_maskwrights_grace_rules-u",
<!--      name: "Maskwright’s Grace", -->
<!--      description: "Choose one: gain +10% to Disguise, Insight, or Performance (Impersonation). This choice is permanent and may only be taken once.", -->
      skills: [ "disguise", "insight", "perform_impersonation"  ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    reflexive_shift: {
      name_key:  "talent_alteri_reflexive_shift-u",
      rule_text_key: "talent_alteri_reflexive_shift_rules-u",
      name: "Reflexive Shift",
      description: "Once per scene, as a Reaction, rapidly alter your appearance (hair, skin tone, voice, etc.) to avoid identification. Grants a bonus die to Disguise or deception-based Deception. Costs 1d4 Strain.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "scene"
    },
    second_skin: {
      name_key:  "talent_alteri_second_skin-u",
      rule_text_key: "talent_alteri_second_skin_rules-u",
      name: "Second Skin",
      description: "You gain an additional Mask—a fully realized persona with a name, appearance, and backstory. Switching to this Mask takes 1 Action and no longer imposes Strain unless done under stress (GM discretion).",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    shaped_for_subtlety: {
      name_key:  "talent_alteri_shaped_for_subtlety-u",
      rule_text_key: "talent_alteri_shaped_for_subtlety_rules-u",
      name: "Shaped for Subtlety",
      description: "Choose one: gain +10% to Stealth, Slicing, or Insight. This choice is permanent and may only be taken once.",
      skills: [ "insight", "slicing", "stealth" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    social_chameleon: {
      name_key:  "talent_alteri_social_chameleon-u",
      rule_text_key: "talent_alteri_social_chameleon_rules-u",
      name: "Social Chameleon",
      description: "Use Charm in place of Deception or Persuade when navigating unfamiliar cultures or coded social environments.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    whisper_touched: {
      name_key:  "talent_alteri_whisper_touched-u",
      rule_text_key: "talent_alteri_whisper_touched_rules-u",
      name: "Whisper-Touched",
      description: "Once per session, gain a bonus die when casting Illusion or Enchantment spells.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    adaptive_memory: {
      name_key:  "talent_alteri_adaptive_memory-u",
      rule_text_key: "talent_alteri_adaptive_memory_rules-u",
      name: "Adaptive Memory",
      description: "Once per session, recall useful details from a person you've interacted with in person. Gain a bonus die to a social roll involving deception or impersonation with them or their associates.",
      skills: "",
      prerequisite: [ "maskwrights_grace", "social_chameleon" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    deep_mask_integration: {
      name_key:  "talent_alteri_deep_mask_integration-u",
      rule_text_key: "talent_alteri_deep_mask_integration_rules-u",
      name: "Deep Mask Integration",
      description: "Gain +10% to Disguise or Insight (your choice). You may maintain two active Masks and switch between them without prep or Strain outside combat.",
      skills: [ "disguise", "insight" ],
      prerequisite: [ "second_skin" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: ""
    },
    facial_recalibration: {
      name_key:  "talent_alteri_facial_recalibration-u",
      rule_text_key: "talent_alteri_facial_recalibration_rules-u",
      name: "Facial Recalibration",
      description: "Once per session, mimic a person’s face, posture, and speech after observing them for at least one turn. Grants a bonus die to Disguise or Performance (Impersonation). Costs 1 Strain.",
      skills: "",
      prerequisite: [ "echoed_voice", "second_skin" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    ghost_signature: {
      name_key:  "talent_alteri_ghost_signature-u",
      rule_text_key: "talent_alteri_ghost_signature_rules-u",
      name: "Ghost Signature",
      description: "Once per session, spoof or bypass a low-grade biometric scan (e.g., facial recognition, voiceprint, retinal) with a bonus die to Slicing or Electronics.",
      skills: "",
      prerequisite: [ "ghost_protocol" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    mirror_weave: {
      name_key:  "talent_alteri_mirror_weave-u",
      rule_text_key: "talent_alteri_mirror_weave_rules-u",
      name: "Mirror Weave",
      description: "Once per session, illusions or enchantments you cast can deceive digital or mechanical observers. Costs 1 Strain per additional ally affected. Cannot deceive hostile systems.",
      skills: "",
      prerequisite: [ "whisper_touched" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    persona_anchor: {
      name_key:  "talent_alteri_persona_anchor-u",
      rule_text_key: "talent_alteri_persona_anchor_rules-u",
      name: "Persona Anchor",
      description: "Choose one: gain +10% to Performance (Impersonation), Arcana, or Slicing. Reflects how your persona enhances certain skills.",
      skills: [ "arcana", "perform_impersonation", "slicing" ],
      prerequisite: [ "grace_of_the_many" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: ""
    },
    shift_reflex: {
      name_key:  "talent_alteri_shift_reflex-u",
      rule_text_key: "talent_alteri_shift_reflex_rules-u",
      name: "Shift Reflex",
      description: "Once per scene, use a Reaction to confuse a target mid-scan or strike. Gain a bonus die to Dodge or Stealth.",
      skills: "",
      prerequisite: [ "reflexive_shift" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    silent_archive: {
      name_key:  "talent_alteri_silent_archive-u",
      rule_text_key: "talent_alteri_silent_archive_rules-u",
      name: "Silent Archive",
      description: "Store a secondary identity with full recall: appearance, history, contacts, accent, and routine. Once per session, switch instantly. Costs 1d4 Strain if used during a scene. Free outside scenes.",
      skills: "",
      prerequisite: [ "deep_mask_integration" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    veil_echo_memory: {
      name_key:  "talent_alteri_veil_echo_memory-u",
      rule_text_key: "talent_alteri_veil_echo_memory_rules-u",
      name: "Veil Echo Memory",
      description: "Once per session, gain a sensory impression or memory from a place or person you've touched. Grants a bonus die to the next Arcana, Insight, or Occult Lore roll. Costs 1 Strain.",
      skills: "",
      prerequisite: [ "ghost_protocol", "whisper_touched" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    biometric_phantom: {
      name_key:  "talent_alteri_biometric_phantom-u",
      rule_text_key: "talent_alteri_biometric_phantom_rules-u",
      name: "Biometric Phantom",
      description: "Once per session, spoof or override corporate-grade biometric or magitech ID systems if you've had contact with the target. Bonus die to Slicing or Electronics.",
      skills: "",
      prerequisite: [ "ghost_signature" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    identity_cascade: {
      name_key:  "talent_alteri_identity_cascade-u",
      rule_text_key: "talent_alteri_identity_cascade_rules-u",
      name: "Identity Cascade",
      description: "Once per scene, switch Masks mid-encounter (even mid-dialogue or mid-combat). Grants a bonus die to Disguise or Insight. Costs 1d4 Strain if under pressure or direct observation.",
      skills: "",
      prerequisite: [ "deep_mask_integration" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    memory_graft: {
      name_key:  "talent_alteri_memory_graft-u",
      rule_text_key: "talent_alteri_memory_graft_rules-u",
      name: "Memory Graft",
      description: "Once per session, tap into a stored Mask’s memory for insight. Gain a bonus die to one Arcana, Insight, or Performance (Impersonation) roll tied to that persona’s experience.",
      skills: "",
      prerequisite: [ "deep_mask_integration" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    perfect_mimicry: {
      name_key:  "talent_alteri_perfect_mimicry-u",
      rule_text_key: "talent_alteri_perfect_mimicry_rules-u",
      name: "Perfect Mimicry",
      description: "Once per session, flawlessly replicate a person’s full persona (appearance, mannerisms, tone). Grants a bonus die to Disguise, Performance, or Deception.",
      skills: "",
      prerequisite: [ "echoed_voice", "facial_recalibration" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    social_echo: {
      name_key:  "talent_alteri_social_echo-u",
      rule_text_key: "talent_alteri_social_echo_rules-u",
      name: "Social Echo",
      description: "Once per session, adapt your behavior to match a target’s subconscious expectations. Gain a bonus die to Charm, Deception, or Persuade. Costs 1 Strain if targeting two or more people.",
      skills: "",
      prerequisite: [ "adaptive_memory", "social_chameleon" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    veil_shaped_will: {
      name_key:  "talent_alteri_veil_shaped_will-u",
      rule_text_key: "talent_alteri_veil_shaped_will_rules-u",
      name: "Veil-Shaped Will",
      description: "Once per session, reroll a failed Illusion, Alteration, or Enchantment spellcasting. If successful, reduce the Strain die by one step (e.g., 1d6 → 1d4).",
      skills: "",
      prerequisite: [ "mirror_weave", "whisper_touched" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    author_of_the_lie: {
      name_key:  "talent_alteri_author_of_the_lie-u",
      rule_text_key: "talent_alteri_author_of_the_lie_rules-u",
      name: "Author of the Lie",
      description: "Once per session, automatically succeed on a Disguise, Performance, or Deception roll involving deception. You may declare one falsehood about your Mask as true for the rest of the scene. Costs 2 Strain if used under direct scrutiny or in a digital surveillance zone.",
      skills: "",
      prerequisite: [ "deep_mask_integration", "social_echo" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    immaculate_impersonation: {
      name_key:  "talent_alteri_immaculate_impersonation-u",
      rule_text_key: "talent_alteri_immaculate_impersonation_rules-u",
      name: "Immaculate Impersonation",
      description: "Once per session, flawlessly impersonate a known target—down to retinal scan, bio-sig, and vocal cadence. Bonus die to all Disguise, Slicing, or Performance (Impersonation) checks for the entire scene.",
      skills: "",
      prerequisite: [ "biometric_phantom", "perfect_mimicry" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    living_mask_archive: {
      name_key:  "talent_alteri_living_mask_archive-u",
      rule_text_key: "talent_alteri_living_mask_archive_rules-u",
      name: "Living Mask Archive",
      description: "Maintain up to four active Masks. Once per session, instantly switch between any of them. Grants a bonus die to your next social or Stealth roll. Costs 1 Strain if used during a scene.",
      skills: "",
      prerequisite: [ "identity_cascade", "memory_graft" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    veil_mirroring_ritual: {
      name_key:  "talent_alteri_veil_mirroring_ritual-u",
      rule_text_key: "talent_alteri_veil_mirroring_ritual_rules-u",
      name: "Veil-Mirroring Ritual",
      description: "Once per session, reflect a single Illusion or Enchantment spell cast on you, or redirect it to another visible target. Spell must be reflectable by nature.",
      skills: "",
      prerequisite: [ "veil_shaped_will" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    }
  },
  draevi: {
    bone_sung_memory: {
        name_key: "talent_draevi_bone_sung_memory-u",
        rule_text_key: "talent_draevi_bone_sung_memory_rules-u",
        name: "Bone-Sung Memory",
        description: "Once per session, gain a bonus die when attempting to recall a location, creature, or spiritual phenomenon you’ve personally witnessed before.",
        skills: "",
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: "session"
    },
    clan_blooded: {
        name_key: "talent_draevi_clan_blooded-u",
        rule_text_key: "talent_draevi_clan_blooded_rules-u",
        name: "Clan-Blooded",
        description: "Choose one: gain +10% to Intimidate, Survival, or Track. This reflects your upbringing within a strong clan tradition. This choice is permanent and may only be taken once.",
        skills: [ "intimidate", "survival_wilderness", "track" ],
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: ""
    },
    gutter_stalker: {
        name_key: "talent_draevi_gutter_stalker-u",
        rule_text_key: "talent_draevi_gutter_stalker_rules-u",
        name: "Gutter-Stalker",
        description: "Once per session, gain a bonus die on a Stealth roll made in an urban or tight, vertical space (vents, scaffolding, alleys).",
        skills: "",
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: "session"
    },
    iron_stomach: {
        name_key: "talent_draevi_iron_stomach-u",
        rule_text_key: "talent_draevi_iron_stomach_rules-u",
        name: "Iron Stomach",
        description: "Gain a bonus die on Constitution rolls to resist poison, spoiled food, or ingested toxins. You can consume nearly anything without penalty.",
        skills: "",
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: ""
    },
    scavengers_edge: {
        name_key: "talent_draevi_scavengers_edge-u",
        rule_text_key: "talent_draevi_scavengers_edge_rules-u",
        name: "Scavenger’s Edge",
        description: "Choose one: gain +10% to Mechanics, Electronics, or Streetwise. This reflects your clan’s practical knowledge of scavenging and repair. This choice is permanent and may only be taken once.",
        skills: [ "electronics", "mechanics", "streetwise" ],
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: ""
    },
    silent_step_sharp_ear: {
        name_key: "talent_draevi_silent_step_sharp_ear-u",
        rule_text_key: "talent_draevi_silent_step_sharp_ear_rules-u",
        name: "Silent Step, Sharp Ear",
        description: "Gain a bonus die on Stealth checks when moving through natural terrain. Optional: spend 1 Strain to also gain a bonus die on the next Listen or Perception check in the same scene.",
        skills: "",
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: "scene"
    },
    spirits_in_stone: {
        name_key: "talent_draevi_spirits_in_stone-u",
        rule_text_key: "talent_draevi_spirits_in_stone_rules-u",
        name: "Spirits-in-Stone",
        description: "Once per session, gain a bonus die on a Spirit Lore roll related to ancestor rites, ruins, or natural spirit dwellings.",
        skills: "",
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: "session"
    },
    trailborn_reflexes: {
        name_key: "talent_draevi_trailborn_reflexes-u",
        rule_text_key: "talent_draevi_trailborn_reflexes_rules-u",
        name: "Trailborn Reflexes",
        description: "Once per scene, gain a bonus die to any Dodge roll.",
        skills: "",
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: "scene"
    },
    urban_climber: {
        name_key: "talent_draevi_urban_climber-u",
        rule_text_key: "talent_draevi_urban_climber_rules-u",
        name: "Urban Climber",
        description: "Once per session, gain a bonus die to any Athletics or Coordination roll made while navigating vertical, unstable, or cramped environments.",
        skills: "",
        prerequisite: "",
        tier: 1,
        cost: 10,
        capstone: false,
        usage_limit: "session"
    },
    echo_binders_rite: {
        name_key: "talent_draevi_echo_binders_rite-u",
        rule_text_key: "talent_draevi_echo_binders_rite_rules-u",
        name: "Echo-Binder’s Rite",
        description: "Once per session, gain a bonus die to a Magic (Summoning) or Spirit Lore roll to commune with a spirit or bind an ancestral echo.",
        skills: "",
        prerequisite: [ "spirits_in_stone" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: "session"
    },
    hardened_trailwalker: {
        name_key: "talent_draevi_hardened_trailwalker-u",
        rule_text_key: "talent_draevi_hardened_trailwalker_rules-u",
        name: "Hardened Trailwalker",
        description: "Once per session, gain a bonus die to a Survival check. If that check fails, suffer only half the usual Strain from failure.",
        skills: "",
        prerequisite: [ "iron_stomach", "trailborn_reflexes" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: "session"
    },
    instinctive_counter: {
        name_key: "talent_draevi_instinctive_counter-u",
        rule_text_key: "talent_draevi_instinctive_counter_rules-u",
        name: "Instinctive Counter",
        description: "Once per scene, gain a bonus die to either a Dodge, Unarmed Combat, or Melee roll when reacting to an attack.",
        skills: "",
        prerequisite: [ "trailborn_reflexes" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: "scene"
    },
    root_stance_tenacity: {
        name_key: "talent_draevi_root_stance_tenacity-u",
        rule_text_key: "talent_draevi_root_stance_tenacity_rules-u",
        name: "Root-Stance Tenacity",
        description: "Once per session, when you fail a Strength or Constitution roll to resist knockback, fatigue, or being overpowered, you may reroll with a bonus die. Optional: spend 2 Strain to remain standing even if the second roll fails.",
        skills: "",
        prerequisite: [ "clan_blooded", "iron_stomach" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: "session"
    },
    scent_the_shift: {
        name_key: "talent_draevi_scent_the_shift-u",
        rule_text_key: "talent_draevi_scent_the_shift_rules-u",
        name: "Scent the Shift",
        description: "Once per session, detect a hidden threat, spirit, or Veil anomaly in your immediate area. Grants a bonus die to the next Perception or Spirit Lore check made to investigate it.",
        skills: "",
        prerequisite: [ "spirits_in_stone", "trailborn_reflexes" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: "session"
    }, 
    tales_etched_in_horn: {
        name_key: "talent_draevi_tales_etched_in_horn-u",
        rule_text_key: "talent_draevi_tales_etched_in_horn_rules-u",
        name: "Tales Etched in Horn",
        description: "Once per session, when recalling a story, rite, or ancestral lesson, gain a bonus die on any Occult Lore, Spirit Lore, or Etiquette (Clan) check related to Draevi culture or spirits.",
        skills: "",
        prerequisite: [ "clan_blooded" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: "session"
    },
    urban_tracker: {
        name_key: "talent_draevi_urban_tracker-u",
        rule_text_key: "talent_draevi_urban_tracker_rules-u",
        name: "Urban Tracker",
        description: "You may reroll one failed Streetwise, Stealth, or Track check made while tracking in an urban environment.",
        skills: "",
        prerequisite: [ "gutter_stalker" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: ""
    },
    veins_of_stone: {
        name_key: "talent_draevi_veins_of_stone-u",
        rule_text_key: "talent_draevi_veins_of_stone_rules-u",
        name: "Veins of Stone",
        description: "Once per session, automatically succeed on a failed Constitution roll against fatigue, poison, or environmental strain.",
        skills: "",
        prerequisite: [ "clan_blooded", "iron_stomach" ],
        tier: 2,
        cost: 20,
        capstone: false,
        usage_limit: "session"
    },
    ancestors_pulse: {
        name_key: "talent_draevi_ancestors_pulse-u",
        rule_text_key: "talent_draevi_ancestors_pulse_rules-u",
        name: "Ancestor’s Pulse",
        description: "Once per session, gain two bonus dice on a Magic (Divination), Spirit Lore, or Magic (Summoning) roll when invoking ancestral insight. On success, the insight reveals a hidden danger or opportunity relevant to the scene.",
        skills: "",
        prerequisite: [ "tales_etched_in_horn" ],
        tier: 3,
        cost: 30,
        capstone: false,
        usage_limit: "session"
    },    
    emberlash_retaliation: {
        name_key: "talent_draevi_emberlash_retaliation-u",
        rule_text_key: "talent_draevi_emberlash_retaliation_rules-u",
        name: "Emberlash Retaliation",
        description: "Once per session, when struck by a melee or ranged attack, make a counterattack with a bonus die. If your counterattack hits, the target suffers a penalty die on their next action.",
        skills: "",
        prerequisite: [ "instinctive_counter" ],
        tier: 3,
        cost: 30,
        capstone: false,
        usage_limit: "session"
    },   
    legacy_reforged: {
        name_key: "talent_draevi_legacy_reforged-u",
        rule_text_key: "talent_draevi_legacy_reforged_rules-u",
        name: "Legacy Reforged",
        description: "Once per session, choose one Tier 1 Draevi Talent you possess. For the rest of the scene, it may be used twice without expending Strain. Optional: spend 1 Strain to immediately activate that Tier 1 talent now.",
        skills: "",
        prerequisite: "",
        prerequisiteAny: { tier: 2, count: 2 },
        tier: 3,
        cost: 30,
        capstone: false,
        usage_limit: "session"
    }, 
    pathfinders_edge: {
        name_key: "talent_draevi_pathfinders_edge-u",
        rule_text_key: "talent_draevi_pathfinders_edge_rules-u",
        name: "Pathfinder’s Edge",
        description: "Once per session, ignore natural terrain penalties for movement or Survival for a full scene. Gain a bonus die to Track or Navigate during this time.",
        skills: "",
        prerequisite: [ "hardened_trailwalker", "veins_of_stone" ],
        tier: 3,
        cost: 30,
        capstone: false,
        usage_limit: "session"
    },  
    spirit_touched_mastery: {
        name_key: "talent_draevi_spirit_touched_mastery-u",
        rule_text_key: "talent_draevi_spirit_touched_mastery_rules-u",
        name: "Spirit-Touched Mastery",
        description: "Once per session, reroll a failed Spirit Lore or Magic (Summoning) roll. If successful, reduce the spell’s Strain cost by one die step.",
        skills: "",
        prerequisite: [ "echo_binders_rite" ],
        tier: 3,
        cost: 30,
        capstone: false,
        usage_limit: "session"
    },
    spiritual_vanguard: {
        name_key: "talent_draevi_spiritual_vanguard-u",
        rule_text_key: "talent_draevi_spiritual_vanguard_rules-u",
        name: "Spiritual Vanguard",
        description: "Once per session, gain a bonus die when casting a Counterspell on behalf of an ally. Also gain a bonus die when banishing a hostile spirit.",
        skills: "",
        prerequisite: [ "scent_the_shift", "tales_etched_in_horn" ],
        tier: 3,
        cost: 30,
        capstone: false,
        usage_limit: "session"
    },
    wild_tamers_gaze: {
        name_key: "talent_draevi_wild_tamers_gaze-u",
        rule_text_key: "talent_draevi_wild_tamers_gaze_rules-u",
        name: "Wild Tamer’s Gaze",
        description: "Once per session, choose a non-hostile creature or spirit (animal, summoned being, or elemental-type). You may calm, redirect, or guide it with a Spirit Lore or Animal Handling check rolled with a bonus die. Optional: spend 2 Strain to influence it even if it's Veil-corrupted or hostile.",
        skills: "",
        prerequisite: [ "ancestors_pulse", "echo_binders_rite" ],
        tier: 3,
        cost: 30,
        capstone: false,
        usage_limit: "session"
    },
    ancestral_mirror: {
        name_key: "talent_draevi_ancestral_mirror-u",
        rule_text_key: "talent_draevi_ancestral_mirror_rules-u",
        name: "Ancestral Mirror",
        description: "Once per session, call on an ancestral vision to gain two bonus dice on a Spirit Lore, Magic (Summoning), or Magic (Divination) roll. On success, gain a hidden insight or location tied to the current conflict.",
        skills: "",
        prerequisite: [ "echo_binders_rite", "spirit_touched_mastery" ],
        tier: 4,
        cost: 40,
        capstone: true,
        usage_limit: "session"
    },
    echo_flame_warden: {
        name_key: "talent_draevi_echo_flame_warden-u",
        rule_text_key: "talent_draevi_echo_flame_warden_rules-u",
        name: "Echo-Flame Warden",
        description: "Once per session, invoke a Ward of Legacy: you and up to two allies gain a bonus die on Constitution and Power rolls during a combat or ritual scene. You may also reduce incoming damage to one target by 1d6 (once per session).",
        skills: "",
        prerequisite: [ "spiritual_vanguard", "veins_of_stone" ],
        tier: 4,
        cost: 40,
        capstone: true,
        usage_limit: "session"
    },
    path_of_the_remembered: {
        name_key: "talent_draevi_path_of_the_remembered-u",
        rule_text_key: "talent_draevi_path_of_the_remembered_rules-u",
        name: "Path of the Remembered",
        description: "Once per session, declare a location as “bound by memory.” For the scene, you and allies who can hear you gain a bonus die on Perception, Survival, or Willpower-related rolls within that area. You may also spend 3 Strain once during the scene to invoke a flash of ancestral memory, revealing a secret path, hidden threat, or forgotten rite.",
        skills: "",
        prerequisite: [ "ancestors_pulse", "tales_etched_in_horn" ],
        tier: 4,
        cost: 40,
        capstone: true,
        usage_limit: "session"
    },
    soul_of_the_wild_hunt: {
        name_key: "talent_draevi_soul_of_the_wild_hunt-u",
        rule_text_key: "talent_draevi_soul_of_the_wild_hunt_rules-u",
        name: "Soul of the Wild Hunt",
        description: "Once per session, enter Hunt State for the remainder of a scene: gain a bonus die on Stealth and Tracking checks, ignore terrain penalties, and reroll one failed Unarmed Combat or Melee attack.",
        skills: "",
        prerequisite: [ "emberlash_retaliation", "pathfinders_edge" ],
        tier: 4,
        cost: 40,
        capstone: true,
        usage_limit: "session"
    }
   },
  feran: {
    predators_focus: {
      name_key:  "talent_feran_predators_focus-u",
      rule_text_key: "talent_feran_predators_focus_rules-u",
      name: "Predator’s Focus",
      description: "Once per session, gain a bonus die on a Perception or Insight check to assess danger, detect motion, or track prey.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    razorstep_pounce: {
      name_key:  "talent_feran_razorstep_pounce-u",
      rule_text_key: "talent_feran_razorstep_pounce_rules-u",
      name: "Razorstep Pounce",
      description: "Once per session, after a successful unarmed attack, spend 2 Strain to make a second unarmed attack against another target in engaged range—or one in close range if you move (provoking an attack of opportunity).",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    scavengers_instinct: {
      name_key:  "talent_feran_scavengers_instinct-u",
      rule_text_key: "talent_feran_scavengers_instinct_rules-u",
      name: "Scavenger’s Instinct",
      description: "Choose one: gain +10% to Streetwise, Survival (Urban), or Navigate. Reflects upbringing in scav-run packs and fringe routes. May only be taken once.",
      skills: [ "navigate", "streetwise", "survival_urban" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    scent_of_the_kill: {
      name_key:  "talent_feran_scent_of_the_kill-u",
      rule_text_key: "talent_feran_scent_of_the_kill_rules-u",
      name: "Scent of the Kill",
      description: "Once per scene, after succeeding on a Track check, gain a bonus die on your next Attack, Insight, or Streetwise check involving the same target.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "scene"
    },
    silent_leap: {
      name_key:  "talent_feran_silent_leap-u",
      rule_text_key: "talent_feran_silent_leap_rules-u",
      name: "Silent Leap",
      description: "Once per session, gain a bonus die on a Stealth or Athletics check made to reposition from concealment or into cover. Useful for ambush or disengaging into cover.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    threadrunners_poise: {
      name_key:  "talent_feran_threadrunners_poise-u",
      rule_text_key: "talent_feran_threadrunners_poise_rules-u",
      name: "Threadrunner’s Poise",
      description: "Once per session, ignore penalties from unstable, narrow, or shifting terrain for the rest of the scene.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    wallrunners_step: {
      name_key:  "talent_feran_wallrunners_step-u",
      rule_text_key: "talent_feran_wallrunners_step_rules-u",
      name: "Wallrunner’s Step",
      description: "Once per session, gain a bonus die on an Athletics or Coordination check made while navigating vertical, narrow, or unstable terrain.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    ambush_instincts: {
      name_key:  "talent_feran_ambush_instincts-u",
      rule_text_key: "talent_feran_ambush_instincts_rules-u",
      name: "Ambush Instincts",
      description: "Once per scene, when combat begins, you may immediately take a free movement action before initiative is rolled.",
      skills: "",
      prerequisite: "",
      prerequisiteAny: { tier: 1, count: 1 },
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    bloodrushed_recovery: {
      name_key:  "talent_feran_bloodrushed_recovery-u",
      rule_text_key: "talent_feran_bloodrushed_recovery_rules-u",
      name: "Bloodrushed Recovery",
      description: "Once per session, when you take damage of any kind, regain 2 Strain and gain a bonus die on your next Dodge roll.",
      skills: "",
      prerequisite: "",
      prerequisiteAny: { tier: 1, count: 1 },
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    pack_sense_reversal: {
      name_key:  "talent_feran_pack_sense_reversal-u",
      rule_text_key: "talent_feran_pack_sense_reversal_rules-u",
      name: "Pack-Sense Reversal",
      description: "Once per session, if an ally within short range is targeted by a melee attack, you may switch places with them as a Reaction. If you successfully Dodge, you may make a free unarmed attack against the attacker (if still in range).",
      skills: "",
      prerequisite: [ "predators_focus", "scavengers_instinct" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    pounce_and_break: {
      name_key:  "talent_feran_pounce_and_break-u",
      rule_text_key: "talent_feran_pounce_and_break_rules-u",
      name: "Pounce and Break",
      description: "Once per session, if you hit a melee attack against a surprised or unaware target, that target suffers a penalty die on their next Dodge or Attack roll.",
      skills: "",
      prerequisite: [ "razorstep_pounce" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    predators_patience: {
      name_key:  "talent_feran_predators_patience-u",
      rule_text_key: "talent_feran_predators_patience_rules-u",
      name: "Predator’s Patience",
      description: "Once per session, if you remain in stealth or cover for a full round, your next melee or ranged attack from hiding gains a bonus die.",
      skills: "",
      prerequisite: [ "predators_focus", "silent_leap" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    scentlock_tactics: {
      name_key:  "talent_feran_scentlock_tactics-u",
      rule_text_key: "talent_feran_scentlock_tactics_rules-u",
      name: "Scentlock Tactics",
      description: "Once per session, after succeeding on a Track check or observing a target for a round, gain a bonus die on your next Attack, Insight, or Streetwise check against that target.",
      skills: "",
      prerequisite: [ "scent_of_the_kill" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    threadwalkers_rhythm: {
      name_key:  "talent_feran_threadwalkers_rhythm-u",
      rule_text_key: "talent_feran_threadwalkers_rhythm_rules-u",
      name: "Threadwalker’s Rhythm",
      description: "For one scene per session, ignore terrain penalties and gain a bonus die to Athletics checks made to navigate difficult, unstable, or vertical ground.",
      skills: "",
      prerequisite: [ "threadrunners_poise", "wallrunners_step" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    apex_reflex: {
      name_key:  "talent_feran_apex_reflex-u",
      rule_text_key: "talent_feran_apex_reflex_rules-u",
      name: "Apex Reflex",
      description: "Once per session, when you successfully Dodge a melee attack, you may shift one range band without disengaging and make a free unarmed or melee attack against a different target.",
      skills: "",
      prerequisite: [ "pack_sense_reversal" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    battle_rush_clarity: {
      name_key:  "talent_feran_battle_rush_clarity-u",
      rule_text_key: "talent_feran_battle_rush_clarity_rules-u",
      name: "Battle-Rush Clarity",
      description: "Once per session, when you suffer any damage, regain 2 Strain and ignore movement penalties from wounds until the end of your next turn.",
      skills: "",
      prerequisite: [ "bloodrushed_recovery" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    chain_strike_instinct: {
      name_key:  "talent_feran_chain_strike_instinct-u",
      rule_text_key: "talent_feran_chain_strike_instinct_rules-u",
      name: "Chain-Strike Instinct",
      description: "Once per session, if you reduce a target to 0 HP with a melee or unarmed attack, you may shift to a second target in engaged range and make a free attack.",
      skills: "",
      prerequisite: [ "pounce_and_break", "stalkers_cascade" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    pack_alphas_demand: {
      name_key:  "talent_feran_pack_alphas_demand-u",
      rule_text_key: "talent_feran_pack_alphas_demand_rules-u",
      name: "Pack Alpha’s Demand",
      description: "Once per session, choose up to two allies within short range. Until the start of your next turn, they each gain a bonus die on Dodge or melee attacks (choose one).",
      skills: "",
      prerequisite: [ "pack_sense_reversal" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    predators_terrain: {
      name_key:  "talent_feran_predators_terrain-u",
      rule_text_key: "talent_feran_predators_terrain_rules-u",
      name: "Predator’s Terrain",
      description: "Once per session, designate a terrain type (rubble, scaffolding, overgrowth, etc.) as your hunting ground. While within it, gain a bonus die to Dodge and Athletics, and enemies suffer a penalty die on ranged attacks against you.",
      skills: "",
      prerequisite: [ "threadwalkers_rhythm" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    stalkers_cascade: {
      name_key:  "talent_feran_stalkers_cascade-u",
      rule_text_key: "talent_feran_stalkers_cascade_rules-u",
      name: "Stalker’s Cascade",
      description: "Once per session, if you begin your turn unseen and hit with a melee or unarmed attack, make a second attack with a bonus die. If both hit, the target suffers a penalty die on their next action.",
      skills: "",
      prerequisite: [ "pounce_and_break", "predators_patience" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    ghostclaw_alpha: {
      name_key: "talent_feran_ghostclaw_alpha-u",
      rule_text_key: "talent_feran_ghostclaw_alpha_rules-u",
      name: "Ghostclaw Alpha",
      description: "Once per session, before initiative is rolled, you may take a single free action: either move (short range), make a melee/unarmed attack, or attempt to enter stealth or cover if plausible.",
      skills: "",
      prerequisite: [ "apex_reflex", "stalkers_cascade" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    pack_memory_living_instinct: {
      name_key: "talent_feran_pack_memory_living_instinct-u",
      rule_text_key: "talent_feran_pack_memory_living_instinct_rules-u",
      name: "Pack Memory, Living Instinct",
      description: "Once per session, declare a Pack Call. For the rest of the scene, up to two allies within short range gain +10% to Dodge or Athletics, may reroll one failed melee attack or Dodge, and do not provoke attacks of opportunity when moving toward you.",
      skills: "",
      prerequisite: [ "pack_alphas_demand", "predators_terrain" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    pulse_lock_drive: {
      name_key: "talent_feran_pulse_lock_drive-u",
      rule_text_key: "talent_feran_pulse_lock_drive_rules-u",
      name: "Pulse-Lock Drive",
      description: "Once per session, after a successful melee or unarmed attack, shift one range band and make a free attack against a second target. This movement does not provoke attacks of opportunity. If both attacks hit, regain 2 Strain and impose a penalty die to Dodge rolls against you (short range only) until the end of your next turn.",
      skills: "",
      prerequisite: [ "chain_strike_instinct", "stalkers_cascade" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    threadbound_mastery: {
      name_key: "talent_feran_threadbound_mastery-u",
      rule_text_key: "talent_feran_threadbound_mastery_rules-u",
      name: "Threadbound Mastery",
      description: "Once per session, for the remainder of the scene, you ignore terrain penalties and may shift one range band as a free action once per round, so long as the movement includes climbing, leaping, or difficult ground.",
      skills: "",
      prerequisite: [ "predators_terrain" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    ghostclaw_alpha: {
      name: "Ghostclaw Alpha",
      description: "Once per session, before initiative is rolled, you may take a single free action: either move (short range), make a melee/unarmed attack, or attempt to enter stealth or cover if plausible.",
      prerequisite: ["apex_reflex", "stalkers_cascade"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    pack_memory_living_instinct: {
      name: "Pack Memory, Living Instinct",
      description: "Once per session, declare a Pack Call. For the rest of the scene, up to two allies within short range gain +10% to Dodge or Athletics, may reroll one failed melee attack or Dodge, and do not provoke attacks of opportunity when moving toward you.",
      prerequisite: ["pack_alphas_demand", "predators_terrain"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    pulse_lock_drive: {
      name: "Pulse-Lock Drive",
      description: "Once per session, after a successful melee or unarmed attack, shift one range band and make a free attack against a second target. This movement does not provoke attacks of opportunity. If both attacks hit, regain 2 Strain and impose a penalty die to Dodge rolls against you (short range only) until the end of your next turn.",
      prerequisite: ["chain_strike_instinct", "stalkers_cascade"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    threadbound_mastery: {
      name: "Threadbound Mastery",
      description: "Once per session, for the remainder of the scene, you ignore terrain penalties and may shift one range band as a free action once per round, so long as the movement includes climbing, leaping, or difficult ground.",
      prerequisite: ["predators_terrain"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    }        
  },
  human : {
    battle_tested_gut: {
      name_key:  "talent_human_battle_tested_gut-u",
      rule_text_key: "talent_human_battle_tested_gut_rules-u",
      name: "Battle-Tested Gut",
      description: "Once per session, when entering a potentially dangerous situation, ask the GM: Do I feel something is off? The GM must answer truthfully (vaguely if appropriate).",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    hard_lesson: {
      name_key:  "talent_human_hard_lesson-u",
      rule_text_key: "talent_human_hard_lesson_rules-u",
      name: "Hard Lesson",
      description: "Once per session, reroll a failed skill check. You must take the second result. This reflects the human knack for learning through pain and persistence. Optional: Spend 2 Strain to attempt a second reroll immediately after the first.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    instinct_over_training: {
      name_key:  "talent_human_instinct_over_training-u",
      rule_text_key: "talent_human_instinct_over_training_rules-u",
      name: "Instinct Over Training",
      description: "Use Education in place of any untrained knowledge skill (Arcana, Occult Lore, Forbidden Lore, History, Law, etc.) once per session, at one difficulty higher.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    makeshift_medic: {
      name_key:  "talent_human_makeshift_medic-u",
      rule_text_key: "talent_human_makeshift_medic_rules-u",
      name: "Makeshift Medic",
      description: "Once per session, when attempting a First Aid check without proper medical tools, gain a bonus die. Humans improvise with what they have.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    no_stranger_to_pain: {
      name_key:  "talent_human_no_stranger_to_pain-u",
      rule_text_key: "talent_human_no_stranger_to_pain_rules-u",
      name: "No Stranger to Pain",
      description: "Once per session, roll with a bonus die when making a CON roll to stay conscious after suffering a major wound.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    quick_fixer: {
      name_key:  "talent_human_quick_fixer-u",
      rule_text_key: "talent_human_quick_fixer_rules-u",
      name: "Quick Fixer",
      description: "Choose one: gain +10% to Electronics, Mechanics, or Slicing. This reflects cross-training in common survival tech. This choice is permanent and may only be taken once.",
      skills: [ "electronics", "mechanics", "slicing" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    skilled_focus: {
      name_key:  "talent_human_skilled_focus-u",
      rule_text_key: "talent_human_skilled_focus_rules-u",
      name: "Skilled Focus",
      description: "Choose one: gain +10% to any non-combat, non-magic skill. This reflects training or life experience in a particular area. May only be taken once.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    social_versatility: {
      name_key:  "talent_human_social_versatility-u",
      rule_text_key: "talent_human_social_versatility_rules-u",
      name: "Social Versatility",
      description: "Once per session, reroll any failed Charm, Deception, or Persuade check. This reflects the human gift for adapting socially on the fly.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    cross_trained: {
      name_key:  "talent_human_cross_trained-u",
      rule_text_key: "talent_human_cross_trained_rules-u",
      name: "Cross-Trained",
      description: "Choose one additional Class Skill from any profession and gain +10% in it. This may only be taken once. Optional: Spend 1 Strain to treat a skill as trained for advancement purposes until the end of session.",
      skills: "",
      prerequisite: [ "quick_learner", "skilled_focus" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    defiant_resilience: {
      name_key:  "talent_human_defiant_resilience-u",
      rule_text_key: "talent_human_defiant_resilience_rules-u",
      name: "Defiant Resilience",
      description: "Once per session, ignore the effects of one failed Fear or Mental Trauma check (GM discretion). Optional: Spend 2 Strain to also gain a bonus die to your next Willpower or Insight check during the same scene.",
      skills: "",
      prerequisite: [ "no_stranger_to_pain" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    improvised_tools: {
      name_key:  "talent_human_improvised_tools-u",
      rule_text_key: "talent_human_improvised_tools_rules-u",
      name: "Improvised Tools",
      description: "Once per session, ignore the penalty for lacking tools when making a Mechanics, Electronics, or Slicing check. You’ve duct-taped worse.",
      skills: "",
      prerequisite: [ "quick_fixer" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    lucky_timing: {
      name_key:  "talent_human_lucky_timing-u",
      rule_text_key: "talent_human_lucky_timing_rules-u",
      name: "Lucky Timing",
      description: "Once per session, choose one other player. After they fail a skill check, you may declare, ‘Wait—I’ve got this.’ You immediately attempt the same roll yourself with a bonus die.",
      skills: "",
      prerequisite: [ "skilled_focus", "social_versatility" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    quick_learner: {
      name_key:  "talent_human_quick_learner-u",
      rule_text_key: "talent_human_quick_learner_rules-u",
      name: "Quick Learner",
      description: "When you succeed at a roll for an untrained skill (one not granted by your Race or Profession), gain a bonus die the next time you use that skill during this session.",
      skills: "",
      prerequisite: [ "battle_tested_gut", "hard_lesson", "instinct_over_training", "makeshift_medic", "no_stranger_to_pain", "quick_fixer", "skilled_focus", "social_versatility" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    situational_awareness: {
      name_key:  "talent_human_situational_awareness-u",
      rule_text_key: "talent_human_situational_awareness_rules-u",
      name: "Situational Awareness",
      description: "Once per session, gain a bonus die to a Perception, Insight, or Listen check during a high-stress scene (combat, infiltration, or tense social standoff).",
      skills: "",
      prerequisite: [ "battle_tested_gut", "instinct_over_training" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    spontaneous_strategist: {
      name_key:  "talent_human_spontaneous_strategist-u",
      rule_text_key: "talent_human_spontaneous_strategist_rules-u",
      name: "Spontaneous Strategist",
      description: "Once per scene, gain a bonus die on a Dodge, Persuade, or Tactical (if used) roll made in response to an unexpected turn of events. Optional: Spend 1 Strain to activate this outside your normal action, as a reactive call.",
      skills: "",
      prerequisite: [ "hard_lesson" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    break_the_pattern: {
      name_key:  "talent_human_break_the_pattern-u",
      rule_text_key: "talent_human_break_the_pattern_rules-u",
      name: "Break the Pattern",
      description: "Once per session, negate one enemy’s bonus die (declared after they roll, before results are finalized).",
      skills: "",
      prerequisite: [ "lucky_timing", "social_versatility" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    chain_of_luck: {
      name_key:  "talent_human_chain_of_luck-u",
      rule_text_key: "talent_human_chain_of_luck_rules-u",
      name: "Chain of Luck",
      description: "Once per session, when you roll a natural 01–05 on any skill check, immediately gain a bonus die to your next roll.",
      skills: "",
      prerequisite: [ "hard_lesson", "lucky_timing" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    dig_deep: {
      name_key:  "talent_human_dig_deep-u",
      rule_text_key: "talent_human_dig_deep_rules-u",
      name: "Dig Deep",
      description: "Once per session, push through a wound or mental strain: ignore a penalty die from fatigue, injury, or Veil exposure for one roll. Optional: Spend 2 Strain to ignore two penalty dice or apply the effect to two rolls this scene.",
      skills: "",
      prerequisite: [ "defiant_resilience" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    just_enough_prep: {
      name_key:  "talent_human_just_enough_prep-u",
      rule_text_key: "talent_human_just_enough_prep_rules-u",
      name: "Just Enough Prep",
      description: "Once per session, declare you prepped for this. Reveal a basic tool, piece of info, or contact that reasonably helps the scene. Gain a bonus die to one roll using it. Optional: Spend 2 Strain to declare an additional prep aid during the same scene.",
      skills: "",
      prerequisite: [ "improvised_tools", "situational_awareness" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    momentum_shift: {
      name_key:  "talent_human_momentum_shift-u",
      rule_text_key: "talent_human_momentum_shift_rules-u",
      name: "Momentum Shift",
      description: "Once per session, after a successful roll, you may immediately attempt another action (of a different skill) with a bonus die. Can be used for daring combos or sudden shifts in tempo.",
      skills: "",
      prerequisite: [ "quick_learner", "spontaneous_strategist" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    pull_from_memory: {
      name_key:  "talent_human_pull_from_memory-u",
      rule_text_key: "talent_human_pull_from_memory_rules-u",
      name: "Pull From Memory",
      description: "Once per session, ask the GM: Have I read, seen, or heard of this before? If yes, gain a bonus die to a related Lore, History, or Magic (any) roll.",
      skills: "",
      prerequisite: [ "instinct_over_training" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    luck_bends_for_me: {
      name_key: "talent_human_luck_bends_for_me-u",
      rule_text_key: "talent_human_luck_bends_for_me_rules-u",
      name: "Luck Bends for Me",
      description: "At the start of each session, make two Luck advancement rolls instead of one. If you fail a roll, gain +1d10 Luck. Additionally, once per session, spend 5 Luck to reroll a failed skill roll.",
      skills: "",
      prerequisite: [ "chain_of_luck", "hard_lesson" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    master_of_none: {
      name_key: "talent_human_master_of_none-u",
      rule_text_key: "talent_human_master_of_none_rules-u",
      name: "Master of None",
      description: "Choose three skills in which you have at least 50%. Gain +10% in each. These do not have to be from the same category or Class list.",
      skills: "",
      prerequisite: [ "cross_trained", "skilled_focus" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: ""
    },
    tactical_improviser: {
      name_key: "talent_human_tactical_improviser-u",
      rule_text_key: "talent_human_tactical_improviser_rules-u",
      name: "Tactical Improviser",
      description: "Once per session, declare a flexible plan mid-scene. One ally you designate gains a bonus die once per round for the remainder of the scene, as long as their actions align with your stated approach. Optional: Spend 2 Strain per round to allow a second ally to benefit as well.",
      skills: "",
      prerequisite: [ "just_enough_prep", "momentum_shift" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    unshakable_focus: {
      name_key: "talent_human_unshakable_focus-u",
      rule_text_key: "talent_human_unshakable_focus_rules-u",
      name: "Unshakable Focus",
      description: "Once per session, become immune to Fear, Pain, or Mental Trauma for the duration of a scene. While active, gain a bonus die to any Willpower-related roll. Optional: Instead of using it once per session, you may activate this once per scene by spending 4 Strain.",
      skills: "",
      prerequisite: [ "defiant_resilience", "dig_deep" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    }
  },
  khadra: {
    anchorpoint: {
      name_key:  "talent_khadra_anchorpoint-u",
      rule_text_key: "talent_khadra_anchorpoint_rules-u",
      name: "Anchorpoint",
      description: "Once per session, gain a bonus die to resist being knocked prone, disarmed, or forcibly moved by terrain, shockwaves, or hostile powers.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    legacy_of_iron: {
      name_key:  "talent_khadra_legacy_of_iron-u",
      rule_text_key: "talent_khadra_legacy_of_iron_rules-u",
      name: "Legacy of Iron",
      description: "Choose one: gain +10% to Mechanics, Security Systems, or First Aid. Reflects the practical traditions of Khadra strongholds and Stonebound service.",
      skills: [ "first_aid", "mechanics", "security" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    measured_advance: {
      name_key:  "talent_khadra_measured_advance-u",
      rule_text_key: "talent_khadra_measured_advance_rules-u",
      name: "Measured Advance",
      description: "Once per scene, ignore all movement penalties from rubble, elevation shifts, or difficult terrain for one round. Also negate the first point of falling damage.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "scene"
    },
    oathbound_grit: {
      name_key:  "talent_khadra_oathbound_grit-u",
      rule_text_key: "talent_khadra_oathbound_grit_rules-u",
      name: "Oathbound Grit",
      description: "Once per session, after failing a Willpower or Constitution roll, you may reroll with a bonus die if the action supports a sworn duty, protective vow, or personal code.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    slow_to_bleed: {
      name_key:  "talent_khadra_slow_to_bleed-u",
      rule_text_key: "talent_khadra_slow_to_bleed_rules-u",
      name: "Slow to Bleed",
      description: "Once per session, when you suffer a major wound, you may delay the effects until the end of the next round. This does not reduce damage—only postpones collapse.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    steady_as_stone: {
      name_key:  "talent_khadra_steady_as_stone-u",
      rule_text_key: "talent_khadra_steady_as_stone_rules-u",
      name: "Steady as Stone",
      description: "Once per session, gain a bonus die to an Athletics or Coordination roll made to resist being staggered, tripped, or destabilized.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    still_as_judgment: {
      name_key:  "talent_khadra_still_as_judgment-u",
      rule_text_key: "talent_khadra_still_as_judgment_rules-u",
      name: "Still as Judgment",
      description: "Once per session, gain a bonus die to Insight, Interrogation, or Etiquette (Military) when acting from a position of command or formal authority.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    unbreakable_focus: {
      name_key:  "talent_khadra_unbreakable_focus-u",
      rule_text_key: "talent_khadra_unbreakable_focus_rules-u",
      name: "Unbreakable Focus",
      description: "Once per session, ignore one penalty die from pain, distraction, or ambient stress while performing a task requiring careful precision.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    ancestral_echo_guard: {
      name_key:  "talent_khadra_ancestral_echo_guard-u",
      rule_text_key: "talent_khadra_ancestral_echo_guard_rules-u",
      name: "Ancestral Echo Guard",
      description: "Once per scene, when rolling Willpower or Arcana to resist a magical effect, you may call on ancestral resilience and gain a bonus die to resist the effect.",
      skills: "",
      prerequisite: [ "unbreakable_focus" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    hold_the_line: {
      name_key:  "talent_khadra_hold_the_line-u",
      rule_text_key: "talent_khadra_hold_the_line_rules-u",
      name: "Hold the Line",
      description: "Once per session, when an adjacent ally is targeted by an attack, you may intercept the blow. Gain a bonus die to Dodge, or activate Weight of Stone to resist the damage from the attack.",
      skills: "",
      prerequisite: [ "anchorpoint" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    oath_echo_discipline: {
      name_key:  "talent_khadra_oath_echo_discipline-u",
      rule_text_key: "talent_khadra_oath_echo_discipline_rules-u",
      name: "Oath Echo Discipline",
      description: "Once per session, reroll a failed First Aid or Mechanics check if the action fulfills an oath, duty, or promise. Optional: spend 1 Strain to gain a bonus die instead of rerolling.",
      skills: "",
      prerequisite: [ "legacy_of_iron" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    path_of_the_immovable: {
      name_key:  "talent_khadra_path_of_the_immovable-u",
      rule_text_key: "talent_khadra_path_of_the_immovable_rules-u",
      name: "Path of the Immovable",
      description: "Once per session, when resisting forced movement or knockdown, treat a failed Constitution or Athletics roll as a success.",
      skills: "",
      prerequisite: [ "anchorpoint", "steady_as_stone" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    rooted_in_purpose: {
      name_key:  "talent_khadra_rooted_in_purpose-u",
      rule_text_key: "talent_khadra_rooted_in_purpose_rules-u",
      name: "Rooted in Purpose",
      description: "Once per session, when using Fight Back in melee or unarmed combat against two or more attackers in the same round, you may do so without suffering a penalty die on the second attack.",
      skills: "",
      prerequisite: [ "steady_as_stone" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    shield_of_legacy: {
      name_key:  "talent_khadra_shield_of_legacy-u",
      rule_text_key: "talent_khadra_shield_of_legacy_rules-u",
      name: "Shield of Legacy",
      description: "Once per scene, reduce incoming physical damage by 1d6. You must be aware of the attack and may not have moved during your turn to activate this effect.",
      skills: "",
      prerequisite: [ "anchorpoint", "measured_advance" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    stonecut_precision: {
      name_key:  "talent_khadra_stonecut_precision-u",
      rule_text_key: "talent_khadra_stonecut_precision_rules-u",
      name: "Stonecut Precision",
      description: "Once per session, gain a bonus die to any Unarmed Combat or Melee Weapons attack made while not moving that round.",
      skills: "",
      prerequisite: [ "anchorpoint", "steady_as_stone" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    stonewalk_rhythm: {
      name_key:  "talent_khadra_stonewalk_rhythm-u",
      rule_text_key: "talent_khadra_stonewalk_rhythm_rules-u",
      name: "Stonewalk Rhythm",
      description: "Once per session, after failing a Navigate check in a natural or ruined environment, you may choose to ignore the failure and proceed as though you had succeeded.",
      skills: "",
      prerequisite: [ "measured_advance" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    weight_everlasting: {
      name_key:  "talent_khadra_weight_everlasting-u",
      rule_text_key: "talent_khadra_weight_everlasting_rules-u",
      name: "Weight Everlasting",
      description: "When Weight of Stone is activated, you gain an additional +1 Damage Reduction.",
      skills: "",
      prerequisite: [ "anchorpoint" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: ""
    },
    echo_resonant_will: {
      name_key:  "talent_khadra_echo_resonant_will-u",
      rule_text_key: "talent_khadra_echo_resonant_will_rules-u",
      name: "Echo-Resonant Will",
      description: "Once per session, after succeeding on a Willpower or Arcana roll to resist a magical or spiritual effect, regain 1d6 Strain and gain a bonus die on your next roll.",
      skills: "",
      prerequisite: [ "ancestral_echo_guard" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    last_wall_protocol: {
      name_key:  "talent_khadra_last_wall_protocol-u",
      rule_text_key: "talent_khadra_last_wall_protocol_rules-u",
      name: "Last Wall Protocol",
      description: "Once per session, when you would be reduced to 0 HP or below by a physical attack, you may instead roll Constitution with a bonus die. On a success, you are reduced to 1 HP instead of 0, and any excess damage is ignored.",
      skills: "",
      prerequisite: [ "hold_the_line", "rooted_in_purpose" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    legacy_chainstrike: {
      name_key:  "talent_khadra_legacy_chainstrike-u",
      rule_text_key: "talent_khadra_legacy_chainstrike_rules-u",
      name: "Legacy Chainstrike",
      description: "Once per session, after hitting an enemy with a melee or unarmed attack, you may immediately make a second attack against a different enemy within engaged range by spending 2 Strain.",
      skills: "",
      prerequisite: [ "rooted_in_purpose" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    resolve_unyielding: {
      name_key:  "talent_khadra_resolve_unyielding-u",
      rule_text_key: "talent_khadra_resolve_unyielding_rules-u",
      name: "Resolve Unyielding",
      description: "Once per session, ignore all penalty dice for a full round. You may also reroll a failed Constitution or Willpower check once during that round with a bonus die.",
      skills: "",
      prerequisite: [ "hold_the_line" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    stonewalk_continuum: {
      name_key:  "talent_khadra_stonewalk_continuum-u",
      rule_text_key: "talent_khadra_stonewalk_continuum_rules-u",
      name: "Stonewalk Continuum",
      description: "Once per session, you may automatically pass a Navigate or Survival (Wilderness) check to reach a destination under extreme conditions. Additionally, you and one ally ignore terrain penalties for the remainder of the scene.",
      skills: "",
      prerequisite: [ "stonewalk_rhythm" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    stonewarden_tactician: {
      name_key:  "talent_khadra_stonewarden_tactician-u",
      rule_text_key: "talent_khadra_stonewarden_tactician_rules-u",
      name: "Stonewarden Tactician",
      description: "Once per scene, designate an ally within Short range. Until the end of the scene, whenever that ally would suffer an attack while within Short range of you, you may take the hit instead.",
      skills: "",
      prerequisite: [ "shield_of_legacy" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    verdict_of_stone: {
      name_key:  "talent_khadra_verdict_of_stone-u",
      rule_text_key: "talent_khadra_verdict_of_stone_rules-u",
      name: "Verdict of Stone",
      description: "Once per session, when issuing a formal challenge, ultimatum, or order in combat or a high-stakes negotiation, you may force all enemies within Short range to roll Insight or Willpower vs your Intimidate or Etiquette (Military). If they fail, they suffer a penalty die on their next aggressive action, and you gain a bonus die to any action enforcing your command during the same round.",
      skills: "",
      prerequisite: [ "rooted_in_purpose" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    weight_makes_the_weapon: {
      name_key:  "talent_khadra_weight_makes_the_weapon-u",
      rule_text_key: "talent_khadra_weight_makes_the_weapon_rules-u",
      name: "Weight Makes the Weapon",
      description: "Once per session, when making a Melee or Unarmed Combat attack after remaining stationary on your last turn, you may add a bonus die and force the target to roll with a penalty die to resist knockback or disarm effects.",
      skills: "",
      prerequisite: [ "rooted_in_purpose" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    bastion_unyielding: {
      name_key:  "talent_khadra_bastion_unyielding-u",
      rule_text_key: "talent_khadra_bastion_unyielding_rules-u",
      name: "Bastion Unyielding",
      description: "Once per session, activate as a free action. Until the end of the current round: Gain +3 Damage Reduction (Physical), stacking with any other sources. You cannot be pushed, pulled, or knocked prone.",
      skills: "",
      prerequisite: [ "last_wall_protocol", "resolve_unyielding" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    echo_of_the_first_stone: {
      name_key:  "talent_khadra_echo_of_the_first_stone-u",
      rule_text_key: "talent_khadra_echo_of_the_first_stone_rules-u",
      name: "Echo of the First Stone",
      description: "Once per session, call on the legacy of the Old Holds. For the rest of the scene, you gain a bonus die to all Constitution and Willpower rolls, and automatically succeed on any roll to remain conscious from wounds or magical shock. This effect ends early if you are reduced to 0 HP.",
      skills: "",
      prerequisite: [ "echo_resonant_will", "resolve_unyielding" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    oath_of_the_deep_hold: {
      name_key:  "talent_khadra_oath_of_the_deep_hold-u",
      rule_text_key: "talent_khadra_oath_of_the_deep_hold_rules-u",
      name: "Oath of the Deep Hold",
      description: "Once per session, when an ally within Short range is about to be hit by a melee or ranged attack, you may spend 3 Strain as a reaction to move to Engaged range and become the new target of the attack. If already Engaged, no movement or spending of Strain is required. You gain a bonus die to Dodge or may use Weight of Stone against the incoming attack.",
      skills: "",
      prerequisite: [ "last_wall_protocol", "stonewarden_tactician" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    stone_sung_authority: {
      name_key:  "talent_khadra_stone_sung_authority-u",
      rule_text_key: "talent_khadra_stone_sung_authority_rules-u",
      name: "Stone-Sung Authority",
      description: "Once per session, issue a command as a free action at the start of combat or during a tense social exchange. One ally within Short range gains a bonus die on all Willpower or Dodge checks for the rest of the scene. You also gain a bonus die to Persuade or Intimidate rolls made to enforce your command.",
      skills: "",
      prerequisite: [ "stonewarden_tactician", "verdict_of_stone" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    }
  },
  kitsu: {
    aether_flick: {
      name_key:  "talent_kitsu_aether_flick-u",
      rule_text_key: "talent_kitsu_aether_flick_rules-u",
      name: "Aether Flick",
      description: "Gain +10% to Slicing, Magic (Illusion), or Magic (Enchantment) (choose one). Permanent. Reflects natural cyber-mystic synergy.",
      skills: [ "magic_enchantment", "magic_illusion", "slicing" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    mask_of_the_moment: {
      name_key:  "talent_kitsu_mask_of_the_moment-u",
      rule_text_key: "talent_kitsu_mask_of_the_moment_rules-u",
      name: "Mask of the Moment",
      description: "Once per session, adopt a false identity, mask, or digital persona for a scene. Gain a bonus die to Disguise, Deception, or Charm. Optional: Spend 1 Strain to cast one spell (Illusion or Enchantment) without revealing its source.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    pulse_trickster: {
      name_key:  "talent_kitsu_pulse_trickster-u",
      rule_text_key: "talent_kitsu_pulse_trickster_rules-u",
      name: "Pulse Trickster",
      description: "Once per session, spoof a basic scan or biometric system with a Slicing or Deception roll (bonus die). Optional: Spend 1 Strain to leave behind a false signal or fake ID tag.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    streetwise_instincts: {
      name_key:  "talent_kitsu_streetwise_instincts-u",
      rule_text_key: "talent_kitsu_streetwise_instincts_rules-u",
      name: "Streetwise Instincts",
      description: "Gain +10% to Streetwise, Stealth, or Insight (choose one). Permanent. Reflects your upbringing in covert or cunning environments.",
      skills: [ "insight", "stealth", "streetwise" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    twitch_reflex: {
      name_key:  "talent_kitsu_twitch_reflex-u",
      rule_text_key: "talent_kitsu_twitch_reflex_rules-u",
      name: "Twitch Reflex",
      description: "Once per scene, gain a bonus die on an Initiative, Dodge, or Slicing roll during a high-stress moment (combat, pursuit, or scan). Optional: Spend 1 Strain to use this after your roll.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "scene"
    },
    veil_sniff: {
      name_key:  "talent_kitsu_veil_sniff-u",
      rule_text_key: "talent_kitsu_veil_sniff_rules-u",
      name: "Veil-Sniff",
      description: "Once per session, detect nearby Veil anomalies (spirit traces, illusions, ambient corruption). Grants a bonus die on your next Arcana or Spirit Lore check to analyze or counter it.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    whisperstep: {
      name_key:  "talent_kitsu_whisperstep-u",
      rule_text_key: "talent_kitsu_whisperstep_rules-u",
      name: "Whisperstep",
      description: "Once per session, automatically succeed on a Stealth check when moving from shadow to shadow or through unstable ground. Optional: Spend 1 Strain to bypass magical surveillance (if such is present).",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    flicker_edge_movement: {
      name_key:  "talent_kitsu_flicker_edge_movement-u",
      rule_text_key: "talent_kitsu_flicker_edge_movement_rules-u",
      name: "Flicker-Edge Movement",
      description: "Once per scene, after a successful Dodge, move one zone as if blinking/glitching. Optional: Spend 1 Strain to gain a bonus die on your next attack or spell.",
      skills: "",
      prerequisite: [ "streetwise_instincts", "twitch_reflex" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    foxs_masquerade: {
      name_key:  "talent_kitsu_foxs_masquerade-u",
      rule_text_key: "talent_kitsu_foxs_masquerade_rules-u",
      name: "Fox’s Masquerade",
      description: "Once per session, gain a bonus die on a Disguise, Deception, or Illusion spell roll when assuming a fake identity, mimic, or scripted behavior.",
      skills: "",
      prerequisite: [ "mask_of_the_moment", "pulse_trickster" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    hollow_sound: {
      name_key:  "talent_kitsu_hollow_sound-u",
      rule_text_key: "talent_kitsu_hollow_sound_rules-u",
      name: "Hollow Sound",
      description: "Once per session, move nearly inaudibly for 1 round. Gain a bonus die on your next Stealth or Melee roll. Optional: Spend 1 Strain to become immune to audio sensors during this movement.",
      skills: "",
      prerequisite: [ "whisperstep" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    nerve_hijack: {
      name_key:  "talent_kitsu_nerve_hijack-u",
      rule_text_key: "talent_kitsu_nerve_hijack_rules-u",
      name: "Nerve Hijack",
      description: "After a failed Slicing roll, immediately reroll with a bonus die. Optional: Spend 2 Strain to treat the result as a Hard success against Level 4 or lower countermeasures.",
      skills: "",
      prerequisite: [ "aether_flick" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: ""
    },
    sensory_overclock: {
      name_key:  "talent_kitsu_sensory_overclock-u",
      rule_text_key: "talent_kitsu_sensory_overclock_rules-u",
      name: "Sensory Overclock",
      description: "Once per session, gain a bonus die on two linked Insight or Perception rolls during a tense scene. Optional: Spend 1 Strain to gain a second bonus die on the follow-up roll.",
      skills: "",
      prerequisite: [ "streetwise_instincts", "twitch_reflex" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    urban_echo: {
      name_key:  "talent_kitsu_urban_echo-u",
      rule_text_key: "talent_kitsu_urban_echo_rules-u",
      name: "Urban Echo",
      description: "Once per session, ask the GM: “What’s the fastest way out (or through) this place?” Optional: Spend 1 Strain to gain a bonus die on Athletics, Coordination, or Slicing while acting on that information.",
      skills: "",
      prerequisite: [ "streetwise_instincts", "whisperstep" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    blurring_veil: {
      name_key: "talent_kitsu_blurring_veil-u",
      rule_text_key: "talent_kitsu_blurring_veil_rules-u",
      name: "Blurring Veil",
      description: "Once per session, activate a Veil afterimage that lasts 1 round. Gain a bonus die on Dodge and impose a penalty die on one attacker. Optional: Spend 2 Strain to make the illusion appear real to onlookers.",
      skills: "",
      prerequisite: [ "hollow_sound", "one_breath_casting" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    coded_whisper: {
      name_key: "talent_kitsu_coded_whisper-u",
      rule_text_key: "talent_kitsu_coded_whisper_rules-u",
      name: "Coded Whisper",
      description: "Once per session, embed a hidden command or subliminal cue into a message, Illusion, or phrase. Gain a bonus die to your next Persuade, Slicing, or Enchantment roll tied to the effect.",
      skills: "",
      prerequisite: [ "foxs_masquerade", "pulse_trickster" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    mirror_nerve: {
      name_key: "talent_kitsu_mirror_nerve-u",
      rule_text_key: "talent_kitsu_mirror_nerve_rules-u",
      name: "Mirror Nerve",
      description: "Once per session, after witnessing an enemy action (Slicing, Unarmed Combat, or a spell), spend 2 Strain to mimic part of it. Gain a bonus die on your next roll using the same skill or spell school.",
      skills: "",
      prerequisite: [ "foxs_masquerade", "one_breath_casting" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    one_breath_casting: {
      name_key: "talent_kitsu_one_breath_casting-u",
      rule_text_key: "talent_kitsu_one_breath_casting_rules-u",
      name: "One Breath Casting",
      description: "Once per session, cast a non-damaging Illusion, Alteration, or Enchantment spell as a free action. Optional: Spend 1 Strain to reroll the casting with a bonus die if the first attempt fails.",
      skills: "",
      prerequisite: [ "aether_flick", "foxs_masquerade" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    phase_residue: {
      name_key: "talent_kitsu_phase_residue-u",
      rule_text_key: "talent_kitsu_phase_residue_rules-u",
      name: "Phase Residue",
      description: "Once per session, after using Blurring Veil or Flicker-Edge Movement (or a similar movement talent), leave behind a Veil echo. Gain a bonus die on your next Stealth or Dodge roll. Optional: Spend 2 Strain to impose a penalty die on one pursuer’s Perception or Track roll this round.",
      skills: "",
      prerequisite: [ "blurring_veil", "flicker_edge_movement" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    shadow_map: {
      name_key: "talent_kitsu_shadow_map-u",
      rule_text_key: "talent_kitsu_shadow_map_rules-u",
      name: "Shadow Map",
      description: "Once per session, declare that you’ve pre-scouted a nearby location. Gain a bonus die to Navigation, Slicing, or Stealth rolls related to that area for the rest of the scene.",
      skills: "",
      prerequisite: [ "sensory_overclock", "streetwise_instincts" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    slipframe_trigger: {
      name_key: "talent_kitsu_slipframe_trigger-u",
      rule_text_key: "talent_kitsu_slipframe_trigger_rules-u",
      name: "Slipframe Trigger",
      description: "Once per session, after activating a device, spell, or environmental effect, trigger a prelaid illusion or glitch to mislead observers. Gain a bonus die to your next Deception, Stealth, or Illusion check. Optional: Spend 2 Strain to delay an enemy or sensor by 1 round (GM discretion).",
      skills: "",
      prerequisite: [ "flicker_edge_movement", "pulse_trickster" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    mask_of_the_hunt: {
      name_key: "talent_kitsu_mask_of_the_hunt-u",
      rule_text_key: "talent_kitsu_mask_of_the_hunt_rules-u",
      name: "Mask of the Hunt",
      description: "Once per session, enter a trance-like Hunt State: gain a bonus die on Insight and Slicing rolls for the rest of the scene. You also treat one failed Stealth check as a success.",
      skills: "",
      prerequisite: ["blurring_veil", "shadow_map"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    nine_lives_protocol: {
      name_key: "talent_kitsu_nine_lives_protocol-u",
      rule_text_key: "talent_kitsu_nine_lives_protocol_rules-u",
      name: "Nine Lives Protocol",
      description: "Once per session, negate a successful attack, Slicing intrusion, or spell targeting you. You vanish for one round in a blur of arcane misdirection and sensor static. Optional: Spend 3 Strain to leave behind a false target.",
      skills: "",
      prerequisite: ["blurring_veil", "one_breath_casting"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    rewired_pulse: {
      name_key: "talent_kitsu_rewired_pulse-u",
      rule_text_key: "talent_kitsu_rewired_pulse_rules-u",
      name: "Rewired Pulse",
      description: "Once per session, after suffering Veil backlash, spell failure, or a Slicing fumble, you may instantly reroll the check and reduce its Strain cost by 1 die step. Optional: Spend 1 Strain to also gain a bonus die.",
      skills: "",
      prerequisite: ["coded_whisper", "mirror_nerve"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    tailwind_gambit: {
      name_key: "talent_kitsu_tailwind_gambit-u",
      rule_text_key: "talent_kitsu_tailwind_gambit_rules-u",
      name: "Tailwind Gambit",
      description: "Once per session, at the end of a combat round or scene, declare a gambit based on previous actions (e.g., backdoor planted, spell seeded, warning given). You and one ally gain a bonus die on your next roll.",
      skills: "",
      prerequisite: ["foxs_masquerade", "shadow_map"],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    }
  },
  lyranni: {
    aether_override: {
      name_key: "talent_lyranni_aether_override-u",
      rule_text_key: "talent_lyranni_aether_override_rules-u",
      name: "Aether Override",
      description: "Once per session, before you roll Slicing, Electronics, or Mechanics, you may invoke an override surge: roll with a bonus die and ignore one penalty die from environmental interference or counter-intrusion.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    echo_in_the_veins: {
      name_key: "talent_lyranni_echo_in_the_veins-u",
      rule_text_key: "talent_lyranni_echo_in_the_veins_rules-u",
      name: "Echo in the Veins",
      description: "Choose one: gain +10% to Performance (any), Insight, or Streetwise. Reflects the lyrical awareness and social perception of the Lyranni.",
      skills: [ "insight", "perform_acting", "perform_dance", "perform_impersonation", "perform_instrument", "perform_vocal", "streetwise" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    glimmerstep: {
      name_key: "talent_lyranni_glimmerstep-u",
      rule_text_key: "talent_lyranni_glimmerstep_rules-u",
      name: "Glimmerstep",
      description: "Once per scene, spend 1 Strain to blur your magical footprint. Gain a bonus die on your next Stealth or Arcana roll to avoid detection by magical, spiritual, or surveillance effects.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "scene"
    },
    legacy_spark: {
      name_key: "talent_lyranni_legacy_spark-u",
      rule_text_key: "talent_lyranni_legacy_spark_rules-u",
      name: "Legacy Spark",
      description: "Once per session, reroll a failed Arcana, Occult Lore, or Etiquette (Lyranni) check.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    resonant_poise: {
      name_key: "talent_lyranni_resonant_poise-u",
      rule_text_key: "talent_lyranni_resonant_poise_rules-u",
      name: "Resonant Poise",
      description: "Once per session, when dealing with those who recognize your Veilmark or lineage, gain a bonus die to Etiquette (High Society or Lyranni) or Charm for the rest of the scene.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    social_ghost: {
      name_key: "talent_lyranni_social_ghost-u",
      rule_text_key: "talent_lyranni_social_ghost_rules-u",
      name: "Social Ghost",
      description: "Use Charm in place of Persuade or Intimidate when relying on elegance, mystique, or cultural presence.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    threadwalker: {
      name_key: "talent_lyranni_threadwalker-u",
      rule_text_key: "talent_lyranni_threadwalker_rules-u",
      name: "Threadwalker",
      description: "Gain a bonus die to Arcana, Spirit Lore, or Occult Lore (choose one) when interacting with Veil phenomena. May be taken multiple times, once per skill.",
      skills: [ "arcana", "occult", "spirit_lore" ],
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    veil_blooded_sense: {
      name_key: "talent_lyranni_veil_blooded_sense-u",
      rule_text_key: "talent_lyranni_veil_blooded_sense_rules-u",
      name: "Veil-Blooded Sense",
      description: "Once per session, detect the nearest major source of Veil activity (spirit, ward, corruption, or echo). Gain a bonus die on your next Arcana or Spirit Lore roll to investigate.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    veilsight: {
      name_key: "talent_lyranni_veilsight-u",
      rule_text_key: "talent_lyranni_veilsight_rules-u",
      name: "Veilsight",
      description: "Activate as an action to perceive spirits, magical echoes, and arcane disturbances layered in the Veil. While active, gain a bonus die to Arcana or Spirit Lore to analyze anomalies. Spend 1 strain for 1 round or spend 4 strain to maintain for the entire scene.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "scene"
    },
    ancestral_resonance: {
      name_key: "talent_lyranni_ancestral_resonance-u",
      rule_text_key: "talent_lyranni_ancestral_resonance_rules-u",
      name: "Ancestral Resonance",
      description: "Once per session, when dealing with ancestral spirits, relics, or Lyranni rites , gain a bonus die to Arcana, Occult Lore, or Spirit Lore and, on success, ask the GM one clarifying question about the item/rite’s intent or memory.",
      skills: "",
      prerequisite: [ "legacy_spark" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    illuminated_touch: {
      name_key: "talent_lyranni_illuminated_touch-u",
      rule_text_key: "talent_lyranni_illuminated_touch_rules-u",
      name: "Illuminated Touch",
      description: "Once per session, spend 1 Strain to read spiritual residue or arcane emotion imprinted on a location or item. Gain a bonus die to Insight or Spirit Lore, and on success receive one concrete sensory impression (image, phrase, or feeling) from the imprint.",
      skills: "",
      prerequisite: [ "threadwalker", "veilsight" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    memory_bound_echo: {
      name_key: "talent_lyranni_memory_bound_echo-u",
      rule_text_key: "talent_lyranni_memory_bound_echo_rules-u",
      name: "Memory-Bound Echo",
      description: "Once per session, choose Arcana, Occult Lore, or Spirit Lore and gain a bonus die on all checks with that skill for the remainder of the scene.",
      skills: "",
      prerequisite: [ "legacy_spark" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    rite_bound: {
      name_key: "talent_lyranni_rite_bound-u",
      rule_text_key: "talent_lyranni_rite_bound_rules-u",
      name: "Rite-Bound",
      description: "Once per session, attempt to banish a spirit using any trained Magic skill. You must flavor the action through a Lyranni rite or ancestral tradition.",
      skills: "",
      prerequisite: [ "veil_blooded_sense" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    spirit_favored: {
      name_key: "talent_lyranni_spirit_favored-u",
      rule_text_key: "talent_lyranni_spirit_favored_rules-u",
      name: "Spirit-Favored",
      description: "Once per session, for one scene in which you primarily interact with spirits or Veil-bound entities, roll Charm, Persuade, or Insight with a bonus die.",
      skills: "",
      prerequisite: [ "veilsight" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    veil_dancer: {
      name_key: "talent_lyranni_veil_dancer-u",
      rule_text_key: "talent_lyranni_veil_dancer_rules-u",
      name: "Veil Dancer",
      description: "Once per session, gain a bonus die to Deception, Stealth, or Performance (any).",
      skills: "",
      prerequisite: [ "echo_in_the_veins" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    veilsplice: {
      name_key: "talent_lyranni_veilsplice-u",
      rule_text_key: "talent_lyranni_veilsplice_rules-u",
      name: "Veilsplice",
      description: "Once per session, before a Slicing/Electronics roll, declare a veilsplice: treat non-sapient Veil interference as neutral (no penalty dice) and roll with a bonus die.",
      skills: "",
      prerequisite: [ "aether_override" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    whispers_beyond: {
      name_key: "talent_lyranni_whispers_beyond-u",
      rule_text_key: "talent_lyranni_whispers_beyond_rules-u",
      name: "Whispers Beyond",
      description: "Once per session, commune with a minor spirit or residual echo to receive a cryptic insight or spiritual impression.",
      skills: "",
      prerequisite: [ "veilsight" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    words_like_silk: {
      name_key: "talent_lyranni_words_like_silk-u",
      rule_text_key: "talent_lyranni_words_like_silk_rules-u",
      name: "Words Like Silk",
      description: "Once per session, declare one social statement to be treated as credible by neutral NPCs unless given a strong reason to doubt. Gain a bonus die to Charm or Persuade during that interaction.",
      skills: "",
      prerequisite: [ "social_ghost" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    blood_rite_channeling: {
      name_key: "talent_lyranni_blood_rite_channeling-u",
      rule_text_key: "talent_lyranni_blood_rite_channeling_rules-u",
      name: "Blood Rite Channeling",
      description: "Once per session, when below half Strain , cast one spell with a bonus die ; its Strain die increases by one step (e.g., 1d6 → 1d8). Does not stack with other strain-mod effects.",
      skills: "",
      prerequisite: "",
	  prerequisiteAny: { tier: 2, count: 1 },
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    echo_binding: {
      name_key: "talent_lyranni_echo_binding-u",
      rule_text_key: "talent_lyranni_echo_binding_rules-u",
      name: "Echo Binding",
      description: "Once per session, bind a minor cooperative spirit. It aids for the scene, granting a bonus die to Perception, Arcana, or one Magic skill (chosen on binding).",
      skills: "",
      prerequisite: [ "memory_bound_echo", "rite_bound" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    lyranni_discipline: {
      name_key: "talent_lyranni_lyranni_discipline-u",
      rule_text_key: "talent_lyranni_lyranni_discipline_rules-u",
      name: "Lyranni Discipline",
      description: "Once per session, when above half Strain , cast one spell and reduce its Strain die by one step. May not be used with Blood Rite Channeling on the same cast.",
      skills: "",
      prerequisite: "",
	  prerequisiteAny: { tier: 2, count: 1 },
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    shadow_echo_step: {
      name_key: "talent_lyranni_shadow_echo_step-u",
      rule_text_key: "talent_lyranni_shadow_echo_step_rules-u",
      name: "Shadow Echo Step",
      description: "Once per scene, after evading a spell or attack, move up to one range band up to long range as if phasing through shadow. Gain a bonus die to Dodge or Stealth.",
      skills: "",
      prerequisite: [ "glimmerstep", "veil_dancer" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    subtle_authority: {
      name_key: "talent_lyranni_subtle_authority-u",
      rule_text_key: "talent_lyranni_subtle_authority_rules-u",
      name: "Subtle Authority",
      description: "Once per session, gain a bonus die to Charm, Performance, or Etiquette (High Society) during a formal or elite social exchange.",
      skills: "",
      prerequisite: [ "social_ghost" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    true_veilsight: {
      name_key: "talent_lyranni_true_veilsight-u",
      rule_text_key: "talent_lyranni_true_veilsight_rules-u",
      name: "True Veilsight",
      description: "Veilsight may now be activated reflexively as a free action. While active, gain a bonus die to Arcana or Spirit Lore when studying arcane/spiritual effects. Spend 1 strain for 1 round or spend 4 strain to maintain for the entire scene.",
      skills: "",
      prerequisite: [ "veilsight" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    veil_laced_command: {
      name_key: "talent_lyranni_veil_laced_command-u",
      rule_text_key: "talent_lyranni_veil_laced_command_rules-u",
      name: "Veil-Laced Command",
      description: "Once per scene, spend 1 Strain when issuing a direct command in a formal or ritual setting. Gain a bonus die to Persuade or Intimidate, as long as you invoke Veilborn status or tradition.",
      skills: "",
      prerequisite: [ "spirit_favored", "words_like_silk" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    breath_of_the_veil: {
      name_key: "talent_lyranni_breath_of_the_veil-u",
      rule_text_key: "talent_lyranni_breath_of_the_veil_rules-u",
      name: "Breath of the Veil",
      description: "Once per session, spend 3 Strain to enter a state of deep arcane attunement. For the rest of the scene, gain a bonus die to Arcana, Spirit Lore, and Magic (Illusion or Enchantment) . If used in a formal ritual, the result is considered exceptional (GM discretion).",
      skills: "",
      prerequisite: [ "true_veilsight" ],
      prerequisiteAny: { tier: 3, count: 1 },
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    echo_of_elegance: {
      name_key: "talent_lyranni_echo_of_elegance-u",
      rule_text_key: "talent_lyranni_echo_of_elegance_rules-u",
      name: "Echo of Elegance",
      description: "Once per session, ignore one penalty die on a social roll and gain a bonus die instead. You may also automatically succeed on one opposed Charm or Performance contest against a neutral or friendly target.",
      skills: "",
      prerequisite: [ "subtle_authority" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    veil_linked_will: {
      name_key: "talent_lyranni_veil_linked_will-u",
      rule_text_key: "talent_lyranni_veil_linked_will_rules-u",
      name: "Veil-Linked Will",
      description: "Once per session, cast a spell with a bonus die, and reduce its Strain die by one step, regardless of your current Strain level.",
      skills: "",
      prerequisite: [ "lyranni_discipline" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    voice_of_the_ancestors: {
      name_key: "talent_lyranni_voice_of_the_ancestors-u",
      rule_text_key: "talent_lyranni_voice_of_the_ancestors_rules-u",
      name: "Voice of the Ancestors",
      description: "Once per session, gain a bonus die on any social skill roll or spell targeting spirits or Veil entities. You also roll with a bonus die when banishing a hostile spirit.",
      skills: "",
      prerequisiteAll: [ "ancestral_resonance", "spirit_favored" ],
      prerequisite: "",
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    }	
  },
  veyra: {
    cache_sense: {
      name_key: "talent_veyra_cache_sense-u",
      rule_text_key: "talent_veyra_cache_sense_rules-u",
      name: "Cache Sense",
      description: "You’ve developed an instinct for spotting what others discard. Gain a bonus die to Survival (Urban) or Mechanics when scavenging parts from damaged infrastructure, machinery, or field wreckage. Once per session, you may improvise a basic repair using overlooked scrap or broken components, as long as they’re accessible in the scene.",
	  skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    circuit_whispers: {
      name_key: "talent_veyra_circuit_whispers-u",
      rule_text_key: "talent_veyra_circuit_whispers_rules-u",
      name: "Circuit Whispers",
      description: "Broken systems still speak—you just know how to listen. Gain a bonus die on your first Mechanics or Electronics roll when examining a damaged non-magical device. This applies even without schematics or tools.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    echo_sense: {
      name_key: "talent_veyra_echo_sense-u",
      rule_text_key: "talent_veyra_echo_sense_rules-u",
      name: "Echo Sense",
      description: "Your ears read space like others read light. You may roll Listen in place of Perception in darkness or low visibility, and gain a bonus die to detect hidden movement or unseen threats.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    mask_the_signal: {
      name_key: "talent_veyra_mask_the_signal-u",
      rule_text_key: "talent_veyra_mask_the_signal_rules-u",
      name: "Mask the Signal",
      description: "You can dampen your personal tech signature. For one scene, you appear invisible to basic scanners, unsecured surveillance, and passive detection. Slicers using Scan must succeed on a Hard difficulty check to detect you.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "scene"
    },
    no_footprints: {
      name_key: "talent_veyra_no_footprints-u",
      rule_text_key: "talent_veyra_no_footprints_rules-u",
      name: "No Footprints",
      description: "You learned to move like silence itself. You suffer no movement penalty when using Stealth, and may move at full speed without increasing your chances of detection.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    patchwork_fixer: {
      name_key: "talent_veyra_patchwork_fixer-u",
      rule_text_key: "talent_veyra_patchwork_fixer_rules-u",
      name: "Patchwork Fixer",
      description: "You’re a master of salvage repair. Gain a +10% bonus to Mechanics and Electronics when working with scrap or improvised tools. Repairs last one scene or until significantly stressed.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
    reflex_map: {
      name_key: "talent_veyra_reflex_map-u",
      rule_text_key: "talent_veyra_reflex_map_rules-u",
      name: "Reflex Map",
      description: "You process your surroundings before others blink. Once per session, if you succeed on a Perception or Listen check to detect danger, you may take one free maneuver before initiative is rolled. This maneuver must be defensive: move to cover, duck, shift position, or warn an ally.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    signal_ghost: {
      name_key: "talent_veyra_signal_ghost-u",
      rule_text_key: "talent_veyra_signal_ghost_rules-u",
      name: "Signal Ghost",
      description: "You slip through digital doors like breath. Once per session, reroll a failed Slicing or Security Systems check. If the reroll succeeds, no trace of the intrusion remains unless the system was protected by active countermeasures.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: "session"
    },
    slip_between: {
      name_key: "talent_veyra_slip_between-u",
      rule_text_key: "talent_veyra_slip_between_rules-u",
      name: "Slip Between",
      description: "You move through collapsed ducts and half-formed crawlways like you were born to. You ignore movement penalties from tight spaces and gain a bonus die to Stealth rolls made while entering, exiting, or navigating narrow areas.",
      skills: "",
      prerequisite: "",
      tier: 1,
      cost: 10,
      capstone: false,
      usage_limit: ""
    },
     battlefield_sync: {
      name_key: "talent_veyra_battlefield_sync-u",
      rule_text_key: "talent_veyra_battlefield_sync_rules-u",
      name: "Battlefield Sync",
      description: "Once per scene, if you win Initiative or succeed on a Perception or Listen check before combat begins, you may take one maneuver before the first full combat round.",
      skills: "",
      prerequisite: [ "reflex_map" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    echo_map_recall: {
      name_key: "talent_veyra_echo_map_recall-u",
      rule_text_key: "talent_veyra_echo_map_recall_rules-u",
      name: "Echo-Map Recall",
      description: "Once per scene, while stationary in total darkness, make a free Perception check with a bonus die to detect movement or hidden creatures within Short or Medium range, even if silent.",
      skills: "",
      prerequisite: [ "echo_sense" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    nocturne_optimizer: {
      name_key: "talent_veyra_nocturne_optimizer-u",
      rule_text_key: "talent_veyra_nocturne_optimizer_rules-u",
      name: "Nocturne Optimizer",
      description: "When acting in low-light or complete darkness, you gain a bonus die to your next Mechanics, Electronics, or Stealth check once per scene.",
      skills: "",
      prerequisite: [ "echo_sense" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    overclock_instinct: {
      name_key: "talent_veyra_overclock_instinct-u",
      rule_text_key: "talent_veyra_overclock_instinct_rules-u",
      name: "Overclock Instinct",
      description: "Once per scene, you may instantly attempt a Mechanics or Electronics check on a damaged drone, vehicle, or bot without using tools or spending your action. This does not provoke reactions.",
      skills: "",
      prerequisite: [ "cache_sense" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    ping_and_pull: {
      name_key: "talent_veyra_ping_and_pull-u",
      rule_text_key: "talent_veyra_ping_and_pull_rules-u",
      name: "Ping and Pull",
      description: "Once per session, after successfully identifying a device using Circuit Whispers, you may immediately trigger a connected, unsecured mechanism—such as a basic lock, actuator, relay, or panel—without requiring an additional roll. If the mechanism is protected by active security systems, magical reinforcement, or is part of a complex network, this ability may instead grant a bonus die to the next appropriate roll (e.g., Slicing, Electronics, or Magic).",
      skills: "",
      prerequisite: [ "circuit_whispers" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    salvage_sense: {
      name_key: "talent_veyra_salvage_sense-u",
      rule_text_key: "talent_veyra_salvage_sense_rules-u",
      name: "Salvage Sense",
      description: "You’ve learned to extract just enough to keep things running. When using Cache Sense, you may now repurpose scrap and exposed components to restore 1d6 HP to a drone, bot, or vehicle, or reduce a malfunction’s severity by one tier. This repair must be made during the same scene using visibly damaged or discarded tech.",
      skills: "",
      prerequisite: [ "cache_sense" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: ""
    },
    silent_cascade: {
      name_key: "talent_veyra_silent_cascade-u",
      rule_text_key: "talent_veyra_silent_cascade_rules-u",
      name: "Silent Cascade",
      description: "When moving at full speed while using Stealth, gain a +10% bonus to Stealth. Once per session, you may make a full movement and Stealth check as a free action (does not count as your turn).",
      skills: "",
      prerequisite: [ "no_footprints" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "session"
    },
    vent_ghost: {
      name_key: "talent_veyra_vent_ghost-u",
      rule_text_key: "talent_veyra_vent_ghost_rules-u",
      name: "Vent Ghost",
      description: "Once per scene, you gain a +10% bonus to Dodge rolls and ranged attacks against you suffer a –10% penalty until the start of your next turn. This only applies while in partial or full cover.",
      skills: "",
      prerequisite: [ "circuit_whispers" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: "scene"
    },
    zero_trace_protocol: {
      name_key: "talent_veyra_zero_trace_protocol-u",
      rule_text_key: "talent_veyra_zero_trace_protocol_rules-u",
      name: "Zero-Trace Protocol",
      description: "When rerolling a failed Slicing or Security Systems check using Signal Ghost, you gain a bonus die to the second roll if the system is Standard difficulty or lower. If the system is Hard or above, reroll as normal with no additional bonus.",
      skills: "",
      prerequisite: [ "signal_ghost" ],
      tier: 2,
      cost: 20,
      capstone: false,
      usage_limit: ""
    },
    cachejack_protocol: {
      name_key: "talent_veyra_cachejack_protocol-u",
      rule_text_key: "talent_veyra_cachejack_protocol_rules-u",
      name: "Cachejack Protocol",
	  description: "Once per session, as an action you may make a field repair to a drone, bot, or vehicle without tools or prep, using available scrap or failed components others would overlook. In addition, you may now repair two separate machines in the same scene using only repurposed materials—no standard parts required.",
      skills: "",
      prerequisite: [ "salvage_sense" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    dark_grid_savant: {
      name_key: "talent_veyra_dark_grid_savant-u",
      rule_text_key: "talent_veyra_dark_grid_savant_rules-u",
      name: "Dark Grid Savant",
      description: "While in low-light or darkness, you gain a bonus die to Stealth rolls for the remainder of the scene. If unseen at the start of a round, you may take a free maneuver.",
      skills: "",
      prerequisite: [ "nocturne_optimizer" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    echo_splice_reflex: {
      name_key: "talent_veyra_echo_splice_reflex-u",
      rule_text_key: "talent_veyra_echo_splice_reflex_rules-u",
      name: "Echo-Splice Reflex",
      description: "Once per session, when caught in an ambush or surprise attack, you may immediately take a free movement and make a Listen check with a bonus die to identify all hostiles in Engaged or Short range.",
      skills: "",
      prerequisite: [ "battlefield_sync" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    echowire_scramble: {
      name_key: "talent_veyra_echowire_scramble-u",
      rule_text_key: "talent_veyra_echowire_scramble_rules-u",
      name: "Echowire Scramble",
      description: "Once per session, after succeeding on a Electronics check, you may distort local signals, scrambling the targeting of bots and drones. For 1 round, those enemies within Medium range or less suffer –20% to attacks.",
      skills: "",
      prerequisite: [ "echo_map_recall" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    recursive_salvager: {
      name_key: "talent_veyra_recursive_salvager-u",
      rule_text_key: "talent_veyra_recursive_salvager_rules-u",
      name: "Recursive Salvager",
      description: "When using Overclock Instinct, you may now reroll the result once per scene, and ignore the first malfunction triggered by that repair or activation.",
      skills: "",
      prerequisite: [ "overclock_instinct" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    signal_evasion_loop: {
      name_key: "talent_veyra_signal_evasion_loop-u",
      rule_text_key: "talent_veyra_signal_evasion_loop_rules-u",
      name: "Signal Evasion Loop",
      description: "Once per session, after successfully using Signal Ghost to reroll a Slicing or Security Systems check, you may also suppress the next trace lock or countermeasure activation triggered against you.",
      skills: "",
      prerequisite: [ "zero_trace_protocol" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "session"
    },
    stealth_harmonic: {
      name_key: "talent_veyra_stealth_harmonic-u",
      rule_text_key: "talent_veyra_stealth_harmonic_rules-u",
      name: "Stealth Harmonic",
      description: "Once per scene, if you successfully use Silent Cascade, you may also grant an ally within Short range +10% to Stealth and allow them to move at full speed with you without penalty.",
      skills: "",
      prerequisite: [ "silent_cascade" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },
    thread_the_vents: {
      name_key: "talent_veyra_thread_the_vents-u",
      rule_text_key: "talent_veyra_thread_the_vents_rules-u",
      name: "Thread the Vents",
      description: "You no longer suffer penalties when squeezing through collapsed ducts, tight corridors, or debris-strewn zones. Once per scene, you may as a reaction reposition to any location within Short range that shares partial cover.",
      skills: "",
      prerequisite: [ "vent_ghost" ],
      tier: 3,
      cost: 30,
      capstone: false,
      usage_limit: "scene"
    },	
    circuit_sovereign: {
      name_key:  "talent_veyra_circuit_sovereign-u",
      rule_text_key: "talent_veyra_circuit_sovereign_rules-u",
      name: "Circuit Sovereign",
      description: "You are one with damaged infrastructure. Once per session, you may declare any malfunctioning or broken device within Medium range as under your control for one round—doors open, turrets fire, signals reroute. No roll is required.",
      skills: "",
      prerequisite: [ "cachejack_protocol" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    ghost_in_the_gears: {
      name_key:  "talent_veyra_ghost_in_the_gears-u",
      rule_text_key: "talent_veyra_ghost_in_the_gears_rules-u",
      name: "Ghost in the Gears",
      description: "You may now treat any destroyed or disabled bot, drone, or vehicle as salvageable, no matter its state. Once per session, as an action, you may restore one such machine to basic operational status (1 HP) using only makeshift parts.",
      skills: "",
      prerequisite: [ "recursive_salvager" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    neurospike_blur: {
      name_key:  "talent_veyra_neurospike_blur-u",
      rule_text_key: "talent_veyra_neurospike_blur_rules-u",
      name: "Neurospike Blur",
      description: "Once per session, you may trigger a neural surge that phases your outline and silences your tech signature for one full round. During this time, you cannot be targeted by ranged attacks unless detected by Hard difficulty Perception check or magic means.",
      skills: "",
      prerequisite: [ "dark_grid_savant" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    },
    silent_dominion: {
      name_key:  "talent_veyra_silent_dominion-u",
      rule_text_key: "talent_veyra_silent_dominion_rules-u",
      name: "Silent Dominion",
      description: "You become a whisper in motion. For one scene per session, you move at full speed without penalty to Stealth. While this is active, any passive detection (visual, electronic, or magical) must succeed at one level greater than your success to perceive you.",
      skills: "",
      prerequisite: [ "stealth_harmonic" ],
      tier: 4,
      cost: 40,
      capstone: true,
      usage_limit: "session"
    }  }
};

const careerDataMap = {
	/* Arcane Career */
	codeweaver: {
        name: "Codeweaver",
        career_type: "arcane",
        career_type_name: "Arcane",
        skill_points_primary_formula: {
            attributes: ["EDU", "INT"],
            multipliers: [2, 2]
        },
        skill_points_primary_display: "EDU × 2 + INT × 2",
        skill_points_secondary: 20,
        spell_xp_primary: 30,
        spell_xp_secondary: 10,
        primary_skills: {
            magic_technomancy: "Magic (Technomancy)",
            slicing: "Slicing",
            electronics: "Electronics",
            computer_use: "Computer Use"
        },
        secondary_skills: {
            security: "Security Systems",
            drone_operation: "Drone Operation",
            insight: "Insight",
            perception: "Perception",
            arcana: "Arcana",
            spirit_lore: "Spirit Lore"
        },
        talents: {
            hardlight_override: {
				name_key: "career_codeweaver_hardlight_override-u",
				rule_text_key: "career_codeweaver_hardlight_override_rules-u",			
                name: "Hardlight Override",
                description: "Once per scene, spend 2 Strain to project a hardlight sigil into a nearby device (e.g., door, turret, drone). You may trigger a basic function (open, shut down, disengage) without a skill check.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            recursive_pulse: {
				name_key: "career_codeweaver_recursive_pulse-u",
				rule_text_key: "career_codeweaver_recursive_pulse_rules-u",			
                name: "Recursive Pulse",
                description: "Once per scene, after a failed attempt to access or affect a device, you may reroll with a penalty die. If successful, regain 1 Strain.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },			
            signal_sync: {
				name_key: "career_codeweaver_signal_sync-u",
				rule_text_key: "career_codeweaver_signal_sync_rules-u",			
                name: "Signal Sync",
                description: "Once per scene, gain a bonus die on a Magic (Technomancy) or Slicing check when interfacing with a digital system, drone, or magitech device. If successful, reduce the spell’s Strain cost by one die step.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
             strain_buffer: {
				name_key: "career_codeweaver_strain_buffer-u",
				rule_text_key: "career_codeweaver_strain_buffer_rules-u",			 
                name: "Strain Buffer",
                description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: ""
            },
			veil_thread_tap: {
				name_key: "career_codeweaver_veil_thread_tap-u",
				rule_text_key: "career_codeweaver_veil_thread_tap_rules-u",			
                name: "Veil Thread Tap",
                description: "Once per scene, detect nearby digital activity or magitech signatures within short range — even if encrypted or cloaked. Gain a bonus die to your next Perception or Slicing check related to that system.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            arc_sigil_link: {
				name_key: "career_codeweaver_arc_sigil_link-u",
				rule_text_key: "career_codeweaver_arc_sigil_link_rules-u",			
                name: "Arc-Sigil Link",
                description: "You may roll Magic (Technomancy) in place of Electronics or Computer Use when interacting with magitech systems. This does not apply to physical repairs or mechanical breakdowns.",
                prerequisite: "veil_thread_tap",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: ""
            },
            clean_loop_feedback: {
				name_key: "career_codeweaver_clean_loop_feedback-u",
				rule_text_key: "career_codeweaver_clean_loop_feedback_rules-u",			
                name: "Clean Loop Feedback",
                description: "Once per session, after successfully casting a Technomancy spell on a device, regain 1d4 Strain.",
                prerequisite: "",
                prerequisiteAny: { tier: 1, count: 1 },
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "session"
            },
            code_injection: {
				name_key: "career_codeweaver_code_injection-u",
				rule_text_key: "career_codeweaver_code_injection_rules-u",			
                name: "Code Injection",
                description: "Once per scene, after a successful Technomancy spell or Slicing check, implant a command packet that allows you to issue one additional command later in the same scene without a new check.",
                prerequisite: "signal_sync",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },			
            pulse_hijack: {
				name_key: "career_codeweaver_pulse_hijack-u",
				rule_text_key: "career_codeweaver_pulse_hijack_rules-u",			
                name: "Pulse Hijack",
                description: "Spend 2 Strain to take control of a simple device or automated system (e.g., surveillance cam, basic drone, access node) for one round.",
                prerequisite: "hardlight_override",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: ""
            },
            scramble_protocol: {
				name_key: "career_codeweaver_scramble_protocol-u",
				rule_text_key: "career_codeweaver_scramble_protocol_rules-u",			
                name: "Scramble Protocol",
                description: "Spend 2 Strain to disrupt a single active drone or magitech system for one round. It suffers a penalty die on all tech-based or automated actions.",
                prerequisite: "recursive_pulse",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: ""
            },
            arc_thread_override: {
				name_key: "career_codeweaver_arc_thread_override-u",
				rule_text_key: "career_codeweaver_arc_thread_override_rules-u",			
                name: "Arc-Thread Override",
                description: "Once per scene, when a hostile device activates, you may cast a Technomancy spell as a reaction. The spell must affect technology (jam, crash, reroute, etc.).",
                prerequisite: "code_injection",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },			
            magelock_cascade: {
				name_key: "career_codeweaver_magelock_cascade-u",
				rule_text_key: "career_codeweaver_magelock_cascade_rules-u",
                name: "Magelock Cascade",
                description: "Once per session, when you successfully disable or control a device, you may immediately target a second device within short range. The second target rolls resistance with a penalty die.",
                prerequisite: "pulse_hijack",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "session"
            },			
            null_loop_echo: {
				name_key: "career_codeweaver_null_loop_echo-u",
				rule_text_key: "career_codeweaver_null_loop_echo_rules-u",			
                name: "Null Loop Echo",
                description: "Spend 2 Strain to create a disruption field around you (short range) for one round. All drones, magitech, and automated systems inside suffer a penalty die on targeting, reactions, or interfacing.",
                prerequisite: "scramble_protocol",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: ""
            },
            subroutine_leash: {
				name_key: "career_codeweaver_subroutine_leash-u",
				rule_text_key: "career_codeweaver_subroutine_leash_rules-u",			
                name: "Subroutine Leash",
                description: "You may take control of a single drone you have accessed. It acts as an allied NPC on your turn for the duration of the spell or control effect.",
                prerequisite: "arc_sigil_link",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: ""
            },
            synthetic_harmony: {
				name_key: "career_codeweaver_synthetic_harmony-u",
				rule_text_key: "career_codeweaver_synthetic_harmony_rules-u",			
                name: "Synthetic Harmony",
                description: "Once per scene, after casting a Technomancy spell or succeeding a Slicing check, gain a bonus die on your next spellcasting or social skill check.",
                prerequisite: "",
                prerequisiteAny: { tier: 2, count: 1 },
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },
            backdoor_ritual: {
				name_key: "career_codeweaver_backdoor_ritual-u",
				rule_text_key: "career_codeweaver_backdoor_ritual_rules-u",			
                name: "Backdoor Ritual",
                description: "Once per scene, you may embed a persistent arcane anchor in a system you access. If the system is triggered again this scene, you may act on it immediately without a new roll. Only one Backdoor may be active at a time.",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },			
            command_injection: {
				name_key: "career_codeweaver_command_injection-u",
				rule_text_key: "career_codeweaver_command_injection_rules-u",			
                name: "Command Injection",
                description: "Once per scene, after casting a Technomancy spell or issuing a drone command, you may issue two distinct commands instead of one.",
                prerequisite: "subroutine_leash",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },
            crash_field: {
				name_key: "career_codeweaver_crash_field-u",
				rule_text_key: "career_codeweaver_crash_field_rules-u",			
                name: "Crash Field",
                description: "Once per session, create a crash zone (medium range) for one round. All affected drones or magitech systems must succeed a POW or INT roll or become readonly until the start of your next turn.",
                prerequisite: "null_loop_echo",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "session"
            },
            live_patch_redirect: {
				name_key: "career_codeweaver_live_patch_redirect-u",
				rule_text_key: "career_codeweaver_live_patch_redirect_rules-u",			
                name: "Live Patch Redirect",
                description: "Once per session, when an ally is targeted by a spell, ability, or tech effect, you may spend 2 Strain to redirect the effect to yourself or a controlled construct.",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "session"
            },
            veil_reactor_stabilizer: {
				name_key: "career_codeweaver_veil_reactor_stabilizer-u",
				rule_text_key: "career_codeweaver_veil_reactor_stabilizer_rules-u",			
                name: "Veil-Reactor Stabilizer",
                description: "Once per session, spend 2 Strain to negate a Veil corruption effect, a magitech malfunction, or to reduce incoming damage by 1d6 from a tech-based or Veil-powered source.",
                prerequisite: "",
				prerequisiteAny: { tier: 3, count: 1 },
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "session"
            },
            overcode_detonation: {
				name_key: "career_codeweaver_overcode_detonation-u",
				rule_text_key: "career_codeweaver_overcode_detonation_rules-u",			
                name: "Overcode Detonation",
                description: "Once per session, trigger a system cascade affecting any magitech network or drone field within medium range. All affected systems must roll POW or INT or suffer shutdown, 1d6 damage, or go berserk (your choice per target). Cybernetic limbs and smart weapons tied to living users are unaffected.",
                prerequisite: ["magelock_cascade", "crash_field"],
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            reality_patch: {
				name_key: "career_codeweaver_reality_patch-u",
				rule_text_key: "career_codeweaver_reality_patch_rules-u",			
                name: "Reality Patch",
                description: "Once per session, cast a Technomancy spell with a casting time of 1 action or less as a reaction to a failed defense, corrupted system, or Veil event. The spell automatically succeeds but costs double Strain.",
                prerequisite: ["live_patch_redirect", "veil_reactor_stabilizer"],
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            signal_possession: {
				name_key: "career_codeweaver_signal_possession-u",
				rule_text_key: "career_codeweaver_signal_possession_rules-u",			
                name: "Signal Possession",
                description: "Once per session, take full control of a drone, turret, or magitech construct within medium range for the rest of the scene. If the target is destroyed or disconnected, you may transfer control to another valid device once.",
                prerequisite: ["subroutine_leash", "command_injection"],
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            stat_boost: {
				name_key: "career_codeweaver_stat_boost-u",
				rule_text_key: "career_codeweaver_stat_boost_rules-u",			
                name: "+5% Stat Boost",
                description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
                prerequisite: "",
                prerequisiteAny: { tier: 4, count: 1 },
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: ""				
            }
        }
    },
	dreamshaper: {
	},
	gravesinger: {
	},
	mindbender: {
		name: "Mindbender",
		career_type: "arcane",
		career_type_name: "Arcane",
		skill_points_primary_formula: {
			attributes: ["EDU", "POW"],
			multipliers: [2, 2]
		},
		skill_points_primary_display: "EDU × 2 + POW × 2",
		skill_points_secondary: 20,
		spell_xp_primary: 30,
		spell_xp_secondary: 10,
		primary_skills: {
			magic_enchantment: "Magic (Enchantment)",
			insight: "Insight",
			arcana: "Arcana",
			persuade: "Persuade"
		},
		secondary_skills: {
			deception: "Deception",
			charm: "Charm",
			intimidate: "Intimidate",
			etiquette_high_society: "Etiquette (High Society)",
			perform_impersonation: "Performance (Impersonation)",
			interrogation: "Interrogation"
		},
		talents: {
			mental_static: {
				name_key: "career_mindbender_mental_static-u",
				rule_text_key: "career_mindbender_mental_static_rules-u",			
				name: "Mental Static",
				description: "Once per scene, spend 2 Strain to scramble a target’s concentration. For the rest of the round, they suffer a penalty die to any attempt to cast or maintain a spell. May be used as an action or reaction.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},	
			strain_buffer: {
				name_key: "career_mindbender_strain_buffer-u",
				rule_text_key: "career_mindbender_strain_buffer_rules-u",			
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},			
			suggestive_echo: {
				name_key: "career_mindbender_suggestive_echo-u",
				rule_text_key: "career_mindbender_suggestive_echo_rules-u",			
				name: "Suggestive Echo",
				description: "Once per scene, when casting an Enchantment spell that influences thoughts or emotions, gain a bonus die on the casting roll. If the target resists or is unaffected, they suffer a penalty die on their next Insight or social-based roll.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			thread_of_doubt: {
				name_key: "career_mindbender_thread_of_doubt-u",
				rule_text_key: "career_mindbender_thread_of_doubt_rules-u",			
				name: "Thread of Doubt",
				description: "Once per scene, when interacting with an NPC, you may subtly seed hesitation. Apply a penalty die to their next opposed roll against you (social, combat, or magical).",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			veil_of_intent: {
				name_key: "career_mindbender_veil_of_intent-u",
				rule_text_key: "career_mindbender_veil_of_intent_rules-u",			
				name: "Veil of Intent",
				description: "Once per scene, you may substitute your Insight skill for Charm or Persuade when influencing a target. You’re not convincing them — you’re reading them and pressing the right internal button.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			cognitive_rewire: {
				name_key: "career_mindbender_cognitive_rewire-u",
				rule_text_key: "career_mindbender_cognitive_rewire_rules-u",			
				name: "Cognitive Rewire",
				description: "Once per scene, reroll a failed Enchantment spell that targets a single humanoid. If the reroll succeeds, reduce the spell’s Strain cost by one die step.",
				prerequisite: "suggestive_echo",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			emotional_override: {
				name_key: "career_mindbender_emotional_override-u",
				rule_text_key: "career_mindbender_emotional_override_rules-u",			
				name: "Emotional Override",
				description: "Spend 2 Strain to impose a temporary emotional state (fear, calm, guilt, anger, etc.) on a target within short range. Lasts for one round. If the state is disrupted, the target suffers a penalty die on their next action.",
				prerequisite: "veil_of_intent",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},		
			memory_spike: {
				name_key: "career_mindbender_memory_spike-u",
				rule_text_key: "career_mindbender_memory_spike_rules-u",			
				name: "Memory Spike",
				description: "Once per session, force a target to recall a vivid traumatic or confusing memory. They must succeed a POW roll or lose their next Maneuver.",
				prerequisite: "",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},			
			neural_misdirection: {
				name_key: "career_mindbender_neural_misdirection-u",
				rule_text_key: "career_mindbender_neural_misdirection_rules-u",			
				name: "Neural Misdirection",
				description: "When casting an Enchantment spell in combat, you may spend 1 additional Strain to render the spell unnoticeable to all observers except the target.",
				prerequisite: "mental_static",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			prey_on_instinct: {
				name_key: "career_mindbender_prey_on_instinct-u",
				rule_text_key: "career_mindbender_prey_on_instinct_rules-u",			
				name: "Prey on Instinct",
				description: "Once per scene, when engaging a target in a social contest or interrogation, you may force them to defend using unmodified POW instead of their usual social skill.",
				prerequisite: "thread_of_doubt",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			echo_implantation: {
				name_key: "career_mindbender_echo_implantation-u",
				rule_text_key: "career_mindbender_echo_implantation_rules-u",			
				name: "Echo Implantation",
				description: "Once per session, after casting a successful Enchantment spell, you may embed a mental echo. Spend 1 Strain later in the same scene to re-trigger the emotional effect for one round.",
				prerequisite: "cognitive_rewire",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			false_memory: {
				name_key: "career_mindbender_false_memory-u",
				rule_text_key: "career_mindbender_false_memory_rules-u",			
				name: "False Memory",
				description: "Once per session, implant a short false memory in a target during conversation. The target must fail an Insight or POW roll to notice. Cannot override major truths.",
				prerequisite: "memory_spike",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			hollow_gaze: {
				name_key: "career_mindbender_hollow_gaze-u",
				rule_text_key: "career_mindbender_hollow_gaze_rules-u",			
				name: "Hollow Gaze",
				description: "Once per session, lock eyes with a single target. For one round, they suffer a penalty die on any action that opposes or harms you, unless they succeed a POW roll.",
				prerequisite: "",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			neural_whiplash: {
				name_key: "career_mindbender_neural_whiplash-u",
				rule_text_key: "career_mindbender_neural_whiplash_rules-u",			
				name: "Neural Whiplash",
				description: "Once per session, when a target resists or breaks free of your spell, they suffer 1d4 Strain and lose their next Reaction or Maneuver.",
				prerequisite: "neural_misdirection",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},			
			veil_laced_words: {
				name_key: "career_mindbender_veil_laced_words-u",
				rule_text_key: "career_mindbender_veil_laced_words_rules-u",			
				name: "Veil-Laced Words",
				description: "For the duration of a social encounter, spend 1 Strain once per turn to gain a bonus die on a Charm, Deception, or Persuade roll while maintaining emotional pressure.",
				prerequisite: "prey_on_instinct",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			cognitive_fortress: {
				name_key: "career_mindbender_cognitive_fortress-u",
				rule_text_key: "career_mindbender_cognitive_fortress_rules-u",			
				name: "Cognitive Fortress",
				description: "Once per scene, when targeted by a spell or social effect that affects your mind or emotions, roll POW. On a success, the effect is negated. You may spend 1 Strain to gain a bonus die on your next social or spellcasting roll.",
				prerequisite: "hollow_gaze",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			compromise_anchor: {
				name_key: "career_mindbender_compromise_anchor-u",
				rule_text_key: "career_mindbender_compromise_anchor_rules-u",			
				name: "Compromise Anchor",
				description: "Once per session, if you fail a social or spellcasting roll, you may immediately follow up with a different social skill. The second attempt gains a bonus die.",
				prerequisite: "false_memory",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			emotion_override_field: {
				name_key: "career_mindbender_emotion_override_field-u",
				rule_text_key: "career_mindbender_emotion_override_field_rules-u",			
				name: "Emotion Override Field",
				description: "Once per session, create a short-range field. All hostile creatures within it must succeed a POW roll or suffer a penalty die on aggressive actions for one round.",
				prerequisite: "neural_whiplash",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},			
			resonant_persona: {
				name_key: "career_mindbender_resonant_persona-u",
				rule_text_key: "career_mindbender_resonant_persona_rules-u",			
				name: "Resonant Persona",
				description: "Once per session, choose a target who previously failed a roll against you. For the rest of the scene, gain a bonus die on all attempts to influence or mislead them.",
				prerequisite: ["veil_laced_words", "echo_implantation"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			synaptic_lag: {
				name_key: "career_mindbender_synaptic_lag-u",
				rule_text_key: "career_mindbender_synaptic_lag_rules-u",			
				name: "Synaptic Lag",
				description: "Once per scene, spend 2 Strain to disrupt a target’s rhythm. Until the start of your next turn, they lose their next action (they may still take a Maneuver and Reaction). May be used as an action or reaction.",
				prerequisite: "neural_whiplash",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			emotional_collapse: {
				name_key: "career_mindbender_emotional_collapse-u",
				rule_text_key: "career_mindbender_emotional_collapse_rules-u",			
				name: "Emotional Collapse",
				description: "Once per session, when a target fails a POW or social resistance roll against you, they suffer a penalty die on all aggressive or willpower-based actions for the rest of the scene, and must succeed a POW roll to initiate hostile actions.",
				prerequisite: ["emotion_override_field", "synaptic_lag"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			puppetmaster_protocol: {
				name_key: "career_mindbender_puppetmaster_protocol-u",
				rule_text_key: "career_mindbender_puppetmaster_protocol_rules-u",			
				name: "Puppetmaster Protocol",
				description: "Once per session, control a single humanoid target for one round. If they fail a POW resistance roll, you dictate their actions as if they were an ally — including movement, spells, or attacks.",
				prerequisiteAll: ["echo_implantation", "resonant_persona"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			scene_fracture: {
				name_key: "career_mindbender_scene_fracture-u",
				rule_text_key: "career_mindbender_scene_fracture_rules-u",			
				name: "Scene Fracture",
				description: "Once per session, trigger a psychic rupture. All creatures within medium range must roll POW. Those who fail suffer hallucinations or confusion, take a penalty die on all actions for one round, and suffer a penalty die on resistance rolls against your Enchantment spells for the rest of the scene.",
				prerequisiteAll: ["false_memory", "cognitive_fortress"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_mindbender_stat_boost-u",
				rule_text_key: "career_mindbender_stat_boost_rules-u",				
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisite: "",				
				prerequisiteAny: { tier: 4,	count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			}
		}
	},
	sigilbound: {
		name: "Sigilbound",
		career_type: "arcane",
		career_type_name: "Arcane",
		skill_points_primary_formula: {
			attributes: ["EDU", "POW"],
			multipliers: [2, 2]
		},
		skill_points_primary_display: "EDU × 2 + POW × 2",
		skill_points_secondary: 20,
		spell_xp_primary: 30,
		spell_xp_secondary: 10,
		primary_skills: {
			magic_warding: "Magic (Warding)",
			arcana: "Arcana",
			perception: "Perception",
			insight: "Insight"
		},
		secondary_skills: {
			first_aid: "First Aid",
			security: "Security Systems",
			etiquette_magi: "Etiquette (Magi House)",
			etiquette_corporate: "Etiquette (Corporate)",
			occult: "Occult Lore",
			dodge: "Dodge",
			survival_urban: "Survival (Urban)"
		},
		exclusive_skill_sets: [
			[ "etiquette_corporate", "etiquette_magi" ]
		],
		talents: {
			arcane_lock: {
				name_key: "career_sigilbound_arcane_lock-u",
				rule_text_key: "career_sigilbound_arcane_lock_rules-u",			
				name: "Arcane Lock",
				description: "Once per scene, designate a point (e.g., doorway, corridor) within short range as warded. Enemies suffer a penalty die on ranged attacks made through the ward until the start of your next turn.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			glyphstep: {
				name_key: "career_sigilbound_glyphstep-u",
				rule_text_key: "career_sigilbound_glyphstep_rules-u",			
				name: "Glyphstep",
				description: "Spend 2 Strain to move 1 range band as a reaction when an enemy targets you with a spell or attack.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},			
			runesight: {
				name_key: "career_sigilbound_runesight-u",
				rule_text_key: "career_sigilbound_runesight_rules-u",			
				name: "Runesight",
				description: "Once per scene, gain a bonus die on a Magic (Warding) check. If used defensively (e.g., block, suppress, counter), reduce the spell’s Strain cost by one die step .",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			sigil_hardened: {
				name_key: "career_sigilbound_sigil_hardened-u",
				rule_text_key: "career_sigilbound_sigil_hardened_rules-u",			
				name: "Sigil Hardened",
				description: "Gain a bonus die on CON rolls to resist knockdown, suppression, or forced movement .",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			strain_buffer: {
				name_key: "career_sigilbound_strain_buffer-u",
				rule_text_key: "career_sigilbound_strain_buffer_rules-u",			
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			barrier_projection: {
				name_key: "career_sigilbound_barrier_projection-u",
				rule_text_key: "career_sigilbound_barrier_projection_rules-u",
				name: "Barrier Projection",
				description: "Spend 3 Strain to conjure a short-range barrier. Any ally using it for cover causes enemies to suffer a penalty die on ranged attacks. Lasts for one scene or until destroyed (GM discretion).",
				prerequisite: "arcane_lock",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},			
			reflective_ward: {
				name_key: "career_sigilbound_reflective_ward-u",
				rule_text_key: "career_sigilbound_reflective_ward_rules-u",			
				name: "Reflective Ward",
				description: "Once per scene, when targeted by a spell, the caster suffers a penalty die . If the spell fails, it reflects back on them.",
				prerequisite: "runesight",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			sigil_of_anchoring: {
				name_key: "career_sigilbound_sigil_of_anchoring-u",
				rule_text_key: "career_sigilbound_sigil_of_anchoring_rules-u",			
				name: "Sigil of Anchoring",
				description: "Once per scene, place a glyph on yourself or an ally. The target cannot be forcibly moved or teleported for one round.",
				prerequisite: "glyphstep",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},			
			stabilization_glyph: {
				name_key: "career_sigilbound_stabilization_glyph-u",
				rule_text_key: "career_sigilbound_stabilization_glyph_rules-u",			
				name: "Stabilization Glyph",
				description: "Spend 2 Strain to ward an ally within short range. The next time they would fall below 1 HP this scene, they remain at 1 HP instead.",
				prerequisite: "arcane_lock",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			warded_advance: {
				name_key: "career_sigilbound_warded_advance-u",
				rule_text_key: "career_sigilbound_warded_advance_rules-u",			
				name: "Warded Advance",
				description: "Once per scene, when you and an ally move toward danger, conjure a temporary glyph shield. The next time either of you is hit this round, reduce the damage taken by 2 (after armor).",
				prerequisite: ["barrier_projection", "glyphstep"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			arcane_reversal: {
				name_key: "career_sigilbound_arcane_reversal-u",
				rule_text_key: "career_sigilbound_arcane_reversal_rules-u",			
				name: "Arcane Reversal",
				description: "Once per session, when you succeed on a Warding spell to block, suppress, or shield, you may restore 1d4 Strain to yourself or a nearby ally.",
				prerequisite: "sigil_of_anchoring",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},			
			counterglyph: {
				name_key: "career_sigilbound_counterglyph-u",
				rule_text_key: "career_sigilbound_counterglyph_rules-u",			
				name: "Counterglyph",
				description: "Once per session, as a reaction, force a nearby enemy caster to suffer a penalty die on their spell. If they fail, they suffer 1d4 Strain.",
				prerequisite: "reflective_ward",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			null_field: {
				name_key: "career_sigilbound_null_field-u",
				rule_text_key: "career_sigilbound_null_field_rules-u",			
				name: "Null Field",
				description: "Once per scene, create a suppression zone in short range. All spells cast inside or through it suffer a penalty die for 1 round.",
				prerequisite: ["reflective_ward", "barrier_projection"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},
			sanctum_sigil: {
				name_key: "career_sigilbound_sanctum_sigil-u",
				rule_text_key: "career_sigilbound_sanctum_sigil_rules-u",			
				name: "Sanctum Sigil",
				description: "Spend 3 Strain to create a warded zone around you. Allies inside gain a bonus die to CON or POW rolls vs. magical or Veil effects. Lasts one scene.",
				prerequisite: "",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			sigil_pulse: {
				name_key: "career_sigilbound_sigil_pulse-u",
				rule_text_key: "career_sigilbound_sigil_pulse_rules-u",			
				name: "Sigil Pulse",
				description: "Once per scene, when a ward (e.g., Arcane Lock, Barrier, Null Field) ends or is dispelled, nearby enemies take 1d4 force damage and suffer a penalty die on their next action.",
				prerequisite: ["counterglyph", "arcane_reversal", "sanctum_sigil", "null_field"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},
			glyph_warder: {
				name_key: "career_sigilbound_glyph_warder-u",
				rule_text_key: "career_sigilbound_glyph_warder_rules-u",			
				name: "Glyph Warder",
				description: "You may maintain two active wards (e.g., Arcane Lock, Null Field) at once. Strain and duration remain unchanged.",
				prerequisite: ["null_field", "warding_matrix"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			mirror_sigil: {
				name_key: "career_sigilbound_mirror_sigil-u",
				rule_text_key: "career_sigilbound_mirror_sigil_rules-u",			
				name: "Mirror Sigil",
				description: "Once per session, when targeted by a harmful spell or ranged attack, the attacker suffers a penalty die. If it misses, you may redirect it to another enemy in short range.",
				prerequisite: ["counterglyph", "arcane_reversal"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			sigil_reservoir: {
				name_key: "career_sigilbound_sigil_reservoir-u",
				rule_text_key: "career_sigilbound_sigil_reservoir_rules-u",			
				name: "Sigil Reservoir",
				description: "Once per scene, you may place an additional Arcane Lock or Null Field without paying extra Strain. Must be placed in a new location.",
				prerequisite: "glyph_warder",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			veil_seal: {
				name_key: "career_sigilbound_veil_seal-u",
				rule_text_key: "career_sigilbound_veil_seal_rules-u",			
				name: "Veil Seal",
				description: "Spend 3 Strain to suppress a Veil anomaly or magical corruption effect within short range. You may also reduce an ally’s Veil Corruption by 1 level. Usable once per session.",
				prerequisite: ["sanctum_sigil", "arcane_reversal"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},				
			warding_matrix: {
				name_key: "career_sigilbound_warding_matrix-u",
				rule_text_key: "career_sigilbound_warding_matrix_rules-u",			
				name: "Warding Matrix",
				description: "Spend 3 Strain to shield up to two allies within short range. They gain +2 armor vs. magical or elemental damage for the rest of the scene.",
				prerequisite: "sanctum_sigil",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			runesovereign: {
				name_key: "career_sigilbound_runesovereign-u",
				rule_text_key: "career_sigilbound_runesovereign_rules-u",			
				name: "Runesovereign",
				description: "Once per session, you may cast two Warding spells in the same round, as long as both have a casting time of 1 action or 1 maneuver .",
				prerequisite: ["glyph_warder", "mirror_sigil"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			sigilburst_protocol: {
				name_key: "career_sigilbound_sigilburst_protocol-u",
				rule_text_key: "career_sigilbound_sigilburst_protocol_rules-u",			
				name: "Sigilburst Protocol",
				description: "Once per session, you may detonate one active ward you control. Enemies in its area take 2d6 force damage and suffer a penalty die on their next action. The ward ends immediately.",
				prerequisiteAll: ["glyph_warder", "sigil_pulse"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},			
			wardmasters_command: {
				name_key: "career_sigilbound_wardmasters_command-u",
				rule_text_key: "career_sigilbound_wardmasters_command_rules-u",			
				name: "Wardmaster’s Command",
				description: "Once per session, designate up to three allies within medium range. They each gain +2 armor and ignore magical terrain effects for the rest of the scene .",
				prerequisiteAll: ["warding_matrix", "sanctum_sigil"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_sigilbound_stat_boost-u",
				rule_text_key: "career_sigilbound_stat_boost_rules-u",			
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			}
		}
	},
	soulmender: {
	},
	spirit_warden: {
	},
	stormweaver: {
		name: "Stormweaver",
		career_type: "arcane",
		career_type_name: "Arcane",
		skill_points_primary_formula: {
			attributes: ["EDU", "POW"],
			multipliers: [2, 2]
		},
		skill_points_primary_display: "EDU × 2 + POW × 2",
		skill_points_secondary: 20,
		spell_xp_primary: 30,
		spell_xp_secondary: 10,
		primary_skills: {
			magic_elemental: "Magic (Elemental)",
			perception: "Perception",
			arcana: "Arcana",
			dodge: "Dodge"
		},
		secondary_skills: {
			intimidate: "Intimidate",
			athletics: "Athletics",
			insight: "Insight",
			stealth: "Stealth",
			coordination: "Coordination",
			survival_wilderness: "Survival (Wilderness)"
		},
		talents: {
			elemental_channeling: {
				name_key: "career_stormweaver_elemental_channeling-u",
				rule_text_key: "career_stormweaver_elemental_channeling_rules-u",			
				name: "Elemental Channeling",
				description: "Once per scene, gain a bonus die on a Magic (Elemental) roll. If successful, reduce the spell’s Strain cost by one die step.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			flashstep: {
				name_key: "career_stormweaver_flashstep-u",
				rule_text_key: "career_stormweaver_flashstep_rules-u",			
				name: "Flashstep",
				description: "Spend 2 Strain to move one range band (Engaged to Short or Short to Medium) as a free action. Ignores terrain penalties. Cannot exceed medium range.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			strain_buffer: {
				name_key: "career_stormweaver_strain_buffer-u",
				rule_text_key: "career_stormweaver_strain_buffer_rules-u",			
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},			
			tinder_spark: {
				name_key: "career_stormweaver_tinder_spark-u",
				rule_text_key: "career_stormweaver_tinder_spark_rules-u",			
				name: "Tinder Spark",
				description: "Once per session, as an action, ignite a flammable object or surface within short range. You may also deal 1d4 fire damage to an adjacent target.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "session"
			},
			veil_shocked: {
				name_key: "career_stormweaver_veil_shocked-u",
				rule_text_key: "career_stormweaver_veil_shocked_rules-u",			
				name: "Veil-Shocked",
				description: "Once per scene, when you take damage, deal 1d4 lightning damage to a target in engaged range as a reaction.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			pulse_detonation: {
				name_key: "career_stormweaver_pulse_detonation-u",
				rule_text_key: "career_stormweaver_pulse_detonation_rules-u",			
				name: "Pulse Detonation",
				description: "Once per scene, when struck in melee, cast a 1-action Elemental spell as a reaction. You may spend 2 Strain to deal half damage even if the spell fails.",
				prerequisite: "veil_shocked",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			scorchmark: {
				name_key: "career_stormweaver_scorchmark-u",
				rule_text_key: "career_stormweaver_scorchmark_rules-u",			
				name: "Scorchmark",
				description: "Spend 3 Strain to brand a living enemy with arcane fire. Gain a bonus die on Elemental spells targeting them for the rest of the scene.",
				prerequisite: "tinder_spark",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},			
			stormpulse_drive: {
				name_key: "career_stormweaver_stormpulse_drive-u",
				rule_text_key: "career_stormweaver_stormpulse_drive_rules-u",			
				name: "Stormpulse Drive",
				description: "Once per scene, after casting an Elemental spell, you may immediately move 1 range band (this movement will provoke Opportunity Attacks) or gain a bonus die on your next Dodge or Melee attack roll.",
				prerequisite: "elemental_channeling",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			tempest_anchor: {
				name_key: "career_stormweaver_tempest_anchor-u",
				rule_text_key: "career_stormweaver_tempest_anchor_rules-u",			
				name: "Tempest Anchor",
				description: "Spend 2 Strain to root yourself for one scene. While active, you ignore forced movement and gain a bonus die to CON rolls that resist knockdown or shoves.",
				prerequisite: "",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},			
			voltaic_reflex: {
				name_key: "career_stormweaver_voltaic_reflex-u",
				rule_text_key: "career_stormweaver_voltaic_reflex_rules-u",			
				name: "Voltaic Reflex",
				description: "Once per session, gain a bonus die to Dodge when targeted by a ranged attack. You may also spend 2 Strain to move 1 range band as part of the reaction.",
				prerequisite: "flashstep",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			crackling_focus: {
				name_key: "career_stormweaver_crackling_focus-u",
				rule_text_key: "career_stormweaver_crackling_focus_rules-u",			
				name: "Crackling Focus",
				description: "If you remain stationary for two full rounds, gain a bonus die to all lightning-tagged Elemental spells for the rest of the scene.",
				prerequisite: "",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			reactive_veilwalk: {
				name_key: "career_stormweaver_reactive_veilwalk-u",
				rule_text_key: "career_stormweaver_reactive_veilwalk_rules-u",			
				name: "Reactive Veilwalk",
				description: "Once per scene, as a reaction, spend 2 Strain to teleport 1 range band away. All enemies in engaged range before or after the movement take 1d6 lightning damage.",
				prerequisite: "pulse_detonation",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},	
			shockstep_conduit: {
				name_key: "career_stormweaver_shockstep_conduit-u",
				rule_text_key: "career_stormweaver_shockstep_conduit_rules-u",			
				name: "Shockstep Conduit",
				description: "Once per session, teleport to any visible point within medium range. Enemies in engaged range at your starting and ending locations each take 1d4 lightning damage.",
				prerequisite: ["voltaic_reflex", "pulse_detonation"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},			
			stormcallers_edge: {
				name_key: "career_stormweaver_stormcallers_edge-u",
				rule_text_key: "career_stormweaver_stormcallers_edge_rules-u",		
				name: "Stormcaller's Edge",
				description: "Spend 4 Strain to gain two bonus dice on an Elemental spell. If successful, the spell also affects one additional target within short range.",
				prerequisite: "scorchmark",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			volcanic_path: {
				name_key: "career_stormweaver_volcanic_path-u",
				rule_text_key: "career_stormweaver_volcanic_path_rules-u",			
				name: "Volcanic Path",
				description: "Once per session, create a line of burning terrain (fire or molten stone) in short range. Crossing it deals 1d6 damage and may impose a penalty die on movement for that round.",
				prerequisite: "stormpulse_drive",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			arc_flare: {
				name_key: "career_stormweaver_arc_flare-u",
				rule_text_key: "career_stormweaver_arc_flare_rules-u",
				name: "Arc Flare",
				description: "As a reaction, when you get an extreme or critical success on an Elemental spell, you may blind a nearby enemy. They suffer two penalty dice until their next action.",
				prerequisite: "crackling_focus",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			burn_current: {
				name_key: "career_stormweaver_burn_current-u",
				rule_text_key: "career_stormweaver_burn_current_rules-u",			
				name: "Burn Current",
				description: "Spend 2 Strain to unleash lightning in engaged range. Enemies take 1d6 damage and suffer a penalty die. Mechanical targets (drones, robots, vehicles) take 2d6 damage and may short out.",
				prerequisite: ["shockstep_conduit", "reactive_veilwalk"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},	
			flashfire_assault: {
				name_key: "career_stormweaver_flashfire_assault-u",
				rule_text_key: "career_stormweaver_flashfire_assault_rules-u",			
				name: "Flashfire Assault",
				description: "Once per session, after casting a spell, make a melee or thrown attack against a target in engaged or short range with a bonus die as an incidental action.",
				prerequisite: "stormcallers_edge",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			surge_engine: {
				name_key: "career_stormweaver_surge_engine-u",
				rule_text_key: "career_stormweaver_surge_engine_rules-u",			
				name: "Surge Engine",
				description: "Cast your next Elemental spell for 0 Strain. Usable once per session. Cannot be combined with other talents that alter spell cost or effect.",
				prerequisite: "",
				prerequisiteAny: { tier: 3, count: 1 },
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},			
			veilstorm_mantle: {
				name_key: "career_stormweaver_veilstorm_mantle-u",
				rule_text_key: "career_stormweaver_veilstorm_mantle_rules-u",			
				name: "Veilstorm Mantle",
				description: "Spend 3 Strain to activate a storm cloak for one scene. Melee attackers take 1d4 lightning damage, and if they fail a CON roll, they suffer a penalty die on their next action.",
				prerequisiteAll: ["tempest_anchor", "stormcallers_edge"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			eye_of_the_storm: {
				name_key: "career_stormweaver_eye_of_the_storm-u",
				rule_text_key: "career_stormweaver_eye_of_the_storm_rules-u",			
				name: "Eye of the Storm",
				description: "Once per session, enter a Veil trance as an action for one scene. While active, reduce all Elemental spell Strain costs for the scene by one die step, and reroll any one failed Elemental spell.",
				prerequisite: ["veilstorm_mantle", "arc_flare"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stormpiercer: {
				name_key: "career_stormweaver_stormpiercer-u",
				rule_text_key: "career_stormweaver_stormpiercer_rules-u",			
				name: "Stormpiercer",
				description: "Once per session, choose one Elemental spell. That spell ignores magical barriers, bypasses armor soak, and hits one extra target within medium range.",
				prerequisiteAll: ["stormcallers_edge", "arc_flare"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			veilburn_protocol: {
				name_key: "career_stormweaver_veilburn_protocol-u",
				rule_text_key: "career_stormweaver_veilburn_protocol_rules-u",			
				name: "Veilburn Protocol",
				description: "Once per session, as an action, spend 4 Strain to unleash a medium-radius arcane blast (choose fire, lightning, or force). All enemies in range take 2d6 damage. Terrain may be scorched or destabilized. Allies are unaffected.",
				prerequisite: ["surge_engine", "burn_current"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"				
			},
			stat_boost: {
				name_key: "career_stormweaver_stat_boost-u",
				rule_text_key: "career_stormweaver_stat_boost_rules-u",			
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			}
		}
	},
	veil_dancer: {
	},
	/* Core Career */
	brawler: {
	},
    combat_engineer: {
        name: "Combat Engineer",
        career_type: "core",
        career_type_name: "Core",
        skill_points_primary_formula: {
            attributes: ["EDU"],
            multipliers: [4]
        },
        skill_points_primary_display: "EDU × 4",
        skill_points_secondary: 20,
        spell_xp_primary: 0,
        spell_xp_secondary: 0,
        primary_skills: {
            demolitions: "Demolitions",
            electronics: "Electronics",
            mechanics:   "Mechanics",
            perception:  "Perception"
        },
        secondary_skills: {
            athletics:        "Athletics",
            computer_use:     "Computer Use",
            drive_auto:       "Drive (Auto)",
            insight:          "Insight",
            firearms_handgun: "Pistols",
            security:         "Security Systems"
        },
        talents: {
            breachfinders_eye: {
				name_key: "career_combat_engineer_breachfinders_eye-u",
				rule_text_key: "career_combat_engineer_breachfinders_eye_rules-u",			
                name: "Breachfinder’s Eye",
                description: "Once per scene, roll Mechanics or Demolitions with a bonus die to locate a weak point. Your next attack or sabotage against it gains a bonus die and deals 1d4 damage or triggers a complication (GM’s discretion).",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            field_fix: {
				name_key: "career_combat_engineer_field_fix-u",
				rule_text_key: "career_combat_engineer_field_fix_rules-u",			
                name: "Field Fix",
                description: "Once per session, as an Action, you may spend 1 Strain and attempt a Mechanics roll to restore 1d6  EDU bonus HP to a damaged device, drone, or structure. Must be physically accessible.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "session"
            },
            patchwork_tools: {
				name_key: "career_combat_engineer_patchwork_tools-u",
				rule_text_key: "career_combat_engineer_patchwork_tools_rules-u",			
                name: "Patchwork Tools",
                description: "Once per scene, when making a Mechanics or Electronics roll without proper tools, ignore penalties and gain 10% to the roll.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            quick_bypass: {
				name_key: "career_combat_engineer_quick_bypass-u",
				rule_text_key: "career_combat_engineer_quick_bypass_rules-u",			
                name: "Quick Bypass",
                description: "Once per scene, pick a lock or disable a non-magical alarm as a Maneuver instead of an Action. Requires a Security Systems roll.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            rapid_jury_rig: {
				name_key: "career_combat_engineer_rapid_jury_rig-u",
				rule_text_key: "career_combat_engineer_rapid_jury_rig_rules-u",			
                name: "Rapid Jury-Rig",
                description: "Once per session, as an Action, create a temporary battlefield fix that lasts for 1 scene or 10 minutes. Requires a Mechanics roll.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "session"
            },
            right_tool_for_it: {
				name_key: "career_combat_engineer_right_tool_for_it-u",
				rule_text_key: "career_combat_engineer_right_tool_for_it_rules-u",			
                name: "Right Tool for It",
                description: "Once per scene, if using a repair kit or toolkit, gain a bonus die on a Mechanics or Electronics roll. Does not stack with Patchwork Tools.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            tactile_memory: {
				name_key: "career_combat_engineer_tactile_memory-u",
				rule_text_key: "career_combat_engineer_tactile_memory_rules-u",			
                name: "Tactile Memory",
                description: "Once per session, after physically inspecting a structure or device, you recall its internal layout for the rest of the scene. Gain 10% to all related Mechanics, Demolitions, or Security Systems rolls and halve action time for those tasks.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "session"
            },
            compensating_build: {
				name_key: "career_combat_engineer_compensating_build-u",
				rule_text_key: "career_combat_engineer_compensating_build_rules-u",			
                name: "Compensating Build",
                description: "Reduce penalty dice for makeshift tools by one step. Once per scene, gain +10% to Mechanics or Electronics when using scavenged parts.",
                prerequisite: "patchwork_tools",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
            controlled_breach: {
				name_key: "career_combat_engineer_controlled_breach-u",
				rule_text_key: "career_combat_engineer_controlled_breach_rules-u",			
                name: "Controlled Breach",
                description: "Once per session, as an Action, place and detonate a directional charge. On a successful Demolitions or Mechanics roll, deal 1d6 damage and disable/stun the target for 1 round. On barriers, halve Integrity before damage.",
                prerequisite: ["breachfinders_eye", "rapid_jury_rig"],
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "session"
            },
            dead_switch_logic: {
				name_key: "career_combat_engineer_dead_switch_logic-u",
				rule_text_key: "career_combat_engineer_dead_switch_logic_rules-u",			
                name: "Dead Switch Logic",
                description: "Once per session, after Breachfinder’s Eye, rig a timed collapse or trap effect that triggers in 1 round or on activation.",
                prerequisite: "breachfinders_eye",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "session"
            },
            fail_safe_trigger: {
				name_key: "career_combat_engineer_fail_safe_trigger-u",
				rule_text_key: "career_combat_engineer_fail_safe_trigger_rules-u",			
                name: "Fail-Safe Trigger",
                description: "Once per session, rig a repaired object to explode (1d6 damage) or shut down if tampered with.",
                prerequisite: "rapid_jury_rig",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "session"
            },
            overclock_protocol: {
				name_key: "career_combat_engineer_overclock_protocol-u",
				rule_text_key: "career_combat_engineer_overclock_protocol_rules-u",			
                name: "Overclock Protocol",
                description: "Once per scene, push a repaired system beyond spec. On a Mechanics or Electronics success, it gains +10% to its next roll but takes 1d4 damage afterward.",
                prerequisite: ["right_tool_for_it", "rapid_jury_rig"],
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
            pathfinders_instinct: {
				name_key: "career_combat_engineer_pathfinders_instinct-u",
				rule_text_key: "career_combat_engineer_pathfinders_instinct_rules-u",			
                name: "Pathfinder’s Instinct",
                description: "If using Tactile Memory, you and allies gain +10% to Navigate/Stealth in that structure and may avoid one environmental hazard in it per session.",
                prerequisite: "tactile_memory",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "session"
            },
            precision_override: {
				name_key: "career_combat_engineer_precision_override-u",
				rule_text_key: "career_combat_engineer_precision_override_rules-u",			
                name: "Precision Override",
                description: "When using Quick Bypass, you may re-roll the Security Systems check once per session.",
                prerequisite: "quick_bypass",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "session"
            },
            reactive_tune_up: {
				name_key: "career_combat_engineer_reactive_tune_up-u",
				rule_text_key: "career_combat_engineer_reactive_tune_up_rules-u",			
                name: "Reactive Tune-Up",
                description: "Once per combat, as a Reaction after an allied drone/rig is damaged, spend 1 Strain and roll Mechanics to reduce damage by 1d4.",
                prerequisite: ["field_fix", "right_tool_for_it"],
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
			power_splice: {
				name_key: "career_combat_engineer_power_splice-u",
				rule_text_key: "career_combat_engineer_power_splice_rules-u",			
			    name: "Power Splice",
			    description: "Once per scene, as an Action, divert power from one device to another. On a Mechanics success, the target regains 1d6 HP or reactivates for 1 round.",
			    prerequisite: "field_fix",
			    tier: 3,
			    cost: "15",
			    capstone: false,
			    usage_limit: "scene"
			},
			reactive_primer: {
				name_key: "career_combat_engineer_reactive_primer-u",
				rule_text_key: "career_combat_engineer_reactive_primer_rules-u",			
			    name: "Reactive Primer",
			    description: "Once per scene, attach a fail-safe so a drone/turret reduced to 0 HP remains online with 1 HP for one final Action.",
			    prerequisite: ["rapid_jury_rig", "right_tool_for_it"],
			    tier: 3,
			    cost: "15",
			    capstone: false,
			    usage_limit: "scene"
			},
			reactive_scaffold: {
				name_key: "career_combat_engineer_reactive_scaffold-u",
				rule_text_key: "career_combat_engineer_reactive_scaffold_rules-u",			
			    name: "Reactive Scaffold",
			    description: "Once per scene, as a Reaction when a nearby device/structure takes damage, roll Mechanics to reduce it by 1d6.",
			    prerequisite: "rapid_jury_rig",
			    tier: 3,
			    cost: "15",
			    capstone: false,
			    usage_limit: "scene"
			},
			sabotage_relay: {
				name_key: "career_combat_engineer_sabotage_relay-u",
				rule_text_key: "career_combat_engineer_sabotage_relay_rules-u",			
			    name: "Sabotage Relay",
			    description: "Once per session, as an Action, corrupt a mechanical system so the next user suffers 1d6 damage or a 1-round misfire.",
			    prerequisite: "breachfinders_eye",
			    tier: 3,
			    cost: "15",
			    capstone: false,
			    usage_limit: "session"
			},
			structural_collapse: {
				name_key: "career_combat_engineer_structural_collapse-u",
				rule_text_key: "career_combat_engineer_structural_collapse_rules-u",			
			    name: "Structural Collapse",
			    description: "Once per session, as an Action, collapse a weakened structure. On a Demolitions success, deal 2d6 damage to targets in range unless they Dodge.",
			    prerequisite: "breachfinders_eye",
			    tier: 3,
			    cost: "15",
			    capstone: false,
			    usage_limit: "session"
			},
			tactical_recompiler: {
				name_key: "career_combat_engineer_tactical_recompiler-u",
				rule_text_key: "career_combat_engineer_tactical_recompiler_rules-u",			
			    name: "Tactical Recompiler",
			    description: "Once per scene, as an Action, spend 1 Strain to override a hostile drone. On a success, it becomes neutral for 1 round; on a Hard Success, it follows 1 simple command.",
			    prerequisite: "overclock_protocol",
			    tier: 3,
			    cost: "15",
			    capstone: false,
			    usage_limit: "scene"
			},
			auto_repair_subroutines: {
				name_key: "career_combat_engineer_auto_repair_subroutines-u",
				rule_text_key: "career_combat_engineer_auto_repair_subroutines_rules-u",			
			    name: "Auto-Repair Subroutines",
			    description: "Once per session, as an Action, install a module so a drone/turret regains 1d3 HP at the end of each round. Only one active at a time. Requires Mechanics roll.",
			    prerequisite: ["reactive_primer", "power_splice"],
			    tier: 4,
			    cost: "20",
			    capstone: false,
			    usage_limit: "session"
			},
			collapse_engineer: {
				name_key: "career_combat_engineer_collapse_engineer-u",
				rule_text_key: "career_combat_engineer_collapse_engineer_rules-u",			
			    name: "Collapse Engineer",
			    description: "Once per scene, as an Action, rig a prepared structure to collapse with a designated trigger. Requires Demolitions roll.",
			    prerequisite: "structural_collapse",
			    tier: 4,
			    cost: "20",
			    capstone: false,
			    usage_limit: "scene"
			},
			failsafe_architect: {
				name_key: "career_combat_engineer_failsafe_architect-u",
				rule_text_key: "career_combat_engineer_failsafe_architect_rules-u",			
			    name: "Failsafe Architect",
			    description: "Once per scene, as a Reaction, prevent a major malfunction on a system you’ve worked on this scene within Short range. No roll required.",
			    prerequisite: ["reactive_scaffold", "tactile_memory"],
			    tier: 4,
			    cost: "20",
			    capstone: false,
			    usage_limit: "scene"
			},
			fortified_anchor: {
				name_key: "career_combat_engineer_fortified_anchor-u",
				rule_text_key: "career_combat_engineer_fortified_anchor_rules-u",			
			    name: "Fortified Anchor",
			    description: "Once per session, as an Action, reinforce a structure/device. On success, it gains +4 HP and is immune to forced movement/topple for the scene.",
			    prerequisite: "reactive_scaffold",
			    tier: 4,
			    cost: "20",
			    capstone: false,
			    usage_limit: "session"
			},
			hijack_protocol: {
				name_key: "career_combat_engineer_hijack_protocol-u",
				rule_text_key: "career_combat_engineer_hijack_protocol_rules-u",			
			    name: "Hijack Protocol",
			    description: "Once per session, as an Action, attempt to take full control of an automated drone/device. Target resists with its Security Level; on a Hard Success, you control it for the scene unless interrupted.",
			    prerequisite: "tactical_recompiler",
			    tier: 4,
			    cost: "20",
			    capstone: false,
			    usage_limit: "session"
			},
			saboteurs_signature: {
				name_key: "career_combat_engineer_saboteurs_signature-u",
				rule_text_key: "career_combat_engineer_saboteurs_signature_rules-u",			
			    name: "Saboteur’s Signature",
			    description: "Once per session, when placing a sabotage effect, add one: +1d6 damage, +10% avoid detection, or +1 round delay.",
			    prerequisite: ["structural_collapse", "sabotage_relay"],
			    tier: 4,
			    cost: "20",
			    capstone: false,
			    usage_limit: "session"
			},
			failsafe_codex: {
				name_key: "career_combat_engineer_failsafe_codex-u",
				rule_text_key: "career_combat_engineer_failsafe_codex_rules-u",			
			    name: "Failsafe Codex",
			    description: "Once per scene, as a Reaction, instantly restore a damaged system you’ve interacted with to half HP and immune to malfunctions for the scene.",
			    prerequisite: "failsafe_architect",
			    tier: 5,
			    cost: "30",
			    capstone: true,
			    usage_limit: "scene"
			},
			field_constructor: {
				name_key: "career_combat_engineer_field_constructor-u",
				rule_text_key: "career_combat_engineer_field_constructor_rules-u",			
			    name: "Field Constructor",
			    description: "Once per session, as an Action, rapidly construct one: (1) Turret (2d6 damage, 3 rounds), (2) Barricade (+2 Armor & cover), or (3) Utility drone. Requires Mechanics roll. Breaks down at scene end.",
			    prerequisite: ["auto_repair_subroutines", "power_splice"],
			    tier: 5,
			    cost: "30",
			    capstone: true,
			    usage_limit: "session"
			},
			master_of_collapse: {
				name_key: "career_combat_engineer_master_of_collapse-u",
				rule_text_key: "career_combat_engineer_master_of_collapse_rules-u",			
			    name: "Master of Collapse",
			    description: "Once per session, as an Action, trigger all sabotage points in a structure. On success, all collapse zones deal 3d6 damage; targets must Dodge or be trapped.",
			    prerequisite: "collapse_engineer",
			    tier: 5,
			    cost: "30",
			    capstone: true,
			    usage_limit: "session"
			},
			system_subjugation: {
				name_key: "career_combat_engineer_system_subjugation-u",
				rule_text_key: "career_combat_engineer_system_subjugation_rules-u",			
			    name: "System Subjugation",
			    description: "Once per session, as an Action, attempt to seize all devices in a small area. Opposed Electronics vs Security Level. On a Hard Success, control lasts the scene.",
			    prerequisite: "hijack_protocol",
			    tier: 5,
			    cost: "30",
			    capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_combat_engineer_stat_boost-u",
				rule_text_key: "career_combat_engineer_stat_boost_rules-u",			
			    name: "+5% Stat Boost",
			    description: "Increase any one core stat (including Magic) by +5%, up to racial maximum. May only be taken once.",
				prerequisiteAny: { tier: 4, count: 1 },
			    tier: 5,
			    cost: "30",
			    capstone: true,
			    usage_limit: "none"
			}
        }		
    },
	combat_medic: {
		name: "Combat Medic",
		career_type: "core",
		career_type_name: "Core",
		skill_points_primary_formula: {
			attributes: ["EDU"],
			multipliers: [4]
		},
		skill_points_primary_display: "EDU × 4",
		skill_points_secondary: 20,
		spell_xp_primary: 0,
		spell_xp_secondary: 0,
		primary_skills: {
			first_aid: "First Aid",
			medicine: "Medicine",
			coordination: "Coordination",
			dodge: "Dodge"
		},
		secondary_skills: {
			firearms_handgun: "Pistols",
			insight: "Insight",
			electronics: "Electronics",
			athletics: "Athletics",
			perception: "Perception",
			security: "Security Systems"
		},
		talents: {
			field_stabilizer: {
				name_key: "career_combat_medic_field_stabilizer-u",
				rule_text_key: "career_combat_medic_field_stabilizer_rules-u",			
				name: "Field Stabilizer",
				description: "Once per scene, gain a bonus die when using Medicine or First Aid on an unconscious or dying ally.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			injector_harness: {
				name_key: "career_combat_medic_injector_harness-u",
				rule_text_key: "career_combat_medic_injector_harness_rules-u",			
				name: "Injector Harness",
				description: "Once per scene, you may perform a First Aid, stim, or injector-based action as a maneuver instead of an action.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			pain_doesnt_matter: {
				name_key: "career_combat_medic_pain_doesnt_matter-u",
				rule_text_key: "career_combat_medic_pain_doesnt_matter_rules-u",			
				name: "Pain Doesn’t Matter",
				description: "Once per scene, make a Medicine check to restore consciousness to an ally who is unconscious or who failed a CON check after suffering a major wound.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			trauma_team_reflexes: {
				name_key: "career_combat_medic_trauma_team_reflexes-u",
				rule_text_key: "career_combat_medic_trauma_team_reflexes_rules-u",			
				name: "Trauma Team Reflexes",
				description: "Once per scene, you may trade Initiative order with an ally. Both characters must not have acted yet.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			vital_scan_overlay: {
				name_key: "career_combat_medic_vital_scan_overlay-u",
				rule_text_key: "career_combat_medic_vital_scan_overlay_rules-u",			
				name: "Vital Scan Overlay",
				description: "Once per scene, gain a bonus die on a First Aid or Medicine roll if the target is below half HP. You may also detect hidden conditions (e.g., internal bleeding, toxin exposure) with a successful check.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			medical_override: {
				name_key: "career_combat_medic_medical_override-u",
				rule_text_key: "career_combat_medic_medical_override_rules-u",			
				name: "Medical Override",
				description: "Once per scene, spend 2 Strain to double the HP healed by your next First Aid or Medicine check.",
				prerequisite: ["pain_doesnt_matter" ,"injector_harness"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},		
			painkiller_protocol: {
				name_key: "career_combat_medic_painkiller_protocol-u",
				rule_text_key: "career_combat_medic_painkiller_protocol_rules-u",			
				name: "Painkiller Protocol",
				description: "After healing an ally, they gain a bonus die on their next action during the same scene.",
				prerequisite: "injector_harness",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},			
			pressure_seal: {
				name_key: "career_combat_medic_pressure_seal-u",
				rule_text_key: "career_combat_medic_pressure_seal_rules-u",			
				name: "Pressure Seal",
				description: "Once per session, you may automatically stabilize a bleeding-out ally below 0 HP. No roll required.",
				prerequisite: "field_stabilizer",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			stay_with_me: {
				name_key: "career_combat_medic_stay_with_me-u",
				rule_text_key: "career_combat_medic_stay_with_me_rules-u",			
				name: "Stay With Me!",
				description: "Once per scene, when an ally within engaged or short-range drops to 0 HP, you may immediately make a First Aid check as a reaction to stabilize them.",
				prerequisite: "field_stabilizer",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			tactical_redeployment: {
				name_key: "career_combat_medic_tactical_redeployment-u",
				rule_text_key: "career_combat_medic_tactical_redeployment_rules-u",			
				name: "Tactical Redeployment",
				description: "As a reaction, when an ally within medium range takes damage, you may move one range band closer toward them.",
				prerequisite: "trauma_team_reflexes",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			combat_revive: {
				name_key: "career_combat_medic_combat_revive-u",
				rule_text_key: "career_combat_medic_combat_revive_rules-u",			
				name: "Combat Revive",
				description: "Once per session, you may revive a stabilized ally within engaged range, restoring up to half their HP. Requires a full action and physical contact.",
				prerequisite: "medical_override",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			overwatch_healer: {
				name_key: "career_combat_medic_overwatch_healer-u",
				rule_text_key: "career_combat_medic_overwatch_healer_rules-u",			
				name: "Overwatch Healer",
				description: "While providing overwatch for an injured ally, gain a bonus die on your next attack against an enemy who attacks that ally.",
				prerequisite: "tactical_redeployment",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},	
			quickdraw_injector: {
				name_key: "career_combat_medic_quickdraw_injector-u",
				rule_text_key: "career_combat_medic_quickdraw_injector_rules-u",			
				name: "Quickdraw Injector",
				description: "Once per scene, you may use a stim or injector as a reaction on yourself or an ally in engaged range.",
				prerequisite: ["injector_harness", "painkiller_protocol"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},			
			surgical_clarity: {
				name_key: "career_combat_medic_surgical_clarity-u",
				rule_text_key: "career_combat_medic_surgical_clarity_rules-u",			
				name: "Surgical Clarity",
				description: "Once per session, reroll a failed Medicine or First Aid check with a bonus die. If successful, the action takes half the usual time.",
				prerequisite: ["stay_with_me" ,"pressure_seal"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			veil_immunologist: {
				name_key: "career_combat_medic_veil_immunologist-u",
				rule_text_key: "career_combat_medic_veil_immunologist_rules-u",			
				name: "Veil Immunologist",
				description: "Once per session, make a Medicine check to reduce Veil Corruption in an ally who suffered corruption this scene. You also gain a bonus die on Medicine checks against arcane or Veil-based afflictions.",
				prerequisite: ["pressure_seal", "vital_scan_overlay"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			emergency_triage_net: {
				name_key: "career_combat_medic_emergency_triage_net-u",
				rule_text_key: "career_combat_medic_emergency_triage_net_rules-u",			
				name: "Emergency Triage Net",
				description: "Once per session, select up to two allies within short range. You may divide the result of one successful Medicine check between them (each must receive at least 1 HP).",
				prerequisite: "overwatch_healer",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},			
			endurance_conditioning: {
				name_key: "career_combat_medic_endurance_conditioning-u",
				rule_text_key: "career_combat_medic_endurance_conditioning_rules-u",			
				name: "Endurance Conditioning",
				description: "Gain +2 maximum HP. This bonus is permanent.",
				prerequisite: ["surgical_clarity" ,"combat_revive" ],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			field_expeditor: {
				name_key: "career_combat_medic_field_expeditor-u",
				rule_text_key: "career_combat_medic_field_expeditor_rules-u",			
				name: "Field Expeditor",
				description: "Once per session, you may perform a First Aid or Medicine check as a free action instead of a full action.",
				prerequisite: "combat_revive",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			ghost_of_the_er: {
				name_key: "career_combat_medic_ghost_of_the_er-u",
				rule_text_key: "career_combat_medic_ghost_of_the_er_rules-u",			
				name: "Ghost of the ER",
				description: "Once per session, you may move through a danger zone to reach an injured ally. You do not provoke Overwatch attacks or reactions, and enemies suffer a penalty die when targeting you until your next turn.",
				prerequisite: "overwatch_healer",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			reactive_trauma_surge: {
				name_key: "career_combat_medic_reactive_trauma_surge-u",
				rule_text_key: "career_combat_medic_reactive_trauma_surge_rules-u",			
				name: "Reactive Trauma Surge",
				description: "Once per scene, when an ally within short range drops below half HP, you may move to them and perform a First Aid check as a free action. If successful, they gain a bonus die on their next action.",
				prerequisite: "surgical_clarity",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			adrenal_shield_matrix: {
				name_key: "career_combat_medic_adrenal_shield_matrix-u",
				rule_text_key: "career_combat_medic_adrenal_shield_matrix_rules-u",			
				name: "Adrenal Shield Matrix",
				description: "Once per session, when healing an ally, they also gain 1d6 temporary HP that lasts for the remainder of the scene.",
				prerequisite: "endurance_conditioning",
				tier: 5,
				cost: "30",
				capstone: true,
				usage_limit: "session"
			},
			miracle_protocol: {
				name_key: "career_combat_medic_miracle_protocol-u",
				rule_text_key: "career_combat_medic_miracle_protocol_rules-u",			
				name: "Miracle Protocol",
				description: "Once per session, make a Medicine check that automatically succeeds. On success, you may also remove one condition or one level of Veil Corruption from the target.",
				prerequisite: ["field_expeditor" ,"ghost_of_the_er"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},			
			no_one_dies_today: {
				name_key: "career_combat_medic_no_one_dies_today-u",
				rule_text_key: "career_combat_medic_no_one_dies_today_rules-u",			
				name: "No One Dies Today",
				description: "Once per session, when an ally you can see would die from an attack or effect, they instead remain alive at 1 HP and may act normally for the remainder of the scene.",
				prerequisite: "emergency_triage_net",
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_combat_medic_stat_boost-u",
				rule_text_key: "career_combat_medic_stat_boost_rules-u",			
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			}
		}
	},
	faceman: {
		name: "Faceman",
		career_type: "core",
		career_type_name: "Core",
		skill_points_primary_formula: {
			attributes: ["EDU"],
			multipliers: [4]
		},
		skill_points_primary_display: "EDU × 4",
		skill_points_secondary: 20,
		spell_xp_primary: 0,
		spell_xp_secondary: 0,
		primary_skills: {
			deception: "Deception",
			persuade: "Persuade",
			insight: "Insight",
			disguise: "Disguise"
		},
		secondary_skills: {
			streetwise: "Streetwise",
			etiquette_alteri: "Etiquette (Alteri)",
			etiquette_high_society: "Etiquette (High Society)",
			etiquette_lyranni: "Etiquette (Lyranni)",
			etiquette_underworld: "Etiquette (Underworld)",
			etiquette_other: "Etiquette (Other)",
			leadership: "Leadership",
			security: "Security Systems",
			electronics: "Electronics",
			bureaucracy: "Bureaucracy"
		},
		exclusive_skill_sets: [
			["etiquette_alteri", "etiquette_high_society", "etiquette_lyranni", "etiquette_underworld", "etiquette_other"]
		],
		talents: {
            clock_the_rules: {
				name_key: "career_faceman_clock_the_rules-u",
				rule_text_key: "career_faceman_clock_the_rules_rules-u",			
                name: "Clock the Rules",
                description: "Maneuver — Make an Insight check during a live exchange. On success, learn one operative rule/custom the gatekeeper follows (shift change, clan token, contractor script) and gain a bonus die on your next social roll against that person this scene.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            introductions_on_me: {
				name_key: "career_faceman_introductions_on_me-u",
				rule_text_key: "career_faceman_introductions_on_me_rules-u",			
                name: "Introductions On Me",
                description: "Maneuver — Once per scene, after you establish a plausible purpose, choose up to two allies. Their first social test with this group this scene gains a bonus die.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            make_it_official: {
				name_key: "career_faceman_make_it_official-u",
				rule_text_key: "career_faceman_make_it_official_rules-u",			
                name: "Make It Official",
                description: "Action; 1 Strain — Once per scene, create or edit an on-the-spot credential or token (House writ, work order, visitor slip, salvage chit, scrip voucher). The next scrutiny tied to that document this scene gains a bonus die. If the check is digital/mechanical, include Electronics or Security Systems as part of the action.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            prompting_whisper: {
				name_key: "career_faceman_prompting_whisper-u",
				rule_text_key: "career_faceman_prompting_whisper_rules-u",			
                name: "Prompting Whisper",
                description: "Reaction (declare before ally’s roll); 1 Strain — Feed a line or cue to an ally making Deception, Persuade, or Disguise. They gain a bonus die. If immediate follow-up scrutiny occurs, it targets you.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: ""
            },
            walkthrough_doctrine: {
				name_key: "career_faceman_walkthrough_doctrine-u",
				rule_text_key: "career_faceman_walkthrough_doctrine_rules-u",			
                name: "Walkthrough Doctrine",
                description: "Action; 1 Strain — Once per scene, when challenged at a point of contact (corp lobby, House outpost, scav gate), roll Deception or Persuade. On success, that challenge is treated as routine for you and one ally for the rest of the interaction with that gatekeeper this scene (Hard: up to two allies). Does not affect active violence.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            cover_flip: {
				name_key: "career_faceman_cover_flip-u",
				rule_text_key: "career_faceman_cover_flip_rules-u",			
                name: "Cover Flip",
                description: "Reaction (before scrutiny); 1 Strain — Once per scene, swap into a prepared identity. Roll Disguise in place of the demanded social check for that scrutiny. If you Clocked the Rules on this screener earlier this scene, add a bonus die.",
                prerequisite: "clock_the_rules",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
            default_to_process: {
				name_key: "career_faceman_default_to_process-u",
				rule_text_key: "career_faceman_default_to_process_rules-u",			
                name: "Default to Process",
                description: "Reaction (before a confrontation escalates); 1 Strain — When a gatekeeper is about to detain or escalate, roll Persuade vs. POW. On success, they choose a procedural alternative for the current exchange (log it, call it in, fetch a supervisor) and the interaction remains non-hostile.",
                prerequisite: "walkthrough_doctrine",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: ""
            },
            follow_my_lead: {
				name_key: "career_faceman_follow_my_lead-u",
				rule_text_key: "career_faceman_follow_my_lead_rules-u",			
                name: "Follow My Lead",
                description: "Reaction (after your success; before ally’s roll); 1 Strain — Once per scene, after you succeed on Deception or Persuade with this group, one ally attempting a related check this scene gains a bonus die and may cite your success as precedent.",
                prerequisite: "prompting_whisper",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
            host_escort: {
				name_key: "career_faceman_host_escort-u",
				rule_text_key: "career_faceman_host_escort_rules-u",			
                name: "Host Escort",
                description: "Action; 1 Strain — Once per scene, Persuade vs. POW a non-supervisor gatekeeper (usher, clerk, quartermaster, crew chief). On success, they personally accompany you and one ally for the rest of the interaction, smoothing routine checks they control.",
                prerequisite: "introductions_on_me",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
            pass_token_clone: {
				name_key: "career_faceman_pass_token_clone-u",
				rule_text_key: "career_faceman_pass_token_clone_rules-u",			
                name: "Pass-Token Clone",
                description: "Action; 1 Strain — Once per scene, after observing/handling a valid badge, token, or wristband this scene, roll Electronics or Security Systems. On success, the clone passes one comparable scrutiny this scene (Hard: two). Hands-on inspection defeats a clone.",
                prerequisite: "make_it_official",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
            frame_the_interaction: {
				name_key: "career_faceman_frame_the_interaction-u",
				rule_text_key: "career_faceman_frame_the_interaction_rules-u",			
                name: "Frame the Interaction",
                description: "Action; 1 Strain — Recast the challenge as your process. Choose one for this scene: delay a scrutiny long enough to finish your current ask; remove one penalty die from an ally’s next social check with this group; or impose a penalty die on the screener’s next attempt to scrutinize.",
                prerequisite: "default_to_process",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: ""
            },
            interruption_play: {
				name_key: "career_faceman_interruption_play-u",
				rule_text_key: "career_faceman_interruption_play_rules-u",			
                name: "Interruption Play",
                description: "Reaction (before ally’s roll); 1 Strain — Once per scene, when an ally is about to be screened or questioned, you interject and take the test using Deception, Persuade, or Disguise (choose). If immediate follow-up scrutiny happens, it targets you.",
                prerequisite: "follow_my_lead",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },
            one_conversation_rule: {
				name_key: "career_faceman_one_conversation_rule-u",
				rule_text_key: "career_faceman_one_conversation_rule_rules-u",			
                name: "One-Conversation Rule",
                description: "Action; 1d4 Strain — Once per scene, at a single point of contact this scene, pre-resolve scrutiny: choose up to two foreseeable, similar checks (e.g., sign-in + asset tag; wristband scan + bag glance). Make one Deception or Persuade test now. On success, those later checks are routine when they occur (no roll) unless a new authority or novel protocol appears.",
                prerequisite: "cover_flip",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },
            senior_voice: {
				name_key: "career_faceman_senior_voice-u",
				rule_text_key: "career_faceman_senior_voice_rules-u",			
                name: "Senior Voice",
                description: "Action; 1d4 Strain — Once per scene, address a non-officer gatekeeper in earshot. Persuade vs. POW. On success, they treat you as a temporary superior for the rest of this interaction: open a door, issue a handoff, begin an escort. Won’t force illegal orders; supervisors resist with a bonus die.",
                prerequisite: "host_escort",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },
            token_familiarity: {
				name_key: "career_faceman_token_familiarity-u",
				rule_text_key: "career_faceman_token_familiarity_rules-u",			
                name: "Token Familiarity",
                description: "Passive — Once per scene, when any belonging token is presented (House scrip band, union chit, clinic band, clan bead), you skip one secondary “prove-it” step (random quiz, second scan, code phrase) without a roll.",
                prerequisite: "pass_token_clone",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },
            claim_authority: {
				name_key: "career_faceman_claim_authority-u",
				rule_text_key: "career_faceman_claim_authority_rules-u",			
                name: "Claim Authority",
                description: "Action; 1d4 Strain — Once per session, assert temporary oversight: Persuade vs. POW on a gatekeeper in earshot. On success, for the rest of the scene they treat you as an authorized inspector/House auditor/sector elder within their remit (escort on request, open what they control, answer procedural questions). Elite units ignore; supervisors resist with a bonus die.",
                prerequisite: "senior_voice",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "session"
            },
            deep_cover_switch: {
				name_key: "career_faceman_deep_cover_switch-u",
				rule_text_key: "career_faceman_deep_cover_switch_rules-u",			
                name: "Deep Cover Switch",
                description: "Maneuver; 1 Strain — Swap to a prepared identity without consuming your action. The first social roll under that identity this scene gains a bonus die.",
                prerequisite: "one_conversation_rule",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },
            human_gate_hand_off: {
				name_key: "career_faceman_human_gate_hand_off-u",
				rule_text_key: "career_faceman_human_gate_hand_off_rules-u",			
                name: "Human Gate Hand-Off",
                description: "Action; 1 Strain — Once per scene, after observing a digital or mechanical check (scanner, scrip reader, mag-lock keypad), you route it to manual adjudication. The next check at this station this scene is decided by a person; you roll Deception or Persuade instead of Electronics/Security Systems opposition. Allies can benefit.",
                prerequisite: "frame_the_interaction",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },
            master_cue: {
				name_key: "career_faceman_master_cue-u",
				rule_text_key: "career_faceman_master_cue_rules-u",			
                name: "Master Cue",
                description: "Reaction (before roll); 2 Strain — Once per scene, feed lines and framing to an ally making Deception, Persuade, or Disguise. They may use your corresponding skill if higher. If immediate follow-up scrutiny occurs, it targets you.",
                prerequisite: "interruption_play",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },
            small_team_protocol_reset: {
				name_key: "career_faceman_small_team_protocol_reset-u",
				rule_text_key: "career_faceman_small_team_protocol_reset_rules-u",			
                name: "Small-Team Protocol Reset",
                description: "Action; 1d4 Strain — Once per scene, address up to three professionals in earshot (guards, ushers, stewards, wardens). Persuade vs. average POW. On success, for the rest of this immediate conversation, they revert to a non-hostile standard procedure you name (\"resume patrol\", \"await supervisor\", \"escort to intake\"). No effect once violence starts.",
                prerequisite: "senior_voice",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },
            all_access_walk: {
				name_key: "career_faceman_all_access_walk-u",
				rule_text_key: "career_faceman_all_access_walk_rules-u",			
                name: "All-Access Walk",
                description: "Action; 1d4 Strain — Once per session, compress the scene’s ordinary scrutiny by the same group into one high-stakes test: roll Deception or Persuade once. On success, routine checks by that group treat you and up to two allies as cleared for the rest of the scene, unless a new authority or novel protocol appears (Hard: up to five allies).",
                prerequisite: ["claim_authority", "human_gate_hand_off"],
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            chain_of_command_gambit: {
				name_key: "career_faceman_chain_of_command_gambit-u",
				rule_text_key: "career_faceman_chain_of_command_gambit_rules-u",			
                name: "Chain-of-Command Gambit",
                description: "Action; 1d4 Strain — Once per session, name one crew/guild/agency active this scene. For the rest of the current interaction, any non-supervisor member you address treats your procedural instruction as priority unless they succeed a POW roll. Supervisors resist with a bonus die.",
                prerequisite: "small_team_protocol_reset",
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            conversational_tyrant: {
				name_key: "career_faceman_conversational_tyrant-u",
				rule_text_key: "career_faceman_conversational_tyrant_rules-u",			
                name: "Conversational Tyrant",
                description: "Scene; 2 Strain — Once per session, for one scene, the first time you address any professional present, you may choose Deception or Persuade and gain a bonus die on that first-contact roll against each individual.",
                prerequisite: "master_cue",
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            master_of_disguise: {
				name_key: "career_faceman_master_of_disguise-u",
				rule_text_key: "career_faceman_master_of_disguise_rules-u",			
                name: "Master of Disguise",
                description: "Downtime prep → Scene effect — Once per session, with ≥10 minutes of prep before the scene, you auto-succeed vs. casual scrutiny for the entire scene. Deliberate verification still requires a roll; on the first Disguise test against each new screener, gain a bonus die.",
                prerequisite: "deep_cover_switch",
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            stat_boost: {
				name_key: "career_faceman_stat_boost-u",
				rule_text_key: "career_faceman_stat_boost_rules-u",			
                name: "+5% Stat Boost",
                description: "Increase any one core stat (including Magic) by +5%, up to your racial maximum. May only be taken once.",
                prerequisite: "",
                prerequisiteAny: { tier: 4, count: 1 },
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: ""
            }		
		}
	},
	icon: {
		name: "Icon",
		career_type: "core",
		career_type_name: "Core",
		skill_points_primary_formula: {
			attributes: ["APP", "EDU"],
			multipliers: [2, 2]
		},
		skill_points_primary_display: "APP × 2 + EDU × 2",
		skill_points_secondary: 20,
		spell_xp_primary: 0,
		spell_xp_secondary: 0,
		primary_skills: {
			charm: "Charm",
			insight: "Insight",
			perform_acting: "Perform Acting",
			perform_dance: "Perform Dance",
			perform_impersonation: "Perform Impersonation",
			perform_instrument: "Perform Instrument",
			perform_vocal: "Perform Vocal",
			persuade: "Persuade"
		},
		secondary_skills: {
			coordination: "Coordination",
			deception: "Deception",			
			disguise: "Disguise",
			electronics: "Electronics",
			leadership: "Leadership",
			streetwise: "Streetwise"
		},
		exclusive_skill_sets: [
			["perform_acting", "perform_dance", "perform_impersonation", "perform_instrument", "perform_vocal"]
		],
		talents: {
			command_the_stage: {
				name_key: "career_icon_command_the_stage-u",
				rule_text_key: "career_icon_command_the_stage_rules-u",			
				name: "Command the Stage",
				description: "Once per scene, when you perform before a group (live or broadcast), choose one: gain a bonus die to Charm, Persuade, or Leadership for the rest of the scene or impose a penalty die on audience hostility for 1 round.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
				usage_limit: "scene"
			},	
			encore_effect: {
				name_key: "career_icon_encore_effect-u",
				rule_text_key: "career_icon_encore_effect_rules-u",			
				name: "Encore Effect",
				description: "Once per scene, reroll a failed Perform check. If the reroll succeeds, grant +10 to the next roll of any one ally or NPC who observed it.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
				usage_limit: "scene"
			},
			neurolinked_presence: {
				name_key: "career_icon_neurolinked_presence-u",
				rule_text_key: "career_icon_neurolinked_presence_rules-u",			
				name: "Neurolinked Presence",
				description: "While performing through a DreamFeed or emotion-sync venue, gain +10 to Perform or Charm during the scene. Applies to both live and recorded feeds.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
				usage_limit: ""
			},	
			showstopper: {
				name_key: "career_icon_showstopper-u",
				rule_text_key: "career_icon_showstopper_rules-u",			
				name: "Showstopper",
				description: "When initiating a performance or attempting to seize attention, you may roll Perform instead of Deception or Intimidate to distract, misdirect, or engage a crowd.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
				usage_limit: ""
			},				
			strain_buffer: {
				name_key: "career_icon_strain_buffer-u",
				rule_text_key: "career_icon_strain_buffer_rules-u",			
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career trees.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
				usage_limit: ""
			},	
			crowd_momentum: {
				name_key: "career_icon_crowd_momentum-u",
				rule_text_key: "career_icon_crowd_momentum_rules-u",			
				name: "Crowd Momentum",
				description: "After a successful Perform check that captures audience attention, gain a bonus die to your next Persuade, Charm, or Leadership roll this scene.",
				prerequisite: "showstopper",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: "scene"
			},	
			emotional_contagion: {
				name_key: "career_icon_emotional_contagion-u",
				rule_text_key: "career_icon_emotional_contagion_rules-u",			
				name: "Emotional Contagion",
				description: "Once per session, when you successfully sway an audience, one NPC observer shifts from Neutral to Friendly for the rest of the scene.",
				prerequisite: "command_the_stage",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: "session"
			},
			pulse_of_the_crowd: {
				name_key: "career_icon_pulse_of_the_crowd-u",
				rule_text_key: "career_icon_pulse_of_the_crowd_rules-u",			
				name: "Pulse of the Crowd",
				description: "Once per session, after a successful live or broadcast performance, regain 1d4 Strain.",
				prerequisite: "encore_effect",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: "session"
			},			
			stagecraft: {
				name_key: "career_icon_stagecraft-u",
				rule_text_key: "career_icon_stagecraft_rules-u",		
				name: "Stagecraft",
				description: "Gain +10 to downtime performance-based rolls to earn credits or build influence. May also apply to artistic Networking scenes at GM discretion.",
				prerequisite: "command_the_stage",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: ""
			},
			street_stage_discipline: {
				name_key: "career_icon_street_stage_discipline-u",
				rule_text_key: "career_icon_street_stage_discipline_rules-u",			
				name: "Street Stage Discipline",
				description: "Ignore 1 penalty die to Perform checks when performing in chaotic, crowded, or dangerous environments (e.g., combat zones, underground clubs, protests).",
				prerequisite: "showstopper",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: ""
			},
			burn_it_brighter: {
				name_key: "career_icon_burn_it_brighter-u",
				rule_text_key: "career_icon_burn_it_brighter_rules-u",			
				name: "Burn It Brighter",
				description: "When you are below 50% of your maximum HP or Strain, additional Maneuvers cost only 2 Strain each instead of the usual 3. If your HP or Strain are restored above 50%, this benefit ends until the condition is met again.",
				prerequisite: "street_stage_discipline",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: ""
			},
			endurance_conditioning: {
				name_key: "career_icon_endurance_conditioning-u",
				rule_text_key: "career_icon_endurance_conditioning_rules-u",			
				name: "Endurance Conditioning",
				description: "Gain +2 maximum HP. This bonus is permanent, reflecting the physical demands of stage work, emotional burnout, and neural strain.",
				prerequisite: "street_stage_discipline",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: ""
			},	
			resonant_persona: {
				name_key: "career_icon_resonant_persona-u",
				rule_text_key: "career_icon_resonant_persona_rules-u",			
				name: "Resonant Persona",
				description: "Create a named performance persona with a distinct look, theme, or emotional arc. While performing in-character as this persona, gain +10 to Perform, Charm, or Persuade. You may only benefit from one active Persona at a time. This talent may be taken again to maintain an additional Persona.",
				prerequisite: "emotional_contagion",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: ""
			},	
			shared_spotlight: {
				name_key: "career_icon_shared_spotlight-u",
				rule_text_key: "career_icon_shared_spotlight_rules-u",			
				name: "Shared Spotlight",
				description: "Once per session, spend 2 Strain to deliver a closing performance or rallying speech at the end of a scene. All allies who witnessed it may recover an additional 1d4 Strain during their next short rest.",
				prerequisite: "pulse_of_the_crowd",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: "session"
			},				
			voice_of_the_moment: {
				name_key: "career_icon_voice_of_the_moment-u",
				rule_text_key: "career_icon_voice_of_the_moment_rules-u",			
				name: "Voice of the Moment",
				description: "Once per session, during a high-stakes moment (negotiation, crisis, or rally), spend 2 Strain to grant +10 to all allies’ next social roll this scene.",
				prerequisite: "crowd_momentum",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: "session"
			},		
			all_eyes_on_me: {
				name_key: "career_icon_all_eyes_on_me-u",
				rule_text_key: "career_icon_all_eyes_on_me_rules-u",
				name: "All Eyes on Me",
				description: "Once per scene, spend 3 Strain to seize the emotional spotlight. All NPCs within Medium range who can hear or see you must roll POW. On a failure, they are compelled to direct their next verbal or physical action toward you if applicable, or suffer the Impaired condition for one round. NPCs already engaged in hostile combat may resist with Advantage.",
				prerequisite: "voice_of_the_moment",
				tier: 4,
				cost: "20",
				capstone: false,
				usage_limit: "scene"
			},	
			burning_signature: {
				name_key: "career_icon_burning_signature-u",
				rule_text_key: "career_icon_burning_signature_rules-u",			
				name: "Burning Signature",
				description: "Once per session, you gain +20% to all social skill rolls made to manipulate, persuade, or mislead a character who has encountered you before. This effect lasts for the remainder of the scene.",
				prerequisite: "resonant_persona",
				tier: 4,
				cost: "20",
				capstone: false,
				usage_limit: "session"
			},
			cultural_gravity: {
				name_key: "career_icon_cultural_gravity-u",
				rule_text_key: "career_icon_cultural_gravity_rules-u",			
				name: "Cultural Gravity",
				description: "Gain +20 to downtime performance rolls to earn credits, build audiences, or influence venues. Applies to DreamFeed contracts, underground showcases, or professional bookings.",
				prerequisite: "resonant_persona",
				tier: 4,
				cost: "20",
				capstone: false,
				usage_limit: ""
			},
			encore_of_will: {
				name_key: "career_icon_encore_of_will-u",
				rule_text_key: "career_icon_encore_of_will_rules-u",			
				name: "Encore of Will",
				description: "Once per session, spend 2 Strain to remove the Panicked and Suppressed condition from all allies within Medium range who can see or hear you.",
				prerequisite: "voice_of_the_moment",
				tier: 4,
				cost: "20",
				capstone: false,
				usage_limit: "session"
			},
			iconic_rally: {
				name_key: "career_icon_iconic_rally-u",
				rule_text_key: "career_icon_iconic_rally_rules-u",			
				name: "Iconic Rally",
				description: "Once per session, spend 2 Strain to grant all allies within Medium range who can hear or see you an instant recovery of 1d4 Strain.",
				prerequisite: "shared_spotlight",
				tier: 4,
				cost: "20",
				capstone: false,
				usage_limit: "session"
			},
			crowdcarver: {
				name_key: "career_icon_crowdcarver-u",
				rule_text_key: "career_icon_crowdcarver_rules-u",			
				name: "Crowdcarver",
				description: "Once per session, you may declare an emotional tone (e.g., fear, reverence, defiance, serenity) during a scene involving a group. That group adopts the emotional atmosphere for the remainder of the scene unless hostile individuals succeed a POW roll. This doesn’t compel behavior, but alters how the group reacts to persuasion, fear, and influence.",
				prerequisite: "encore_of_will",
				tier: 5,
				cost: "30",
				capstone: true,
				usage_limit: "session"
			},
			echo_beyond_the_feed: {
				name_key: "career_icon_echo_beyond_the_feed-u",
				rule_text_key: "career_icon_echo_beyond_the_feed_rules-u",			
				name: "Echo Beyond the Feed",
				description: "Once per session, after a scene in which you performed or left a strong impression, you may invoke that memory to automatically succeed on a Charm, Persuade, or Deception roll against someone who witnessed it (live or via feed).",
				prerequisite: "burning_signature",
				tier: 5,
				cost: "30",
				capstone: true,
				usage_limit: "session"
			},
			living_legend: {
				name_key: "career_icon_living_legend-u",
				rule_text_key: "career_icon_living_legend_rules-u",			
				name: "Living Legend",
				description: "While in your active stage persona, anyone familiar with your niche (e.g., revolutionary speech, underground DreamFeeds, emotion-pop performance) has a 50% chance to recognize your name, voice, or work. Gain a bonus die to Influence, Perform, or Persuade when interacting with such individuals.",
				prerequisite: "burning_signature",
				tier: 5,
				cost: "30",
				capstone: true,
				usage_limit: ""
			},	
			signature_crescendo: {
				name_key: "career_icon_signature_crescendo-u",
				rule_text_key: "career_icon_signature_crescendo_rules-u",			
				name: "Signature Crescendo",
				description: "Once per session, spend 3 Strain to transform a Perform or Persuade roll into a defining moment. If the roll succeeds, all targets influenced by it become more receptive: you gain +10 to all further social rolls with them for the rest of the session. The moment becomes a lasting emotional impression in their memory.",
				prerequisite: "iconic_rally",
				tier: 5,
				cost: "30",
				capstone: true,
				usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_icon_stat_boost-u",
				rule_text_key: "career_icon_stat_boost_rules-u",			
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. This bonus is permanent. May only be taken once.",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
				usage_limit: ""
			}
		}
	},
	marksman: {
		name: "Marksman",
		career_type: "core",
		career_type_name: "Core",
		skill_points_primary_formula: {
			attributes: ["EDU", "DEX"],
			multipliers: [2, 2]
		},
		skill_points_primary_display: "EDU × 2 + DEX × 2",
		skill_points_secondary: 20,
		spell_xp_primary: 0,
		spell_xp_secondary: 0,
		primary_skills: {
			athletics:        "Athletics",
			perception:       "Perception",
			firearms_rifle:   "Rifles/Shotguns",
			stealth:          "Stealth"
		},
		secondary_skills: {
			computer_use:       "Computer Use",
			drone_operations:   "Drone Operations",
			insight:            "Insight",
			navigate:           "Navigate",
			firearms_handgun:   "Pistols",
			survival_urban:     "Survival (Urban)",
			survival_wilderness:"Survival (Wilderness)"
		},
		exclusive_skill_sets: [
			["survival_urban", "survival_wilderness"]
		],
		talents: {
			braced_position: {
				name_key: "career_marksman_braced_position-u",
				rule_text_key: "career_marksman_braced_position_rules-u",			
				name: "Braced Position",
				description: "Become Braced as a Maneuver. While Braced, Single Shot rifle attacks are +10%. Moving breaks Braced. Does not stack with Steady Breath; use the higher flat bonus.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false
			},
			cold_bore: {
				name_key: "career_marksman_cold_bore-u",
				rule_text_key: "career_marksman_cold_bore_rules-u",			
				name: "Cold-Bore",
				description: "Once per scene, your first rifle attack of the scene that follows Quick Aim or Focused Aim gains +1 damage on a hit.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			sidearm_bailout: {
				name_key: "career_marksman_sidearm_bailout-u",
				rule_text_key: "career_marksman_sidearm_bailout_rules-u",			
				name: "Sidearm Bailout",
				description: "Once per scene, as a Reaction when an enemy enters or begins Engaged with you, immediately draw and fire one pistol attack with 1 penalty die. No Aim benefits. Overrides normal draw timing.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			spotters_mark: {
				name_key: "career_marksman_spotters_mark-u",
				rule_text_key: "career_marksman_spotters_mark_rules-u",			
				name: "Spotter’s Mark",
				description: "Once per scene, make a Perception roll to designate a visible target at Medium+ range. On success, you and allies gain +10% to hit that target with ranged attacks until the start of your next turn.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			steady_breath: {
				name_key: "career_marksman_steady_breath-u",
				rule_text_key: "career_marksman_steady_breath_rules-u",			
				name: "Steady Breath",
				description: "Once per scene, after using Quick Aim, your next rifle attack that benefits from any Aim gains +10%. If it benefits from Focused Aim, this stacks for +20% total (and you still gain Focused Aim’s bonus die). Does not stack with Braced Position; use the higher flat bonus.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			counter_sniper_drill: {
				name_key: "career_marksman_counter_sniper_drill-u",
				rule_text_key: "career_marksman_counter_sniper_drill_rules-u",			
				name: "Counter-Sniper Drill",
				description: "Once per scene, as a Reaction when targeted from Long or Extreme range, make a Perception vs. the attacker's Stealth. On success, you pinpoint their position and gain +10% to your first attack against them before your next turn ends.",
				prerequisite: "spotters_mark",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: "scene"
			},
			kill_chain: {
				name_key: "career_marksman_kill_chain-u",
				rule_text_key: "career_marksman_kill_chain_rules-u",			
				name: "Kill Chain",
				description: "Once per scene, after you hit with a rifle attack that followed Focused Aim, make one additional Single Shot at a different target within Short of the original target's position at –10%. This additional shot does not benefit from Focused Aim and cannot impale regardless of success level. Overrides Single Shot's once/turn limit.",
				prerequisite: "steady_breath",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: "scene"
			},
			recon_uplink: {
				name_key: "career_marksman_recon_uplink-u",
				rule_text_key: "career_marksman_recon_uplink_rules-u",			
				name: "Recon Uplink",
				description: "Once per scene, with a scout drone active, make a Drone Operations roll; on success, apply Spotter's Mark to a target your drone sees at Long range.",
				prerequisite: "spotters_mark",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: "scene"
			},
			relocation_drill: {
				name_key: "career_marksman_relocation_drill-u",
				rule_text_key: "career_marksman_relocation_drill_rules-u",			
				name: "Relocation Drill",
				description: "Immediately after your Focused Aim rifle attack resolves, take a free Move Maneuver to shift one range band. This does not grant hiding, does not ignore Disengage, and cannot be used while Engaged (you must disengage normally).",
				prerequisite: "braced_position",
				tier: 2,
				cost: "10",
				capstone: false
			},
			windcall: {
				name_key: "career_marksman_windcall-u",
				rule_text_key: "career_marksman_windcall_rules-u",			
				name: "Windcall",
				description: "Once per scene, declare before a Focused Aim shot: for that attack, either remove the penalty die imposed by partial cover, or treat the target as one range band closer for penalties (not beyond the weapon's maximum band).",
				prerequisite: "steady_breath",
				tier: 2,
				cost: "10",
				capstone: false,
				usage_limit: "scene"
			},
			ghillie_mastery: {
				name_key: "career_marksman_ghillie_mastery-u",
				rule_text_key: "career_marksman_ghillie_mastery_rules-u",			
				name: "Ghillie Mastery",
				description: "While stationary and not firing, attempts to locate you at Medium+ range suffer 1 penalty die. Gain +10% to Stealth checks to remain unseen during observation/relocation before you shoot.",
				prerequisite: "relocation_drill",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: ""
			},
			glint_trap: {
				name_key: "career_marksman_glint_trap-u",
				rule_text_key: "career_marksman_glint_trap_rules-u",
			
				name: "Glint Trap",
				description: "Once per scene, as a reaction when a Long/Extreme-range shooter misses you, impose 1 penalty die on their next attack against you this scene.",
				prerequisite: "counter_sniper_drill",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: "scene"
			},
			lockdown_shot: {
				name_key: "career_marksman_lockdown_shot-u",
				rule_text_key: "career_marksman_lockdown_shot_rules-u",			
				name: "Lockdown Shot",
				description: "Once per scene, declare before rolling: on a hit with a Single Shot rifle, trade –1d6 damage to inflict Hobbled (movement halved) until the start of the target’s next turn.",
				prerequisite: "kill_chain",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: "scene"
			},
			quiet_reload: {
				name_key: "career_marksman_quiet_reload-u",
				rule_text_key: "career_marksman_quiet_reload_rules-u",			
				name: "Quiet Reload",
				description: "Once per scene, if you are Hidden or Braced, reload a rifle as a Free Action instead of a Maneuver.",
				prerequisite: "recon_uplink",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: "scene"
			},
			through_and_through: {
				name_key: "career_marksman_through_and_through-u",
				rule_text_key: "career_marksman_through_and_through_rules-u",			
				name: "Through-and-Through",
				description: "Once per scene, when your rifle attack kills or incapacitates a target, you may spend 1d4 Strain to immediately make a second rifle attack at a different enemy within Short of the original target’s position at –10%. The follow-up inherits your current Aim state (including Focused Aim’s bonus die/+10%, if active) and gains AP 2. Overrides Single Shot’s once/turn limit.",
				prerequisite: "windcall",
				tier: 3,
				cost: "15",
				capstone: false,
				usage_limit: "scene"
			},
			aim_lock: {
				name_key: "career_marksman_aim_lock-u",
				rule_text_key: "career_marksman_aim_lock_rules-u",			
				name: "Aim Lock",
				description: "Once per scene, if you would lose Focused Aim due to a Dodge or minor forced movement, spend 2 Strain to maintain Focused Aim into your next turn. You still resolve the Dodge at –10% and cannot take other actions that round.",
				prerequisite: "quiet_reload",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			counter_sniper_protocol: {
				name_key: "career_marksman_counter_sniper_protocol-u",
				rule_text_key: "career_marksman_counter_sniper_protocol_rules-u",			
				name: "Counter-Sniper Protocol",
				description: "Once per session, when hit by an unseen shooter and you have any valid pin/fix (e.g., Counter-Sniper Drill, drone mark, ally callout), make an immediate Single Shot at –20% as a Reaction against their traced position.",
				prerequisite: "glint_trap",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			one_shot_doctrine: {
				name_key: "career_marksman_one_shot_doctrine-u",
				rule_text_key: "career_marksman_one_shot_doctrine_rules-u",			
				name: "One-Shot Doctrine",
				description: "Once per scene, when a Focused Aim rifle attack hits with a Hard Success or better, it bypasses all physical armor for damage resolution (treat Armor as 0).",
				prerequisite: "through_and_through",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			range_gate: {
				name_key: "career_marksman_range_gate-u",
				rule_text_key: "career_marksman_range_gate_rules-u",			
				name: "Range Gate",
				description: "Once per scene, declare before the attack: treat the target as one range band closer for penalties (cannot enable out-of-range shots).",
				prerequisite: "lockdown_shot",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			ricochet_geometry: {
				name_key: "career_marksman_ricochet_geometry-u",
				rule_text_key: "career_marksman_ricochet_geometry_rules-u",			
				name: "Ricochet Geometry",
				description: "Once per scene, requires Focused Aim. If a plausible hard surface/angle exists, target an enemy behind Full Cover (GM approval) via a banked shot. Make the attack at –10% and 1 penalty die; ignore cover entirely for this shot (no LOS block and no cover-derived penalties). Range modifiers still apply. On a fumble, the shot is lost and you’re revealed.",
				prerequisite: "ghillie_mastery",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			dead_line: {
				name_key: "career_marksman_dead_line-u",
				rule_text_key: "career_marksman_dead_line_rules-u",			
				name: "Dead Line",
				description: "Once per session, after an uninterrupted Focused Aim, choose two visible enemies within your front arc that are within one range band of each other (and at Medium or farther from you). Make one rifle attack at –10%; on a hit, both targets take normal weapon damage (roll once, apply to both). This attack cannot impale. Cover and range modifiers apply normally to the roll.",
				prerequisite: "ricochet_geometry",
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			impossible_shot: {
				name_key: "career_marksman_impossible_shot-u",
				rule_text_key: "career_marksman_impossible_shot_rules-u",			
				name: "Impossible Shot",
				description: "Once per session, after an uninterrupted Focused Aim, attempt a shot at a target up to two range bands beyond your weapon’s listed maximum (never beyond Extreme). Apply the normal range modifier for the target’s actual band, and apply one penalty die per band beyond your weapon’s maximum (Focused Aim’s bonus die cancels one penalty die, if present). On any hit, treat the attack as a critical (impale). On a fumble, your position is revealed.",
				prerequisite: "one_shot_doctrine",
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			kill_confirmed: {
				name_key: "career_marksman_kill_confirmed-u",
				rule_text_key: "career_marksman_kill_confirmed_rules-u",			
				name: "Kill Confirmed",
				description: "Once per session, after a Focused Aim rifle hit, upgrade it to a critical (impale). If it was already an Extreme/Critical result, instead add Armor Piercing 4 to that attack.",
				prerequisite: "one_shot_doctrine",
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			overwatch_architect: {
				name_key: "career_marksman_overwatch_architect-u",
				rule_text_key: "career_marksman_overwatch_architect_rules-u",			
				name: "Overwatch Architect",
				description: "Once per scene, while stationary, set Overwatch on your front arc out to your weapon’s range until your next turn. Any enemy that becomes visible in that arc must test POW for Suppression (capstone exception to the Focused Aim rule). As Reactions, you may make up to three interrupt rifle attacks against Suppressed targets that move, at 0% / –10% / –20% (pay 1 Strain per interrupt shot). You forgo all other Reactions while Overwatch is active.",
				prerequisite: "range_gate",
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "scene"
			},
			stat_boost: {
				name_key: "career_marksman_stat_boost-u",
				rule_text_key: "career_marksman_stat_boost_rules-u",			
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			}
		}
	},
	operator: {
	  name: "Operator",
	  career_type: "core",
	  career_type_name: "Core",
	  skill_points_primary_formula: {
	    attributes: ["EDU", "DEX"],
	    multipliers: [2, 2]
	  },
	  skill_points_primary_display: "EDU × 2 + DEX × 2",
	  skill_points_secondary: 20,
	  spell_xp_primary: 0,
	  spell_xp_secondary: 0,
	  primary_skills: {
	    coordination: "Coordination",
	    perception: "Perception",
	    firearms_handgun: "Pistols",
	    firearms_smg: "Submachine Guns (SMGs)"
	  },
	  secondary_skills: {
	    athletics: "Athletics",
	    dodge: "Dodge",
	    gunnery: "Gunnery",
	    insight: "Insight",
	    firearms_rifle: "Rifles/Shotguns",
	    stealth: "Stealth"
	  },
	  talents: {
		close_quarters_ready: {
				name_key: "career_operator_close_quarters_ready-u",
				rule_text_key: "career_operator_close_quarters_ready_rules-u",		
		  name: "Close Quarters Ready",
		  description: "Once per scene, you may reduce the penalty die for firing at Engaged range by one step when using a firearm that normally suffers penalties in close quarters.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		combat_stride: {
				name_key: "career_operator_combat_stride-u",
				rule_text_key: "career_operator_combat_stride_rules-u",		
		  name: "Combat Stride",
		  description: "Once per scene, after making a successful ranged attack, you may take a free maneuver. This movement does not trigger reactions.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		cover_discipline: {
				name_key: "career_operator_cover_discipline-u",
				rule_text_key: "career_operator_cover_discipline_rules-u",		
		  name: "Cover Discipline",
		  description: "When taking the Dodge action while in cover, gain a bonus die to the roll.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: ""
		},
		quickdraw: {
				name_key: "career_operator_quickdraw-u",
				rule_text_key: "career_operator_quickdraw_rules-u",		
		  name: "Quickdraw",
		  description: "Once per scene, you may draw and fire a Pistol or SMG as a single action. This may not be used if you are surprised.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		strain_buffer: {
				name_key: "career_operator_strain_buffer-u",
				rule_text_key: "career_operator_strain_buffer_rules-u",		
		  name: "Strain Buffer",
		  description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: ""
		},
		controlled_pair: {
				name_key: "career_operator_controlled_pair-u",
				rule_text_key: "career_operator_controlled_pair_rules-u",		
		  name: "Controlled Pair",
		  description: "Once per scene when firing in Semi-Auto mode, you may reduce the penalty die on your second shot by one step.",
		  prerequisite: "quickdraw",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		fire_and_fade: {
				name_key: "career_operator_fire_and_fade-u",
				rule_text_key: "career_operator_fire_and_fade_rules-u",		
		  name: "Fire and Fade",
		  description: "Once per scene, when using Combat Stride, you may choose to move one range band and automatically enter cover as part of that movement. This movement does not trigger reactions.",
		  prerequisite: "combat_stride",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		quick_reload: {
				name_key: "career_operator_quick_reload-u",
				rule_text_key: "career_operator_quick_reload_rules-u",		
		  name: "Quick Reload",
		  description: "Once per scene, you may reload a firearm as a free action instead of a maneuver.",
		  prerequisite: "quickdraw",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		rapid_clearance: {
				name_key: "career_operator_rapid_clearance-u",
				rule_text_key: "career_operator_rapid_clearance_rules-u",		
		  name: "Rapid Clearance",
		  description: "Once per scene, after making a successful ranged attack while not in engaged range, you may make a free Dodge roll. If successful, you may move one ranged band as a free action.",
		  prerequisite: "close_quarters_ready",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		suppression_discipline: {
				name_key: "career_operator_suppression_discipline-u",
				rule_text_key: "career_operator_suppression_discipline_rules-u",		
		  name: "Suppression Discipline",
		  description: "Once per session, when you fire a weapon in Full Auto, you may treat a miss as a hit for the purposes of triggering Suppression only. This does not deal damage.",
		  prerequisite: "cover_discipline",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		deadzone_entry: {
				name_key: "career_operator_deadzone_entry-u",
				rule_text_key: "career_operator_deadzone_entry_rules-u",		
		  name: "Deadzone Entry",
		  description: "Once per session, when moving into Engaged range, you may ignore Close Quarters penalties for your next Pistol or SMG attack. The shot must be taken immediately after entering.",
		  prerequisite: "rapid_clearance",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		endurance_conditioning: {
				name_key: "career_operator_endurance_conditioning-u",
				rule_text_key: "career_operator_endurance_conditioning_rules-u",		
		  name: "Endurance Conditioning",
		  description: "Gain +2 maximum HP. This bonus is permanent, reflecting hardened physical conditioning and years of tactical exposure.",
		  prerequisite: "",
		  prerequisiteAny: { tier: 2, count: 1 },
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: ""
		},
		hard_coded_reflexes: {
				name_key: "career_operator_hard_coded_reflexes-u",
				rule_text_key: "career_operator_hard_coded_reflexes_rules-u",		
		  name: "Hard-Coded Reflexes",
		  description: "Once per session, when your firearm malfunctions, you may attempt to clear it as a free action rather than an action. You must still succeed on the firearm skill roll to clear the jam.",
		  prerequisite: "quick_reload",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		saturation_fire: {
				name_key: "career_operator_saturation_fire-u",
				rule_text_key: "career_operator_saturation_fire_rules-u",		
		  name: "Saturation Fire",
		  description: "Once per session, when firing in Burst Fire or Full Auto, you may ignore 1 penalty die on the attack roll. This does not stack with other effects that reduce penalty dice.",
		  prerequisite: "suppression_discipline",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		sweep_and_reposition: {
				name_key: "career_operator_sweep_and_reposition-u",
				rule_text_key: "career_operator_sweep_and_reposition_rules-u",		
		  name: "Sweep and Reposition",
		  description: "Once per session, if you successfully down a target with a ranged attack, you may immediately move 1 range band and make a Burst Fire or Single Shot attack against a new target.",
		  prerequisite: "fire_and_fade",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		combat_presence: {
				name_key: "career_operator_combat_presence-u",
				rule_text_key: "career_operator_combat_presence_rules-u",		
		  name: "Combat Presence",
		  description: "While you are not Suppressed and not behind Full Cover, all allies in Short range gain +10% to Dodge and POW rolls against Suppression.",
		  prerequisite: "suppression_discipline",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: ""
		},
		grim_resolve: {
				name_key: "career_operator_grim_resolve-u",
				rule_text_key: "career_operator_grim_resolve_rules-u",		
		  name: "Grim Resolve",
		  description: "Once per session, you may ignore a Malfunction result or suppressive effect. This talent may be used after the result is rolled.",
		  prerequisite: "endurance_conditioning",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		kinetic_retaliation: {
				name_key: "career_operator_kinetic_retaliation-u",
				rule_text_key: "career_operator_kinetic_retaliation_rules-u",		
		  name: "Kinetic Retaliation",
		  description: "Once per session, when struck by a ranged attack while in Partial Cover, you may make a Pistol or SMG attack as a reaction before applying damage. If it hits, reduce the damage you take by 2 (minimum 1).",
		  prerequisite: "sweep_and_reposition",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		lockstep_execution: {
				name_key: "career_operator_lockstep_execution-u",
				rule_text_key: "career_operator_lockstep_execution_rules-u",		
		  name: "Lockstep Execution",
		  description: "Once per session, if you and an ally both target the same enemy during a round, your next attack against that target gains a bonus die. If it hits, your ally may immediately reposition 1 range band as a free maneuver.",
		  prerequisite: "fire_and_fade",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		precision_reacquired: {
				name_key: "career_operator_precision_reacquired-u",
				rule_text_key: "career_operator_precision_reacquired_rules-u",		
		  name: "Precision Reacquired",
		  description: "Once per session, after making a failed ranged attack, you may immediately spend 2 Strain to reroll it. If you succeed, add +1 damage.",
		  prerequisite: "hard_coded_reflexes",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		tactical_apex: {
				name_key: "career_operator_tactical_apex-u",
				rule_text_key: "career_operator_tactical_apex_rules-u",		
		  name: "Tactical Apex",
		  description: "Once per session, when attacking with a Burst Fire weapon, you may treat all dice penalties as 0. If the attack succeeds, deal +1 damage.",
		  prerequisite: "saturation_fire",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		shatterpoint_protocol: {
				name_key: "career_operator_shatterpoint_protocol-u",
				rule_text_key: "career_operator_shatterpoint_protocol_rules-u",		
		  name: "Shatterpoint Protocol",
		  description: "Once per session, after successfully hitting with a Semi-Auto or Burst Fire attack, you may spend 3 Strain to roll a second damage roll and choose either result. This attack also ignores 1 point of armor.",
		  prerequisite: ["precision_reacquired", "combat_presence"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		tactical_lock_in: {
				name_key: "career_operator_tactical_lock_in-u",
				rule_text_key: "career_operator_tactical_lock_in_rules-u",		
		  name: "Tactical Lock-In",
		  description: "Once per session, after hitting a target with a ranged attack, you may declare Tactical Lock-In. For the next two rounds, you gain a bonus die on your next attack against that target each round. During this time, that target suffers a penalty die on all attacks made against you.",
		  prerequisite: ["kinetic_retaliation", "combat_presence"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		zeroed_vector_killbox: {
				name_key: "career_operator_zeroed_vector_killbox-u",
				rule_text_key: "career_operator_zeroed_vector_killbox_rules-u",		
		  name: "Zeroed Vector Killbox",
		  description: "Once per session, declare a Killbox against one enemy within Medium range. Until the end of the round, you and all allies gain +1 die when targeting this enemy with ranged attacks. If you strike first, deal +2 bonus damage.",
		  prerequisite: ["tactical_apex", "lockstep_execution"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
				name_key: "career_operator_stat_boost-u",
				rule_text_key: "career_operator_stat_boost_rules-u",		
		  name: "+5% Stat Boost",
		  description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: ""
		}
	  }
	},
	pathfinder: {
	},
	pilot: {
	  name: "Pilot",
	  career_type: "core",
	  career_type_name: "Core",
	  skill_points_primary_formula: {
	    attributes: ["EDU", "DEX"],
	    multipliers: [2, 2]
	  },
	  skill_points_primary_display: "EDU × 2 + DEX × 2",
	  skill_points_secondary: 20,
	  spell_xp_primary: 0,
	  spell_xp_secondary: 0,
	  primary_skills: {
	    coordination:     "Coordination",
	    drone_operation:  "Drone Operation",
	    electronics:      "Electronics",
	    pilotaircraft:    "Pilot (Aircraft)",
		pilotarc:		  "Pilot (ARC)"
	  },
	  secondary_skills: {
	    athletics:        "Athletics",
	    engineering:      "Science (Engineering)",
	    insight:          "Insight",
	    mechanics:        "Mechanics",
	    perception:       "Perception",
	    firearms_handgun: "Pistols"
	  },
	  talents: {
		combat_rigging: {
				name_key: "career_pilot_combat_rigging-u",
				rule_text_key: "career_pilot_combat_rigging_rules-u",		
		  name: "Combat Rigging",
		  description: "Once per scene, when deploying a drone with combat capabilities, it may immediately take one simple action (such as move, aim, or fire a single weapon) as part of the deployment.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		remote_override: {
				name_key: "career_pilot_remote_override-u",
				rule_text_key: "career_pilot_remote_override_rules-u",		
		  name: "Remote Override",
		  description: "Once per scene, spend 1 Strain to issue an immediate free command to a drone or linked vehicle. The command may be movement, interaction, or activating a system.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		strain_buffer: {
				name_key: "career_pilot_strain_buffer-u",
				rule_text_key: "career_pilot_strain_buffer_rules-u",		
		  name: "Strain Buffer",
		  description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: ""
		},
		tactical_uplink: {
				name_key: "career_pilot_tactical_uplink-u",
				rule_text_key: "career_pilot_tactical_uplink_rules-u",		
		  name: "Tactical Uplink",
		  description: "Once per scene, after a successful Perception or Drone Operation roll to spot a threat, choose one ally. Their next attack against that target gains a bonus die (must be same round).",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		throttle_reflex: {
				name_key: "career_pilot_throttle_reflex-u",
				rule_text_key: "career_pilot_throttle_reflex_rules-u",		
		  name: "Throttle Reflex",
		  description: "Once per scene, gain a bonus die on a Piloting or Drone Operation roll made to evade danger, escape pursuit, or navigate a hazard. Can also apply when retreating under fire.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		jet_wash_drift: {
				name_key: "career_pilot_jet_wash_drift-u",
				rule_text_key: "career_pilot_jet_wash_drift_rules-u",		
		  name: "Jet Wash Drift",
		  description: "Once per scene, after a successful Piloting roll to evade or maneuver, force one nearby vehicle, drone, or enemy within Short range to suffer a penalty die on their next Gunnery or Ranged Weapon attack.",
		  prerequisite: "throttle_reflex",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		overdrive_calibration: {
				name_key: "career_pilot_overdrive_calibration-u",
				rule_text_key: "career_pilot_overdrive_calibration_rules-u",		
		  name: "Overdrive Calibration",
		  description: "Once per session, you may increase the Speed Rating of a vehicle you are piloting or linked to by +1 for one Pursuit or Evasion round. This bonus applies after the Pursuit roll is made.",
		  prerequisite: "strain_buffer",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		priority_channel: {
				name_key: "career_pilot_priority_channel-u",
				rule_text_key: "career_pilot_priority_channel_rules-u",		
		  name: "Priority Channel",
		  description: "Once per scene, when another character fails a Perception, Piloting, or Drone Operation check, you may spend 1 Strain to let them reroll with a bonus die, simulating live uplink support.",
		  prerequisite: "remote_override",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		rigsight_linkage: {
				name_key: "career_pilot_rigsight_linkage-u",
				rule_text_key: "career_pilot_rigsight_linkage_rules-u",		
		  name: "Rigsight Linkage",
		  description: "While piloting or drone-rigged, you no longer suffer penalty dice when firing your own handheld ranged weapons. Once per session, gain a bonus die on such an attack made while actively rigged.",
		  prerequisite: "combat_rigging",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		suppressive_vectoring: {
				name_key: "career_pilot_suppressive_vectoring-u",
				rule_text_key: "career_pilot_suppressive_vectoring_rules-u",		
		  name: "Suppressive Vectoring",
		  description: "Once per scene, after your drone misses an attack, you may spend 1 Strain to impose a penalty die on the target’s next action. This reflects erratic movement or suppressive fire control.",
		  prerequisite: "tactical_uplink",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		aerial_pivot_shot: {
				name_key: "career_pilot_aerial_pivot_shot-u",
				rule_text_key: "career_pilot_aerial_pivot_shot_rules-u",		
		  name: "Aerial Pivot Shot",
		  description: "Once per session, while piloting or drone-rigged, you may fire a handheld ranged weapon as a free action during vehicle movement or repositioning. This ignores penalty dice for unstable footing or active motion.",
		  prerequisite: "rigsight_linkage",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		deadzone_reflex: {
				name_key: "career_pilot_deadzone_reflex-u",
				rule_text_key: "career_pilot_deadzone_reflex_rules-u",		
		  name: "Deadzone Reflex",
		  description: "Once per session, after rolling Initiative in a vehicle-based combat or pursuit, you may move the vehicle 1 range band as a free maneuver before anyone acts. Represents mapped egress routes and reflexive precision.",
		  prerequisite: "jet_wash_drift",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		drone_lock_protocol: {
				name_key: "career_pilot_drone_lock_protocol-u",
				rule_text_key: "career_pilot_drone_lock_protocol_rules-u",		
		  name: "Drone Lock Protocol",
		  description: "Once per session, after a successful drone attack, you may spend 2 Strain to initiate a Lock-On to that target. Your drone gains a bonus die on all further attacks against that target. You must spend 2 Strain each round to maintain the lock.",
		  prerequisite: "suppressive_vectoring",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		overclock_sync_node: {
				name_key: "career_pilot_overclock_sync_node-u",
				rule_text_key: "career_pilot_overclock_sync_node_rules-u",		
		  name: "Overclock Sync Node",
		  description: "Once per session, after a drone or piloted vehicle fails a roll, you may immediately reroll that check with a bonus die, reflecting a spike in signal clarity or emergency AI correction.",
		  prerequisite: "priority_channel",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		thruster_kickout: {
				name_key: "career_pilot_thruster_kickout-u",
				rule_text_key: "career_pilot_thruster_kickout_rules-u",		
		  name: "Thruster Kickout",
		  description: "Once per session, when your vehicle is hit by an attack, you may spend 2 Strain to take half damage (rounded up) and immediately move 1 range band as a reaction. You must declare this before damage is rolled.",
		  prerequisite: "overdrive_calibration",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		combat_integration_mesh: {
				name_key: "career_pilot_combat_integration_mesh-u",
				rule_text_key: "career_pilot_combat_integration_mesh_rules-u",		
		  name: "Combat Integration Mesh",
		  description: "Once per session, when you hit a target while piloting a vehicle or rigged into a drone, you may choose a separate drone you control to take a free action immediately afterward. This action may be movement, attack, or utility.",
		  prerequisite: "aerial_pivot_shot",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		drop_vector_override: {
				name_key: "career_pilot_drop_vector_override-u",
				rule_text_key: "career_pilot_drop_vector_override_rules-u",		
		  name: "Drop Vector Override",
		  description: "Once per session, when making a rapid or evasive landing approach, all actions targeting your aircraft, drone, or anyone onboard suffer a penalty die until the start of your next turn. No vehicle control penalties apply during this descent.",
		  prerequisite: "deadzone_reflex",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		endurance_conditioning: {
				name_key: "career_pilot_endurance_conditioning-u",
				rule_text_key: "career_pilot_endurance_conditioning_rules-u",		
		  name: "Endurance Conditioning",
		  description: "Gain +2 maximum HP. This bonus is permanent, representing your enhanced tolerance for high-G maneuvers, Veilstorm turbulence, and neural feedback strain.",
		  prerequisite: "thruster_kickout",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: ""
		},
		tethered_assault_ai: {
				name_key: "career_pilot_tethered_assault_ai-u",
				rule_text_key: "career_pilot_tethered_assault_ai_rules-u",		
		  name: "Tethered Assault AI",
		  description: "Once per session, you may activate a tethered combat subroutine in one drone. For the rest of the scene, it may act independently once per round without a command, using its basic attack or movement.",
		  prerequisite: "drone_lock_protocol",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		trace_disruptor_grid: {
				name_key: "career_pilot_trace_disruptor_grid-u",
				rule_text_key: "career_pilot_trace_disruptor_grid_rules-u",		
		  name: "Trace Disruptor Grid",
		  description: "Once per session, when targeted by a Slicing attempt or vehicle lock-on, you may spend 1 Strain to impose a penalty die on the attacker’s roll and mask your vehicle or drone’s signature for one round.",
		  prerequisite: "overclock_sync_node",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		airspace_denial_vector: {
				name_key: "career_pilot_airspace_denial_vector-u",
				rule_text_key: "career_pilot_airspace_denial_vector_rules-u",		
		  name: "Airspace Denial Vector",
		  description: "Once per session, after winning Initiative while piloting, you may designate an aerial zone (Short range around your craft or drone). Until your next turn, enemies that enter or act in this zone suffer a penalty die on all actions.",
		  prerequisite: "drop_vector_override",
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		burn_vector_gambit: {
				name_key: "career_pilot_burn_vector_gambit-u",
				rule_text_key: "career_pilot_burn_vector_gambit_rules-u",		
		  name: "Burn Vector Gambit",
		  description: "Once per session, after a drone or vehicle you control completes its turn, you may spend 2 Strain to immediately reposition it anywhere within Short range and make a free attack or system action. This move ignores overwatch, elevation, and terrain penalties.",
		  prerequisite: ["drop_vector_override", "combat_integration_mesh"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		swarm_logic_override: {
				name_key: "career_pilot_swarm_logic_override-u",
				rule_text_key: "career_pilot_swarm_logic_override_rules-u",		
		  name: "Swarm Logic Override",
		  description: "Once per session, you may issue a single command that is simultaneously obeyed by all drones you control within Medium range. Each drone may take one simple action (move, basic attack, or utility) in any order.",
		  prerequisite: ["tethered_assault_ai", "combat_integration_mesh"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
				name_key: "career_pilot_stat_boost-u",
				rule_text_key: "career_pilot_stat_boost_rules-u",		
		  name: "+5% Stat Boost",
		  description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: ""
		}
	  }
	},
	shadowblade: {
	  name: "Shadowblade",
	  career_type: "core",
	  career_type_name: "Core",
	  skill_points_primary_formula: {
	    attributes: ["EDU", "DEX"],
	    multipliers: [2, 2]
	  },
	  skill_points_primary_display: "EDU × 2 + DEX × 2",
	  skill_points_secondary: 20,
	  spell_xp_primary: 0,
	  spell_xp_secondary: 0,
	  primary_skills: {
	    athletics: "Athletics",
	    dodge: "Dodge",
	    melee_weapons: "Melee Weapons",
	    stealth: "Stealth"
	  },
	  secondary_skills: {
	    deception: "Deception",
	    insight: "Insight",
	    mechanics: "Mechanics",
	    perception: "Perception",
	    survival_urban: "Survival (Urban)",
	    throw: "Thrown Weapons"
	  },
	  talents: {
		cut_and_vanish: {
				name_key: "career_shadowblade_cut_and_vanish-u",
				rule_text_key: "career_shadowblade_cut_and_vanish_rules-u",		
		  name: "Cut and Vanish",
		  description: "Once per scene, after landing a successful melee attack, you may Disengage as a Free Action.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		ghost_opener: {
				name_key: "career_shadowblade_ghost_opener-u",
				rule_text_key: "career_shadowblade_ghost_opener_rules-u",		
		  name: "Ghost Opener",
		  description: "Once per scene, when attacking from Stealth or before the target has acted this round, gain a bonus die to your melee or thrown weapon attack.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		knifes_memory: {
				name_key: "career_shadowblade_knifes_memory-u",
				rule_text_key: "career_shadowblade_knifes_memory_rules-u",		
		  name: "Knife’s Memory",
		  description: "You may draw a melee or thrown weapon as a Free Action once per round. Also gain a bonus die to Initiative rolls in the first round when armed with a light melee or thrown weapon.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: ""
		},
		one_among_many: {
				name_key: "career_shadowblade_one_among_many-u",
				rule_text_key: "career_shadowblade_one_among_many_rules-u",		
		  name: "One Among Many",
		  description: "Gain a bonus die to Stealth rolls when navigating crowds or dense terrain.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: ""
		},
		pressure_point: {
				name_key: "career_shadowblade_pressure_point-u",
				rule_text_key: "career_shadowblade_pressure_point_rules-u",		
		  name: "Pressure Point",
		  description: "Once per scene, when you land a melee or thrown attack with a Hard Success or better, the target suffers a penalty die on all physical actions until the end of their next turn.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		strong_arm_form: {
				name_key: "career_shadowblade_strong_arm_form-u",
				rule_text_key: "career_shadowblade_strong_arm_form_rules-u",		
		  name: "Strong Arm Form",
		  description: "Ignore the penalty die for thrown weapon attacks at Medium range.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: ""
		},
		cloak_in_motion: {
				name_key: "career_shadowblade_cloak_in_motion-u",
				rule_text_key: "career_shadowblade_cloak_in_motion_rules-u",		
		  name: "Cloak in Motion",
		  description: "You gain a bonus die on Stealth rolls while moving, as long as you take no Action that round other than movement or positioning.",
		  prerequisite: "one_among_many",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: ""
		},
		knife_logic: {
				name_key: "career_shadowblade_knife_logic-u",
				rule_text_key: "career_shadowblade_knife_logic_rules-u",		
		  name: "Knife Logic",
		  description: "You gain +10 to all attacks made with thrown weapons against unaware or distracted targets. This bonus increases to +20 if the target has not acted yet this round.",
		  prerequisite: ["knifes_memory", "strong_arm_form"],
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: ""
		},
		precision_hemorrhage: {
				name_key: "career_shadowblade_precision_hemorrhage-u",
				rule_text_key: "career_shadowblade_precision_hemorrhage_rules-u",		
		  name: "Precision Hemorrhage",
		  description: "Once per combat, if you land a melee hit with a Hard Success or better, the target begins bleeding (1 damage per round). Bleed lasts 3 rounds or until First Aid is applied.",
		  prerequisite: "pressure_point",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		sightless_kill: {
				name_key: "career_shadowblade_sightless_kill-u",
				rule_text_key: "career_shadowblade_sightless_kill_rules-u",		
		  name: "Sightless Kill",
		  description: "Attacks made in low visibility (darkness, heavy fog, smoke, or magical concealment) grant a bonus die if the target cannot clearly perceive you (e.g., they lack night vision, thermal optics, or similar countermeasures). If the target is unaware, your first attack against them each scene deals +1 damage.",
		  prerequisite: ["pressure_point", "ghost_opener"],
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: ""
		},
		throw_move_strike: {
				name_key: "career_shadowblade_throw_move_strike-u",
				rule_text_key: "career_shadowblade_throw_move_strike_rules-u",		
		  name: "Throw, Move, Strike",
		  description: "Once per combat, you may make a thrown weapon attack and immediately move 1 range band toward the target as a Free Action. If you end your turn in Engaged range, you may draw a weapon freely.",
		  prerequisite: "strong_arm_form",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		vanish_step: {
				name_key: "career_shadowblade_vanish_step-u",
				rule_text_key: "career_shadowblade_vanish_step_rules-u",		
		  name: "Vanish Step",
		  description: "Once per scene, after using Cut and Vanish, you may immediately make a Stealth roll. If successful, you enter Stealth despite being in combat, provided you end behind cover or in darkness.",
		  prerequisite: "cut_and_vanish",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		cloaked_predator: {
				name_key: "career_shadowblade_cloaked_predator-u",
				rule_text_key: "career_shadowblade_cloaked_predator_rules-u",		
		  name: "Cloaked Predator",
		  description: "While under the effect of Cloak in Motion or Stealth, gain a +10 bonus to Melee or Thrown attacks made against targets in unaware or distracted states.",
		  prerequisite: "cloak_in_motion",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: ""
		},
		crimson_rhythm: {
				name_key: "career_shadowblade_crimson_rhythm-u",
				rule_text_key: "career_shadowblade_crimson_rhythm_rules-u",		
		  name: "Crimson Rhythm",
		  description: "Targets suffering from Bleed effects caused by your attacks suffer -10 to all physical actions. If they take 2 or more damage in a round, the bleed damage increases to 2 per round next turn.",
		  prerequisite: "precision_hemorrhage",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: ""
		},
		draw_and_cut: {
				name_key: "career_shadowblade_draw_and_cut-u",
				rule_text_key: "career_shadowblade_draw_and_cut_rules-u",		
		  name: "Draw and Cut",
		  description: "After using Throw, Move, Strike, your next melee attack this round gains +10 and ignores penalty dice from partial cover or concealment.",
		  prerequisite: "throw_move_strike",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: ""
		},
		flashing_return: {
				name_key: "career_shadowblade_flashing_return-u",
				rule_text_key: "career_shadowblade_flashing_return_rules-u",		
		  name: "Flashing Return",
		  description: "Once per scene, after making a successful thrown weapon attack, you may immediately draw and throw a second weapon at a different target within range. The second attack is made with a penalty die.",
		  prerequisite: "knife_logic",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "scene"
		},
		momentum_slice: {
				name_key: "career_shadowblade_momentum_slice-u",
				rule_text_key: "career_shadowblade_momentum_slice_rules-u",		
		  name: "Momentum Slice",
		  description: "Once per round, if you move at least 1 range band before making a melee attack, gain +10 to the attack. If the attack hits, your next Maneuver or Reaction this round costs 1 less Strain to perform.",
		  prerequisite: ["cloak_in_motion", "throw_move_strike"],
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: ""
		},
		phantom_execution: {
				name_key: "career_shadowblade_phantom_execution-u",
				rule_text_key: "career_shadowblade_phantom_execution_rules-u",		
		  name: "Phantom Execution",
		  description: "Once per session, after performing Vanish Step, you may perform one melee or thrown weapon attack from Stealth without breaking Stealth. This attack gains a bonus die and +1 damage.",
		  prerequisite: "vanish_step",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		blade_linked_motion: {
				name_key: "career_shadowblade_blade_linked_motion-u",
				rule_text_key: "career_shadowblade_blade_linked_motion_rules-u",		
		  name: "Blade-Linked Motion",
		  description: "If you successfully kill a target with a melee or thrown weapon, you may immediately move 1 range band without spending a Maneuver. This movement does not provoke Reactions.",
		  prerequisite: "momentum_slice",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: ""
		},
		blurred_step: {
				name_key: "career_shadowblade_blurred_step-u",
				rule_text_key: "career_shadowblade_blurred_step_rules-u",		
		  name: "Blurred Step",
		  description: "Once per combat, when you are targeted by a ranged or melee attack and you have not yet acted this round, you may move 1 range band as a Free Action after the attack is resolved.",
		  prerequisite: ["cloak_in_motion", "momentum_slice"],
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "scene"
		},
		crimson_cascade: {
				name_key: "career_shadowblade_crimson_cascade-u",
				rule_text_key: "career_shadowblade_crimson_cascade_rules-u",		
		  name: "Crimson Cascade",
		  description: "Targets suffering from Bleed take +1 damage from all melee attacks you make. If they fall below 50% HP while bleeding, they lose their next Reaction.",
		  prerequisite: "crimson_rhythm",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: ""
		},
		phantom_reversal: {
				name_key: "career_shadowblade_phantom_reversal-u",
				rule_text_key: "career_shadowblade_phantom_reversal_rules-u",		
		  name: "Phantom Reversal",
		  description: "Once per combat, after successfully Dodging a melee attack, you may immediately make a melee attack as a free action against the attacker. If it hits, deal +1 damage.",
		  prerequisite: "momentum_slice",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "scene"
		},
		quiet_terror: {
				name_key: "career_shadowblade_quiet_terror-u",
				rule_text_key: "career_shadowblade_quiet_terror_rules-u",		
		  name: "Quiet Terror",
		  description: "Once per combat, if you kill an enemy from Stealth, all enemies within Short range must make a Willpower roll or suffer -10 to all actions against you until the end of their next turn.",
		  prerequisite: "phantom_execution",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "scene"
		},
		spinal_cut: {
				name_key: "career_shadowblade_spinal_cut-u",
				rule_text_key: "career_shadowblade_spinal_cut_rules-u",		
		  name: "Spinal Cut",
		  description: "Once per scene, if you land a melee hit from Stealth and roll a Hard or better Success, the target loses their Reaction for the rest of the round.",
		  prerequisite: ["phantom_execution", "sightless_kill"],
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "scene"
		},
		final_knife: {
				name_key: "career_shadowblade_final_knife-u",
				rule_text_key: "career_shadowblade_final_knife_rules-u",		
		  name: "Final Knife",
		  description: "Once per session, you may make a thrown weapon attack against a target within Medium range as a Free Action, even if they are behind full cover. The weapon curves through the air unnaturally.",
		  prerequisite: ["knife_logic", "draw_and_cut"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		shatterpoint_strike: {
				name_key: "career_shadowblade_shatterpoint_strike-u",
				rule_text_key: "career_shadowblade_shatterpoint_strike_rules-u",		
		  name: "Shatterpoint Strike",
		  description: "Once per session, declare Shatterpoint before rolling. If the target is unaware or below 50% HP, your melee or thrown weapon attack ignores armor and deals maximum weapon damage on a successful hit.",
		  prerequisite: ["spinal_cut", "phantom_reversal"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		unerring_step: {
				name_key: "career_shadowblade_unerring_step-u",
				rule_text_key: "career_shadowblade_unerring_step_rules-u",		
		  name: "Unerring Step",
		  description: "Once per session, declare Unerring Step. For the next 2 rounds, you cannot suffer penalty dice to movement, Athletics, or Stealth rolls, and may Disengage as a Free Action once per round.",
		  prerequisite: ["blurred_step", "blade_linked_motion"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
				name_key: "career_shadowblade_stat_boost-u",
				rule_text_key: "career_shadowblade_stat_boost_rules-u",		
		  name: "+5% Stat Boost",
		  description: "Increase any one core stat — excluding Magic — by +5%, up to your racial maximum. May only be taken once.",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: ""
		}
	  }
	},
	slicer: {
	  name: "Slicer",
	  career_type: "core",
	  career_type_name: "Core",
	  skill_points_primary_formula: {
	    attributes: ["EDU", "INT"],
	    multipliers: [2, 2]
	  },
	  skill_points_primary_display: "EDU × 2 + INT × 2",
	  skill_points_secondary: 20,
	  spell_xp_primary: 0,
	  spell_xp_secondary: 0,
	  primary_skills: {
	    computer_use: "Computer Use",
	    electronics:  "Electronics",
	    security:     "Security Systems",
	    slicing:      "Slicing"
	  },
	  secondary_skills: {
	    dodge:           "Dodge",
	    mechanics:       "Mechanics",
	    perception:      "Perception",
	    persuade:        "Persuade",
	    firearms_handgun:"Pistols",
	    stealth:         "Stealth"
	  },
	  talents: {
		code_pressure: {
				name_key: "career_slicer_code_pressure-u",
				rule_text_key: "career_slicer_code_pressure_rules-u",		
		  name: "Code Pressure",
		  description: "Once per scene, gain a bonus die on a single Intrusion roll to breach a node or defeat ICE. On a Hard or better success, regain 1 Strain.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		fastjack_ready: {
				name_key: "career_slicer_fastjack_ready-u",
				rule_text_key: "career_slicer_fastjack_ready_rules-u",		
		  name: "Fastjack Ready",
		  description: "Once per scene, you may reduce the action cost of activating or swapping a program by one step (e.g., Action → Maneuver or Maneuver → Free Action).",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		packet_surge: {
				name_key: "career_slicer_packet_surge-u",
				rule_text_key: "career_slicer_packet_surge_rules-u",		
		  name: "Packet Surge",
		  description: "Once per session, when you gain a Trace Lock, you may immediately activate Packet Surge. Until the end of your next turn, gain a bonus die on your next Masking or Intrusion roll made against that system.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "session"
		},
		redundancy_stack: {
				name_key: "career_slicer_redundancy_stack-u",
				rule_text_key: "career_slicer_redundancy_stack_rules-u",		
		  name: "Redundancy Stack",
		  description: "Once per scene, when your OmniDeck takes digital damage, you may reduce it by 1 (to a minimum of 0) as an automatic response. This does not require a roll or reaction.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		signal_ghost: {
				name_key: "career_slicer_signal_ghost-u",
				rule_text_key: "career_slicer_signal_ghost_rules-u",		
		  name: "Signal Ghost",
		  description: "Once per session, when you would gain a Trace Lock, you may immediately roll Masking. On a success, the Trace Lock is negated.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "session"
		},
		system_sniffer: {
				name_key: "career_slicer_system_sniffer-u",
				rule_text_key: "career_slicer_system_sniffer_rules-u",		
		  name: "System Sniffer",
		  description: "Once per scene, gain a bonus die when scanning for hidden nodes, encrypted links, or ghost connections in any ArcNet system.",
		  prerequisite: "",
		  tier: 1,
		  cost: "5",
		  capstone: false,
		  usage_limit: "scene"
		},
		icebreaker_thread: {
				name_key: "career_slicer_icebreaker_thread-u",
				rule_text_key: "career_slicer_icebreaker_thread_rules-u",		
		  name: "ICEbreaker Thread",
		  description: "Gain a bonus die once per session when attacking or bypassing an ICE. If the ICE is disabled or bypassed completely, regain 1 Strain.",
		  prerequisite: "code_pressure",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		multi_layer_spoof: {
				name_key: "career_slicer_multi_layer_spoof-u",
				rule_text_key: "career_slicer_multi_layer_spoof_rules-u",		
		  name: "Multi-Layer Spoof",
		  description: "Once per session, gain a bonus die to a Masking roll made to avoid a Trace attempt or bypass a system with active surveillance or AI monitoring.",
		  prerequisite: "signal_ghost",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		null_pulse_routine: {
				name_key: "career_slicer_null_pulse_routine-u",
				rule_text_key: "career_slicer_null_pulse_routine_rules-u",		
		  name: "Null Pulse Routine",
		  description: "Once per session, trigger a targeted system surge that forces a Security Node or Data Node to shut down for 1 round. The node must be within line of sight.",
		  prerequisite: "system_sniffer",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		omnideck_recompiler: {
				name_key: "career_slicer_omnideck_recompiler-u",
				rule_text_key: "career_slicer_omnideck_recompiler_rules-u",		
		  name: "OmniDeck Recompiler",
		  description: "Once per session, you may instantly reload or replace one installed program without needing an action or maneuver.",
		  prerequisite: "fastjack_ready",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		rapid_inject: {
				name_key: "career_slicer_rapid_inject-u",
				rule_text_key: "career_slicer_rapid_inject_rules-u",		
		  name: "Rapid Inject",
		  description: "Once per session, you may activate any installed Program as a free action instead of an action.",
		  prerequisite: "fastjack_ready",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		reflex_proxy: {
				name_key: "career_slicer_reflex_proxy-u",
				rule_text_key: "career_slicer_reflex_proxy_rules-u",		
		  name: "Reflex Proxy",
		  description: "Once per scene, when you fail a FR (Firewall Rating) roll to defend against digital damage, you may spend 1 Strain to roll again. If successful, reduce the damage taken by half (rounded down).",
		  prerequisite: "redundancy_stack",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "scene"
		},
		trace_evasion_protocol: {
				name_key: "career_slicer_trace_evasion_protocol-u",
				rule_text_key: "career_slicer_trace_evasion_protocol_rules-u",		
		  name: "Trace Evasion Protocol",
		  description: "Once per session, when a Trace Lock is gained, you may immediately attempt to remove it as a free action. This does not count as your action for the round.",
		  prerequisite: "signal_ghost",
		  tier: 2,
		  cost: "10",
		  capstone: false,
		  usage_limit: "session"
		},
		command_fork: {
				name_key: "career_slicer_command_fork-u",
				rule_text_key: "career_slicer_command_fork_rules-u",		
		  name: "Command Fork",
		  description: "Once per session, when successfully seizing control of a node, you may activate one additional connected subsystem as a free action. For example, you might open a secured door and loop its associated camera feed simultaneously.",
		  prerequisite: "omnideck_recompiler",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		emergency_partition: {
				name_key: "career_slicer_emergency_partition-u",
				rule_text_key: "career_slicer_emergency_partition_rules-u",		
		  name: "Emergency Partition",
		  description: "Once per session, when your Deck Integrity is reduced to 0, you may spend 2 Strain to stay online for one more round. You crash after that unless repaired.",
		  prerequisite: "reflex_proxy",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		kill_switch_routine: {
				name_key: "career_slicer_kill_switch_routine-u",
				rule_text_key: "career_slicer_kill_switch_routine_rules-u",		
		  name: "Kill-Switch Routine",
		  description: "Once per session, declare a Kill-Switch. For the next 2 rounds, any time you crash a node or ICE, choose one: gain 1 Strain back, or deal 1d3 damage to another connected ICE.",
		  prerequisite: "icebreaker_thread",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		predictive_override: {
				name_key: "career_slicer_predictive_override-u",
				rule_text_key: "career_slicer_predictive_override_rules-u",		
		  name: "Predictive Override",
		  description: "When you get a Hard Success when scanning a node, you may also identify its connected ICE behavior type (aggressive, reactive, trace, or trap) without triggering it.",
		  prerequisite: "icebreaker_thread",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: ""
		},
		silent_loop: {
				name_key: "career_slicer_silent_loop-u",
				rule_text_key: "career_slicer_silent_loop_rules-u",		
		  name: "Silent Loop",
		  description: "Once per session, when slicing into a system, you may designate one node. Until the end of the scene, that node will not trigger passive ICE.",
		  prerequisite: "multi_layer_spoof",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		trace_spoofer: {
				name_key: "career_slicer_trace_spoofer-u",
				rule_text_key: "career_slicer_trace_spoofer_rules-u",		
		  name: "Trace Spoofer",
		  description: "Once per session, when the system gains a Trace Lock on you, you may spend 2 Strain to cancel it immediately. This may be used after the lock is applied.",
		  prerequisite: "trace_evasion_protocol",
		  tier: 3,
		  cost: "15",
		  capstone: false,
		  usage_limit: "session"
		},
		black_trace_nullifier: {
				name_key: "career_slicer_black_trace_nullifier-u",
				rule_text_key: "career_slicer_black_trace_nullifier_rules-u",		
		  name: "Black Trace Nullifier",
		  description: "Once per session, when you remove a Trace Lock via MR, you may remove an additional Trace Lock for free. This does not reduce the Strain cost or action economy.",
		  prerequisite: "trace_spoofer",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		deck_hardening_suite: {
				name_key: "career_slicer_deck_hardening_suite-u",
				rule_text_key: "career_slicer_deck_hardening_suite_rules-u",		
		  name: "Deck Hardening Suite",
		  description: "Your OmniDeck gains +1 Armor Rating (AR). In addition, once per session, when taking digital damage, you may reduce it by 2 before applying AR.",
		  prerequisite: "emergency_partition",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		expanded_node_logic: {
				name_key: "career_slicer_expanded_node_logic-u",
				rule_text_key: "career_slicer_expanded_node_logic_rules-u",		
		  name: "Expanded Node Logic",
		  description: "Once per session, when using Command Fork, you may extend your control to a third subsystem in a connected node (e.g., lights, alarms, doors). You may not affect more than 1 node at once.",
		  prerequisite: "command_fork",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		iceburn_protocol: {
				name_key: "career_slicer_iceburn_protocol-u",
				rule_text_key: "career_slicer_iceburn_protocol_rules-u",		
		  name: "ICEburn Protocol",
		  description: "Once per session, when you crash a piece of ICE, you may deal 1d6 damage to another ICE in the same node. If that ICE is also destroyed, regain 1 Strain.",
		  prerequisite: "kill_switch_routine",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		pulse_cloak_shell: {
				name_key: "career_slicer_pulse_cloak_shell-u",
				rule_text_key: "career_slicer_pulse_cloak_shell_rules-u",		
		  name: "Pulse Cloak Shell",
		  description: "Once per session, when you enter a new node, you may activate Pulse Cloak. Until your next action, any Trace or ICE activation against you suffers a –1 success tier penalty.",
		  prerequisite: "silent_loop",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		signal_collapse_routine: {
				name_key: "career_slicer_signal_collapse_routine-u",
				rule_text_key: "career_slicer_signal_collapse_routine_rules-u",		
		  name: "Signal Collapse Routine",
		  description: "Once per session, if you crash two or more ICE in a single round, you may force a Trace Reset—remove all Trace Locks and make a free MR roll to mask your presence.",
		  prerequisite: "kill_switch_routine",
		  tier: 4,
		  cost: "20",
		  capstone: false,
		  usage_limit: "session"
		},
		arcnet_sovereign: {
				name_key: "career_slicer_arcnet_sovereign-u",
				rule_text_key: "career_slicer_arcnet_sovereign_rules-u",		
		  name: "ArcNet Sovereign",
		  description: "Once per session, declare ArcNet Sovereign at the start of your turn. For the remainder of the round, all ICE in the same system suffer –1 success tier on attacks, and your IR rolls deal +1 damage on success.",
		  prerequisite: ["iceburn_protocol", "signal_collapse_routine"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		digital_ghost_state: {
				name_key: "career_slicer_digital_ghost_state-u",
				rule_text_key: "career_slicer_digital_ghost_state_rules-u",		
		  name: "Digital Ghost State",
		  description: "Once per session, activate Ghost State. For the next two rounds, you cannot be detected by standard Trace protocols, and all passive ICE treat you as inactive. You may not attack while in Ghost State.",
		  prerequisite: ["pulse_cloak_shell", "silent_loop"],
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		failsafe_override_core: {
				name_key: "career_slicer_failsafe_override_core-u",
				rule_text_key: "career_slicer_failsafe_override_core_rules-u",		
		  name: "Failsafe Override Core",
		  description: "Once per session, if your Deck would crash or you would be forcibly ejected, activate Failsafe Override. You remain connected with 1 Deck Integrity and may take one final action before crashing.",
		  prerequisite: "deck_hardening_suite",
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
				name_key: "career_slicer_stat_boost-u",
				rule_text_key: "career_slicer_stat_boost_rules-u",		
		  name: "+5% Stat Boost",
		  description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: "30",
		  capstone: true,
		  usage_limit: ""
		}
	  }
	},
	street_ronin: {
		name: "Street Ronin",
		career_type: "core",
		career_type_name: "Core",
		skill_points_primary_formula: {
			attributes: ["EDU", "DEX"],
			multipliers: [2, 2]
		},
		skill_points_primary_display: "EDU × 2 + DEX × 2",
		skill_points_secondary: 20,
		spell_xp_primary: 0,
		spell_xp_secondary: 0,
		primary_skills: {
			melee_weapons: "Melee Weapons",
			athletics: "Athletics",
			dodge: "Dodge",
			coordination: "Coordination"
		},
		secondary_skills: {
			stealth: "Stealth",
			insight: "Insight",
			perception: "Perception",
			unarmed_combat: "Unarmed Combat",
			intimidate: "Intimidate",
			survival_urban: "Survival (Urban)"
		},
		talents: {
			clean_entry: {
				name_key: "career_street_ronin_clean_entry-u",
				rule_text_key: "career_street_ronin_clean_entry_rules-u",			
				name: "Clean Entry",
				description: "You may draw and strike with a melee weapon as a single action. If you begin the scene undetected or in a neutral stance, gain a bonus die on that opening attack.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},		
			combat_rhythm: {
				name_key: "career_street_ronin_combat_rhythm-u",
				rule_text_key: "career_street_ronin_combat_rhythm_rules-u",			
				name: "Combat Rhythm",
				description: "Once per scene, after successfully Dodging an attack, gain a bonus die on your next Melee Weapons or Coordination roll before the end of your next turn.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			disciplined_focus: {
				name_key: "career_street_ronin_disciplined_focus-u",
				rule_text_key: "career_street_ronin_disciplined_focus_rules-u",			
				name: "Disciplined Focus",
				description: "Once per scene, spend 1 Strain to ignore a penalty die on a single attack, defense, or Initiative roll.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			strain_buffer: {
				name_key: "career_street_ronin_strain_buffer-u",
				rule_text_key: "career_street_ronin_strain_buffer_rules-u",			
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},			
			urban_footwork: {
				name_key: "career_street_ronin_urban_footwork-u",
				rule_text_key: "career_street_ronin_urban_footwork_rules-u",			
				name: "Urban Footwork",
				description: "Once per scene, gain a bonus die on Dodge or Athletics rolls while moving through tight spaces, vertical terrain, or cluttered urban environments.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			blade_discipline: {
				name_key: "career_street_ronin_blade_discipline-u",
				rule_text_key: "career_street_ronin_blade_discipline_rules-u",			
				name: "Blade Discipline",
				description: "When taking the Dodge action, you may roll your Melee Weapons skill instead of Dodge, as long as you’re wielding a melee weapon.",
				prerequisite: "disciplined_focus",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			interception_cut: {
				name_key: "career_street_ronin_interception_cut-u",
				rule_text_key: "career_street_ronin_interception_cut_rules-u",			
				name: "Interception Cut",
				description: "Once per scene, when an enemy moves into engaged range, spend 2 Strain to make a free melee attack as a reaction. If it hits, their movement is interrupted.",
				prerequisite: "combat_rhythm",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			posture_breaker: {
				name_key: "career_street_ronin_posture_breaker-u",
				rule_text_key: "career_street_ronin_posture_breaker_rules-u",			
				name: "Posture Breaker",
				description: "Once per scene, after a successful melee attack, apply a penalty die to the target’s next attack or defense.",
				prerequisite: "clean_entry",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			reactive_flow: {
				name_key: "career_street_ronin_reactive_flow-u",
				rule_text_key: "career_street_ronin_reactive_flow_rules-u",			
				name: "Reactive Flow",
				description: "Once per session, when missed by a melee attack, you may move 1 range band in any direction as a free maneuver.",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			steel_reflex: {
				name_key: "career_street_ronin_steel_reflex-u",
				rule_text_key: "career_street_ronin_steel_reflex_rules-u",			
				name: "Steel Reflex",
				description: "Once per session, when targeted by a ranged attack and you're either in cover or engaged range, spend 2 Strain to reduce the damage by 1d6. This is a free action, used after the roll but before damage is applied.",
				prerequisite: "",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			breath_before_the_cut: {
				name_key: "career_street_ronin_breath_before_the_cut-u",
				rule_text_key: "career_street_ronin_breath_before_the_cut_rules-u",			
				name: "Breath Before the Cut",
				description: "Once per session, if you win Initiative in a combat scene, you may enter Duel Focus: gain a bonus die on melee attacks against one target and reduce the Strain cost of one reaction-based talent by one die step for the first round.",
				prerequisite: "blade_discipline",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			counterguard_precision: {
				name_key: "career_street_ronin_counterguard_precision-u",
				rule_text_key: "career_street_ronin_counterguard_precision_rules-u",			
				name: "Counterguard Precision",
				description: "Once per scene, after successfully Dodging a melee attack, make a free melee counterattack with a bonus die.",
				prerequisite: "interception_cut",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},			
			draw_cut: {
				name_key: "career_street_ronin_draw_cut-u",
				rule_text_key: "career_street_ronin_draw_cut_rules-u",			
				name: "Draw Cut",
				description: "Once per session, when striking a target that hasn’t acted yet this scene, deal +1d6 damage and apply a penalty die to their next action.",
				prerequisite: "posture_breaker",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},

			stillness_in_motion: {
				name_key: "career_street_ronin_stillness_in_motion-u",
				rule_text_key: "career_street_ronin_stillness_in_motion_rules-u",			
				name: "Stillness in Motion",
				description: "Spend 2 Strain to ignore movement penalties for the rest of the round. During this time, gain a bonus die to Athletics or Melee Weapons rolls involving movement.",
				prerequisite: "posture_breaker",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			the_line_you_do_not_cross: {
				name_key: "career_street_ronin_the_line_you_do_not_cross-u",
				rule_text_key: "career_street_ronin_the_line_you_do_not_cross_rules-u",			
				name: "The Line You Do Not Cross",
				description: "Once per session, designate a small area within engaged range (doorway, alley, rooftop edge). Enemies who cross this line suffer a penalty die on movement or attacks that turn.",
				prerequisite: "posture_breaker",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			deflective_form: {
				name_key: "career_street_ronin_deflective_form-u",
				rule_text_key: "career_street_ronin_deflective_form_rules-u",			
				name: "Deflective Form",
				description: "Once per session, when targeted by a ranged attack within short range while wielding a melee weapon, you may make a Dodge roll as a free action, using either Dodge or Melee Weapons. If your result beats the attacker’s roll, the attack is avoided.",
				prerequisite: "counterguard_precision",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},	
			flow_reversal: {
				name_key: "career_street_ronin_flow_reversal-u",
				rule_text_key: "career_street_ronin_flow_reversal_rules-u",			
				name: "Flow Reversal",
				description: "Once per session, if you fail to beat an attacker’s success while counterattacking, you may spend 2 Strain to force a mutual exchange: both you and the attacker take damage, and the attacker suffers a penalty die on their next action.",
				prerequisite: "counterguard_precision",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			ghost_step: {
				name_key: "career_street_ronin_ghost_step-u",
				rule_text_key: "career_street_ronin_ghost_step_rules-u",			
				name: "Ghost Step",
				description: "Once per scene, move 1 range band as a free maneuver, even if you've already moved this round. If you aren’t targeted before your next turn, your next melee attack gains a bonus die.",
				prerequisite: "stillness_in_motion",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},			
			moment_severed: {
				name_key: "career_street_ronin_moment_severed-u",
				rule_text_key: "career_street_ronin_moment_severed_rules-u",			
				name: "Moment Severed",
				description: "Once per session, after landing a melee hit, spend 2 Strain to prevent the target from taking any actions until the end of their next turn. They may still take reactions.",
				prerequisite: "breath_before_the_cut",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},		
			no_second_strike: {
				name_key: "career_street_ronin_no_second_strike-u",
				rule_text_key: "career_street_ronin_no_second_strike_rules-u",
			
				name: "No Second Strike",
				description: "Once per session, if you reduce a target to 0 HP with a melee attack, immediately make a free melee attack against another target in engaged range. That attack gains a bonus die.",
				prerequisite: "draw_cut",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			steel_anchored_calm: {
				name_key: "career_street_ronin_steel_anchored_calm-u",
				rule_text_key: "career_street_ronin_steel_anchored_calm_rules-u",			
				name: "Steel Anchored Calm",
				description: "Once per session, ignore the effects of fear, pain, or Veil-induced conditions for one round. You also gain a bonus die on Dodge rolls during this time.",
				prerequisite: "the_line_you_do_not_cross",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			duelmasters_claim: {
				name_key: "career_street_ronin_duelmasters_claim-u",
				rule_text_key: "career_street_ronin_duelmasters_claim_rules-u",			
				name: "Duelmaster’s Claim",
				description: "Once per session, declare a single opponent as your focused rival. For the rest of the scene, gain a bonus die on all Melee, Dodge, and reaction-based talents against that target. If you reduce them to 0 HP, choose one: Make a free melee attack against another target in engaged range, or regain 2 Strain.",
				prerequisite: "",
				prerequisiteAll: ["the_line_you_do_not_cross", "moment_severed"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},			
			final_cut_doctrine: {
				name_key: "career_street_ronin_final_cut_doctrine-u",
				rule_text_key: "career_street_ronin_final_cut_doctrine_rules-u",			
				name: "Final Cut Doctrine",
				description: "Once per session, when counterattacking, declare Final Cut. Win or lose, your attack lands after the attacker’s action resolves, dealing maximum weapon damage. If your counterattack would have succeeded normally, you may apply one other talent effect (such as Draw Cut or Posture Breaker) for free.",
				prerequisiteAll: ["flow_reversal", "breath_before_the_cut"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			ghost_walk_execution: {
				name_key: "career_street_ronin_ghost_walk_execution-u",
				rule_text_key: "career_street_ronin_ghost_walk_execution_rules-u",			
				name: "Ghost Walk Execution",
				description: "Once per session, move up to medium range as a free action and make a single melee attack. If the target is unaware of you or has not yet acted this scene, deal +2d6 bonus damage and force a POW check. On failure, they are stunned until the end of their next turn.",
				prerequisite: "ghost_step",
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_street_ronin_stat_boost-u",
				rule_text_key: "career_street_ronin_stat_boost_rules-u",			
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""				
			}
		}
	},
	tactician: {
	},
	/* Specialist Career */
	arcane_gunslinger: {
	  name: "Arcane Gunslinger",
	  career_type: "specialist",
	  career_type_name: "Specialist",
	  career_cost: "30",
	  skill_points_primary_display: "—",
	  skill_points_secondary: 0,
	  spell_xp_primary: 0,
	  spell_xp_secondary: 0,
	  primary_skills: {},
	  secondary_skills: {},
	  entry_requirements: {
		all: [
			{
				any: [
					{ type: "capstone", keys: [ "marksman", "operator" ] },
					{ type: "capstone", career_type: "arcane" }
				]
		    },		
			{		
				any: [
					{ type: "skill", key: "firearms_handgun", min: 60 },
					{ type: "skill", key: "firearms_smg",     min: 60 },
					{ type: "skill", key: "firearms_rifle",   min: 60 },
					{ type: "group",
						keys: ["firearms_handgun","firearms_smg","firearms_rifle"],
						count: 2,
						min: 50
					}
				]
			},
			{ type: "skill", key: "arcana", min: 40 }
		]
	  },	  
	  talents: {
	    arcane_cartridge: {
				name_key: "career_arcane_gunslinger_arcane_cartridge-u",
				rule_text_key: "career_arcane_gunslinger_arcane_cartridge_rules-u",		
	      name: "Arcane Cartridge",
	      description: "Free: declare before roll; spend 1 Strain — your Focus shot becomes arcane and +1 damage.",
	      prerequisite: "",
	      tier: 1,
	      cost: "10",
	      capstone: false,
	      usage_limit: ""
	    },
	    bound_reload: {
				name_key: "career_arcane_gunslinger_bound_reload-u",
				rule_text_key: "career_arcane_gunslinger_bound_reload_rules-u",		
	      name: "Bound Reload",
	      description: "Free — if you used any Infuse talent this round, reload your Focus as a Free Action instead of a Maneuver.",
	      prerequisite: "",
	      tier: 1,
	      cost: "10",
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },	
	    close_orbit: {
				name_key: "career_arcane_gunslinger_close_orbit-u",
				rule_text_key: "career_arcane_gunslinger_close_orbit_rules-u",		
	      name: "Close Orbit",
	      description: "Maneuver (stance; ends at end of your turn) — when firing Pistol/SMG at Engaged with your Focus, reduce close-quarters penalty by one step.",
	      prerequisite: "",
	      tier: 1,
	      cost: "10",
	      capstone: false,
	      usage_limit: ""
	    },	
	    mark: {
				name_key: "career_arcane_gunslinger_mark-u",
				rule_text_key: "career_arcane_gunslinger_mark_rules-u",		
	      name: "Mark",
	      description: "Maneuver; spend 1 Strain — tag a visible target within Medium until your next turn; next attack vs it +10%; +AP 1 if also using Arcane Cartridge.",
	      prerequisite: "",
	      tier: 1,
	      cost: "10",
	      capstone: false,
	      usage_limit: ""
	    },
	    rangefold_nudge: {
				name_key: "career_arcane_gunslinger_rangefold_nudge-u",
				rule_text_key: "career_arcane_gunslinger_rangefold_nudge_rules-u",		
	      name: "Rangefold Nudge",
	      description: "Free: declare before roll; spend 1 Strain — treat target as one band closer for penalties (can’t enable out-of-range).",
	      prerequisite: "",
	      tier: 1,
	      cost: "10",
	      capstone: false,
	      usage_limit: ""
	    },
	    corner_cut: {
				name_key: "career_arcane_gunslinger_corner_cut-u",
				rule_text_key: "career_arcane_gunslinger_corner_cut_rules-u",		
	      name: "Corner Cut",
	      description: "Free; 2 Strain — ignore Partial Cover penalties for this Focus attack (can’t bypass Full Cover).",
	      prerequisite: "rangefold_nudge",
	      tier: 2,
	      cost: "20",
	      capstone: false,
	      usage_limit: ""
	    },
	    disruptive_round: {
				name_key: "career_arcane_gunslinger_disruptive_round-u",
				rule_text_key: "career_arcane_gunslinger_disruptive_round_rules-u",		
	      name: "Disruptive Round",
	      description: "Maneuver; 1d4 Strain — on hit, target loses Reactions and −10% to attacks until end of its next turn; powered gear/bound focus users also suffer 1 penalty die on next action. Damage resolves normally.",
	      prerequisite: "arcane_cartridge",
	      tier: 2,
	      cost: "20",
	      capstone: false,
	      usage_limit: ""
	    },
	    rangefold_step: {
				name_key: "career_arcane_gunslinger_rangefold_step-u",
				rule_text_key: "career_arcane_gunslinger_rangefold_step_rules-u",		
	      name: "Rangefold Step",
	      description: "Free after your attack resolves; 2 Strain — shift one range band; if not Engaged this move doesn’t trigger reactions. Can’t be used while Engaged.",
	      prerequisite: "rangefold_nudge",
	      tier: 2,
	      cost: "20",
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },	
	    ward_flicker: {
				name_key: "career_arcane_gunslinger_ward_flicker-u",
				rule_text_key: "career_arcane_gunslinger_ward_flicker_rules-u",		
	      name: "Ward Flicker",
	      description: "Reaction; 1d4 Strain — impose 1 penalty die on an incoming ranged or spell attack; if it misses, regain 1 Strain (min 0).",
	      prerequisite: "mark",
	      tier: 2,
	      cost: "20",
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    ward_piercing_round: {
				name_key: "career_arcane_gunslinger_ward_piercing_round-u",
				rule_text_key: "career_arcane_gunslinger_ward_piercing_round_rules-u",		
	      name: "Ward-Piercing Round",
	      description: "Maneuver; 1d4 Strain — on hit, reduce arcane soak/ward DR by 2 for damage; target can’t gain new magical shielding until start of your next turn.",
	      prerequisite: "arcane_cartridge",
	      tier: 2,
	      cost: "20",
	      capstone: false,
	      usage_limit: ""
	    },
	    break_contact: {
				name_key: "career_arcane_gunslinger_break_contact-u",
				rule_text_key: "career_arcane_gunslinger_break_contact_rules-u",		
	      name: "Break Contact",
	      description: "Reaction; 1d4 Strain — when you hit with your Focus or an enemy misses you in melee, immediately Disengage and move one band without triggering reactions; if not Engaged, gain Light Cover until your next turn starts.",
	      prerequisite: "rangefold_step",
	      tier: 3,
	      cost: "30",
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    chain_line: {
				name_key: "career_arcane_gunslinger_chain_line-u",
				rule_text_key: "career_arcane_gunslinger_chain_line_rules-u",		
	      name: "Chain Line",
	      description: "Free, immediate after a hit; 2 Strain — after an Infused hit, take a second attack at −10% against a different target within Short of the first; second attack deals arcane damage and can impale.",
	      prerequisite: ["disruptive_round","ward_piercing_round"], // OR
	      tier: 3,
	      cost: "30",
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    overcharged_cartridge: {
				name_key: "career_arcane_gunslinger_overcharged_cartridge-u",
				rule_text_key: "career_arcane_gunslinger_overcharged_cartridge_rules-u",		
	      name: "Overcharged Cartridge",
	      description: "Maneuver; 1d4 Strain — this Focus shot becomes arcane, +1 damage, and on a Hard+ hit treats the attack as AP 2 (stacks with Mark’s AP).",
	      prerequisite: ["disruptive_round","ward_piercing_round"], // OR
	      tier: 3,
	      cost: "30",
	      capstone: false,
	      usage_limit: ""
	    },
	    phase_pin: {
				name_key: "career_arcane_gunslinger_phase_pin-u",
				rule_text_key: "career_arcane_gunslinger_phase_pin_rules-u",		
	      name: "Phase Pin",
	      description: "Maneuver — Mark a visible target within Medium; your next Infused hit this Scene: veil-natives POW save with 1 penalty die or are Rooted on their next round; others are Hobbled until start of their next turn.",
	      prerequisite: "ward_piercing_round",
	      tier: 3,
	      cost: "30",
	      capstone: false,
	      usage_limit: ""
	    },
	    short_fold: {
				name_key: "career_arcane_gunslinger_short_fold-u",
				rule_text_key: "career_arcane_gunslinger_short_fold_rules-u",		
	      name: "Short Fold",
	      description: "Maneuver; 1d4 Strain — until end of your turn, Focus shots treat targets as one band closer and ignore 1 penalty die from light obstructions (smoke/shimmer/glare).",
	      prerequisite: "rangefold_step",
	      tier: 3,
	      cost: "30",
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    anchor_shot: {
				name_key: "career_arcane_gunslinger_anchor_shot-u",
				rule_text_key: "career_arcane_gunslinger_anchor_shot_rules-u",		
	      name: "Anchor Shot",
	      description: "Action (Attack; on hit); 1d4+1 Strain — target cannot teleport, phase, or become invisible until end of your next turn; veil-natives POW with 1 penalty die or are Rooted for that duration.",
	      prerequisite: "phase_pin",
	      tier: 4,
	      cost: "40",
	      capstone: true,
	      usage_limit: "session"
	    },
	    blackout_salvo: {
				name_key: "career_arcane_gunslinger_blackout_salvo-u",
				rule_text_key: "career_arcane_gunslinger_blackout_salvo_rules-u",		
	      name: "Blackout Salvo",
	      description: "Maneuver; 1d6 Strain — on hit, plus damage, emit a Short-radius shutdown pulse: unattended devices & drones off 1 round; attended-gear users POW with 1 penalty die or lose Reactions and −20% to attacks until end of next turn (on success, −10%).",
	      prerequisite: "chain_line",
	      tier: 4,
	      cost: "40",
	      capstone: true,
	      usage_limit: "session"
	    },
	    deadmark_beacon: {
				name_key: "career_arcane_gunslinger_deadmark_beacon-u",
				rule_text_key: "career_arcane_gunslinger_deadmark_beacon_rules-u",		
	      name: "Deadmark Beacon",
	      description: "Action (Attack; on hit); 1d4+1 Strain — target is Exposed until end of round: allies gain +1 die and ignore Partial Cover vs it; target’s Dodge suffers 1 penalty die.",
	      prerequisite: "phase_pin",
	      tier: 4,
	      cost: "40",
	      capstone: true,
	      usage_limit: "session"
	    },
	    severing_round: {
				name_key: "career_arcane_gunslinger_severing_round-u",
				rule_text_key: "career_arcane_gunslinger_severing_round_rules-u",		
	      name: "Severing Round",
	      description: "Action (Attack); 1d6 Strain — on hit, treat as arcane, ignore all armor & ward DR, and force POW with 1 penalty die; on fail, target is Staggered (lose Reactions, −20% to attacks) until end of next turn.",
	      prerequisite: "overcharged_cartridge",
	      tier: 4,
	      cost: "40",
	      capstone: true,
	      usage_limit: "session"
	    },
	    spell_conduit_round: {
				name_key: "career_arcane_gunslinger_spell_conduit_round-u",
				rule_text_key: "career_arcane_gunslinger_spell_conduit_round_rules-u",			
	      name: "Spell Conduit Round",
	      description: "Action (Attack; declare spell); 1d6 Strain + spell’s Strain — resolve firearm damage first; then resolve your known single-target spell against that same target; target suffers 1 penalty die to resist (2 if your attack was Hard+). Counts as one attack action.",
	      prerequisite: "short_fold",
	      tier: 4,
	      cost: "40",
	      capstone: true,
	      usage_limit: "session"
	    }
	  }
	},
	soul_forger: {
	  name: "Soul Forger",
	  career_type: "specialist",
	  career_type_name: "Specialist",
	  career_cost: "30",
	  skill_points_primary_display: "—",
	  skill_points_secondary: 0,
	  spell_xp_primary: 0,
	  spell_xp_secondary: 0,
	  primary_skills: {},
	  secondary_skills: {},
	  entry_requirements: {
		all: [
			{
				any: [
					{ type: "capstone", keys: [ "combat_engineer", "codeweaver", "spirit_warden" ] }
				]
		    },
		    {
				any: [
					{ type: "skill", key: "archanotech", min: 60 },
					{ type: "skill", key: "mechanics", min: 60 },
					{ type: "skill", key: "engineering", min: 60 },
					{ type: "skill", key: "arcana",     min: 60 },
					{
						type: "group",
						keys: ["archanotech", "mechanics", "engineering", "arcana"],
						count: 2,
						min: 50
					}
				]
			}
		  ]
		},
	  talents: {
	    lockout_sigil: {
	        name_key: "career_soul_forger_lockout_sigil-u",
	        rule_text_key: "career_soul_forger_lockout_sigil_rules-u",
	        name: "Lockout Sigil",
	        description: "Type: Action • Cost: 1d4 Strain • Ward a machine within Short range. Opposed (Technomancy or Summoning) vs operator’s skill (or Defense Rating if unattended). On your success, until the end of the target’s next turn the device loses Reactions and suffers –10% to operation checks; if it attacks, impose 1 penalty die on that attack.",
	        prerequisite: "",
	        tier: 1,
	        cost: "10",
	        capstone: false,
	        usage_limit: ""
	    },
	    seat_the_spirit: {
	        name_key: "career_soul_forger_seat_the_spirit-u",
	        rule_text_key: "career_soul_forger_seat_the_spirit_rules-u",
	        name: "Seat the Spirit (Ride—Minor)",
	        description: "Type: Action; Concentration • Cost: 1d4 Strain • Invite a spirit to ride an unattended simple system within Short range (door, camera, turret without active user, civilian drone, parked vehicle subsystem). Roll (Technomancy or Summoning) vs Defense Rating or an opposing operator’s skill if contested. On success, you direct it for the Scene (basic actions only). Starting a new Concentration ends this ride.",
	        prerequisite: "",
	        tier: 1,
	        cost: "10",
	        capstone: false,
	        usage_limit: ""
	    },
	    spirit_patch: {
	        name_key: "career_soul_forger_spirit_patch-u",
	        rule_text_key: "career_soul_forger_spirit_patch_rules-u",
	        name: "Spirit Patch",
	        description: "Type: Action • Cost: 2 Strain • At Engaged or Short range, repair 1d6 HP to a machine/drone/turret/spirit-frame and clear one of: Jammed or Overheated. If the target is currently spirit-infused by you, heal +1 HP. Cannot target living tissue.",
	        prerequisite: "",
	        tier: 1,
	        cost: "10",
	        capstone: false,
	        usage_limit: ""
	    },
	    spirit_static: {
	        name_key: "career_soul_forger_spirit_static-u",
	        rule_text_key: "career_soul_forger_spirit_static_rules-u",
	        name: "Spirit Static (offensive interrupt)",
	        description: "Type: Reaction (declare when a machine within Short range targets you or an ally) • Cost: 1 Strain • Jolt the target’s target-acquisition. Roll (Technomancy or Summoning) vs Defense Rating or an opposing operator if contested. On success, impose 1 penalty die on that attack. On Hard+, also inflict Impaired on the machine until the start of your next turn.",
	        prerequisite: "",
	        tier: 1,
	        cost: "10",
	        capstone: false,
	        usage_limit: ""
	    },	  
	    workshop_wisp: {
	        name_key: "career_soul_forger_workshop_wisp-u",
	        rule_text_key: "career_soul_forger_workshop_wisp_rules-u",
	        name: "Workshop Wisp (Familiar)",
	        description: "Type: Active (Downtime creation; utility companion) • Cost: 500 Cr (ground) or 1,000 Cr (flying) + Bond 5 XP to create; half cost in Credits to rebuild if destroyed • Tiny non-combat familiar (1 HP). Acts on your initiative. Once per Round within Short range, it may Assist one Arcanotech, Mechanical, or Electronics test for one bonus die. Can Scout (Perception 40%), carry a small item, or retrieve a tool. EMP/Blackout do not disable it; instead, it becomes Impaired for 1 Round. You may have multiple Wisps but only one Wisp may be active at a time.",
	        prerequisite: "",
	        tier: 1,
	        cost: "10",
	        capstone: false,
	        usage_limit: ""
	    },
	    chassis_ride: {
	        name_key: "career_soul_forger_chassis_ride-u",
	        rule_text_key: "career_soul_forger_chassis_ride_rules-u",
	        name: "Chassis Ride (Combat)",
	        description: "Type: Action; Concentration • Cost: 1d4 Strain • Possess a drone or turret within Medium range. Oppose (Technomancy or Summoning) vs Defense Rating or an opposing operator’s skill if contested. While riding, choose one benefit for the Scene: +10% to attacks or +10% to control/evasion. Counts as spirit-infused. When the ride ends, the unit becomes Impaired for 1 Round.",
	        prerequisite: "seat_the_spirit",
	        tier: 2,
	        cost: "20",
	        capstone: false,
	        usage_limit: ""
	    },
	    counteremp_veil: {
	        name_key: "career_soul_forger_counteremp_veil-u",
	        rule_text_key: "career_soul_forger_counteremp_veil_rules-u",
	        name: "CounterEMP Veil",
	        description: "Type: Reaction (declare before a disabling effect roll) • Cost: 1d4 Strain • When a device or spirit-frame within Medium range would be disabled by EMP/Blackout, veil the anchor: it ignores shutdown and becomes Impaired until the end of its next turn.",
	        prerequisite: "lockout_sigil",
	        tier: 2,
	        cost: "20",
	        capstone: false,
	        usage_limit: ""
	    },
	    infused_shielding: {
	        name_key: "career_soul_forger_infused_shielding-u",
	        rule_text_key: "career_soul_forger_infused_shielding_rules-u",
	        name: "Infused Shielding",
	        description: "Type: Reaction (declare when a spirit-infused ally within Short range is targeted; lasts to end of Round) • Cost: 1d4 Strain • For the rest of this Round, the target’s DR (physical and arcane) are doubled (round up; minimum +1 if they had no DR). Apply the doubled DR to the current incoming damage and any further hits this Round.",
	        prerequisite: "spirit_patch",
	        tier: 2,
	        cost: "20",
	        capstone: false,
	        usage_limit: ""
	    },
	    overclock_lattice: {
	        name_key: "career_soul_forger_overclock_lattice-u",
	        rule_text_key: "career_soul_forger_overclock_lattice_rules-u",
	        name: "Overclock Lattice",
	        description: "Type: Maneuver • Cost: 1d4 Strain • Target a spirit-infused machine within Short range. Until Scene end, grant +10% to either attacks or dodge/defense (choose once). On a fumble roll by the machine, it gains Overheated and becomes Impaired until the start of your next turn.",
	        prerequisite: [ "seat_the_spirit", "lockout_sigil" ],
	        tier: 2,
	        cost: "20",
	        capstone: false,
	        usage_limit: ""
	    },
	    soulstitch: {
	        name_key: "career_soul_forger_soulstitch-u",
	        rule_text_key: "career_soul_forger_soulstitch_rules-u",
	        name: "Soulstitch",
	        description: "Type: Action • Cost: 1d4 Strain • At Engaged or Short range, repair 2d6 HP to a machine or spirit-frame. If at 0 HP, it rises to 1 HP and clears Incapacitated condition. A given target can benefit from Soulstitch once per Scene.",
	        prerequisite: "spirit_patch",
	        tier: 2,
	        cost: "20",
	        capstone: false,
	        usage_limit: ""
	    },
	    battlefield_reclamation: {
	        name_key: "career_soul_forger_battlefield_reclamation-u",
	        rule_text_key: "career_soul_forger_battlefield_reclamation_rules-u",
	        name: "Battlefield Reclamation",
	        description: "Type: Action • Cost: 1d6 Strain • Target a wrecked, powered-down, or abandoned small chassis within Short range (bot/drone/turret shell; GM decides if it’s possible). Reanimate it as a Reclaimed Shell for the Scene under your command: 6 HP; DR 1 (physical); Attack 45% for 1d6 (melee or light tool-gun). It counts as spirit-infused. When the Scene ends or the shell hits 0 HP, it goes inert.",
	        prerequisite: "soulstitch",
	        tier: 3,
	        cost: "30",
	        capstone: false,
	        usage_limit: ""
	    },
	    hand_of_the_forge: {
	        name_key: "career_soul_forger_hand_of_the_forge-u",
	        rule_text_key: "career_soul_forger_hand_of_the_forge_rules-u",
	        name: "Hand of the Forge",
	        description: "Type: Reaction • Cost: 1d4 Strain • When a spirit-infused ally within Short range takes damage, reduce the damage by 1d6. Once per Round.",
	        prerequisite: "soulstitch",
	        tier: 3,
	        cost: "30",
	        capstone: false,
	        usage_limit: ""
	    },
	    helmgeist_protocol: {
	        name_key: "career_soul_forger_helmgeist_protocol-u",
	        rule_text_key: "career_soul_forger_helmgeist_protocol_rules-u",
	        name: "Helmgeist Protocol",
	        description: "Type: Action; Concentration • Cost: 1d8 Strain • You must be in physical contact with or inside the host vehicle. Awaken the spirit of a vehicle or facility subsystem you are in with for the Scene. Choose one duty when you activate: Assist—the living operator’s Piloting/Driving/Gunnery check gains +10% each Round; or Autopilot/Gunnery—if the operator is incapacitated/absent or cedes control, the spirit takes one vehicle action at 40% (Piloting/Driving 40%; mounted Gunnery 40%) each Round. Changing duty costs a Maneuver. If resisted roll (Technomancy or Summoning) vs Vehicle’s Defense Rating or an opposing operator’s skill if contested.",
	        prerequisite: "chassis_ride",
	        tier: 3,
	        cost: "30",
	        capstone: false,
	        usage_limit: ""
	    },
	    spirit_lattice_field: {
	        name_key: "career_soul_forger_spirit_lattice_field-u",
	        rule_text_key: "career_soul_forger_spirit_lattice_field_rules-u",
	        name: "Spirit Lattice Field",
	        description: "Type: Action; Concentration • Cost: 1d4 Strain • Project a Short-radius aura centered on you for the Scene. Allied spirit-infused units inside impose 1 penalty die on the first attack targeting each spirit-infused unit each Round.",
	        prerequisite: "overclock_lattice",
	        tier: 3,
	        cost: "30",
	        capstone: false,
	        usage_limit: ""
	    },
	    spitework_rewrite: {
	        name_key: "career_soul_forger_spitework_rewrite-u",
	        rule_text_key: "career_soul_forger_spitework_rewrite_rules-u",
	        name: "Spitework Rewrite",
	        description: "Type: Action • Cost: 1d4 Strain • Target a hostile drone/turret within Short range. Opposed (Technomancy or Summoning) vs Defense Rating or an opposing operator’s skill if contested. On success, you flip its IFF for 1 Round: it cannot target your crew and will target designated hostiles or hold fire per your command. On Hard+, duration is 2 Rounds. This is not a Ride and does not require Concentration.",
	        prerequisite: "lockout_sigil",
	        tier: 3,
	        cost: "30",
	        capstone: false,
	        usage_limit: ""
	    },
	    bound_warchassis: {
	        name_key: "career_soul_forger_bound_warchassis-u",
	        rule_text_key: "career_soul_forger_bound_warchassis_rules-u",
	        name: "Bound WarChassis (Permanent Companion)",
	        description: "Type: Downtime creation; Passive in play • Build Cost: 10,000 credits (base frame) • In Downtime, build and bind a permanent combat chassis (body may be any suitable salvaged bot/robot shell; origin is cosmetic and does not change stats). Acts on your initiative with a Maneuver + Action. EMP/Blackout don’t disable it (it becomes Impaired for 1 Round after). Always spirit-infused for your talents. Baseline Statline: 10 HP; DR 2 (physical); Evasion 40%; Attack 55%. Choose one role at binding: Skirmisher (melee 1d6+1), Gunner (weapon must be supplied), or Bulwark (shield arm grants allies in Engaged +1 cover step; Bulwark melee 1d6). You may apply one Tier II or III buff to it at a time (e.g., Overclock Lattice). Upgrades: this is a base chassis—armor, weapons, sensors, and protocols are purchased/installed separately (detailed in upgrade section). Reactivation & Repair: If reduced to 0 HP, it becomes an inert shell. Half cost in Credits to rebuild if destroyed. On-mission Emergency Wake (once per Session): at Engaged range, take an Action, pay 1d6 Strain, and roll Arcanotech or Mechanical—on success it rises to 1 HP (on Hard+, restore 1d6+1 HP). After the mission, repair in Downtime (credits/time only) to fully restore. Limit: Only one War-Chassis may be active at a time; your Tier I Wisp does not count toward this total.",
	        prerequisite: "spirit_lattice_field",
	        tier: 4,
	        cost: "40",
	        capstone: true,
	        usage_limit: ""
	    },
	    cathedral_of_scrap: {
	        name_key: "career_soul_forger_cathedral_of_scrap-u",
	        rule_text_key: "career_soul_forger_cathedral_of_scrap_rules-u",
	        name: "Cathedral of Scrap",
	        description: "Type: Action • Cost: 1d8+2 Strain • Usage: 1/Session • You pull heat, will, and junk into a single Scene-long colossus. If there is sufficient loose material within Short range (wrecked drones/vehicles, scaffolds, appliances, debris), you assemble a Large frame (Build 2, ~8 ft) at Engaged range. It acts each Round on your initiative with a Maneuver + Action until Scene end, then collapses into inert scrap. Statline (for the Scene): HP 16; DR 3 (physical); Dodge 35%; Attack 65% (Smash 1d8+2); Alt-Attack 55% (Hurl Debris 1d6, Medium range). Traits: Bulwark Mass (allies in Engaged with the Colossus have partial cover; ranged attacks against them suffer 1 penalty die), Impact (on a Hard+ Smash, either knock back the target one band or inflict Impaired). Counts as spirit-infused and ignores EMP/Blackout. If reduced to 0 HP, it collapses immediately.",
	        prerequisite: "battlefield_reclamation",
	        tier: 4,
	        cost: "40",
	        capstone: true,
	        usage_limit: "session"
	    },
	    circuit_apotheosis: {
	        name_key: "career_soul_forger_circuit_apotheosis-u",
	        rule_text_key: "career_soul_forger_circuit_apotheosis_rules-u",
	        name: "Circuit Apotheosis",
	        description: "Type: Action; Concentration • Cost: 1d6+2 Strain • Usage: 1/Session • You project your spirit into the ArcNet for the Scene. Your body goes inert (falls prone, remains conscious). Node Reach: at activation choose an access point within Medium range. While apotheosed, treat your current node as Engaged for Slicing actions. With an OmniDeck: you override and amplify your deck—gain +10% to all Slicing rolls, and when targeted in the ArcNet you may defend with Slicing skill instead of the OmniDecks Defense Rating; any feedback damage is handled by the deck per core rules. Without an OmniDeck: you still operate fully; making all Attack, Stealth, or Defense rolls using Slicing skill instead of the normal OmniDeck stats. Any ArcNet feedback damage is taken as Strain instead. If this drops you to 0 Strain, the effect ends immediately; you snap back to your body and gain Exhausted (condition). Vulnerability: if your body takes any damage while apotheosed, this effect ends and you are Impaired on your next turn. You may end this effect as a Free Action at the start of your turn.",
	        prerequisite: "helmgeist_protocol",
	        tier: 4,
	        cost: "40",
	        capstone: true,
	        usage_limit: "session"
	    },
	    city_weave_circuit: {
	        name_key: "career_soul_forger_city_weave_circuit-u",
	        rule_text_key: "career_soul_forger_city_weave_circuit_rules-u",
	        name: "City-Weave Circuit (site seizure)",
	        description: "Type: Action; Concentration • Cost: 1d6+1 Strain • Usage: 1/Session • You must be Engaged with a valid access point (console, junction box, relay cabinet) of a single site-scale security domain within Medium range (transit platform, factory floor, datacenter wing, mall atrium). Opposed (Technomancy or Summoning) vs site’s Defense Rating. On success, you seize the domain for the Scene: (1) Cameras/sensors ignore your crew; hostile remote actions suffer 1 penalty die; (2) Doors/gates/elevators open/close at your command; (3) Site turrets/drones treat your crew as friendly; you may set target priority each Round. Protocol Pulse (1/round, free): choose one — Lock Cycle (hard-close or open a door/gate; elevator disabled 1 Round), Blind Eye (one cluster ignores everyone, or only sees hostiles, 1 Round), Sentry Jinx (one site turret/drone takes –20% until the start of your next turn). You must remain within the site; starting a new Concentration ends the weave.",
	        prerequisite: "helmgeist_protocol",
	        tier: 4,
	        cost: "40",
	        capstone: true,
	        usage_limit: "session"
	    },
	    nullwave_bloom: {
	        name_key: "career_soul_forger_nullwave_bloom-u",
	        rule_text_key: "career_soul_forger_nullwave_bloom_rules-u",
	        name: "Nullwave Bloom",
	        description: "Type: Action • Cost: 1d8+2 Strain • Usage: 1/Session • You release a Veil-charged EMP pulse out to Medium range. All unattended devices drones, bots and vehicles in range go Offline for 1 Round (no actions or reactions), then are Impaired on the following Round. Attended vehicles/drones/independent bots: oppose your Nullwave Bloom (Technomancy or Summoning) with the higher of the operator’s Piloting skill or the device’s Defense Rating. On your success, that host goes Offline 1 Round, then Impaired the following Round; if they save against the Nullwave Bloom, the device, or vehicle is Impaired 1 Round (no Offline). Individuals in range test POW vs your (Technomancy or Summoning) to keep their carried gear up; on a failure, their comms, Smartlink, digital optics, and HUDs go Offline 1 Round (no Impaired after). Cyberware and life-support are unaffected. Normal firearms function normally (they just lose Smartlink/optic benefits while Offline). As part of activation, you may whitelist any number of allied devices and personal gear (including your own); whitelisted items ignore the Bloom.",
	        prerequisite: "spirit_lattice_field",
	        tier: 4,
	        cost: "40",
	        capstone: true,
	        usage_limit: "session"
	    }    	      
	  }
	}
};

//----------------------- Tab Workers Start ----------------------//

// --------------------------------------
// Sheet Worker: Edit Mode Toggle
// --------------------------------------
on("clicked:edit_mode", () => {
  getAttrs(["edit_mode"], (values) => {
    const current = values.edit_mode || "off";
    const next = current === "on" ? "off" : "on";
    setAttrs({ edit_mode: next });
    if (typeof debug_on !== "undefined" && debug_on) {
      console.log(`Toggled Edit Mode: ${next}`);
    }
  });
});

// Dice Modifier Button Handler
on("clicked:-20 clicked:-10 clicked:10 clicked:20", (event) => {
  const clicked = event.triggerName.replace("clicked:", "");
  getAttrs(["dice_modifier_checkbox"], (values) => {
    const current = values.dice_modifier_checkbox || "0";
    const next = current === clicked ? "0" : clicked;
    setAttrs({ dice_modifier_checkbox: next });
  });
});

// Major Wound Handler
on("clicked:major_wounds", (event) => {
  const clicked = 1;
  getAttrs(["major_wounds_checkbox"], (values) => {
    const current = values.major_wounds_checkbox || "0";
    const next = current === clicked ? "0" : clicked;
    setAttrs({ major_wounds_checkbox: next });
  });
});

// Unconcious Handler
on("clicked:unconcious", (event) => {
  const clicked = 1;
  getAttrs(["unconcious_checkbox"], (values) => {
    const current = values.unconcious_checkbox || "0";
    const next = current === clicked ? "0" : clicked;
    setAttrs({ unconcious_checkbox: next });
  });
});

// Dying Handler
on("clicked:dying", (event) => {
  const clicked = 1;
  getAttrs(["dying_checkbox"], (values) => {
    const current = values.dying_checkbox || "0";
    const next = current === clicked ? "0" : clicked;
    setAttrs({ dying_checkbox: next });
  });
});

on("clicked:strain_full_rest", () => {
  getAttrs(["strain_max", "name"], (values) => {
    const maxStrain = parseInt(values.strain_max, 10) || 0;

    // Use maxStrain in the roll template
    const rollStr = `&{template:coc-dice-roll} {{name=Full Rest - @{name}}} {{modifier=[[0 + @{dice_modifier_checkbox}]]}} {{diceroll=[[${maxStrain}]]}}`;

    startRoll(rollStr, (rollData) => {
      setAttrs({ strain: maxStrain });
      finishRoll(rollData.rollId);
    });
  });
});

on("clicked:strain_short_rest", () => {
  startRoll("&{template:coc-dice-roll} {{name=Short Rest - @{name}}} {{modifier=[[0 + @{dice_modifier_checkbox}]]}} {{diceroll=[[1d6]]}}", (rollData) => {
    const recovered = rollData.results.diceroll.result;

    getAttrs(["strain", "strain_max"], (values) => {
      const current = parseInt(values.strain, 10) || 0;
      const max = parseInt(values.strain_max, 10) || 0;
      const newStrain = Math.min(current + recovered, max);
      setAttrs({ strain: newStrain });
    });

    finishRoll(rollData.rollId);
  });
});

const tabList = ["skills", "perks", "flaws", "background", "careers", "talents",  "combat", "spells", "inventory", "backstory", "npcs", "vehicles", "ledger", "tracker"];

tabList.forEach(tab => {
    on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ selected_tab: tab });
    });
});

on("clicked:clear_inactive_careers", () => {
  if (debug_on) console.log("[clicked:clear_inactive_careers]");
  runCleanupInactiveCareers();	
});

let backgroundTabWatchersReady = false;

const registerBackgroundTabWatchers = () => {
    if (debug_on) console.log("Object.keys(backgroundDataMap) loaded");
    if (debug_on_trace) console.log("[Object.keys(backgroundDataMap)] Start");
    if (backgroundTabWatchersReady) return;
    backgroundTabWatchersReady = true;

    // Iterate races, then each race's backgrounds
    Object.entries(backgroundDataMap).forEach(([race, bgMap]) => {
        Object.keys(bgMap || {}).forEach((bgKey) => {
            on(`clicked:${bgKey}`, () => {
                if (debug_on_trace) console.log(`[background tab click] ${race}:${bgKey}`);
                const update = {};
                update[`${race}_background_choice`] = bgKey; // drives CSS reveal/highlight
                setAttrs(update);
            });
        });
    });
};

// One-time registrar for per-career tab clicks
let careerTabWatchersReady = false;

const registerCareerTabWatchers = () => {
  if (debug_on) console.log ("Object.keys(careerDataMap) loaded");
  if (debug_on_trace) console.log ("[Object.keys(careerDataMap)] Start");
  if (careerTabWatchersReady) return;
  careerTabWatchersReady = true;

  Object.keys(careerDataMap).forEach(career => {
    on(`clicked:${career}`, () => {
      if (debug_on_trace) console.log(`[career tab click] ${career}`);
      setAttrs({ selected_career: career });
    });
  });
};

//----------------------- Tab Workers End ----------------------//

//----------------------- Hidden Dice Trick Start --------------------//

on("change:roll_weapon1_mdr_attack_impale_checkbox", function () {
  getAttrs(["roll_weapon1_mdr_attack_impale_checkbox"], function (v) {
    setAttrs({
		attack_mode_toggle: v.roll_weapon1_mdr_attack_impale_checkbox === "1" ? "impale" : "noimpale"
    });
  });
});

on("change:repeating_weaponsmdr:attack_impale_checkbox", function(eventInfo) {
  const rowId = eventInfo.sourceAttribute.match(/repeating_weaponsmdr_([^_]+)_/)[1];
  const impaleAttr = `repeating_weaponsmdr_${rowId}_attack_impale_checkbox`;
  const toggleAttr = `repeating_weaponsmdr_${rowId}_attack_mode_toggle`;

  getAttrs([impaleAttr], function(v) {
    setAttrs({
      [toggleAttr]: v[impaleAttr] === "1" ? "impale" : "noimpale"
    });
  });
});

//----------------------- Hidden Dice Trick End --------------------//

//----------------------- Repeating Spells --------------------//

// Mirror select dropdown value to hidden input (for CSS Wizardry styling)
on("change:repeating_spellsmdr:spell_prepared_mdr", function(eventInfo) {
  if (debug_on_trace) console.log ("[change:repeating_spellsmdr:spell_prepared_mdr] Start");
  const match = eventInfo.sourceAttribute.match(/repeating_spellsmdr_([^_]+)_/);
  if (!match) return;

  const rowId = match[1];
  const sourceAttr = `repeating_spellsmdr_${rowId}_spell_prepared_mdr`;
  const mirrorAttr = `repeating_spellsmdr_${rowId}_spell_prepared_mdr_mirror`;

  getAttrs([sourceAttr], function(values) {
    const mirrorValue = values[sourceAttr] === "1" ? "1" : "0";
    setAttrs({ [mirrorAttr]: mirrorValue });
  });
});

// Sum spellcosts only for prepared spells
on("change:repeating_spellsmdr:spellcost change:repeating_spellsmdr:spell_prepared_mdr remove:repeating_spellsmdr", function() {
  if (debug_on_trace) console.log ("[change:repeating_spellsmdr:spellcost change:repeating_spellsmdr:spell_prepared_mdr remove:repeating_spellsmdr] Start");
  getSectionIDs("repeating_spellsmdr", function(ids) {
    const attrsToGet = ids.flatMap(id => [
      `repeating_spellsmdr_${id}_spellcost`,
      `repeating_spellsmdr_${id}_spell_prepared_mdr`
    ]);

    getAttrs(attrsToGet, function(values) {
      let total = 0;
      ids.forEach(id => {
        const cost = parseFloat(values[`repeating_spellsmdr_${id}_spellcost`] || 0);
        const isPrepared = values[`repeating_spellsmdr_${id}_spell_prepared_mdr`] === "1";
        if (isPrepared) total += cost;
      });
      setAttrs({ total_spellcost: total });
    });
  });
});

//----------------------- Spell Cost Calculation --------------------//
// Update overflow flag when spellcost or AC changes
on("change:total_spellcost change:ac", function () {
  if (debug_on_trace) console.log ("[change:total_spellcost change:ac] Start");
  getAttrs(["total_spellcost", "ac"], function (values) {
    const cost = parseFloat(values.total_spellcost) || 0;
    const capacity = parseFloat(values.ac) || 0;
    const isOver = cost > capacity ? "1" : "0";

    // Log the raw values and the comparison result
    if (debug_on) console.log("Total Spell Cost:", cost);
    if (debug_on) console.log("Arcane Capacity:", capacity);
    if (debug_on) console.log("Is Over Capacity:", isOver);

    setAttrs({ spellcost_overflow: isOver });
  });
});

//----------------------- Skill, Backgrounds, and Talents --------------------//

/* ===== Perks: 1 pick per cost group (10 & 15), no global cap ===== */
const tr = k => (k ? getTranslationByKey(k) || k : "");

const perkKeys    = Object.keys(perkDataMap);
const perk10Keys  = perkKeys.filter(k => (perkDataMap[k]?.cost|0) === 10);
const perk15Keys  = perkKeys.filter(k => (perkDataMap[k]?.cost|0) === 15);
const perkAttrs   = perkKeys.map(k => `perk_${k}`);
const perkEvents  = ['clicked:perks', ...perkAttrs.map(a => `change:${a}`)].join(' ');

on(perkEvents, () => {
  getAttrs(perkAttrs, v => {
    const u = {};
    let xpSpent   = 0;
    let lines     = [];
    let picked10  = 0;
    let picked15  = 0;
    let linguistSP = 0;

    perkKeys.forEach(k => {
      const picked = v[`perk_${k}`] === '1';
      u[`show_perk_${k}`] = picked ? '1' : '0';

      if (picked) {
        const def = perkDataMap[k] || {};
        const cost = Number(def.cost) || 0;
        xpSpent += cost;

        const nameKey = def.name || def.name_i18n || '';
        const descKey = def.description || def.description_i18n || '';
        lines.push(`${tr(nameKey)} — ${tr(descKey)}`);

        if (cost === 10) picked10++;
        if (cost === 15) picked15++;
        if (k === 'linguist') linguistSP = 75;
      }
    });

    // group locks: 1 selection per cost band
    u.perk10_slots_full  = picked10 >= 1 ? '1' : '0';
    u.perk15_slots_full  = picked15 >= 1 ? '1' : '0';

    // totals + summary (ensure it fully clears when nothing is selected)
    u.xpledger_perks_cost = String(xpSpent);
    u.perk_summary = lines.length ? lines.join("\n\n") : " ";
    u.perk_linguist_sp       = String(linguistSP);

    setAttrs(u);
  });
});

/* ===== Flaws: 1 pick per cost group (5 & 10), no total cap ===== */
const flawKeys   = Object.keys(flawDataMap);
const flaw5Keys  = flawKeys.filter(k => (flawDataMap[k]?.cost|0) === 5);
const flaw10Keys = flawKeys.filter(k => (flawDataMap[k]?.cost|0) === 10);
const flawAttrs  = flawKeys.map(k => `flaw_${k}`);
const flawEvents = ['clicked:flaws', ...flawAttrs.map(a => `change:${a}`)].join(' ');

on(flawEvents, () => {
  getAttrs(flawAttrs, v => {
    const u = {};
    let xpGain  = 0;
    let lines   = [];
    let picked5 = 0;
    let picked10 = 0;

    flawKeys.forEach(k => {
      const picked = v[`flaw_${k}`] === '1';
      u[`show_flaw_${k}`] = picked ? '1' : '0';

      if (picked) {
        const def = flawDataMap[k] || {};
        const cost = Number(def.cost) || 0;
        xpGain += cost;

        const nameKey = def.name || def.name_i18n || '';
        const descKey = def.description || def.description_i18n || '';
        lines.push(`${tr(nameKey)} — ${tr(descKey)}`);

        if (cost === 5) picked5++;
        if (cost === 10) picked10++;
      }
    });

    // group locks: 1 selection per cost band
    u.flaw5_slots_full  = picked5 >= 1 ? '1' : '0';
    u.flaw10_slots_full = picked10 >= 1 ? '1' : '0';

    // totals + summary (fully clear when nothing selected)
    u.xpledger_flaws_gain = String(xpGain);
    u.flaw_summary = lines.length ? lines.join("\n\n") : " ";

    setAttrs(u);
  });
});

// Blood-Born Survivor — add +2 current Vitality once per session
on("change:used_session_perk_blood_born_survivor", (eventInfo) => {
  getAttrs([
    "used_session_perk_blood_born_survivor",
    "perk_blood_born_survivor",
    "vitality",
    "bbs_session_applied" // hidden guard flag
  ], (v) => {
    const picked   = v.perk_blood_born_survivor === "1"; // only if the perk is actually owned
    const usedNow  = v.used_session_perk_blood_born_survivor === "1";
    const applied  = v.bbs_session_applied === "1";

    if (picked && usedNow && !applied) {
      const cur = parseInt(v.vitality, 10) || 0;
      setAttrs({
        vitality: cur + 2,           // no cap; purely adds to current
        bbs_session_applied: "1"     // block further adds this session
      });
    }
  });
});

function getAllTalentSkills(race) {
  if (debug_on_trace) console.log("[getAllTalentSkills] Start");

  const skills = new Set();
  const raceTalents = (talentDataMap && talentDataMap[race]) || {};

  Object.values(raceTalents).forEach(talent => {
    const s = talent && talent.skills;
    if (!s) return;

    if (Array.isArray(s)) {
      s.forEach(k => k && skills.add(k));
    } else if (typeof s === "object") {
      Object.keys(s).forEach(k => k && skills.add(k));
    }
  });

  const result = Array.from(skills);
  if (debug_on) console.log("[getAllTalentSkills]", race, result);
  return result;
}


function resetAllMDRToBase(race, callback) {
  if (debug_on_trace) console.log ("[resetAllMDRToBase] Start");
  
  // Use internal ids for attribute names
  const skills = Object.values(skillMapTable || {})
    .map(s => s && s.label)
    .filter(Boolean);

  const attrsToGet = skills.map(skill => `${skill}_skill_mdr`).concat(skills.map(skill => `${skill}_mdr`));

  getAttrs(attrsToGet, values => {
    const updates = {};
    skills.forEach(skill => {
      const base = parseInt(values[`${skill}_skill_mdr`], 10) || 0;
      updates[`${skill}_mdr`] = base;
    });
    setAttrs(updates, callback); // optionally `{ silent: true }`
  });
}

function applyAllSkillBonuses(race) {
	if (debug_on_trace) console.log ("[applyAllSkillBonuses] Start");

  const talentSkills = getAllTalentSkills(race);

  const updates = {};
  Object.assign(updates, setDefaultTalentBonuses(race, talentSkills));

  if (debug_on) console.log("[applyAllSkillBonuses]", updates);
  setAttrs(updates);
}

// Apply race defaults/state (NO watcher registrations here)
function initializeRaceState(race) {
  if (!race || race === "cr" || race === "unknown" || race === "0") return;
  if (debug_on_trace) console.log("[initializeRaceState] Start", { race });

  // Hold the guard ON while bulk setAttrs run (they're async)
  beginSilent();
  resetAllMDRToBase();
  applyRacialBaseStats(race);
  setDefaultTalentBonuses(race);

  // After bulk updates, do exactly ONE recompute and then release the guard
  const allSkills = Object.values(skillMapTable || {}).map(s => s && s.label).filter(Boolean);
  const magicSchools = Object.values(skillMapTable || {})
    .filter(s => s && s.group === "Magic" && s.label !== "magic_universal")
    .map(s => s && s.bonus).filter(Boolean);

  const toRead = new Set([
    "showracials",
    "dex",
    "edu",
    "language_caltheran_skill_mdr",
    `${race}_mdr_checkbox`,
    ...magicSchools
  ]);
  allSkills.forEach(skill => {
    toRead.add(`${skill}_skill_mdr`);
    toRead.add(`${skill}_mdr`);
    toRead.add(`${race}_${skill}_bonus_mdr`);
    toRead.add(`${race}_talent_${skill}_bonus_mdr`);
  });

  getAttrs(Array.from(toRead), (values) => {
    calculateAndUpdateSkillValues(race, values); // single, intentional recompute
    endSilent(); // <-- release AFTER calc completes
  });
}

on("change:showracials", (evt) => {
  if (debug_on_trace) console.log("[change:showracials] Start");
  const race = (evt && evt.newValue) || "";

  if (!raceDataMap || !raceDataMap[race] || race === "cr" || race === "unknown" || race === "0") {
    if (debug_on) console.log("[showracials] Unselected/invalid race:", race);
    return;
  }

  ensureRaceWatchers(race);
  initializeRaceState(race); // does one recompute at the end

  // --- Language + talent labels (silent) ---
  const raceData   = raceDataMap[race];
  const racialLang = raceData.language || "Racial";
  const otherLang  = race === "human" ? "Other" : "Caltheran";

  const updates = {
    language_own_txt: racialLang,
    language_caltheran_txt: otherLang
  };

//  const raceTalents = (talentDataMap && talentDataMap[race]) || {};
//  for (const [key, data] of Object.entries(raceTalents)) {
//    updates[`${race}_${key}_label`]       = data.name || "";
//    updates[`${race}_${key}_description`] = data.description || "";
//  }

  beginSilent();
  setAttrs(updates, () => {
    if (typeof updateTalentEnables === "function") updateTalentEnables(race);
    endSilent();
    // no extra calc here; initializeRaceState already did one
  });
});

const talentSummaryRegistered = new Set();

function registerTalentSummaryWatcher(race) {
  if (talentSummaryRegistered.has(race)) return;
  if (debug_on_trace) console.log("[registerTalentSummaryWatcher] Start");

  const allChangeEvents = [
    "change:showracials",
    "change:recompute_nonce",
    ...Object.entries(talentDataMap || {}).flatMap(([rc, talents]) =>
      Object.keys(talents).map(talentKey => `change:${rc}_${talentKey}`)
    )
  ];

  on(allChangeEvents.join(" "), function () {
    getAttrs(["showracials"], function (values) {
      const activeRace = values.showracials;
      const raceTalents = (talentDataMap && talentDataMap[activeRace]) || null;
      if (!raceTalents) return;

      const watchedTalentAttrs = Object.keys(raceTalents).map(k => `${activeRace}_${k}`);

      getAttrs(watchedTalentAttrs, function (talentValues) {
        const summaryLines = [];

        for (let [key, data] of Object.entries(raceTalents)) {
          const fullKey = `${activeRace}_${key}`;
          if (talentValues[fullKey] === "1") {
            // prefer i18n keys; fall back to static fields if needed
            const nameKey  = data.name_key      || data.nameKey;
            const rulesKey = data.rule_text_key || data.rulesKey;

            const nameText =
              (typeof getTranslationByKey === "function" && nameKey)
                ? getTranslationByKey(nameKey) || data.name || key
                : (data.name || key);

            const rulesText =
              (typeof getTranslationByKey === "function" && rulesKey)
                ? getTranslationByKey(rulesKey) || data.description || ""
                : (data.description || "");

            summaryLines.push(`T${data.tier}: ${nameText} — ${rulesText}`);
          }
        }

        const summaryText = summaryLines.length ? summaryLines.join("\n\n") : " "; // keep one space to avoid collapse
        setAttrs({ talent_summary: summaryText });
      });
    });
  });

  talentSummaryRegistered.add(race);
}

const registerTalentSkillBonusWatchers = () => {
  if (debug_on_trace) console.log("[registerTalentSkillBonusWatchers] Start");

  const races = Object.keys(talentDataMap || {});
  races.forEach((race) => {
    const raceTalents = talentDataMap[race] || {};

    // Only talents with a skills selection get watchers
    const talentsWithSkills = Object.entries(raceTalents)
      .filter(([_, t]) => {
        if (!t || t.skills == null) return false;
        if (Array.isArray(t.skills)) return t.skills.length > 0;
        if (typeof t.skills === "object") return Object.keys(t.skills).length > 0;
        return false;
      })
      .map(([key]) => key);

    talentsWithSkills.forEach((talent) => {
      const checkboxAttr = `${race}_${talent}_mdr_checkbox`;
      const talentAttr   = `${race}_${talent}`;
      const lockAttr     = `${race}_${talent}_lockflag_skill`;
      const showAttr     = `show_${talent}_bonus`;

      const watchedAttrs = [checkboxAttr, talentAttr];

      on(`change:${checkboxAttr} change:${talentAttr}`, () => {
        getAttrs(watchedAttrs.concat(["showracials"]), (values) => {
          const isTalentChecked = values[talentAttr] === "1";
          const skillChoice = values[checkboxAttr] || "0";

          const shouldShow = isTalentChecked || skillChoice !== "0";
          const isLocked = skillChoice !== "0"; // Lock if any skill choice is selected

          if (debug_on) {
            console.log(`[Generic Bonus Watcher] ${race}.${talent}`);
            console.log("Talent Checked:", isTalentChecked);
            console.log("Skill Selected:", skillChoice);
            console.log("→ Show Skills?", shouldShow ? "Yes" : "No");
            console.log("→ Lock Talent?", isLocked ? "Yes" : "No");
          }

          const updates = {};
          updates[showAttr] = shouldShow ? "1" : "0";
          updates[lockAttr] = isLocked ? "1" : "0";

          setAttrs(updates, () => {
            const raceFromSheet = values.showracials;
            updateTalentEnables(raceFromSheet);
          });
        });
      });
    });
  });
};

const calculateAndUpdateSkillValues = (racePrefix, values) => {
  if (debug_on_trace) console.log ("[calculateAndUpdateSkillValues] Start"); 

  const allSkills = Object.values(skillMapTable).map(s => s.label);

  // Build 1–11 generic Other slots
  const otherSkills = Array.from({ length: 11 }, (_, i) => `otherskill${i + 1}`);

  // NEW: any otherskillN that appears as a label in skillMapTable is already handled in allSkills
  // (e.g., Language(Other) -> "otherskill3"), so we should NOT count it again in the "otherSkills" loop.
  const usedOtherSlots = new Set(
    Object.values(skillMapTable || {})
      .map(s => s && s.label)
      .filter(l => typeof l === "string" && /^otherskill\d+$/.test(l))
  );

  const baseSkillLookup = Object.values(skillMapTable).reduce((map, skill) => {
    map[skill.label] = parseInt(skill.base, 10) || 0;
    return map;
  }, {});

  const magicSchools = Object.values(skillMapTable)
    .filter(skill => skill.group === "Magic" && skill.label !== "magic_universal")
    .map(skill => skill.bonus);

  const update = {};
  let totalSkillPointsSpent = 0;

  const bgSkill = values[`${racePrefix}_mdr_checkbox`] || null;
  const talentSkills = Object.entries(talentDataMap[racePrefix] || {})
  .filter(([_, t]) => {
    if (!t || t.skills == null) return false;
    if (Array.isArray(t.skills)) return t.skills.length > 0;
    if (typeof t.skills === "object") return Object.keys(t.skills).length > 0;
    return false;
  })
  .map(([talentKey]) => {
    const val = values[`${racePrefix}_${talentKey}_mdr_checkbox`];
    return val && /^talent_/.test(val) ? val.replace(/^talent_/, "") : null;
  })
  .filter(Boolean);


  allSkills.forEach(skill => {
    let base = parseInt(values[`${skill}_skill_mdr`], 10);
    const defaultBase = baseSkillLookup[skill] || 0;
    if (isNaN(base)) {
      base = defaultBase;
      update[`${skill}_skill_mdr`] = base;
    }

    const spent = base - defaultBase;
    totalSkillPointsSpent += spent;
    update[`${skill}_improved_label`] = spent > 0 ? "#" : spent < 0 ? "*" : "";

    const bgBonus = bgSkill === skill ? (parseInt(values[`${racePrefix}_${skill}_bonus_mdr`], 10) || 0 ) : 0;

	const talentBonus = Object.entries(talentDataMap[racePrefix] || {})
		.filter(([_, t]) => {
			const s = t && t.skills;
			if (!s) return false;
			return Array.isArray(s) ? s.length > 0 : Object.keys(s).length > 0;
	})
	.reduce((sum, [talentKey]) => {
			const selectedValue = values[`${racePrefix}_${talentKey}_mdr_checkbox`] || "";
			const targetValue = `talent_${skill}`;
			if (selectedValue === targetValue) {
				const bonus = parseInt(values[`${racePrefix}_talent_${skill}_bonus_mdr`], 10) || 0;
				return sum + bonus;
		}
		return sum;
	}, 0);


    let total = base + bgBonus + talentBonus;

    if (skill === "dodge") {
      const idex = parseInt(values.dex, 10) || 0;
      const dexBonus = Math.floor(idex / 2);
      total += dexBonus;
      if (debug_on) console.log(`[Dodge] DEX=${idex}, +${dexBonus}`);
    }

    if (skill === "athletics") {
      const athletics = parseInt(values.athletics_skill_mdr, 10) || 0;
      const idex = parseInt(values.dex, 10) || 0;
      update.mov = Math.min(14, Math.floor((idex + athletics) / 10));
    }

    update[`${skill}_mdr`] = total;
  });

  // Only count "Other" slots that are NOT already mapped in skillMapTable (prevents double-counting)
  otherSkills.forEach(skill => {
    if (usedOtherSlots.has(skill)) return; // <-- NEW: skip duplicates already handled above

    const base = parseInt(values[`${skill}_skill_mdr`], 10) || 0;
    totalSkillPointsSpent += base;
    update[`${skill}_mdr`] = base;
    update[`${skill}_improved_label`] = base > 0 ? "#" : base < 0 ? "*" : "";
  });

  update.language_caltheran_mdr =
    Math.min(75, parseInt(values.language_caltheran_skill_mdr, 10) || 0) +
    Math.min(75, parseInt(values.edu, 10)  || 0);

  const refund = parseInt(values.skill_points_talent_refund, 10) || 0;
  totalSkillPointsSpent += refund;
  update.total_skill_points_spent = totalSkillPointsSpent;

  const schoolValues = magicSchools.slice(0, 9).map(attr => parseInt(values[attr], 10) || 0);
  const baseUniversal = parseInt(values.magic_universal_skill_mdr, 10) || 0;
  update.magic_universal_mdr = Math.max(...schoolValues) + baseUniversal;

  setAttrs(update);
};

function registerSkillHandler(racePrefix, triggerSkillsArg = [], talentSources = []) {
  if (!racePrefix) return;
  if (debug_on_trace) console.log("[registerSkillHandler] Start", { racePrefix });

  // idempotent per race
  const key = `${racePrefix}`;
  if (registeredRaces.has(key)) return;
  registeredRaces.add(key);

  // ---- derive lists safely (no flatMap) ----
  const allSkills = Object.values(skillMapTable || [])
    .map(s => s && s.label)
    .filter(Boolean);

  const triggerSkills = (Array.isArray(triggerSkillsArg) && triggerSkillsArg.length)
    ? triggerSkillsArg
    : allSkills; // default to all skills so we never hit undefined

  const otherSkills = Array.from({ length: 11 }, (_, i) => `otherskill${i + 1}`);

  const magicSchools = Object.values(skillMapTable || [])
    .filter(s => s && s.group === "Magic" && s.label !== "magic_universal")
    .map(s => s && s.bonus)
    .filter(Boolean); // e.g., "magic_alteration_mdr"

  const talentKeys = Object.entries(talentDataMap?.[racePrefix] || {})
  .filter(([_, t]) => {
    const s = t && t.skills;
    if (!s) return false;
    if (Array.isArray(s)) return s.length > 0;
    if (typeof s === "object") return Object.keys(s).length > 0;
    return false;
  })
  .map(([key]) => key);


  // watched attrs
  const watched = new Set([
    `${racePrefix}_mdr_checkbox`,
    "dex",
    "edu",
    "language_caltheran_skill_mdr",
    ...magicSchools
  ]);
  + watched.add("recompute_nonce"); // nudge to recompute on sheet:opened
  allSkills.forEach(skill => watched.add(`${skill}_skill_mdr`));
  otherSkills.forEach(skill => watched.add(`${skill}_skill_mdr`));
  triggerSkills.forEach(skill => {
    watched.add(`${racePrefix}_${skill}_bonus_mdr`);
    watched.add(`${racePrefix}_talent_${skill}_bonus_mdr`);
  });
  talentKeys.forEach(t => watched.add(`${racePrefix}_${t}_mdr_checkbox`));

  if (debug_on) console.log("[registerSkillHandler Init]", { watched: Array.from(watched) });

  // attrs to read
  const skillsToAttrs = {};
  allSkills.forEach(skill => {
    skillsToAttrs[skill] = [
      `${skill}_skill_mdr`,
      `${skill}_mdr`,
      `${racePrefix}_${skill}_bonus_mdr`,
      `${racePrefix}_talent_${skill}_bonus_mdr`
    ];
  });

  const globalAttrs = [
    "dex",
    "edu",
    "language_caltheran_skill_mdr",
    ...magicSchools,
    `${racePrefix}_mdr_checkbox`,
    "showracials",
    "skill_points_talent_refund",
    ...talentKeys.map(t => `${racePrefix}_${t}_mdr_checkbox`)
  ];

  const otherSkillAttrs = [];
  otherSkills.forEach(s => { otherSkillAttrs.push(`${s}_skill_mdr`, `${s}_mdr`); });

  const skillAttrList = [];
  Object.values(skillsToAttrs).forEach(arr => arr.forEach(a => skillAttrList.push(a)));

  const allReadAttrs = Array.from(new Set([...globalAttrs, ...skillAttrList, ...otherSkillAttrs]));
  const changeEvents = Array.from(watched).map(s => `change:${s}`).join(" ");

  const isUnselectedRace = r => !r || r === "unknown" || r === "0" || r === "cr";

  const runCalc = () => {
    getAttrs(allReadAttrs, values => {
      const activeRace = values.showracials || "unknown";
      if (activeRace !== racePrefix || isUnselectedRace(activeRace)) return;
      calculateAndUpdateSkillValues(racePrefix, values);
    });
  };

  on(changeEvents, (typeof guarded === "function") ? guarded(runCalc) : runCalc);
  runCalc(); // manual init once
}

function setDefaultTalentBonuses(race) {
  if (debug_on_trace) console.log("[setDefaultTalentBonuses] Start");
  const updates = {};
  const raceTalents = talentDataMap && talentDataMap[race];
  if (!raceTalents) return updates;

  const skillSet = new Set();

  Object.values(raceTalents).forEach(talent => {
    const skills = talent && talent.skills;
    if (!skills) return;

    if (Array.isArray(skills)) {
      skills.forEach(s => s && skillSet.add(s));
    } else if (skills && typeof skills === "object") {
      Object.keys(skills).forEach(s => s && skillSet.add(s));
    }
  });

  skillSet.forEach(skill => {
    const attr = `${race}_talent_${skill}_bonus_mdr`;
    if (!(attr in updates)) updates[attr] = 10; // ✅ correct
  });

  setAttrs(updates);
  if (debug_on) console.log("[setDefaultTalentBonuses] updates:", updates);
  return updates;
}

const registerAllTalentChangeWatchers = () => {
  if (debug_on_trace) console.log ("[registerAllTalentChangeWatchers] Start"); 
  if (talentWatchersRegistered) return;
  talentWatchersRegistered = true;

  const allTalentChangeEvents = Object.entries(talentDataMap)
    .flatMap(([race, talents]) =>
      Object.keys(talents).map(talentKey => `change:${race}_${talentKey}`)
    );

	on(allTalentChangeEvents.join(" "), eventInfo => {
		const race = eventInfo.sourceAttribute.split("_")[0];
		if (talentDataMap[race]) {
			updateTalentEnables(race);
		} else {
			getAttrs(["showracials"], values => {
				updateTalentEnables(values.showracials);
			});
		}
	});
};

const registerBackgroundTalentWatchers = () => {
	if (debug_on_trace) console.log ("[registerBackgroundTalentWatchers] Start"); 
  if (backgroundTalentWatchersRegistered) return;
  backgroundTalentWatchersRegistered = true;

  const backgroundTalentChangeEvents = Object.keys(talentDataMap)
    .map(race => `change:bg_${race}_talent`);

  on(backgroundTalentChangeEvents.join(" "), eventInfo => {
    const race = eventInfo.sourceAttribute.split("_")[1];
    if (debug_on) console.log(`[Background Talent Watcher] bg_${race}_talent changed`);
    applyRacialBaseStats(race); // or updateTalentEnables(race) if relevant
  });
};

const registerBackgroundTalentWatcher = () => {
if (debug_on_trace) console.log ("[registerBackgroundTalentWatcher] Start");
  const watchers = Object.keys(talentDataMap)
    .map(race => `change:bg_${race}_talent`);

  if (debug_on) console.log("[registerBackgroundTalentWatcher] Registered for:", watchers);

  on(watchers.join(" "), function (eventInfo) {
    if (debug_on) console.log("[registerBackgroundTalentWatcher] Event fired for:", eventInfo.sourceAttribute);

    const match = eventInfo.sourceAttribute.match(/^bg_([^_]+)_talent$/);
    if (!match) return;

    const race = match[1];
    updateTalentEnables(race);
  });
};

const registerXPTrackerWatcher = () => {
  if (debug_on_trace) console.log ("[registerXPTrackerWatcher] Start");
  const xpWatcherEvents = [
    "change:xp_pool_total_talent",
    "change:showracials",
    ...Object.entries(talentDataMap).flatMap(([race, talents]) =>
      Object.keys(talents).map(talentKey => `change:${race}_${talentKey}`)
    )
  ];

  on(xpWatcherEvents.join(" "), function () {
	getAttrs(["xp_pool_total_talent", "showracials"], function (values) {
		const race = values.showracials || "alteri";
		const raceTalents = talentDataMap[race];
		if (!raceTalents) return;

		const talentKeys = Object.keys(raceTalents);
		const watchedAttrs = talentKeys.map(key => `${race}_${key}`);
		const bgFlags = talentKeys.map(key => `${race}_${key}_from_background`);

		const skillPointRefunds = {
			draevi: {},
			alteri: {},
			human: {
				skilled_focus: -10,
				cross_trained: -10,
				master_of_none: -30
			}
		};

		getAttrs([...watchedAttrs, ...bgFlags, "total_skill_points_spent", "skill_points_talent_refund"], function (talentValues) {
			let spent = 0;
			let refund = 0;

			for (let key of talentKeys) {
				const attrName = `${race}_${key}`;
				const selected = talentValues[attrName] === "1";
				const cost = parseInt(raceTalents[key].cost, 10) || 0;
				if (selected) {
					let actualCost = cost;

					// Subtract background talent cost if this was granted by background
					if (talentValues[`${race}_${key}_from_background`] === "1" && cost === 10) {
						actualCost = 0;
						if (debug_on) console.log(`[XP Tracker] ${key} granted by background, cost waived.`);
					}

					spent += actualCost;

					const raceRefundMap = skillPointRefunds[race] || {};
					if (raceRefundMap[key]) {
						refund += raceRefundMap[key];
						if (debug_on) console.log(`[XP Tracker Refund] ${key} gives ${raceRefundMap[key]}`);
					}
				}
			}

			const previousRefund = parseInt(talentValues["skill_points_talent_refund"], 10) || 0;
			const refundDelta = refund - previousRefund;

			const skillSpent = parseInt(talentValues["total_skill_points_spent"], 10) || 0;
			const adjustedSkillSpent = skillSpent + refundDelta;

			const total = parseInt(values.xp_pool_total_talent, 10) || 0;
			const remaining = Math.max(0, total - spent);

			if (debug_on) {
				console.log(`[Old Refund]: ${previousRefund}`);
				console.log(`[New Refund]: ${refund}`);
				console.log(`[Delta Refund]: ${refundDelta}`);
				console.log(`[Original Skill Points Spent]: ${skillSpent}`);
				console.log(`[Adjusted Skill Points Spent]: ${adjustedSkillSpent}`);
			}

		setAttrs({
			xp_spent_talent: spent,
			xp_remaining_talent: remaining,
			skill_points_talent_refund: refund,
			total_skill_points_spent: adjustedSkillSpent
		});
	  });
	});
  });
};

// === Unified Talent Enable + Lock Enforcement ===
const updateTalentEnables = (race) => {
  if (debug_on_trace) console.log ("[updateTalentEnables] Start");
  const raceTalents = talentDataMap[race];
  if (!raceTalents) return;

  const allTalentKeys = Object.keys(raceTalents);
  const allTalentCheckboxes = allTalentKeys.map(k => `${race}_${k}`);
  const skillLockKeys = allTalentKeys.map(k => `${race}_${k}_lockflag_skill`);
  const backgroundAttr = `bg_${race}_talent`;
  const bgFlagAttrs = allTalentKeys.map(k => `${race}_${k}_from_background`);

  // Collect ALL prerequisite keys we must read: prerequisite (string or array) + prerequisiteAll (array)
  const allPrereqKeys = allTalentKeys.flatMap(k => {
    const t = raceTalents[k];
	const base = [];
	if (Array.isArray(t?.prerequisite)) base.push(...t.prerequisite);
	else if (typeof t?.prerequisite === "string" && t.prerequisite !== "") base.push(t.prerequisite);
	if (Array.isArray(t?.prerequisiteAll)) base.push(...t.prerequisiteAll);
	return base;
  });


  const prereqAttrKeys = [...new Set(allPrereqKeys)].map(pr => `${race}_${pr}`);
  const tier4Checkboxes = allTalentKeys.filter(k => raceTalents[k].tier === 4).map(k => `${race}_${k}`);

  const attrsToGet = [
    ...prereqAttrKeys,
    ...tier4Checkboxes,
    ...skillLockKeys,
    ...allTalentCheckboxes,
    ...bgFlagAttrs,
    backgroundAttr
  ];

  getAttrs(attrsToGet, function (values) {
    const selected = new Set(
      Object.entries(values)
        .filter(([k, v]) =>
          v === "1" ||
          v === `${race}_${k.replace(`${race}_`, "")}` ||
          k === backgroundAttr
        )
        .map(([k, v]) => {
          if (k === backgroundAttr && v.startsWith(`${race}_`)) {
            return v.replace(`${race}_`, "");
          }
          return k.replace(`${race}_`, "");
        })
    );

    const updates = {};
    const reverseMap = {};
    const lockFromPrereqAny = {};

    for (let [key, data] of Object.entries(raceTalents)) {
      if (Array.isArray(data.prerequisite)) {
        data.prerequisite.forEach(pr => {
          if (!reverseMap[pr]) reverseMap[pr] = new Set();
          reverseMap[pr].add(key);
        });
      }
    }

    const stillChecked = (k) => values[`${race}_${k}`] === "1";

    const isLocked = (target) => {
      const visited = new Set();
      const stack = [...(reverseMap[target] || [])];
      while (stack.length) {
        const current = stack.pop();
        if (visited.has(current)) continue;
        visited.add(current);
        const selected = stillChecked(current);
        const prereqs = raceTalents[current]?.prerequisite || [];
        const onlyThis = selected &&
          prereqs.includes(target) &&
          !prereqs.some(p => p !== target && stillChecked(p));
        if (onlyThis) return true;
        if (reverseMap[current]) reverseMap[current].forEach(t => stack.push(t));
      }
      return false;
    };

    const bgSelected = values[backgroundAttr];

    // === Enable flags
    for (let [key, data] of Object.entries(raceTalents)) {
      if (Array.isArray(data.prerequisite) && data.prerequisite.length > 0) {
        const unlocked = data.prerequisite.some(pr => selected.has(pr));
        updates[`${race}_${key}_enabled`] = unlocked ? "1" : "0";
        if (debug_on) console.log(`[Enable] ${key} => ${unlocked}`);
      } else {
        updates[`${race}_${key}_enabled`] = "1";
        if (debug_on) console.log(`[Enable] ${key} => Tier 1 default`);
      }
    }

	// === prerequisiteAll logic
	for (let [key, data] of Object.entries(raceTalents)) {
		if (Array.isArray(data.prerequisiteAll)) {
			const allMet = data.prerequisiteAll.every(pr => selected.has(pr));
			updates[`${race}_${key}_enabled`] = allMet ? "1" : "0";
			if (debug_on) console.log(`[PrereqAll] ${key} => ${allMet} (requires: ${data.prerequisiteAll.join(",")})`);
		}
	}

    // === prerequisiteAny logic
    for (let [key, data] of Object.entries(raceTalents)) {
      if (data?.prerequisiteAny?.tier != null && data?.prerequisiteAny?.count != null) {
        const tier = data.prerequisiteAny.tier;
        const count = data.prerequisiteAny.count;
        const staticReqs = Array.isArray(data.prerequisite) ? data.prerequisite : [];
        const sameTierKeys = allTalentKeys.filter(k => raceTalents[k].tier === tier && !staticReqs.includes(k));
        const checked = sameTierKeys.filter(k => values[`${race}_${k}`] === "1");
        const staticReqMet = staticReqs.length === 0 || staticReqs.some(p => values[`${race}_${p}`] === "1");
        const anyReqMet = checked.length >= count;

        updates[`${race}_${key}_enabled`] = staticReqMet && anyReqMet ? "1" : "0";
        updates[`${race}_${key}_sources`] = checked.slice(0, count).map(k => `${race}_${k}`).join(",");

        if (stillChecked(key) && staticReqMet && anyReqMet) {
          for (let src of checked.slice(0, count)) {
            updates[`${race}_${src}_lockflag`] = "1";
            if (!lockFromPrereqAny[src]) lockFromPrereqAny[src] = new Set();
            lockFromPrereqAny[src].add(key);
          }
        }

        if (debug_on) {
          console.log(`[PrereqAny] ${key} => static=${staticReqMet}, any=${anyReqMet}, checked=`, checked);
        }
      }
    }

    // === Capstone locks
    const tier4Selected = tier4Checkboxes.filter(k => values[k] === "1");
    const capstoneLock = tier4Selected.length > 0;
    for (let key of tier4Checkboxes) {
      updates[`${key}_lockflag`] = capstoneLock && values[key] !== "1" ? "1" : "0";
    }

    // === Background talent sync (check + uncheck)
    if (bgSelected) {
      const matchedTalent = bgSelected.replace(`${race}_`, "");
      if (raceTalents[matchedTalent]) {
        updates[`${race}_${matchedTalent}`] = "1";
        updates[`${race}_${matchedTalent}_from_background`] = "1";
      }
    }

    for (let [key, data] of Object.entries(raceTalents)) {
      const isTier1 = data.tier === 1;
      const isBG = `${race}_${key}` === bgSelected;
      const wasBG = values[`${race}_${key}_from_background`] === "1";
      const isLockedElsewhere = isLocked(key) || values[`${race}_${key}_lockflag_skill`] === "1";

      if (isTier1 && !isBG && wasBG && !isLockedElsewhere) {
        updates[`${race}_${key}`] = "0";
        updates[`${race}_${key}_from_background`] = "0";
      }
    }

    // === Final lock aggregation
    for (let key of allTalentKeys) {
      const prereqLock = isLocked(key) ? "1" : "0";
      const skillLock = values[`${race}_${key}_lockflag_skill`] || "0";
      const bgLock = bgSelected === `${race}_${key}` ? "1" : "0";
      const capLock = tier4Checkboxes.includes(`${race}_${key}`) && capstoneLock && values[`${race}_${key}`] !== "1" ? "1" : "0";
      const anyLock = lockFromPrereqAny[key] && lockFromPrereqAny[key].size > 0 ? "1" : "0";

      const finalLock = [prereqLock, skillLock, bgLock, capLock, anyLock].includes("1") ? "1" : "0";

      updates[`${race}_${key}_lockflag_prereq`] = prereqLock;
      updates[`${race}_${key}_lockflag`] = finalLock;

      if (debug_on) {
        console.log(`[Lock] ${key} => prereq:${prereqLock}, skill:${skillLock}, background:${bgLock}, capstone:${capLock}, any:${anyLock}`);
      }
    }
	
    // === Tracker visibility mirror
    for (let key of allTalentKeys) {
      const checked = values[`${race}_${key}`] === "1";
      updates[`show_${race}_${key}`] = checked ? "1" : "0";
	  if (debug_on) console.log(`update: show_${race}_${key} checked: ${checked}`);
    }
	
    const lockDebug = Object.fromEntries(
      Object.entries(updates).filter(([k]) => k.includes("lockflag") || k.includes("enabled"))
    );
    if (debug_on) console.log("[updateTalentEnables] Final lock/enabled updates:", lockDebug);

    setAttrs(updates);
  });
};

function applyRacialBaseStats(race) {
  if (debug_on_trace) console.log ("[applyRacialBaseStats(race)] Start");
  if (!raceDataMap[race] || !raceDataMap[race].stats) {
    if (debug_on) console.log("[applyRacialBaseStats] No stats found for race:", race);
    return;
  }

  const raceStats = raceDataMap[race].stats;
  const statKeys = ["str", "dex", "pow", "con", "app", "edu", "siz", "int", "mag"];

  getAttrs(statKeys, values => {
    const updates = {};

    statKeys.forEach(stat => {
      const currentRaw = values[stat];
      const current = parseInt(currentRaw, 10) || 0;
      const racialBase = raceStats[stat]?.base;

      if (isNaN(current) || current < racialBase) {
        updates[stat] = racialBase;
        if (debug_on) console.log(`[applyRacialBaseStats] ${stat.toUpperCase()} raised from ${current} to ${racialBase}`);
      }
    });

    if (Object.keys(updates).length > 0) {
      setAttrs(updates);
    }
  });
}

let lastRaceHandled = null;

function handleRaceChange(race) {
  if (debug_on_trace) console.log("[handleRaceChange] Start", { race });

  // ignore placeholder / unknown
  if (!raceDataMap || !raceDataMap[race] || race === "cr" || race === "unknown" || race === "0") return;

  // optional: keep your duplicate guard
  if (race === lastRaceHandled) {
    if (debug_on) console.log(`[handleRaceChange] Skipped duplicate init for race: ${race}`);
    return;
  }
  lastRaceHandled = race;

  // Register race-scoped watchers once (idempotent elsewhere)
  ensureRaceWatchers(race);

  // Pure state apply (no registrations inside)
  initializeRaceState(race);

  // Re-evaluate enables/locks once
  if (typeof updateTalentEnables === "function") updateTalentEnables(race);
}

// === Helpers & guards ===
let WATCHERS_BOOTSTRAPPED = false;

const isUnselectedRace = (r) => !r || r === "unknown" || r === "0" || r === "cr";

// Register race-scoped watchers when needed (idempotent via your existing handlers)
function ensureRaceWatchers(race) {
  if (registeredRaces.has(race)) return;

  // already in place
  if (typeof registerSkillHandler === "function") registerSkillHandler(race);

  // ADD THESE TWO LINES (race-scoped; idempotent inside each)
  if (typeof registerBackgroundSkillLimiter === "function") registerBackgroundSkillLimiter(race);
  if (typeof registerTalentSummaryWatcher === "function") registerTalentSummaryWatcher(race);

  registeredRaces.add(race);
}

// Build default skills + clear new flag (used once on first open with a real race)
const initNewCharacterSkills = () => {
    const updates = {};
    Object.entries(skillMapTable || {}).forEach(([_, { label, base, notes }]) => {
        const val = parseInt(base, 10) || 0;
        updates[`${label}_skill_mdr`] = val;
        updates[`${label}_mdr`]       = val;
        updates[`${label}_note`]      = notes || "";
    });
    updates.new_character_flag = "0";
    if (debug_on) console.log("[New Character Skill Init]", updates);
    return updates;
};

on("sheet:opened", () => {
    if (debug_on)       console.log("[sheet:opened] New Character check");
    if (debug_on_trace) console.log("[sheet:opened] Start");

    // Register global (race-agnostic) watchers ONCE
    if (!WATCHERS_BOOTSTRAPPED) {
        WATCHERS_BOOTSTRAPPED = true;
        registerAllTalentChangeWatchers();
        registerBackgroundTalentWatcher();
        registerBackgroundTalentWatchers();
        registerTalentSkillBonusWatchers();
        registerXPTrackerWatcher();
        registerStatHandler();
        registerCareerTabWatchers();
        registerBackgroundTabWatchers();
    }

    // Initial attribute normalization
    getAttrs(["showracials", "new_character_flag", "background_xp", "selected_tab", "character_id"], values => {
        const race  = values.showracials || "unknown";
        const isNew = values.new_character_flag === "1";
        const updates = {};
		
		updates.bonuspenalty_link = values.character_id ? `~${values.character_id}|bonuspenalty` : "";

        if (debug_on) console.log("[sheet:opened]", { race, isNew });

        // Only run new-character init when a real race is selected
        if (!isUnselectedRace(race) && isNew) {
            Object.assign(updates, initNewCharacterSkills()); // builds skill defaults & clears flag
        }

        // Ensure background XP is 30 (diff-only)
        const xp = parseInt(values.background_xp || "0", 10);
        if (xp !== 30) {
            updates.background_xp = 30;
            if (debug_on) console.log("Setting background_xp to 30");
        }

        const afterSet = () => {
            if (!isUnselectedRace(race)) {
                // Minimal, on-demand race watchers
                ensureRaceWatchers(race);

                // Seed/reset core values BEFORE recompute
                if (typeof resetAllMDRToBase === "function") resetAllMDRToBase();
                if (typeof setDefaultSkillBonuses === "function") setDefaultSkillBonuses(race);
                if (typeof setDefaultTalentBonuses === "function") setDefaultTalentBonuses(race);

                // Re-apply race state (pure state apply + internal recompute paths)
                initializeRaceState(race);

                // Re-evaluate enables/locks that gate UI (talents, etc.)
                if (typeof updateTalentEnables === "function") updateTalentEnables(race);

                // One-shot nudge so all change-watchers run once on load
                setAttrs({ recompute_nonce: String(Date.now()) });

//                if (isNew) populateCareerTalentDescriptions();
            }
        };

        if (Object.keys(updates).length) setAttrs(updates, afterSet);
        else afterSet();
    });
});

on("change:character_id", () => {
  getAttrs(["character_id"], (v) => {
    setAttrs(
      { bonuspenalty_link: v.character_id ? `~${v.character_id}|bonuspenalty` : "" },
      { silent:true }
    );
  });
});

function finalizeStrain(careerList, ipow, icon, update) {
    const bufferAttrs = careerList.map(career => `${career}_strain_buffer`);
    getAttrs(bufferAttrs, (bufferValues) => {
        const strainBuffer = bufferAttrs.reduce((sum, attr) => {
            return sum + parseInt(bufferValues[attr] || 0, 10);
        }, 0);

        const baseStrain = Math.floor((ipow + icon) / 5);
        update["strain_max"] = baseStrain + strainBuffer;

        if (debug_on) {
            console.log("[Strain Calc] Base:", baseStrain, "Buffer:", strainBuffer, "Total:", update.strain_max);
        }
		
		// Set attributes now that strain_max is finalized
		setAttrs(update);
    });

}

function calculateStrainMax(ipow, icon, update) {
    getAttrs(["primary_career"], (values) => {
        const careers = [];

        if (values.primary_career) {
            careers.push(values.primary_career);
        }

        getSectionIDs("repeating_secondarycareer", (ids) => {
            if (ids.length === 0) {
                finalizeStrain(careers, ipow, icon, update);
            } else {
                const secCareerAttrs = ids.map(id => `repeating_secondarycareer_${id}_secondary_career`);
                getAttrs(secCareerAttrs, (secValues) => {
                    ids.forEach(id => {
                        const careerName = secValues[`repeating_secondarycareer_${id}_secondary_career`];
                        if (careerName) {
                            careers.push(careerName);
                        }
                    });
                    finalizeStrain(careers, ipow, icon, update);
                });
            }
        });
    });
}

function registerStatHandler() {
	if (debug_on_trace) console.log ("[registerStatHandler] Start");
	
	const watched = [
		"age", "str", "dex", "pow", "con", "app", "edu", "siz", "int", "mag", "vitality", "char_creation_lock", "major_wounds",
		"primary_career",                         // Watch primary career changes
		"repeating_secondarycareer:secondary_career", // Watch for changes to career name
		"perk_resilient_frame", "perk_blood_born_survivor", "perk_blood_born_survivor_hp_bonus"
	];

	// Dynamically pull all strain buffer fields from careerDataMap
	Object.keys(careerDataMap).forEach(career => {
		watched.push(`${career}_strain_buffer`);
	});

    if (debug_on) console.log("[registerStatHandler Init] Watching:", watched);

    on(watched.map(s => `change:${s}`).join(" "), () => {
        getAttrs(watched, values => {
		    const iage = parseInt(values.age, 10) || 0;
			const istr = parseInt(values.str, 10) || 0;
			const idex = parseInt(values.dex, 10) || 0;
			const ipow = parseInt(values.pow, 10) || 0;
            const icon = parseInt(values.con, 10) || 0;
			const iapp = parseInt(values.app, 10) || 0;
            const iedu = parseInt(values.edu, 10) || 0;
            const isiz = parseInt(values.siz, 10) || 0;
            const iint = parseInt(values.int, 10) || 0;
            const imag = parseInt(values.mag, 10) || 0;
            const ivit = parseInt(values.vitality, 10) || 0;
			const iwound = parseInt(values.major_wounds, 10) || 0;
			const ichar_lock = parseInt(values.char_creation_lock, 10) || 0;

            const update = {};
			
			if ( ichar_lock === 0 ) {
				update["personal_skill_points"] = iint * 2;
			}

			// === Perk-driven Vitality bonuses ===
			// Resilient Frame: static +4 while perk is owned (permanent while checked)
			let perkVitalityBonus = (values.perk_resilient_frame === "1") ? 4 : 0;
			
			// Base Vitality is POW, then add perks
			update["vitality_max"] = ipow + perkVitalityBonus;

			update["pulphp_max"] = Math.floor((icon + isiz)/5);
			update["major_wounds"]= Math.floor(((icon + isiz)/5)/2);
			
			// Calculate strain max with career strain buffer
            calculateStrainMax(ipow, icon, update);

//			update["social_mode_toggle"] = (iapp <= 40 ) ? 1 : ( iapp >= 70 ) ? 2 : 0;
//			This is for using the template:coc-penalty and template:coc-bonus rolls. Changing the values so it's no longer using the extra roll without having to remove a bumch of code, till later.
			update["social_mode_toggle"] = (iapp <= 0 ) ? 1 : ( iapp >= 101 ) ? 2 : 0;
			// Attribute Points Total Calculation
			const statKeys = ["str", "dex", "pow", "con", "app", "edu", "siz", "int", "mag"];

			let totalAttrPointsSpent = 0;

			statKeys.forEach(stat => {
				const val = parseInt(values[stat], 10) || 0;
				totalAttrPointsSpent += val;
			});

			update["total_attr_points_spent"] = totalAttrPointsSpent;

            // Arcane Capcity = min(MAG, VITALITY)
            update.ac = Math.min(imag, ivit);

            // Damage Bonus and Build
            const siz_str_tot = istr + isiz;
            if (siz_str_tot < 65) {
                update.damage_bonus = "-2";
                update.build = "-2";
            } else if (siz_str_tot < 85) {
                update.damage_bonus = "-1";
                update.build = "-1";
            } else if (siz_str_tot < 125) {
                update.damage_bonus = "0";
                update.build = "0";
            } else if (siz_str_tot < 165) {
                update.damage_bonus = "1d4";
                update.build = "+1";
            } else if (siz_str_tot < 205) {
                update.damage_bonus = "1d6";
                update.build = "+2";
            } else if (siz_str_tot < 285) {
                update.damage_bonus = "2d6";
                update.build = "+3";
            } else if (siz_str_tot < 365) {
                update.damage_bonus = "3d6";
                update.build = "+4";
            } else if (siz_str_tot < 445) {
                update.damage_bonus = "4d6";
                update.build = "+5";
            } else if (siz_str_tot < 525) {
                update.damage_bonus = "5d6";
                update.build = "+6";
            }

			update.mdr_dex_crit_threshold = 1;
			update.mdr_dex_extreme_threshold = Math.floor(idex / 5);
			update.mdr_dex_hard_threshold = Math.floor(idex / 2);
			update.mdr_dex_normal_threshold = idex;
			update.mdr_dex_crit_value = 4000 + idex;
			update.mdr_dex_extreme_value = 3000 + idex;
			update.mdr_dex_hard_value = 2000 + idex;
			update.mdr_dex_normal_value = 1000 + idex;
			update.mdr_dex_fail_value = idex;

            if (debug_on) {
                console.log("[Stat Calc] STR+SIZ=", siz_str_tot);
                console.log("[Stat Calc] AC=", update.ac);
                console.log("[Stat Calc] DMG Bonus / Build=", update.damage_bonus, update.build);
            }

            setAttrs(update);
        });
    });
}

// === Background Skill Lock Enforcement (5 of 7) ===
const bgLimiterRegistered = new Set();

function registerBackgroundSkillLimiter(race){
  if (bgLimiterRegistered.has(race)) return;
  if (debug_on_trace) console.log ("[registerBackgroundSkillLimiter] Start"); 
  
  bgLimiterRegistered.add(race);
  
  const getBackgroundSkillAttrs = (race, background) => {
    const bgData = backgroundDataMap[race]?.[background];
    if (!bgData || !Array.isArray(bgData.trained_skills)) return [];
    return bgData.trained_skills.map(skill => `bg_${skill}_mdr_checkbox`);
  };

  const getLockAttrs = (skillAttrs) => skillAttrs.map(attr => `${attr}_lock`);

  const allRaces = Object.keys(backgroundDataMap);
  const backgroundChoiceAttrs = allRaces.map(r => `${r}_background_choice`);

  const allPossibleSkillAttrs = new Set();
  allRaces.forEach(race => {
    Object.values(backgroundDataMap[race]).forEach(bg => {
      if (Array.isArray(bg.trained_skills)) {
        bg.trained_skills.forEach(skill => allPossibleSkillAttrs.add(`bg_${skill}_mdr_checkbox`));
      }
    });
  });

  const allWatchers = Array.from(allPossibleSkillAttrs).map(attr => `change:${attr}`).concat(
    backgroundChoiceAttrs.map(attr => `change:${attr}`),
    "change:showracials"
  );

  on(allWatchers.join(" "), function () {
    getAttrs(["showracials", ...backgroundChoiceAttrs], function (baseValues) {
      const race = baseValues.showracials;
      const bgChoiceAttr = `${race}_background_choice`;
      const background = baseValues[bgChoiceAttr];
      const skillAttrs = getBackgroundSkillAttrs(race, background);
      const lockAttrs = getLockAttrs(skillAttrs);

      if (skillAttrs.length === 0) return;

		if (debug_on) {
			console.log(`[Skill Sync] Race: ${race}`);
			console.log(`[Skill Sync] Background: ${background}`);
			console.log(`[Skill Sync] Skill Attrs:`, skillAttrs);
		}

	  const mirroredMainCheckboxes = skillAttrs.map(attr =>
		attr.replace("bg_", "").replace("_mdr_checkbox", "") + "_mdr_checkbox"
	  );
	  const lockFields = skillAttrs.map(attr => `${attr}_lock`);

      getAttrs([...skillAttrs, ...mirroredMainCheckboxes, ...lockFields], function (values) {
        const checked = skillAttrs.filter(attr => values[attr] === "1");
        const updates = {};

        for (let i = 0; i < skillAttrs.length; i++) {
          const attr = skillAttrs[i];
          const lock = lockAttrs[i];
          updates[lock] = (checked.length >= 5 && values[attr] !== "1") ? "1" : "0";
        }

        if (debug_on) {
          console.log("[Limiter] Race:", race);
          console.log("[Limiter] Background:", background);
          console.log("[Limiter] Checked:", checked);
          console.log("[Limiter] Updates:", updates);
        }

        setAttrs(updates);
      });
    });
  });
};

// Common parser function
function parseDamageString(damageString, prefix) {
  if (debug_on_trace) console.log ("[parseDamageString] Start");
  const updates = {};

  const match = damageString.match(/^(\d+)[dD](\d+)([+\-]\d+)?$/);

  if (match) {
    const numDice = parseInt(match[1], 10) || 0;
    const diceSize = parseInt(match[2], 10) || 0;
    const bonus = parseInt(match[3], 10) || 0;
	console.log (`prefix: ${prefix}, numDice: ${numDice}, diceSize: ${diceSize}, bonus: ${bonus}`);

    updates[`${prefix}_damage_numdice`] = numDice;
    updates[`${prefix}_damage_dicesize`] = diceSize;
    updates[`${prefix}_damage_bonus`] = bonus;
  } else {
    updates[`${prefix}_damage_numdice`] = 0;
    updates[`${prefix}_damage_dicesize`] = 0;
    updates[`${prefix}_damage_bonus`] = 0;
  }

  return updates;
}

// ----------------------------------- Careers Secion START -----------------------------------
// === Primary Career XP Calculation ===
const registerPrimaryCareerXPWatcher = () => {
  if (debug_on_trace) console.log ("[registerPrimaryCareerXPWatcher] Start");
    const talentChangeEvents = Object.entries(careerDataMap)
        .flatMap(([careerKey, careerData]) =>
            Object.keys(careerData.talents || {}).map(talentKey => `change:${careerKey}_${talentKey}`)
        );

    const otherTriggers = [
        "change:primary_career",
        "change:primary_career_skill_to_xp",
        "change:primary_career_spell_xp_total",
        "change:str", "change:dex", "change:pow", "change:con",
        "change:app", "change:edu", "change:siz", "change:int", "change:mag",
		"change:char_creation_lock",
		"change:showracials",
		"change:repeating_secondarycareer:secondary_career_spell_xp_total",
		"change:repeating_secondarycareer:secondary_career_xp_total",
		"change:xpledger_recalc_tick"
		];

    const allEvents = [...talentChangeEvents, ...otherTriggers];

    on(allEvents.join(" "), function () {
       if (debug_on) console.log("=== Primary Career XP Calculation Triggered ===");

        getAttrs(["primary_career"], function (values) {
            const selectedCareer = values["primary_career"];
            const career = careerDataMap[selectedCareer];
            if (!career) return;

            const talentKeys = Object.keys(career.talents || {});
            const statKeys = ["str", "dex", "pow", "con", "app", "edu", "siz", "int", "mag"];
            const allKeysToGet = [
                ...statKeys,
                ...talentKeys.map(k => `${selectedCareer}_${k}`),
                "primary_career_skill_to_xp",
                "primary_career_spell_xp_total",
                "secondary_career_xp_total",
				"char_creation_lock",
				"showracials"
            ];

            getAttrs(allKeysToGet, function (values) {

				const ichar_lock = parseInt(values.char_creation_lock, 10) || 0;
				console.log (`Character lock: ${ichar_lock}`);
				const race = values.showracials || "";

					const statLookup = {};
					for (const stat of statKeys) {
						statLookup[stat] = parseInt(values[stat], 10) || 0;
					}

					let baseSkillPoints = 0;
					if (career.skill_points_primary_formula) {
						const { attributes, multipliers } = career.skill_points_primary_formula;
						for (let i = 0; i < attributes.length; i++) {
							const attr = attributes[i].toLowerCase();
							const multiplier = multipliers[i] || 1;
							baseSkillPoints += (statLookup[attr] || 0) * multiplier;
						}
					}
					
					if (race === "human") {
						baseSkillPoints += 20;
						if (debug_on) console.log("[Primary Career] +20 Human racial bonus applied to skill points");
					} else if (race === "kitsu") {
						baseSkillPoints += 20;
						if (debug_on) console.log("[Primary Career] +20 Kitsu racial bonus applied to skill points");
					}

                const skillToXP = parseInt(values["primary_career_skill_to_xp"], 10) || 0;
                const spellXpTotal = parseInt(values["primary_career_spell_xp_total"], 10) || career.spell_xp_primary;

                let talentXpSpent = -5;
                for (const [key, talent] of Object.entries(career.talents || {})) {
                    const attrName = `${selectedCareer}_${key}`;
                    if (values[attrName] === "1") {
                        const cost = parseInt(talent.cost, 10) || 0;
                        talentXpSpent += cost;
                        if (debug_on) console.log(`[Primary Talent XP] ${attrName} selected, +${cost} XP`);
                    }
                }

                const secondaryXp = parseInt(values["secondary_career_xp_total"], 10) || 0;

				const updates = {
					primary_career_spell_xp_total: spellXpTotal,
					primary_career_xp_spent: talentXpSpent,
					primary_career_xp_total: talentXpSpent,
					xp_spent_career_talent: talentXpSpent + secondaryXp
					};

				console.log (`Character lock: ${ichar_lock}`);
				if ( ichar_lock === 0 ) {
					updates.primary_career_skill_points = baseSkillPoints;
				}

                if (debug_on) console.log(`[Primary XP] Total Spent: ${talentXpSpent}`);
                if (debug_on) console.log(`[Primary XP] + Secondary XP: ${talentXpSpent + secondaryXp}`);

                setAttrs(updates);
            });
        });
    });
};

// === Secondary Career XP Calculation (Live + Accurate) ===
const registerSecondaryCareerXPWatcher = () => {
  if (debug_on_trace) console.log ("[registerSecondaryCareerXPWatcher] Start");
    const talentChangeEvents = Object.entries(careerDataMap)
        .flatMap(([careerKey, careerData]) =>
            Object.keys(careerData.talents || {}).map(talentKey => `change:${careerKey}_${talentKey}`)
        );

    const baseEvents = [
        "change:repeating_secondarycareer:secondary_career",
        "change:repeating_secondarycareer:secondary_career_skill_to_xp",
        "change:repeating_secondarycareer:secondary_career_spell_xp_total",
		"change:primary_career_xp_total",
		"change:xpledger_recalc_tick"
    ];

    on([...talentChangeEvents, ...baseEvents].join(" "), () => {
        if (debug_on) console.log("=== [XP Tracker] Secondary Career XP Calculation Triggered ===");

        getSectionIDs("repeating_secondarycareer", function (ids) {
			if (!ids || ids.length === 0) {
				if (debug_on_trace) console.log("[SecondaryCareerXP] No rows → zeroing totals");
				getAttrs(["secondary_career_xp_total", "xp_spent_career_talent"], (v) => {
					const updates = {};
					if ((v.secondary_career_xp_total || "0") !== "0") updates.secondary_career_xp_total = "0";
//					if ((v.xp_spent_career_talent || "0") !== "0") updates.xp_spent_career_talent = "0";
					if (Object.keys(updates).length) {
						// Not silent: intentionally trigger ledger summary watchers
						setAttrs(updates);
					}
				});
				return;
			}

            const attrList = ["primary_career_xp_total"];

            // Collect all needed attributes
            for (const rowId of ids) {
                const prefix = `repeating_secondarycareer_${rowId}_`;
                attrList.push(`${prefix}secondary_career`);
                attrList.push(`${prefix}secondary_career_skill_to_xp`);
                attrList.push(`${prefix}secondary_career_spell_xp_total`);
            }

            // Add all global flat checkbox names
            for (const [careerKey, careerData] of Object.entries(careerDataMap)) {
                for (const talentKey of Object.keys(careerData.talents || {})) {
                    attrList.push(`${careerKey}_${talentKey}`);
                }
            }

            getAttrs(attrList, function (values) {
                let totalSecondaryXP = 0;
				let totalSecondaryXPAdjusted = 0;

                for (const rowId of ids) {
                    const prefix = `repeating_secondarycareer_${rowId}_`;
                    const selectedCareer = values[`${prefix}secondary_career`];
                    if (!selectedCareer || !careerDataMap[selectedCareer]) continue;

                    const career = careerDataMap[selectedCareer];
                    let rowXP = 0;

                    for (const [talentKey, data] of Object.entries(career.talents || {})) {
                        const checkboxAttr = `${selectedCareer}_${talentKey}`;
                        const isChecked = values[checkboxAttr] === "1";
                        if (isChecked) {
                            const cost = parseInt(data.cost, 10) || 0;
                            rowXP += cost;
                            if (debug_on) console.log(`[Secondary XP] ${checkboxAttr} selected, +${cost} XP`);
                        }
                    }

                    const skillToXP = parseInt(values[`${prefix}secondary_career_skill_to_xp`], 10) || 0;
                    const spellXpTotal = parseInt(values[`${prefix}secondary_career_spell_xp_total`], 10) || career.spell_xp_secondary;
                    const xpTotal = rowXP - skillToXP;
                    totalSecondaryXP += rowXP;
					totalSecondaryXPAdjusted += xpTotal;

                    const rowUpdates = {
                        [`${prefix}secondary_career_skill_points`]: career.skill_points_secondary || 0,
                        [`${prefix}secondary_career_spell_xp_total`]: spellXpTotal,
                        [`${prefix}secondary_career_xp_spent`]: rowXP,
                        [`${prefix}secondary_career_xp_total`]: xpTotal
                    };

                    setAttrs(rowUpdates);
                    if (debug_on) console.log(`[Row ${rowId}] XP Spent: ${rowXP} | XP Total: ${xpTotal}`);
                }

				const finalUpdates = {
					secondary_career_xp_total: totalSecondaryXPAdjusted,
					xp_spent_career_talent: totalSecondaryXPAdjusted + (parseInt(values.primary_career_xp_total, 10) || 0)
				};

                setAttrs(finalUpdates);
				if (debug_on) console.log("[Global] Total Primary XP: ", (parseInt(values.primary_career_xp_total, 10) || 0) );
                if (debug_on) console.log(`[Global] Total Secondary XP: ${totalSecondaryXP}`);
                if (debug_on) console.log(`[Global] Combined Career Talent XP: ${finalUpdates.xp_spent_career_talent}`);
            });
        });
    });
};

const populateCareerTalentDescriptions = () => {
  const updates = {};
  Object.entries(careerDataMap).forEach(([career, data]) => {
    Object.entries(data.talents || {}).forEach(([key, talent]) => {
      updates[`${career}_${key}_label`] = talent.name;
      updates[`${career}_${key}_description`] = talent.description;
    });
  });
  setAttrs(updates);
};

// === Career Talent Summary Watcher (Static + Repeating) ===
// Uses translation.json keys (name_key / rule_text_key) instead of raw attr text.
const registerCareerTalentSummaryWatcher = () => {
  if (debug_on_trace) console.log("[registerCareerTalentSummaryWatcher] Start");

  const allCareerTalentKeys = Object.entries(careerDataMap)
    .flatMap(([career, data]) => Object.keys(data.talents || {}).map(tk => `${career}_${tk}`));

  // Listen for both static and repeating career talent toggles
  const staticCareerEvents = allCareerTalentKeys.map(k => `change:${k}`);
  const repeatingCareerEvents = allCareerTalentKeys.map(k => `change:repeating_secondarycareer:${k}`);

  // Also re-run if the primary career changes
  const allChangeEvents = [...staticCareerEvents, ...repeatingCareerEvents, "change:primary_career"];

  on(allChangeEvents.join(" "), function () {
    getAttrs(["primary_career"], function (values) {
      const primaryCareer = values["primary_career"];
      const summaries = { primary: [], secondary: [] };

      getSectionIDs("repeating_secondarycareer", function (ids) {
        // Build list of attrs we need to read (all static toggles + each repeating row’s toggle)
        const attrList = [];
        for (const [careerKey, careerData] of Object.entries(careerDataMap)) {
          for (const talentKey of Object.keys(careerData.talents || {})) {
            attrList.push(`${careerKey}_${talentKey}`);
            for (const id of ids) {
              attrList.push(`repeating_secondarycareer_${id}_${careerKey}_${talentKey}`);
            }
          }
        }

        getAttrs(attrList, function (talentValues) {
          for (const [careerKey, careerData] of Object.entries(careerDataMap)) {
            for (const [talentKey, talent] of Object.entries(careerData.talents || {})) {
              // Resolve i18n keys (fallbacks match our generation pattern)
              const nameKey = talent.name_key || `career_${careerKey}_${talentKey}-u`;
              const ruleKey = talent.rule_text_key || `career_${careerKey}_${talentKey}_rules-u`;

              const getT = (k) => (typeof getTranslationByKey === "function" ? getTranslationByKey(k) : null) || k;
              const tName = getT(nameKey);
              const tRules = getT(ruleKey);

              const line = `T${talent.tier}: ${tName} — ${tRules}`;

              // Static (primary vs secondary)
              const fullKey = `${careerKey}_${talentKey}`;
              if (talentValues[fullKey] === "1") {
                if (careerKey === primaryCareer) {
                  summaries.primary.push(line);
                } else {
                  summaries.secondary.push(line);
                }
              }

              // Repeating secondary careers
              for (const id of ids) {
                const repeatingKey = `repeating_secondarycareer_${id}_${careerKey}_${talentKey}`;
                if (talentValues[repeatingKey] === "1") {
                  summaries.secondary.push(line);
                }
              }
            }
          }

          setAttrs({
            primary_career_talent_summary: summaries.primary.length ? summaries.primary.join("\n\n") : " ",
            secondary_career_talent_summary: summaries.secondary.length ? summaries.secondary.join("\n\n") : " "
          });
        });
      });
    });
  });
};

// === Unified Career Talent Enable + Lock Enforcement ===
const updateCareerTalentEnables = (career) => {
  if (debug_on_trace) console.log ("[updateCareerTalentEnables] Start");
    const careerTalents = careerDataMap[career]?.talents;
    if (!careerTalents) return;

    const allTalentKeys = Object.keys(careerTalents);
    const allTalentCheckboxes = allTalentKeys.map(k => `${career}_${k}`);
    const skillLockKeys = allTalentKeys.map(k => `${career}_${k}_lockflag_skill`);
//    const tier5Checkboxes = allTalentKeys.filter(k => careerTalents[k].tier === 5).map(k => `${career}_${k}`);
	const capstoneCheckboxes = allTalentKeys.filter(k => careerTalents[k]?.capstone === true).map(k => `${career}_${k}`);

    const allPrereqKeys = allTalentKeys.flatMap(k => {
        const t = careerTalents[k];
        const base = [];
        if (Array.isArray(t?.prerequisite)) base.push(...t.prerequisite);
        else if (typeof t?.prerequisite === "string" && t.prerequisite !== "") base.push(t.prerequisite);
        if (Array.isArray(t?.prerequisiteAll)) base.push(...t.prerequisiteAll);
        return base;
    });

    const prereqAttrKeys = [...new Set(allPrereqKeys)].map(pr => `${career}_${pr}`);
    const attrsToGet = [
        ...prereqAttrKeys,
        ...capstoneCheckboxes,
        ...skillLockKeys,
        ...allTalentCheckboxes
    ];

    getAttrs(attrsToGet, function (values) {
        const selected = new Set(
            Object.entries(values)
                .filter(([k, v]) => v === "1")
                .map(([k]) => k.replace(`${career}_`, ""))
        );

        const updates = {};
        const reverseMap = {};

        for (let [key, data] of Object.entries(careerTalents)) {
            const prereqs = [];
            if (Array.isArray(data.prerequisite)) prereqs.push(...data.prerequisite);
            else if (typeof data.prerequisite === "string" && data.prerequisite !== "") prereqs.push(data.prerequisite);
            (prereqs || []).forEach(pr => {
                if (!reverseMap[pr]) reverseMap[pr] = new Set();
                reverseMap[pr].add(key);
            });
        }

        // === Track any talent used to satisfy prerequisiteAny ===
        const lockFromPrereqAny = new Set();

        const stillChecked = (k) => values[`${career}_${k}`] === "1";

        const isLocked = (target) => {
            const visited = new Set();
            const stack = [...(reverseMap[target] || [])];
            while (stack.length) {
                const current = stack.pop();
                if (visited.has(current)) continue;
                visited.add(current);
                const selectedCurrent = stillChecked(current);
                const prereqs = [];
                const raw = careerTalents[current]?.prerequisite;
                if (Array.isArray(raw)) prereqs.push(...raw);
                else if (typeof raw === "string" && raw !== "") prereqs.push(raw);
                const onlyThis = selectedCurrent &&
                    prereqs.includes(target) &&
                    !prereqs.some(p => p !== target && stillChecked(p));
                if (onlyThis) return true;
                if (reverseMap[current]) reverseMap[current].forEach(t => stack.push(t));
            }
            return false;
        };

        // === Enable flags (prerequisite)
        for (let [key, data] of Object.entries(careerTalents)) {
            if ((Array.isArray(data.prerequisite) && data.prerequisite.length > 0) || (typeof data.prerequisite === "string" && data.prerequisite !== "")) {
                const prereqList = Array.isArray(data.prerequisite) ? data.prerequisite : [data.prerequisite];
                const unlocked = prereqList.some(pr => selected.has(pr));
                updates[`${career}_${key}_enabled`] = unlocked ? "1" : "0";
            } else {
                updates[`${career}_${key}_enabled`] = data.tier === 1 ? "1" : "0"; // Disable T2+ by default
            }
        }

        // === prerequisiteAll logic
        for (let [key, data] of Object.entries(careerTalents)) {
            if (Array.isArray(data.prerequisiteAll)) {
                const allMet = data.prerequisiteAll.every(pr => selected.has(pr));
                updates[`${career}_${key}_enabled`] = allMet ? "1" : "0";
            }
        }

        // === prerequisiteAny logic
        for (let [key, data] of Object.entries(careerTalents)) {
            if (data?.prerequisiteAny?.tier != null && data?.prerequisiteAny?.count != null) {
                const tier = data.prerequisiteAny.tier;
                const count = data.prerequisiteAny.count;
                const staticReqs = Array.isArray(data.prerequisite) ? data.prerequisite : (typeof data.prerequisite === "string" && data.prerequisite !== "") ? [data.prerequisite] : [];
                const sameTierKeys = allTalentKeys.filter(k => careerTalents[k].tier === tier && !staticReqs.includes(k));
                const checked = sameTierKeys.filter(k => values[`${career}_${k}`] === "1");
                const staticReqMet = staticReqs.length === 0 || staticReqs.some(p => values[`${career}_${p}`] === "1");
                const anyReqMet = checked.length >= count;

                updates[`${career}_${key}_enabled`] = staticReqMet && anyReqMet ? "1" : "0";
                updates[`${career}_${key}_sources`] = checked.slice(0, count).map(k => `${career}_${k}`).join(",");

                if (stillChecked(key) && staticReqMet && anyReqMet) {
                    for (let src of checked.slice(0, count)) {
                        lockFromPrereqAny.add(src);
                    }
                }
            }
        }

        // === Capstone locks
        const capstoneSelected = capstoneCheckboxes.filter(k => values[k] === "1");
        const capstoneLock = capstoneSelected.length > 0;
        for (let key of capstoneCheckboxes) {
            updates[`${key}_lockflag`] = capstoneLock && values[key] !== "1" ? "1" : "0";
        }

        // === Final lock aggregation
        for (let key of allTalentKeys) {
            const prereqLock = isLocked(key) ? "1" : "0";
            const skillLock = values[`${career}_${key}_lockflag_skill`] || "0";
            const capLock = capstoneCheckboxes.includes(`${career}_${key}`) && capstoneLock && values[`${career}_${key}`] !== "1" ? "1" : "0";
            const prereqAnyLock = lockFromPrereqAny.has(key) ? "1" : "0";
			const checked = values[`${career}_${key}`] === "1";

            const finalLock = [prereqLock, skillLock, capLock, prereqAnyLock].includes("1") ? "1" : "0";

            updates[`${career}_${key}_lockflag_prereq`] = prereqLock;
            updates[`${career}_${key}_lockflag`] = finalLock;
			updates[`show_${career}_${key}`] = checked ? "1" : "0";
        }
		
        setAttrs(updates);
    });
};

on("clicked:toggle_career_skills", () => {
  if (debug_on_trace) console.log ("[clicked:toggle_career_skills] Start");
  getAttrs(["show_career_skills"], values => {
    setAttrs({
      show_career_skills: values.show_career_skills === "1" ? "0" : "1"
    });
  });
});

// Apply exclusive-skill-set behavior to a list of skills for a given career/context
const applyExclusiveToSkillList = (careerKey, skills, makeAttrName) => {
  if (debug_on_trace) console.log ("[applyExclusiveToSkillList] Start");
    const sets = (careerDataMap[careerKey]?.exclusive_skill_sets || [])
        .map(set => set.filter(s => skills.includes(s)))   // keep only skills from this list
        .filter(set => set.length > 1);                    // ignore singletons / empties
    if (!sets.length) return;

    const want = [];
    sets.forEach(set => set.forEach(skill => {
        const n = makeAttrName(skill);
        want.push(n, `${n}_lock`);
    }));

    getAttrs(want, values => {
        const update = {};
        sets.forEach(set => {
            const checked = set.filter(skill => values[makeAttrName(skill)] === "1");

            if (checked.length === 1) {
                // one chosen → lock the rest, leave the chosen unlocked
                const chosen = checked[0];
                set.forEach(skill => {
                    const n = makeAttrName(skill);
                    update[`${n}_lock`] = (skill === chosen) ? "0" : "1";
                });
            } else if (checked.length > 1) {
                // more than one → keep the first, uncheck+lock the others
                const chosen = checked[0];
                set.forEach(skill => {
                    const n = makeAttrName(skill);
                    if (skill === chosen) {
                        update[`${n}_lock`] = "0";
                    } else {
                        update[n] = "0";
                        update[`${n}_lock`] = "1";
                    }
                });
            } else {
                // none chosen → unlock all members of the set
                set.forEach(skill => {
                    const n = makeAttrName(skill);
                    update[`${n}_lock`] = "0";
                });
            }
        });

        if (Object.keys(update).length) setAttrs(update, { silent: true });
    });
};

// === Career Skill Lock Enforcement ===
const registerCareerSkillLimiter = () => {
  if (debug_on_trace) console.log ("[registerCareerSkillLimiter] Start");
  getAttrs(["primary_career"], values => {
    const primaryCareer = values["primary_career"] || "[None]";
    if (debug_on) console.log("[Career Debug] Primary Career:", primaryCareer);

    const getCareerSkillAttrs = (career, type) => {
      const skillMap = careerDataMap[career]?.[`${type}_skills`] || {};
      if (!Array.isArray(skillMap) && typeof skillMap !== "object") return [];
      return Object.keys(skillMap).map(skill => `cs_${career}_${skill}_mdr_checkbox`);
    };

    const getLockAttrs = (skillAttrs) => skillAttrs.map(attr => `${attr}_lock`);

    // === Handle Primary Career ===
    if (careerDataMap[primaryCareer]) {
      const priAttrs = getCareerSkillAttrs(primaryCareer, "primary");
      const secAttrs = getCareerSkillAttrs(primaryCareer, "secondary");
      const lockAttrs = getLockAttrs(secAttrs);
      const exclusiveSets = careerDataMap[primaryCareer]?.exclusive_skill_sets || [];
      const exclusiveSkills = new Set(exclusiveSets.flat());

      // NEW: Apply exclusive-set behavior to PRIMARY skills (if defined)
      if (exclusiveSets.length) {
        const priSkills = Object.keys(careerDataMap[primaryCareer]?.primary_skills || {});
        applyExclusiveToSkillList(
          primaryCareer,
          priSkills,
          (skill) => `cs_${primaryCareer}_${skill}_mdr_checkbox`
        );
      }

      getAttrs([...priAttrs, ...secAttrs, ...lockAttrs], values => {
        const updates = {};

        if (debug_on) console.log(`[Career Lock][Primary Career: ${primaryCareer}]`);
        if (debug_on) console.log("  → Primary Attrs:", priAttrs);
        if (debug_on) console.log("  → Secondary Attrs:", secAttrs);

        // === Enforce Exclusive Skill Set Logic Only (SECONDARY skills) ===
        exclusiveSets.forEach(set => {
          const checkedSkill = set.find(skill => values[`cs_${primaryCareer}_${skill}_mdr_checkbox`] === "1");
          set.forEach(skill => {
            const checkbox = `cs_${primaryCareer}_${skill}_mdr_checkbox`;
            const lock = `${checkbox}_lock`;
            if (checkedSkill && skill !== checkedSkill) {
              updates[checkbox] = "0";
              updates[lock] = "1";
            } else {
              updates[lock] = "0";
            }
          });
        });

        // === Unlock all non-exclusive secondary skills ===
        secAttrs.forEach(attr => {
          const skill = attr.replace(/^cs_.*?_/, '').replace('_mdr_checkbox', '');
          const lockAttr = `${attr}_lock`;
          if (!exclusiveSkills.has(skill)) {
            updates[lockAttr] = "0";
          }
        });
		
        // === NEW: Primary 4-choice cap (only when NO exclusive sets) ===
        // Pilot qualifies (5 primary skills).
        if (!exclusiveSets.length) {
          const MAX_PRI = 4;
          if (priAttrs.length > MAX_PRI) {
            const priChecked = priAttrs.filter(a => values[a] === "1");
            priAttrs.forEach(attr => {
              const lockAttr = `${attr}_lock`;
              // Lock any unchecked boxes once 4 are chosen; unlock otherwise
              updates[lockAttr] = (priChecked.length >= MAX_PRI && values[attr] !== "1") ? "1" : "0";
            });
          } else {
            // Ensure no stale locks if a career has ≤ 4 primaries
            priAttrs.forEach(attr => { updates[`${attr}_lock`] = "0"; });
          }
        }		

        if (debug_on) console.log("  → Updates (Primary):", updates);
        setAttrs(updates);
      });
    }

    // === Handle Repeating Secondary Careers ===
    getSectionIDs("repeating_secondarycareer", ids => {
      const careerAttrs = ids.map(id => `repeating_secondarycareer_${id}_secondary_career`);
      getAttrs(careerAttrs, names => {
        ids.forEach(id => {
          const secCareer = names[`repeating_secondarycareer_${id}_secondary_career`];
          if (!careerDataMap[secCareer]) return;

          const priAttrs = getCareerSkillAttrs(secCareer, "primary");
          const secAttrs = getCareerSkillAttrs(secCareer, "secondary");
          const lockAttrs = getLockAttrs(secAttrs);
          const allAttrs = [...priAttrs, ...secAttrs, ...lockAttrs];

          // NEW: Apply exclusive-set behavior to PRIMARY skills for this secondary career (if defined)
          const scExclusiveSets = careerDataMap[secCareer]?.exclusive_skill_sets || [];
          if (scExclusiveSets.length) {
            const scPriSkills = Object.keys(careerDataMap[secCareer]?.primary_skills || {});
            applyExclusiveToSkillList(
              secCareer,
              scPriSkills,
              (skill) => `cs_${secCareer}_${skill}_mdr_checkbox`
            );
          }

          getAttrs(allAttrs, values => {
            const updates = {};

            if (debug_on) console.log(`[Career Lock][Secondary Career: ${secCareer}]`);
            if (debug_on) console.log("  → Primary Attrs:", priAttrs);
            if (debug_on) console.log("  → Secondary Attrs:", secAttrs);

            // Existing "choose 1" lock logic across ALL secondary skills for this row
            const selected = secAttrs.filter(attr => values[attr] === "1");
            secAttrs.forEach(attr => {
              const lock = `${attr}_lock`;
              updates[lock] = selected.length >= 1 && values[attr] !== "1" ? "1" : "0";
            });

            // === NEW: Primary 4-choice cap for this secondary career row (no exclusives) ===
            if (!scExclusiveSets.length) {
              const MAX_PRI = 4;
              if (priAttrs.length > MAX_PRI) {
                const priChecked = priAttrs.filter(a => values[a] === "1");
                priAttrs.forEach(attr => {
                  const lockAttr = `${attr}_lock`;
                  updates[lockAttr] = (priChecked.length >= MAX_PRI && values[attr] !== "1") ? "1" : "0";
                });
              } else {
                priAttrs.forEach(attr => { updates[`${attr}_lock`] = "0"; });
              }
            }
			
            if (debug_on) console.log("  → Updates (Secondary):", updates);
            setAttrs(updates);
          });
        });
      });
    });
  });
};

// === Watcher for Primary Career Exclusive Secondary Skills ===
const registerPrimaryExclusiveSkillWatchers = () => {
  if (debug_on_trace) console.log ("[registerPrimaryExclusiveSkillWatchers] Start");
  getAttrs(["primary_career"], values => {
    const primaryCareer = values.primary_career;
    const careerData = careerDataMap[primaryCareer];
    if (!careerData || !Array.isArray(careerData.exclusive_skill_sets)) return;

    const exclusiveSkills = [...new Set(careerData.exclusive_skill_sets.flat())];
    const watchEvents = exclusiveSkills.map(skill => `change:cs_${primaryCareer}_${skill}_mdr_checkbox`);

    if (watchEvents.length) {
      on(watchEvents.join(" "), () => {
        if (debug_on) console.log("[Career Lock] Exclusive secondary skill toggled for primary career");
        registerCareerSkillLimiter();
      });
    }
  });
};

// === Dynamic Watcher for Career Skill Checkboxes (primary + secondary; base + repeating) ===
const registerActiveSecondaryCareerWatchers = () => {
  if (debug_on_trace) console.log ("[registerActiveSecondaryCareerWatchers] Start");
  const watchEvents = [];

  Object.entries(careerDataMap).forEach(([career, data]) => {
    const priSkills = Object.keys(data.primary_skills || {});
    const secSkills = Object.keys(data.secondary_skills || {});

    // Non-repeating (Primary Career block)
    priSkills.forEach(skill => watchEvents.push(`change:cs_${career}_${skill}_mdr_checkbox`));
    secSkills.forEach(skill => watchEvents.push(`change:cs_${career}_${skill}_mdr_checkbox`));

    // Repeating (Secondary Careers block)
    priSkills.forEach(skill => watchEvents.push(`change:repeating_secondarycareer:cs_${career}_${skill}_mdr_checkbox`));
    secSkills.forEach(skill => watchEvents.push(`change:repeating_secondarycareer:cs_${career}_${skill}_mdr_checkbox`));
  });

  if (debug_on) console.log("[Career Lock] Registering watchers for ALL career skill checkboxes:", watchEvents);
  if (watchEvents.length) {
    on(watchEvents.join(" "), () => {
      if (debug_on) console.log("[Career Lock] Career skill checkbox changed");
      registerCareerSkillLimiter();
    });
  }
};

// Helper: build a map of { careerKey: boolean } if any capstone talent is checked (static or repeating)
const getHasCapstoneMap = (careers, cb) => {
  const capstoneKeysByCareer = {};
  const staticAttrs = [];
  const isChecked = v => v === "1" || v === "on" || v === "true";

  careers.forEach(c => {
    const caps = Object.entries(careerDataMap[c]?.talents || {})
      .filter(([, t]) => t.capstone === true)
      .map(([tk]) => tk);
    capstoneKeysByCareer[c] = caps;
    caps.forEach(tk => staticAttrs.push(`${c}_${tk}`));
  });

  getSectionIDs("repeating_secondarycareer", (_ids) => {
    const ids = _ids || [];
    const repAttrs = [];
    ids.forEach(id => {
      Object.entries(capstoneKeysByCareer).forEach(([c, caps]) => {
        caps.forEach(tk => repAttrs.push(`repeating_secondarycareer_${id}_${c}_${tk}`));
      });
    });

    const need = [...staticAttrs, ...repAttrs];

    // If no capstones defined anywhere, return a fully false map
    if (need.length === 0) {
      const none = {};
      careers.forEach(c => (none[c] = false));
      return cb(none);
    }

    getAttrs(need, values => {
      const has = {};
      careers.forEach(c => {
        const caps = capstoneKeysByCareer[c] || [];
        const staticHit = caps.some(tk => isChecked(values[`${c}_${tk}`]));
        const repeatingHit = ids.some(id =>
          caps.some(tk => isChecked(values[`repeating_secondarycareer_${id}_${c}_${tk}`]))
        );
        has[c] = !!(staticHit || repeatingHit);
      });
      cb(has);
    });
  });
};


// Helper: evaluate your entry_requirements (supports all/any, skill, group, capstone)
// DROP-IN: extends capstone checks to support `career_type` and `career_types`
// Signature unchanged: (req, values, hasCapstone, traceKey)
const evalEntryRequirements = (req, values, hasCapstone, traceKey) => {
  if (!req) return true;

  // Build a derived map of capstones by career_type without changing callers.
  // hasCapstone = { "<careerKey>": true/false } (from getHasCapstoneMap)
  const hasCapstoneByType = {};
  Object.keys(hasCapstone || {}).forEach((careerKey) => {
    if (!hasCapstone[careerKey]) return;
    const t = (careerDataMap[careerKey] && careerDataMap[careerKey].career_type) || "";
    if (t) hasCapstoneByType[t] = true;
  });

  const test = (node) => {
    if (node.all) return node.all.every(test);
    if (node.any) return node.any.some(test);

    switch (node.type) {
      case "skill": {
        const v = parseInt(values[`${node.key}_mdr`] || values[node.key] || "0", 10) || 0;
        return v >= (node.min || 0);
      }

      case "group": {
        const keys = node.keys || [];
        const min = node.min || 0;
        const count = node.count || 0;
        let hits = 0;
        keys.forEach(k => {
          const v = parseInt(values[`${k}_mdr`] || values[k] || "0", 10) || 0;
          if (v >= min) hits += 1;
        });
        return hits >= count;
      }

      case "capstone": {
        // Backward-compatible:
        // { key: "<career>" } — exactly this career has a capstone
        if (node.key) return !!hasCapstone[node.key];

        // { keys: ["marksman","operator"] } — any of these careers has a capstone
        if (Array.isArray(node.keys) && node.keys.length) {
          return node.keys.some(k => !!hasCapstone[k]);
        }

        // New:
        // { career_type: "arcane" } — any career of this type has a capstone
        if (node.career_type) {
          return !!hasCapstoneByType[node.career_type];
        }

        // { career_types: ["arcane","core"] } — any of these types has a capstone
        if (Array.isArray(node.career_types) && node.career_types.length) {
          return node.career_types.some(t => !!hasCapstoneByType[t]);
        }

        return false;
      }

      default:
        return false;
    }
  };

  return test(req);
};

const updateCareerReadyState = (callback) => {
  if (debug_on_trace) console.log("[updateCareerReadyState] Start");
  const allCareers = Object.keys(careerDataMap);
  const output = {};

  getAttrs(["primary_career"], values => {
    const primary = values.primary_career || "";

    // default all to "0"
    allCareers.forEach(c => output[`${c}_ready`] = "0");

    // collect skill attrs needed by any entry_requirements
    const skillKeys = new Set();
    const collect = n => {
      if (!n) return;
      if (n.all) n.all.forEach(collect);
      if (n.any) n.any.forEach(collect);
      if (n.type === "skill") skillKeys.add(n.key);
      if (n.type === "group" && Array.isArray(n.keys)) n.keys.forEach(k => skillKeys.add(k));
    };
    allCareers.forEach(c => collect(careerDataMap[c]?.entry_requirements));

    const need = [];
    skillKeys.forEach(k => { need.push(k, `${k}_mdr`); });

    getAttrs(need, skillVals => {
      getHasCapstoneMap(allCareers, hasCapstone => {
        // Primary
        if (!careerDataMap[primary] || evalEntryRequirements(careerDataMap[primary].entry_requirements, skillVals, hasCapstone)) {
          if (careerDataMap[primary]) output[`${primary}_ready`] = "1";
        }

        // Secondary rows
        getSectionIDs("repeating_secondarycareer", ids => {
          if (ids.length) {
            const keys = ids.map(id => `repeating_secondarycareer_${id}_secondary_career`);
            getAttrs(keys, entries => {
              ids.forEach(id => {
                const key = entries[`repeating_secondarycareer_${id}_secondary_career`] || "";
                if (!key || !careerDataMap[key]) return;
                if (evalEntryRequirements(careerDataMap[key].entry_requirements, skillVals, hasCapstone)) {
                  output[`${key}_ready`] = "1";
                }
              });
              if (debug_on) console.log("[updateCareerReadyState] Final Output:", output);
              setAttrs(output, { silent: true }, callback);
            });
          } else {
            if (debug_on) console.log("[updateCareerReadyState] Final Output:", output);
            setAttrs(output, { silent: true }, callback);
          }
        });
      });
    });
  });
};

// === Skill Mirror Watcher (deterministic and precise) ===
const mirrorSkillCheckboxes = () => {
  if (debug_on_trace) console.log ("[mirrorSkillCheckboxes] Start");
  const skillMap = {};  // skill → [checkbox attr names]
  const skillAttrs = [];

  // Add CS skill checkboxes
  Object.keys(careerDataMap).forEach(career => {
    const pri = Object.keys(careerDataMap[career]?.primary_skills || {});
    const sec = Object.keys(careerDataMap[career]?.secondary_skills || {});
    [...pri, ...sec].forEach(skill => {
      const attr = `cs_${career}_${skill}_mdr_checkbox`;
	if (!skillMap[skill]) skillMap[skill] = new Set();
	skillMap[skill].add(attr);

      skillAttrs.push(attr);
    });
  });

  // Add BG skill checkboxes
  Object.keys(backgroundDataMap).forEach(race => {
    Object.values(backgroundDataMap[race] || {}).forEach(bg => {
      (bg.trained_skills || []).forEach(skill => {
        const attr = `bg_${skill}_mdr_checkbox`;

	if (!skillMap[skill]) skillMap[skill] = new Set();
	skillMap[skill].add(attr);

        skillAttrs.push(attr);
      });
    });
  });
  
  getAttrs(skillAttrs, values => {
    const updates = {};

	Object.entries(skillMap).forEach(([skill, sourceSet]) => {
	const sources = Array.from(sourceSet);
	const active = sources.some(source => values[source] === "1");
	updates[`${skill}_mdr_checkbox`] = active ? "1" : "0";

	if (debug_on) console.log(`[Mirror Watcher] ${skill}_mdr_checkbox ← ${active ? "1" : "0"} (sources: ${sources.join(", ")})`);
	});
	
    if (debug_on) console.log("[Mirror Watcher] Final Updates:", updates);
    setAttrs(updates, { silent: true });
  });
};

const registerMirrorSkillWatcher = () => {
  if (debug_on_trace) console.log ("[registerMirrorSkillWatcher] Start");
  const csAttrs = Object.keys(careerDataMap)
    .flatMap(career => {
      const careerSkills = [
        ...Object.keys(careerDataMap[career]?.primary_skills || {}),
        ...Object.keys(careerDataMap[career]?.secondary_skills || {})
      ];
      return careerSkills.map(skill => `change:cs_${career}_${skill}_mdr_checkbox`);
    });

	const bgAttrs = Object.keys(backgroundDataMap)
		.flatMap(race => Object.values(backgroundDataMap[race] || {}))
		.flatMap(bg => bg.trained_skills || [])
		.map(skill => `change:bg_${skill}_mdr_checkbox`);

  const allEvents = [...new Set([...csAttrs, ...bgAttrs])];
  if (debug_on) console.log ("allEvents:", allEvents);

  on(allEvents.join(" "), mirrorSkillCheckboxes);
};

// Clears tracker reveal + used flags for an entire career
const clearCareerTrackers = (career) => {
    const updates = {};
    const talents = (careerDataMap[career] && careerDataMap[career].talents) || {};

    Object.entries(talents).forEach(([talentKey, meta]) => {
        // Always clear the reveal flag so the tracker hides
        updates[`show_${career}_${talentKey}`] = "0";

        // Clear the usage checkbox that matches the talent's limit
        if (meta.usage_limit === "session") {
            updates[`used_session_${career}_${talentKey}`] = "0";
        } else if (meta.usage_limit === "scene") {
            updates[`used_scene_${career}_${talentKey}`] = "0";
        }
        // No-restriction talents don't have a per-scene/session tracker; nothing to clear there.
    });

    setAttrs(updates);
};

const cleanupInactiveCareers = () => {
  if (debug_on_trace) console.log("[cleanupInactiveCareers] Start");

  const readyKeys = Object.keys(careerDataMap).map(c => `${c}_ready`);

  getAttrs(readyKeys, values => {
    const updates = {};

    Object.keys(careerDataMap).forEach(career => {
      const isReady = values[`${career}_ready`] === "1";
      if (isReady) return; // only clear INACTIVE careers

      // --- Clear career skill checkboxes/locks ---
      const priSkills = Object.keys(careerDataMap[career].primary_skills || {});
      const secSkills = Object.keys(careerDataMap[career].secondary_skills || {});
      const allSkills = [...priSkills, ...secSkills];

      allSkills.forEach(skill => {
        updates[`cs_${career}_${skill}_mdr_checkbox`] = "0";
        updates[`cs_${career}_${skill}_mdr_checkbox_lock`] = "0";
      });

      // --- Clear talents + their trackers (reveal + used) and gates ---
      const talents = careerDataMap[career].talents || {};
      Object.entries(talents).forEach(([talentKey, meta = {}]) => {
        // Uncheck the talent itself
        updates[`${career}_${talentKey}`] = "0";

        // Hide from tracker
        updates[`show_${career}_${talentKey}`] = "0";

        // Clear the appropriate usage box if it exists for this talent
		const lim = meta?.usage_limit ?? "";
		
		if (hasLimit(lim, "session")) {
			updates[`used_session_${career}_${talentKey}`] = "0";
		}
		
		if (hasLimit(lim, "scene")) {
		updates[`used_scene_${career}_${talentKey}`] = "0";
		}


        // Reset gates so nothing remains visually enabled/locked for an inactive career
        updates[`${career}_${talentKey}_enabled`] = "0";
        updates[`${career}_${talentKey}_lockflag`] = "0";
      });
    });

    // Silent batch so we don't trigger watcher storms
    setAttrs(updates, { silent: true }, mirrorSkillCheckboxes);
	setAttrs({ xpledger_recalc_tick: String(Date.now()) });

    if (debug_on) console.log("[Career Cleanup] Inactive careers cleared:", updates);
  });
};

// --- Cleanup Inactive Careers (low-chatter triggers) ---
const runCleanupInactiveCareers = () => {
    if (debug_on_trace) console.log("[cleanupInactiveCareers] run");
    beginSilent();
    cleanupInactiveCareers();
    endSilent();
};

const hasLimit = (val, limit) => Array.isArray(val) ? val.includes(limit) : val === limit;

const getUsageLimitedTalentNames = (limitType) => {
  const names = [];

  // Perks (e.g. used_scene_perk_dirty_fighter, used_session_perk_mind_leash)
  for (const key in (perkDataMap || {})) {
    const lim = perkDataMap[key]?.usage_limit ?? "";
    if (hasLimit(lim, limitType)) {
      names.push(`used_${limitType}_perk_${key}`);
    }
  }

  // Flaws (e.g. used_scene_flaw_soul_flare, used_session_flaw_hunted)
  for (const key in (flawDataMap || {})) {
    const lim = flawDataMap[key]?.usage_limit ?? "";
    if (hasLimit(lim, limitType)) {
      names.push(`used_${limitType}_flaw_${key}`);
    }
  }

  // Racial traits
  for (const race in raceDataMap) {
    const traits = raceDataMap[race]?.traits?.items || {};
    for (const key in traits) {
      const lim = traits[key]?.usage_limit ?? "";
      if (hasLimit(lim, limitType)) {
        names.push(`used_${limitType}_${race}_${key}`);
      }
    }
  }

  // Racial talents
  for (const race in talentDataMap) {
    const talents = talentDataMap[race] || {};
    for (const key in talents) {
      const lim = talents[key]?.usage_limit ?? "";
      if (hasLimit(lim, limitType)) {
        names.push(`used_${limitType}_${race}_${key}`);
      }
    }
  }

  // Career talents
  for (const career in careerDataMap) {
    const talents = careerDataMap[career]?.talents || {};
    for (const key in talents) {
      const lim = talents[key]?.usage_limit ?? "";
      if (hasLimit(lim, limitType)) {
        names.push(`used_${limitType}_${career}_${key}`);
      }
    }
  }

  return names;
};


on("clicked:clear_scene_uses", () => {
    // Clear static scene checkboxes first
    const sceneUses = getUsageLimitedTalentNames("scene");
    const updates = Object.fromEntries(sceneUses.map(name => [name, "0"]));

    // Get all repeating_scene row IDs
    getSectionIDs("repeating_scene", ids => {
        ids.forEach(id => {
            // Build attribute name for checkbox in each row
            const attrName = `repeating_scene_${id}_used_scene_item_name_mdr`;
            updates[attrName] = "0";
        });

        // Apply all updates
        setAttrs(updates);
    });
});

on("clicked:clear_session_uses", () => {
  // Clear static session checkboxes first
  const sessionUses = getUsageLimitedTalentNames("session");
  const updates = Object.fromEntries(sessionUses.map(name => [name, "0"]));

  // Get all repeating_session row IDs
  getSectionIDs("repeating_session", ids => {
    ids.forEach(id => {
      const attrName = `repeating_session_${id}_used_session_item_name_mdr`;
      updates[attrName] = "0";
    });

    // If Blood-Born Survivor was applied this session, remove the +2 now
    getAttrs(["bbs_session_applied", "vitality"], vals => {
      const applied = vals.bbs_session_applied === "1";
      const curVit  = parseInt(vals.vitality, 10) || 0;

      if (applied) {
        updates.vitality = Math.max(curVit - 2, 0); // clamp at 0 just in case
      }

      // Allow next session’s +2 to be granted again
      updates.bbs_session_applied = "0";

      // Apply all updates
      setAttrs(updates);
    });
  });
});


let careerWatcherInitialized = false;

on("clicked:careers", () => {
	if (debug_on) console.log ("[clicked:careers] Fired");
	if (debug_on_trace) console.log ("[clicked:careers] Start");
	if (careerWatcherInitialized) return;
	careerWatcherInitialized = true;

//	populateCareerTalentDescriptions();
	
	setAttrs({}, () => {
		registerCareerTalentSummaryWatcher();
		registerPrimaryCareerXPWatcher();
		registerSecondaryCareerXPWatcher();
		registerPrimaryExclusiveSkillWatchers();
		registerActiveSecondaryCareerWatchers();
		updateCareerReadyState();
		registerMirrorSkillWatcher();
	
		getAttrs(["primary_career"], (values) => {
			const primary = values.primary_career;
			if (primary) updateCareerTalentEnables(primary);
		});

		getSectionIDs("repeating_secondarycareer", (ids) => {
			ids.forEach(id => {
				getAttrs([`repeating_secondarycareer_${id}_secondary_career`], (rowVals) => {
					const career = rowVals[`repeating_secondarycareer_${id}_secondary_career`];
					if (career) updateCareerTalentEnables(career);
				});
			});
		});

		if (debug_on) console.log("[clicked:careers] Initialization complete.");
	});
  });

on("clicked:careers change:primary_career change:repeating_secondarycareer:secondary_career remove:repeating_secondarycareer " +
   Object.keys(careerDataMap)
     .flatMap(career => Object.keys(careerDataMap[career].talents || {})
       .map(talent => `change:${career}_${talent}`))
     .join(" "), function () {

  if (debug_on) console.log("[Career Talent Watcher]");
  if (debug_on_trace) console.log ("[Career Talent Watcher] Start");
  
  registerCareerTabWatchers();

  getAttrs(["primary_career"], (values) => {
    const primary = values.primary_career;
    if (primary) updateCareerTalentEnables(primary);
  });

  getSectionIDs("repeating_secondarycareer", (ids) => {
    // enable/locks per secondary
    ids.forEach(id => {
      getAttrs([`repeating_secondarycareer_${id}_secondary_career`], (rowVals) => {
        const career = rowVals[`repeating_secondarycareer_${id}_secondary_career`];
        if (career) updateCareerTalentEnables(career);
      });
    });
  
    // specialist buy-in sum
    const keys = ids.map(id => `repeating_secondarycareer_${id}_secondary_career`);
    getAttrs(keys, (vals) => {
      const uniqueCareers = Array.from(new Set(
        ids.map(id => vals[`repeating_secondarycareer_${id}_secondary_career`] || "").filter(Boolean)
      ));
      const totalSpecialist = uniqueCareers.reduce((sum, key) => {
        const cfg = careerDataMap[key];
        return (cfg?.career_type === "specialist")
          ? sum + (parseInt(cfg.career_cost, 10) || 0)
          : sum;
      }, 0);
      setAttrs({ xp_spent_career_specialist: String(totalSpecialist) });
    });
  });
    
  updateCareerReadyState(() => {
    if (debug_on) console.log("[Career Lock] Triggered registerCareerSkillLimiter()");
    registerCareerSkillLimiter();
  });
});

// ----------------------------------- Careers Section END -----------------------------------

/* ========= Armor Totals (Physical / Arcane) ========= */
/* Sums equipped-only values from two static rows + repeating_armorsmdr. */

const isChecked = (v) => v === "1" || v === "on" || v === "true";

const recalcArmorTotals = () => {
  const staticKeys = [
    "showracials",
    "armor1_equipped_checkbox", "armor1_physical_mdr", "armor1_arcane_mdr",
    "armor2_equipped_checkbox", "armor2_physical_mdr", "armor2_arcane_mdr"
  ];

  getAttrs(staticKeys, (vals) => {
    const racialBasePhysical =
      String(vals.showracials || "").toLowerCase() === "khadra" ? 1 : 0;

    let totalPhysical = racialBasePhysical;
    let totalArcane   = 0;

    if (isChecked(vals.armor1_equipped_checkbox)) {
      totalPhysical += parseInt(vals.armor1_physical_mdr, 10) || 0;
      totalArcane   += parseInt(vals.armor1_arcane_mdr,   10) || 0;
    }
    if (isChecked(vals.armor2_equipped_checkbox)) {
      totalPhysical += parseInt(vals.armor2_physical_mdr, 10) || 0;
      totalArcane   += parseInt(vals.armor2_arcane_mdr,   10) || 0;
    }

    getSectionIDs("repeating_armorsmdr", (ids) => {
      if (!ids.length) {
        setAttrs({
          armor_total_physical: totalPhysical,
          armor_total_arcane:   totalArcane
        });
        return;
      }

      const repKeys = ids.flatMap(id => ([
        `repeating_armorsmdr_${id}_armor_equipped_checkbox`,
        `repeating_armorsmdr_${id}_armor_physical_mdr`,
        `repeating_armorsmdr_${id}_armor_arcane_mdr`,
      ]));

      getAttrs(repKeys, (rows) => {
        ids.forEach(id => {
          const eq = rows[`repeating_armorsmdr_${id}_armor_equipped_checkbox`];
          if (isChecked(eq)) {
            totalPhysical += parseInt(rows[`repeating_armorsmdr_${id}_armor_physical_mdr`], 10) || 0;
            totalArcane   += parseInt(rows[`repeating_armorsmdr_${id}_armor_arcane_mdr`],   10) || 0;
          }
        });

        setAttrs({
          armor_total_physical: totalPhysical,
          armor_total_arcane:   totalArcane
        });
      });
    });
  });
};

/* Watchers: static rows + repeating rows + open/remove */
on("change:showracials " +
  "change:armor1_equipped_checkbox change:armor1_physical_mdr change:armor1_arcane_mdr " +
  "change:armor2_equipped_checkbox change:armor2_physical_mdr change:armor2_arcane_mdr " +
  "change:repeating_armorsmdr:armor_equipped_checkbox " +
  "change:repeating_armorsmdr:armor_physical_mdr " +
  "change:repeating_armorsmdr:armor_arcane_mdr " +
  "remove:repeating_armorsmdr",
  recalcArmorTotals
);
// ----------------------------------- Spells ------------------------------------------------

on("clicked:repeating_spellsmdr:spelladvanced", function(eventInfo) {
	console.log("[clicked:repeating_spellsmdr:spelladvanced]");

	const match = eventInfo.sourceAttribute.match(/repeating_spellsmdr_([^_]+)_/);
	if (!match) return;

	const rowId = match[1];
	const attr = `repeating_spellsmdr_${rowId}_show_spell_advanced`;

	getAttrs([attr], function(values) {
		const isShown = values[attr] === "1";
		setAttrs({ [attr]: isShown ? "0" : "1" });
	});
});

// Small helper
const toggleFlag = (attr) => {
  getAttrs([attr], (v) => setAttrs({ [attr]: v[attr] === "1" ? "0" : "1" }));
};

// Non-repeating: weaponadvanced -> show_weapon_advanced
on("clicked:weaponadvanced", () => {
  if (typeof debug_on !== "undefined" && debug_on) console.log("[clicked:weaponadvanced]");
  toggleFlag("show_weapon_advanced");
});

// Non-repeating: weaponadvanced_default -> show_weapon_advanced_default
on("clicked:weaponadvanced_default", () => {
  if (typeof debug_on !== "undefined" && debug_on) console.log("[clicked:weaponadvanced_default]");
  toggleFlag("show_weapon_advanced_default");
});

// Repeating: repeating_weaponsmdr:* row button -> row's *_show_weapon_advanced
on("clicked:repeating_weaponsmdr:weaponadvanced", (eventInfo = {}) => {
  if (typeof debug_on !== "undefined" && debug_on) console.log("[clicked:repeating_weaponsmdr:weaponadvanced]", eventInfo);

  const src = eventInfo.sourceAttribute || "";
  const m = src.match(/^repeating_weaponsmdr_([^_]+)_/);
  if (!m) {
    if (typeof debug_on !== "undefined" && debug_on) console.warn("[weaponadvanced] Could not resolve rowId from:", src);
    return;
  }
  const rowAttr = `repeating_weaponsmdr_${m[1]}_show_weapon_advanced`;
  toggleFlag(rowAttr);
});

// Auto-calculate damage components for fixed weapon (weapon1_mdr)
on("change:weapon1_mdr_damage", function() {
    if (debug_on_trace) console.log ("[change:weapon1_mdr_damage] Start");
  getAttrs(["weapon1_mdr_damage"], function(values) {
    const damageString = values.weapon1_mdr_damage || "";
    const updates = parseDamageString(damageString, "weapon1_mdr");
    setAttrs(updates);
  });
});

on("change:weapon1_skill_mdr", function () {
    if (debug_on_trace) console.log ("[change:weapon1_skill_mdr] Start");
  getAttrs(["weapon1_skill_mdr"], function (v) {
    const referenceString = v.weapon1_skill_mdr; // e.g., "@{melee_weapons_mdr}"
    const actualAttrName = referenceString.match(/@{([^}]+)}/)[1]; // "melee_weapons_mdr"

    getAttrs([actualAttrName], function (values) {
      setAttrs({ weapon1_skill_mdr_display: values[actualAttrName] || "0" });
    });
  });
});

on("change:repeating_weaponsmdr:weaponskill_mdr", function(eventInfo) {
    if (debug_on_trace) console.log ("[change:repeating_weaponsmdr:weaponskill_mdr] Start");
  const repeatingId = eventInfo.sourceAttribute.match(/repeating_weaponsmdr_([^_]+)_/)[1];
  const skillAttr = `repeating_weaponsmdr_${repeatingId}_weaponskill_mdr`;

  getAttrs([skillAttr], function(v) {
    const referenceString = v[skillAttr]; // e.g., "@{melee_weapons_mdr}"
    const actualAttrName = referenceString.match(/@{([^}]+)}/)[1]; // Extract "melee_weapons_mdr"

    getAttrs([actualAttrName], function(values) {
      const skillValue = values[actualAttrName] || "0";
      const displayAttr = `repeating_weaponsmdr_${repeatingId}_weaponskill_mdr_display`;

      setAttrs({ [displayAttr]: skillValue });
    });
  });
});

// Auto-calculate damage components for repeating weapons (repeating_weaponsmdr) - change only
on("change:repeating_weaponsmdr:weapondamage_mdr", function(eventInfo) {
    if (debug_on_trace) console.log ("[change:repeating_weaponsmdr:weapondamage_mdr] Start");
  const repeatingId = eventInfo.sourceAttribute.match(/repeating_weaponsmdr_([^_]+)_/)[1];

  getAttrs([`repeating_weaponsmdr_${repeatingId}_weapondamage_mdr`], function(values) {
    const damageString = values[`repeating_weaponsmdr_${repeatingId}_weapondamage_mdr`] || "";
    const updates = parseDamageString(damageString, `repeating_weaponsmdr_${repeatingId}`);
    setAttrs(updates);
  });
});

on("change:repeating_spellsmdr:spell_skill_mdr", function(eventInfo) {
    if (debug_on_trace) console.log ("[change:repeating_spellsmdr:spell_skill_mdr] Start");
  const repeatingId = eventInfo.sourceAttribute.match(/repeating_spellsmdr_([^_]+)_/)[1];
  const skillAttr = `repeating_spellsmdr_${repeatingId}_spell_skill_mdr`;

  getAttrs([skillAttr], function(v) {
    const referenceString = v[skillAttr];
    const actualAttrName = referenceString.match(/@{([^}]+)}/)[1];

    getAttrs([actualAttrName], function(values) {
      const skillValue = values[actualAttrName] || "0";
      const displayAttr = `repeating_spellsmdr_${repeatingId}_spell_skill_mdr_display`;

      setAttrs({ [displayAttr]: skillValue });
    });
  });
});

// Auto-calculate damage components for repeating spells (repeating_spellsmdr) - change only
on("change:repeating_spellsmdr:spell_damage_mdr", function(eventInfo) {
    if (debug_on_trace) console.log ("[change:repeating_spellsmdr:spell_damage_mdr] Start");
  const repeatingId = eventInfo.sourceAttribute.match(/repeating_spellsmdr_([^_]+)_/)[1];
  getAttrs([`repeating_spellsmdr_${repeatingId}_spell_damage_mdr`], function(values) {
    const damageString = values[`repeating_spellsmdr_${repeatingId}_spell_damage_mdr`] || "";
    const updates = parseDamageString(damageString, `repeating_spellsmdr_${repeatingId}`);
    setAttrs(updates);
  });
});

on("change:repeating_omnidecksmdr:omnideck_skill_mdr", function(eventInfo) {
    if (debug_on_trace) console.log ("[change:repeating_omnidecksmdr:omnideck_skill_mdr] Start");
  const repeatingId = eventInfo.sourceAttribute.match(/repeating_omnidecksmdr_([^_]+)_/)[1];
  const skillAttr = `repeating_omnidecksmdr_${repeatingId}_omnideck_skill_mdr`;

  getAttrs([skillAttr], function(v) {
    const referenceString = v[skillAttr];
    const actualAttrName = referenceString.match(/@{([^}]+)}/)[1];

    getAttrs([actualAttrName], function(values) {
      const skillValue = values[actualAttrName] || "0";
      const displayAttr = `repeating_omnidecksmdr_${repeatingId}_omnideck_skill_mdr_display`;

      setAttrs({ [displayAttr]: skillValue });
    });
  });
});

// Auto-calculate damage components for repeating programs (repeating_programsmdr) - change only
on("change:repeating_programsmdr:program_damage_mdr", function(eventInfo) {
    if (debug_on_trace) console.log ("[change:repeating_programsmdr:program_damage_mdr] Start");
  const repeatingId = eventInfo.sourceAttribute.match(/repeating_programsmdr_([^_]+)_/)[1];
  getAttrs([`repeating_programsmdr_${repeatingId}_program_damage_mdr`], function(values) {
    const damageString = values[`repeating_programsmdr_${repeatingId}_program_damage_mdr`] || "";
    const updates = parseDamageString(damageString, `repeating_programsmdr_${repeatingId}`);
    setAttrs(updates);
  });
});

on("change:repeating_ct:show_ct_mod1 change:repeating_ct:show_ct_mod2 change:repeating_ct:show_ct_mod3 change:repeating_ct:show_ct_mod4 change:repeating_ct:show_ct_mod5 change:repeating_ct:show_ct_mod6 change:repeating_ct:show_ct_mod7 change:repeating_ct:show_ct_mod8", function (eventInfo) {
    if (debug_on_trace) console.log ("[change:repeating_ct:show_ct_mod1] Start");
  const match = eventInfo.sourceAttribute.match(/repeating_ct_([^_]+)_(show_ct_mod[0-9]+)/);
  if (!match) return;

  const rowId = match[1];
  const field = match[2];

  const proxy = `${field}_proxy`;
  const fullField = `repeating_ct_${rowId}_${field}`;
  const fullProxy = `repeating_ct_${rowId}_${proxy}`;

  getAttrs([fullField], function (values) {
    const checked = values[fullField] === "1" ? "1" : "0";
    setAttrs({ [fullProxy]: checked });
  });
});

// === XP Remaining Calculation ===
on("change:background_xp change:xpledger_gained_xp change:xp_spent_talent change:xp_spent_career_talent change:xp_spent_career_specialist change:xp_spent_career_talent change:xpledger_spells_cost change:xpledger_skill_point_gain change:xpledger_skill_point_roll_gain change:xpledger_credits_cost change:xpledger_allies_cost change:xpledger_contacts_cost change:xpledger_reputation_cost change:xpledger_faction_cost change:xpledger_flaws_gain change:xpledger_perks_cost change:perk_linguist", function () {
    if (debug_on_trace) console.log ("[change:background_xp] Start");
    getAttrs([
        "background_xp",
        "xpledger_gained_xp",
        "xp_spent_talent",
        "xp_spent_career_talent",
		"xp_spent_career_specialist",
        "xpledger_spells_cost",
        "xpledger_skill_point_gain",
		"xpledger_skill_point_roll_gain",
        "xpledger_credits_cost",
        "xpledger_allies_cost",
        "xpledger_contacts_cost",
        "xpledger_reputation_cost",
        "xpledger_faction_cost",
        "xpledger_flaws_gain",
        "xpledger_perks_cost",
    ], function(values) {
        const toInt = v => parseInt(v, 10) || 0;

        const backgroundXP = toInt(values["background_xp"]);
        const ledgerGainedXP = toInt(values["xpledger_gained_xp"]);
        const xpSpentTalent = toInt(values["xp_spent_talent"]);
        const xpSpentCareerTalent = toInt(values["xp_spent_career_talent"]);
		const xpSpentCareerSpecialist = toInt(values["xp_spent_career_specialist"]);
        const spellsCost = toInt(values["xpledger_spells_cost"]);
        const skillPointGain = toInt(values["xpledger_skill_point_gain"]);
		const skillPointGainRoll = toInt(values["xpledger_skill_point_roll_gain"]);
        const creditsCost = toInt(values["xpledger_credits_cost"]);
        const alliesCost = toInt(values["xpledger_allies_cost"]);
        const contactsCost = toInt(values["xpledger_contacts_cost"]);
        const reputationCost = toInt(values["xpledger_reputation_cost"]);
        const factionCost = toInt(values["xpledger_faction_cost"]);
        const flawsGain = toInt(values["xpledger_flaws_gain"]);
        const perksCost = toInt(values["xpledger_perks_cost"]);

        const xpRemaining = backgroundXP + ledgerGainedXP - xpSpentTalent - xpSpentCareerTalent - xpSpentCareerSpecialist - spellsCost - skillPointGain - skillPointGainRoll - creditsCost - alliesCost - contactsCost - reputationCost - factionCost + flawsGain - perksCost;

        setAttrs({
            xp_remaining: xpRemaining
        });
    });
});

// === Repeating Ledger XP Category Aggregator ===
on("change:repeating_ledger:ledger_choice change:repeating_ledger:ledger_choice_value change:repeating_ledger:ledger_choice_value change:repeating_ledger:ledger_choice_value_skill remove:repeating_ledger", function () {
    if (debug_on_trace) console.log("[change:repeating_ledger:ledger_choice] Start");

    getSectionIDs("repeating_ledger", function (ids) {
        const fieldNames = ids.flatMap(id => [
            `repeating_ledger_${id}_ledger_choice`,
            `repeating_ledger_${id}_ledger_choice_value`,
            `repeating_ledger_${id}_ledger_choice_value_skill`
        ]);

        getAttrs(fieldNames, function (values) {
            const aggregates = {
                xp_gained: 0,
                skill_xp: 0,
                xp_skill: 0,
                xp_skill_roll: 0,
                xp_skill_roll_skill: 0,
                xp_spells: 0,
                xp_credits: 0,
                xp_allies: 0,
                xp_contacts: -10,
                xp_reputation: 0,
                xp_faction: 0,
//              xp_flaws: 0,
//              xp_perks: 0,
//				perk_linguist_sp: 0
            };

            ids.forEach(id => {
                const choice = values[`repeating_ledger_${id}_ledger_choice`];
                const value = values[`repeating_ledger_${id}_ledger_choice_value`];
                const skillValue = values[`repeating_ledger_${id}_ledger_choice_value_skill`];

                const val = parseInt(value, 10) || 0;
                const valSkill = parseInt(skillValue, 10) || 0;

                if (choice === "xp_skill_roll") {
                    aggregates.xp_skill_roll += val;
                    aggregates.xp_skill_roll_skill += valSkill;
//				} else if (choice === "perk_linguist") {
//					aggregates.xp_perks += val;
//					aggregates.perk_linguist_sp += valSkill;	
                } else if (aggregates.hasOwnProperty(choice)) {
                    aggregates[choice] += val;
                }
            });

            const updates = {
                xpledger_gained_xp: aggregates.xp_gained,
                xpledger_skill_point_lost: aggregates.skill_xp,
                xpledger_skill_point_gain: aggregates.xp_skill,
                xpledger_skill_point_roll_gain: aggregates.xp_skill_roll,
                xpledger_skill_point_roll_gain_skill: aggregates.xp_skill_roll_skill,
                xpledger_spells_cost: aggregates.xp_spells,
                xpledger_credits_cost: aggregates.xp_credits,
                xpledger_allies_cost: aggregates.xp_allies,
                xpledger_contacts_cost: aggregates.xp_contacts,
                xpledger_reputation_cost: aggregates.xp_reputation,
                xpledger_faction_cost: aggregates.xp_faction,
//              xpledger_flaws_gain: aggregates.xp_flaws,
//              xpledger_perks_cost: aggregates.xp_perks,
//				perk_linguist: aggregates.perk_linguist_sp
            };
            setAttrs(updates);
        });
    });
});

on(
  "change:primary_career_skill_points change:personal_skill_points change:total_skill_points_spent " +
  "change:xpledger_skill_point_gain change:xpledger_skill_point_roll_gain_skill change:xpledger_skill_point_lost change:perk_linguist_sp " +
  "change:repeating_secondarycareer:secondary_career change:repeating_secondarycareer:secondary_career_skill_points " +
  "change:repeating_secondarycareer:secondary_career_skill_to_xp add:repeating_secondarycareer remove:repeating_secondarycareer",
  function () {
    if (debug_on_trace) console.log("[change:primary_career_skill_points] Start");

    getSectionIDs("repeating_secondarycareer", function (ids) {
      const secAttrs = ids.map(id => `repeating_secondarycareer_${id}_secondary_career_skill_points`);
	  const secSkillXPAttrs = ids.map(id => `repeating_secondarycareer_${id}_secondary_career_skill_to_xp`);
      const baseAttrs = [
        "primary_career_skill_points",
        "personal_skill_points",
        "total_skill_points_spent",
        "xpledger_skill_point_gain",
        "xpledger_skill_point_roll_gain_skill",
        "xpledger_skill_point_lost",
        "perk_linguist_sp",
        ...secAttrs,
		...secSkillXPAttrs
      ];

      getAttrs(baseAttrs, function (values) {
        const primary       = parseInt(values.primary_career_skill_points, 10) || 0;
        const personal      = parseInt(values.personal_skill_points, 10) || 0;
        const spent         = parseInt(values.total_skill_points_spent, 10) || 0;
        const ledgerGain    = parseInt(values.xpledger_skill_point_gain, 10) || 0;
        const ledgerGainRoll= parseInt(values.xpledger_skill_point_roll_gain_skill, 10) || 0;
        const perk_linguist_sp = parseInt(values.perk_linguist_sp, 10) || 0;

        const secondary = secAttrs.reduce((sum, a) => sum + (parseInt(values[a], 10) || 0), 0);
		
		const ledgerLost = secSkillXPAttrs.reduce((sum, a) => sum + (parseInt(values[a], 10) || 0), 0);

        const remaining = primary + personal + secondary + ledgerGain + ledgerGainRoll - ledgerLost - spent + perk_linguist_sp;

        setAttrs({ total_skill_points_remain: remaining, secondary_career_skill_points: secondary, xpledger_skill_point_lost: ledgerLost });
      });
    });
  }
);

// === Spell XP Remaining Calculation ===
on("change:primary_career_spell_xp_total change:secondary_career_spell_xp_total change:xpledger_spells_cost change:repeating_spellsmdr:xp_cost_mdr remove:repeating_spellsmdr", function () {
    if (debug_on_trace) console.log("[XP Calc] Triggered");

    getSectionIDs("repeating_spellsmdr", function (ids) {
        const fields = ids.map(id => `repeating_spellsmdr_${id}_xp_cost_mdr`);
        getAttrs([
            "primary_career_spell_xp_total",
            "secondary_career_spell_xp_total",
            "xpledger_spells_cost",
            ...fields
        ], function (values) {
            const primary = parseInt(values["primary_career_spell_xp_total"], 10) || 0;
            const secondary = parseInt(values["secondary_career_spell_xp_total"], 10) || 0;
            const gained = parseInt(values["xpledger_spells_cost"], 10) || 0;

            // Sum XP costs from all repeating spells
            let spent = 0;
            fields.forEach(field => {
                spent += parseInt(values[field], 10) || 0;
            });

            const remaining = primary + secondary + gained - spent;

            setAttrs({
                spell_xp_spent: spent,
                spell_xp_remaining: remaining
            });
        });
    });
});

on("add:repeating_secondarycareer remove:repeating_secondarycareer", () => {
    if (debug_on_trace) console.log("[Repeating Section Change] Secondary career row added or removed");
    // Re-run stat updates
    registerStatHandler();
});

/* ========= Money Ledger (order-correct & reorder-aware) ========= */
const SECTION = "moneyledger"; // group name WITHOUT 'repeating_'
const UI_ORDER_ATTR   = `_reporder_repeating_${SECTION}`; // UI drag writes this
const CODE_ORDER_ATTR =  `reporder_repeating_${SECTION}`;  // setSectionOrder writes this

// --- Official helper (adapted) to get IDs in display order ---
const getSectionIDsOrdered = (sectionName, cb) => {
  getAttrs([`_reporder_repeating_${sectionName}`], v => {
    getSectionIDs(sectionName, idArray => {
      const rep = (v[`_reporder_repeating_${sectionName}`] || "").toLowerCase().split(",").filter(Boolean);
      const ids = [...new Set(rep.filter(x => idArray.includes(x)).concat(idArray))];
      cb(ids);
    });
  });
};

// Parse numeric safely
const toNum = v => {
  const n = parseFloat(String(v || "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const recalcMoneyLedger = () => {
  if (debug_on_trace) console.log("[Money Ledger] Recalc start");

  getSectionIDsOrdered(SECTION, ids => {
    const read = [UI_ORDER_ATTR, CODE_ORDER_ATTR];
    ids.forEach(id => {
      read.push(`repeating_${SECTION}_${id}_money_credit`);
      read.push(`repeating_${SECTION}_${id}_money_debit`);
    });

    getAttrs(read, values => {
      let running = 0;
      const updates = {};
      ids.forEach(id => {
        const c = toNum(values[`repeating_${SECTION}_${id}_money_credit`]);
        const d = toNum(values[`repeating_${SECTION}_${id}_money_debit`]);
        running += (c - d);
        updates[`repeating_${SECTION}_${id}_money_running_total`] = String(running);
      });
      updates.money_balance = String(running);
      if (debug_on) console.log("[Money Ledger] Updates:", updates);
      setAttrs(updates);
    });
  });
};

on(`change:repeating_${SECTION}:money_credit change:repeating_${SECTION}:money_debit change:_reporder:${SECTION} change:reporder:${SECTION} remove:repeating_${SECTION}`, recalcMoneyLedger);

/* Debug: see which event fires when you drag/add/remove (comment out later) */
// on(`sheet:opened change:_reporder:${SECTION} change:reporder:${SECTION} change:repeating_${SECTION} remove:repeating_${SECTION}`, e => {
//  console.log("[Money Ledger] structural event:", e.sourceAttribute || e.triggerName || "unknown");
//});

on("change:repeating_minion:npc_weapon_skill1 change:repeating_minion:npc_weapon_skill2 change:repeating_minion:npc_weapon_skill3 change:repeating_minion:minionskillval6 change:repeating_minion:minionskillval7 change:repeating_minion:minionskillval8 ", function(eventInfo) {
    if (debug_on_trace) console.log("[NPC] skill/minionskillval change:", eventInfo);

    const src = eventInfo.sourceAttribute || "";
    const rowMatch = src.match(/^repeating_minion_([^_]+)_/);
    if (!rowMatch) return;
    const rowId = rowMatch[1];

    const suffixes = ["npc_weapon_skill1","npc_weapon_skill2","npc_weapon_skill3"];
    const selAttrs = suffixes.map(s => `repeating_minion_${rowId}_${s}`);

    // 1) Read the three selects for this row
    getAttrs(selAttrs, selVals => {
      // Collect all referenced @{...} bases so we can fetch them in one go
      const refBases = Array.from(new Set(
        selAttrs.map(a => {
          const m = (selVals[a] || "").match(/@{([^}]+)}/);
          return m ? m[1] : null;
        }).filter(Boolean)
      ));

      // If no refs, just write through literals
      if (!refBases.length) {
        const updates = {};
        suffixes.forEach(sfx => {
          const raw = selVals[`repeating_minion_${rowId}_${sfx}`] || "0";
          updates[`repeating_minion_${rowId}_${sfx}_display`] = raw || "0";
        });
        setAttrs(updates);
        return;
      }

      // 2) Fetch row-local + global for all referenced bases
      const refKeys = refBases.flatMap(base => [
        `repeating_minion_${rowId}_${base}`,
        base
      ]);

      getAttrs(refKeys, refVals => {
        const updates = {};
        suffixes.forEach(sfx => {
          const raw = selVals[`repeating_minion_${rowId}_${sfx}`] || "";
          const m = raw.match(/@{([^}]+)}/);
          let value = "0";
          if (!m) {
            value = raw || "0";
          } else {
            const base   = m[1];
            const rowKey = `repeating_minion_${rowId}_${base}`;
            value = refVals[rowKey] || refVals[base] || "0";
          }
          updates[`repeating_minion_${rowId}_${sfx}_display`] = value;
        });
        setAttrs(updates);
      });
    });
  }
);



</script>