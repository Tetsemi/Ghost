const perkDataMap = {
    blood_born_survivor: {
        name: "perk_blood_born_survivor-u",
        flavor: "perk_blood_born_survivor_flavor-u",
        description: "perk_blood_born_survivor_description-u",
        cost: 15,
        usage_limit: ["scene", "session"]
    },
    combat_veteran: {
        name: "perk_combat_veteran-u",
        flavor: "perk_combat_veteran_flavor-u",
        description: "perk_combat_veteran_description-u",
        cost: 10,
		affected_skill: "dodge",
        usage_limit: "session"
    },
    corp_groomed: {
        name: "perk_corp_groomed-u",
        flavor: "perk_corp_groomed_flavor-u",
        description: "perk_corp_groomed_description-u",
        cost: 10,
		affected_skill: "deception",
		affected_skill_group: "etiquette",
        usage_limit: "session"
    },
    danger_sense: {
        name: "perk_danger_sense-u",
        flavor: "perk_danger_sense_flavor-u",
        description: "perk_danger_sense_description-u",
        cost: 15,
		affected_skill: "perception",
        usage_limit: "session"
    },
    dirty_fighter: {
        name: "perk_dirty_fighter-u",
        flavor: "perk_dirty_fighter_flavor-u",
        description: "perk_dirty_fighter_description-u",
        cost: 10,
        usage_limit: "scene"
    },
    forgettable_presence: {
        name: "perk_forgettable_presence-u",
        flavor: "perk_forgettable_presence_flavor-u",
        description: "perk_forgettable_presence_description-u",
        cost: 10,
		affected_skill: "stealth",
        usage_limit: ""
    },
    linguist: {
        name: "perk_linguist-u",
        flavor: "perk_linguist_flavor-u",
        description: "perk_linguist_description-u",
        cost: 10,
		/* Handled in sheet worker code - skill point allocation and trained */
        usage_limit: ""
    },
    mind_leash: {
        name: "perk_mind_leash-u",
        flavor: "perk_mind_leash_flavor-u",
        description: "perk_mind_leash_description-u",
        cost: 15,
        usage_limit: "session"
    },
    photographic_recall: {
        name: "perk_photographic_recall-u",
        flavor: "perk_photographic_recall_flavor-u",
        description: "perk_photographic_recall_description-u",
        cost: 10,
        usage_limit: ""
    },
    resilient_frame: {
        name: "perk_resilient_frame-u",
        flavor: "perk_resilient_frame_flavor-u",
        description: "perk_resilient_frame_description-u",
        cost: 10,
        usage_limit: ""
    },
    scorched_soul: {
        name: "perk_scorched_soul-u",
        flavor: "perk_scorched_soul_flavor-u",
        description: "perk_scorched_soul_description-u",
        cost: 10,
        usage_limit: ""
    },
    shadow_mark: {
        name: "perk_shadow_mark-u",
        flavor: "perk_shadow_mark_flavor-u",
        description: "perk_shadow_mark_description-u",
        cost: 15,
        usage_limit: ""
    },
    tactical_instinct: {
        name: "perk_tactical_instinct-u",
        flavor: "perk_tactical_instinct_flavor-u",
        description: "perk_tactical_instinct_description-u",
        cost: 15,
        usage_limit: "session"
    },
    veil_drenched_intuition: {
        name: "perk_veil_drenched_intuition-u",
        flavor: "perk_veil_drenched_intuition_flavor-u",
        description: "perk_veil_drenched_intuition_description-u",
        cost: 15,
        usage_limit: "session"
    }
};
