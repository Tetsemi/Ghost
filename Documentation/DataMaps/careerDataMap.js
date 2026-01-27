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
			computer_use: "computer_use-u",
            electronics: "electronics-u",
            magic_technomancy: "magic_technomancy-u",
            slicing: "slicing-u"
        },
        secondary_skills: {
            arcana: "arcana-u",
            arcanotech: "arcanotech-u",
            drone_operation: "drone_operation-u",
            perception: "perception-u",
			security: "security-u",
            spirit_lore: "spirit_lore-u"
        },
        talents: {
            hardlight_override: {
				name_key: "career_codeweaver_hardlight_override-u",
				rule_text_key: "career_codeweaver_hardlight_override_rules-u",
				affected_skill: [ "magic_technomancy", "slicing" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            recursive_pulse: {
				name_key: "career_codeweaver_recursive_pulse-u",
				rule_text_key: "career_codeweaver_recursive_pulse_rules-u",
				affected_skill: [ "magic_technomancy", "slicing" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            signal_sync: {
				name_key: "career_codeweaver_signal_sync-u",
				rule_text_key: "career_codeweaver_signal_sync_rules-u",
				affected_skill: [ "magic_technomancy", "slicing" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            strain_buffer: {
				name_key: "career_codeweaver_strain_buffer-u",
				rule_text_key: "career_codeweaver_strain_buffer_rules-u",
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: ""
            },
			veil_thread_tap: {
				name_key: "career_codeweaver_veil_thread_tap-u",
				rule_text_key: "career_codeweaver_veil_thread_tap_rules-u",
				affected_skill: [ "perception", "slicing" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            arc_sigil_link: {
				name_key: "career_codeweaver_arc_sigil_link-u",
				rule_text_key: "career_codeweaver_arc_sigil_link_rules-u",
				affected_skill: [ "computer_use", "electronics", "magic_technomancy" ],
                prerequisite: "veil_thread_tap",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: ""
            },
            clean_loop_feedback: {
				name_key: "career_codeweaver_clean_loop_feedback-u",
				rule_text_key: "career_codeweaver_clean_loop_feedback_rules-u",
				affected_skill: "magic_technomancy",
                prerequisite: "",
                prerequisiteAny: { tier: 1, count: 1 },
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            code_injection: {
				name_key: "career_codeweaver_code_injection-u",
				rule_text_key: "career_codeweaver_code_injection_rules-u",
				affected_skill: [ "magic_technomancy", "slicing" ],
                prerequisite: "signal_sync",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            pulse_hijack: {
				name_key: "career_codeweaver_pulse_hijack-u",
				rule_text_key: "career_codeweaver_pulse_hijack_rules-u",
				affected_skill: [ "magic_technomancy", "slicing" ],
                prerequisite: "hardlight_override",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            scramble_protocol: {
				name_key: "career_codeweaver_scramble_protocol-u",
				rule_text_key: "career_codeweaver_scramble_protocol_rules-u",
                prerequisite: "recursive_pulse",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: ""
            },
            arc_thread_override: {
				name_key: "career_codeweaver_arc_thread_override-u",
				rule_text_key: "career_codeweaver_arc_thread_override_rules-u",
				affected_skill: "magic_technomancy",
                prerequisite: "code_injection",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: "scene"
            },
            cascade_override: {
				name_key: "career_codeweaver_cascade_override-u",
				rule_text_key: "career_codeweaver_cascade_override_rules-u",
                prerequisite: "pulse_hijack",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: "session"
            },
            null_interference_field: {
				name_key: "career_codeweaver_null_interference_field-u",
				rule_text_key: "career_codeweaver_null_interference_field_rules-u",
                prerequisite: "scramble_protocol",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: ""
            },
            subroutine_leash: {
				name_key: "career_codeweaver_subroutine_leash-u",
				rule_text_key: "career_codeweaver_subroutine_leash_rules-u",
                prerequisite: "arc_sigil_link",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: ""
            },
            synthetic_harmony: {
				name_key: "career_codeweaver_synthetic_harmony-u",
				rule_text_key: "career_codeweaver_synthetic_harmony_rules-u",
				affected_skill: "magic_technomancy",
                prerequisite: "",
                prerequisiteAny: { tier: 2, count: 1 },
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: "scene"
            },
            backdoor_ritual: {
				name_key: "career_codeweaver_backdoor_ritual-u",
				rule_text_key: "career_codeweaver_backdoor_ritual_rules-u",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "scene"
            },
            command_injection: {
				name_key: "career_codeweaver_command_injection-u",
				rule_text_key: "career_codeweaver_command_injection_rules-u",
				affected_skill: "magic_technomancy",
                prerequisite: "subroutine_leash",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "scene"
            },
            crash_field: {
				name_key: "career_codeweaver_crash_field-u",
				rule_text_key: "career_codeweaver_crash_field_rules-u",
                prerequisite: "null_interference_field",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "session"
            },
            live_patch_redirect: {
				name_key: "career_codeweaver_live_patch_redirect-u",
				rule_text_key: "career_codeweaver_live_patch_redirect_rules-u",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "session"
            },
            veil_reactor_stabilizer: {
				name_key: "career_codeweaver_veil_reactor_stabilizer-u",
				rule_text_key: "career_codeweaver_veil_reactor_stabilizer_rules-u",
                prerequisite: "",
				prerequisiteAny: { tier: 3, count: 1 },
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "session"
            },
            overcode_detonation: {
				name_key: "career_codeweaver_overcode_detonation-u",
				rule_text_key: "career_codeweaver_overcode_detonation_rules-u",
                prerequisite: "crash_field",
                tier: 5,
                cost: 30,
                capstone: true,
                usage_limit: "session"
            },
            protocol_ascendance: {
				name_key: "career_codeweaver_protocol_ascendance-u",
				rule_text_key: "career_codeweaver_protocol_ascendance_rules-u",
                prerequisite: "backdoor_ritual",
                tier: 5,
                cost: 30,
                capstone: true,
                usage_limit: "session"
            },
            reality_patch: {
				name_key: "career_codeweaver_reality_patch-u",
				rule_text_key: "career_codeweaver_reality_patch_rules-u",
				affected_skill: "magic_technomancy",
                prerequisite: ["live_patch_redirect", "veil_reactor_stabilizer"],
                tier: 5,
                cost: 30,
                capstone: true,
                usage_limit: "session"
            },
            signal_possession: {
				name_key: "career_codeweaver_signal_possession-u",
				rule_text_key: "career_codeweaver_signal_possession_rules-u",
                prerequisite: "command_injection",
                tier: 5,
                cost: 30,
                capstone: true,
                usage_limit: "session"
            },
            system_sovereignty_protocol: {
				name_key: "career_codeweaver_system_sovereignty_protocol-u",
				rule_text_key: "career_codeweaver_system_sovereignty_protocol_rules-u",
                prerequisite: ["backdoor_ritual", "command_injection"],
                tier: 5,
                cost: 30,
                capstone: true,
                usage_limit: "session"
            }
        }
    },
	dreamshaper: {
		name: "Dream Shaper",
		career_type: "arcane",
		career_type_name: "Arcane"
	},
	gravesinger: {
		name: "Gravesinger",
		career_type: "arcane",
		career_type_name: "Arcane"
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
			arcana: "arcana-u",
			insight: "insight-u",
			magic_enchantment: "magic_enchantment-u",
			persuade: "persuade-u"
		},
		secondary_skills: {
			charm: "charm-u",
			deception: "deception-u",
			etiquette_alteri: "etiquette_alteri-u",
			etiquette_corporate: "etiquette_corporate-u",
			etiquette_draevi: "etiquette_draevi-u",
			etiquette_high_society: "etiquette_high_society-u",
			etiquette_lyranni: "etiquette_lyranni-u",
			etiquette_magi: "etiquette_magi-u",
			etiquette_military: "etiquette_military-u",
			etiquette_other: "etiquette_other-u",
			etiquette_underworld: "etiquette_underworld-u",
			interrogation: "interrogation-u",
			intimidate: "intimidate-u",
			perform_acting: "perform_acting-u",
			perform_dance: "perform_dance-u",
			perform_impersonation: "perform_impersonation-u",
			perform_instrument: "perform_instrument-u",
			perform_ritual: "perform_ritual-u",
			perform_vocal: "perform_vocal-u"
		},
		exclusive_skill_sets: [
			[ "etiquette_alteri", "etiquette_corporate", "etiquette_draevi", "etiquette_high_society", "etiquette_lyranni", "etiquette_magi", "etiquette_military", "etiquette_other", "etiquette_underworld" ],
			[ "perform_acting", "perform_dance", "perform_impersonation", "perform_instrument", "perform_ritual", "perform_vocal" ]
		],
		talents: {
			mental_interference: {
				name_key: "career_mindbender_mental_interference-u",
				rule_text_key: "career_mindbender_mental_interference_rules-u",
				affected_skill: [ "magic_enchantment" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			read_the_room: {
				name_key: "career_mindbender_read_the_room-u",
				rule_text_key: "career_mindbender_read_the_room_rules-u",
				affected_skill: [ "insight" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			seed_of_doubt: {
				name_key: "career_mindbender_seed_of_doubt-u",
				rule_text_key: "career_mindbender_seed_of_doubt_rules-u",
				affected_skill: [ "magic_enchantment" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			strain_buffer: {
				name_key: "career_mindbender_strain_buffer-u",
				rule_text_key: "career_mindbender_strain_buffer_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: ""
			},
			subtle_suggestion: {
				name_key: "career_mindbender_subtle_suggestion-u",
				rule_text_key: "career_mindbender_subtle_suggestion_rules-u",
				affected_skill: [ "magic_enchantment" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			hidden_intent: {
				name_key: "career_mindbender_hidden_intent-u",
				rule_text_key: "career_mindbender_hidden_intent_rules-u",
				prerequisite: "mental_interference",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "",
				strain: "1"
			},
			moments_hesitation: {
				name_key: "career_mindbender_moments_hesitation-u",
				rule_text_key: "career_mindbender_moments_hesitation_rules-u",
				prerequisite: "seed_of_doubt",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene",
				strain: "2"
			},
			press_the_advantage: {
				name_key: "career_mindbender_press_the_advantage-u",
				rule_text_key: "career_mindbender_press_the_advantage_rules-u",
				prerequisite: "read_the_room",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene",
				strain: "1"
			},
			shaken_resolve: {
				name_key: "career_mindbender_shaken_resolve-u",
				rule_text_key: "career_mindbender_shaken_resolve_rules-u",
				prerequisite: "seed_of_doubt",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene",
				strain: "1"
			},
			spatial_misjudgment: {
				name_key: "career_mindbender_spatial_misjudgment-u",
				rule_text_key: "career_mindbender_spatial_misjudgment_rules-u",
				prerequisite: "read_the_room",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene",
				strain: "2"
			},
			false_choice: {
				nameKey: "career_mindbender_false_choice-u",
				name_key: "career_mindbender_false_choice-u",
				rule_text_key: "career_mindbender_false_choice_rules-u",
				rulesKey: "career_mindbender_false_choice_rules-u",
				prerequisite: "spatial_misjudgment",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
			    usage_limit: "scene"
			},
			mental_backlash: {
				nameKey: "career_mindbender_mental_backlash-u",
				name_key: "career_mindbender_mental_backlash-u",
				rule_text_key: "career_mindbender_mental_backlash_rules-u",
				rulesKey: "career_mindbender_mental_backlash_rules-u",
				prerequisite: "press_the_advantage",
				tier: 3,
				cost: 15,
				strain: "1",
				capstone: false,
			    usage_limit: "scene"
			},
			moment_of_doubt: {
				name_key: "career_mindbender_moment_of_doubt-u",
				rule_text_key: "career_mindbender_moment_of_doubt_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "spatial_misjudgment",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
			    usage_limit: "scene"
			},
			overextension: {
				nameKey: "career_mindbender_overextension-u",
				name_key: "career_mindbender_overextension-u",
				rule_text_key: "career_mindbender_overextension_rules-u",
				rulesKey: "career_mindbender_overextension_rules-u",
				prerequisite: "moments_hesitation",
				tier: 3,
				cost: 15,
				strain: "1",
				capstone: false,
			    usage_limit: "scene"
			},
			split_focus: {
				nameKey: "career_mindbender_split_focus-u",
				name_key: "career_mindbender_split_focus-u",
				rule_text_key: "career_mindbender_split_focus_rules-u",
				rulesKey: "career_mindbender_split_focus_rules-u",
				prerequisite: "spatial_misjudgment",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
			    usage_limit: "scene"
			},
			blind_angle: {
				name_key: "career_mindbender_blind_angle-u",
				rule_text_key: "career_mindbender_blind_angle_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "split_focus",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene",
				strain: "2"
			},
			catch_22: {
				name_key: "career_mindbender_catch_22-u",
				rule_text_key: "career_mindbender_catch_22_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "false_choice",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene",
				strain: "2"
			},
			commanding_presence: {
				name_key: "career_mindbender_commanding_presence-u",
				rule_text_key: "career_mindbender_commanding_presence_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "mental_backlash",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene",
				strain: "2"
			},
			cracking_resolve: {
				name_key: "career_mindbender_cracking_resolve-u",
				rule_text_key: "career_mindbender_cracking_resolve_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "false_choice",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene",
				strain: "2"
			},
			turn_the_knife: {
				name_key: "career_mindbender_turn_the_knife-u",
				rule_text_key: "career_mindbender_turn_the_knife_rules-u",
				prerequisite: "moments_hesitation",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			fractured_reality: {
				name_key: "career_mindbender_fractured_reality-u",
				rule_text_key: "career_mindbender_fractured_reality_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "turn_the_knife",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			inevitable_choice: {
				name_key: "career_mindbender_inevitable_choice-u",
				rule_text_key: "career_mindbender_inevitable_choice_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "catch_22",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			overwhelming_urge: {
				name_key: "career_mindbender_overwhelming_urge-u",
				rule_text_key: "career_mindbender_overwhelming_urge_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "commanding_presence",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			planted_certainty: {
				name_key: "career_mindbender_planted_certainty-u",
				rule_text_key: "career_mindbender_planted_certainty_rules-u",
				affected_skill: "magic_enchantment",
				prerequisite: "commanding_presence",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			unassailable_mind: {
				name_key: "career_mindbender_unassailable_mind-u",
				rule_text_key: "career_mindbender_unassailable_mind_rules-u",
				prerequisite: "blind_angle",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
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
			arcana: "arcana-u",
			insight: "insight-u",
			magic_warding: "magic_warding-u",
			perception: "perception-u"
		},
		secondary_skills: {
			dodge: "dodge-u",
			etiquette_alteri: "etiquette_alteri-u",
			etiquette_corporate: "etiquette_corporate-u",
			etiquette_draevi: "etiquette_draevi-u",
			etiquette_high_society: "etiquette_high_society-u",
			etiquette_lyranni: "etiquette_lyranni-u",
			etiquette_magi: "etiquette_magi-u",
			etiquette_military: "etiquette_military-u",
			etiquette_other: "etiquette_other-u",
			etiquette_underworld: "etiquette_underworld-u",
			first_aid: "first_aid-u",
			occult_lore: "occult_lore-u",
			survival_urban: "survival_urban-u",
			survival_veil_touched: "survival_veil_touched-u",
			survival_wilderness: "survival_wilderness-u",
			veil_lore: "veil_lore-u"
		},
		exclusive_skill_sets: [
			[ "etiquette_alteri", "etiquette_corporate", "etiquette_draevi", "etiquette_high_society", "etiquette_lyranni", "etiquette_magi", "etiquette_military", "etiquette_other", "etiquette_underworld" ],
			[ "survival_urban", "survival_veil_touched", "survival_wilderness" ]
		],
		talents: {
			arcane_lock: {
				name_key: "career_sigilbound_arcane_lock-u",
				rule_text_key: "career_sigilbound_arcane_lock_rules-u",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			glyphstep: {
				name_key: "career_sigilbound_glyphstep-u",
				rule_text_key: "career_sigilbound_glyphstep_rules-u",
				tier: 1,
				cost: 5,
				strain: "2",
				capstone: false,
			    usage_limit: "scene"
			},
			runesight: {
				name_key: "career_sigilbound_runesight-u",
				rule_text_key: "career_sigilbound_runesight_rules-u",
				affected_skill: "magic_warding",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			sigil_hardened: {
				name_key: "career_sigilbound_sigil_hardened-u",
				rule_text_key: "career_sigilbound_sigil_hardened_rules-u",
				affected_stat: "con",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: ""
			},
			strain_buffer: {
				name_key: "career_sigilbound_strain_buffer-u",
				rule_text_key: "career_sigilbound_strain_buffer_rules-u",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "permanent"
			},
			barrier_projection: {
				name_key: "career_sigilbound_barrier_projection-u",
				rule_text_key: "career_sigilbound_barrier_projection_rules-u",
				prerequisite: "arcane_lock",
				tier: 2,
				cost: 10,
				strain: "3",
				capstone: false,
			    usage_limit: "scene"
			},
			reflective_ward: {
				name_key: "career_sigilbound_reflective_ward-u",
				rule_text_key: "career_sigilbound_reflective_ward_rules-u",
				prerequisite: "runesight",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "scene"
			},
			sigil_of_anchoring: {
				name_key: "career_sigilbound_sigil_of_anchoring-u",
				rule_text_key: "career_sigilbound_sigil_of_anchoring_rules-u",
				prerequisite: "glyphstep",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "scene"
			},
			stabilization_glyph: {
				name_key: "career_sigilbound_stabilization_glyph-u",
				rule_text_key: "career_sigilbound_stabilization_glyph_rules-u",
				prerequisite: "arcane_lock",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
			    usage_limit: "scene"
			},
			warded_advance: {
				name_key: "career_sigilbound_warded_advance-u",
				rule_text_key: "career_sigilbound_warded_advance_rules-u",
				prerequisite: ["barrier_projection", "glyphstep"],
				tier: 2,
				cost: 10,
				strain: "1",
				capstone: false,
			    usage_limit: "scene"
			},
			arcane_reversal: {
				name_key: "career_sigilbound_arcane_reversal-u",
				rule_text_key: "career_sigilbound_arcane_reversal_rules-u",
				affected_skill: "magic_warding",
				prerequisite: "sigil_of_anchoring",
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "session"
			},
			counterglyph: {
				name_key: "career_sigilbound_counterglyph-u",
				rule_text_key: "career_sigilbound_counterglyph_rules-u",
				prerequisite: "reflective_ward",
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "session"
			},
			null_field: {
				name_key: "career_sigilbound_null_field-u",
				rule_text_key: "career_sigilbound_null_field_rules-u",
				prerequisite: ["reflective_ward", "barrier_projection"],
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "scene"
			},
			sanctum_sigil: {
				name_key: "career_sigilbound_sanctum_sigil-u",
				rule_text_key: "career_sigilbound_sanctum_sigil_rules-u",
				affected_stat: [ "con", "pow" ],
				prerequisite: "",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "scene"
			},
			sigil_pulse: {
				name_key: "career_sigilbound_sigil_pulse-u",
				rule_text_key: "career_sigilbound_sigil_pulse_rules-u",
				prerequisite: ["counterglyph", "arcane_reversal", "sanctum_sigil", "null_field"],
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "scene"
			},
			glyph_warder: {
				name_key: "career_sigilbound_glyph_warder-u",
				rule_text_key: "career_sigilbound_glyph_warder_rules-u",
				prerequisite: ["null_field", "warding_matrix"],
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: ""
			},
			mirror_sigil: {
				name_key: "career_sigilbound_mirror_sigil-u",
				rule_text_key: "career_sigilbound_mirror_sigil_rules-u",
				prerequisite: ["counterglyph", "arcane_reversal"],
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			sigil_reservoir: {
				name_key: "career_sigilbound_sigil_reservoir-u",
				rule_text_key: "career_sigilbound_sigil_reservoir_rules-u",
				prerequisite: "glyph_warder",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			veil_seal: {
				name_key: "career_sigilbound_veil_seal-u",
				rule_text_key: "career_sigilbound_veil_seal_rules-u",
				prerequisite: ["sanctum_sigil", "arcane_reversal"],
				tier: 4,
				cost: 20,
				strain: "3",
				capstone: false,
			    usage_limit: "session"
			},
			warding_matrix: {
				name_key: "career_sigilbound_warding_matrix-u",
				rule_text_key: "career_sigilbound_warding_matrix_rules-u",
				affected_stat: "ac",
				prerequisite: "sanctum_sigil",
				tier: 4,
				cost: 20,
				strain: "3",
				capstone: false,
			    usage_limit: "scene"
			},
			aegis_absolute: {
				name_key: "career_sigilbound_aegis_absolute-u",
				rule_text_key: "career_sigilbound_aegis_absolute_rules-u",
				prerequisite: "mirror_sigil",
				tier: 5,
				cost: 30,
				strain: "1d6",
				capstone: true,
			    usage_limit: "session"
			},
			line_unbroken: {
				name_key: "career_sigilbound_line_unbroken-u",
				rule_text_key: "career_sigilbound_line_unbroken_rules-u",
				prerequisite: "sanctum_sigil",
				tier: 5,
				cost: 30,
				strain: "1d6",
				capstone: true,
			    usage_limit: "session"
			},
			runesovereign: {
				name_key: "career_sigilbound_runesovereign-u",
				rule_text_key: "career_sigilbound_runesovereign_rules-u",
				prerequisite: ["glyph_warder", "mirror_sigil"],
				tier: 5,
				cost: 30,
				strain: "1d8",
				capstone: true,
			    usage_limit: "session"
			},
			sigilburst_protocol: {
				name_key: "career_sigilbound_sigilburst_protocol-u",
				rule_text_key: "career_sigilbound_sigilburst_protocol_rules-u",
				prerequisite: ["glyph_warder", "sigil_pulse"],
				tier: 5,
				cost: 30,
				strain: "1d6",
				capstone: true,
			    usage_limit: "session"
			},
			wardmasters_command: {
				name_key: "career_sigilbound_wardmasters_command-u",
				rule_text_key: "career_sigilbound_wardmasters_command_rules-u",
				prerequisite: ["warding_matrix", "sanctum_sigil"],
				tier: 5,
				cost: 30,
				strain: "1d6",
				capstone: true,
			    usage_limit: "session"
			}
		}
	},
	soulmender: {
		name: "Soul Mender",
		career_type: "arcane",
		career_type_name: "Arcane"
	},
	spirit_warden: {
		name: "Spirit Warden",
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
			arcana: "Arcana",
			insight: "Insight",
			magic_summoning: "Magic (Summoning)",
			spirit_lore: "Spirit Lore"
		},
		secondary_skills: {
			athletics: "Athletics",
			investigation: "Investigation",
			perception: "Perception",
			security: "Security",
			survival_urban: "Survival (Urban)",
			survival_veil_touched: "Survival (Urban)",
			survival_wild: "Survival (Wilderness)",
			unarmed: "Unarmed"
		},
		exclusive_skill_sets: [
			[ "survival_urban", "survival_veil_touched", "survival_wild" ]
		],
		talents: {
			basic_ritual_circle: {
				name_key: "career_spirit_warden_basic_ritual_circle-u",
				rule_text_key: "career_spirit_warden_basic_ritual_circle_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			lesser_companion_bond: {
				name_key: "career_spirit_warden_lesser_companion_bond-u",
				rule_text_key: "career_spirit_warden_lesser_companion_bond_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "session"
			},
			rite_efficiency: {
				name_key: "career_spirit_warden_rite_efficiency-u",
				rule_text_key: "career_spirit_warden_rite_efficiency_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: ""
			},
			spirit_sense_attunement: {
				name_key: "career_spirit_warden_spirit_sense_attunement-u",
				rule_text_key: "career_spirit_warden_spirit_sense_attunement_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: ""
			},
			wardbreaker_gesture: {
				name_key: "career_spirit_warden_wardbreaker_gesture-u",
				rule_text_key: "career_spirit_warden_wardbreaker_gesture_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "session"
			},
			wardens_binding_circle: {
				name_key: "career_spirit_warden_wardens_binding_circle-u",
				rule_text_key: "career_spirit_warden_wardens_binding_circle_rules-u",
				affected_skill: "",
				prerequisite: "basic_ritual_circle",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			confront_the_echo: {
				name_key: "career_spirit_warden_confront_the_echo-u",
				rule_text_key: "career_spirit_warden_confront_the_echo_rules-u",
				affected_skill: "",
				prerequisite: "wardbreaker_gesture",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: ""
			},
			circle_marked_recall: {
				name_key: "career_spirit_warden_circle_marked_recall-u",
				rule_text_key: "career_spirit_warden_circle_marked_recall_rules-u",
				affected_skill: "",
				prerequisite: "rite_efficiency",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			lesser_spirit_conjuration: {
				name_key: "career_spirit_warden_lesser_spirit_conjuration-u",
				rule_text_key: "career_spirit_warden_lesser_spirit_conjuration_rules-u",
				affected_skill: "",
				prerequisite: "",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: ""
			},
			circle_flow_discipline: {
				name_key: "career_spirit_warden_circle_flow_discipline-u",
				rule_text_key: "career_spirit_warden_circle_flow_discipline_rules-u",
				affected_skill: "",
				prerequisite: "basic_ritual_circle",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			domain_resonance_circle: {
				name_key: "career_spirit_warden_domain_resonance_circle-u",
				rule_text_key: "career_spirit_warden_domain_resonance_circle_rules-u",
				prerequisite: "wardens_binding_circle",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "session"
			},
			silencing_hand: {
				name_key: "career_spirit_warden_silencing_hand-u",
				rule_text_key: "career_spirit_warden_silencing_hand_rules-u",
				prerequisite: "confront_the_echo",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			spirit_economy: {
				name_key: "career_spirit_warden_spirit_economy-u",
				rule_text_key: "career_spirit_warden_spirit_economy_rules-u",
				prerequisite: "circle_flow_discipline",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			wardens_wards: {
				name_key: "career_spirit_warden_wardens_wards-u",
				rule_text_key: "career_spirit_warden_wardens_wards_rules-u",
				prerequisite: "spirit_sense_attunement",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			purifications_edge: {
				name_key: "career_spirit_warden_purifications_edge-u",
				rule_text_key: "career_spirit_warden_purifications_edge_rules-u",
				prerequisite: "",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			bound_spirit_partner: {
				name_key: "career_spirit_warden_bound_spirit_partner-u",
				rule_text_key: "career_spirit_warden_bound_spirit_partner_rules-u",
				prerequisite: "",
				prerequisiteAny: { tier: 3, count: 1 },
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			master_circle_seal_of_accord: {
				name_key: "career_spirit_warden_master_circle_seal_of_accord-u",
				rule_text_key: "career_spirit_warden_master_circle_seal_of_accord_rules-u",
				prerequisite: "wardens_binding_circle",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "session"
			},
			sovereign_pattern: {
				name_key: "career_spirit_warden_sovereign_pattern-u",
				rule_text_key: "career_spirit_warden_sovereign_pattern_rules-u",
				prerequisite: ["domain_resonance_circle", "silencing_hand"],
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: ""
			},
			wardens_barrier_sigil: {
				name_key: "career_spirit_warden_wardens_barrier_sigil-u",
				rule_text_key: "career_spirit_warden_wardens_barrier_sigil_rules-u",
				prerequisite: "",
				prerequisiteAny: { tier: 3, count: 1 },
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			rite_of_echo_severance: {
				name_key: "career_spirit_warden_rite_of_echo_severance-u",
				rule_text_key: "career_spirit_warden_rite_of_echo_severance_rules-u",
				prerequisite: ["confront_the_echo", "purifications_edge"],
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			grand_exorcism_rite: {
				name_key: "career_spirit_warden_grand_exorcism_rite-u",
				rule_text_key: "career_spirit_warden_grand_exorcism_rite_rules-u",
				affected_skill: "magic_summoning",
				prerequisite: [ "rite_of_echo_severance", "silencing_hand" ],
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			avatars_mandate: {
				name_key: "career_spirit_warden_avatars_mandate-u",
				rule_text_key: "career_spirit_warden_avatars_mandate_rules-u",
				affected_skill: "magic_summoning",
				prerequisite: [ "domain_resonance_circle", "sovereign_pattern" ],
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			eidolon_apotheosis: {
				name_key: "career_spirit_warden_eidolon_apotheosis-u",
				rule_text_key: "career_spirit_warden_eidolon_apotheosis_rules-u",
				affected_skill: "",
				prerequisite: "bound_spirit_partner",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_spirit_warden_stat_boost-u",
				rule_text_key: "career_spirit_warden_stat_boost_rules-u",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: ""
			}
		}
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
			arcana: "arcana-u",
			dodge: "dodge-u",
			magic_elemental: "magic_elemental-u",
			perception: "perception-u"
		},
		secondary_skills: {
			athletics: "athletics-u",
			coordination: "coordination-u",
			insight: "insight-u",
			intimidate: "intimidate-u",
			stealth: "stealth-u",
			survival_urban: "survival_urban-u",
			survival_veil_touched: "survival_veil_touched-u",
			survival_wilderness: "survival_wilderness-u"
		},
		exclusive_skill_sets: [
			["survival_urban", "survival_veil_touched", "survival_wilderness"]
		],
		talents: {
			flashstep: {
				name_key: "career_stormweaver_flashstep-u",
				rule_text_key: "career_stormweaver_flashstep_rules-u",
				prerequisite: "",
				strain: "2",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			hold_the_current: {
				name_key: "career_stormweaver_hold_the_current-u",
				rule_text_key: "career_stormweaver_hold_the_current_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "",
				strain: "1",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			strain_buffer: {
				name_key: "career_stormweaver_strain_buffer-u",
				rule_text_key: "career_stormweaver_strain_buffer_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "permanent"
			},
			tinder_spark: {
				name_key: "career_stormweaver_tinder_spark-u",
				rule_text_key: "career_stormweaver_tinder_spark_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "session"
			},
			veil_backlash: {
				name_key: "career_stormweaver_veil_backlash-u",
				rule_text_key: "career_stormweaver_veil_backlash_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			arc_feedback: {
				name_key: "career_stormweaver_arc_feedback-u",
				rule_text_key: "career_stormweaver_arc_feedback_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "veil_backlash",
				tier: 2,
				cost: 10,
				strain: 2,
				capstone: false,
				usage_limit: "scene"
			},
			dig_in_the_storm: {
				name_key: "career_stormweaver_dig_in_the_storm-u",
				rule_text_key: "career_stormweaver_dig_in_the_storm_rules-u",
				affected_stat: "con",
				prerequisite: "",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: 10,
				strain: 2,
				capstone: false,
				usage_limit: "scene"
			},
			scorchmark: {
				name_key: "career_stormweaver_scorchmark-u",
				rule_text_key: "career_stormweaver_scorchmark_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "tinder_spark",
				tier: 2,
				cost: 10,
				strain: 3,
				capstone: false,
				usage_limit: "scene"
			},
			stormpulse_drive: {
				name_key: "career_stormweaver_stormpulse_drive-u",
				rule_text_key: "career_stormweaver_stormpulse_drive_rules-u",
				prerequisite: "hold_the_current",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			voltaic_reflex: {
				name_key: "career_stormweaver_voltaic_reflex-u",
				rule_text_key: "career_stormweaver_voltaic_reflex_rules-u",
				affected_skill: "dodge",
				prerequisite: "flashstep",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "session"
			},
			burnline_pressure: {
				name_key: "career_stormweaver_burnline_pressure-u",
				rule_text_key: "career_stormweaver_burnline_pressure_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "dig_in_the_storm",
				tier: 3,
				cost: 15,
				capstone: false,
				strain: 2,
			   	usage_limit: "scene"
			},
			killzone_instinct: {
				name_key: "career_stormweaver_killzone_instinct-u",
				rule_text_key: "career_stormweaver_killzone_instinct_rules-u",
				affected_skill: "dodge",
				prerequisite: "",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: 15,
				capstone: false,
			   	usage_limit: ""
			},
			shockstep_conduit: {
				name_key: "career_stormweaver_shockstep_conduit-u",
				rule_text_key: "career_stormweaver_shockstep_conduit_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: ["arc_feedback", "voltaic_reflex"],
				tier: 3,
				cost: 15,
				capstone: false,
			   	usage_limit: "session"
			},
			stormcallers_edge: {
				name_key: "career_stormweaver_stormcallers_edge-u",
				rule_text_key: "career_stormweaver_stormcallers_edge_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "scorchmark",
				tier: 3,
				cost: 15,
				capstone: false,
				strain: 4,
			   	usage_limit: "scene"
			},
			volcanic_path: {
				name_key: "career_stormweaver_volcanic_path-u",
				rule_text_key: "career_stormweaver_volcanic_path_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "stormpulse_drive",
				tier: 3,
				cost: 15,
				capstone: false,
			   	usage_limit: "session"
			},
			arc_flare: {
				name_key: "career_stormweaver_arc_flare-u",
				rule_text_key: "career_stormweaver_arc_flare_rules-u",
				prerequisite: "stormcallers_edge",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			burn_current: {
				name_key: "career_stormweaver_burn_current-u",
				rule_text_key: "career_stormweaver_burn_current_rules-u",
				prerequisite: "shockstep_conduit",
				strain: 3,
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			flashfire_assault: {
				name_key: "career_stormweaver_flashfire_assault-u",
				rule_text_key: "career_stormweaver_flashfire_assault_rules-u",
				affected_skill: "throw",
				affected_skill_group: "combat_melee",
				prerequisite: "stormcallers_edge",
				strain: 2,
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			surge_engine: {
				name_key: "career_stormweaver_surge_engine-u",
				rule_text_key: "career_stormweaver_surge_engine_rules-u",
				prerequisiteAny: { tier: 3, count: 1 },
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			veilstorm_mantle: {
				name_key: "career_stormweaver_veilstorm_mantle-u",
				rule_text_key: "career_stormweaver_veilstorm_mantle_rules-u",
				prerequisite: "stormcallers_edge",
				strain: 3,
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			eye_of_the_storm: {
				name_key: "career_stormweaver_eye_of_the_storm-u",
				rule_text_key: "career_stormweaver_eye_of_the_storm_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: ["veilstorm_mantle", "arc_flare"],
				tier: 5,
				cost: 30,
				strain: 1,
				capstone: true,
			    usage_limit: "session"
			},
			singularity_discharge: {
				name_key: "career_stormweaver_singularity_discharge-u",
				rule_text_key: "career_stormweaver_singularity_discharge_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "surge_engine",
				tier: 5,
				cost: 30,
				strain: 1,
				capstone: true,
			    usage_limit: "session"
			},
			stormbreak: {
				name_key: "career_stormweaver_stormbreak-u",
				rule_text_key: "career_stormweaver_stormbreak_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "burn_current",
				tier: 5,
				cost: 30,
				strain: 1,
				capstone: true,
			    usage_limit: "session"
			},
			total_elemental_collapse: {
				name_key: "career_stormweaver_total_elemental_collapse-u",
				rule_text_key: "career_stormweaver_total_elemental_collapse_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "burn_current",
				tier: 5,
				cost: 30,
				strain: 2,
				capstone: true,
			    usage_limit: "session"
			},
			veilcore_meltdown: {
				name_key: "career_stormweaver_veilcore_meltdown-u",
				rule_text_key: "career_stormweaver_veilcore_meltdown_rules-u",
				affected_skill: "magic_elemental",
				prerequisite: "surge_engine",
				tier: 5,
				cost: 30,
				strain: 1,
				capstone: true,
			    usage_limit: "session"
			}
		}
	},
	veil_dancer: {
		name: "Veil Dancer",
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
			magic_alteration: "Magic (Alteration)",
			athletics: "Athletics",
			coordination: "Coordination",
			dodge: "Dodge"
		},
		secondary_skills: {
			arcana: "Arcana",
			melee_weapons: "Melee Weapons",
			perception: "Perception",
			stealth: "Stealth",
			throw: "Throw",
			unarmed: "Unarmed"
			},
		talents: {
			flow_entry: {
				name_key: "career_veil_dancer_flow_entry-u",
				rule_text_key: "career_veil_dancer_flow_entry_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			grounded_form: {
				name_key: "career_veil_dancer_grounded_form-u",
				rule_text_key: "career_veil_dancer_grounded_form_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			kinetic_read: {
				name_key: "career_veil_dancer_kinetic_read-u",
				rule_text_key: "career_veil_dancer_kinetic_read_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: ""
			},
			strain_buffer: {
				name_key: "career_veil_dancer_strain_buffer-u",
				rule_text_key: "career_veil_dancer_strain_buffer_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "permanent"
			},
			veilstep_initiate: {
				name_key: "career_veil_dancer_veilstep_initiate-u",
				rule_text_key: "career_veil_dancer_veilstep_initiate_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			borrowed_trajectory: {
				name_key: "career_veil_dancer_borrowed_trajectory-u",
				rule_text_key: "career_veil_dancer_borrowed_trajectory_rules-u",
				prerequisite: "veilstep_initiate",
				tier: 2,
				cost: 10,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			gravity_pin: {
				name_key: "career_veil_dancer_gravity_pin-u",
				rule_text_key: "career_veil_dancer_gravity_pin_rules-u",
				prerequisite: "grounded_form",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			inertial_shear: {
				name_key: "career_veil_dancer_inertial_shear-u",
				rule_text_key: "career_veil_dancer_inertial_shear_rules-u",
				prerequisite: "flow_entry",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			phase_latched_strike: {
				name_key: "career_veil_dancer_phase_latched_strike-u",
				rule_text_key: "career_veil_dancer_phase_latched_strike_rules-u",
				prerequisite: "kinetic_read",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			veil_reserve_step: {
				name_key: "career_veil_dancer_veil_reserve_step-u",
				rule_text_key: "career_veil_dancer_veil_reserve_step_rules-u",
				prerequisite: "strain_buffer",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			borrowed_trajectory: {
				name_key: "career_veil_dancer_borrowed_trajectory-u",
				rule_text_key: "career_veil_dancer_borrowed_trajectory_rules-u",
				prerequisite: "veilstep_initiate",
				tier: 2,
				cost: 10,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			gravity_pin: {
				name_key: "career_veil_dancer_gravity_pin-u",
				rule_text_key: "career_veil_dancer_gravity_pin_rules-u",
				prerequisite: "grounded_form",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			inertial_shear: {
				name_key: "career_veil_dancer_inertial_shear-u",
				rule_text_key: "career_veil_dancer_inertial_shear_rules-u",
				prerequisite: "flow_entry",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			phase_latched_strike: {
				name_key: "career_veil_dancer_phase_latched_strike-u",
				rule_text_key: "career_veil_dancer_phase_latched_strike_rules-u",
				prerequisite: "kinetic_read",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			veil_reserve_step: {
				name_key: "career_veil_dancer_veil_reserve_step-u",
				rule_text_key: "career_veil_dancer_veil_reserve_step_rules-u",
				prerequisite: "strain_buffer",
				tier: 2,
				cost: 10,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			center_of_pressure: {
				name_key: "career_veil_dancer_center_of_pressure-u",
				rule_text_key: "career_veil_dancer_center_of_pressure_rules-u",
				prerequisite: "veil_reserve_step",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: ""
			},
			flow_severance: {
				name_key: "career_veil_dancer_flow_severance-u",
				rule_text_key: "career_veil_dancer_flow_severance_rules-u",
				prerequisite: "inertial_shear",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			inertial_claim: {
				name_key: "career_veil_dancer_inertial_claim-u",
				rule_text_key: "career_veil_dancer_inertial_claim_rules-u",
				prerequisite: "phase_latched_strike",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			mass_lock_technique: {
				name_key: "career_veil_dancer_mass_lock_technique-u",
				rule_text_key: "career_veil_dancer_mass_lock_technique_rules-u",
				prerequisite: "gravity_pin",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			vector_reversal: {
				name_key: "career_veil_dancer_vector_reversal-u",
				rule_text_key: "career_veil_dancer_vector_reversal_rules-u",
				prerequisite: "borrowed_trajectory",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			borrowed_horizon: {
				name_key: "career_veil_dancer_borrowed_horizon-u",
				rule_text_key: "career_veil_dancer_borrowed_horizon_rules-u",
				prerequisite: "center_of_pressure",
				tier: 4,
				cost: 20,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			dance_of_the_unbound_form: {
				name_key: "career_veil_dancer_dance_of_the_unbound_form-u",
				rule_text_key: "career_veil_dancer_dance_of_the_unbound_form_rules-u",
				prerequisite: "inertial_claim",
				tier: 4,
				cost: 20,
				strain: "3",
				capstone: false,
				usage_limit: "scene"
			},
			impossible_footing: {
				name_key: "career_veil_dancer_impossible_footing-u",
				rule_text_key: "career_veil_dancer_impossible_footing_rules-u",
				prerequisite: "vector_reversal",
				tier: 4,
				cost: 20,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			veilbreaker_palm: {
				name_key: "career_veil_dancer_veilbreaker_palm-u",
				rule_text_key: "career_veil_dancer_veilbreaker_palm_rules-u",
				prerequisite: "mass_lock_technique",
				tier: 4,
				cost: 20,
				strain: "3",
				capstone: false,
				usage_limit: "scene"
			},
			world_refuses_you: {
				name_key: "career_veil_dancer_world_refuses_you-u",
				rule_text_key: "career_veil_dancer_world_refuses_you_rules-u",
				prerequisite: "mass_lock_technique",
				tier: 4,
				cost: 20,
				strain: "2",
				capstone: false,
				usage_limit: "scene"
			},
			body_like_a_falling_star: {
				name_key: "career_veil_dancer_body_like_a_falling_star-u",
				rule_text_key: "career_veil_dancer_body_like_a_falling_star_rules-u",
				prerequisite: "borrowed_horizon",
				tier: 5,
				cost: 30,
				strain: "1d6",
				capstone: true,
				usage_limit: "session"
			},
			heavenshattering_sequence: {
				name_key: "career_veil_dancer_heavenshattering_sequence-u",
				rule_text_key: "career_veil_dancer_heavenshattering_sequence_rules-u",
				prerequisite: "veilbreaker_palm",
				tier: 5,
				cost: 30,
				strain: "2d6",
				capstone: true,
				usage_limit: "session"
			},
			stillness_between_heartbeats: {
				name_key: "career_veil_dancer_stillness_between_heartbeats-u",
				rule_text_key: "career_veil_dancer_stillness_between_heartbeats_rules-u",
				prerequisite: "world_refuses_you",
				tier: 5,
				cost: 30,
				strain: "1d8",
				capstone: true,
				usage_limit: "session"
			},
			the_veil_remembers_you: {
				name_key: "career_veil_dancer_the_veil_remembers_you-u",
				rule_text_key: "career_veil_dancer_the_veil_remembers_you_rules-u",
				prerequisite: "dance_of_the_unbound_form",
				tier: 5,
				cost: 30,
				strain: "1d8",
				capstone: true,
				usage_limit: "session"
			},
			zero_point_mastery: {
				name_key: "career_veil_dancer_zero_point_mastery-u",
				rule_text_key: "career_veil_dancer_zero_point_mastery_rules-u",
				prerequisite: "impossible_footing",
				tier: 5,
				cost: 30,
				strain: "1d6",
				capstone: true,
				usage_limit: "session"
			}
		}
	},
	/* Core Career */
	brawler: {
		name: "Brawler",
		career_type: "core",
		career_type_name: "Core"
	},
	breacher: {
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
            firearms_handgun: "Handgun",
            security:         "Security Systems"
        },
        talents: {
            breachfinders_eye: {
				name_key: "career_combat_engineer_breachfinders_eye-u",
				rule_text_key: "career_combat_engineer_breachfinders_eye_rules-u",
				affected_skill: [ "demolitions", "mechanics" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            field_fix: {
				name_key: "career_combat_engineer_field_fix-u",
				rule_text_key: "career_combat_engineer_field_fix_rules-u",
				affected_skill: "mechanics",
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "session"
            },
            patchwork_tools: {
				name_key: "career_combat_engineer_patchwork_tools-u",
				rule_text_key: "career_combat_engineer_patchwork_tools_rules-u",
				affected_skill: [ "electronics", "mechanics" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            quick_bypass: {
				name_key: "career_combat_engineer_quick_bypass-u",
				rule_text_key: "career_combat_engineer_quick_bypass_rules-u",
				affected_skill: "security",
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            rapid_jury_rig: {
				name_key: "career_combat_engineer_rapid_jury_rig-u",
				rule_text_key: "career_combat_engineer_rapid_jury_rig_rules-u",
				affected_skill: "mechanics",
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "session"
            },
            right_tool_for_it: {
				name_key: "career_combat_engineer_right_tool_for_it-u",
				rule_text_key: "career_combat_engineer_right_tool_for_it_rules-u",
				affected_skill: [ "electronics", "mechanics" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            tactile_memory: {
				name_key: "career_combat_engineer_tactile_memory-u",
				rule_text_key: "career_combat_engineer_tactile_memory_rules-u",
				affected_skill: [ "demolitions", "mechanics", "security" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "session"
            },
            compensating_build: {
				name_key: "career_combat_engineer_compensating_build-u",
				rule_text_key: "career_combat_engineer_compensating_build_rules-u",
				affected_skill: [ "electronics", "mechanics" ],
                prerequisite: "patchwork_tools",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            controlled_breach: {
				name_key: "career_combat_engineer_controlled_breach-u",
				rule_text_key: "career_combat_engineer_controlled_breach_rules-u",
				affected_skill: [ "demolitions", "mechanics" ],
                prerequisite: ["breachfinders_eye", "rapid_jury_rig"],
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "session"
            },
            dead_switch_logic: {
				name_key: "career_combat_engineer_dead_switch_logic-u",
				rule_text_key: "career_combat_engineer_dead_switch_logic_rules-u",
                prerequisite: "breachfinders_eye",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "session"
            },
            fail_safe_trigger: {
				name_key: "career_combat_engineer_fail_safe_trigger-u",
				rule_text_key: "career_combat_engineer_fail_safe_trigger_rules-u",
                prerequisite: "rapid_jury_rig",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "session"
            },
            overclock_protocol: {
				name_key: "career_combat_engineer_overclock_protocol-u",
				rule_text_key: "career_combat_engineer_overclock_protocol_rules-u",
				affected_skill: [ "electronics", "mechanics" ],
                prerequisite: ["right_tool_for_it", "rapid_jury_rig"],
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            pathfinders_instinct: {
				name_key: "career_combat_engineer_pathfinders_instinct-u",
				rule_text_key: "career_combat_engineer_pathfinders_instinct_rules-u",
				affected_skill: [ "navigate", "stealth" ],
                prerequisite: "tactile_memory",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "session"
            },
            precision_override: {
				name_key: "career_combat_engineer_precision_override-u",
				rule_text_key: "career_combat_engineer_precision_override_rules-u",
				affected_skill: "security",
                prerequisite: "quick_bypass",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "session"
            },
            reactive_tune_up: {
				name_key: "career_combat_engineer_reactive_tune_up-u",
				rule_text_key: "career_combat_engineer_reactive_tune_up_rules-u",
				affected_skill: "mechanics",
                prerequisite: ["field_fix", "right_tool_for_it"],
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
			power_splice: {
				name_key: "career_combat_engineer_power_splice-u",
				rule_text_key: "career_combat_engineer_power_splice_rules-u",
				affected_skill: "mechanics",
			    prerequisite: "field_fix",
			    tier: 3,
			    cost: 15,
			    capstone: false,
			    usage_limit: "scene"
			},
			reactive_primer: {
				name_key: "career_combat_engineer_reactive_primer-u",
				rule_text_key: "career_combat_engineer_reactive_primer_rules-u",
			    prerequisite: ["rapid_jury_rig", "right_tool_for_it"],
			    tier: 3,
			    cost: 15,
			    capstone: false,
			    usage_limit: "scene"
			},
			reactive_scaffold: {
				name_key: "career_combat_engineer_reactive_scaffold-u",
				rule_text_key: "career_combat_engineer_reactive_scaffold_rules-u",
				affected_skill: "mechanics",
			    prerequisite: "rapid_jury_rig",
			    tier: 3,
			    cost: 15,
			    capstone: false,
			    usage_limit: "scene"
			},
			sabotage_relay: {
				name_key: "career_combat_engineer_sabotage_relay-u",
				rule_text_key: "career_combat_engineer_sabotage_relay_rules-u",
			    prerequisite: "breachfinders_eye",
			    tier: 3,
			    cost: 15,
			    capstone: false,
			    usage_limit: "session"
			},
			structural_collapse: {
				name_key: "career_combat_engineer_structural_collapse-u",
				rule_text_key: "career_combat_engineer_structural_collapse_rules-u",
			    prerequisite: "breachfinders_eye",
			    tier: 3,
			    cost: 15,
			    capstone: false,
			    usage_limit: "session"
			},
			tactical_recompiler: {
				name_key: "career_combat_engineer_tactical_recompiler-u",
				rule_text_key: "career_combat_engineer_tactical_recompiler_rules-u",
			    prerequisite: "overclock_protocol",
			    tier: 3,
			    cost: 15,
			    capstone: false,
			    usage_limit: "scene"
			},
			auto_repair_subroutines: {
				name_key: "career_combat_engineer_auto_repair_subroutines-u",
				rule_text_key: "career_combat_engineer_auto_repair_subroutines_rules-u",
				affected_skill: "mechanics",
			    prerequisite: ["reactive_primer", "power_splice"],
			    tier: 4,
			    cost: 20,
			    capstone: false,
			    usage_limit: "session"
			},
			collapse_engineer: {
				name_key: "career_combat_engineer_collapse_engineer-u",
				rule_text_key: "career_combat_engineer_collapse_engineer_rules-u",
				affected_skill: "demolitions",
			    prerequisite: "structural_collapse",
			    tier: 4,
			    cost: 20,
			    capstone: false,
			    usage_limit: "scene"
			},
			failsafe_architect: {
				name_key: "career_combat_engineer_failsafe_architect-u",
				rule_text_key: "career_combat_engineer_failsafe_architect_rules-u",
			    prerequisite: ["reactive_scaffold", "tactile_memory"],
			    tier: 4,
			    cost: 20,
			    capstone: false,
			    usage_limit: "scene"
			},
			fortified_anchor: {
				name_key: "career_combat_engineer_fortified_anchor-u",
				rule_text_key: "career_combat_engineer_fortified_anchor_rules-u",
			    prerequisite: "reactive_scaffold",
			    tier: 4,
			    cost: 20,
			    capstone: false,
			    usage_limit: "session"
			},
			hijack_protocol: {
				name_key: "career_combat_engineer_hijack_protocol-u",
				rule_text_key: "career_combat_engineer_hijack_protocol_rules-u",
			    prerequisite: "tactical_recompiler",
			    tier: 4,
			    cost: 20,
			    capstone: false,
			    usage_limit: "session"
			},
			saboteurs_signature: {
				name_key: "career_combat_engineer_saboteurs_signature-u",
				rule_text_key: "career_combat_engineer_saboteurs_signature_rules-u",
			    prerequisite: ["structural_collapse", "sabotage_relay"],
			    tier: 4,
			    cost: 20,
			    capstone: false,
			    usage_limit: "session"
			},
			failsafe_codex: {
				name_key: "career_combat_engineer_failsafe_codex-u",
				rule_text_key: "career_combat_engineer_failsafe_codex_rules-u",
			    prerequisite: "failsafe_architect",
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "scene"
			},
			field_constructor: {
				name_key: "career_combat_engineer_field_constructor-u",
				rule_text_key: "career_combat_engineer_field_constructor_rules-u",
			    prerequisite: ["auto_repair_subroutines", "power_splice"],
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
			},
			master_of_collapse: {
				name_key: "career_combat_engineer_master_of_collapse-u",
				rule_text_key: "career_combat_engineer_master_of_collapse_rules-u",
			    prerequisite: "collapse_engineer",
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
			},
			system_subjugation: {
				name_key: "career_combat_engineer_system_subjugation-u",
				rule_text_key: "career_combat_engineer_system_subjugation_rules-u",
			    prerequisite: "hijack_protocol",
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_combat_engineer_stat_boost-u",
				rule_text_key: "career_combat_engineer_stat_boost_rules-u",
				prerequisiteAny: { tier: 4, count: 1 },
			    tier: 5,
			    cost: 30,
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
			first_aid: "first_aid-u",
			coordination: "coordination-u",
			dodge: "dodge-u",
			medicine: "medicine-u"
		},
		secondary_skills: {
			anthropology:     "anthropology-u",
			archaeology:      "archaeology-u",
			athletics:        "athletics-u",
			biology:          "biology-u",
			chemistry:        "chemistry-u",
			engineering:      "engineering-u",
			firearms_handgun: "firearms_handgun-u",
			insight:          "insight-u",
			investigation:    "investigation-u",
			perception:       "perception-u",
			physics:          "physics-u"
		},
		exclusive_skill_sets: [
			["anthropology", "archaeology", "biology", "chemistry", "engineering", "physics"]
		],
		talents: {
			field_stabilizer: {
				name_key: "career_combat_medic_field_stabilizer-u",
				rule_text_key: "career_combat_medic_field_stabilizer_rules-u",
				affected_skill: [ "first_aid", "medicine" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			injector_harness: {
				name_key: "career_combat_medic_injector_harness-u",
				rule_text_key: "career_combat_medic_injector_harness_rules-u",
				affected_skill: "first_aid",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			pain_doesnt_matter: {
				name_key: "career_combat_medic_pain_doesnt_matter-u",
				rule_text_key: "career_combat_medic_pain_doesnt_matter_rules-u",
				affected_skill: "medicine",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			trauma_team_reflexes: {
				name_key: "career_combat_medic_trauma_team_reflexes-u",
				rule_text_key: "career_combat_medic_trauma_team_reflexes_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			vital_scan_overlay: {
				name_key: "career_combat_medic_vital_scan_overlay-u",
				rule_text_key: "career_combat_medic_vital_scan_overlay_rules-u",
				affected_skill: [ "first_aid", "medicine" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			medical_override: {
				name_key: "career_combat_medic_medical_override-u",
				rule_text_key: "career_combat_medic_medical_override_rules-u",
				affected_skill: [ "first_aid", "medicine" ],
				prerequisite: ["injector_harness", "pain_doesnt_matter"],
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "scene"
			},
			painkiller_protocol: {
				name_key: "career_combat_medic_painkiller_protocol-u",
				rule_text_key: "career_combat_medic_painkiller_protocol_rules-u",
				affected_skill: [ "first_aid", "medicine" ],
				prerequisite: "injector_harness",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: ""
			},
			pressure_seal: {
				name_key: "career_combat_medic_pressure_seal-u",
				rule_text_key: "career_combat_medic_pressure_seal_rules-u",
				prerequisite: "field_stabilizer",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "session"
			},
			stay_with_me: {
				name_key: "career_combat_medic_stay_with_me-u",
				rule_text_key: "career_combat_medic_stay_with_me_rules-u",
				prerequisite: "field_stabilizer",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "scene"
			},
			tactical_redeployment: {
				name_key: "career_combat_medic_tactical_redeployment-u",
				rule_text_key: "career_combat_medic_tactical_redeployment_rules-u",
				prerequisite: "trauma_team_reflexes",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "scene"
			},
			combat_revive: {
				name_key: "career_combat_medic_combat_revive-u",
				rule_text_key: "career_combat_medic_combat_revive_rules-u",
				prerequisite: "medical_override",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "session"
			},
			overwatch_healer: {
				name_key: "career_combat_medic_overwatch_healer-u",
				rule_text_key: "career_combat_medic_overwatch_healer_rules-u",
				prerequisite: "tactical_redeployment",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: ""
			},
			quickdraw_injector: {
				name_key: "career_combat_medic_quickdraw_injector-u",
				rule_text_key: "career_combat_medic_quickdraw_injector_rules-u",
				prerequisite: ["injector_harness", "painkiller_protocol"],
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			surgical_clarity: {
				name_key: "career_combat_medic_surgical_clarity-u",
				rule_text_key: "career_combat_medic_surgical_clarity_rules-u",
				prerequisite: ["pressure_seal", "stay_with_me"],
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "session"
			},
			veil_immunologist: {
				name_key: "career_combat_medic_veil_immunologist-u",
				rule_text_key: "career_combat_medic_veil_immunologist_rules-u",
				affected_skill: "medicine",
				prerequisite: ["pressure_seal", "vital_scan_overlay"],
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "session"
			},
			emergency_triage_net: {
				name_key: "career_combat_medic_emergency_triage_net-u",
				rule_text_key: "career_combat_medic_emergency_triage_net_rules-u",
				affected_skill: "medicine",
				prerequisite: "overwatch_healer",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			endurance_conditioning: {
				name_key: "career_combat_medic_endurance_conditioning-u",
				rule_text_key: "career_combat_medic_endurance_conditioning_rules-u",
				prerequisite: ["surgical_clarity" ,"combat_revive" ],
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: ""
			},
			field_expeditor: {
				name_key: "career_combat_medic_field_expeditor-u",
				rule_text_key: "career_combat_medic_field_expeditor_rules-u",
				affected_skill: "medicine",
				prerequisite: "combat_revive",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			ghost_of_the_er: {
				name_key: "career_combat_medic_ghost_of_the_er-u",
				rule_text_key: "career_combat_medic_ghost_of_the_er_rules-u",
				prerequisite: "overwatch_healer",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			triage_commander: {
				name_key: "career_combat_medic_triage_commander-u",
				rule_text_key: "career_combat_medic_triage_commander_rules-u",
				prerequisite: "surgical_clarity",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			adrenal_shield_matrix: {
			    name_key: "career_combat_medic_adrenal_shield_matrix-u",
			    rule_text_key: "career_combat_medic_adrenal_shield_matrix_rules-u",
			    prerequisite: "endurance_conditioning",
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
			},
			golden_hour_doctrine: {
			    name_key: "career_combat_medic_golden_hour_doctrine-u",
			    rule_text_key: "career_combat_medic_golden_hour_doctrine_rules-u",
			    prerequisite: "combat_revive",
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
			},
			last_measure_injection: {
			    name_key: "career_combat_medic_last_measure_injection-u",
			    rule_text_key: "career_combat_medic_last_measure_injection_rules-u",
			    prerequisite: "field_expeditor",
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
			},
			miracle_protocol: {
			    name_key: "career_combat_medic_miracle_protocol-u",
			    rule_text_key: "career_combat_medic_miracle_protocol_rules-u",
			    affected_skill: "medicine",
			    prerequisite: ["field_expeditor", "ghost_of_the_er"],
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
			},
			no_one_dies_today: {
			    name_key: "career_combat_medic_no_one_dies_today-u",
			    rule_text_key: "career_combat_medic_no_one_dies_today_rules-u",
			    prerequisite: "emergency_triage_net",
			    tier: 5,
			    cost: 30,
			    capstone: true,
			    usage_limit: "session"
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
			etiquette_draevi: "Etiquette (Draevi)",
			etiquette_high_society: "Etiquette (High Society)",
			etiquette_lyranni: "Etiquette (Lyranni)",
			etiquette_magi: "Etiquette (Magi)",
			etiquette_military: "Etiquette (Military)",
			etiquette_underworld: "Etiquette (Underworld)",
			etiquette_other: "Etiquette (Other)",
			leadership: "Leadership",
			security: "Security Systems",
			electronics: "Electronics",
			bureaucracy: "Bureaucracy"
		},
		exclusive_skill_sets: [
			["etiquette_alteri", "etiquette_draevi", "etiquette_high_society", "etiquette_lyranni", "etiquette_magi", "etiquette_military", "etiquette_underworld", "etiquette_other"]
		],
		talents: {
            clock_the_rules: {
				name_key: "career_faceman_clock_the_rules-u",
				rule_text_key: "career_faceman_clock_the_rules_rules-u",
				affected_skill: "insight",
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            introductions_on_me: {
				name_key: "career_faceman_introductions_on_me-u",
				rule_text_key: "career_faceman_introductions_on_me_rules-u",
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            make_it_official: {
				name_key: "career_faceman_make_it_official-u",
				rule_text_key: "career_faceman_make_it_official_rules-u",
				affected_skill: [ "electronics", "security" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            prompting_whisper: {
				name_key: "career_faceman_prompting_whisper-u",
				rule_text_key: "career_faceman_prompting_whisper_rules-u",
				affected_skill: [ "deception", "disguise", "persuade" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: ""
            },
            walkthrough_doctrine: {
				name_key: "career_faceman_walkthrough_doctrine-u",
				rule_text_key: "career_faceman_walkthrough_doctrine_rules-u",
				affected_skill: [ "deception", "persuade" ],
                prerequisite: "",
                tier: 1,
                cost: 5,
                capstone: false,
                usage_limit: "scene"
            },
            cover_flip: {
				name_key: "career_faceman_cover_flip-u",
				rule_text_key: "career_faceman_cover_flip_rules-u",
				affected_skill: "disguise",
                prerequisite: "clock_the_rules",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            default_to_process: {
				name_key: "career_faceman_default_to_process-u",
				rule_text_key: "career_faceman_default_to_process_rules-u",
				affected_skill: "persuade",
                prerequisite: "walkthrough_doctrine",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: ""
            },
            follow_my_lead: {
				name_key: "career_faceman_follow_my_lead-u",
				rule_text_key: "career_faceman_follow_my_lead_rules-u",
				affected_skill: [ "deception", "persuade" ],
                prerequisite: "prompting_whisper",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            host_escort: {
				name_key: "career_faceman_host_escort-u",
				rule_text_key: "career_faceman_host_escort_rules-u",
				affected_skill: "persuade",
                prerequisite: "introductions_on_me",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            pass_token_clone: {
				name_key: "career_faceman_pass_token_clone-u",
				rule_text_key: "career_faceman_pass_token_clone_rules-u",
				affected_skill: [ "electronics", "security" ],
                prerequisite: "make_it_official",
                tier: 2,
                cost: 10,
                capstone: false,
                usage_limit: "scene"
            },
            frame_the_interaction: {
				name_key: "career_faceman_frame_the_interaction-u",
				rule_text_key: "career_faceman_frame_the_interaction_rules-u",
                prerequisite: "default_to_process",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: ""
            },
            interruption_play: {
				name_key: "career_faceman_interruption_play-u",
				rule_text_key: "career_faceman_interruption_play_rules-u",
				affected_skill: [ "deception", "persuade", "disguise" ],
                prerequisite: "follow_my_lead",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: "scene"
            },
            one_conversation_rule: {
				name_key: "career_faceman_one_conversation_rule-u",
				rule_text_key: "career_faceman_one_conversation_rule_rules-u",
				affected_skill: [ "deception", "persuade" ],
                prerequisite: "cover_flip",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: "scene"
            },
            senior_voice: {
				name_key: "career_faceman_senior_voice-u",
				rule_text_key: "career_faceman_senior_voice_rules-u",
				affected_skill: "persuade",
                prerequisite: "host_escort",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: "scene"
            },
            token_familiarity: {
				name_key: "career_faceman_token_familiarity-u",
				rule_text_key: "career_faceman_token_familiarity_rules-u",
                prerequisite: "pass_token_clone",
                tier: 3,
                cost: 15,
                capstone: false,
                usage_limit: "scene"
            },
            claim_authority: {
				name_key: "career_faceman_claim_authority-u",
				rule_text_key: "career_faceman_claim_authority_rules-u",
				affected_skill: "persuade",
                name: "Claim Authority",
                description: "Action; 1d4 Strain — Once per session, assert temporary oversight: Persuade vs. POW on a gatekeeper in earshot. On success, for the rest of the scene they treat you as an authorized inspector/House auditor/sector elder within their remit (escort on request, open what they control, answer procedural questions). Elite units ignore; supervisors resist with a bonus die.",
                prerequisite: "senior_voice",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "session"
            },
            deep_cover_switch: {
				name_key: "career_faceman_deep_cover_switch-u",
				rule_text_key: "career_faceman_deep_cover_switch_rules-u",
                prerequisite: "one_conversation_rule",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "scene"
            },
            human_gate_hand_off: {
				name_key: "career_faceman_human_gate_hand_off-u",
				rule_text_key: "career_faceman_human_gate_hand_off_rules-u",
				affected_skill: [ "deception", "electronics", "persuade", "security" ],
                prerequisite: "frame_the_interaction",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "scene"
            },
            master_cue: {
				name_key: "career_faceman_master_cue-u",
				rule_text_key: "career_faceman_master_cue_rules-u",
				affected_skill: [ "deception", "disguise", "persuade" ],
                prerequisite: "interruption_play",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "scene"
            },
            small_team_protocol_reset: {
				name_key: "career_faceman_small_team_protocol_reset-u",
				rule_text_key: "career_faceman_small_team_protocol_reset_rules-u",
				affected_skill: "persuade",
                prerequisite: "senior_voice",
                tier: 4,
                cost: 20,
                capstone: false,
                usage_limit: "scene"
            },
            all_access_walk: {
				name_key: "career_faceman_all_access_walk-u",
				rule_text_key: "career_faceman_all_access_walk_rules-u",
				affected_skill: [ "deception", "persuade" ],
                prerequisite: ["claim_authority", "human_gate_hand_off"],
                tier: 5,
                cost: 30,
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
                cost: 30,
                capstone: true,
                usage_limit: "session"
            },
            conversational_tyrant: {
				name_key: "career_faceman_conversational_tyrant-u",
				rule_text_key: "career_faceman_conversational_tyrant_rules-u",
				affected_skill: [ "deception", "persuade" ],
                prerequisite: "master_cue",
                tier: 5,
                cost: 30,
                capstone: true,
                usage_limit: "session"
            },
            master_of_disguise: {
				name_key: "career_faceman_master_of_disguise-u",
				rule_text_key: "career_faceman_master_of_disguise_rules-u",
				affected_skill: "disguise",
                prerequisite: "deep_cover_switch",
                tier: 5,
                cost: 30,
                capstone: true,
                usage_limit: "session"
            },
            stat_boost: {
				name_key: "career_faceman_stat_boost-u",
				rule_text_key: "career_faceman_stat_boost_rules-u",
                prerequisite: "",
                prerequisiteAny: { tier: 4, count: 1 },
                tier: 5,
                cost: 30,
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
				affected_skill: [ "charm", "persuade", "leadership" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			encore_effect: {
				name_key: "career_icon_encore_effect-u",
				rule_text_key: "career_icon_encore_effect_rules-u",
				affected_skill_group: "perform",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "session"
			},
			neurolinked_presence: {
				name_key: "career_icon_neurolinked_presence-u",
				rule_text_key: "career_icon_neurolinked_presence_rules-u",
				affected_skill: "charm",
				affected_skill_group: "perform",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: ""
			},
			showstopper: {
				name_key: "career_icon_showstopper-u",
				rule_text_key: "career_icon_showstopper_rules-u",
				affected_skill: [ "deception", "intimidate" ],
				affected_skill_group: "perform",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: ""
			},
			strain_buffer: {
				name_key: "career_icon_strain_buffer-u",
				rule_text_key: "career_icon_strain_buffer_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: ""
			},
			crowd_momentum: {
				name_key: "career_icon_crowd_momentum-u",
				rule_text_key: "career_icon_crowd_momentum_rules-u",
				affected_skill: [ "charm", "leadership", "persuade" ],
				prerequisite: "showstopper",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			emotional_contagion: {
				name_key: "career_icon_emotional_contagion-u",
				rule_text_key: "career_icon_emotional_contagion_rules-u",
				prerequisite: "command_the_stage",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "session"
			},
			pulse_of_the_crowd: {
				name_key: "career_icon_pulse_of_the_crowd-u",
				rule_text_key: "career_icon_pulse_of_the_crowd_rules-u",
				affected_skill: "persuade",
				prerequisite: "encore_effect",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "session"
			},
			stagecraft: {
				name_key: "career_icon_stagecraft-u",
				rule_text_key: "career_icon_stagecraft_rules-u",
				affected_skill_group: "perform",
				prerequisite: "command_the_stage",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: ""
			},
			street_stage_discipline: {
				name_key: "career_icon_street_stage_discipline-u",
				rule_text_key: "career_icon_street_stage_discipline_rules-u",
				affected_skill_group: "perform",
				prerequisite: "showstopper",
				tier: 2,
				cost: 10,
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
				cost: 15,
				capstone: false,
				usage_limit: ""
			},
			endurance_conditioning: {
				name_key: "career_icon_endurance_conditioning-u",
				rule_text_key: "career_icon_endurance_conditioning_rules-u",
				prerequisite: "street_stage_discipline",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: ""
			},
			resonant_persona: {
				name_key: "career_icon_resonant_persona-u",
				rule_text_key: "career_icon_resonant_persona_rules-u",
				affected_skill: [ "charm", "persuade" ],
				affected_skill_group: "perform",
				prerequisite: "emotional_contagion",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: ""
			},
			shared_spotlight: {
				name_key: "career_icon_shared_spotlight-u",
				rule_text_key: "career_icon_shared_spotlight_rules-u",
				prerequisite: "pulse_of_the_crowd",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "session"
			},
			voice_of_the_moment: {
				name_key: "career_icon_voice_of_the_moment-u",
				rule_text_key: "career_icon_voice_of_the_moment_rules-u",
				prerequisite: "crowd_momentum",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "session"
			},
			all_eyes_on_me: {
				name_key: "career_icon_all_eyes_on_me-u",
				rule_text_key: "career_icon_all_eyes_on_me_rules-u",
				prerequisite: "voice_of_the_moment",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			burning_signature: {
				name_key: "career_icon_burning_signature-u",
				rule_text_key: "career_icon_burning_signature_rules-u",
				affected_skill_group: "social",
				prerequisite: "resonant_persona",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "session"
			},
			cultural_gravity: {
				name_key: "career_icon_cultural_gravity-u",
				rule_text_key: "career_icon_cultural_gravity_rules-u",
				affected_skill_group: "perform",
				prerequisite: "resonant_persona",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: ""
			},
			encore_of_will: {
				name_key: "career_icon_encore_of_will-u",
				rule_text_key: "career_icon_encore_of_will_rules-u",
				prerequisite: "voice_of_the_moment",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "session"
			},
			iconic_rally: {
				name_key: "career_icon_iconic_rally-u",
				rule_text_key: "career_icon_iconic_rally_rules-u",
				prerequisite: "shared_spotlight",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "session"
			},
			crowdcarver: {
				name_key: "career_icon_crowdcarver-u",
				rule_text_key: "career_icon_crowdcarver_rules-u",
				prerequisite: "encore_of_will",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			echo_beyond_the_feed: {
				name_key: "career_icon_echo_beyond_the_feed-u",
				rule_text_key: "career_icon_echo_beyond_the_feed_rules-u",
				affected_skill: [ "charm", "persuade" ],
				affected_skill_group: "perform",
				prerequisite: "burning_signature",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			living_legend: {
				name_key: "career_icon_living_legend-u",
				rule_text_key: "career_icon_living_legend_rules-u",
				affected_skill: [ "charm", "persuade" ],
				affected_skill_group: "perform",
				prerequisite: "burning_signature",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: ""
			},
			signature_crescendo: {
				name_key: "career_icon_signature_crescendo-u",
				rule_text_key: "career_icon_signature_crescendo_rules-u",
				affected_skill: "persuade",
				affected_skill: "perform",
				prerequisite: "iconic_rally",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_icon_stat_boost-u",
				rule_text_key: "career_icon_stat_boost_rules-u",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: ""
			}
		}
	},
	investigator: {
		name: "Investigator",
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
			investigation: "investigation-u",
			insight: "insight-u",
			perception: "perception-u",
			firearms_handgun: "firearms_handgun-u"
		},
		secondary_skills: {
			arcana: "arcana-u",
			athletics: "athletics-u",
			interrogation: "interrogation-u",
			security: "security-u",
			streetwise: "streetwise-u",
			unarmed: "unarmed-u"
		},
		talents: {
			initial_read: {
				name_key: "career_investigator_initial_read-u",
				rule_text_key: "career_investigator_initial_read_rules-u",
				affected_skill: [ "investigation", "perception" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			methodical_approach: {
				name_key: "career_investigator_methodical_approach-u",
				rule_text_key: "career_investigator_methodical_approach_rules-u",
				affected_skill: [ "investigation", "perception" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: ""
			},
			pressure_point: {
				name_key: "career_investigator_pressure_point-u",
				rule_text_key: "career_investigator_pressure_point_rules-u",
				affected_skill: "insight",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			read_the_room: {
				name_key: "career_investigator_read_the_room-u",
				rule_text_key: "career_investigator_read_the_room_rules-u",
				affected_skill: "insight",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
				usage_limit: "scene"
			},
			situational_awareness: {
				name_key: "career_investigator_situational_awareness-u",
				rule_text_key: "career_investigator_situational_awareness_rules-u",
				affected_skill: "",
				prerequisite: "",
				tier: 1,
				cost: 5,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			deliberate_follow_up: {
				name_key: "career_investigator_deliberate_follow_up-u",
				rule_text_key: "career_investigator_deliberate_follow_up_rules-u",
				prerequisite: "methodical_approach",
				tier: 2,
				cost: 10,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			exploit_tension: {
				name_key: "career_investigator_exploit_tension-u",
				rule_text_key: "career_investigator_exploit_tension_rules-u",
				prerequisite: "pressure_point",
				tier: 2,
				cost: 10,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			focused_subject: {
				name_key: "career_investigator_focused_subject-u",
				rule_text_key: "career_investigator_focused_subject_rules-u",
				prerequisite: "read_the_room",
				tier: 2,
				cost: 10,
				strain: "",
				capstone: false,
				usage_limit: "scene"
			},
			ready_before_it_breaks: {
				name_key: "career_investigator_ready_before_it_breaks-u",
				rule_text_key: "career_investigator_ready_before_it_breaks_rules-u",
				prerequisite: "situational_awareness",
				tier: 2,
				cost: 10,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			resonance_trace: {
				name_key: "career_investigator_resonance_trace-u",
				rule_text_key: "career_investigator_resonance_trace_rules-u",
				affected_skill: "arcana",
				prerequisite: "initial_read",
				tier: 2,
				cost: 10,
				strain: "",
				capstone: false,
				usage_limit: "session"
			},
			anticipated_response: {
				name_key: "career_investigator_anticipated_response-u",
				rule_text_key: "career_investigator_anticipated_response_rules-u",
				prerequisite: "focused_subject",
				tier: 3,
				cost: 15,
				strain: "1",
				capstone: false,
				usage_limit: "scene"
			},
			clean_execution: {
				name_key: "career_investigator_clean_execution-u",
				rule_text_key: "career_investigator_clean_execution_rules-u",
				affected_skill: "investigation",
				prerequisite: "deliberate_follow_up",
				tier: 3,
				cost: 15,
				strain: "",
				capstone: false,
				usage_limit: "scene"
			},
			crack_the_mask: {
				name_key: "career_investigator_crack_the_mask-u",
				rule_text_key: "career_investigator_crack_the_mask_rules-u",
				affected_skill: "insight",
				prerequisite: "exploit_tension",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
				usage_limit: "session"
			},
			poised_under_fire: {
				name_key: "career_investigator_poised_under_fire-u",
				rule_text_key: "career_investigator_poised_under_fire_rules-u",
				prerequisite: "ready_before_it_breaks",
				tier: 3,
				cost: 15,
				strain: "2",
				capstone: false,
				usage_limit: "session"
			},
			reconstructive_pass: {
				name_key: "career_investigator_reconstructive_pass-u",
				rule_text_key: "career_investigator_reconstructive_pass_rules-u",
				affected_skill: "investigation",
				prerequisite: "resonance_trace",
				tier: 3,
				cost: 15,
				strain: "1",
				capstone: false,
				usage_limit: "session"
			},
			anchor_the_moment: {
				name_key: "career_investigator_anchor_the_moment-u",
				rule_text_key: "career_investigator_anchor_the_moment_rules-u",
				affected_skill: [ "investigation", "insight", "perception" ],
				prerequisite: "clean_execution",
				strain: "1",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			broad_spectrum_assessment: {
				name_key: "career_investigator_broad_spectrum_assessment-u",
				rule_text_key: "career_investigator_broad_spectrum_assessment_rules-u",
				affected_skill: [ "investigation", "perception" ],
				prerequisite: "reconstructive_pass",
				strain: "2",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "session"
			},
			casefile_momentum: {
				name_key: "career_investigator_casefile_momentum-u",
				rule_text_key: "career_investigator_casefile_momentum_rules-u",
				affected_skill: [ "investigation", "insight", "perception" ],
				prerequisite: "reconstructive_pass",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			preemptive_positioning: {
				name_key: "career_investigator_preemptive_positioning-u",
				rule_text_key: "career_investigator_preemptive_positioning_rules-u",
				affected_skill: "dodge",
				prerequisite: "poised_under_fire",
				strain: "2",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			veil_discontinuity_sense: {
				name_key: "career_investigator_veil_discontinuity_sense-u",
				rule_text_key: "career_investigator_veil_discontinuity_sense_rules-u",
				affected_skill: [ "arcana", "insight" ],
				prerequisite: "reconstructive_pass",
				tier: 4,
				cost: 20,
				capstone: false,
				usage_limit: "scene"
			},
			absolute_reconstruction: {
				name_key: "career_investigator_absolute_reconstruction-u",
				rule_text_key: "career_investigator_absolute_reconstruction_rules-u",
				affected_skill: "investigation",
				prerequisite: "broad_spectrum_assessment",
				strain: "1d6",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			cold_case_instinct: {
				name_key: "career_investigator_cold_case_instinct-u",
				rule_text_key: "career_investigator_cold_case_instinct_rules-u",
				affected_skill: [ "insight", "interrogation", "investigation" ],
				prerequisite: "veil_discontinuity_sense",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			decisive_leverage: {
				name_key: "career_investigator_decisive_leverage-u",
				rule_text_key: "career_investigator_decisive_leverage_rules-u",
				prerequisite: "crack_the_mask",
				strain: "1d6",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			operational_override: {
				name_key: "career_investigator_operational_override-u",
				rule_text_key: "career_investigator_operational_override_rules-u",
				prerequisite: "anchor_the_moment",
				strain: "1d6",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
			},
			temporal_intuition: {
				name_key: "career_investigator_temporal_intuition-u",
				rule_text_key: "career_investigator_temporal_intuition_rules-u",
				affected_skill: "insight",
				prerequisite: "veil_discontinuity_sense",
				strain: "1d6",
				tier: 5,
				cost: 30,
				capstone: true,
				usage_limit: "session"
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
			firearms_rifle:   "Rifle",
			stealth:          "Stealth"
		},
		secondary_skills: {
			computer_use:       "Computer Use",
			drone_operation:    "Drone Operation",
			insight:            "Insight",
			navigate:           "Navigate",
			firearms_handgun:   "Handgun",
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
				affected_skill: "firearms_rifle",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false
			},
			cold_bore: {
				name_key: "career_marksman_cold_bore-u",
				rule_text_key: "career_marksman_cold_bore_rules-u",
				affected_skill: "firearms_rifle",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			sidearm_bailout: {
				name_key: "career_marksman_sidearm_bailout-u",
				rule_text_key: "career_marksman_sidearm_bailout_rules-u",
				affected_skill: "firearms_handgun",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			spotters_mark: {
				name_key: "career_marksman_spotters_mark-u",
				rule_text_key: "career_marksman_spotters_mark_rules-u",
				affected_skill_group: "combat_ranged",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			steady_breath: {
				name_key: "career_marksman_steady_breath-u",
				rule_text_key: "career_marksman_steady_breath_rules-u",
				affected_skill: "firearms_rifle",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			counter_sniper_drill: {
				name_key: "career_marksman_counter_sniper_drill-u",
				rule_text_key: "career_marksman_counter_sniper_drill_rules-u",
				affected_skill: "perception",
				prerequisite: "spotters_mark",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			kill_chain: {
				name_key: "career_marksman_kill_chain-u",
				rule_text_key: "career_marksman_kill_chain_rules-u",
				prerequisite: "steady_breath",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			recon_uplink: {
				name_key: "career_marksman_recon_uplink-u",
				rule_text_key: "career_marksman_recon_uplink_rules-u",
				affected_skill: "drone_operation",
				prerequisite: "spotters_mark",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			relocation_drill: {
				name_key: "career_marksman_relocation_drill-u",
				rule_text_key: "career_marksman_relocation_drill_rules-u",
				prerequisite: "braced_position",
				tier: 2,
				cost: 10,
				capstone: false
			},
			windcall: {
				name_key: "career_marksman_windcall-u",
				rule_text_key: "career_marksman_windcall_rules-u",
				prerequisite: "steady_breath",
				tier: 2,
				cost: 10,
				capstone: false,
				usage_limit: "scene"
			},
			ghillie_mastery: {
				name_key: "career_marksman_ghillie_mastery-u",
				rule_text_key: "career_marksman_ghillie_mastery_rules-u",
				affected_skill: "stealth",
				prerequisite: "relocation_drill",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: ""
			},
			glint_trap: {
				name_key: "career_marksman_glint_trap-u",
				rule_text_key: "career_marksman_glint_trap_rules-u",
				prerequisite: "counter_sniper_drill",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			lockdown_shot: {
				name_key: "career_marksman_lockdown_shot-u",
				rule_text_key: "career_marksman_lockdown_shot_rules-u",
				affected_skill: "firearms_rifle",
				prerequisite: "kill_chain",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			quiet_reload: {
				name_key: "career_marksman_quiet_reload-u",
				rule_text_key: "career_marksman_quiet_reload_rules-u",
				prerequisite: "recon_uplink",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			through_and_through: {
				name_key: "career_marksman_through_and_through-u",
				rule_text_key: "career_marksman_through_and_through_rules-u",
				prerequisite: "windcall",
				tier: 3,
				cost: 15,
				capstone: false,
				usage_limit: "scene"
			},
			aim_lock: {
				name_key: "career_marksman_aim_lock-u",
				rule_text_key: "career_marksman_aim_lock_rules-u",
				affected_skill: "dodge",
				prerequisite: "quiet_reload",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			counter_sniper_protocol: {
				name_key: "career_marksman_counter_sniper_protocol-u",
				rule_text_key: "career_marksman_counter_sniper_protocol_rules-u",
				prerequisite: "glint_trap",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			one_shot_doctrine: {
				name_key: "career_marksman_one_shot_doctrine-u",
				rule_text_key: "career_marksman_one_shot_doctrine_rules-u",
				prerequisite: "through_and_through",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			range_gate: {
				name_key: "career_marksman_range_gate-u",
				rule_text_key: "career_marksman_range_gate_rules-u",
				prerequisite: "lockdown_shot",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			ricochet_geometry: {
				name_key: "career_marksman_ricochet_geometry-u",
				rule_text_key: "career_marksman_ricochet_geometry_rules-u",
				prerequisite: "ghillie_mastery",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			dead_line: {
				name_key: "career_marksman_dead_line-u",
				rule_text_key: "career_marksman_dead_line_rules-u",
				prerequisite: "ricochet_geometry",
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: "session"
			},
			impossible_shot: {
				name_key: "career_marksman_impossible_shot-u",
				rule_text_key: "career_marksman_impossible_shot_rules-u",
				prerequisite: "one_shot_doctrine",
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: "session"
			},
			kill_confirmed: {
				name_key: "career_marksman_kill_confirmed-u",
				rule_text_key: "career_marksman_kill_confirmed_rules-u",
				prerequisite: "one_shot_doctrine",
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: "session"
			},
			overwatch_architect: {
				name_key: "career_marksman_overwatch_architect-u",
				rule_text_key: "career_marksman_overwatch_architect_rules-u",
				prerequisite: "range_gate",
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: "scene"
			},
			stat_boost: {
				name_key: "career_marksman_stat_boost-u",
				rule_text_key: "career_marksman_stat_boost_rules-u",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: 30,
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
	    firearms_handgun: "Handgun",
	    firearms_smg: "Submachine Guns (SMGs)"
	  },
	  secondary_skills: {
	    athletics: "Athletics",
	    dodge: "Dodge",
	    gunnery: "Gunnery",
	    insight: "Insight",
	    firearms_shotgun: "Shotgun",
	    stealth: "Stealth"
	  },
	  talents: {
		close_quarters_ready: {
		  name_key: "career_operator_close_quarters_ready-u",
		  rule_text_key: "career_operator_close_quarters_ready_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		combat_stride: {
		  name_key: "career_operator_combat_stride-u",
		  rule_text_key: "career_operator_combat_stride_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		cover_discipline: {
		  name_key: "career_operator_cover_discipline-u",
		  rule_text_key: "career_operator_cover_discipline_rules-u",
		  affected_skill: "dodge",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: ""
		},
		quickdraw: {
		  name_key: "career_operator_quickdraw-u",
		  rule_text_key: "career_operator_quickdraw_rules-u",
		  affected_skill: [ "firearms_handgun", "firearms_smg" ],
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		strain_buffer: {
		  name_key: "career_operator_strain_buffer-u",
		  rule_text_key: "career_operator_strain_buffer_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: ""
		},
		controlled_pair: {
		  name_key: "career_operator_controlled_pair-u",
		  rule_text_key: "career_operator_controlled_pair_rules-u",
		  prerequisite: "quickdraw",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		fire_and_fade: {
		  name_key: "career_operator_fire_and_fade-u",
		  rule_text_key: "career_operator_fire_and_fade_rules-u",
		  prerequisite: "combat_stride",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: ""
		},
		quick_reload: {
		  name_key: "career_operator_quick_reload-u",
		  rule_text_key: "career_operator_quick_reload_rules-u",
		  prerequisite: "quickdraw",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		rapid_clearance: {
		  name_key: "career_operator_rapid_clearance-u",
		  rule_text_key: "career_operator_rapid_clearance_rules-u",
		  affected_skill: "dodge",
		  prerequisite: "close_quarters_ready",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		suppression_discipline: {
		  name_key: "career_operator_suppression_discipline-u",
		  rule_text_key: "career_operator_suppression_discipline_rules-u",
		  prerequisite: "cover_discipline",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		deadzone_entry: {
		  name_key: "career_operator_deadzone_entry-u",
		  rule_text_key: "career_operator_deadzone_entry_rules-u",
		  affected_skill: [ "firearms_handgun", "firearms_smg" ],
		  prerequisite: "rapid_clearance",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		endurance_conditioning: {
		  name_key: "career_operator_endurance_conditioning-u",
		  rule_text_key: "career_operator_endurance_conditioning_rules-u",
		  prerequisite: "",
		  prerequisiteAny: { tier: 2, count: 1 },
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: ""
		},
		hard_coded_reflexes: {
		  name_key: "career_operator_hard_coded_reflexes-u",
		  rule_text_key: "career_operator_hard_coded_reflexes_rules-u",
		  prerequisite: "quick_reload",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		saturation_fire: {
		  name_key: "career_operator_saturation_fire-u",
		  rule_text_key: "career_operator_saturation_fire_rules-u",
		  prerequisite: "suppression_discipline",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		sweep_and_reposition: {
		  name_key: "career_operator_sweep_and_reposition-u",
		  rule_text_key: "career_operator_sweep_and_reposition_rules-u",
		  prerequisite: "fire_and_fade",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		combat_presence: {
		  name_key: "career_operator_combat_presence-u",
		  rule_text_key: "career_operator_combat_presence_rules-u",
		  affected_skill: "dodge",
		  affected_stat: "pow",
		  prerequisite: "suppression_discipline",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: ""
		},
		grim_resolve: {
		  name_key: "career_operator_grim_resolve-u",
		  rule_text_key: "career_operator_grim_resolve_rules-u",
		  prerequisite: "endurance_conditioning",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		kinetic_retaliation: {
		  name_key: "career_operator_kinetic_retaliation-u",
		  rule_text_key: "career_operator_kinetic_retaliation_rules-u",
		  affected_skill: [ "firearms_handgun", "firearms_smg" ],
		  prerequisite: "sweep_and_reposition",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		lockstep_execution: {
		  name_key: "career_operator_lockstep_execution-u",
		  rule_text_key: "career_operator_lockstep_execution_rules-u",
		  prerequisite: "fire_and_fade",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		precision_reacquired: {
		  name_key: "career_operator_precision_reacquired-u",
		  rule_text_key: "career_operator_precision_reacquired_rules-u",
		  affected_skill_group: "combat_ranged",
		  prerequisite: "hard_coded_reflexes",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		tactical_apex: {
		  name_key: "career_operator_tactical_apex-u",
		  rule_text_key: "career_operator_tactical_apex_rules-u",
		  prerequisite: "saturation_fire",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		shatterpoint_protocol: {
		  name_key: "career_operator_shatterpoint_protocol-u",
		  rule_text_key: "career_operator_shatterpoint_protocol_rules-u",
		  prerequisite: ["precision_reacquired", "combat_presence"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		tactical_lock_in: {
		  name_key: "career_operator_tactical_lock_in-u",
		  rule_text_key: "career_operator_tactical_lock_in_rules-u",
		  affected_skill_group: "combat_ranged",
		  prerequisite: ["kinetic_retaliation", "combat_presence"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		zeroed_vector_killbox: {
		  name_key: "career_operator_zeroed_vector_killbox-u",
		  rule_text_key: "career_operator_zeroed_vector_killbox_rules-u",
		  affected_skill_group: "combat_ranged",
		  prerequisite: ["tactical_apex", "lockstep_execution"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
		  name_key: "career_operator_stat_boost-u",
		  rule_text_key: "career_operator_stat_boost_rules-u",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: ""
		}
	  }
	},
	pathfinder: {
		name: "Pathfinder",
		career_type: "core",
		career_type_name: "Core"
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
	    firearms_handgun: "Handgun"
	  },
	  talents: {
		combat_rigging: {
		  name_key: "career_pilot_combat_rigging-u",
		  rule_text_key: "career_pilot_combat_rigging_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		remote_override: {
		  name_key: "career_pilot_remote_override-u",
		  rule_text_key: "career_pilot_remote_override_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		strain_buffer: {
		  name_key: "career_pilot_strain_buffer-u",
		  rule_text_key: "career_pilot_strain_buffer_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: ""
		},
		tactical_uplink: {
		  name_key: "career_pilot_tactical_uplink-u",
		  rule_text_key: "career_pilot_tactical_uplink_rules-u",
		  affected_skill: [ "drone_operation", "perception" ],
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		throttle_reflex: {
		  name_key: "career_pilot_throttle_reflex-u",
		  rule_text_key: "career_pilot_throttle_reflex_rules-u",
		  affected_skill: "drone_operation",
		  affected_skill_group: "pilot",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		jet_wash_drift: {
		  name_key: "career_pilot_jet_wash_drift-u",
		  rule_text_key: "career_pilot_jet_wash_drift_rules-u",
		  affected_skill_group: "pilot",
		  prerequisite: "throttle_reflex",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		overdrive_calibration: {
		  name_key: "career_pilot_overdrive_calibration-u",
		  rule_text_key: "career_pilot_overdrive_calibration_rules-u",
		  prerequisite: "strain_buffer",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		priority_channel: {
		  name_key: "career_pilot_priority_channel-u",
		  rule_text_key: "career_pilot_priority_channel_rules-u",
		  affected_skill: [ "drone_operation", "perception" ],
		  affected_skill_group: "pilot",
		  prerequisite: "remote_override",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		rigsight_linkage: {
		  name_key: "career_pilot_rigsight_linkage-u",
		  rule_text_key: "career_pilot_rigsight_linkage_rules-u",
		  affected_skill: "drone_operation",
		  affected_skill_group: "pilot",
		  prerequisite: "combat_rigging",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		suppressive_vectoring: {
		  name_key: "career_pilot_suppressive_vectoring-u",
		  rule_text_key: "career_pilot_suppressive_vectoring_rules-u",
		  prerequisite: "tactical_uplink",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		aerial_pivot_shot: {
		  name_key: "career_pilot_aerial_pivot_shot-u",
   		  rule_text_key: "career_pilot_aerial_pivot_shot_rules-u",
  		  affected_skill: "drone_operation",
		  affected_skill_group: "pilot",
		  prerequisite: "rigsight_linkage",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		deadzone_reflex: {
		  name_key: "career_pilot_deadzone_reflex-u",
		  rule_text_key: "career_pilot_deadzone_reflex_rules-u",
		  prerequisite: "jet_wash_drift",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		drone_lock_protocol: {
		  name_key: "career_pilot_drone_lock_protocol-u",
		  rule_text_key: "career_pilot_drone_lock_protocol_rules-u",
		  prerequisite: "suppressive_vectoring",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		overclock_sync_node: {
		  name_key: "career_pilot_overclock_sync_node-u",
		  rule_text_key: "career_pilot_overclock_sync_node_rules-u",
		  affected_skill: "drone_operation",
		  affected_skill_group: "pilot",
		  prerequisite: "priority_channel",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		thruster_kickout: {
		  name_key: "career_pilot_thruster_kickout-u",
		  rule_text_key: "career_pilot_thruster_kickout_rules-u",
		  prerequisite: "overdrive_calibration",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		combat_integration_mesh: {
		  name_key: "career_pilot_combat_integration_mesh-u",
		  rule_text_key: "career_pilot_combat_integration_mesh_rules-u",
  		  affected_skill: "drone_operation",
		  affected_skill_group: "pilot",
		  prerequisite: "aerial_pivot_shot",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		drop_vector_override: {
		  name_key: "career_pilot_drop_vector_override-u",
		  rule_text_key: "career_pilot_drop_vector_override_rules-u",
  		  affected_skill: "drone_operation",
		  affected_skill_group: "pilot",
		  prerequisite: "deadzone_reflex",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		endurance_conditioning: {
		  name_key: "career_pilot_endurance_conditioning-u",
		  rule_text_key: "career_pilot_endurance_conditioning_rules-u",
		  prerequisite: "thruster_kickout",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: ""
		},
		tethered_assault_ai: {
		  name_key: "career_pilot_tethered_assault_ai-u",
		  rule_text_key: "career_pilot_tethered_assault_ai_rules-u",
  		  affected_skill: "drone_operation",
		  prerequisite: "drone_lock_protocol",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		trace_disruptor_grid: {
		  name_key: "career_pilot_trace_disruptor_grid-u",
		  rule_text_key: "career_pilot_trace_disruptor_grid_rules-u",
		  prerequisite: "overclock_sync_node",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		airspace_denial_vector: {
		  name_key: "career_pilot_airspace_denial_vector-u",
		  rule_text_key: "career_pilot_airspace_denial_vector_rules-u",
		  affected_skill_group: "pilot",
		  prerequisite: "drop_vector_override",
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		burn_vector_gambit: {
		  name_key: "career_pilot_burn_vector_gambit-u",
		  rule_text_key: "career_pilot_burn_vector_gambit_rules-u",
  		  affected_skill: "drone_operation",
		  affected_skill_group: "pilot",
		  prerequisite: ["drop_vector_override", "combat_integration_mesh"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		swarm_logic_override: {
		  name_key: "career_pilot_swarm_logic_override-u",
		  rule_text_key: "career_pilot_swarm_logic_override_rules-u",
  		  affected_skill: "drone_operation",
		  prerequisite: ["tethered_assault_ai", "combat_integration_mesh"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
		  name_key: "career_pilot_stat_boost-u",
		  rule_text_key: "career_pilot_stat_boost_rules-u",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: 30,
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
	    throw: "Thrown Weapon"
	  },
	  talents: {
		cut_and_vanish: {
		  name_key: "career_shadowblade_cut_and_vanish-u",
		  rule_text_key: "career_shadowblade_cut_and_vanish_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		ghost_opener: {
		  name_key: "career_shadowblade_ghost_opener-u",
		  rule_text_key: "career_shadowblade_ghost_opener_rules-u",
		  affected_skill: [ "stealth", "throw" ],
		  affected_skill_group: [ "combat_melee" ],
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		knifes_memory: {
		  name_key: "career_shadowblade_knifes_memory-u",
		  rule_text_key: "career_shadowblade_knifes_memory_rules-u",
  		  affected_skill: "throw",
		  affected_skill_group: "combat_melee",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: ""
		},
		one_among_many: {
		  name_key: "career_shadowblade_one_among_many-u",
		  rule_text_key: "career_shadowblade_one_among_many_rules-u",
		  affected_skill: "stealth",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: ""
		},
		pressure_point: {
		  name_key: "career_shadowblade_pressure_point-u",
		  rule_text_key: "career_shadowblade_pressure_point_rules-u",
  		  affected_skill: "throw",
		  affected_skill_group: "combat_melee",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		strong_arm_form: {
		  name_key: "career_shadowblade_strong_arm_form-u",
		  rule_text_key: "career_shadowblade_strong_arm_form_rules-u",
		  affected_skill: "throw",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: ""
		},
		cloak_in_motion: {
		  name_key: "career_shadowblade_cloak_in_motion-u",
		  rule_text_key: "career_shadowblade_cloak_in_motion_rules-u",
		  affected_skill: "stealth",
		  prerequisite: "one_among_many",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: ""
		},
		knife_logic: {
		  name_key: "career_shadowblade_knife_logic-u",
		  rule_text_key: "career_shadowblade_knife_logic_rules-u",
		  affected_skill: "throw",
		  prerequisite: ["knifes_memory", "strong_arm_form"],
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: ""
		},
		precision_hemorrhage: {
		  name_key: "career_shadowblade_precision_hemorrhage-u",
		  rule_text_key: "career_shadowblade_precision_hemorrhage_rules-u",
		  affected_skill_group: "combat_melee",
		  prerequisite: "pressure_point",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		sightless_kill: {
		  name_key: "career_shadowblade_sightless_kill-u",
		  rule_text_key: "career_shadowblade_sightless_kill_rules-u",
		  prerequisite: ["pressure_point", "ghost_opener"],
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: ""
		},
		throw_move_strike: {
		  name_key: "career_shadowblade_throw_move_strike-u",
		  rule_text_key: "career_shadowblade_throw_move_strike_rules-u",
		  affected_skill: "throw",
		  prerequisite: "strong_arm_form",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		vanish_step: {
		  name_key: "career_shadowblade_vanish_step-u",
		  rule_text_key: "career_shadowblade_vanish_step_rules-u",
		  affected_skill: "stealth",
		  prerequisite: "cut_and_vanish",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		cloaked_predator: {
		  name_key: "career_shadowblade_cloaked_predator-u",
		  rule_text_key: "career_shadowblade_cloaked_predator_rules-u",
		  affected_skill: "stealth",
		  prerequisite: "cloak_in_motion",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: ""
		},
		crimson_rhythm: {
		  name_key: "career_shadowblade_crimson_rhythm-u",
		  rule_text_key: "career_shadowblade_crimson_rhythm_rules-u",
		  prerequisite: "precision_hemorrhage",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: ""
		},
		draw_and_cut: {
		  name_key: "career_shadowblade_draw_and_cut-u",
		  rule_text_key: "career_shadowblade_draw_and_cut_rules-u",
		  affected_skill_group: "combat_melee",
		  prerequisite: "throw_move_strike",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "scene"
		},
		flashing_return: {
		  name_key: "career_shadowblade_flashing_return-u",
		  rule_text_key: "career_shadowblade_flashing_return_rules-u",
		  affected_skill: "throw",
		  prerequisite: "knife_logic",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "scene"
		},
		momentum_slice: {
		  name_key: "career_shadowblade_momentum_slice-u",
		  rule_text_key: "career_shadowblade_momentum_slice_rules-u",
		  affected_skill_group: "throw",
		  prerequisite: ["cloak_in_motion", "throw_move_strike"],
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: ""
		},
		phantom_execution: {
		  name_key: "career_shadowblade_phantom_execution-u",
		  rule_text_key: "career_shadowblade_phantom_execution_rules-u",
  		  affected_skill: [ "stealth", "throw" ],
		  affected_skill_group: "combat_melee",
		  prerequisite: "vanish_step",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		blade_linked_motion: {
		  name_key: "career_shadowblade_blade_linked_motion-u",
		  rule_text_key: "career_shadowblade_blade_linked_motion_rules-u",
		  affected_skill_group: "combat",
		  prerequisite: "momentum_slice",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: ""
		},
		blurred_step: {
		  name_key: "career_shadowblade_blurred_step-u",
		  rule_text_key: "career_shadowblade_blurred_step_rules-u",
		  affected_skill_group: "combat",
		  prerequisite: ["cloak_in_motion", "momentum_slice"],
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "scene"
		},
		crimson_cascade: {
		  name_key: "career_shadowblade_crimson_cascade-u",
		  rule_text_key: "career_shadowblade_crimson_cascade_rules-u",
		  prerequisite: "crimson_rhythm",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: ""
		},
		phantom_reversal: {
		  name_key: "career_shadowblade_phantom_reversal-u",
		  rule_text_key: "career_shadowblade_phantom_reversal_rules-u",
		  affected_skill: "dodge",
		  prerequisite: "momentum_slice",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "scene"
		},
		quiet_terror: {
		  name_key: "career_shadowblade_quiet_terror-u",
		  rule_text_key: "career_shadowblade_quiet_terror_rules-u",
		  affected_skill: "stealth",
		  prerequisite: "phantom_execution",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "scene"
		},
		spinal_cut: {
		  name_key: "career_shadowblade_spinal_cut-u",
		  rule_text_key: "career_shadowblade_spinal_cut_rules-u",
		  prerequisite: ["phantom_execution", "sightless_kill"],
		  affected_skill: "stealth",
		  affected_skill_group: "combat_melee",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "scene"
		},
		final_knife: {
		  name_key: "career_shadowblade_final_knife-u",
		  rule_text_key: "career_shadowblade_final_knife_rules-u",
		  prerequisite: ["knife_logic", "draw_and_cut"],
		  affected_skill: "throw",
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		shatterpoint_strike: {
		  name_key: "career_shadowblade_shatterpoint_strike-u",
		  rule_text_key: "career_shadowblade_shatterpoint_strike_rules-u",
		  affected_skill: "throw",
		  affected_skill_group: "combat_melee",
		  prerequisite: ["spinal_cut", "phantom_reversal"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		unerring_step: {
		  name_key: "career_shadowblade_unerring_step-u",
		  rule_text_key: "career_shadowblade_unerring_step_rules-u",
		  affected_skill: [ "athletics", "stealth" ],
		  affected_stat: "mov",
		  prerequisite: ["blurred_step", "blade_linked_motion"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
		  name_key: "career_shadowblade_stat_boost-u",
		  rule_text_key: "career_shadowblade_stat_boost_rules-u",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: 30,
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
	    firearms_handgun:"Handgun",
	    stealth:         "Stealth"
	  },
	  talents: {
		code_pressure: {
		  name_key: "career_slicer_code_pressure-u",
		  rule_text_key: "career_slicer_code_pressure_rules-u",
		  affected_skill: "intrusion",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		fastjack_ready: {
		  name_key: "career_slicer_fastjack_ready-u",
		  rule_text_key: "career_slicer_fastjack_ready_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		packet_surge: {
		  name_key: "career_slicer_packet_surge-u",
		  rule_text_key: "career_slicer_packet_surge_rules-u",
		  affected_skill: [ "intrusion", "masking" ],
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "session"
		},
		redundancy_stack: {
		  name_key: "career_slicer_redundancy_stack-u",
		  rule_text_key: "career_slicer_redundancy_stack_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "scene"
		},
		signal_ghost: {
		  name_key: "career_slicer_signal_ghost-u",
		  rule_text_key: "career_slicer_signal_ghost_rules-u",
		  affected_skill: "masking",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: "session"
		},
		system_sniffer: {
		  name_key: "career_slicer_system_sniffer-u",
		  rule_text_key: "career_slicer_system_sniffer_rules-u",
		  prerequisite: "",
		  tier: 1,
		  cost: 5,
		  capstone: false,
		  usage_limit: ""
		},
		icebreaker_thread: {
		  name_key: "career_slicer_icebreaker_thread-u",
		  rule_text_key: "career_slicer_icebreaker_thread_rules-u",
		  prerequisite: "code_pressure",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		multi_layer_spoof: {
		  name_key: "career_slicer_multi_layer_spoof-u",
		  rule_text_key: "career_slicer_multi_layer_spoof_rules-u",
		  affected_skill: "masking",
		  prerequisite: "signal_ghost",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		null_pulse_routine: {
		  name_key: "career_slicer_null_pulse_routine-u",
		  rule_text_key: "career_slicer_null_pulse_routine_rules-u",
		  prerequisite: "system_sniffer",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		omnideck_recompiler: {
		  name_key: "career_slicer_omnideck_recompiler-u",
		  rule_text_key: "career_slicer_omnideck_recompiler_rules-u",
		  prerequisite: "fastjack_ready",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		rapid_inject: {
		  name_key: "career_slicer_rapid_inject-u",
		  rule_text_key: "career_slicer_rapid_inject_rules-u",
		  prerequisite: "fastjack_ready",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		reflex_proxy: {
		  name_key: "career_slicer_reflex_proxy-u",
		  rule_text_key: "career_slicer_reflex_proxy_rules-u",
		  affected_skill: "firewall_rating",
		  prerequisite: "redundancy_stack",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "scene"
		},
		trace_evasion_protocol: {
		  name_key: "career_slicer_trace_evasion_protocol-u",
		  rule_text_key: "career_slicer_trace_evasion_protocol_rules-u",
		  affected_skill: "masking",
		  prerequisite: "signal_ghost",
		  tier: 2,
		  cost: 10,
		  capstone: false,
		  usage_limit: "session"
		},
		command_fork: {
		  name_key: "career_slicer_command_fork-u",
		  rule_text_key: "career_slicer_command_fork_rules-u",
		  prerequisite: "omnideck_recompiler",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		emergency_partition: {
		  name_key: "career_slicer_emergency_partition-u",
		  rule_text_key: "career_slicer_emergency_partition_rules-u",
		  affected_skill: "deck_integrity",
		  prerequisite: "reflex_proxy",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		kill_switch_routine: {
		  name_key: "career_slicer_kill_switch_routine-u",
		  rule_text_key: "career_slicer_kill_switch_routine_rules-u",
		  prerequisite: "icebreaker_thread",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		predictive_override: {
		  name_key: "career_slicer_predictive_override-u",
		  rule_text_key: "career_slicer_predictive_override_rules-u",
		  prerequisite: "icebreaker_thread",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: ""
		},
		silent_loop: {
		  name_key: "career_slicer_silent_loop-u",
		  rule_text_key: "career_slicer_silent_loop_rules-u",
		  prerequisite: "multi_layer_spoof",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		trace_spoofer: {
		  name_key: "career_slicer_trace_spoofer-u",
		  rule_text_key: "career_slicer_trace_spoofer_rules-u",
		  prerequisite: "trace_evasion_protocol",
		  tier: 3,
		  cost: 15,
		  capstone: false,
		  usage_limit: "session"
		},
		black_trace_nullifier: {
		  name_key: "career_slicer_black_trace_nullifier-u",
		  rule_text_key: "career_slicer_black_trace_nullifier_rules-u",
		  affected_skill: "masking",
		  prerequisite: "trace_spoofer",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		deck_hardening_suite: {
		  name_key: "career_slicer_deck_hardening_suite-u",
		  rule_text_key: "career_slicer_deck_hardening_suite_rules-u",
		  prerequisite: "emergency_partition",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		expanded_node_logic: {
		  name_key: "career_slicer_expanded_node_logic-u",
		  rule_text_key: "career_slicer_expanded_node_logic_rules-u",
		  prerequisite: "command_fork",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		iceburn_protocol: {
		  name_key: "career_slicer_iceburn_protocol-u",
		  rule_text_key: "career_slicer_iceburn_protocol_rules-u",
		  prerequisite: "kill_switch_routine",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		pulse_cloak_shell: {
		  name_key: "career_slicer_pulse_cloak_shell-u",
		  rule_text_key: "career_slicer_pulse_cloak_shell_rules-u",
		  prerequisite: "silent_loop",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		signal_collapse_routine: {
		  name_key: "career_slicer_signal_collapse_routine-u",
		  rule_text_key: "career_slicer_signal_collapse_routine_rules-u",
		  affected_skill: "masking",
		  prerequisite: "kill_switch_routine",
		  tier: 4,
		  cost: 20,
		  capstone: false,
		  usage_limit: "session"
		},
		arcnet_sovereign: {
		  name_key: "career_slicer_arcnet_sovereign-u",
		  rule_text_key: "career_slicer_arcnet_sovereign_rules-u",
		  affected_skill: "intrusion",
		  prerequisite: ["iceburn_protocol", "signal_collapse_routine"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		digital_ghost_state: {
		  name_key: "career_slicer_digital_ghost_state-u",
		  rule_text_key: "career_slicer_digital_ghost_state_rules-u",
		  prerequisite: ["pulse_cloak_shell", "silent_loop"],
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		failsafe_override_core: {
		  name_key: "career_slicer_failsafe_override_core-u",
		  rule_text_key: "career_slicer_failsafe_override_core_rules-u",
		  affected_skill: "deck_integrity",
		  prerequisite: "deck_hardening_suite",
		  tier: 5,
		  cost: 30,
		  capstone: true,
		  usage_limit: "session"
		},
		stat_boost: {
		  name_key: "career_slicer_stat_boost-u",
		  rule_text_key: "career_slicer_stat_boost_rules-u",
		  prerequisite: "",
		  prerequisiteAny: { tier: 4, count: 1 },
		  tier: 5,
		  cost: 30,
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
				affected_skill_group: "combat_melee",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: ""
			},
			combat_rhythm: {
				name_key: "career_street_ronin_combat_rhythm-u",
				rule_text_key: "career_street_ronin_combat_rhythm_rules-u",
				affected_skill: [ "dodge", "coordination" ],
				affected_skill_group: "combat_melee",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			disciplined_focus: {
				name_key: "career_street_ronin_disciplined_focus-u",
				rule_text_key: "career_street_ronin_disciplined_focus_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			strain_buffer: {
				name_key: "career_street_ronin_strain_buffer-u",
				rule_text_key: "career_street_ronin_strain_buffer_rules-u",
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: ""
			},
			urban_footwork: {
				name_key: "career_street_ronin_urban_footwork-u",
				rule_text_key: "career_street_ronin_urban_footwork_rules-u",
				affected_skill: [ "athletics", "dodge" ],
				prerequisite: "",
				tier: 1,
				cost: 5,
				capstone: false,
			    usage_limit: "scene"
			},
			blade_discipline: {
				name_key: "career_street_ronin_blade_discipline-u",
				rule_text_key: "career_street_ronin_blade_discipline_rules-u",
				affected_skill: [ "dodge" ],
				affected_skill_group: "combat_melee",
				prerequisite: "disciplined_focus",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: ""
			},
			interception_cut: {
				name_key: "career_street_ronin_interception_cut-u",
				rule_text_key: "career_street_ronin_interception_cut_rules-u",
				prerequisite: "combat_rhythm",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "scene"
			},
			posture_breaker: {
				name_key: "career_street_ronin_posture_breaker-u",
				rule_text_key: "career_street_ronin_posture_breaker_rules-u",
				affected_skill_group: "combat_melee",
				prerequisite: "clean_entry",
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "scene"
			},
			reactive_flow: {
				name_key: "career_street_ronin_reactive_flow-u",
				rule_text_key: "career_street_ronin_reactive_flow_rules-u",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "session"
			},
			steel_reflex: {
				name_key: "career_street_ronin_steel_reflex-u",
				rule_text_key: "career_street_ronin_steel_reflex_rules-u",
				prerequisite: "",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: 10,
				capstone: false,
			    usage_limit: "session"
			},
			breath_before_the_cut: {
				name_key: "career_street_ronin_breath_before_the_cut-u",
				rule_text_key: "career_street_ronin_breath_before_the_cut_rules-u",
				affected_skill_group: "combat_melee",
				prerequisite: "blade_discipline",
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "session"
			},
			counterguard_precision: {
				name_key: "career_street_ronin_counterguard_precision-u",
				rule_text_key: "career_street_ronin_counterguard_precision_rules-u",
				affected_skill: "dodge",
				prerequisite: "interception_cut",
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "scene"
			},
			draw_cut: {
				name_key: "career_street_ronin_draw_cut-u",
				rule_text_key: "career_street_ronin_draw_cut_rules-u",
				prerequisite: "posture_breaker",
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "session"
			},
			stillness_in_motion: {
				name_key: "career_street_ronin_stillness_in_motion-u",
				rule_text_key: "career_street_ronin_stillness_in_motion_rules-u",
				affected_skill: "athletics",
				affected_skill_group: "combat_melee",
				prerequisite: "posture_breaker",
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: ""
			},
			the_line_you_do_not_cross: {
				name_key: "career_street_ronin_the_line_you_do_not_cross-u",
				rule_text_key: "career_street_ronin_the_line_you_do_not_cross_rules-u",
				prerequisite: "posture_breaker",
				tier: 3,
				cost: 15,
				capstone: false,
			    usage_limit: "session"
			},
			deflective_form: {
				name_key: "career_street_ronin_deflective_form-u",
				rule_text_key: "career_street_ronin_deflective_form_rules-u",
				affected_skill: "dodge",
				affected_skill_group: "combat_melee",
				prerequisite: "counterguard_precision",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			flow_reversal: {
				name_key: "career_street_ronin_flow_reversal-u",
				rule_text_key: "career_street_ronin_flow_reversal_rules-u",
				prerequisite: "counterguard_precision",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			ghost_step: {
				name_key: "career_street_ronin_ghost_step-u",
				rule_text_key: "career_street_ronin_ghost_step_rules-u",
				affected_skill_group: "comabt_melee",
				prerequisite: "stillness_in_motion",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "scene"
			},
			moment_severed: {
				name_key: "career_street_ronin_moment_severed-u",
				rule_text_key: "career_street_ronin_moment_severed_rules-u",
				affected_skill_group: "combat_melee",
				prerequisite: "breath_before_the_cut",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			no_second_strike: {
				name_key: "career_street_ronin_no_second_strike-u",
				rule_text_key: "career_street_ronin_no_second_strike_rules-u",
				affected_skill_group: "combat_melee",
				prerequisite: "draw_cut",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			steel_anchored_calm: {
				name_key: "career_street_ronin_steel_anchored_calm-u",
				rule_text_key: "career_street_ronin_steel_anchored_calm_rules-u",
				affected_skill: "dodge",
				prerequisite: "the_line_you_do_not_cross",
				tier: 4,
				cost: 20,
				capstone: false,
			    usage_limit: "session"
			},
			duelmasters_claim: {
				name_key: "career_street_ronin_duelmasters_claim-u",
				rule_text_key: "career_street_ronin_duelmasters_claim_rules-u",
				affected_skill: "dodge",
				affected_skill_group: "combat_melee",
				prerequisite: "",
				prerequisiteAll: ["the_line_you_do_not_cross", "moment_severed"],
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: "session"
			},
			final_cut_doctrine: {
				name_key: "career_street_ronin_final_cut_doctrine-u",
				rule_text_key: "career_street_ronin_final_cut_doctrine_rules-u",
				prerequisiteAll: ["flow_reversal", "breath_before_the_cut"],
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: "session"
			},
			ghost_walk_execution: {
				name_key: "career_street_ronin_ghost_walk_execution-u",
				rule_text_key: "career_street_ronin_ghost_walk_execution_rules-u",
				prerequisite: "ghost_step",
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name_key: "career_street_ronin_stat_boost-u",
				rule_text_key: "career_street_ronin_stat_boost_rules-u",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: 30,
				capstone: true,
			    usage_limit: ""
			}
		}
	},
	tactician: {
		name: "Tactician",
		career_type: "core",
		career_type_name: "Core"
	},
	/* Specialist Career */
	arcane_gunslinger: {
	  name: "Arcane Gunslinger",
	  career_type: "specialist",
	  career_type_name: "Specialist",
	  career_cost: 30,
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
					{ type: "skill", key: "firearms_shotgun", min: 60 },
					{ type: "group",
						keys: ["firearms_handgun","firearms_smg","firearms_rifle","firearms_shotgun"],
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
	      prerequisite: "",
	      tier: 1,
	      cost: 10,
	      capstone: false,
	      usage_limit: ""
	    },
	    bound_reload: {
		  name_key: "career_arcane_gunslinger_bound_reload-u",
		  rule_text_key: "career_arcane_gunslinger_bound_reload_rules-u",
	      prerequisite: "",
	      tier: 1,
	      cost: 10,
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    close_orbit: {
		  name_key: "career_arcane_gunslinger_close_orbit-u",
		  rule_text_key: "career_arcane_gunslinger_close_orbit_rules-u",
		  affected_skill: [ "firearms_handgun", "firearms_smg" ],
	      prerequisite: "",
	      tier: 1,
	      cost: 10,
	      capstone: false,
	      usage_limit: ""
	    },
	    rangefold_nudge: {
		  name_key: "career_arcane_gunslinger_rangefold_nudge-u",
		  rule_text_key: "career_arcane_gunslinger_rangefold_nudge_rules-u",
	      prerequisite: "",
	      tier: 1,
	      cost: 10,
	      capstone: false,
	      usage_limit: ""
	    },
		spellmark: {
		  name_key: "career_arcane_gunslinger_spellmark-u",
		  rule_text_key: "career_arcane_gunslinger_spellmark_rules-u",
	      prerequisite: "",
	      tier: 1,
	      cost: 10,
	      capstone: false,
	      usage_limit: ""
	    },
	    corner_cut: {
		  name_key: "career_arcane_gunslinger_corner_cut-u",
		  rule_text_key: "career_arcane_gunslinger_corner_cut_rules-u",
	      prerequisite: "rangefold_nudge",
	      tier: 2,
	      cost: 20,
	      capstone: false,
	      usage_limit: ""
	    },
	    disruptive_round: {
		  name_key: "career_arcane_gunslinger_disruptive_round-u",
		  rule_text_key: "career_arcane_gunslinger_disruptive_round_rules-u",
	      prerequisite: "arcane_cartridge",
	      tier: 2,
	      cost: 20,
	      capstone: false,
	      usage_limit: ""
	    },
	    rangefold_step: {
		  name_key: "career_arcane_gunslinger_rangefold_step-u",
		  rule_text_key: "career_arcane_gunslinger_rangefold_step_rules-u",
	      prerequisite: "rangefold_nudge",
	      tier: 2,
	      cost: 20,
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    flicker_ward: {
		  name_key: "career_arcane_gunslinger_flicker_ward-u",
		  rule_text_key: "career_arcane_gunslinger_flicker_ward_rules-u",
	      prerequisite: "spellmark",
	      tier: 2,
	      cost: 20,
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    ward_piercing_round: {
		  name_key: "career_arcane_gunslinger_ward_piercing_round-u",
		  rule_text_key: "career_arcane_gunslinger_ward_piercing_round_rules-u",
	      prerequisite: "arcane_cartridge",
	      tier: 2,
	      cost: 20,
	      capstone: false,
	      usage_limit: ""
	    },
	    break_contact: {
		  name_key: "career_arcane_gunslinger_break_contact-u",
		  rule_text_key: "career_arcane_gunslinger_break_contact_rules-u",
	      prerequisite: "rangefold_step",
	      tier: 3,
	      cost: 30,
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    chain_shot: {
		  name_key: "career_arcane_gunslinger_chain_shot-u",
		  rule_text_key: "career_arcane_gunslinger_chain_shot_rules-u",
	      prerequisite: ["disruptive_round","ward_piercing_round"], // OR
	      tier: 3,
	      cost: 30,
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    overcharged_cartridge: {
		  name_key: "career_arcane_gunslinger_overcharged_cartridge-u",
		  rule_text_key: "career_arcane_gunslinger_overcharged_cartridge_rules-u",
	      prerequisite: ["disruptive_round","ward_piercing_round"], // OR
	      tier: 3,
	      cost: 30,
	      capstone: false,
	      usage_limit: ""
	    },
	    phase_pin: {
		  name_key: "career_arcane_gunslinger_phase_pin-u",
		  rule_text_key: "career_arcane_gunslinger_phase_pin_rules-u",
	      prerequisite: "ward_piercing_round",
	      tier: 3,
	      cost: 30,
	      capstone: false,
	      usage_limit: ""
	    },
	    short_fold: {
		  name_key: "career_arcane_gunslinger_short_fold-u",
		  rule_text_key: "career_arcane_gunslinger_short_fold_rules-u",
	      prerequisite: "rangefold_step",
	      tier: 3,
	      cost: 30,
	      capstone: false,
	      usage_limit: "scene"   // 1/Scene
	    },
	    anchor_shot: {
		  name_key: "career_arcane_gunslinger_anchor_shot-u",
		  rule_text_key: "career_arcane_gunslinger_anchor_shot_rules-u",
	      prerequisite: "phase_pin",
	      tier: 4,
	      cost: 40,
	      capstone: true,
	      usage_limit: "session"
	    },
	    blackout_salvo: {
		  name_key: "career_arcane_gunslinger_blackout_salvo-u",
		  rule_text_key: "career_arcane_gunslinger_blackout_salvo_rules-u",
	      prerequisite: "chain_shot",
	      tier: 4,
	      cost: 40,
	      capstone: true,
	      usage_limit: "session"
	    },
	    deadmark_beacon: {
		  name_key: "career_arcane_gunslinger_deadmark_beacon-u",
		  rule_text_key: "career_arcane_gunslinger_deadmark_beacon_rules-u",
	      prerequisite: "phase_pin",
	      tier: 4,
	      cost: 40,
	      capstone: true,
	      usage_limit: "session"
	    },
	    severing_round: {
		  name_key: "career_arcane_gunslinger_severing_round-u",
		  rule_text_key: "career_arcane_gunslinger_severing_round_rules-u",
	      prerequisite: "overcharged_cartridge",
	      tier: 4,
	      cost: 40,
	      capstone: true,
	      usage_limit: "session"
	    },
	    spell_conduit_round: {
		  name_key: "career_arcane_gunslinger_spell_conduit_round-u",
		 rule_text_key: "career_arcane_gunslinger_spell_conduit_round_rules-u",
	      prerequisite: "short_fold",
	      tier: 4,
	      cost: 40,
	      capstone: true,
	      usage_limit: "session"
	    }
	  }
	},
	hexbreaker: {
	  name: "Hexbreaker",
	  career_type: "specialist",
	  career_type_name: "Specialist",
	  career_cost: 30,
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
					{ type: "capstone", keys: [ "shadowblade", "street_ronin" ] },
					{ type: "capstone", career_type: "arcane" }
				]
		    },
		    {
				any: [
					{ type: "skill", key: "melee_weapons", min: 60 },
					{ type: "skill", key: "unarmed", min: 60 },
					{
						type: "group",
						keys: [ "melee_weapons", "unarmed" ],
						count: 2,
						min: 50
					}
				]
			},
			{ type: "skill", key: "arcana", min: 40 }
		  ]
		},
	  talents: {
	  	close_in_guard: {
	  		name_key: "career_hexbreaker_close_in_guard-u",
	  		rule_text_key: "career_hexbreaker_close_in_guard_rules-u",
	  		prerequisite: "",
	  		tier: 1,
	  		cost: 10,
	  		capstone: false,
			strain: "1",
	  		usage_limit: "scene"
	  	},
	  	disruptive_grip: {
	  		name_key: "career_hexbreaker_disruptive_grip-u",
	  		rule_text_key: "career_hexbreaker_disruptive_grip_rules-u",
	  		prerequisite: "",
	  		tier: 1,
	  		cost: 10,
	  		capstone: false,
			strain: "1",
	  		usage_limit: "scene"
	  	},
	  	fracture_edge: {
	  		name_key: "career_hexbreaker_fracture_edge-u",
	  		rule_text_key: "career_hexbreaker_fracture_edge_rules-u",
	  		prerequisite: "",
	  		tier: 1,
	  		cost: 10,
	  		capstone: false,
			strain: "1",
	  		usage_limit: ""
	  	},
	  	lockstep_advance: {
	  		name_key: "career_hexbreaker_lockstep_advance-u",
	  		rule_text_key: "career_hexbreaker_lockstep_advance_rules-u",
	  		prerequisite: "",
	  		tier: 1,
	  		cost: 10,
	  		capstone: false,
			strain: "1",
	  		usage_limit: ""
	  	},
	  	press_the_fault: {
	  		name_key: "career_hexbreaker_press_the_fault-u",
	  		rule_text_key: "career_hexbreaker_press_the_fault_rules-u",
	  		prerequisite: "",
	  		tier: 1,
	  		cost: 10,
	  		capstone: false,
			strain: "1",
	  		usage_limit: "scene"
	  	},
	  	crack_the_timing: {
	  		name_key: "career_hexbreaker_crack_the_timing-u",
	  		rule_text_key: "career_hexbreaker_crack_the_timing_rules-u",
	  		prerequisite: "press_the_fault",
	  		tier: 2,
	  		cost: 20,
	  		strain: "2",
	  		capstone: false,
	  		usage_limit: "scene"
	  	},
	  	punishing_focus: {
	  		name_key: "career_hexbreaker_punishing_focus-u",
	  		rule_text_key: "career_hexbreaker_punishing_focus_rules-u",
	  		prerequisite: "lockstep_advance",
	  		tier: 2,
	  		cost: 20,
	  		capstone: false,
	  		usage_limit: ""
	  	},
	  	rend_the_ward: {
	  		name_key: "career_hexbreaker_rend_the_ward-u",
	  		rule_text_key: "career_hexbreaker_rend_the_ward_rules-u",
	  		prerequisite: "fracture_edge",
	  		tier: 2,
	  		cost: 20,
	  		strain: "2",
	  		capstone: false,
	  		usage_limit: ""
	  	},
	  	stay_the_blade: {
	  		name_key: "career_hexbreaker_stay_the_blade-u",
	  		rule_text_key: "career_hexbreaker_stay_the_blade_rules-u",
	  		prerequisite: "close_in_guard",
	  		tier: 2,
	  		cost: 20,
	  		strain: "2",
	  		capstone: false,
	  		usage_limit: "scene"
	  	},
	  	turn_the_guard: {
	  		name_key: "career_hexbreaker_turn_the_guard-u",
	  		rule_text_key: "career_hexbreaker_turn_the_guard_rules-u",
	  		prerequisite: "disruptive_grip",
	  		tier: 2,
	  		cost: 20,
	  		strain: "1",
	  		capstone: false,
	  		usage_limit: "scene"
	  	},
	  	breakers_reversal: {
	  		name_key: "career_hexbreaker_breakers_reversal-u",
	  		rule_text_key: "career_hexbreaker_breakers_reversal_rules-u",
	  		prerequisite: "stay_the_blade",
	  		tier: 3,
	  		cost: 30,
	  		strain: "1d4",
	  		capstone: false,
	  		usage_limit: "scene"
	  	},
	  	claim_the_exchange: {
	  		name_key: "career_hexbreaker_claim_the_exchange-u",
	  		rule_text_key: "career_hexbreaker_claim_the_exchange_rules-u",
	  		prerequisite: "turn_the_guard",
	  		tier: 3,
	  		cost: 30,
	  		strain: "1",
	  		capstone: false,
	  		usage_limit: ""
	  	},
	  	faultline_strike: {
	  		name_key: "career_hexbreaker_faultline_strike-u",
	  		rule_text_key: "career_hexbreaker_faultline_strike_rules-u",
	  		prerequisite: "crack_the_timing",
	  		tier: 3,
	  		cost: 30,
	  		strain: "1d4",
	  		capstone: false,
	  		usage_limit: "scene"
	  	},
	  	marked_by_contact: {
	  		name_key: "career_hexbreaker_marked_by_contact-u",
	  		rule_text_key: "career_hexbreaker_marked_by_contact_rules-u",
	  		prerequisite: "punishing_focus",
	  		tier: 3,
	  		cost: 30,
	  		strain: "2",
	  		capstone: false,
	  		usage_limit: "scene"
	  	},
	  	shatter_the_seal: {
	  		name_key: "career_hexbreaker_shatter_the_seal-u",
	  		rule_text_key: "career_hexbreaker_shatter_the_seal_rules-u",
	  		prerequisite: "rend_the_ward",
	  		tier: 3,
	  		cost: 30,
	  		strain: "1d4",
	  		capstone: false,
	  		usage_limit: ""
	  	},
	  	break_the_pattern: {
	  		name_key: "career_hexbreaker_break_the_pattern-u",
	  		rule_text_key: "career_hexbreaker_break_the_pattern_rules-u",
	  		prerequisite: "faultline_strike",
	  		tier: 4,
	  		cost: 40,
	  		strain: "1d6 + 1d4",
	  		capstone: true,
	  		usage_limit: "session"
	  	},
	  	edge_of_attrition: {
	  		name_key: "career_hexbreaker_edge_of_attrition-u",
	  		rule_text_key: "career_hexbreaker_edge_of_attrition_rules-u",
	  		prerequisite: "claim_the_exchange",
	  		tier: 4,
	  		cost: 40,
	  		strain: "1d6, 1/round",
	  		capstone: true,
	  		usage_limit: "session"
	  	},
	  	final_rend: {
	  		name_key: "career_hexbreaker_final_rend-u",
	  		rule_text_key: "career_hexbreaker_final_rend_rules-u",
	  		prerequisite: "shatter_the_seal",
	  		tier: 4,
	  		cost: 40,
	  		strain: "1d6 + 1d4",
	  		capstone: true,
	  		usage_limit: "session"
	  	},
	  	oath_of_the_breach: {
	  		name_key: "career_hexbreaker_oath_of_the_breach-u",
	  		rule_text_key: "career_hexbreaker_oath_of_the_breach_rules-u",
	  		prerequisite: "marked_by_contact",
	  		tier: 4,
	  		cost: 40,
	  		strain: "1d6 + 1d4",
	  		capstone: true,
	  		usage_limit: "session"
	  	},
	  	stand_the_line: {
	  		name_key: "career_hexbreaker_stand_the_line-u",
	  		rule_text_key: "career_hexbreaker_stand_the_line_rules-u",
	  		prerequisite: "marked_by_contact",
	  		tier: 4,
	  		cost: 40,
	  		strain: "1d6, 1/round",
	  		capstone: true,
	  		usage_limit: "session"
	  	}
	  },
	},
	soul_forger: {
	  name: "Soul Forger",
	  career_type: "specialist",
	  career_type_name: "Specialist",
	  career_cost: 30,
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
					{ type: "skill", key: "arcanotech", min: 60 },
					{ type: "skill", key: "mechanics", min: 60 },
					{ type: "skill", key: "engineering", min: 60 },
					{ type: "skill", key: "arcana",     min: 60 },
					{
						type: "group",
						keys: ["arcanotech", "mechanics", "engineering", "arcana"],
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
	        prerequisite: "",
	        tier: 1,
	        cost: 10,
	        capstone: false,
	        usage_limit: ""
	    },
	    seat_the_spirit: {
	        name_key: "career_soul_forger_seat_the_spirit-u",
	        rule_text_key: "career_soul_forger_seat_the_spirit_rules-u",
	        prerequisite: "",
	        tier: 1,
	        cost: 10,
	        capstone: false,
	        usage_limit: ""
	    },
	    spirit_patch: {
	        name_key: "career_soul_forger_spirit_patch-u",
	        rule_text_key: "career_soul_forger_spirit_patch_rules-u",
	        prerequisite: "",
	        tier: 1,
	        cost: 10,
	        capstone: false,
	        usage_limit: ""
	    },
	    spirit_static: {
	        name_key: "career_soul_forger_spirit_static-u",
	        rule_text_key: "career_soul_forger_spirit_static_rules-u",
	        prerequisite: "",
	        tier: 1,
	        cost: 10,
	        capstone: false,
	        usage_limit: ""
	    },
	    workshop_wisp: {
	        name_key: "career_soul_forger_workshop_wisp-u",
	        rule_text_key: "career_soul_forger_workshop_wisp_rules-u",
			affected_skill: [ "arcanotech", "electronics", "mechanics" ],
	        prerequisite: "",
	        tier: 1,
	        cost: 10,
	        capstone: false,
	        usage_limit: ""
	    },
	    chassis_ride: {
	        name_key: "career_soul_forger_chassis_ride-u",
	        rule_text_key: "career_soul_forger_chassis_ride_rules-u",
	        prerequisite: "seat_the_spirit",
	        tier: 2,
	        cost: 20,
	        capstone: false,
	        usage_limit: ""
	    },
	    counteremp_veil: {
	        name_key: "career_soul_forger_counteremp_veil-u",
	        rule_text_key: "career_soul_forger_counteremp_veil_rules-u",
	        prerequisite: "lockout_sigil",
	        tier: 2,
	        cost: 20,
	        capstone: false,
	        usage_limit: ""
	    },
	    infused_shielding: {
	        name_key: "career_soul_forger_infused_shielding-u",
	        rule_text_key: "career_soul_forger_infused_shielding_rules-u",
	        prerequisite: "spirit_patch",
	        tier: 2,
	        cost: 20,
	        capstone: false,
	        usage_limit: ""
	    },
	    overclock_lattice: {
	        name_key: "career_soul_forger_overclock_lattice-u",
	        rule_text_key: "career_soul_forger_overclock_lattice_rules-u",
	        prerequisite: [ "seat_the_spirit", "lockout_sigil" ],
	        tier: 2,
	        cost: 20,
	        capstone: false,
	        usage_limit: ""
	    },
	    soulstitch: {
	        name_key: "career_soul_forger_soulstitch-u",
	        rule_text_key: "career_soul_forger_soulstitch_rules-u",
	        prerequisite: "spirit_patch",
	        tier: 2,
	        cost: 20,
	        capstone: false,
	        usage_limit: ""
	    },
	    battlefield_reclamation: {
	        name_key: "career_soul_forger_battlefield_reclamation-u",
	        rule_text_key: "career_soul_forger_battlefield_reclamation_rules-u",
	        prerequisite: "soulstitch",
	        tier: 3,
	        cost: 30,
	        capstone: false,
	        usage_limit: ""
	    },
	    hand_of_the_forge: {
	        name_key: "career_soul_forger_hand_of_the_forge-u",
	        description: "Type: Reaction • Cost: 1d4 Strain • When a spirit-infused ally within Short range takes damage, reduce the damage by 1d6. Once per Round.",
	        prerequisite: "soulstitch",
	        tier: 3,
	        cost: 30,
	        capstone: false,
	        usage_limit: ""
	    },
	    helmgeist_protocol: {
	        name_key: "career_soul_forger_helmgeist_protocol-u",
	        rule_text_key: "career_soul_forger_helmgeist_protocol_rules-u",
			affected_skill: "gunnery",
			affected_skill_group: "pilot",
	        prerequisite: "chassis_ride",
	        tier: 3,
	        cost: 30,
	        capstone: false,
	        usage_limit: ""
	    },
	    spirit_lattice_field: {
	        name_key: "career_soul_forger_spirit_lattice_field-u",
	        rule_text_key: "career_soul_forger_spirit_lattice_field_rules-u",
	        prerequisite: "overclock_lattice",
	        tier: 3,
	        cost: 30,
	        capstone: false,
	        usage_limit: ""
	    },
	    spitework_rewrite: {
	        name_key: "career_soul_forger_spitework_rewrite-u",
	        rule_text_key: "career_soul_forger_spitework_rewrite_rules-u",
	        prerequisite: "lockout_sigil",
	        tier: 3,
	        cost: 30,
	        capstone: false,
	        usage_limit: ""
	    },
	    bound_warchassis: {
	        name_key: "career_soul_forger_bound_warchassis-u",
	        rule_text_key: "career_soul_forger_bound_warchassis_rules-u",
	        prerequisite: "spirit_lattice_field",
	        tier: 4,
	        cost: 40,
	        capstone: true,
	        usage_limit: ""
	    },
	    cathedral_of_scrap: {
	        name_key: "career_soul_forger_cathedral_of_scrap-u",
	        rule_text_key: "career_soul_forger_cathedral_of_scrap_rules-u",
	        prerequisite: "battlefield_reclamation",
	        tier: 4,
	        cost: 40,
	        capstone: true,
	        usage_limit: "session"
	    },
	    circuit_apotheosis: {
	        name_key: "career_soul_forger_circuit_apotheosis-u",
	        rule_text_key: "career_soul_forger_circuit_apotheosis_rules-u",
	        prerequisite: "helmgeist_protocol",
	        tier: 4,
	        cost: 40,
	        capstone: true,
	        usage_limit: "session"
	    },
	    city_weave_circuit: {
	        name_key: "career_soul_forger_city_weave_circuit-u",
	        rule_text_key: "career_soul_forger_city_weave_circuit_rules-u",
	        prerequisite: "helmgeist_protocol",
	        tier: 4,
	        cost: 40,
	        capstone: true,
	        usage_limit: "session"
	    },
	    nullwave_bloom: {
	        name_key: "career_soul_forger_nullwave_bloom-u",
	        rule_text_key: "career_soul_forger_nullwave_bloom_rules-u",
	        prerequisite: "spirit_lattice_field",
	        tier: 4,
	        cost: 40,
	        capstone: true,
	        usage_limit: "session"
	    }
	  }
	}
};
