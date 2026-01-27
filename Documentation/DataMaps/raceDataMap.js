const raceDataMap = {
  alteri: {
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
		  affected_skill:  [ "arcana", "spirit_lore", "veil_lore" ],
		  usage_limit:     "session"
		},
		empathic_instinct: {
		  name_key:        "racial_alteri_empathic_instinct-u",
		  rule_text_key:   "racial_alteri_empathic_instinct_rules-u",
		  affected_skill:  "insight",
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
  draevi: {
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
		  affected_skill: [ "athletics", "coordination" ],
		  usage_limit:     "scene"
        },
        keen_environmental_awareness: {
          name_key:      "racial_draevi_keen_environmental_awareness-u",
          rule_text_key: "racial_draevi_keen_environmental_awareness_rules-u",
		  affected_skill: [ "insight", "perception" ]
        },
        low_light_vision: {
          name_key:      "racial_draevi_low_light_vision-u",
          rule_text_key: "racial_draevi_low_light_vision_rules-u"
        },
        primal_resilience: {
          name_key:      "racial_draevi_primal_resilience-u",
          rule_text_key: "racial_draevi_primal_resilience_rules-u",
		  affected_stat: "con"
        },
        tattooed_memory: {
          name_key:      "racial_draevi_tattooed_memory-u",
          rule_text_key: "racial_draevi_tattooed_memory_rules-u"
        }
      }
    }
  },
  feran: {
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
          rule_text_key: "racial_feran_natural_weapons_rules-u",
		  affected_skill: "unarmed"
        },
        night_honed_vision: {
          name_key:      "racial_feran_night_honed_vision-u",
          rule_text_key: "racial_feran_night_honed_vision_rules-u"
        },
        pack_instinct: {
          name_key:      "racial_feran_pack_instinct-u",
          rule_text_key: "racial_feran_pack_instinct_rules-u",
		  affected_skill: "dodge",
		  usage_limit:     "scene"
        },
        predator_reflexes: {
          name_key:      "racial_feran_predator_reflexes-u",
          rule_text_key: "racial_feran_predator_reflexes_rules-u",
		  affected_skill: [ "coordination", "dodge" ],
		  usage_limit:     "session"
        },
        wallrunners_grace: {
          name_key:      "racial_feran_wallrunners_grace-u",
          rule_text_key: "racial_feran_wallrunners_grace_rules-u",
		  affected_skill: "athletics"
        }
      }
    }
  },
  human: {
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
		  affected_stat: [ "con", "pow" ],
		  usage_limit:     "session"
        },
        unshaped_by_the_veil: {
          name_key:      "racial_human_unshaped_by_the_veil-u",
          rule_text_key: "racial_human_unshaped_by_the_veil_rules-u",
		  affected_stat: "con",
		  usage_limit:     "session"
        },
        versatile_origin: {
          name_key:      "racial_human_versatile_origin-u",
          rule_text_key: "racial_human_versatile_origin_rules-u"
        }
      }
    }
  },
  khadra: {
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
		  /* Physical Damage Reduction is handled in the Comabt Section with a +1 Physical Armor point */
        },
        oathweight_presence: {
          name_key:      "racial_khadra_oathweight_presence-u",
          rule_text_key: "racial_khadra_oathweight_presence_rules-u",
		  affected_skill: [ "intimidate", "persuade" ],
		  usage_limit:     "scene"
        },
        stonebound_endurance: {
          name_key:      "racial_khadra_stonebound_endurance-u",
          rule_text_key: "racial_khadra_stonebound_endurance_rules-u",
		  affected_stat: "con",
		  usage_limit:     "session"
        },
        unshaken_resolve: {
          name_key:      "racial_khadra_unshaken_resolve-u",
          rule_text_key: "racial_khadra_unshaken_resolve_rules-u",
		  affected_stat: "pow",
		  usage_limit:     "session"
        },
        weight_of_stone: {
          name_key:      "racial_khadra_weight_of_stone-u",
          rule_text_key: "racial_khadra_weight_of_stone_rules-u",
		  affected_stat: "con"
        }
      }
    }
  },
  kitsu: {
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
		  affected_skill: "perception",
		  usage_limit:     "session"
        },
        fox_eared_reflexes: {
          name_key:      "racial_kitsu_fox_eared_reflexes-u",
          rule_text_key: "racial_kitsu_fox_eared_reflexes_rules-u",
		  affected_skill: [ "coordination", "dodge" ],
		  usage_limit:     "session"
        },
        mask_of_the_foxfire: {
          name_key:      "racial_kitsu_mask_of_the_foxfire-u",
          rule_text_key: "racial_kitsu_mask_of_the_foxfire_rules-u",
		  affected_skill: [ "charm", "deception", "stealth" ],
		  usage_limit:     "session"
        },
        strain_the_moment: {
          name_key:      "racial_kitsu_strain_the_moment-u",
          rule_text_key: "racial_kitsu_strain_the_moment_rules-u",
		  affected_skill: "dodge",
		  usage_limit:     "session"
        }
      }
    }
  },
  lyranni: {
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
		  affected_skill: [ "arcana", "spirit_lore" ],
		  usage_limit:     "session"
        },
        cultural_elegance: {
          name_key:      "racial_lyranni_cultural_elegance-u",
          rule_text_key: "racial_lyranni_cultural_elegance_rules-u",
		  affected_skill: "charm",
		  affected_skill_group: [ "etiquette", "perform" ],
		  usage_limit:     "session"
        },
        low_light_vision: {
          name_key:      "racial_lyranni_low_light_vision-u",
          rule_text_key: "racial_lyranni_low_light_vision_rules-u"
        },
        unseen_grace: {
          name_key:      "racial_lyranni_unseen_grace-u",
          rule_text_key: "racial_lyranni_unseen_grace_rules-u",
		  affected_skill: [ "coordination", "stealth" ],
		  usage_limit:     "session"
        },
        veil_sensitivity: {
          name_key:      "racial_lyranni_veil_sensitivity-u",
          rule_text_key: "racial_lyranni_veil_sensitivity_rules-u",
		  affected_skill: [ "arcana", "occult_lore", "spirit_lore" ],
		  usage_limit:     "session"
        }
      }
    }
  },
  veyra: {
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
		  affected_skill: "stealth",
		  usage_limit:     "scene"
        },
        sensitive_to_light: {
          name_key:      "racial_veyra_sensitive_to_light-u",
          rule_text_key: "racial_veyra_sensitive_to_light_rules-u",
		  affected_skill: [ "perception" ],
		  affected_skill_group: "combat_ranged",
        },
        tech_instinct: {
          name_key:      "racial_veyra_tech_instinct-u",
          rule_text_key: "racial_veyra_tech_instinct_rules-u",
		  affected_skill: [ "electronics", "mechanics" ],
		  affected_stat: "int"
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
