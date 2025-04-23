const debug_on = true;

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

const raceLanguageMap = {
  "alteri": "Nualeth",
  "draevi": "Khevala",
  "feran": "A",
  "human": "Caltheran",
  "khadra": "Nari",
  "kitsu": "B",
  "lyranni": "Thal’Resh",
  "veyra": "C"
};

const raceValueMap = {
  "1": "alteri",
  "2": "draevi",
  "3": "feran",
  "4": "human",
  "5": "khadra",
  "6": "kitsu",
  "7": "lyranni",
  "8": "veyra"
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
 "Language(Caltheran)": { label: "caltheran", base: "0", skill: "language_caltheran_skill_mdr", bonus: "language_caltheran_mdr", group: "Language", notes: "Calthern language" }
};

//----------------------- Tab Workers Start ----------------------//

const tabList = ["skills", "background", "talents", "combat", "spells", "inventory", "backstory", "npcs", "vehicles"];

tabList.forEach(tab => {
    on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ selected_tab: tab });
    });
});

const alteriBackgroundTabs = ["break_faced_radical", "ghostline_runner", "legacy_bearer", "soft_year_drifter", "veilhaven_attendant"];

alteriBackgroundTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ alteri_background_choice: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const draeviBackgroundTabs = ["forgeblood_scavenger", "horn_carved_wanderer", "spiritbound_techshaper", "tradition_keeper"];

draeviBackgroundTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ draevi_background_choice: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const humanBackgroundTabs = ["ash_war_refugee", "data_hatched", "enclave_born", "gutter_fire_youth", "outpost_raised", "scavsteel_whelp"];

humanBackgroundTabs.forEach(tab => {
		on(`clicked:${tab}`, () => {
			console.log("Clicked tab", tab);
			setAttrs({ human_background_choice: tab });
			race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const lyranniBackgroundTabs = ["aelvareth_devotee", "echoborne", "glide_spire_scion", "whisper_walker", "zurethkai_flameborn"];

lyranniBackgroundTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ lyranni_background_choice: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const alteriTalentTabs = ["maskwrights_grace", "shaped_for_subtlety"];

alteriTalentTabs.forEach(tab => {
  on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ alteri_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
  });
});

const draeviTalentTabs = ["clan_blooded", "scavengers_edge"];

draeviTalentTabs.forEach(tab => {
  on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ draevi_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
  });
});

const humanTalentTabs = ["quick_fixer", "skilled_focus"];

humanTalentTabs.forEach(tab => {
	on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ human_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
	});
});

const lyranniTalentTabs = ["aether_override", "echo_in_the_veins"];

lyranniTalentTabs.forEach(tab => {
  on(`clicked:${tab}`, () => {
		console.log("Clicked tab", tab);
		setAttrs({ lyranni_talent_tab: tab });
		race_default_trigger: Date.now() // Triggers recalculation and is watched
  });
});

//----------------------- Tab Workers End ----------------------//

// Mirror select dropdown value to hidden input (for CSS Wizardry styling)
on("change:repeating_spells:spellprepared", function(eventInfo) {
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
  getAttrs(["total_spellcost", "ac"], function (values) {
    const cost = parseFloat(values.total_spellcost) || 0;
    const capacity = parseFloat(values.ac) || 0;
    const isOver = cost > capacity ? "1" : "0";
	
    // Log the raw values and the comparison result
    console.log("Total Spell Cost:", cost);
    console.log("Arcane Capacity:", capacity);
    console.log("Is Over Capacity:", isOver);
	
    setAttrs({ spellcost_overflow: isOver });
  });
});

on("change:showracials sheet:opened", () => {
	getAttrs(["showracials", "language_own_txt", "language_caltheran_txt"], values => {
		const raceId = String(values.showracials || "0");
		const race = raceValueMap[raceId] || "human";
		const racialLang = raceLanguageMap[race] || "Racial";

		// Determine language labels based on race
		const ownLang = `${racialLang}(75%)`;
		const otherLang = race === "human" ? "Other(EDU)" : "Caltheran(EDU)";

		const updates = {
			language_own_txt: ownLang,
			language_caltheran_txt: otherLang
		};

		setAttrs(updates);
	});
});

// List of relevant attributes
const magicSchools = [
  "magic_alteration_mdr",
  "magic_elemental_mdr",
  "magic_enchantment_mdr",
  "magic_illusion_mdr",
  "magic_necromancy_mdr",
  "magic_restoration_mdr",
  "magic_summoning_mdr",
  "magic_technomancy_mdr",
  "magic_warding_mdr",
  "magic_universal_skill_mdr"
];

// Trigger on any of the above changing
on(`change:${magicSchools.join(' change:')}`, () => {
  getAttrs(magicSchools, values => {
    const schoolValues = magicSchools
      .slice(0, 9) // first 9 are school values
      .map(attr => parseInt(values[attr], 10) || 0);

    const baseUniversal = parseInt(values.magic_universal_skill_mdr, 10) || 0;
    const highestSchool = Math.max(...schoolValues);
    const total = highestSchool + baseUniversal;

//    console.log(`Highest Magic School: ${highestSchool}`);
//    console.log(`Universal Base: ${baseUniversal}`);
//    console.log(`Total Universal: ${total}`);

    setAttrs({ magic_universal_mdr: total });
  });
});

function getAllBackgroundSkills(race) {
  const skills = new Set();
  const backgrounds = backgroundSkillMap[race] || {};
  Object.values(backgrounds).forEach(skillGroup => {
    Object.keys(skillGroup).forEach(skill => skills.add(skill));
  });
  return [...skills];
}

function getAllTalentSkills(race) {
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
function getActiveRace(values) {
  const raceId = values.showracials || "0";
  const race = raceValueMap[raceId] || "unknown";
  if (debug_on) console.log("[getActiveRace]", { raceId, race });
  return race;
}

function resetAllMDRToBase(race, callback) {
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
  const backgroundSkills = getAllBackgroundSkills(race);
  const talentSkills = getAllTalentSkills(race);

  const updates = {};
  Object.assign(updates, setDefaultSkillBonuses(race, backgroundSkills));
  Object.assign(updates, setDefaultTalentBonuses(race, talentSkills));

  if (debug_on) console.log("[applyAllSkillBonuses]", updates);
  setAttrs(updates);
}

on("change:showracials", function () {
  getAttrs(["showracials"], values => {
    const race = getActiveRace(values);
    if (!race || race === "unknown") return;
    if (debug_on) console.log("[change:showracials]", race);
    handleRaceChange(race);
  });
});

on("change:showracials sheet:opened", () => {
  getAttrs(["showracials", "language_own_txt", "language_caltheran_txt"], values => {
    const raceId = values["showracials"];
    const mappedRace = raceValueMap[String(raceId)];

    if (!mappedRace) {
      console.log("[Skill Init] No mapped race for Race ID:", raceId);
      return;
    }

    const racialLang = raceLanguageMap[mappedRace] || "Racial";
    const otherLang = mappedRace === "human" ? "Other" : "Caltheran";

    const updates = {
      language_own_txt: `${racialLang}(75%)`,
      language_caltheran_txt: `${otherLang}(EDU)`
    };

    setAttrs(updates);
  });
});

const registeredRaces = new Set();

function registerSkillHandler(racePrefix, triggerSkills, talentSources = []) {
	const key = `${racePrefix}`;
	if (registeredRaces.has(key)) return;
	registeredRaces.add(key);

	const watched = [
		`${racePrefix}_mdr_checkbox`,
		...triggerSkills.flatMap(skill => [
			`${skill}_skill_mdr`,
			`${racePrefix}_${skill}_bonus_mdr`,
			`${racePrefix}_talent_${skill}_bonus_mdr`
		]),
		...Object.keys(talentSkillMap[racePrefix]).map(talentKey => `${racePrefix}_${talentKey}_mdr_checkbox`)
	];

	const skillsToAttrs = triggerSkills.reduce((map, skill) => {
		map[skill] = [
			`${skill}_skill_mdr`,
			`${skill}_mdr`,
			`${racePrefix}_${skill}_bonus_mdr`,
			`${racePrefix}_talent_${skill}_bonus_mdr`
		];
		return map;
	}, {});

	const globalAttrs = [
		`${racePrefix}_mdr_checkbox`,
		"showracials",
//		...talentSources.map(source => `${racePrefix}_${source}_mdr_checkbox`),
		...Object.keys(talentSkillMap[racePrefix] || {}).map(talent =>
			`${racePrefix}_${talent}_mdr_checkbox`
		)
	];

	if (debug_on) console.log("[registerSkillHandler Init]", { watched });

	const uniqueWatched = [...new Set(watched)];
	on(uniqueWatched.map(s => `change:${s}`).join(" "), () => {
		if (debug_on) {
			console.log("[registerSkillHandler Init]", {
				racePrefix,
				watched,
				talentSources
			});
		}

		getAttrs(globalAttrs.concat(...Object.values(skillsToAttrs)), values => {
			if (debug_on) {
				console.log("\n[Skill Handler] Values Retrieved:");
				Object.keys(values).forEach(key => {
					console.log(`  ${key} = ${values[key]}`);
				});
			}
			const raceId = values.showracials || "0";
			const activeRace = raceValueMap[raceId];
			const isActive = activeRace === racePrefix;
			if (!isActive) return;

			if (debug_on) console.log("[Skill Handler Execution]", { racePrefix, activeRace, isActive });

			triggerSkills.forEach(skill => {
				const base = parseInt(values[`${skill}_skill_mdr`] || "0", 10);
				const hasBg = values[`${racePrefix}_mdr_checkbox`] === skill;
				
				if (debug_on) {
					console.log(`\n[Skill Handler Debug: ${skill}]`);
					console.log("  Base:", base);
					console.log("  Checking talent sources:", talentSources);
				}

				
				let talentBonus = 0;
				Object.entries(talentSkillMap[racePrefix] || {}).forEach(([talentKey, skills]) => {
					const checkboxName = `${racePrefix}_${talentKey}_mdr_checkbox`;
					const checkboxValue = values[checkboxName];
					const expectedValue = `talent_${skill}`;
					if (checkboxValue === `talent_${skill}`) {
						talentBonus += 10;
						if (debug_on) console.log(`Inside IF  → Talent Checkbox [${checkboxName}]: ${checkboxValue} (Expect: ${expectedValue})`);
					}
					if (debug_on) console.log(`Outside IF  → Talent Checkbox [${checkboxName}]: ${checkboxValue} (Expect: ${expectedValue})`)
				});

				const bgBonus = hasBg ? parseInt(values[`${racePrefix}_${skill}_bonus_mdr`] || "0", 10) : 0;
				const total = base + bgBonus + talentBonus;

				if (debug_on && (bgBonus !== 0 || talentBonus !== 0)) {
					console.log(`[Skill Calculation] ${skill}`);
					console.log(`  Base: ${base}`);
					console.log(`  Background Bonus: ${bgBonus}`);
					console.log(`  Talent Bonus: ${talentBonus}`);
					console.log(`  Final ${skill}_mdr = ${total}`);
					console.log("  Final MDR Value:", base + bgBonus + talentBonus);
				}

				const update = {};
				update[`${skill}_mdr`] = total;
				setAttrs(update);
				
				if (debug_on) {
					console.log(`[setAttrs] Updated ${skill}_mdr =>`, update[`${skill}_mdr`]);
				}
			});
		});
	});

	if (debug_on) {
		console.log("[registerSkillHandler] Manual initialization on load");
		console.log("[registerSkillHandler] Skills to initialize:", triggerSkills);
	}

	getAttrs(globalAttrs.concat(...Object.values(skillsToAttrs)), values => {
		if (debug_on) {
			console.log("\n[Skill Handler] Values Retrieved:");
			Object.keys(values).forEach(key => {
				console.log(`  ${key} = ${values[key]}`);
			});
		}
		const raceId = values.showracials || "0";
		const activeRace = raceValueMap[raceId];
		const isActive = activeRace === racePrefix;
		if (!isActive) return;

		if (debug_on) console.log("[registerSkillHandler] Manual Init", { racePrefix, activeRace });

		triggerSkills.forEach(skill => {
			const base = parseInt(values[`${skill}_skill_mdr`] || "0", 10);
			const bgCheckedSkill = values[`${racePrefix}_mdr_checkbox`] || "";
			const hasBg = bgCheckedSkill === skill;
			
			if (debug_on) {
				console.log(`\n[Skill Handler Debug: ${skill}]`);
				console.log("  Base:", base);
				console.log("  Checking talent sources:", talentSources);
			}

			let talentBonus = 0;
			Object.entries(talentSkillMap[racePrefix] || {}).forEach(([talentKey, skills]) => {
				const checkboxName = `${racePrefix}_${talentKey}_mdr_checkbox`;
				const checkboxValue = values[checkboxName];
				const expectedValue = `talent_${skill}`;
				if (checkboxValue === `talent_${skill}`) {
					talentBonus += 10;
					if (debug_on) console.log(`Inside IF  → Talent Checkbox [${checkboxName}]: ${checkboxValue} (Expect: ${expectedValue})`);
				}
				if (debug_on) console.log(`Outside IF  → Talent Checkbox [${checkboxName}]: ${checkboxValue} (Expect: ${expectedValue})`)
			});

			const bgBonus = hasBg ? parseInt(values[`${racePrefix}_${skill}_bonus_mdr`] || "0", 10) : 0;
			const total = base + bgBonus + talentBonus;

			if (debug_on && (hasBg || talentBonus > 0)) {
				console.log(`[Manual Init Skill Calculation] ${skill}`);
				console.log(`  Base: ${base}`);
				console.log(`  Background Checked: ${bgCheckedSkill} (Match: ${hasBg})`);
				console.log(`  Talent Bonus: ${talentBonus}`);
				console.log(`  BG Bonus: ${bgBonus}`);
				console.log(`  Final ${skill}_mdr = ${total}`);
				console.log("  Final MDR Value:", base + bgBonus + talentBonus);
			}

			const update = {};
			update[`${skill}_mdr`] = total;
			setAttrs(update);
			if (debug_on) {
				console.log(`[setAttrs] Updated ${skill}_mdr =>`, update[`${skill}_mdr`]);
			}
		});
	});
}

function setDefaultSkillBonuses(race) {
  const updates = {};
  const raceBackgrounds = backgroundSkillMap[race];

  if (!raceBackgrounds) return updates;

  Object.values(raceBackgrounds).forEach(skillSet => {
    Object.keys(skillSet).forEach(skill => {
      const attr = `${race}_${skill}_bonus_mdr`;
      if (!(attr in updates)) updates[attr] = 5;
    });
  });

  if (debug_on) console.log("[setDefaultSkillBonuses]", updates);
  setAttrs(updates);
  return updates;
}


function setDefaultTalentBonuses(race) {
  const updates = {};
  const raceTalents = talentSkillMap[race];

  if (!raceTalents) return updates;

  Object.values(raceTalents).forEach(skillSet => {
    Object.keys(skillSet).forEach(skill => {
      const attr = `${race}_talent_${skill}_bonus_mdr`;
      if (!(attr in updates)) updates[attr] = 10;
    });
  });

  if (debug_on) console.log("[setDefaultTalentBonuses]", updates);
  setAttrs(updates);
  return updates;
}

let lastRaceHandled = null;

function handleRaceChange(race) {
  if (race === lastRaceHandled) {
    if (debug_on) console.log(`[handleRaceChange] Skipped duplicate init for race: ${race}`);
    return;
  }
  lastRaceHandled = race;

  if (debug_on) console.log("[handleRaceChange]", race);

  resetAllMDRToBase();
  setDefaultSkillBonuses(race);
  setDefaultTalentBonuses(race);
  applyAllSkillBonuses(race);

  const skillList = Object.values(backgroundSkillMap[race] || {}).flatMap(obj => Object.keys(obj));
  const talentList = Object.values(talentSkillMap[race] || {}).flatMap(obj => Object.keys(obj));
  if (debug_on) {
    console.log("[handleRaceChange] Calling registerSkillHandler");
    console.log("  Race:", race);
    console.log("  Skills:", skillList);
    console.log("  Talents:", talentList);
  }

  registerSkillHandler(race, skillList, talentList);
}




on("sheet:opened", function () {
  if (debug_on) console.log("[sheet:opened] fired");

  getAttrs(["showracials", "new_character_flag"], values => {
    const isNew = values.new_character_flag === "1";
    const race = getActiveRace(values);
    const updates = {};

    if (debug_on) console.log("[sheet:opened]", { race, isNew });

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
      if (race && race !== "unknown") {
        // Handle race bonus init
        handleRaceChange(race);

      }
    });
  });
});

// -------------------- working area end ----------------- //

  on("add:dex add:siz add:str change:dex change:siz change:str add:dodge_skill change:dodge_skill add:edu change:edu add:mag change:mag add:vitality change:vitality add:language_caltheran_skill_mdr change:language_caltheran_skill_mdr", function() {
    getAttrs(["str", "siz", "dex", "age", "dodge_skill_mdr", "edu", "mag", "vitality", "language_caltheran_skill_mdr"], function(values) {
      var istr = parseInt(values.str);
      var isiz = parseInt(values.siz);
      var idex = parseInt(values.dex);
	  var iage = parseInt(values.age);
	  var iedu = parseInt(values.edu);
      var siz_str_tot = istr + isiz;

	  setAttrs({
		dodge_skill_mdr: ( parseInt(values.dodge_skill_mdr) || 0 ),
		dodge_mdr: ( ( parseInt(values.dodge_skill_mdr) || 0 ) + ( Math.floor(idex / 2) ) ),
		language_caltheran_skill_mdr: ( parseInt(values.language_caltheran_skill_mdr ) || 0),
		language_caltheran_mdr: ( ( parseInt(values.language_caltheran_skill_mdr ) || 0) + iedu ),
		ac: ( Math.min(parseInt(values.mag) || 0, parseInt(values.vitality) || 0 ) )
	  });

	  switch (true) {
        case (siz_str_tot < 65):
          setAttrs({
            damage_bonus: "-2",
            build: "-2"
          });
          break;
        case (siz_str_tot > 64 && siz_str_tot < 85):
          setAttrs({
            damage_bonus: "-1",
            build: "-1"
          });
          break;
        case (siz_str_tot > 84 && siz_str_tot < 125):
          setAttrs({
            damage_bonus: "0",
            build: "0"
          });
          break;
        case (siz_str_tot > 124 && siz_str_tot < 165):
          setAttrs({
            damage_bonus: "1d4",
            build: "+1"
          });
          break;
        case (siz_str_tot > 164 && siz_str_tot < 205):
          setAttrs({
            damage_bonus: "1d6",
            build: "+2"
          });
          break;
        case (siz_str_tot > 204 && siz_str_tot < 285):
          setAttrs({
            damage_bonus: "2d6",
            build: "+3"
          });
          break;
        case (siz_str_tot > 284 && siz_str_tot < 365):
          setAttrs({
            damage_bonus: "3d6",
            build: "+4"
          });
          break;
        case (siz_str_tot > 364 && siz_str_tot < 445):
          setAttrs({
            damage_bonus: "4d6",
            build: "+5"
          });
          break;
        case (siz_str_tot > 444 && siz_str_tot < 525):
          setAttrs({
            damage_bonus: "5d6",
            build: "+6"
          });
          break;
      } //end switch (true)
	if (idex < isiz && istr < isiz) {
        var imov = 7;
      } else if (idex > isiz && istr > isiz) {
        var imov = 9;
      } else {
        var imov = 8;
      }
    if (iage < 40) {
      imov = imov;
    } else if (iage > 39 && iage < 50) {
      imov = imov - 1;
    } else if (iage > 49 && iage < 60) {
      imov = imov - 2;
    } else if (iage > 59 && iage < 70) {
      imov = imov - 3;
    } else if (iage > 69 && iage < 80) {
      imov = imov - 4;
    } else if (iage > 79 && iage < 90) {
      imov = imov - 5;
    } else if (iage > 89) {
      imov = imov - 6;
    }
    setAttrs({mov: imov});
    }); //end getAttrs
  }); //end on("add:siz...
  on("add:age change:age", function() {
    getAttrs(["str", "siz", "dex", "age"], function(values) {
      var iage = parseInt(values.age);
	  var istr = parseInt(values.str);
      var isiz = parseInt(values.siz);
      var idex = parseInt(values.dex);
	if (idex < isiz && istr < isiz) {
        var imov = 7;
      } else if (idex > isiz && istr > isiz) {
        var imov = 9;
      } else {
        var imov = 8;
      }
    if (iage < 40) {
      imov = imov;
    } else if (iage > 39 && iage < 50) {
      imov = imov - 1;
    } else if (iage > 49 && iage < 60) {
      imov = imov - 2;
    } else if (iage > 59 && iage < 70) {
      imov = imov - 3;
    } else if (iage > 69 && iage < 80) {
      imov = imov - 4;
    } else if (iage > 79 && iage < 90) {
      imov = imov - 5;
    } else if (iage > 89) {
      imov = imov - 6;
    }
    setAttrs({mov: imov});
    }); //end getAttrs
  }); //end on("add:siz...

  on('sheet:opened', function () {
    getAttrs(['str_txt'], v => {
      if (v.str_txt !== getTranslationByKey('STR-r-txt')) {
        setAttrs({str_txt: getTranslationByKey('STR-r-txt')});
    }}); getAttrs(['dex_txt'], v => {
      if (v.dex_txt !== getTranslationByKey('DEX-r-txt')) {
        setAttrs({dex_txt: getTranslationByKey('DEX-r-txt')});
    }}); getAttrs(['pow_txt'], v => {
      if (v.pow_txt !== getTranslationByKey('POW-r-txt')) {
        setAttrs({pow_txt: getTranslationByKey('POW-r-txt')});
    }}); getAttrs(['con_txt'], v => {
      if (v.con_txt !== getTranslationByKey('CON-r-txt')) {
        setAttrs({con_txt: getTranslationByKey('CON-r-txt')});
    }}); getAttrs(['app_txt'], v => {
      if (v.app_txt !== getTranslationByKey('APP-r-txt')) {
        setAttrs({app_txt: getTranslationByKey('APP-r-txt')});
    }}); getAttrs(['edu_txt'], v => {
      if (v.edu_txt !== getTranslationByKey('EDU-r-txt')) {
        setAttrs({edu_txt: getTranslationByKey('EDU-r-txt')});
    }}); getAttrs(['siz_txt'], v => {
      if (v.siz_txt !== getTranslationByKey('SIZ-r-txt')) {
        setAttrs({siz_txt: getTranslationByKey('SIZ-r-txt')});
    }}); getAttrs(['int_txt'], v => {
      if (v.int_txt !== getTranslationByKey('INT-r-txt')) {
        setAttrs({int_txt: getTranslationByKey('INT-r-txt')});
    }}); getAttrs(['mag_txt'], v => {
      if (v.mag_txt !== getTranslationByKey('MAG-r-txt')) {
        setAttrs({mag_txt: getTranslationByKey('MAG-r-txt')});
    }}); getAttrs(['luck_txt'], v => {
      if (v.luck_txt !== getTranslationByKey('luck-u')) {
        setAttrs({luck_txt: getTranslationByKey('luck-u')});
    }}); getAttrs(['accounting_txt'], v => {
      if (v.accounting_txt !== getTranslationByKey('accounting-r-txt')) {
        setAttrs({accounting_txt: getTranslationByKey('accounting-r-txt')});
    }}); getAttrs(['alchemy_txt'], v => {
      if (v.alchemy_txt !== getTranslationByKey('alchemy-r-txt')) {
        setAttrs({alchemy_txt: getTranslationByKey('alchemy-r-txt')});
    }}); getAttrs(['animalhandling_txt'], v => {
      if (v.animalhandling_txt !== getTranslationByKey('animalhandling-r-txt')) {
        setAttrs({animalhandling_txt: getTranslationByKey('animalhandling-r-txt')});
    }}); getAttrs(['anthropology_txt'], v => {
      if (v.anthropology_txt !== getTranslationByKey('anthropology-r-txt')) {
        setAttrs({anthropology_txt: getTranslationByKey('anthropology-r-txt')});
    }}); getAttrs(['appraise_txt'], v => {
      if (v.appraise_txt !== getTranslationByKey('appraise-r-txt')) {
        setAttrs({appraise_txt: getTranslationByKey('appraise-r-txt')});
	}}); getAttrs(['arcana_txt'], v => {
      if (v.arcana_txt !== getTranslationByKey('arcana-r-txt')) {
        setAttrs({arcana_txt: getTranslationByKey('arcana-r-txt')});
    }}); getAttrs(['archaeology_txt'], v => {
      if (v.archaeology_txt !== getTranslationByKey('archaeology-r-txt')) {
        setAttrs({archaeology_txt: getTranslationByKey('archaeology-r-txt')});
    }}); getAttrs(['archanotech_txt'], v => {
      if (v.archanotech_txt !== getTranslationByKey('archanotech-r-txt')) {
        setAttrs({archanotech_txt: getTranslationByKey('archanotech-r-txt')});
    }}); getAttrs(['archery_txt'], v => {
      if (v.archery_txt !== getTranslationByKey('archery-r-txt')) {
        setAttrs({archery_txt: getTranslationByKey('archery-r-txt')});
	}}); getAttrs(['architecture_txt'], v => {
      if (v.architecture_txt !== getTranslationByKey('architecture-r-txt')) {
        setAttrs({architecture_txt: getTranslationByKey('architecture-r-txt')});
	}}); getAttrs(['biology_txt'], v => {
      if (v.biology_txt !== getTranslationByKey('biology-r-txt')) {
        setAttrs({biology_txt: getTranslationByKey('biology-r-txt')});
    }}); getAttrs(['bureaucracy_txt'], v => {
      if (v.bureaucracy_txt !== getTranslationByKey('bureaucracy-r-txt')) {
        setAttrs({bureaucracy_txt: getTranslationByKey('bureaucracy-r-txt')});
    }}); getAttrs(['charm_txt'], v => {
      if (v.charm_txt !== getTranslationByKey('charm-r-txt')) {
        setAttrs({charm_txt: getTranslationByKey('charm-r-txt')});
	}}); getAttrs(['chemistry_txt'], v => {
      if (v.chemistry_txt !== getTranslationByKey('chemistry-r-txt')) {
        setAttrs({chemistry_txt: getTranslationByKey('chemistry-r-txt')});
    }}); getAttrs(['climb_txt'], v => {
      if (v.climb_txt !== getTranslationByKey('climb-r-txt')) {
        setAttrs({climb_txt: getTranslationByKey('climb-r-txt')});
    }}); getAttrs(['computeruse_txt'], v => {
      if (v.computeruse_txt !== getTranslationByKey('computeruse-r-txt')) {
        setAttrs({computeruse_txt: getTranslationByKey('computeruse-r-txt')});
    }}); getAttrs(['creditrating_txt'], v => {
      if (v.creditrating_txt !== getTranslationByKey('creditrating-r-txt')) {
        setAttrs({creditrating_txt: getTranslationByKey('creditrating-r-txt')});
    }}); getAttrs(['cthulhumythos_txt'], v => {
      if (v.cthulhumythos_txt !== getTranslationByKey('cthulhumythos-r-txt')) {
        setAttrs({cthulhumythos_txt: getTranslationByKey('cthulhumythos-r-txt')});
    }}); getAttrs(['cybernetics_txt'], v => {
      if (v.cybernetics_txt !== getTranslationByKey('cybernetics-r-txt')) {
        setAttrs({cybernetics_txt: getTranslationByKey('cybernetics-r-txt')});
    }}); getAttrs(['dance_txt'], v => {
      if (v.dance_txt !== getTranslationByKey('dance-r-txt')) {
        setAttrs({dance_txt: getTranslationByKey('dance-r-txt')});
	}}); getAttrs(['demolitions_txt'], v => {
      if (v.demolitions_txt !== getTranslationByKey('demolitions-r-txt')) {
        setAttrs({demolitions_txt: getTranslationByKey('demolitions-r-txt')});
    }}); getAttrs(['disguise_txt'], v => {
      if (v.disguise_txt !== getTranslationByKey('disguise-r-txt')) {
        setAttrs({disguise_txt: getTranslationByKey('disguise-r-txt')});
    }}); getAttrs(['deception_txt'], v => {
      if (v.deception_txt !== getTranslationByKey('deception-r-txt')) {
        setAttrs({deception_txt: getTranslationByKey('deception-r-txt')});
    }}); getAttrs(['dodge_txt'], v => {
      if (v.dodge_txt !== getTranslationByKey('dodge-r-txt')) {
        setAttrs({dodge_txt: getTranslationByKey('dodge-r-txt')});
    }}); getAttrs(['driveauto_txt'], v => {
      if (v.driveauto_txt !== getTranslationByKey('driveauto-r-txt')) {
        setAttrs({driveauto_txt: getTranslationByKey('driveauto-r-txt')});
    }}); getAttrs(['drone_operation_txt'], v => {
      if (v.pilotboat_txt !== getTranslationByKey('drone_operation-r-txt')) {
        setAttrs({pilotboat_txt: getTranslationByKey('drone_operation-r-txt')});
    }}); getAttrs(['elecrepair_txt'], v => {
      if (v.elecrepair_txt !== getTranslationByKey('elecrepair-r-txt')) {
        setAttrs({elecrepair_txt: getTranslationByKey('elecrepair-r-txt')});
	}}); getAttrs(['engineering_txt'], v => {
      if (v.engineering_txt !== getTranslationByKey('engineering-r-txt')) {
        setAttrs({engineering_txt: getTranslationByKey('engineering-r-txt')});
	}}); getAttrs(['etiquette_high_society_txt'], v => {
      if (v.etiquette_high_society_txt !== getTranslationByKey('etiquette_high_society-r-txt')) {
        setAttrs({etiquette_high_society_txt: getTranslationByKey('etiquette_high_society-r-txt')});
	}}); getAttrs(['engineering_txt'], v => {
      if (v.engineering_txt !== getTranslationByKey('engineering-r-txt')) {
        setAttrs({engineering_txt: getTranslationByKey('engineering-r-txt')});
    }}); getAttrs(['fasttalk_txt'], v => {
      if (v.fasttalk_txt !== getTranslationByKey('fasttalk-r-txt')) {
        setAttrs({fasttalk_txt: getTranslationByKey('fasttalk-r-txt')});
    }}); getAttrs(['fighting_brawl_txt'], v => {
      if (v.fighting_brawl_txt !== getTranslationByKey('fighting_brawl-r-txt')) {
        setAttrs({fighting_brawl_txt: getTranslationByKey('fighting_brawl-r-txt')});
    }}); getAttrs(['firearms_hg_txt'], v => {
      if (v.firearms_hg_txt !== getTranslationByKey('firearms_hg-r-txt')) {
        setAttrs({firearms_hg_txt: getTranslationByKey('firearms_hg-r-txt')});
    }}); getAttrs(['firearms_rifle_txt'], v => {
      if (v.firearms_rifle_txt !== getTranslationByKey('firearms_rifle-r-txt')) {
        setAttrs({firearms_rifle_txt: getTranslationByKey('firearms_rifle-r-txt')});
    }}); getAttrs(['first_aid_txt'], v => {
      if (v.firstaid_txt !== getTranslationByKey('first_aid-r-txt')) {
        setAttrs({firstaid_txt: getTranslationByKey('first_aid-r-txt')});
	}}); getAttrs(['forbidden_lore_txt'], v => {
      if (v.forbidden_lore_txt !== getTranslationByKey('forbidden_lore-r-txt')) {
        setAttrs({forbidden_lore_txt: getTranslationByKey('forbidden_lore-r-txt')});
    }}); getAttrs(['forgery_txt'], v => {
      if (v.forgery_txt !== getTranslationByKey('forgery-r-txt')) {
        setAttrs({forgery_txt: getTranslationByKey('forgery-r-txt')});
    }}); getAttrs(['gunnery_txt'], v => {
      if (v.gunnery_txt !== getTranslationByKey('gunnery-r-txt')) {
        setAttrs({gunnery_txt: getTranslationByKey('gunnery-r-txt')});
    }}); getAttrs(['heavy_weapons_txt'], v => {
      if (v.heavy_weapons_txt !== getTranslationByKey('heavy_weapons-r-txt')) {
        setAttrs({heavy_weapons_txt: getTranslationByKey('heavy_weapons-r-txt')});
    }}); getAttrs(['history_txt'], v => {
      if (v.history_txt !== getTranslationByKey('history-r-txt')) {
        setAttrs({history_txt: getTranslationByKey('history-r-txt')});
	}}); getAttrs(['impersonation_txt'], v => {
      if (v.impersonation_txt !== getTranslationByKey('impersonation-r-txt')) {
        setAttrs({impersonation_txt: getTranslationByKey('impersonation-r-txt')});
	}}); getAttrs(['instrument_txt'], v => {
      if (v.instrument_txt !== getTranslationByKey('instrument-r-txt')) {
        setAttrs({instrument_txt: getTranslationByKey('instrument-r-txt')});
    }}); getAttrs(['intimidate_txt'], v => {
      if (v.intimidate_txt !== getTranslationByKey('intimidate-r-txt')) {
        setAttrs({intimidate_txt: getTranslationByKey('intimidate-r-txt')});
    }}); getAttrs(['interrogation_txt'], v => {
      if (v.interrogation_txt !== getTranslationByKey('interrogation-r-txt')) {
        setAttrs({interrogation_txt: getTranslationByKey('interrogation-r-txt')});		
    }}); getAttrs(['insight_txt'], v => {
      if (v.insight_txt !== getTranslationByKey('insight-r-txt')) {
        setAttrs({insight_txt: getTranslationByKey('insight-r-txt')});
    }}); getAttrs(['investigation_txt'], v => {
      if (v.investigation_txt !== getTranslationByKey('investigation-r-txt')) {
        setAttrs({investigation_txt: getTranslationByKey('investigation-r-txt')});
    }}); getAttrs(['jump_txt'], v => {
      if (v.jump_txt !== getTranslationByKey('jump-r-txt')) {
        setAttrs({jump_txt: getTranslationByKey('jump-r-txt')});
    }}); getAttrs(['language_own_txt'], v => {
      if (v.language_own_txt !== getTranslationByKey('language_own-r-txt')) {
        setAttrs({language_own_txt: getTranslationByKey('language_own-r-txt')});
    }}); getAttrs(['language_caltheran_txt'], v => {
      if (v.language_language_txt !== getTranslationByKey('language_caltheran-r-txt')) {
        setAttrs({language_caltheran_txt: getTranslationByKey('language_caltheran-r-txt')});
    }}); getAttrs(['language_other_txt'], v => {
      if (v.language_language_txt !== getTranslationByKey('language_other-r-txt')) {
        setAttrs({language_other_txt: getTranslationByKey('language_other-r-txt')});
    }}); getAttrs(['law_txt'], v => {
      if (v.law_txt !== getTranslationByKey('law-r-txt')) {
        setAttrs({law_txt: getTranslationByKey('law-r-txt')});
    }}); getAttrs(['libraryuse_txt'], v => {
      if (v.libraryuse_txt !== getTranslationByKey('libraryuse-r-txt')) {
        setAttrs({libraryuse_txt: getTranslationByKey('libraryuse-r-txt')});
    }}); getAttrs(['listen_txt'], v => {
      if (v.listen_txt !== getTranslationByKey('listen-r-txt')) {
        setAttrs({listen_txt: getTranslationByKey('listen-r-txt')});
    }}); getAttrs(['locksmith_txt'], v => {
      if (v.locksmith_txt !== getTranslationByKey('locksmith-r-txt')) {
        setAttrs({locksmith_txt: getTranslationByKey('locksmith-r-txt')});
    }}); getAttrs(['magic_alteration_txt'], v => {
      if (v.magic_alteration_txt !== getTranslationByKey('magic_alteration-r-txt')) {
        setAttrs({magic_alteration_txt: getTranslationByKey('magic_alteration-r-txt')});
    }}); getAttrs(['magic_elemental_txt'], v => {
      if (v.magic_elemental_txt !== getTranslationByKey('magic_elemental-r-txt')) {
        setAttrs({magic_elemental_txt: getTranslationByKey('magic_elemental-r-txt')});
    }}); getAttrs(['magic_enchantment_txt'], v => {
      if (v.magic_enchantment_txt !== getTranslationByKey('magic_enchantment-r-txt')) {
        setAttrs({magic_enchantment_txt: getTranslationByKey('magic_enchantment-r-txt')});
    }}); getAttrs(['magic_illusion_txt'], v => {
      if (v.magic_illusion_txt !== getTranslationByKey('magic_illusion-r-txt')) {
        setAttrs({magic_illusion_txt: getTranslationByKey('magic_illusion-r-txt')});
    }}); getAttrs(['magic_necromancy_txt'], v => {
      if (v.magic_necromancy_txt !== getTranslationByKey('magic_necromancy-r-txt')) {
        setAttrs({magic_necromancy_txt: getTranslationByKey('magic_necromancy-r-txt')});
    }}); getAttrs(['magic_restoration_txt'], v => {
      if (v.magic_restoration_txt !== getTranslationByKey('magic_restoration-r-txt')) {
        setAttrs({magic_restoration_txt: getTranslationByKey('magic_restoration-r-txt')});
    }}); getAttrs(['magic_summoning_txt'], v => {
      if (v.magic_summoning_txt !== getTranslationByKey('magic_summoning-r-txt')) {
        setAttrs({magic_summoning_txt: getTranslationByKey('magic_summoning-r-txt')});
    }}); getAttrs(['magic_technomancy_txt'], v => {
      if (v.magic_technomancy_txt !== getTranslationByKey('magic_technomancy-r-txt')) {
        setAttrs({magic_technomancy_txt: getTranslationByKey('magic_technomancy-r-txt')});
    }}); getAttrs(['magic_warding_txt'], v => {
      if (v.magic_warding_txt !== getTranslationByKey('magic_warding-r-txt')) {
        setAttrs({magic_warding_txt: getTranslationByKey('magic_warding-r-txt')});
    }}); getAttrs(['magic_universal_txt'], v => {
      if (v.magic_universal_txt !== getTranslationByKey('magic_universal-r-txt')) {
        setAttrs({magic_universal_txt: getTranslationByKey('magic_universal-r-txt')});
    }}); getAttrs(['mechrepair_txt'], v => {
      if (v.mechrepair_txt !== getTranslationByKey('mechrepair-r-txt')) {
        setAttrs({mechrepair_txt: getTranslationByKey('mechrepair-r-txt')});
    }}); getAttrs(['mechanics_txt'], v => {
      if (v.mechanics_txt !== getTranslationByKey('mechanics-r-txt')) {
        setAttrs({mechanics_txt: getTranslationByKey('mechanics-r-txt')});
    }}); getAttrs(['medicine_txt'], v => {
      if (v.medicine_txt !== getTranslationByKey('medicine-r-txt')) {
        setAttrs({medicine_txt: getTranslationByKey('medicine-r-txt')});
    }}); getAttrs(['melee_weapons_txt'], v => {
      if (v.melee_weapons_txt !== getTranslationByKey('melee_weapons-r-txt')) {
        setAttrs({melee_weapons_txt: getTranslationByKey('melee_weapons-r-txt')});
    }}); getAttrs(['naturalworld_txt'], v => {
      if (v.naturalworld_txt !== getTranslationByKey('naturalworld-r-txt')) {
        setAttrs({naturalworld_txt: getTranslationByKey('naturalworld-r-txt')});
    }}); getAttrs(['navigate_txt'], v => {
      if (v.navigate_txt !== getTranslationByKey('navigate-r-txt')) {
        setAttrs({navigate_txt: getTranslationByKey('navigate-r-txt')});
    }}); getAttrs(['occult_txt'], v => {
      if (v.occult_txt !== getTranslationByKey('occult-r-txt')) {
        setAttrs({occult_txt: getTranslationByKey('occult-r-txt')});
    }}); getAttrs(['ophvmachine_txt'], v => {
      if (v.ophvmachine_txt !== getTranslationByKey('ophvmachine-r-txt')) {
        setAttrs({ophvmachine_txt: getTranslationByKey('ophvmachine-r-txt')});
    }}); getAttrs(['perception_txt'], v => {
      if (v.perception_txt !== getTranslationByKey('perception-r-txt')) {
        setAttrs({perception_txt: getTranslationByKey('perception-r-txt')});
    }}); getAttrs(['persuade_txt'], v => {
      if (v.persuade_txt !== getTranslationByKey('persuade-r-txt')) {
        setAttrs({persuade_txt: getTranslationByKey('persuade-r-txt')});
    }}); getAttrs(['physics_txt'], v => {
      if (v.physics_txt !== getTranslationByKey('physics-r-txt')) {
        setAttrs({physics_txt: getTranslationByKey('physics-r-txt')});
    }}); getAttrs(['pilotaircraft_txt'], v => {
      if (v.pilotboat_txt !== getTranslationByKey('pilotaircraft-r-txt')) {
        setAttrs({pilotboat_txt: getTranslationByKey('pilotaircraft-r-txt')});
	}}); getAttrs(['pilotboat_txt'], v => {
      if (v.pilotboat_txt !== getTranslationByKey('pilotboat-r-txt')) {
        setAttrs({pilotboat_txt: getTranslationByKey('pilotboat-r-txt')});
    }}); getAttrs(['psychology_txt'], v => {
      if (v.psychology_txt !== getTranslationByKey('psychology-r-txt')) {
        setAttrs({psychology_txt: getTranslationByKey('psychology-r-txt')});
    }}); getAttrs(['psychoanalysis_txt'], v => {
      if (v.psychoanalysis_txt !== getTranslationByKey('psychoanalysis-r-txt')) {
        setAttrs({psychoanalysis_txt: getTranslationByKey('psychoanalysis-r-txt')});
    }}); getAttrs(['ride_txt'], v => {
      if (v.ride_txt !== getTranslationByKey('ride-r-txt')) {
        setAttrs({ride_txt: getTranslationByKey('ride-r-txt')});
    }}); getAttrs(['security_txt'], v => {
      if (v.security_txt !== getTranslationByKey('security-r-txt')) {
        setAttrs({security_txt: getTranslationByKey('security-r-txt')});
    }}); getAttrs(['singing_txt'], v => {
      if (v.singing_txt !== getTranslationByKey('singing-r-txt')) {
        setAttrs({singing_txt: getTranslationByKey('singing-r-txt')});
    }}); getAttrs(['sleightofhand_txt'], v => {
      if (v.sleightofhand_txt !== getTranslationByKey('sleightofhand-r-txt')) {
        setAttrs({sleightofhand_txt: getTranslationByKey('sleightofhand-r-txt')});
    }}); getAttrs(['slicing_txt'], v => {
      if (v.slicing_txt !== getTranslationByKey('slicing-r-txt')) {
        setAttrs({slicing_txt: getTranslationByKey('slicing-r-txt')});
    }}); getAttrs(['spirit_lore_txt'], v => {
      if (v.spirit_lore_txt !== getTranslationByKey('spirit_lore-r-txt')) {
        setAttrs({spirit_lore_txt: getTranslationByKey('spirit_lore-r-txt')});
    }}); getAttrs(['spothidden_txt'], v => {
      if (v.spothidden_txt !== getTranslationByKey('spothidden-r-txt')) {
        setAttrs({spothidden_txt: getTranslationByKey('spothidden-r-txt')});
    }}); getAttrs(['stealth_txt'], v => {
      if (v.stealth_txt !== getTranslationByKey('stealth-r-txt')) {
        setAttrs({stealth_txt: getTranslationByKey('stealth-r-txt')});
    }}); getAttrs(['streetwise_txt'], v => {
      if (v.streetwise_txt !== getTranslationByKey('streetwise-r-txt')) {
        setAttrs({streetwise_txt: getTranslationByKey('streetwise-r-txt')});
    }}); getAttrs(['survivaltxt'], v => {
      if (v.survivaltxt !== getTranslationByKey('survival-r-txt')) {
        setAttrs({survivaltxt: getTranslationByKey('survival-r-txt')});
    }}); getAttrs(['athletics_txt'], v => {
      if (v.athletics_txt !== getTranslationByKey('athletics-r-txt')) {
        setAttrs({athletics_txt: getTranslationByKey('athletics-r-txt')});
    }}); getAttrs(['coordination_txt'], v => {
      if (v.coordination_txt !== getTranslationByKey('coordination-r-txt')) {
        setAttrs({coordination_txt: getTranslationByKey('coordination-r-txt')});
    }}); getAttrs(['swim_txt'], v => {
      if (v.swim_txt !== getTranslationByKey('swim-r-txt')) {
        setAttrs({swim_txt: getTranslationByKey('swim-r-txt')});
    }}); getAttrs(['throw_txt'], v => {
      if (v.throw_txt !== getTranslationByKey('throw-r-txt')) {
        setAttrs({throw_txt: getTranslationByKey('throw-r-txt')});
    }}); getAttrs(['track_txt'], v => {
      if (v.track_txt !== getTranslationByKey('track-r-txt')) {
        setAttrs({track_txt: getTranslationByKey('track-r-txt')});
    }}); getAttrs(['unarmed_txt'], v => {
      if (v.unarmed_txt !== getTranslationByKey('unarmed-z')) {
        setAttrs({unarmed_txt: getTranslationByKey('unarmed-z')});
    }}); getAttrs(['veil_lore_txt'], v => {
      if (v.veil_lore_txt !== getTranslationByKey('veil_lore-r-txt')) {
        setAttrs({veil_lore_txt: getTranslationByKey('veil_lore-r-txt')});
    }});

  });