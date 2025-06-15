const backgroundDataMap = {
  alteri: {
    soft_year_drifter: {
      trained_skills: ["coordination", "deception", "disguise", "impersonation", "insight", "stealth", "streetwise"],
      starting_item: "mask_journal-u",
      starting_talents: ["second_skin", "reflexive_shift", "grace_of_the_many"]
    },
	veilhaven_attendant: {
	  trained_skills: ["arcana", "insight", "disguise", "history", "etiquette_alteri", "impersonation", "occult"],
	  starting_item: "kin_token-u",
	  starting_talents: ["maskwrights_grace", "whisper_touched", "social_chameleon"]
	},
	ghostline_runner: {
	  trained_skills: ["slicing", "streetwise", "stealth", "electronics", "deception", "insight", "impersonation"],
	  starting_item: "burner_id_package-u",
	  starting_talents: ["ghost_protocol", "shaped_for_subtlety", "echoed_voice"]
	},
    legacy_bearer: {
      trained_skills: ["impersonation", "history", "insight", "arcana", "etiquette_alteri", "disguise", "occult"],
      starting_item: "legacy_ritual_item-u",
      starting_talents: ["echoed_voice", "maskwrights_grace", "second_skin"]
    },
    break_faced_radical: {
      trained_skills: ["persuade", "deception", "impersonation", "insight", "streetwise", "disguise", "charm"],
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
  human: {
    scavsteel_whelp: {
      trained_skills: ["mechanics", "electronics", "streetwise", "insight", "slicing", "survival_urban", "perception"],
      starting_item: [ "trusted_toolset-u", "modded_wearable-u"],
      starting_talents: ["quick_fixer", "hard_lesson", "skilled_focus"]
    },
    enclave_born: {
      trained_skills: ["etiquette_high_society", "persuade", "insight", "voice", "charm", "bureaucracy", "history"],
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
      trained_skills: ["slicing", "science", "electronics", "insight", "occult", "bureaucracy", "recitation"],
      starting_item: ["memory_shard-u", "ai_record-u"],
      starting_talents: ["instinct_over_training", "quick_fixer", "skilled_focus"]
    },
    ash_war_refugee: {
      trained_skills: ["first_aid", "insight", "athletics", "dodge", "survival_urban", "perception", "stealth"],
      starting_item: "faded_token_of_past-u",
      starting_talents: ["makeshift_medic", "no_stranger_to_pain", "hard_lesson"]
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
		trained_skills: ["occult", "etiquette_lyranni", "arcana", "chant", "magic_warding", "bureaucracy", "veil_lore"],
		starting_item: "aelvareth_veilmark-u",
		starting_talents: ["threadwalker", "legacy_spark", "veilsight"]
	},
    echoborne: {
      trained_skills: ["arcana", "etiquette_lyranni", "occult", "history", "insight", "voice", "bureaucracy"],
      starting_item: "ancestral_veilmark-u",
      starting_talents: ["legacy_spark", "veilsight", "threadwalker"]
    },
	glide_spire_scion: {
		trained_skills: ["persuade", "streetwise", "charm", "insight", "etiquette_high_society", "dance", "deception"],
		starting_item: "veil_threaded_accessory-u",
		starting_talents: ["social_ghost", "echo_in_the_veins", "legacy_spark"]
	}
  }
};
