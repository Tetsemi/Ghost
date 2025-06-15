const careerDataMap = {
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
            signal_sync: {
                name: "Signal Sync",
                description: "Once per scene, gain a bonus die on a Magic (Technomancy) or Slicing check when interfacing with a digital system, drone, or magitech device. If successful, reduce the spell’s Strain cost by one die step.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            veil_thread_tap: {
                name: "Veil Thread Tap",
                description: "Once per scene, detect nearby digital activity or magitech signatures within short range — even if encrypted or cloaked. Gain a bonus die to your next Perception or Slicing check related to that system.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            hardlight_override: {
                name: "Hardlight Override",
                description: "Once per scene, spend 2 Strain to project a hardlight sigil into a nearby device (e.g., door, turret, drone). You may trigger a basic function (open, shut down, disengage) without a skill check.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            recursive_pulse: {
                name: "Recursive Pulse",
                description: "Once per scene, after a failed attempt to access or affect a device, you may reroll with a penalty die. If successful, regain 1 Strain.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: "scene"
            },
            strain_buffer: {
                name: "Strain Buffer",
                description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false,
                usage_limit: ""
            },
            pulse_hijack: {
                name: "Pulse Hijack",
                description: "Spend 2 Strain to take control of a simple device or automated system (e.g., surveillance cam, basic drone, access node) for one round.",
                prerequisite: "hardlight_override",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: ""
            },
            code_injection: {
                name: "Code Injection",
                description: "Once per scene, after a successful Technomancy spell or Slicing check, implant a command packet that allows you to issue one additional command later in the same scene without a new check.",
                prerequisite: "signal_sync",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "scene"
            },
            scramble_protocol: {
                name: "Scramble Protocol",
                description: "Spend 2 Strain to disrupt a single active drone or magitech system for one round. It suffers a penalty die on all tech-based or automated actions.",
                prerequisite: "recursive_pulse",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: ""
            },
            arc_sigil_link: {
                name: "Arc-Sigil Link",
                description: "You may roll Magic (Technomancy) in place of Electronics or Computer Use when interacting with magitech systems. This does not apply to physical repairs or mechanical breakdowns.",
                prerequisite: "veil_thread_tap",
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: ""
            },
            clean_loop_feedback: {
                name: "Clean Loop Feedback",
                description: "Once per session, after successfully casting a Technomancy spell on a device, regain 1d4 Strain.",
                prerequisite: "",
                prerequisiteAny: { tier: 1, count: 1 },
                tier: 2,
                cost: "10",
                capstone: false,
                usage_limit: "session"
            },
            magelock_cascade: {
                name: "Magelock Cascade",
                description: "Once per session, when you successfully disable or control a device, you may immediately target a second device within short range. The second target rolls resistance with a penalty die.",
                prerequisite: "pulse_hijack",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "session"
            },
            null_loop_echo: {
                name: "Null Loop Echo",
                description: "Spend 2 Strain to create a disruption field around you (short range) for one round. All drones, magitech, and automated systems inside suffer a penalty die on targeting, reactions, or interfacing.",
                prerequisite: "scramble_protocol",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: ""
            },
            arc_thread_override: {
                name: "Arc-Thread Override",
                description: "Once per scene, when a hostile device activates, you may cast a Technomancy spell as a reaction. The spell must affect technology (jam, crash, reroute, etc.).",
                prerequisite: "code_injection",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },
            subroutine_leash: {
                name: "Subroutine Leash",
                description: "You may take control of a single drone you have accessed. It acts as an allied NPC on your turn for the duration of the spell or control effect.",
                prerequisite: "arc_sigil_link",
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: ""
            },
            synthetic_harmony: {
                name: "Synthetic Harmony",
                description: "Once per scene, after casting a Technomancy spell or succeeding a Slicing check, gain a bonus die on your next spellcasting or social skill check.",
                prerequisite: "",
                prerequisiteAny: { tier: 2, count: 1 },
                tier: 3,
                cost: "15",
                capstone: false,
                usage_limit: "scene"
            },
            command_injection: {
                name: "Command Injection",
                description: "Once per scene, after casting a Technomancy spell or issuing a drone command, you may issue two distinct commands instead of one.",
                prerequisite: "subroutine_leash",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },
            crash_field: {
                name: "Crash Field",
                description: "Once per session, create a crash zone (medium range) for one round. All affected drones or magitech systems must succeed a POW or INT roll or become readonly until the start of your next turn.",
                prerequisite: "null_loop_echo",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "session"
            },
            live_patch_redirect: {
                name: "Live Patch Redirect",
                description: "Once per session, when an ally is targeted by a spell, ability, or tech effect, you may spend 2 Strain to redirect the effect to yourself or a controlled construct.",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "session"
            },
            backdoor_ritual: {
                name: "Backdoor Ritual",
                description: "Once per scene, you may embed a persistent arcane anchor in a system you access. If the system is triggered again this scene, you may act on it immediately without a new roll. Only one Backdoor may be active at a time.",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: "20",
                capstone: false,
                usage_limit: "scene"
            },
            veil_reactor_stabilizer: {
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
                name: "Overcode Detonation",
                description: "Once per session, trigger a system cascade affecting any magitech network or drone field within medium range. All affected systems must roll POW or INT or suffer shutdown, 1d6 damage, or go berserk (your choice per target). Cybernetic limbs and smart weapons tied to living users are unaffected.",
                prerequisite: ["magelock_cascade", "crash_field"],
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            signal_possession: {
                name: "Signal Possession",
                description: "Once per session, take full control of a drone, turret, or magitech construct within medium range for the rest of the scene. If the target is destroyed or disconnected, you may transfer control to another valid device once.",
                prerequisite: ["subroutine_leash", "command_injection"],
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            reality_patch: {
                name: "Reality Patch",
                description: "Once per session, cast a Technomancy spell with a casting time of 1 action or less as a reaction to a failed defense, corrupted system, or Veil event. The spell automatically succeeds but costs double Strain.",
                prerequisite: ["live_patch_redirect", "veil_reactor_stabilizer"],
                tier: 5,
                cost: "30",
                capstone: true,
                usage_limit: "session"
            },
            stat_boost: {
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
	combat_medic: {
		name: "Combat Medic",
		career_type: "support",
		career_type_name: "Support",
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
				name: "Field Stabilizer",
				description: "Once per scene, gain a bonus die when using Medicine or First Aid on an unconscious or dying ally.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			pain_doesnt_matter: {
				name: "Pain Doesn’t Matter",
				description: "Once per scene, make a Medicine check to restore consciousness to an ally who is unconscious or who failed a CON check after suffering a major wound.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			trauma_team_reflexes: {
				name: "Trauma Team Reflexes",
				description: "Once per scene, you may trade Initiative order with an ally. Both characters must not have acted yet.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			injector_harness: {
				name: "Injector Harness",
				description: "Once per scene, you may perform a First Aid, stim, or injector-based action as a maneuver instead of an action.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			vital_scan_overlay: {
				name: "Vital Scan Overlay",
				description: "Once per scene, gain a bonus die on a First Aid or Medicine roll if the target is below half HP. You may also detect hidden conditions (e.g., internal bleeding, toxin exposure) with a successful check.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			pressure_seal: {
				name: "Pressure Seal",
				description: "Once per session, you may automatically stabilize a bleeding-out ally below 0 HP. No roll required.",
				prerequisite: "field_stabilizer",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			painkiller_protocol: {
				name: "Painkiller Protocol",
				description: "After healing an ally, they gain a bonus die on their next action during the same scene.",
				prerequisite: "injector_harness",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			stay_with_me: {
				name: "Stay With Me!",
				description: "Once per scene, when an ally within engaged or short-range drops to 0 HP, you may immediately make a First Aid check as a reaction to stabilize them.",
				prerequisite: "field_stabilizer",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			tactical_redeployment: {
				name: "Tactical Redeployment",
				description: "As a reaction, when an ally within medium range takes damage, you may move one range band closer toward them.",
				prerequisite: "trauma_team_reflexes",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			medical_override: {
				name: "Medical Override",
				description: "Once per scene, spend 2 Strain to double the HP healed by your next First Aid or Medicine check.",
				prerequisite: [ "pain_doesnt_matter" ,"injector_harness"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			surgical_clarity: {
				name: "Surgical Clarity",
				description: "Once per session, reroll a failed Medicine or First Aid check with a bonus die. If successful, the action takes half the usual time.",
				prerequisite: [ "stay_with_me" ,"pressure_seal"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			combat_revive: {
				name: "Combat Revive",
				description: "Once per session, you may revive a stabilized ally within engaged range, restoring up to half their HP. Requires a full action and physical contact.",
				prerequisite: "medical_override",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			quickdraw_injector: {
				name: "Quickdraw Injector",
				description: "Once per scene, you may use a stim or injector as a reaction on yourself or an ally in engaged range.",
				prerequisite: [ "injector_harness", "painkiller_protocol"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},
			overwatch_healer: {
				name: "Overwatch Healer",
				description: "While providing overwatch for an injured ally, gain a bonus die on your next attack against an enemy who attacks that ally.",
				prerequisite: "tactical_redeployment",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			veil_immunologist: {
				name: "Veil Immunologist",
				description: "Once per session, make a Medicine check to reduce Veil Corruption in an ally who suffered corruption this scene. You also gain a bonus die on Medicine checks against arcane or Veil-based afflictions.",
				prerequisite: ["pressure_seal", "vital_scan_overlay"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			endurance_conditioning: {
				name: "Endurance Conditioning",
				description: "Gain +2 maximum HP. This bonus is permanent.",
				prerequisite: [ "surgical_clarity" ,"combat_revive" ],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			emergency_triage_net: {
				name: "Emergency Triage Net",
				description: "Once per session, select up to two allies within short range. You may divide the result of one successful Medicine check between them (each must receive at least 1 HP).",
				prerequisite: "overwatch_healer",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			ghost_of_the_er: {
				name: "Ghost of the ER",
				description: "Once per session, you may move through a danger zone to reach an injured ally. You do not provoke Overwatch attacks or reactions, and enemies suffer a penalty die when targeting you until your next turn.",
				prerequisite: "overwatch_healer",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			field_expeditor: {
				name: "Field Expeditor",
				description: "Once per session, you may perform a First Aid or Medicine check as a free action instead of a full action.",
				prerequisite: "combat_revive",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			reactive_trauma_surge: {
				name: "Reactive Trauma Surge",
				description: "Once per scene, when an ally within short range drops below half HP, you may move to them and perform a First Aid check as a free action. If successful, they gain a bonus die on their next action.",
				prerequisite: "surgical_clarity",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			no_one_dies_today: {
				name: "No One Dies Today",
				description: "Once per session, when an ally you can see would die from an attack or effect, they instead remain alive at 1 HP and may act normally for the remainder of the scene.",
				prerequisite: "emergency_triage_net",
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			miracle_protocol: {
				name: "Miracle Protocol",
				description: "Once per session, make a Medicine check that automatically succeeds. On success, you may also remove one condition or one level of Veil Corruption from the target.",
				prerequisite: ["field_expeditor" ,"ghost_of_the_er"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisite: "",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			},
			adrenal_shield_matrix: {
				name: "Adrenal Shield Matrix",
				description: "Once per session, when healing an ally, they also gain 1d6 temporary HP that lasts for the remainder of the scene.",
				prerequisite: "endurance_conditioning",
				tier: 5,
				cost: "30",
				capstone: true,
				usage_limit: "session"
			}
		}
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
			impersonation: "Performance (Impersonation)",
			interrogation: "Interrogation"
		},
		talents: {
			suggestive_echo: {
				name: "Suggestive Echo",
				description: "Once per scene, when casting an Enchantment spell that influences thoughts or emotions, gain a bonus die on the casting roll. If the target resists or is unaffected, they suffer a penalty die on their next Insight or social-based roll.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			thread_of_doubt: {
				name: "Thread of Doubt",
				description: "Once per scene, when interacting with an NPC, you may subtly seed hesitation. Apply a penalty die to their next opposed roll against you (social, combat, or magical).",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			veil_of_intent: {
				name: "Veil of Intent",
				description: "Once per scene, you may substitute your Insight skill for Charm or Persuade when influencing a target. You’re not convincing them — you’re reading them and pressing the right internal button.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			mental_static: {
				name: "Mental Static",
				description: "Once per scene, spend 2 Strain to scramble a target’s concentration. For the rest of the round, they suffer a penalty die to any attempt to cast or maintain a spell. May be used as an action or reaction.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			strain_buffer: {
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			cognitive_rewire: {
				name: "Cognitive Rewire",
				description: "Once per scene, reroll a failed Enchantment spell that targets a single humanoid. If the reroll succeeds, reduce the spell’s Strain cost by one die step.",
				prerequisite: "suggestive_echo",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			prey_on_instinct: {
				name: "Prey on Instinct",
				description: "Once per scene, when engaging a target in a social contest or interrogation, you may force them to defend using unmodified POW instead of their usual social skill.",
				prerequisite: "thread_of_doubt",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			emotional_override: {
				name: "Emotional Override",
				description: "Spend 2 Strain to impose a temporary emotional state (fear, calm, guilt, anger, etc.) on a target within short range. Lasts for one round. If the state is disrupted, the target suffers a penalty die on their next action.",
				prerequisite: "veil_of_intent",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			memory_spike: {
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
				name: "Neural Misdirection",
				description: "When casting an Enchantment spell in combat, you may spend 1 additional Strain to render the spell unnoticeable to all observers except the target.",
				prerequisite: "mental_static",
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			echo_implantation: {
				name: "Echo Implantation",
				description: "Once per session, after casting a successful Enchantment spell, you may embed a mental echo. Spend 1 Strain later in the same scene to re-trigger the emotional effect for one round.",
				prerequisite: "cognitive_rewire",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			false_memory: {
				name: "False Memory",
				description: "Once per session, implant a short false memory in a target during conversation. The target must fail an Insight or POW roll to notice. Cannot override major truths.",
				prerequisite: "memory_spike",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			veil_laced_words: {
				name: "Veil-Laced Words",
				description: "For the duration of a social encounter, spend 1 Strain once per turn to gain a bonus die on a Charm, Deception, or Persuade roll while maintaining emotional pressure.",
				prerequisite: "prey_on_instinct",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			neural_whiplash: {
				name: "Neural Whiplash",
				description: "Once per session, when a target resists or breaks free of your spell, they suffer 1d4 Strain and lose their next Reaction or Maneuver.",
				prerequisite: "neural_misdirection",
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			hollow_gaze: {
				name: "Hollow Gaze",
				description: "Once per session, lock eyes with a single target. For one round, they suffer a penalty die on any action that opposes or harms you, unless they succeed a POW roll.",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			resonant_persona: {
				name: "Resonant Persona",
				description: "Once per session, choose a target who previously failed a roll against you. For the rest of the scene, gain a bonus die on all attempts to influence or mislead them.",
				prerequisite: ["veil_laced_words", "echo_implantation"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			synaptic_lag: {
				name: "Synaptic Lag",
				description: "Once per scene, spend 2 Strain to disrupt a target’s rhythm. Until the start of your next turn, they lose their next action (they may still take a Maneuver and Reaction). May be used as an action or reaction.",
				prerequisite: "neural_whiplash",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			emotion_override_field: {
				name: "Emotion Override Field",
				description: "Once per session, create a short-range field. All hostile creatures within it must succeed a POW roll or suffer a penalty die on aggressive actions for one round.",
				prerequisite: "neural_whiplash",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			compromise_anchor: {
				name: "Compromise Anchor",
				description: "Once per session, if you fail a social or spellcasting roll, you may immediately follow up with a different social skill. The second attempt gains a bonus die.",
				prerequisite: "false_memory",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			cognitive_fortress: {
				name: "Cognitive Fortress",
				description: "Once per scene, when targeted by a spell or social effect that affects your mind or emotions, roll POW. On a success, the effect is negated. You may spend 1 Strain to gain a bonus die on your next social or spellcasting roll.",
				prerequisite: "hollow_gaze",
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			puppetmaster_protocol: {
				name: "Puppetmaster Protocol",
				description: "Once per session, control a single humanoid target for one round. If they fail a POW resistance roll, you dictate their actions as if they were an ally — including movement, spells, or attacks.",
				prerequisiteAll: ["echo_implantation", "resonant_persona"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			emotional_collapse: {
				name: "Emotional Collapse",
				description: "Once per session, when a target fails a POW or social resistance roll against you, they suffer a penalty die on all aggressive or willpower-based actions for the rest of the scene, and must succeed a POW roll to initiate hostile actions.",
				prerequisite: ["emotion_override_field", "synaptic_lag"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			scene_fracture: {
				name: "Scene Fracture",
				description: "Once per session, trigger a psychic rupture. All creatures within medium range must roll POW. Those who fail suffer hallucinations or confusion, take a penalty die on all actions for one round, and suffer a penalty die on resistance rolls against your Enchantment spells for the rest of the scene.",
				prerequisiteAll: ["false_memory", "cognitive_fortress"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
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
			["etiquette_magi", "etiquette_corporate"]
		],
		talents: {
			runesight: {
				name: "Runesight",
				description: "Once per scene, gain a bonus die on a Magic (Warding) check. If used defensively (e.g., block, suppress, counter), reduce the spell’s Strain cost by one die step .",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			glyphstep: {
				name: "Glyphstep",
				description: "Spend 2 Strain to move 1 range band as a reaction when an enemy targets you with a spell or attack.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			sigil_hardened: {
				name: "Sigil Hardened",
				description: "Gain a bonus die on CON rolls to resist knockdown, suppression, or forced movement .",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			arcane_lock: {
				name: "Arcane Lock",
				description: "Once per scene, designate a point (e.g., doorway, corridor) within short range as warded. Enemies suffer a penalty die on ranged attacks made through the ward until the start of your next turn.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			strain_buffer: {
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			reflective_ward: {
				name: "Reflective Ward",
				description: "Once per scene, when targeted by a spell, the caster suffers a penalty die . If the spell fails, it reflects back on them.",
				prerequisite: ["runesight"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			stabilization_glyph: {
				name: "Stabilization Glyph",
				description: "Spend 2 Strain to ward an ally within short range. The next time they would fall below 1 HP this scene, they remain at 1 HP instead.",
				prerequisite: ["arcane_lock"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			barrier_projection: {
				name: "Barrier Projection",
				description: "Spend 3 Strain to conjure a short-range barrier. Any ally using it for cover causes enemies to suffer a penalty die on ranged attacks. Lasts for one scene or until destroyed (GM discretion).",
				prerequisite: ["arcane_lock"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			sigil_of_anchoring: {
				name: "Sigil of Anchoring",
				description: "Once per scene, place a glyph on yourself or an ally. The target cannot be forcibly moved or teleported for one round.",
				prerequisite: ["glyphstep"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			warded_advance: {
				name: "Warded Advance",
				description: "Once per scene, when you and an ally move toward danger, conjure a temporary glyph shield. The next time either of you is hit this round, reduce the damage taken by 2 (after armor).",
				prerequisite: ["barrier_projection", "glyphstep"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			counterglyph: {
				name: "Counterglyph",
				description: "Once per session, as a reaction, force a nearby enemy caster to suffer a penalty die on their spell. If they fail, they suffer 1d4 Strain.",
				prerequisite: ["reflective_ward"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			arcane_reversal: {
				name: "Arcane Reversal",
				description: "Once per session, when you succeed on a Warding spell to block, suppress, or shield, you may restore 1d4 Strain to yourself or a nearby ally.",
				prerequisite: ["sigil_of_anchoring"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			sanctum_sigil: {
				name: "Sanctum Sigil",
				description: "Spend 3 Strain to create a warded zone around you. Allies inside gain a bonus die to CON or POW rolls vs. magical or Veil effects. Lasts one scene.",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			null_field: {
				name: "Null Field",
				description: "Once per scene, create a suppression zone in short range. All spells cast inside or through it suffer a penalty die for 1 round.",
				prerequisite: ["reflective_ward", "barrier_projection"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},
			sigil_pulse: {
				name: "Sigil Pulse",
				description: "Once per scene, when a ward (e.g., Arcane Lock, Barrier, Null Field) ends or is dispelled, nearby enemies take 1d4 force damage and suffer a penalty die on their next action.",
				prerequisite: ["counterglyph", "arcane_reversal", "sanctum_sigil", "null_field"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},
			warding_matrix: {
				name: "Warding Matrix",
				description: "Spend 3 Strain to shield up to two allies within short range. They gain +2 armor vs. magical or elemental damage for the rest of the scene.",
				prerequisite: ["sanctum_sigil"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			mirror_sigil: {
				name: "Mirror Sigil",
				description: "Once per session, when targeted by a harmful spell or ranged attack, the attacker suffers a penalty die. If it misses, you may redirect it to another enemy in short range.",
				prerequisite: ["counterglyph", "arcane_reversal"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			glyph_warder: {
				name: "Glyph Warder",
				description: "You may maintain two active wards (e.g., Arcane Lock, Null Field) at once. Strain and duration remain unchanged.",
				prerequisite: ["null_field", "warding_matrix"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			veil_seal: {
				name: "Veil Seal",
				description: "Spend 3 Strain to suppress a Veil anomaly or magical corruption effect within short range. You may also reduce an ally’s Veil Corruption by 1 level. Usable once per session.",
				prerequisite: ["sanctum_sigil", "arcane_reversal"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			sigil_reservoir: {
				name: "Sigil Reservoir",
				description: "Once per scene, you may place an additional Arcane Lock or Null Field without paying extra Strain. Must be placed in a new location.",
				prerequisite: ["glyph_warder"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			runesovereign: {
				name: "Runesovereign",
				description: "Once per session, you may cast two Warding spells in the same round, as long as both have a casting time of 1 action or 1 maneuver .",
				prerequisite: ["glyph_warder", "mirror_sigil"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			wardmasters_command: {
				name: "Wardmaster’s Command",
				description: "Once per session, designate up to three allies within medium range. They each gain +2 armor and ignore magical terrain effects for the rest of the scene .",
				prerequisiteAll: ["warding_matrix", "sanctum_sigil"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			},
			sigilburst_protocol: {
				name: "Sigilburst Protocol",
				description: "Once per session, you may detonate one active ward you control. Enemies in its area take 2d6 force damage and suffer a penalty die on their next action. The ward ends immediately.",
				prerequisiteAll: ["glyph_warder", "sigil_pulse"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
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
				name: "Elemental Channeling",
				description: "Once per scene, gain a bonus die on a Magic (Elemental) roll. If successful, reduce the spell’s Strain cost by one die step.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			flashstep: {
				name: "Flashstep",
				description: "Spend 2 Strain to move one range band (Engaged to Short or Short to Medium) as a free action. Ignores terrain penalties. Cannot exceed medium range.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			tinder_spark: {
				name: "Tinder Spark",
				description: "Once per session, as an action, ignite a flammable object or surface within short range. You may also deal 1d4 fire damage to an adjacent target.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "session"
			},
			veil_shocked: {
				name: "Veil-Shocked",
				description: "Once per scene, when you take damage, deal 1d4 lightning damage to a target in engaged range as a reaction.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			strain_buffer: {
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			stormpulse_drive: {
				name: "Stormpulse Drive",
				description: "Once per scene, after casting an Elemental spell, you may immediately move 1 range band (this movement will provoke Opportunity Attacks) or gain a bonus die on your next Dodge or Melee attack roll.",
				prerequisite: ["elemental_channeling"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			voltaic_reflex: {
				name: "Voltaic Reflex",
				description: "Once per session, gain a bonus die to Dodge when targeted by a ranged attack. You may also spend 2 Strain to move 1 range band as part of the reaction.",
				prerequisite: ["flashstep"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			scorchmark: {
				name: "Scorchmark",
				description: "Spend 3 Strain to brand a living enemy with arcane fire. Gain a bonus die on Elemental spells targeting them for the rest of the scene.",
				prerequisite: ["tinder_spark"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			pulse_detonation: {
				name: "Pulse Detonation",
				description: "Once per scene, when struck in melee, cast a 1-action Elemental spell as a reaction. You may spend 2 Strain to deal half damage even if the spell fails.",
				prerequisite: ["veil_shocked"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			tempest_anchor: {
				name: "Tempest Anchor",
				description: "Spend 2 Strain to root yourself for one scene. While active, you ignore forced movement and gain a bonus die to CON rolls that resist knockdown or shoves.",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			volcanic_path: {
				name: "Volcanic Path",
				description: "Once per session, create a line of burning terrain (fire or molten stone) in short range. Crossing it deals 1d6 damage and may impose a penalty die on movement for that round.",
				prerequisite: ["stormpulse_drive"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			stormcallers_edge: {
				name: "Stormcaller's Edge",
				description: "Spend 4 Strain to gain two bonus dice on an Elemental spell. If successful, the spell also affects one additional target within short range.",
				prerequisite: ["scorchmark"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			crackling_focus: {
				name: "Crackling Focus",
				description: "If you remain stationary for two full rounds, gain a bonus die to all lightning-tagged Elemental spells for the rest of the scene.",
				prerequisiteAny: { tier: 2, count: 1 },
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			shockstep_conduit: {
				name: "Shockstep Conduit",
				description: "Once per session, teleport to any visible point within medium range. Enemies in engaged range at your starting and ending locations each take 1d4 lightning damage.",
				prerequisite: ["voltaic_reflex", "pulse_detonation"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			reactive_veilwalk: {
				name: "Reactive Veilwalk",
				description: "Once per scene, as a reaction, spend 2 Strain to teleport 1 range band away. All enemies in engaged range before or after the movement take 1d6 lightning damage.",
				prerequisite: ["pulse_detonation"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},
			veilstorm_mantle: {
				name: "Veilstorm Mantle",
				description: "Spend 3 Strain to activate a storm cloak for one scene. Melee attackers take 1d4 lightning damage, and if they fail a CON roll, they suffer a penalty die on their next action.",
				prerequisiteAll: ["tempest_anchor", "stormcallers_edge"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			flashfire_assault: {
				name: "Flashfire Assault",
				description: "Once per session, after casting a spell, make a melee or thrown attack against a target in engaged or short range with a bonus die as an incidental action.",
				prerequisite: ["stormcallers_edge"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			arc_flare: {
				name: "Arc Flare",
				description: "As a reaction, when you get an extreme or critical success on an Elemental spell, you may blind a nearby enemy. They suffer two penalty dice until their next action.",
				prerequisite: ["crackling_focus"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			surge_engine: {
				name: "Surge Engine",
				description: "Cast your next Elemental spell for 0 Strain. Usable once per session. Cannot be combined with other talents that alter spell cost or effect.",
				prerequisiteAny: { tier: 3, count: 1 },
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			burn_current: {
				name: "Burn Current",
				description: "Spend 2 Strain to unleash lightning in engaged range. Enemies take 1d6 damage and suffer a penalty die. Mechanical targets (drones, robots, vehicles) take 2d6 damage and may short out.",
				prerequisite: ["shockstep_conduit", "reactive_veilwalk"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: ""
			},
			eye_of_the_storm: {
				name: "Eye of the Storm",
				description: "Once per session, enter a Veil trance as an action for one scene. While active, reduce all Elemental spell Strain costs for the scene by one die step, and reroll any one failed Elemental spell.",
				prerequisite: ["veilstorm_mantle", "arc_flare"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stormpiercer: {
				name: "Stormpiercer",
				description: "Once per session, choose one Elemental spell. That spell ignores magical barriers, bypasses armor soak, and hits one extra target within medium range.",
				prerequisiteAll: ["stormcallers_edge", "arc_flare"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""
			},
			veilburn_protocol: {
				name: "Veilburn Protocol",
				description: "Once per session, as an action, spend 4 Strain to unleash a medium-radius arcane blast (choose fire, lightning, or force). All enemies in range take 2d6 damage. Terrain may be scorched or destabilized. Allies are unaffected.",
				prerequisite: ["surge_engine", "burn_current"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"				
			}
		}
	},
	street_ronin: {
		name: "Street Ronin",
		career_type: "martial",
		career_type_name: "Martial",
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
			combat_rhythm: {
				name: "Combat Rhythm",
				description: "Once per scene, after successfully Dodging an attack, gain a bonus die on your next Melee Weapons or Coordination roll before the end of your next turn.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			clean_entry: {
				name: "Clean Entry",
				description: "You may draw and strike with a melee weapon as a single action. If you begin the scene undetected or in a neutral stance, gain a bonus die on that opening attack.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			disciplined_focus: {
				name: "Disciplined Focus",
				description: "Once per scene, spend 1 Strain to ignore a penalty die on a single attack, defense, or Initiative roll.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			urban_footwork: {
				name: "Urban Footwork",
				description: "Once per scene, gain a bonus die on Dodge or Athletics rolls while moving through tight spaces, vertical terrain, or cluttered urban environments.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: "scene"
			},
			strain_buffer: {
				name: "Strain Buffer",
				description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
				prerequisite: "",
				tier: 1,
				cost: "5",
				capstone: false,
			    usage_limit: ""
			},
			interception_cut: {
				name: "Interception Cut",
				description: "Once per scene, when an enemy moves into engaged range, spend 2 Strain to make a free melee attack as a reaction. If it hits, their movement is interrupted.",
				prerequisite: ["combat_rhythm"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			posture_breaker: {
				name: "Posture Breaker",
				description: "Once per scene, after a successful melee attack, apply a penalty die to the target’s next attack or defense.",
				prerequisite: ["clean_entry"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "scene"
			},
			blade_discipline: {
				name: "Blade Discipline",
				description: "When taking the Dodge action, you may roll your Melee Weapons skill instead of Dodge, as long as you’re wielding a melee weapon.",
				prerequisite: ["disciplined_focus"],
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: ""
			},
			steel_reflex: {
				name: "Steel Reflex",
				description: "Once per session, when targeted by a ranged attack and you're either in cover or engaged range, spend 2 Strain to reduce the damage by 1d6. This is a free action, used after the roll but before damage is applied.",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			reactive_flow: {
				name: "Reactive Flow",
				description: "Once per session, when missed by a melee attack, you may move 1 range band in any direction as a free maneuver.",
				prerequisiteAny: { tier: 1, count: 1 },
				tier: 2,
				cost: "10",
				capstone: false,
			    usage_limit: "session"
			},
			breath_before_the_cut: {
				name: "Breath Before the Cut",
				description: "Once per session, if you win Initiative in a combat scene, you may enter Duel Focus: gain a bonus die on melee attacks against one target and reduce the Strain cost of one reaction-based talent by one die step for the first round.",
				prerequisite: ["blade_discipline"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			draw_cut: {
				name: "Draw Cut",
				description: "Once per session, when striking a target that hasn’t acted yet this scene, deal +1d6 damage and apply a penalty die to their next action.",
				prerequisite: ["posture_breaker"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			counterguard_precision: {
				name: "Counterguard Precision",
				description: "Once per scene, after successfully Dodging a melee attack, make a free melee counterattack with a bonus die.",
				prerequisite: ["interception_cut"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "scene"
			},
			stillness_in_motion: {
				name: "Stillness in Motion",
				description: "Spend 2 Strain to ignore movement penalties for the rest of the round. During this time, gain a bonus die to Athletics or Melee Weapons rolls involving movement.",
				prerequisite: ["posture_breaker"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: ""
			},
			the_line_you_do_not_cross: {
				name: "The Line You Do Not Cross",
				description: "Once per session, designate a small area within engaged range (doorway, alley, rooftop edge). Enemies who cross this line suffer a penalty die on movement or attacks that turn.",
				prerequisite: ["posture_breaker"],
				tier: 3,
				cost: "15",
				capstone: false,
			    usage_limit: "session"
			},
			moment_severed: {
				name: "Moment Severed",
				description: "Once per session, after landing a melee hit, spend 2 Strain to prevent the target from taking any actions until the end of their next turn. They may still take reactions.",
				prerequisite: ["breath_before_the_cut"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			no_second_strike: {
				name: "No Second Strike",
				description: "Once per session, if you reduce a target to 0 HP with a melee attack, immediately make a free melee attack against another target in engaged range. That attack gains a bonus die.",
				prerequisite: ["draw_cut"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			ghost_step: {
				name: "Ghost Step",
				description: "Once per scene, move 1 range band as a free maneuver, even if you've already moved this round. If you aren’t targeted before your next turn, your next melee attack gains a bonus die.",
				prerequisite: ["stillness_in_motion"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "scene"
			},
			steel_anchored_calm: {
				name: "Steel Anchored Calm",
				description: "Once per session, ignore the effects of fear, pain, or Veil-induced conditions for one round. You also gain a bonus die on Dodge rolls during this time.",
				prerequisite: ["the_line_you_do_not_cross"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			flow_reversal: {
				name: "Flow Reversal",
				description: "Once per session, if you fail to beat an attacker’s success while counterattacking, you may spend 2 Strain to force a mutual exchange: both you and the attacker take damage, and the attacker suffers a penalty die on their next action.",
				prerequisite: ["counterguard_precision"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			deflective_form: {
				name: "Deflective Form",
				description: "Once per session, when targeted by a ranged attack within short range while wielding a melee weapon, you may make a Dodge roll as a free action, using either Dodge or Melee Weapons. If your result beats the attacker’s roll, the attack is avoided.",
				prerequisite: ["counterguard_precision"],
				tier: 4,
				cost: "20",
				capstone: false,
			    usage_limit: "session"
			},
			final_cut_doctrine: {
				name: "Final Cut Doctrine",
				description: "Once per session, when counterattacking, declare Final Cut. Win or lose, your attack lands after the attacker’s action resolves, dealing maximum weapon damage. If your counterattack would have succeeded normally, you may apply one other talent effect (such as Draw Cut or Posture Breaker) for free.",
				prerequisiteAll: ["flow_reversal", "breath_before_the_cut"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			ghost_walk_execution: {
				name: "Ghost Walk Execution",
				description: "Once per session, move up to medium range as a free action and make a single melee attack. If the target is unaware of you or has not yet acted this scene, deal +2d6 bonus damage and force a POW check. On failure, they are stunned until the end of their next turn.",
				prerequisite: ["ghost_step"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			duelmasters_claim: {
				name: "Duelmaster’s Claim",
				description: "Once per session, declare a single opponent as your focused rival. For the rest of the scene, gain a bonus die on all Melee, Dodge, and reaction-based talents against that target. If you reduce them to 0 HP, choose one: Make a free melee attack against another target in engaged range, or regain 2 Strain.",
				prerequisiteAll: ["the_line_you_do_not_cross", "moment_severed"],
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: "session"
			},
			stat_boost: {
				name: "+5% Stat Boost",
				description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
				prerequisiteAny: { tier: 4, count: 1 },
				tier: 5,
				cost: "30",
				capstone: true,
			    usage_limit: ""				
			}
		}
	}
};
