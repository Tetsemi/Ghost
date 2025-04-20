// ===== Roll20 Reusable Skill Modifier Module ===== //
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
 "Warding": { label: "magic_warding", base: "0", skill: "magic_warding_skill_mdr", bonus: "magic_warding_mdr", group: "Magic", notes: "Protective magic used to shield, block, or dispel incoming threatsboth physical and magical." },
 "Universal": { label: "magic_universal", base: "0", skill: "magic_universal_skill_mdr", bonus: "magic_universal_mdr", group: "Magic", notes: "Covers basic arcane techniques used across traditionsdetecting, sensing, or disrupting magical phenomena." },
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
 "Forgery": { label: "forgery", base: "1", skill: "forgery_skill_mdr", bonus: "forgery_mdr", group: "Social", notes: "Creating falsified documents, IDs, credentialsphysical or digital." },
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


const tabList = ["skills", "background", "talents", "combat", "spells", "inventory", "backstory", "npcs", "vehicles"];

  tabList.forEach(tab => {
    on(`clicked:${tab}`, () => {
      setAttrs({ selected_tab: tab });
    });
});

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

// -- Core Calculation --
function calcSkillWithBonuses(skill, bonus = 0, talentBonus = 0, hasBonus = false, hasTalent = false) {
  return (parseInt(skill) || 0) +
         (hasBonus ? (parseInt(bonus) || 0) : 0) +
         (hasTalent ? (parseInt(talentBonus) || 0) : 0);
}

// -- Object Builder --
function buildSkillObject(skills) {
  const obj = {};
  skills.forEach(skill => {
    const skillVal = parseInt(skill.skill) || 0;
    const bonusVal = parseInt(skill.bonus) || 0;
    const talentVal = parseInt(skill.talentBonus) || 0;
    obj[`${skill.name}_mdr`] = calcSkillWithBonuses(
      skillVal,
      bonusVal,
      talentVal,
      skill.hasBonus,
      skill.hasTalent
    );
  });
  return obj;
}

function setDefaultSkillBonuses(racePrefix, skills) {
  const updates = {};
  skills.forEach(skill => {
    updates[`${racePrefix}_${skill}_bonus_mdr`] = "5";
  });
  return updates;
}

function setDefaultTalentBonuses(racePrefix, talents) {
  const updates = {};
  talents.forEach(skill => {
    updates[`${racePrefix}_talent_${skill}_bonus_mdr`] = "10";
  });
  return updates;
}

function registerSkillHandler({
  triggerSkills = [],
  racePrefix = "",
  talentSources = [],
  backgroundDropdown = false,
  talentDropdown = false
}) {
  const watchFields = triggerSkills.flatMap(skill => [
    `add:${skill}_skill_mdr`,
    `change:${skill}_skill_mdr`
  ])
  .concat([
    `change:${racePrefix}_mdr_checkbox`,
    `change:${racePrefix}_talent_mdr_checkbox`,
    `change:showracials`,
    `change:race_default_trigger`,
    `sheet:opened`
  ])
  .concat(
    talentSources.map(talent => `change:${racePrefix}_${talent}_mdr_checkbox`)
  );

  if (backgroundDropdown) {
    watchFields.push(
      `change:${racePrefix}_background_choice`,
      `change:${racePrefix}_background_bonus_mdr`,
      `change:${racePrefix}_mdr_checkbox`
    );
  }

  if (talentDropdown) {
    watchFields.push(
      `change:${racePrefix}_talent_choice`,
      `change:${racePrefix}_talent_bonus_mdr`,
      `change:${racePrefix}_talent_mdr_checkbox`
    );
  }

  const getKeys = triggerSkills.flatMap(skill => {
    const keys = [
      `${racePrefix}_skill_debug`,
      `${skill}_skill_mdr`,
      `${racePrefix}_${skill}_bonus_mdr`,
      `${racePrefix}_talent_${skill}_bonus_mdr`
    ];
    talentSources.forEach(talent => {
      keys.push(`${racePrefix}_${talent}_mdr_checkbox`);
    });
    return keys;
  }).concat([
    `${racePrefix}_mdr_checkbox`,
    `${racePrefix}_talent_mdr_checkbox`,
    `showracials`
  ]);

  if (backgroundDropdown) {
    getKeys.push(`${racePrefix}_background_choice`, `${racePrefix}_background_bonus_mdr`);
  }

  if (talentDropdown) {
    getKeys.push(`${racePrefix}_talent_choice`, `${racePrefix}_talent_bonus_mdr`);
  }

  const debugField = `${racePrefix}_skill_debug`;

  on(watchFields.join(" "), () => {
    getAttrs([...new Set(getKeys.concat(debugField))], values => {
      const activeRaceValue = values["showracials"];
      const activeRace = raceValueMap[activeRaceValue];
      const isActiveRace = activeRace === racePrefix;

      const selectedBackground = values[`${racePrefix}_background_choice`];
      const backgroundBonusVal = parseInt(values[`${racePrefix}_background_bonus_mdr`]) || 0;
      const backgroundActive = values[`${racePrefix}_mdr_checkbox`] === "true";

      const selectedTalent = values[`${racePrefix}_talent_choice`];
      const talentBonusVal = parseInt(values[`${racePrefix}_talent_bonus_mdr`]) || 0;
      const talentDropdownActive = values[`${racePrefix}_talent_mdr_checkbox`] === "true";

      let debugLines = [];

      const skills = triggerSkills.map(skill => {
        const base = parseInt(values[`${skill}_skill_mdr`]) || 0;

        const backgroundBonus = isActiveRace && (
          backgroundDropdown
            ? selectedBackground === skill && backgroundActive
            : values[`${racePrefix}_mdr_checkbox`] === skill
        )
          ? (backgroundDropdown ? backgroundBonusVal : parseInt(values[`${racePrefix}_${skill}_bonus_mdr`]) || 0)
          : 0;

        let talentStaticBonus = 0;
        let talentDropdownBonus = 0;

        // Static talent bonuses
        if (isActiveRace) {
          talentSources.forEach(source => {
            const checkboxValue = values[`${racePrefix}_${source}_mdr_checkbox`] || "";
            if (checkboxValue === `talent_${skill}`) {
              talentStaticBonus += parseInt(values[`${racePrefix}_talent_${skill}_bonus_mdr`]) || 0;
            }
          });

          // Dropdown talent bonus
          if (talentDropdown && talentDropdownActive && selectedTalent === skill) {
            talentDropdownBonus = talentBonusVal;
          }
        }

        const totalTalent = talentStaticBonus + talentDropdownBonus;
        const total = base + backgroundBonus + totalTalent;

        debugLines.push(`Talent bonus for ${skill}: static=${talentStaticBonus}, dropdown=${talentDropdownBonus}, total=${totalTalent}`);
        debugLines.push(`${skill}: base=${base}, bg=${backgroundBonus}, talent=${totalTalent}, total=${total}`);

        return { [`${skill}_mdr`]: total };
      });

      const updates = Object.assign({}, ...skills);
      updates[debugField] = debugLines.reverse().slice(-10).join("\n");

      setAttrs(updates);
    });
  });
}


on("sheet:opened", function () {
  const initKey = "racial_bonuses_initialized";

  getAttrs([initKey, "showracials"], values => {
    if (values[initKey] === "1") return;

    const updates = { [initKey]: "1" };
    const allSkills = new Set();

    // Loop through all races in backgroundSkillMap
    Object.keys(backgroundSkillMap).forEach(race => {
      const raceBackgrounds = backgroundSkillMap[race];
      const backgroundSkills = Object.values(raceBackgrounds).flatMap(skills => Object.keys(skills));
      Object.assign(updates, setDefaultSkillBonuses(race, backgroundSkills));
      updates[`${race}_background_bonus_mdr`] = "5";
      updates[`${race}_background_description`] = "";
      backgroundSkills.forEach(skill => allSkills.add(skill));
    });

    // Loop through all races in talentSkillMap
    Object.keys(talentSkillMap).forEach(race => {
      const raceTalents = talentSkillMap[race];
      const talentSkills = Object.values(raceTalents).flatMap(skills => Object.keys(skills));
      Object.assign(updates, setDefaultTalentBonuses(race, talentSkills));
      updates[`${race}_talent_bonus_mdr`] = "10";
      updates[`${race}_talent_description`] = "";
      talentSkills.forEach(skill => allSkills.add(skill));
    });

    // Initialize skill values from skillMapTable
    Object.entries(skillMapTable).forEach(([key, { label, base, notes }]) => {
      const defaultVal = parseInt(base, 10) || 0;
      updates[`${label}_skill_mdr`] = defaultVal;
      updates[`${label}_mdr`] = defaultVal;
      updates[`${label}_note`] = notes || "";
    });

    setAttrs(updates);
  });
});

function registerBackgroundChoiceHandler(race) {
  on(`change:${race}_background_choice`, () => {
    getAttrs([`${race}_background_choice`, `${race}_mdr_checkbox`], values => {
      const choice = values[`${race}_background_choice`];
      const isChecked = values[`${race}_mdr_checkbox`] === "true";
      const bonus = isChecked ? 5 : 0;

      // New logic: pull skill display name from backgroundSkillMap
      const skillEntry = backgroundSkillMap[race]?.[choice] || {};
      const skillName = Object.values(skillEntry)[0]; // Show first skill name only
      const description = isChecked && skillName ? `Gain +${bonus}% ${skillName} Skill` : "";

      setAttrs({
        [`${race}_background_description`]: description,
        [`${race}_background_bonus_mdr`]: bonus.toString()
      });
    });
  });
}


function registerBackgroundChoiceHandler(race) {
  on(`change:${race}_background_choice`, () => {
    getAttrs([`${race}_background_choice`, `${race}_mdr_checkbox`], values => {
      const choice = values[`${race}_background_choice`];
      const isChecked = values[`${race}_mdr_checkbox`] === "true";
      const bonus = isChecked ? 5 : 0;

      const skillName = backgroundSkillMap[race]?.[choice] || "";
      const description = isChecked && skillName ? `Gain +${bonus}% ${skillName} Skill` : "";

      setAttrs({
        [`${race}_background_description`]: description,
        [`${race}_background_bonus_mdr`]: bonus.toString()
      });
    });
  });
}

// Register background handlers for all supported races
Object.keys(backgroundSkillMap).forEach(registerBackgroundChoiceHandler);

function registerTalentHandlers(race) {
  const talents = talentSkillMap[race] || {};
  const dropdownCheckbox = `${race}_talent_mdr_checkbox`;
  const dropdownChoice = `${race}_talent_choice`;
  const debugField = `${race}_talent_debug`;

  // -- Dropdown talents --
  Object.entries(talents).forEach(([talent, skills]) => {
    on(`change:${dropdownCheckbox} change:${dropdownChoice}`, () => {
      getAttrs([dropdownCheckbox, dropdownChoice, debugField], values => {
        const isChecked = values[dropdownCheckbox] === "true";
        const selectedSkill = values[dropdownChoice] || "";
        const skillName = skills[selectedSkill] || "";
        const bonus = isChecked && skillName ? 10 : 0;
        const description = isChecked && skillName ? `Gain +${bonus}% ${skillName} Skill` : "";
        const debugMsg = `Dropdown -> Checkbox: ${values[dropdownCheckbox]}, Skill: ${selectedSkill}, Bonus: ${bonus}`;

        let debugLines = (values[debugField] || "").split("\n");
        debugLines.unshift(debugMsg);
        debugLines = debugLines.slice(0, 5); // Keep only last 5

        const updates = {
          [`${race}_talent_bonus_mdr`]: bonus.toString(),
          [`${race}_talent_description`]: description,
          [debugField]: debugLines.join("\n")
        };

        if (!isChecked) updates[dropdownChoice] = "";

        setAttrs(updates);
      });
    });
  });

  // -- Static talent checkboxes: one for each talent source
  const talentSources = Object.keys(talents);
  talentSources.forEach(source => {
    const staticCheckbox = `${race}_${source}_mdr_checkbox`;
    on(`change:${staticCheckbox}`, () => {
      getAttrs([staticCheckbox, debugField], values => {
        const val = values[staticCheckbox]; // e.g., "talent_slicing"
        let updates = {};
        let debug = `Static -> Checkbox: ${val}`;

        if (val && val.startsWith("talent_")) {
          const skill = val.replace("talent_", "");
          const bonusField = `${race}_talent_${skill}_bonus_mdr`;
          updates[bonusField] = "10";
          debug += `, Bonus: ${bonusField}, Value: 10`;
        } else {
          debug += `, Value: unchanged`;
        }

        let debugLines = (values[debugField] || "").split("\n");
        debugLines.unshift(debug);
        debugLines = debugLines.slice(0, 5);
        updates[debugField] = debugLines.join("\n");

        setAttrs(updates);
      });
    });
  });
}

// Register all races using the talentSkillMap
Object.keys(talentSkillMap).forEach(registerTalentHandlers);

// ===== Unified Alteri Handler =====
registerSkillHandler({
  triggerSkills: ["deception", "persuade", "slicing", "streetwise", "impersonation", "history", "insight", "stealth", "arcana", "disguise"],
  racePrefix: "alteri",
  talentSources: ["maskwrights_grace", "shaped_for_subtlety"],
  backgroundDropdown: false,
  talentDropdown: false
});

// ===== Unified Draevi Handler =====
registerSkillHandler({
  triggerSkills: ["electronics", "mechanics", "navigate", "survival", "slicing", "spirit_lore", "occult", "veil_lore", "streetwise", "athletics", "intimidate", "track"],
  racePrefix: "draevi",
  talentSources: ["scavengers_edge", "clan_blooded"],
  backgroundDropdown: false,
  talentDropdown: false
});

// ===== Unified Human Handler =====
registerSkillHandler({
  triggerSkills: ["first_aid", "insight", "alchemy", "anthropology", "archaeology", "architecture", "biology", "chemistry", "engineering", "medicine", "physics", "slicing", "etiquette_high_society", "persuade", "stealth", "streetwise", "firearms_rifle", "survival", "electronics", "mechanics"],
  racePrefix: "human",
  talentSources: ["quick_fixer", "shaped_for_subtlety"],
  backgroundDropdown: true,
  talentDropdown: false
});

// ===== Unified Lyranni Handler =====
registerSkillHandler({
  triggerSkills: ["magic_technomancy", "slicing", "electronics", "mechanics", "dance", "impersonation", "insight", "instrument", "singing", "streetwise", "stealth", "arcana", "etiquette_lyranni", "occult", "perception", "persuade"],
  racePrefix: "lyranni",
  talentSources: ["aether_override", "echo_in_the_veins"],
  backgroundDropdown: false,
  talentDropdown: true
});

on("change:showracials sheet:opened", () => {
  getAttrs(["showracials", "language_own_txt", "language_caltheran_txt"], values => {
    const raceId = values.showracials;
    const race = raceValueMap[raceId] || "human"; // fallback default

    const racialLang = raceLanguageMap[race] || "Racial";
    const otherLang = race === "human" ? "Other" : "Caltheran";

    const updates = {};
    if (!values.language_own_txt) updates.language_own_txt = `${racialLang}(75%)`;
    if (!values.language_caltheran_txt) updates.language_caltheran_txt = `${otherLang}(EDU)`;

    // Always update if race changes
    updates.language_own_txt = `${racialLang}(75%)`;
    updates.language_caltheran_txt = `${otherLang}(EDU)`;

    setAttrs(updates);
  });
});