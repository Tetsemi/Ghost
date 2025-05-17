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
        skill_point_secondary: 20,
        spell_xp_primary: 30,
        spell_xp_secondary: 10,
        primary_skills: {
            magic_technomancy: "Magic (Technomancy)",
            slicing: "Slicing",
            electronics: "Electronics",
            computer_use: "Computer Use"
        },
        secondary_skills: {
            security_systems: "Security Systems",
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
                capstone: false
            },
            veil_thread_tap: {
                name: "Veil Thread Tap",
                description: "Once per scene, detect nearby digital activity or magitech signatures within short range — even if encrypted or cloaked. Gain a bonus die to your next Perception or Slicing check related to that system.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false
            },
            hardlight_override: {
                name: "Hardlight Override",
                description: "Once per scene, spend 2 Strain to project a hardlight sigil into a nearby device (e.g., door, turret, drone). You may trigger a basic function (open, shut down, disengage) without a skill check.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false
            },
            recursive_pulse: {
                name: "Recursive Pulse",
                description: "Once per scene, after a failed attempt to access or affect a device, you may reroll with a penalty die. If successful, regain 1 Strain.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false
            },
            strain_buffer: {
                name: "Strain Buffer",
                description: "Increase your maximum Strain by +1. This talent may appear in multiple Career Trees.",
                prerequisite: "",
                tier: 1,
                cost: "5",
                capstone: false
            },
            pulse_hijack: {
                name: "Pulse Hijack",
                description: "Spend 2 Strain to take control of a simple device or automated system (e.g., surveillance cam, basic drone, access node) for one round.",
                prerequisite: "hardlight_override",
                tier: 2,
                cost: "10",
                capstone: false
            },
            code_injection: {
                name: "Code Injection",
                description: "Once per scene, after a successful Technomancy spell or Slicing check, implant a command packet that allows you to issue one additional command later in the same scene without a new check.",
                prerequisite: "signal_sync",
                tier: 2,
                cost: "10",
                capstone: false
            },
            scramble_protocol: {
                name: "Scramble Protocol",
                description: "Spend 2 Strain to disrupt a single active drone or magitech system for one round. It suffers a penalty die on all tech-based or automated actions.",
                prerequisite: "recursive_pulse",
                tier: 2,
                cost: "10",
                capstone: false
            },
            arc_sigil_link: {
                name: "Arc-Sigil Link",
                description: "You may roll Magic (Technomancy) in place of Electronics or Computer Use when interacting with magitech systems. This does not apply to physical repairs or mechanical breakdowns.",
                prerequisite: "veil_thread_tap",
                tier: 2,
                cost: "10",
                capstone: false
            },
            clean_loop_feedback: {
                name: "Clean Loop Feedback",
                description: "Once per session, after successfully casting a Technomancy spell on a device, regain 1d4 Strain.",
                prerequisite: "",
                prerequisiteAny: { tier: 1, count: 1 },
                tier: 2,
                cost: "10",
                capstone: false
            },
            magelock_cascade: {
                name: "Magelock Cascade",
                description: "Once per session, when you successfully disable or control a device, you may immediately target a second device within short range. The second target rolls resistance with a penalty die.",
                prerequisite: "pulse_hijack",
                tier: 3,
                cost: "15",
                capstone: false
            },
            null_loop_echo: {
                name: "Null Loop Echo",
                description: "Spend 2 Strain to create a disruption field around you (short range) for one round. All drones, magitech, and automated systems inside suffer a penalty die on targeting, reactions, or interfacing.",
                prerequisite: "scramble_protocol",
                tier: 3,
                cost: "15",
                capstone: false
            },
            arc_thread_override: {
                name: "Arc-Thread Override",
                description: "Once per scene, when a hostile device activates, you may cast a Technomancy spell as a reaction. The spell must affect technology (jam, crash, reroute, etc.).",
                prerequisite: "code_injection",
                tier: 3,
                cost: "15",
                capstone: false
            },
            subroutine_leash: {
                name: "Subroutine Leash",
                description: "You may take control of a single drone you have accessed. It acts as an allied NPC on your turn for the duration of the spell or control effect.",
                prerequisite: "arc_sigil_link",
                tier: 3,
                cost: "15",
                capstone: false
            },
            synthetic_harmony: {
                name: "Synthetic Harmony",
                description: "Once per scene, after casting a Technomancy spell or succeeding a Slicing check, gain a bonus die on your next spellcasting or social skill check.",
                prerequisite: "",
                prerequisiteAny: { tier: 2, count: 1 },
                tier: 3,
                cost: "15",
                capstone: false
            },
			command_injection: {
                name: "Command Injection",
                description: "Once per scene, after casting a Technomancy spell or issuing a drone command, you may issue two distinct commands instead of one.",
                prerequisite: "subroutine_leash",
                tier: 4,
                cost: "20",
                capstone: false
            },
            crash_field: {
                name: "Crash Field",
                description: "Once per session, create a crash zone (medium range) for one round. All affected drones or magitech systems must succeed a POW or INT roll or become disabled until the start of your next turn.",
                prerequisite: "null_loop_echo",
                tier: 4,
                cost: "20",
                capstone: false
            },
            live_patch_redirect: {
                name: "Live Patch Redirect",
                description: "Once per session, when an ally is targeted by a spell, ability, or tech effect, you may spend 2 Strain to redirect the effect to yourself or a controlled construct.",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: "20",
                capstone: false
            },
            backdoor_ritual: {
                name: "Backdoor Ritual",
                description: "Once per scene, you may embed a persistent arcane anchor in a system you access. If the system is triggered again this scene, you may act on it immediately without a new roll. Only one Backdoor may be active at a time.",
                prerequisite: "arc_thread_override",
                tier: 4,
                cost: "20",
                capstone: false
            },
            veil_reactor_stabilizer: {
                name: "Veil-Reactor Stabilizer",
                description: "Once per session, spend 2 Strain to negate a Veil corruption effect, a magitech malfunction, or to reduce incoming damage by 1d6 from a tech-based or Veil-powered source.",
                prerequisite: "",
                prerequisiteAny: { tier: 3, count: 1 },
                tier: 4,
                cost: "20",
                capstone: false
            },
            overcode_detonation: {
                name: "Overcode Detonation",
                description: "Once per session, trigger a system cascade affecting any magitech network or drone field within medium range. All affected systems must roll POW or INT or suffer shutdown, 1d6 damage, or go berserk (your choice per target). Cybernetic limbs and smart weapons tied to living users are unaffected.",
                prerequisite: "",
                prerequisiteAny: { tier: 4, count: 1 },
                tier: 5,
                cost: "30",
                capstone: true
            },
            signal_possession: {
                name: "Signal Possession",
                description: "Once per session, take full control of a drone, turret, or magitech construct within medium range for the rest of the scene. If the target is destroyed or disconnected, you may transfer control to another valid device once.",
                prerequisite: "",
                prerequisiteAny: { tier: 4, count: 1 },
                tier: 5,
                cost: "30",
                capstone: true
            },
            reality_patch: {
                name: "Reality Patch",
                description: "Once per session, cast a Technomancy spell with a casting time of 1 action or less as a reaction to a failed defense, corrupted system, or Veil event. The spell automatically succeeds but costs double Strain.",
                prerequisite: "",
                prerequisiteAny: { tier: 4, count: 1 },
                tier: 5,
                cost: "30",
                capstone: true
            },
            stat_boost: {
                name: "+5% Stat Boost",
                description: "Increase any one core stat — including Magic — by +5%, up to your racial maximum. May only be taken once.",
                prerequisite: "",
                prerequisiteAny: { tier: 4, count: 1 },
                tier: 5,
                cost: "30",
                capstone: true
            }
        }
    }
};
