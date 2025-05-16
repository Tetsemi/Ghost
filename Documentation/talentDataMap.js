const talentDataMap = {
  alteri: {
    second_skin: {
      name: "Second Skin",
      description: "You gain an additional Mask—a fully realized persona with a name, appearance, and backstory. Switching to this Mask takes 1 Action and no longer imposes Strain unless done under stress (GM discretion).",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    reflexive_shift: {
      name: "Reflexive Shift",
      description: "Once per scene, as a Reaction, rapidly alter your appearance (hair, skin tone, voice, etc.) to avoid identification. Grants a bonus die to Disguise or deception-based Deception. Costs 1d4 Strain.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    echoed_voice: {
      name: "Echoed Voice",
      description: "Once per session, mimic the voice and speech of someone known to you or studied for at least one full scene. Grants a bonus die to Performance (Impersonation) or any roll to pass as the individual.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    maskwrights_grace: {
      name: "Maskwright’s Grace",
      description: "Choose one: gain +10% to Disguise, Insight, or Performance (Impersonation). This choice is permanent and may only be taken once.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    social_chameleon: {
      name: "Social Chameleon",
      description: "Use Charm in place of Deception or Persuade when navigating unfamiliar cultures or coded social environments.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    ghost_protocol: {
      name: "Ghost Protocol",
      description: "Once per session, erase your trail. Gain a bonus die to Stealth or Slicing when spoofing ID, bypassing basic surveillance, or escaping recognition. If followed by a successful Disguise, it leaves no trace.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    shaped_for_subtlety: {
      name: "Shaped for Subtlety",
      description: "Choose one: gain +10% to Stealth, Slicing, or Insight. This choice is permanent and may only be taken once.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    whisper_touched: {
      name: "Whisper-Touched",
      description: "Once per session, gain a bonus die when casting Illusion or Enchantment spells.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
    grace_of_the_many: {
      name: "Grace of the Many",
      description: "Once per session, reroll a failed Disguise, Insight, or Stealth check. Take the better result.",
      prerequisite: "",
      tier: 1,
      cost: "10",
      capstone: false
    },
	facial_recalibration: {
      name: "Facial Recalibration",
      description: "Once per session, mimic a person’s face, posture, and speech after observing them for at least one turn. Grants a bonus die to Disguise or Performance (Impersonation). Costs 1 Strain.",
      prerequisite: ["echoed_voice", "second_skin"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    adaptive_memory: {
      name: "Adaptive Memory",
      description: "Once per session, recall useful details from a person you've interacted with in person. Gain a bonus die to a social roll involving deception or impersonation with them or their associates.",
      prerequisite: ["social_chameleon", "maskwrights_grace"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    shift_reflex: {
      name: "Shift Reflex",
      description: "Once per scene, use a Reaction to confuse a target mid-scan or strike. Gain a bonus die to Dodge or Stealth.",
      prerequisite: ["reflexive_shift"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    deep_mask_integration: {
      name: "Deep Mask Integration",
      description: "Gain +10% to Disguise or Insight (your choice). You may maintain two active Masks and switch between them without prep or Strain outside combat.",
      prerequisite: ["second_skin"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    ghost_signature: {
      name: "Ghost Signature",
      description: "Once per session, spoof or bypass a low-grade biometric scan (e.g., facial recognition, voiceprint, retinal) with a bonus die to Slicing or Electronics.",
      prerequisite: ["ghost_protocol"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    mirror_weave: {
      name: "Mirror Weave",
      description: "Once per session, illusions or enchantments you cast can deceive digital or mechanical observers. Costs 1 Strain per additional ally affected. Cannot deceive hostile systems.",
      prerequisite: ["whisper_touched"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    persona_anchor: {
      name: "Persona Anchor",
      description: "Choose one: gain +10% to Performance (Impersonation), Arcana, or Slicing. Reflects how your persona enhances certain skills.",
      prerequisite: ["grace_of_the_many"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    veil_echo_memory: {
      name: "Veil Echo Memory",
      description: "Once per session, gain a sensory impression or memory from a place or person you've touched. Grants a bonus die to the next Arcana, Insight, or Occult Lore roll. Costs 1 Strain.",
      prerequisite: ["whisper_touched", "ghost_protocol"],
      tier: 2,
      cost: "20",
      capstone: false
    },
    silent_archive: {
      name: "Silent Archive",
      description: "Store a secondary identity with full recall: appearance, history, contacts, accent, and routine. Once per session, switch instantly. Costs 1d4 Strain if used during a scene. Free outside scenes.",
      prerequisite: ["deep_mask_integration"],
      tier: 2,
      cost: "20",
      capstone: false
    },
	perfect_mimicry: {
      name: "Perfect Mimicry",
      description: "Once per session, flawlessly replicate a person’s full persona (appearance, mannerisms, tone). Grants a bonus die to Disguise, Performance, or Deception.",
      prerequisite: ["facial_recalibration", "echoed_voice"],
      tier: 3,
      cost: "30",
      capstone: false
    },
    biometric_phantom: {
      name: "Biometric Phantom",
      description: "Once per session, spoof or override corporate-grade biometric or magitech ID systems if you've had contact with the target. Bonus die to Slicing or Electronics.",
      prerequisite: ["ghost_signature"],
      tier: 3,
      cost: "30",
      capstone: false
    },
    memory_graft: {
      name: "Memory Graft",
      description: "Once per session, tap into a stored Mask’s memory for insight. Gain a bonus die to one Arcana, Insight, or Performance (Impersonation) roll tied to that persona’s experience.",
      prerequisite: ["deep_mask_integration"],
      tier: 3,
      cost: "30",
      capstone: false
    },
    veil_shaped_will: {
      name: "Veil-Shaped Will",
      description: "Once per session, reroll a failed Illusion, Alteration, or Enchantment spellcasting. If successful, reduce the Strain die by one step (e.g., 1d6 → 1d4).",
      prerequisite: ["mirror_weave", "whisper_touched"],
      tier: 3,
      cost: "30",
      capstone: false
    },
    social_echo: {
      name: "Social Echo",
      description: "Once per session, adapt your behavior to match a target’s subconscious expectations. Gain a bonus die to Charm, Deception, or Persuade. Costs 1 Strain if targeting two or more people.",
      prerequisite: ["social_chameleon", "adaptive_memory"],
      tier: 3,
      cost: "30",
      capstone: false
    },
    identity_cascade: {
      name: "Identity Cascade",
      description: "Once per scene, switch Masks mid-encounter (even mid-dialogue or mid-combat). Grants a bonus die to Disguise or Insight. Costs 1d4 Strain if under pressure or direct observation.",
      prerequisite: ["deep_mask_integration"],
      tier: 3,
      cost: "30",
      capstone: false
    },
	immaculate_impersonation: {
      name: "Immaculate Impersonation",
      description: "Once per session, flawlessly impersonate a known target—down to retinal scan, bio-sig, and vocal cadence. Bonus die to all Disguise, Slicing, or Performance (Impersonation) checks for the entire scene.",
      prerequisite: ["perfect_mimicry", "biometric_phantom"],
      tier: 4,
      cost: "40",
      capstone: true
    },
    living_mask_archive: {
      name: "Living Mask Archive",
      description: "Maintain up to four active Masks. Once per session, instantly switch between any of them. Grants a bonus die to your next social or Stealth roll. Costs 1 Strain if used during a scene.",
      prerequisite: ["memory_graft", "identity_cascade"],
      tier: 4,
      cost: "40",
      capstone: true
    },
    veil_mirroring_ritual: {
      name: "Veil-Mirroring Ritual",
      description: "Once per session, reflect a single Illusion or Enchantment spell cast on you, or redirect it to another visible target. Spell must be reflectable by nature.",
      prerequisite: ["veil_shaped_will"],
      tier: 4,
      cost: "40",
      capstone: true
    },
    author_of_the_lie: {
      name: "Author of the Lie",
      description: "Once per session, automatically succeed on a Disguise, Performance, or Deception roll involving deception. You may declare one falsehood about your Mask as true for the rest of the scene. Costs 2 Strain if used under direct scrutiny or in a digital surveillance zone.",
      prerequisite: ["social_echo", "deep_mask_integration"],
      tier: 4,
      cost: "40",
      capstone: true
    }
  },
  draevi: {
    iron_stomach: {
      name: "Iron Stomach",
      description: "Gain a bonus die on Constitution rolls to resist poison, spoiled food, or ingested toxins. You can consume nearly anything without penalty.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    clan_blooded: {
      name: "Clan-Blooded",
      description: "Choose one: gain +10% to Intimidate, Survival, or Track. This reflects your upbringing within a strong clan tradition. This choice is permanent and may only be taken once.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    urban_climber: {
      name: "Urban Climber",
      description: "Once per session, gain a bonus die to any Athletics or Coordination roll made while navigating vertical, unstable, or cramped environments.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    scavengers_edge: {
      name: "Scavenger’s Edge",
      description: "Choose one: gain +10% to Mechanics, Electronics, or Streetwise. This reflects your clan’s practical knowledge of scavenging and repair. This choice is permanent and may only be taken once.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    spirits_in_stone: {
      name: "Spirits-in-Stone",
      description: "Once per session, gain a bonus die on a Spirit Lore roll related to ancestor rites, ruins, or natural spirit dwellings.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    trailborn_reflexes: {
      name: "Trailborn Reflexes",
      description: "Once per scene, gain a bonus die to any Dodge roll.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    gutter_stalker: {
      name: "Gutter-Stalker",
      description: "Once per session, gain a bonus die on a Stealth roll made in an urban or tight, vertical space (vents, scaffolding, alleys).",
      tier: 1,
      cost: 10,
      capstone: false
    },
    bone_sung_memory: {
      name: "Bone-Sung Memory",
      description: "Once per session, gain a bonus die when attempting to recall a location, creature, or spiritual phenomenon you’ve personally witnessed before.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    silent_step_sharp_ear: {
      name: "Silent Step, Sharp Ear",
      description: "Gain a bonus die on Stealth checks when moving through natural terrain. Optional: spend 1 Strain to also gain a bonus die on the next Listen or Perception check in the same scene.",
      tier: 1,
      cost: 10,
      capstone: false
    },
    hardened_trailwalker: {
      name: "Hardened Trailwalker",
      description: "Once per session, gain a bonus die to a Survival check. If that check fails, suffer only half the usual Strain from failure.",
      prerequisite: ["iron_stomach", "trailborn_reflexes"],
      tier: 2,
      cost: "20"
    },
    urban_tracker: {
      name: "Urban Tracker",
      description: "You may reroll one failed Streetwise, Stealth, or Track check made while tracking in an urban environment.",
      prerequisite: ["gutter_stalker"],
      tier: 2,
      cost: "20"
    },
    instinctive_counter: {
      name: "Instinctive Counter",
      description: "Once per scene, gain a bonus die to either a Dodge, Unarmed Combat, or Melee roll when reacting to an attack.",
      prerequisite: ["trailborn_reflexes"],
      tier: 2,
      cost: "20"
    },
    veins_of_stone: {
      name: "Veins of Stone",
      description: "Once per session, automatically succeed on a failed Constitution roll against fatigue, poison, or environmental strain.",
      prerequisite: ["iron_stomach", "clan_blooded"],
      tier: 2,
      cost: "20"
    },
    echo_binders_rite: {
      name: "Echo-Binder’s Rite",
      description: "Once per session, gain a bonus die to a Magic (Summoning) or Spirit Lore roll to commune with a spirit or bind an ancestral echo.",
      prerequisite: ["spirits_in_stone"],
      tier: 2,
      cost: "20"
    },
    scent_the_shift: {
      name: "Scent the Shift",
      description: "Once per session, detect a hidden threat, spirit, or Veil anomaly in your immediate area. Grants a bonus die to the next Perception or Spirit Lore check made to investigate it.",
      prerequisite: ["trailborn_reflexes", "spirits_in_stone"],
      tier: 2,
      cost: "20"
    },
    tales_etched_in_horn: {
      name: "Tales Etched in Horn",
      description: "Once per session, when recalling a story, rite, or ancestral lesson, gain a bonus die on any Occult Lore, Spirit Lore, or Etiquette (Clan) check related to Draevi culture or spirits.",
      prerequisite: ["clan_blooded"],
      tier: 2,
      cost: "20"
    },
    root_stance_tenacity: {
      name: "Root-Stance Tenacity",
      description: "Once per session, when you fail a Strength or Constitution roll to resist knockback, fatigue, or being overpowered, you may reroll with a bonus die. Optional: spend 2 Strain to remain standing even if the second roll fails.",
      prerequisite: ["iron_stomach", "clan_blooded"],
      tier: 2,
      cost: "20"
    },
	    spirit_touched_mastery: {
      name: "Spirit-Touched Mastery",
      description: "Once per session, reroll a failed Spirit Lore or Magic (Summoning) roll. If successful, reduce the spell’s Strain cost by one die step.",
      prerequisite: ["echo_binders_rite"],
      tier: 3,
      cost: "30"
    },
    spiritual_vanguard: {
      name: "Spiritual Vanguard",
      description: "Once per session, gain a bonus die when casting a Counterspell on behalf of an ally. Also gain a bonus die when banishing a hostile spirit.",
      prerequisite: ["scent_the_shift", "tales_etched_in_horn"],
      tier: 3,
      cost: "30"
    },
    emberlash_retaliation: {
      name: "Emberlash Retaliation",
      description: "Once per session, when struck by a melee or ranged attack, make a counterattack with a bonus die. If your counterattack hits, the target suffers a penalty die on their next action.",
      prerequisite: ["instinctive_counter"],
      tier: 3,
      cost: "30"
    },
    ancestors_pulse: {
      name: "Ancestor’s Pulse",
      description: "Once per session, gain two bonus dice on a Magic (Divination), Spirit Lore, or Magic (Summoning) roll when invoking ancestral insight. On success, the insight reveals a hidden danger or opportunity relevant to the scene.",
      prerequisite: ["tales_etched_in_horn"],
      tier: 3,
      cost: "30"
    },
    pathfinders_edge: {
      name: "Pathfinder’s Edge",
      description: "Once per session, ignore natural terrain penalties for movement or Survival for a full scene. Gain a bonus die to Track or Navigate during this time.",
      prerequisite: ["hardened_trailwalker", "veins_of_stone"],
      tier: 3,
      cost: "30"
    },
    wild_tamers_gaze: {
      name: "Wild Tamer’s Gaze",
      description: "Once per session, choose a non-hostile creature or spirit (animal, summoned being, or elemental-type). You may calm, redirect, or guide it with a Spirit Lore or Animal Handling check rolled with a bonus die. Optional: spend 2 Strain to influence it even if it's Veil-corrupted or hostile.",
      prerequisite: ["echo_binders_rite", "ancestors_pulse"],
      tier: 3,
      cost: "30"
    },
    legacy_reforged: {
      name: "Legacy Reforged",
      description: "Once per session, choose one Tier 1 Draevi Talent you possess. For the rest of the scene, it may be used twice without expending Strain. Optional: spend 1 Strain to immediately activate that Tier 1 talent now.",
      prerequisite: [], // Note: Conditional prerequisite, any two Tier 2 talents
      tier: 3,
      cost: "30"
    },
    soul_of_the_wild_hunt: {
      name: "Soul of the Wild Hunt",
      description: "Once per session, enter Hunt State for the remainder of a scene: gain a bonus die on Stealth and Tracking checks, ignore terrain penalties, and reroll one failed Unarmed Combat or Melee attack.",
      prerequisite: ["pathfinders_edge", "emberlash_retaliation"],
      tier: 4,
      cost: "40",
      capstone: true
    },
    echo_flame_warden: {
      name: "Echo-Flame Warden",
      description: "Once per session, invoke a Ward of Legacy: you and up to two allies gain a bonus die on Constitution and Power rolls during a combat or ritual scene. You may also reduce incoming damage to one target by 1d6 (once per session).",
      prerequisite: ["veins_of_stone", "spiritual_vanguard"],
      tier: 4,
      cost: "40",
      capstone: true
    },
    ancestral_mirror: {
      name: "Ancestral Mirror",
      description: "Once per session, call on an ancestral vision to gain two bonus dice on a Spirit Lore, Magic (Summoning), or Magic (Divination) roll. On success, gain a hidden insight or location tied to the current conflict.",
      prerequisite: ["spirit_touched_mastery", "echo_binders_rite"],
      tier: 4,
      cost: "40",
      capstone: true
    },
    path_of_the_remembered: {
      name: "Path of the Remembered",
      description: "Once per session, declare a location as “bound by memory.” For the scene, you and allies who can hear you gain a bonus die on Perception, Survival, or Willpower-related rolls within that area. You may also spend 3 Strain once during the scene to invoke a flash of ancestral memory, revealing a secret path, hidden threat, or forgotten rite.",
      prerequisite: ["ancestors_pulse", "tales_etched_in_horn"],
      tier: 4,
      cost: "40",
      capstone: true
    }
  },
  human : {
    hard_lesson: {
      name: "Hard Lesson",
      description: "Once per session, reroll a failed skill check. You must take the second result. This reflects the human knack for learning through pain and persistence. Optional: Spend 2 Strain to attempt a second reroll immediately after the first.",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    instinct_over_training: {
      name: "Instinct Over Training",
      description: "Use Education in place of any untrained knowledge skill (Arcana, Occult Lore, Forbidden Lore, History, Law, etc.) once per session, at one difficulty higher.",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    makeshift_medic: {
      name: "Makeshift Medic",
      description: "Once per session, when attempting a First Aid check without proper medical tools, gain a bonus die. Humans improvise with what they have.",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    no_stranger_to_pain: {
      name: "No Stranger to Pain",
      description: "Once per session, roll with a bonus die when making a CON roll to stay conscious after suffering a major wound.",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    quick_fixer: {
      name: "Quick Fixer",
      description: "Choose one: gain +10% to Electronics, Mechanics, or Slicing. This reflects cross-training in common survival tech. This choice is permanent and may only be taken once.",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    social_versatility: {
      name: "Social Versatility",
      description: "Once per session, reroll any failed Charm, Deception, or Persuade check. This reflects the human gift for adapting socially on the fly.",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    battle_tested_gut: {
      name: "Battle-Tested Gut",
      description: "Once per session, when entering a potentially dangerous situation, ask the GM: Do I feel something is off? The GM must answer truthfully (vaguely if appropriate).",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    skilled_focus: {
      name: "Skilled Focus",
      description: "Choose one: gain +10% to any non-combat, non-magic skill. This reflects training or life experience in a particular area. May only be taken once.",
      prerequisite: "",
      tier: 1,
      cost: "10"
    },
    quick_learner: {
      name: "Quick Learner",
      description: "When you succeed at a roll for an untrained skill (one not granted by your Race or Profession), gain a bonus die the next time you use that skill during this session.",
      prerequisite: ["any_tier_1"],
      tier: 2,
      cost: "20"
    },
    situational_awareness: {
      name: "Situational Awareness",
      description: "Once per session, gain a bonus die to a Perception, Insight, or Listen check during a high-stress scene (combat, infiltration, or tense social standoff).",
      prerequisite: ["battle_tested_gut", "instinct_over_training"],
      tier: 2,
      cost: "20"
    },
    spontaneous_strategist: {
      name: "Spontaneous Strategist",
      description: "Once per scene, gain a bonus die on a Dodge, Persuade, or Tactical (if used) roll made in response to an unexpected turn of events. Optional: Spend 1 Strain to activate this outside your normal action, as a reactive call.",
      prerequisite: ["hard_lesson"],
      tier: 2,
      cost: "20"
    },
    lucky_timing: {
      name: "Lucky Timing",
      description: "Once per session, choose one other player. After they fail a skill check, you may declare, ‘Wait—I’ve got this.’ You immediately attempt the same roll yourself with a bonus die.",
      prerequisite: ["social_versatility", "skilled_focus"],
      tier: 2,
      cost: "20"
    },
    improvised_tools: {
      name: "Improvised Tools",
      description: "Once per session, ignore the penalty for lacking tools when making a Mechanics, Electronics, or Slicing check. You’ve duct-taped worse.",
      prerequisite: ["quick_fixer"],
      tier: 2,
      cost: "20"
    },
    defiant_resilience: {
      name: "Defiant Resilience",
      description: "Once per session, ignore the effects of one failed Fear or Mental Trauma check (GM discretion). Optional: Spend 2 Strain to also gain a bonus die to your next Willpower or Insight check during the same scene.",
      prerequisite: ["no_stranger_to_pain"],
      tier: 2,
      cost: "20"
    },
    cross_trained: {
      name: "Cross-Trained",
      description: "Choose one additional Class Skill from any profession and gain +10% in it. This may only be taken once. Optional: Spend 1 Strain to treat a skill as trained for advancement purposes until the end of session.",
      prerequisite: ["skilled_focus", "quick_learner"],
      tier: 2,
      cost: "20"
    },
    momentum_shift: {
      name: "Momentum Shift",
      description: "Once per session, after a successful roll, you may immediately attempt another action (of a different skill) with a bonus die. Can be used for daring combos or sudden shifts in tempo.",
      prerequisite: ["spontaneous_strategist", "quick_learner"],
      tier: 3,
      cost: "30"
    },
    pull_from_memory: {
      name: "Pull From Memory",
      description: "Once per session, ask the GM: Have I read, seen, or heard of this before? If yes, gain a bonus die to a related Lore, History, or Magic (any) roll.",
      prerequisite: ["instinct_over_training"],
      tier: 3,
      cost: "30"
    },
    chain_of_luck: {
      name: "Chain of Luck",
      description: "Once per session, when you roll a natural 01–05 on any skill check, immediately gain a bonus die to your next roll.",
      prerequisite: ["lucky_timing", "hard_lesson"],
      tier: 3,
      cost: "30"
    },
    dig_deep: {
      name: "Dig Deep",
      description: "Once per session, push through a wound or mental strain: ignore a penalty die from fatigue, injury, or Veil exposure for one roll. Optional: Spend 2 Strain to ignore two penalty dice or apply the effect to two rolls this scene.",
      prerequisite: ["defiant_resilience"],
      tier: 3,
      cost: "30"
    },
    just_enough_prep: {
      name: "Just Enough Prep",
      description: "Once per session, declare you prepped for this. Reveal a basic tool, piece of info, or contact that reasonably helps the scene. Gain a bonus die to one roll using it. Optional: Spend 2 Strain to declare an additional prep aid during the same scene.",
      prerequisite: ["situational_awareness", "improvised_tools"],
      tier: 3,
      cost: "30"
    },
    break_the_pattern: {
      name: "Break the Pattern",
      description: "Once per session, negate one enemy’s bonus die (declared after they roll, before results are finalized).",
      prerequisite: ["social_versatility", "lucky_timing"],
      tier: 3,
      cost: "30"
    },
    tactical_improviser: {
      name: "Tactical Improviser",
      description: "Once per session, declare a flexible plan mid-scene. One ally you designate gains a bonus die once per round for the remainder of the scene, as long as their actions align with your stated approach. Optional: Spend 2 Strain per round to allow a second ally to benefit as well.",
      prerequisite: ["momentum_shift", "just_enough_prep"],
      tier: 4,
      cost: "40"
    },
    luck_bends_for_me: {
      name: "Luck Bends for Me",
      description: "At the start of each session, make two Luck advancement rolls instead of one. If you fail a roll, gain +1d10 Luck. Additionally, once per session, spend 5 Luck to reroll a failed skill roll.",
      prerequisite: ["chain_of_luck", "hard_lesson"],
      tier: 4,
      cost: "40"
    },
    unshakable_focus: {
      name: "Unshakable Focus",
      description: "Once per session, become immune to Fear, Pain, or Mental Trauma for the duration of a scene. While active, gain a bonus die to any Willpower-related roll. Optional: Instead of using it once per session, you may activate this once per scene by spending 4 Strain.",
      prerequisite: ["dig_deep", "defiant_resilience"],
      tier: 4,
      cost: "40"
    },
    master_of_none: {
      name: "Master of None",
      description: "Choose three skills in which you have at least 50%. Gain +10% in each. These do not have to be from the same category or Class list.",
      prerequisite: ["cross_trained", "skilled_focus"],
      tier: 4,
      cost: "40"
    }
  },
  lyranni :{
  }
};