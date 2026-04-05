const perkDataMap = {
	blood_born_survivor: {
		name: "perk_blood_born_survivor-u",
		flavor: "perk_blood_born_survivor_flavor-u",
		description: "perk_blood_born_survivor_description-u",
		cost: 15,
		usage_limit: "campaign",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	combat_veteran: {
		name: "perk_combat_veteran-u",
		flavor: "perk_combat_veteran_flavor-u",
		description: "perk_combat_veteran_description-u",
		cost: 10,
		affected_skill: [ "dodge" ],
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	corp_groomed: {
		name: "perk_corp_groomed-u",
		flavor: "perk_corp_groomed_flavor-u",
		description: "perk_corp_groomed_description-u",
		cost: 10,
		affected_skill: [ "deception" ],
		affected_skill_group: "etiquette",
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	danger_sense: {
		name: "perk_danger_sense-u",
		flavor: "perk_danger_sense_flavor-u",
		description: "perk_danger_sense_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	dirty_fighter: {
		name: "perk_dirty_fighter-u",
		flavor: "perk_dirty_fighter_flavor-u",
		description: "perk_dirty_fighter_description-u",
		cost: 10,
		usage_limit: "scene",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	final_stand: {
		name: "perk_final_stand-u",
		flavor: "perk_final_stand_flavor-u",
		description: "perk_final_stand_description-u",
		cost: 15,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	forgettable_presence: {
		name: "perk_forgettable_presence-u",
		flavor: "perk_forgettable_presence_flavor-u",
		description: "perk_forgettable_presence_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	hard_preparation: {
		name: "perk_hard_preparation-u",
		flavor: "perk_hard_preparation_flavor-u",
		description: "perk_hard_preparation_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	institutional_weight: {
		name: "perk_institutional_weight-u",
		flavor: "perk_institutional_weight_flavor-u",
		description: "perk_institutional_weight_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	last_clear_thought: {
		name: "perk_last_clear_thought-u",
		flavor: "perk_last_clear_thought_flavor-u",
		description: "perk_last_clear_thought_description-u",
		cost: 15,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	linguist: {
		name: "perk_linguist-u",
		flavor: "perk_linguist_flavor-u",
		description: "perk_linguist_description-u",
		cost: 10,
		/* Handled in sheet worker code - skill point allocation and trained */
		usage_limit: "",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	mind_leash: {
		name: "perk_mind_leash-u",
		flavor: "perk_mind_leash_flavor-u",
		description: "perk_mind_leash_description-u",
		cost: 15,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	photographic_recall: {
		name: "perk_photographic_recall-u",
		flavor: "perk_photographic_recall_flavor-u",
		description: "perk_photographic_recall_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	resilient_frame: {
		name: "perk_resilient_frame-u",
		flavor: "perk_resilient_frame_flavor-u",
		description: "perk_resilient_frame_description-u",
		cost: 10,
		usage_limit: "scene",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	scorched_soul: {
		name: "perk_scorched_soul-u",
		flavor: "perk_scorched_soul_flavor-u",
		description: "perk_scorched_soul_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	shadow_mark: {
		name: "perk_shadow_mark-u",
		flavor: "perk_shadow_mark_flavor-u",
		description: "perk_shadow_mark_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	tactical_instinct: {
		name: "perk_tactical_instinct-u",
		flavor: "perk_tactical_instinct_flavor-u",
		description: "perk_tactical_instinct_description-u",
		cost: 15,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	veil_anchor: {
		name: "perk_veil_anchor-u",
		flavor: "perk_veil_anchor_flavor-u",
		description: "perk_veil_anchor_description-u",
		cost: 15,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	},
	veil_drenched_intuition: {
		name: "perk_veil_drenched_intuition-u",
		flavor: "perk_veil_drenched_intuition_flavor-u",
		description: "perk_veil_drenched_intuition_description-u",
		cost: 10,
		usage_limit: "session",
		source: { doc: "perks_and_flaws-u", version: "2.260125", date: "2026-01-25", section: "perks_and_flaws-u" }
	}
};
