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
