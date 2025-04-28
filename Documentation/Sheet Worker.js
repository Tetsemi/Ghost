const debug_on = false;
const debug_on_trace = true;

// Maps //
const backgroundSkillMap = {
  alteri: {
    break_faced_radical: {
      deception: "Deception", persuade: "Persuade"
    },
    ghostline_runner: {
      slicing: "Slicing", streetwise: "Streetwise"
    },
    legacy_bearer: {
      history: "History", impersonation: "Impersonation"
    },
    soft_year_drifter: {
      insight: "Insight", stealth: "Stealth"
    },
    veilhaven_attendant: {
      arcana: "Arcana", disguise: "Disguise"
    }
  },
  draevi: {
    forgeblood_scavenger: {
      electronics: "Electronics", mechanics: "Mechanics"
    },
    horn_carved_wanderer: {
      navigate: "Navigate", survival: "Survival"
    },
    spiritbound_techshaper: {
      slicing: "Slicing", spirit_lore: "Spirit Lore"
    },
    tradition_keeper: {
      occult: "Occult Lore", veil_lore: "Veil Lore"
    },
    urban_tread: {
      athletics: "Athletics", streetwise: "Streetwise"
    }
  },
  human: {
    ash_war_refugee: {
      first_aid: "First Aid", insight: "Insight"
    },
    data_hatched: {
      alchemy: "Alchemy", anthropology: "Anthropology", archaeology: "Archaeology", architecture: "Architecture", biology: "Biology", chemistry: "Chemistry", engineering: "Engineering", medicine: "Medicine", physics: "Physics", slicing: "Slicing"
    },
    enclave_born: {
      etiquette_high_society: "Etiquette(H. Soc.)", persuade: "Persuade"
    },
    gutter_fire_youth: {
      stealth: "Stealth", streetwise: "Streetwise"
    },
    outpost_raised: {
      survival: "Survival(Wild)", firearms_rifle: "Rifle/Shotgun"
    },
    scavsteel_whelp: {
      electronics: "Electronics", mechanics: "Mechanics"
    }
  },
  lyranni: {
    aelvareth_devotee: {
      etiquette_lyranni: "Etiquette(Lyranni)", occult: "Occult Lore"
    },
    echoborne: {
      arcana: "Arcana", etiquette_lyranni: "Etiquette(Lyranni)"
    },
    glide_spire_scion: {
      persuade: "Persuade", streetwise: "Streetwise"
    },
    whisper_walker: {
      occult: "Occult Lore", perception: "Perception"
    },
    zurethkai_flameborn: {
      magic_technomancy: "Magic(Technomancy)", slicing: "Slicing"
    }  
  }
};

const talentSkillMap = {
  alteri: {
    maskwrights_grace: {
      disguise: "Disguise", impersonation: "Impersonation", insight: "Insight"
    },
    shaped_for_subtlety: {
      insight: "Insight", slicing: "Slicing", stealth: "Stealth"
    }
  },
  draevi: {
    clan_blooded: {
      intimidate: "Intimidate", survival: "Survival", track: "Track"
    },
    scavengers_edge: {
      electronics: "Electronics", mechanics: "Mechanics", streetwise: "Streetwise"
    }
  },
  human: {
    quick_fixer: {
      electronics: "Electronics", mechanics: "Mechanics", slicing: "Slicing"    
    },
    skilled_focus: {
      // Empty on purpose
    }
  },
  lyranni: {
    aether_override: {
      electronics: "Electronics", mechanics: "Mechanics", slicing: "Slicing"
    },
    echo_in_the_veins: {
      dance: "Dance", impersonation: "Impersonation", instrument: "Instrument", singing: "Singing", streetwise: "Streetwise", insight: "Insight"
    }
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
    }
  },
  "draevi": {
    label: "Draevi",
    language: "Khevala",
    stats: {
      str: { base: 25, max: 90 }, dex: { base: 25, max: 80 }, con: { base: 25, max: 90 },
      siz: { base: 60, max: 100 }, int: { base: 40, max: 80 }, edu: { base: 40, max: 80 },
      pow: { base: 40, max: 90 }, app: { base: 15, max: 80 }, mag: { base: 0, max: 80 }
    }
  },
  "feran": {
    label: "Feran",
    language: "A",
    stats: {
      str: { base: 15, max: 80 }, dex: { base: 20, max: 90 }, con: { base: 15, max: 85 },
      siz: { base: 40, max: 80 }, int: { base: 40, max: 80 }, edu: { base: 20, max: 85 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 85 }, mag: { base: 0, max: 80 }
    }
  },
  "human": {
    label: "Human",
    language: "Caltheran",
    stats: {
      str: { base: 15, max: 90 }, dex: { base: 15, max: 90 }, con: { base: 15, max: 90 },
      siz: { base: 40, max: 90 }, int: { base: 40, max: 90 }, edu: { base: 15, max: 90 },
      pow: { base: 15, max: 90 }, app: { base: 15, max: 90 }, mag: { base: 0, max: 80 }
    }
  },
  "khadra": {
    label: "Khadra",
    language: "Nari",
    stats: {
      str: { base: 30, max: 95 }, dex: { base: 15, max: 70 }, con: { base: 25, max: 90 },
      siz: { base: 60, max: 100 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 70 }, mag: { base: 0, max: 80 }
    }
  },
  "kitsu": {
    label: "Kitsu",
    language: "B",
    stats: {
      str: { base: 15, max: 75 }, dex: { base: 20, max: 90 }, con: { base: 15, max: 75 },
      siz: { base: 40, max: 80 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 85 }, app: { base: 15, max: 90 }, mag: { base: 0, max: 80 }
    }
  },
  "lyranni": {
    label: "Lyranni",
    language: "Thal’Resh",
    stats: {
      str: { base: 15, max: 75 }, dex: { base: 15, max: 85 }, con: { base: 15, max: 75 },
      siz: { base: 40, max: 80 }, int: { base: 40, max: 90 }, edu: { base: 15, max: 90 },
      pow: { base: 40, max: 95 }, app: { base: 15, max: 85 }, mag: { base: 0, max: 80 }
    }
  },
  "veyra": {
    label: "Veyra",
    language: "C",
    stats: {
      str: { base: 25, max: 90 }, dex: { base: 15, max: 80 }, con: { base: 25, max: 90 },
      siz: { base: 60, max: 100 }, int: { base: 40, max: 80 }, edu: { base: 15, max: 80 },
      pow: { base: 15, max: 80 }, app: { base: 15, max: 75 }, mag: { base: 0, max: 80 }
    }
  }
};

const skillMapTable = {
 "Archery": { label: "archery", base: "10", skill: "archery_skill_mdr", bonus: "archery_mdr", group: "Combat", notes: "Archery" },
 "Dodge (DEX/2)": { label: "dodge", base: "0", skill: "dodge_skill_mdr", bonus: "dodge_mdr", group: "Combat", notes: "Half of your DEX score" },
 "Gunnery": { label: "gunnery", base: "10", skill: "gunnery_skill_mdr", bonus: "gunnery_mdr", group: "Combat", notes: "Vehicle-mounted or automated weapons" },
 "Heavy Weapons": { label: "heavy_weapons", base: "10", skill: "heavy_weapons_skill_mdr", bonus: "heavy_weapons_mdr", group: "Combat", notes: "Heavy Weapons" },
 "Melee Weapons": { label: "melee_weapons", base: "20", skill: "melee_weapons_skill_mdr", bonus: "melee_weapons_mdr", group: "Combat", notes: "Melee Weapons" },
 "Pistols": { label: "firearms_handgun", base: "20", skill: "firearms_handgun_skill_mdr", bonus: "firearms_handgun_mdr", group: "Combat", notes: "Pistols" },
 "Rifles/Shotguns": { label: "firearms_rifle", base: "25", skill: "firearms_rifle_skill_mdr", bonus: "firearms_rifle_mdr", group: "Combat", notes: "Rifles/Shotguns" },
 "Submachine Guns (SMGs)": { label: "firearms_smg", base: "15", skill: "firearms_smg_skill_mdr", bonus: "firearms_smg_mdr", group: "Combat", notes: "Submachine Guns (SMGs)" },
 "Thrown Weapons": { label: "throw", base: "20", skill: "throw_skill_mdr", bonus: "throw_mdr", group: "Combat", notes: "Thrown Weapons" },
 "Unarmed": { label: "unarmed", base: "25", skill: "unarmed_skill_mdr", bonus: "unarmed_mdr", group: "Combat", notes: "Unarmed combat" },
 "Athletics": { label: "athletics", base: "20", skill: "athletics_skill_mdr", bonus: "athletics_mdr", group: "Physical", notes: "Running, jumping, climbing, endurance" },
 "Coordination": { label: "coordination", base: "20", skill: "coordination_skill_mdr", bonus: "coordination_mdr", group: "Physical", notes: "Balance, agility, acrobatics" },
 "Swim": { label: "swim", base: "20", skill: "swim_skill_mdr", bonus: "swim_mdr", group: "Physical", notes: "Swim" },
 "Alteration": { label: "magic_alteration", base: "0", skill: "magic_alteration_skill_mdr", bonus: "magic_alteration_mdr", group: "Magic", notes: "Enhances physical attributes or alters the physical world. Includes speed, strength, resilience, and spatial shifts." },
 "Elemental": { label: "magic_elemental", base: "0", skill: "magic_elemental_skill_mdr", bonus: "magic_elemental_mdr", group: "Magic", notes: "The art of shaping and controlling natural elements such as fire, water, air, and earth through arcane force. Focuses on raw power and environmental manipulation." },
 "Enchantment": { label: "magic_enchantment", base: "0", skill: "magic_enchantment_skill_mdr", bonus: "magic_enchantment_mdr", group: "Magic", notes: "Mental influencing magic that alters thoughts, emotions, or behavior. Includes charms, compulsions, and emotional sway." },
 "Illusion": { label: "magic_illusion", base: "0", skill: "magic_illusion_skill_mdr", bonus: "magic_illusion_mdr", group: "Magic", notes: "Magic of trickery and perception. Creates false images, alters appearances, or hides things through manipulation of the senses." },
 "Necromancy": { label: "magic_necromancy", base: "0", skill: "magic_necromancy_skill_mdr", bonus: "magic_necromancy_mdr", group: "Magic", notes: "Manipulates the forces of death and the soul. Involves raising the dead, draining life, or communicating with spirits of the deceased." },
 "Restoration": { label: "magic_restoration", base: "0", skill: "magic_restoration_skill_mdr", bonus: "magic_restoration_mdr", group: "Magic", notes: "Healing, cleansing, and regeneration magic that mends wounds, purifies corruption, or restores vitality." },
 "Summoning": { label: "magic_summoning", base: "0", skill: "magic_summoning_skill_mdr", bonus: "magic_summoning_mdr", group: "Magic", notes: "Calls forth spirits, creatures, or arcane constructs from beyond to aid, defend, or serve the caster." },
 "Technomancy": { label: "magic_technomancy", base: "0", skill: "magic_technomancy_skill_mdr", bonus: "magic_technomancy_mdr", group: "Magic", notes: "The fusion of magic with technology. Enables interaction with archanotech, digital constructs, and spell-driven machines." },
 "Warding": { label: "magic_warding", base: "0", skill: "magic_warding_skill_mdr", bonus: "magic_warding_mdr", group: "Magic", notes: "Protective magic used to shield, block, or dispel incoming threats both physical and magical." },
 "Universal": { label: "magic_universal", base: "0", skill: "magic_universal_skill_mdr", bonus: "magic_universal_mdr", group: "Magic", notes: "Covers basic arcane techniques used across traditions detecting, sensing, or disrupting magical phenomena." },
 "Archanotech": { label: "archanotech", base: "1", skill: "archanotech_skill_mdr", bonus: "archanotech_mdr", group: "Tech/Cyber", notes: "Construction, repair, and interfacing with arcane-tech hybrids" },
 "Computer Use": { label: "computer_use", base: "10", skill: "computer_use_skill_mdr", bonus: "computer_use_mdr", group: "Tech/Cyber", notes: "General software and system operation" },
 "Cybernetics": { label: "cybernetics", base: "1", skill: "cybernetics_skill_mdr", bonus: "cybernetics_mdr", group: "Tech/Cyber", notes: "Installing and maintaining cyberware" },
 "Demolitions": { label: "demolitions", base: "1", skill: "demolitions_skill_mdr", bonus: "demolitions_mdr", group: "Tech/Cyber", notes: "Demolitions" },
 "Electronics": { label: "electronics", base: "10", skill: "electronics_skill_mdr", bonus: "electronics_mdr", group: "Tech/Cyber", notes: "circuitry, electronic repair" },
 "Mechanics": { label: "mechanics", base: "10", skill: "mechanics_skill_mdr", bonus: "mechanics_mdr", group: "Tech/Cyber", notes: "Mechanics" },
 "Security Systems": { label: "security", base: "1", skill: "security_systems_skill_mdr", bonus: "security_systems_mdr", group: "Tech/Cyber", notes: "Understanding and bypassing surveillance, sensors, magitech security, and physical/digital alarm systems." },
 "Slicing": { label: "slicing", base: "5", skill: "slicing_skill_mdr", bonus: "slicing_mdr", group: "Tech/Cyber", notes: "Digital infiltration, cybersecurity" },
 "Drive (Ground Vehicles)": { label: "drive_auto", base: "20", skill: "drive_auto_skill_mdr", bonus: "drive_auto_mdr", group: "Pilot", notes: "Drive (Ground Vehicles)" },
 "Drone Operation": { label: "drone_operation", base: "10", skill: "drone_operation_skill_mdr", bonus: "drone_operation_mdr", group: "Pilot", notes: "Drone Operation" },
 "Pilot (Aircraft)": { label: "pilotaircraft", base: "1", skill: "pilotaircraft_skill_mdr", bonus: "pilotaircraft_mdr", group: "Pilot", notes: "Pilot (Aircraft)" },
 "Pilot (Boat)": { label: "pilotboat", base: "1", skill: "pilotboat_skill_mdr", bonus: "pilotboat_mdr", group: "Pilot", notes: "Pilot (Boat)" },
 "Alchemy": { label: "alchemy", base: "1", skill: "alchemy_skill_mdr", bonus: "alchemy_mdr", group: "Science/Knowledge", notes: "Science (Alchemy)" },
 "Anthropology": { label: "anthropology", base: "1", skill: "anthropology_skill_mdr", bonus: "anthropology_mdr", group: "Science/Knowledge", notes: "Science(Anthropology)" },
 "Arcana": { label: "arcana", base: "5", skill: "arcana_skill_mdr", bonus: "arcana_mdr", group: "Science/Knowledge", notes: "Understanding of magical theory and principles" },
 "Archaeology": { label: "archaeology", base: "1", skill: "archaeology_skill_mdr", bonus: "archaeology_mdr", group: "Science/Knowledge", notes: "Science(Archaeology)" },
 "Architecture": { label: "architecture", base: "1", skill: "architecture_skill_mdr", bonus: "architecture_mdr", group: "Science/Knowledge", notes: "Architecture" },
 "Biology": { label: "biology", base: "1", skill: "biology_skill_mdr", bonus: "biology_mdr", group: "Science/Knowledge", notes: "Science (Biology)" },
 "Chemistry": { label: "chemistry", base: "1", skill: "chemistry_skill_mdr", bonus: "chemistry_mdr", group: "Science/Knowledge", notes: "Science (Chemistry)" },
 "Engineering": { label: "engineering", base: "1", skill: "engineering_skill_mdr", bonus: "engineering_mdr", group: "Science/Knowledge", notes: "Science (Engineering)" },
 "Forbidden Lore": { label: "forbidden_lore", base: "0", skill: "forbidden_lore_skill_mdr", bonus: "forbidden_lore_mdr", group: "Science/Knowledge", notes: "Cosmic horrors, veiled truths" },
 "History": { label: "history", base: "5", skill: "history_skill_mdr", bonus: "history_mdr", group: "Science/Knowledge", notes: "History" },
 "Investigation": { label: "investigation", base: "10", skill: "investigation_skill_mdr", bonus: "investigation_mdr", group: "Science/Knowledge", notes: "Used to reconstruct events, analyze clues, interpret evidence, and solve mysteries." },
 "Law": { label: "law", base: "5", skill: "law_skill_mdr", bonus: "law_mdr", group: "Science/Knowledge", notes: "Law" },
 "Medicine": { label: "medicine", base: "1", skill: "medicine_skill_mdr", bonus: "medicine_mdr", group: "Science/Knowledge", notes: "Medicine" },
 "Natural World": { label: "natural_world", base: "10", skill: "natural_world_skill_mdr", bonus: "natural_world_mdr", group: "Science/Knowledge", notes: "Natural World" },
 "Occult Lore": { label: "occult", base: "5", skill: "occult_skill_mdr", bonus: "occult_mdr", group: "Science/Knowledge", notes: "Non-practitioner knowledge of magic and the supernatural" },
 "Physics": { label: "physics", base: "1", skill: "physics_skill_mdr", bonus: "physics_mdr", group: "Science/Knowledge", notes: "Science (Physics)" },
 "Spirit Lore": { label: "spirit_lore", base: "5", skill: "spirit_lore_skill_mdr", bonus: "spirit_lore_mdr", group: "Science/Knowledge", notes: "Spirit Lore" },
 "Veil Lore": { label: "veil_lore", base: "5", skill: "veil_lore_skill_mdr", bonus: "veil_lore_mdr", group: "Science/Knowledge", notes: "Veil Lore" },
 "Bureaucracy": { label: "bureaucracy", base: "5", skill: "bureaucracy_skill_mdr", bonus: "bureaucracy_mdr", group: "Social", notes: "Understanding and navigating administrative, legal, and governmental systems." },
 "Charm": { label: "charm", base: "15", skill: "charm_skill_mdr", bonus: "charm_mdr", group: "Social", notes: "Charm" },
 "Dance": { label: "dance", base: "5", skill: "dance_skill_mdr", bonus: "dance_mdr", group: "Social", notes: "Performance (Dance)" },
 "Deception": { label: "deception", base: "5", skill: "deception_skill_mdr", bonus: "deception_mdr", group: "Social", notes: "Deception" },
 "Disguise": { label: "disguise", base: "5", skill: "disguise_skill_mdr", bonus: "disguise_mdr", group: "Social", notes: "Disguise" },
 "Etiquette (High Society)": { label: "etiquette_high_society", base: "10", skill: "etiquette_high_society_skill_mdr", bonus: "etiquette_high_society_mdr", group: "Social", notes: "Etiquette (High Society)" },
 "Etiquette (Lyranni)": { label: "etiquette_lyranni", base: "10", skill: "etiquette_lyranni_skill_mdr", bonus: "etiquette_lyranni_mdr", group: "Social", notes: "Etiquette (Lyranni)" },
 "Etiquette (Other)": { label: "etiquette_other", base: "10", skill: "etiquette_other_skill_mdr", bonus: "etiquette_other_mdr", group: "Social", notes: "Etiquette may be specialized: (Corporate), (Military), (Underworld), (Racial), etc." },
 "Forgery": { label: "forgery", base: "1", skill: "forgery_skill_mdr", bonus: "forgery_mdr", group: "Social", notes: "Creating falsified documents, IDs, credentials physical or digital." },
 "Impersonation": { label: "impersonation", base: "5", skill: "impersonation_skill_mdr", bonus: "impersonation_mdr", group: "Social", notes: "Performance (Impersonation)" },
 "Insight": { label: "insight", base: "10", skill: "insight_skill_mdr", bonus: "insight_mdr", group: "Social", notes: "Insight" },
 "Instrument": { label: "instrument", base: "5", skill: "instrument_skill_mdr", bonus: "instrument_mdr", group: "Social", notes: "Performance (Instrument)" },
 "Intimidate": { label: "intimidate", base: "15", skill: "intimidate_skill_mdr", bonus: "intimidate_mdr", group: "Social", notes: "Lying, bluffing, maintaining covers, and creating false narratives across a wide range of scenarios." },
 "Interrogation": { label: "interrogation", base: "5", skill: "interrogation_skill_mdr", bonus: "interrogation_mdr", group: "Social", notes: "Extracting information through questioning, pressure, or manipulation." },
 "Persuade": { label: "persuade", base: "10", skill: "persuade_skill_mdr", bonus: "persuade_mdr", group: "Social", notes: "Persuade" },
 "Singing": { label: "singing", base: "5", skill: "singing_skill_mdr", bonus: "singing_mdr", group: "Social", notes: "Performance (Singing)" },
 "Streetwise": { label: "streetwise", base: "10", skill: "streetwise_skill_mdr", bonus: "streetwise_mdr", group: "Social", notes: "Streetwise" },
 "Animal Handling": { label: "animalhandling", base: "5", skill: "animalhandling_skill_mdr", bonus: "animalhandling_mdr", group: "Survival", notes: "Animal Handling" },
 "First Aid": { label: "first_aid", base: "30", skill: "first_aid_skill_mdr", bonus: "first_aid_mdr", group: "Survival", notes: "First Aid" },
 "Listen": { label: "listen", base: "20", skill: "listen_skill_mdr", bonus: "listen_mdr", group: "Survival", notes: "Listen" },
 "Navigate": { label: "navigate", base: "10", skill: "navigate_skill_mdr", bonus: "navigate_mdr", group: "Survival", notes: "Navigate" },
 "Perception": { label: "perception", base: "25", skill: "perception_skill_mdr", bonus: "perception_mdr", group: "Survival", notes: "Perception" },
 "Sleight of Hand": { label: "sleight_of_hand", base: "10", skill: "sleight_of_hand_skill_mdr", bonus: "sleight_of_hand_mdr", group: "Survival", notes: "Sleight of Hand" },
 "Stealth": { label: "stealth", base: "20", skill: "stealth_skill_mdr", bonus: "stealth_mdr", group: "Survival", notes: "Stealth" },
 "Survival (Wilderness)": { label: "survival", base: "10", skill: "survival_skill_mdr", bonus: "survival_mdr", group: "Survival", notes: "Survival (Wilderness)" },
 "Track": { label: "track", base: "10", skill: "track_skill_mdr", bonus: "track_mdr", group: "Survival", notes: "Track" },
 "Language(Racial)": { label: "language_own", base: "75", skill: "language_own_skill_mdr", bonus: "language_own_mdr", group: "Language", notes: "Racial Language" },
 "Language(Caltheran)": { label: "language_caltheran", base: "0", skill: "language_caltheran_skill_mdr", bonus: "language_caltheran_mdr", group: "Language", notes: "Calthern language" }
};

//----------------------- Tab Workers Start ----------------------//

const tabList = ["skills", "background", "talents", "combat", "spells", "inventory", "backstory", "npcs", "vehicles"];

tabList.forEach(tab => {
    on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ selected_tab: tab });
    });
});

const alteriBackgroundTabs = ["break_faced_radical", "ghostline_runner", "legacy_bearer", "soft_year_drifter", "veilhaven_attendant"];

alteriBackgroundTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		if (debug_on)  console.log("Clicked tab", tab);
		setAttrs({ alteri_background_choice: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const draeviBackgroundTabs = ["forgeblood_scavenger", "horn_carved_wanderer", "spiritbound_techshaper", "tradition_keeper"];

draeviBackgroundTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ draevi_background_choice: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const humanBackgroundTabs = ["ash_war_refugee", "data_hatched", "enclave_born", "gutter_fire_youth", "outpost_raised", "scavsteel_whelp"];

humanBackgroundTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ human_background_choice: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const lyranniBackgroundTabs = ["aelvareth_devotee", "echoborne", "glide_spire_scion", "whisper_walker", "zurethkai_flameborn"];

lyranniBackgroundTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ lyranni_background_choice: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const alteriTalentTabs = ["maskwrights_grace", "shaped_for_subtlety"];

alteriTalentTabs.forEach(tab => {
  on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ alteri_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
  });
});

const draeviTalentTabs = ["clan_blooded", "scavengers_edge"];

draeviTalentTabs.forEach(tab => {
  on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ draevi_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
  });
});

const humanTalentTabs = ["quick_fixer", "skilled_focus"];

humanTalentTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ human_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const lyranniTalentTabs = ["aether_override", "echo_in_the_veins"];

lyranniTalentTabs.forEach(tab => {
  on(`clicked:${tab}`, () => {
		if (debug_on) console.log("Clicked tab", tab);
		setAttrs({ lyranni_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
  });
});

//----------------------- Tab Workers End ----------------------//

// Mirror select dropdown value to hidden input (for CSS Wizardry styling)
on("change:repeating_spells:spellprepared", function(eventInfo) {
  if (debug_on_trace) console.log ("[change:repeating_spells:spellprepared] Start");
  const match = eventInfo.sourceAttribute.match(/repeating_spells_([^_]+)_/);
  if (!match) return;

  const rowId = match[1];
  const sourceAttr = `repeating_spells_${rowId}_spellprepared`;
  const mirrorAttr = `repeating_spells_${rowId}_spellprepared_mirror`;

  getAttrs([sourceAttr], function(values) {
    const mirrorValue = values[sourceAttr] === "1" ? "1" : "0";
    setAttrs({ [mirrorAttr]: mirrorValue });
  });
});

// Sum spellcosts only for prepared spells
on("change:repeating_spells:spellcost change:repeating_spells:spellprepared remove:repeating_spells", function() {
  if (debug_on_trace) console.log ("[change:repeating_spells:spellcost change:repeating_spells:spellprepared remove:repeating_spells] Start");
  getSectionIDs("repeating_spells", function(ids) {
    const attrsToGet = ids.flatMap(id => [
      `repeating_spells_${id}_spellcost`,
      `repeating_spells_${id}_spellprepared`
    ]);

    getAttrs(attrsToGet, function(values) {
      let total = 0;
      ids.forEach(id => {
        const cost = parseFloat(values[`repeating_spells_${id}_spellcost`] || 0);
        const isPrepared = values[`repeating_spells_${id}_spellprepared`] === "1";
        if (isPrepared) total += cost;
      });
      setAttrs({ total_spellcost: total });
    });
  });
});

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

function getAllBackgroundSkills(race) {
		if (debug_on_trace) console.log ("[getAllBackgroundSkills] Start");
  const skills = new Set();
  const backgrounds = backgroundSkillMap[race] || {};
  Object.values(backgrounds).forEach(skillGroup => {
    Object.keys(skillGroup).forEach(skill => skills.add(skill));
  });
  return [...skills];
}

function getAllTalentSkills(race) {
	if (debug_on_trace) console.log ("[getAllTalentSkills] Start");
  const skills = new Set();
  const talents = talentSkillMap[race] || {};
  Object.values(talents).forEach(skillGroup => {
    Object.keys(skill => skills.add(skill));
  });
  return [...skills];
}

// -------------------- working area start --------------- //

// == Sheet Worker.js ==
// Dependencies: skillMapTable, backgroundSkillMap, talentSkillMap, raceValueMap

// === Helpers ===

function resetAllMDRToBase(race, callback) {
		if (debug_on_trace) console.log ("[resetAllMDRToBase] Start");
  const skills = Object.keys(skillMapTable);
  const attrsToGet = skills.map(skill => `${skill}_skill_mdr`).concat(skills.map(skill => `${skill}_mdr`));

  getAttrs(attrsToGet, values => {
    const updates = {};
    skills.forEach(skill => {
      const base = parseInt(values[`${skill}_skill_mdr`] || "0", 10);
      updates[`${skill}_mdr`] = base;
    });
    if (debug_on) console.log("[resetAllMDRToBase]", updates);
    setAttrs(updates, callback);
  });
}

function applyAllSkillBonuses(race) {
	if (debug_on_trace) console.log ("[applyAllSkillBonuses] Start");
  const backgroundSkills = getAllBackgroundSkills(race);
  const talentSkills = getAllTalentSkills(race);

  const updates = {};
  Object.assign(updates, setDefaultSkillBonuses(race, backgroundSkills));
  Object.assign(updates, setDefaultTalentBonuses(race, talentSkills));

  if (debug_on) console.log("[applyAllSkillBonuses]", updates);
  setAttrs(updates);
}

on("change:showracials sheet:opened", () => {
	if (debug_on_trace) console.log ("[change:showracials sheet:opened] Start");
	getAttrs(["showracials", "language_own_txt", "language_caltheran_txt"], values => {
		const race = values.showracials || "";

		if (!raceDataMap[race]) {
			if (debug_on) console.log("[Skill Init] No race data for:", race);
			return;
		}

		const raceData = raceDataMap[race];
		const racialLang = raceData.language || "Racial";

		if (debug_on) {
			console.log("[showracials handler] Race:", race);
			console.log(`Racial Lang: ${racialLang}`);
		}

		handleRaceChange(race);

		const otherLang = race === "human" ? "Other" : "Caltheran";

		const updates = {
			language_own_txt: `${racialLang}(75%)`,
			language_caltheran_txt: `${otherLang}(EDU)`
		};

		setAttrs(updates);
	});
});

const registeredRaces = new Set();

function registerSkillHandler(racePrefix, triggerSkills, talentSources = []) {
		if (debug_on_trace) console.log ("[registerSkillHandler] Start");
	const key = `${racePrefix}`;
	if (registeredRaces.has(key)) return;
	registeredRaces.add(key);

	const allSkills = Object.values(skillMapTable).map(s => s.label);

	const baseSkillLookup = Object.values(skillMapTable).reduce((map, skill) => {
		map[skill.label] = parseInt(skill.base || "0", 10);
		return map;
	}, {});

	const magicSchools = Object.values(skillMapTable)
	.filter(skill => skill.group === "Magic" && skill.label !== "magic_universal")
	.map(skill => skill.bonus); // bonus field is like "magic_alteration_mdr", "magic_elemental_mdr", etc


	const watched = [
		`${racePrefix}_mdr_checkbox`,
		"dex",
		"edu",
		"language_caltheran_skill_mdr",
		...magicSchools,
		...allSkills.map(skill => `${skill}_skill_mdr`),
		...triggerSkills.flatMap(skill => [
			`${racePrefix}_${skill}_bonus_mdr`,
			`${racePrefix}_talent_${skill}_bonus_mdr`
		]),
		...Object.keys(talentSkillMap[racePrefix]).map(talentKey => `${racePrefix}_${talentKey}_mdr_checkbox`)
	];

	const skillsToAttrs = allSkills.reduce((map, skill) => {
		map[skill] = [
			`${skill}_skill_mdr`,
			`${skill}_mdr`,
			`${racePrefix}_${skill}_bonus_mdr`,
			`${racePrefix}_talent_${skill}_bonus_mdr`
		];
		return map;
	}, {});

	const globalAttrs = [
		"dex",
		"edu",
		"language_caltheran_skill_mdr",
		...magicSchools,
		`${racePrefix}_mdr_checkbox`,
		"showracials",
		...Object.keys(talentSkillMap[racePrefix] || {}).map(talent => `${racePrefix}_${talent}_mdr_checkbox`)
	];

	if (debug_on) console.log("[registerSkillHandler Init]", { watched });

	// BEGIN Sheet Worker Watcher
	on([...new Set(watched)].map(s => `change:${s}`).join(" "), () => {
		getAttrs(globalAttrs.concat(...Object.values(skillsToAttrs)), values => {
			const activeRace = values.showracials || "unknown"; // minimal change here
			if (activeRace !== racePrefix) return;

			const bgSkill = values[`${racePrefix}_mdr_checkbox`] || null;
			const talentSkills = Object.entries(talentSkillMap[racePrefix] || {})
				.map(([talentKey, skills]) => {
					const val = values[`${racePrefix}_${talentKey}_mdr_checkbox`];
					return val && val.startsWith("talent_") ? val.replace("talent_", "") : null;
				})
				.filter(Boolean);

			const update = {};
			let totalSkillPointsSpent = 0;

			allSkills.forEach(skill => {
				let base = parseInt(values[`${skill}_skill_mdr`], 10);
				const defaultBase = baseSkillLookup[skill] || 0;
				if (isNaN(base)) {
				// Auto-correct missing or blank input to default
					base = defaultBase; // << use defaultBase here
					update[`${skill}_skill_mdr`] = base;
				}
				const spent = Math.max(base - defaultBase, 0);
				totalSkillPointsSpent += spent;
				
				const bgBonus = bgSkill === skill ? parseInt(values[`${racePrefix}_${skill}_bonus_mdr`] || "0", 10) : 0;
				const talentBonus = talentSkills.includes(skill) ? parseInt(values[`${racePrefix}_talent_${skill}_bonus_mdr`] || "0", 10) : 0;
				let total = base + bgBonus + talentBonus;

				if (skill === "dodge") {
					const idex = parseInt(values.dex || "0", 10);
					const dexBonus = Math.floor(idex / 2);
					total += dexBonus;
					if (debug_on) console.log(`[Dodge Adjustment] DEX=${idex}, +${dexBonus} added`);
				}

				update[`${skill}_mdr`] = total;

				if (debug_on && (bgBonus || talentBonus || skill === "dodge")) {
					console.log(`[Skill Calc] ${skill}: base=${base}, bgBonus=${bgBonus}, talentBonus=${talentBonus}, total=${total}`);
				}
			});

			const icaltheran = parseInt(values.language_caltheran_skill_mdr || "0", 10);
			const iedu = parseInt(values.edu || "0", 10);
			update["language_caltheran_mdr"] = icaltheran + iedu;
			
			update["total_skill_points_spent"] = totalSkillPointsSpent;

			// Universal Magic Skill
			const schoolValues = magicSchools.slice(0, 9).map(attr => parseInt(values[attr], 10) || 0);
			const baseUniversal = parseInt(values.magic_universal_skill_mdr, 10) || 0;
			const highestSchool = Math.max(...schoolValues);
			update["magic_universal_mdr"] = highestSchool + baseUniversal;

			if (debug_on) {
				console.log(`Highest Magic School: ${highestSchool}`);
				console.log(`Universal Base: ${baseUniversal}`);
				console.log(`Total Universal: ${highestSchool + baseUniversal}`);
			}

			setAttrs(update);
		});
	});
	// END Sheet Worker Watcher

	if (debug_on) {
		console.log("[registerSkillHandler] Manual initialization on load");
		console.log("[registerSkillHandler] Skills to initialize:", triggerSkills);
	}

	// BEGIN Manual Initialization
	getAttrs(globalAttrs.concat(...Object.values(skillsToAttrs)), values => {
		const activeRace = values.showracials || "unknown"; // minimal change here
		if (activeRace !== racePrefix) return;

		const bgSkill = values[`${racePrefix}_mdr_checkbox`] || null;
		const talentSkills = Object.entries(talentSkillMap[racePrefix] || {})
			.map(([talentKey, skills]) => {
				const val = values[`${racePrefix}_${talentKey}_mdr_checkbox`];
				return val && val.startsWith("talent_") ? val.replace("talent_", "") : null;
			})
			.filter(Boolean);

		const update = {};
		let totalSkillPointsSpent = 0;

		allSkills.forEach(skill => {
			let base = parseInt(values[`${skill}_skill_mdr`], 10);
			const defaultBase = baseSkillLookup[skill] || 0;
			if (isNaN(base)) {
				// Auto-correct missing or blank input to default
				base = defaultBase; // << use defaultBase here
				update[`${skill}_skill_mdr`] = base;
			}
			const spent = Math.max(base - defaultBase, 0);
			totalSkillPointsSpent += spent;

			const bgBonus = bgSkill === skill ? parseInt(values[`${racePrefix}_${skill}_bonus_mdr`] || "0", 10) : 0;
			const talentBonus = talentSkills.includes(skill) ? parseInt(values[`${racePrefix}_talent_${skill}_bonus_mdr`] || "0", 10) : 0;
			let total = base + bgBonus + talentBonus;

			if (skill === "dodge") {
				const idex = parseInt(values.dex || "0", 10);
				const dexBonus = Math.floor(idex / 2);
				total += dexBonus;
				if (debug_on) console.log(`[Manual Dodge Adjustment] DEX=${idex}, +${dexBonus} added`);
			}

			update[`${skill}_mdr`] = total;

			if (debug_on && (bgBonus || talentBonus || skill === "dodge")) {
				console.log(`[Manual Init Skill Calc] ${skill}: base=${base}, bgBonus=${bgBonus}, talentBonus=${talentBonus}, total=${total}`);
			}
		});

		const icaltheran = parseInt(values.language_caltheran_skill_mdr || "0", 10);
		const iedu = parseInt(values.edu || "0", 10);
		update["language_caltheran_mdr"] = icaltheran + iedu;
		
		update["total_skill_points_spent"] = totalSkillPointsSpent;

		const schoolValues = magicSchools.slice(0, 9).map(attr => parseInt(values[attr], 10) || 0);
		const baseUniversal = parseInt(values.magic_universal_skill_mdr, 10) || 0;
		const highestSchool = Math.max(...schoolValues);
		update["magic_universal_mdr"] = highestSchool + baseUniversal;

		if (debug_on) {
			console.log(`Highest Magic School: ${highestSchool}`);
			console.log(`Universal Base: ${baseUniversal}`);
			console.log(`Total Universal: ${highestSchool + baseUniversal}`);
		}

		setAttrs(update);
	});
	// END Manual Initialization
}


function setDefaultSkillBonuses(race) {
		  if (debug_on_trace) console.log ("[setDefaultSkillBonuses] Start");
  const updates = {};
  const raceBackgrounds = backgroundSkillMap[race];

  if (!raceBackgrounds) return updates;

  Object.values(raceBackgrounds).forEach(skillSet => {
    Object.keys(skillSet).forEach(skill => {
      const attr = `${race}_${skill}_bonus_mdr`;
      if (!(attr in updates)) updates[attr] = 5;
    });
  });

//  if (debug_on) console.log("[setDefaultSkillBonuses]", updates);
  setAttrs(updates);
  return updates;
}

function setDefaultTalentBonuses(race) {
	  if (debug_on_trace) console.log ("[setDefaultTalentBonuses] Start");
  const updates = {};
  const raceTalents = talentSkillMap[race];

  if (!raceTalents) return updates;

  Object.values(raceTalents).forEach(skillSet => {
    Object.keys(skillSet).forEach(skill => {
      const attr = `${race}_talent_${skill}_bonus_mdr`;
      if (!(attr in updates)) updates[attr] = 10;
    });
  });

//  if (debug_on) console.log("[setDefaultTalentBonuses]", updates);
  setAttrs(updates);
  return updates;
}

function applyRacialBaseStats(race) {
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
      const current = parseInt(currentRaw, 10);
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
  if (debug_on_trace) console.log ("[handleRaceChange] Start");
  if (race === lastRaceHandled) {
    if (debug_on) console.log(`[handleRaceChange] Skipped duplicate init for race: ${race}`);
    return;
  }
  lastRaceHandled = race;

//  if (debug_on) console.log("[handleRaceChange]", race);

  resetAllMDRToBase();
  applyRacialBaseStats(race);
  applyAllSkillBonuses(race);

  const skillList = Object.values(backgroundSkillMap[race] || {}).flatMap(obj => Object.keys(obj));
  const talentList = Object.values(talentSkillMap[race] || {}).flatMap(obj => Object.keys(obj));

  registerSkillHandler(race, skillList, talentList);
}

on("sheet:opened", function () {
  if (debug_on_trace) console.log("[sheet:opened] New Character check");
  
  getAttrs(["showracials", "new_character_flag"], values => {
    const isNew = values.new_character_flag === "1";
    const race = values.showracials || "unknown"; // ⬅️ direct from showracials now
    const updates = {};

    //    if (debug_on) console.log("[sheet:opened]", { race, isNew });
	getAttrs(["showskills"], values => {
        if (!values.showskills || values.showskills === "0") {
            setAttrs({ showskills: "3" });
        }
    });

    // Always run skill init if new character
    if (isNew) {
      Object.entries(skillMapTable).forEach(([key, { label, base, notes }]) => {
        const val = parseInt(base, 10) || 0;
        updates[`${label}_skill_mdr`] = val;
        updates[`${label}_mdr`] = val;
        updates[`${label}_note`] = notes || "";
      });
      updates.new_character_flag = "0";

      if (debug_on) console.log("[New Character Skill Init]", updates);
    }

    setAttrs(updates, () => {
	  if (debug_on) console.log ("[sheet:opened] Checking for undefined or unknown race");
      if (race && race !== "unknown" && race !== "0") {
        // Handle race bonus init
		if (debug_on) console.log (`[sheet:opened] Race: "${race}" being initialized`);
        handleRaceChange(race);
      }
	  registerStatHandler();
    });
  });
});


function registerStatHandler() {
	if (debug_on_trace) console.log ("[registerStatHandler] Start");
    const watched = [
        "age", "str", "dex", "pow", "con", "app", "edu", "siz", "int", "mag", "vitality", 
    ];

    if (debug_on) console.log("[registerStatHandler Init] Watching:", watched);

    on(watched.map(s => `change:${s} add:${s}`).join(" "), () => {
        getAttrs(watched, values => {
		    const iage = parseInt(values.age) || 0;
			const istr = parseInt(values.str) || 0;
			const idex = parseInt(values.dex) || 0;
			const ipow = parseInt(values.pow) || 0;
            const icon = parseInt(values.con) || 0;
			const iapp = parseInt(values.app) || 0;
            const iedu = parseInt(values.edu) || 0;			
            const isiz = parseInt(values.siz) || 0;
            const iint = parseInt(values.int) || 0;
            const imag = parseInt(values.mag) || 0;
            const ivit = parseInt(values.vitality) || 0;

            const update = {};
			
			// Attribute Points Total Calculation
			const statKeys = ["str", "dex", "pow", "con", "app", "edu", "siz", "int", "mag"];

			let totalAttrPointsSpent = 0;

			statKeys.forEach(stat => {
				const val = parseInt(values[stat], 10) || 0;
				totalAttrPointsSpent += val;
			});

			update["total_attr_points_spent"] = totalAttrPointsSpent;
			
            // Armor Class = min(MAG, VITALITY)
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

            // Movement Rate
            let imov = 8;
            if (idex < isiz && istr < isiz) {
                imov = 7;
            } else if (idex > isiz && istr > isiz) {
                imov = 9;
            }

			if (iage >= 40) imov -= Math.min(6, Math.floor((iage - 40) / 10) + 1);

            update.mov = imov;

            if (debug_on) {
                console.log("[Stat Calc] STR+SIZ=", siz_str_tot);
                console.log("[Stat Calc] AC=", update.ac);
                console.log("[Stat Calc] MOV=", imov);
                console.log("[Stat Calc] DMG Bonus / Build=", update.damage_bonus, update.build);
            }

            setAttrs(update);
        });
    });
}
// -------------------- working area end ----------------- //

  on('sheet:opened', function () {
	  if (debug_on_trace) console.log ("[sheet:opened] Translation");
  const translationFields = [
    "str_txt", "dex_txt", "pow_txt", "con_txt", "app_txt", "edu_txt", "siz_txt", "int_txt", "mag_txt", "luck_txt",
    "accounting_txt", "alchemy_txt", "animalhandling_txt", "anthropology_txt", "appraise_txt", "arcana_txt",
    "archaeology_txt", "archanotech_txt", "archery_txt", "architecture_txt", "biology_txt", "bureaucracy_txt",
    "charm_txt", "chemistry_txt", "climb_txt", "computeruse_txt", "creditrating_txt", "cthulhumythos_txt",
    "cybernetics_txt", "dance_txt", "demolitions_txt", "disguise_txt", "deception_txt", "dodge_txt", "driveauto_txt",
    "drone_operation_txt", "elecrepair_txt", "engineering_txt", "etiquette_high_society_txt", "fasttalk_txt",
    "fighting_brawl_txt", "firearms_hg_txt", "firearms_rifle_txt", "first_aid_txt", "forbidden_lore_txt",
    "forgery_txt", "gunnery_txt", "heavy_weapons_txt", "history_txt", "impersonation_txt", "instrument_txt",
    "intimidate_txt", "interrogation_txt", "insight_txt", "investigation_txt", "jump_txt", "law_txt", "libraryuse_txt",
    "listen_txt", "locksmith_txt", "magic_alteration_txt", "magic_elemental_txt", "magic_enchantment_txt",
    "magic_illusion_txt", "magic_necromancy_txt", "magic_restoration_txt", "magic_summoning_txt", "magic_technomancy_txt",
    "magic_warding_txt", "magic_universal_txt", "mechrepair_txt", "mechanics_txt", "medicine_txt", "melee_weapons_txt",
    "naturalworld_txt", "navigate_txt", "occult_txt", "ophvmachine_txt", "perception_txt", "persuade_txt", "physics_txt",
    "pilotaircraft_txt", "pilotboat_txt", "psychology_txt", "psychoanalysis_txt", "ride_txt", "security_txt",
    "singing_txt", "sleightofhand_txt", "slicing_txt", "spirit_lore_txt", "spothidden_txt", "stealth_txt", "streetwise_txt",
    "survival_txt", "athletics_txt", "coordination_txt", "swim_txt", "throw_txt", "track_txt", "unarmed_txt", "veil_lore_txt"
  ];

  getAttrs(translationFields, values => {
    const updates = {};

    translationFields.forEach(field => {
      const translationKey = field.replace("_txt", "-r-txt")
        .replace("luck_txt", "luck-u")
		.replace("unarmed_txt", "unarmed-z")
		.replace("str-r-txt", "STR-r-txt")
		.replace("dex-r-txt", "DEX-r-txt")
		.replace("pow-r-txt", "POW-r-txt")
		.replace("con-r-txt", "CON-r-txt")
		.replace("app-r-txt", "APP-r-txt")
		.replace("edu-r-txt", "EDU-r-txt")
		.replace("siz-r-txt", "SIZ-r-txt")
		.replace("int-r-txt", "INT-r-txt")
		.replace("mag-r-txt", "MAG-r-txt");

      const correctText = getTranslationByKey(translationKey);
      if (values[field] !== correctText) {
        updates[field] = correctText;
      }
    });

    if (Object.keys(updates).length > 0) {
      setAttrs(updates);
    }
  });
});