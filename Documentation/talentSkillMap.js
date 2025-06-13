// Skills that Talents make available to add skill points.
// This should be merged with talentDataMap to unify
const talentSkillMap = {
  alteri: {
    maskwrights_grace: {
      disguise: "Disguise", impersonation: "Impersonation", insight: "Insight"
    },
    shaped_for_subtlety: {
      insight: "Insight", slicing: "Slicing", stealth: "Stealth"
    },
	deep_mask_integration: {
	  disguise: "Disguise", insight: "Insight"
	},
	persona_anchor: {
	  arcana: "Arcana", impersonation: "Impersonation", slicing: "Slicing"
	}
  },
  draevi: {
    clan_blooded: {
      intimidate: "Intimidate", survival_wilderness: "Survival (Wilderness)", track: "Track"
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
      // Checkbox will add -10 to Skill Point Total to indicate the choice.
    },
	cross_trained: {
	  // Checkbox will add -10 to Skill Point Total to indicate the choice.
	},
	master_of_none: {
	  // Checkbox will add -30 to Skill Point Total to indicate the choice.
	}
  },
  lyranni: {
	threadwalker : {
	  arcana: "Arcana", occult: "Occult Lore", spirit_lore: "Spirit Lore"
	},
    aether_override: {
      electronics: "Electronics", mechanics: "Mechanics", slicing: "Slicing"
    },
    echo_in_the_veins: {
      chant: "Chant", dance: "Dance", impersonation: "Impersonation", instrument: "Instrument", singing: "Singing", insight: "Insight", streetwise: "Streetwise"
    },
	veilsplice : {
	  electronics: "Electronics", slicing: "Slicing"
	}
  }
};
