const talentDataMap = {
  alteri: {
    second_skin: {
      name: "Second Skin",
      description: "You gain an additional Mask—a fully realized persona with a name, appearance, and backstory. Switching to this Mask takes 1 Action and no longer imposes Strain unless done under stress (GM discretion).",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    reflexive_shift: {
      name: "Reflexive Shift",
      description: "Once per scene, as a Reaction, rapidly alter your appearance (hair, skin tone, voice, etc.) to avoid identification. Grants a bonus die to Disguise or deception-based Deception. Costs 1d4 Strain.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    echoed_voice: {
      name: "Echoed Voice",
      description: "Once per session, mimic the voice and speech of someone known to you or studied for at least one full scene. Grants a bonus die to Performance (Impersonation) or any roll to pass as the individual.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    maskwrights_grace: {
      name: "Maskwright’s Grace",
      description: "Choose one: gain +10% to Disguise, Insight, or Performance (Impersonation). This choice is permanent and may only be taken once.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    social_chameleon: {
      name: "Social Chameleon",
      description: "Use Charm in place of Deception or Persuade when navigating unfamiliar cultures or coded social environments.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    ghost_protocol: {
      name: "Ghost Protocol",
      description: "Once per session, erase your trail. Gain a bonus die to Stealth or Slicing when spoofing ID, bypassing basic surveillance, or escaping recognition. If followed by a successful Disguise, it leaves no trace.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    shaped_for_subtlety: {
      name: "Shaped for Subtlety",
      description: "Choose one: gain +10% to Stealth, Slicing, or Insight. This choice is permanent and may only be taken once.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    whisper_touched: {
      name: "Whisper-Touched",
      description: "Once per session, gain a bonus die when casting Illusion or Enchantment spells.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
    grace_of_the_many: {
      name: "Grace of the Many",
      description: "Once per session, reroll a failed Disguise, Insight, or Stealth check. Take the better result.",
      prerequisite: "",
      tier: 1,
      cost: "10XP",
      capstone: false
    },
	facial_recalibration: {
      name: "Facial Recalibration",
      description: "Once per session, mimic a person’s face, posture, and speech after observing them for at least one turn. Grants a bonus die to Disguise or Performance (Impersonation). Costs 1 Strain.",
      prerequisite: ["echoed_voice", "second_skin"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    adaptive_memory: {
      name: "Adaptive Memory",
      description: "Once per session, recall useful details from a person you've interacted with in person. Gain a bonus die to a social roll involving deception or impersonation with them or their associates.",
      prerequisite: ["social_chameleon", "maskwrights_grace"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    shift_reflex: {
      name: "Shift Reflex",
      description: "Once per scene, use a Reaction to confuse a target mid-scan or strike. Gain a bonus die to Dodge or Stealth.",
      prerequisite: ["reflexive_shift"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    deep_mask_integration: {
      name: "Deep Mask Integration",
      description: "Gain +10% to Disguise or Insight (your choice). You may maintain two active Masks and switch between them without prep or Strain outside combat.",
      prerequisite: ["second_skin"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    ghost_signature: {
      name: "Ghost Signature",
      description: "Once per session, spoof or bypass a low-grade biometric scan (e.g., facial recognition, voiceprint, retinal) with a bonus die to Slicing or Electronics.",
      prerequisite: ["ghost_protocol"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    mirror_weave: {
      name: "Mirror Weave",
      description: "Once per session, illusions or enchantments you cast can deceive digital or mechanical observers. Costs 1 Strain per additional ally affected. Cannot deceive hostile systems.",
      prerequisite: ["whisper_touched"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    persona_anchor: {
      name: "Persona Anchor",
      description: "Choose one: gain +10% to Performance (Impersonation), Arcana, or Slicing. Reflects how your persona enhances certain skills.",
      prerequisite: ["grace_of_the_many"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    veil_echo_memory: {
      name: "Veil Echo Memory",
      description: "Once per session, gain a sensory impression or memory from a place or person you've touched. Grants a bonus die to the next Arcana, Insight, or Occult Lore roll. Costs 1 Strain.",
      prerequisite: ["whisper_touched", "ghost_protocol"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
    silent_archive: {
      name: "Silent Archive",
      description: "Store a secondary identity with full recall: appearance, history, contacts, accent, and routine. Once per session, switch instantly. Costs 1d4 Strain if used during a scene. Free outside scenes.",
      prerequisite: ["deep_mask_integration"],
      tier: 2,
      cost: "20XP",
      capstone: false
    },
	perfect_mimicry: {
      name: "Perfect Mimicry",
      description: "Once per session, flawlessly replicate a person’s full persona (appearance, mannerisms, tone). Grants a bonus die to Disguise, Performance, or Deception.",
      prerequisite: ["facial_recalibration", "echoed_voice"],
      tier: 3,
      cost: "30XP",
      capstone: false
    },
    biometric_phantom: {
      name: "Biometric Phantom",
      description: "Once per session, spoof or override corporate-grade biometric or magitech ID systems if you've had contact with the target. Bonus die to Slicing or Electronics.",
      prerequisite: ["ghost_signature"],
      tier: 3,
      cost: "30XP",
      capstone: false
    },
    memory_graft: {
      name: "Memory Graft",
      description: "Once per session, tap into a stored Mask’s memory for insight. Gain a bonus die to one Arcana, Insight, or Performance (Impersonation) roll tied to that persona’s experience.",
      prerequisite: ["deep_mask_integration"],
      tier: 3,
      cost: "30XP",
      capstone: false
    },
    veil_shaped_will: {
      name: "Veil-Shaped Will",
      description: "Once per session, reroll a failed Illusion, Alteration, or Enchantment spellcasting. If successful, reduce the Strain die by one step (e.g., 1d6 → 1d4).",
      prerequisite: ["mirror_weave", "whisper_touched"],
      tier: 3,
      cost: "30XP",
      capstone: false
    },
    social_echo: {
      name: "Social Echo",
      description: "Once per session, adapt your behavior to match a target’s subconscious expectations. Gain a bonus die to Charm, Deception, or Persuade. Costs 1 Strain if targeting two or more people.",
      prerequisite: ["social_chameleon", "adaptive_memory"],
      tier: 3,
      cost: "30XP",
      capstone: false
    },
    identity_cascade: {
      name: "Identity Cascade",
      description: "Once per scene, switch Masks mid-encounter (even mid-dialogue or mid-combat). Grants a bonus die to Disguise or Insight. Costs 1d4 Strain if under pressure or direct observation.",
      prerequisite: ["deep_mask_integration"],
      tier: 3,
      cost: "30XP",
      capstone: false
    },
	immaculate_impersonation: {
      name: "Immaculate Impersonation",
      description: "Once per session, flawlessly impersonate a known target—down to retinal scan, bio-sig, and vocal cadence. Bonus die to all Disguise, Slicing, or Performance (Impersonation) checks for the entire scene.",
      prerequisite: ["perfect_mimicry", "biometric_phantom"],
      tier: 4,
      cost: "40XP",
      capstone: true
    },
    living_mask_archive: {
      name: "Living Mask Archive",
      description: "Maintain up to four active Masks. Once per session, instantly switch between any of them. Grants a bonus die to your next social or Stealth roll. Costs 1 Strain if used during a scene.",
      prerequisite: ["memory_graft", "identity_cascade"],
      tier: 4,
      cost: "40XP",
      capstone: true
    },
    veil_mirroring_ritual: {
      name: "Veil-Mirroring Ritual",
      description: "Once per session, reflect a single Illusion or Enchantment spell cast on you, or redirect it to another visible target. Spell must be reflectable by nature.",
      prerequisite: ["veil_shaped_will"],
      tier: 4,
      cost: "40XP",
      capstone: true
    },
    author_of_the_lie: {
      name: "Author of the Lie",
      description: "Once per session, automatically succeed on a Disguise, Performance, or Deception roll involving deception. You may declare one falsehood about your Mask as true for the rest of the scene. Costs 2 Strain if used under direct scrutiny or in a digital surveillance zone.",
      prerequisite: ["social_echo", "deep_mask_integration"],
      tier: 4,
      cost: "40XP",
      capstone: true
    }
  }
};
