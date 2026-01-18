const raceBackgroundDataMap = {
  alteri: {
    soft_year_drifter: {
      trained_skills: ["coordination", "deception", "disguise", "perform_impersonation", "insight", "stealth", "streetwise"],
      starting_item: "mask_journal-u",
      starting_talents: ["second_skin", "reflexive_shift", "grace_of_the_many"]
    },
	veilhaven_attendant: {
	  trained_skills: ["arcana", "insight", "disguise", "history", "etiquette_alteri", "perform_impersonation", "occult_lore"],
	  starting_item: "kin_token-u",
	  starting_talents: ["maskwrights_grace", "whisper_touched", "social_chameleon"]
	},
	ghostline_runner: {
	  trained_skills: ["slicing", "streetwise", "stealth", "electronics", "deception", "insight", "perform_impersonation"],
	  starting_item: "burner_id_package-u",
	  starting_talents: ["ghost_protocol", "shaped_for_subtlety", "echoed_voice"]
	},
    legacy_bearer: {
      trained_skills: ["perform_impersonation", "history", "insight", "arcana", "etiquette_alteri", "disguise", "occult_lore"],
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
      trained_skills: ["veil_lore", "occult_lore", "survival_wilderness", "first_aid", "insight", "track", "arcana"],
      starting_item: "clan_ritual_token-u",
      starting_talents: ["spirits_in_stone", "clan_blooded", "iron_stomach"]
    },
    spiritbound_techshaper: {
      trained_skills: ["slicing", "spirit_lore", "electronics", "arcana", "insight", "mechanics", "streetwise"],
      starting_item: "ram_shell_unfinished-u",
      starting_talents: ["spirits_in_stone", "scavengers_edge", "clan_blooded"]
    },
    tradition_keeper: {
      trained_skills: ["survival_wilderness", "navigate", "perception", "athletics", "occult_lore", "track", "first_aid"],
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
      trained_skills: ["slicing", "science", "electronics", "insight", "occult_lore", "bureaucracy", "perform_vocal"],
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
	  trained_skills: ["veil_lore", "arcana", "insight", "history", "survival_wilderness", "occult_lore_lore", "magic_warding"],
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
	  trained_skills: ["electronics", "magic_illusion", "anthropology", "archaeology", "biology", "chemistry", "engineering", "physics", "spirit_lore", "insight", "slicing", "arcana"],
	  starting_item: "encrypted_dataplate-u",
	  starting_talents: ["aether_flick", "veil_sniff", "mask_of_the_moment"]
	}
  },
  lyranni: {
	whisper_walker: {
		trained_skills: ["perception", "occult_lore", "spirit_lore", "insight", "survival_wilderness", "stealth", "magic_warding"],
		starting_item: "veilmark_living-sigil-u",
		starting_talents: ["threadwalker", "veilsight", "veil_blooded_sense"]
	},
	zurethkai_flameborn: {
		trained_skills: ["slicing", "magic_technomancy", "electronics", "arcana", "deception", "magic_illusion", "insight"],
		starting_item: "symbolic_magitech_mod-u",
		starting_talents: ["aether_override", "veil_blooded_sense", "echo_in_the_veins"]
	},
	aelvareth_devotee: {
		trained_skills: ["occult_lore", "etiquette_lyranni", "arcana", "perform_vocal", "magic_warding", "bureaucracy", "veil_lore"],
		starting_item: "aelvareth_veilmark-u",
		starting_talents: ["threadwalker", "legacy_spark", "veilsight"]
	},
    echoborne: {
      trained_skills: ["arcana", "etiquette_lyranni", "occult_lore", "history", "insight", "perform_vocal", "bureaucracy"],
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
	  trained_skills: ["slicing", "electronics", "computer_use", "insight", "perception", "occult_lore", "arcanotech"],
	  starting_item: "neural_interface_plug-u",
	  starting_talents: ["signal_ghost", "circuit_whisperer", "mask_the_signal"]
	},
	corpsepath_reclaimer: {
      trained_skills: ["magic_necromancy", "cybernetics", "medicine", "mechanics", "first_aid", "occult_lore", "veil_lore" ],
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
