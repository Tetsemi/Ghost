const backgroundDataMap = {
	academic: {
		name: "academic-u",
		trained_skills: {
			choose_total: 5,
			options: [ 
				"anthropology", "archaeology", "architecture", "history", "investigation", "law", "occult_lore" 
			],
			group_rules: [
				{
					group: "science",
					allow_additional: true,
					max_additional_picks: 1,
					exclude_explicit_options: true
				}
			]
		},
		feature: {
			name: "contextual_analysis-u",
			description: "contextual_analysis_desc-u",
			usage_limit: "session",
		},
		starting_kit: {
			choose: 1,
			options: {
				research_go_bag: {
					name: "research_go_bag-u",
					description: "research_go_bag_desc-u"
				},
				specialized_reference_cache: {
					name: "specialized_reference_cache-u",
					description: "specialized_reference_cache_desc-u"
				},
				field_analysis_tools: {
					name: "field_analysis_tools-u",
					description: "field_analysis_tools_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				archivist_or_librarian: {
					name: "archivist_or_librarian-u",
					description: "archivist_or_librarian_desc-u"
				},
				former_colleague: {
					name: "former_colleague-u",
					description: "former_colleague_desc-u"
				},
				institutional_liaison: {
					name: "institutional_liaison-u",
					description: "institutional_liaison_desc-u"
				}
			}
		}
	},
	corporate: {
		name: "corporate-u",
		trained_skills: {
			choose_total: 5,
			options: [ 
				"bureaucracy", "computer_use", "insight", "investigation", "law", "leadership", "persuade", "etiquette_corporate", "etiquette_high_society"
			],
			exclusive_skill_sets: [
				["etiquette_corporate", "etiquette_high_society"]
			]
		},
		feature: {
			name: "corporate_framing-u",
			description: "corporate_framing_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				corporate_credentials: {
					name: "corporate_credentials-u",
					description: "corporate_credentials_desc-u"
				},
				encrypted_commlink: {
					name: "encrypted_commlink-u",
					description: "encrypted_commlink_desc-u"
				},
				performance_archive: {
					name: "performance_archive-u",
					description: "performance_archive_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				middle_manager: {
					name: "middle_manager-u",
					description: "middle_manager_desc-u"
				},
				corporate_fixer: {
					name: "corporate_fixer-u",
					description: "corporate_fixer_desc-u"
				},
				disgruntled_analyst: {
					name: "disgruntled_analyst-u",
					description: "disgruntled_analyst_desc-u"
				}
			}
		}
	},
	devotee: {
		name: "devotee-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"occult_lore", "veil_lore",	"insight", "persuade", "intimidate", "history", "perform_ritual", "perform_vocal", "streetwise"
			],
			exclusive_skill_sets: [
				["perform_ritual", "perform_vocal"]
			]
		},
		feature: {
			name: "doctrine_before_fear-u",
			description: "doctrine_before_fear_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				ritual_implements: {
					name: "ritual_implements-u",
					description: "ritual_implements_desc-u"
				},
				hidden_doctrine_cache: {
					name: "hidden_doctrine_cache-u",
					description: "hidden_doctrine_cache_desc-u"
				},
				mark_of_the_faithful: {
					name: "mark_of_the_faithful-u",
					description: "mark_of_the_faithful_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				fellow_believer: {
					name: "fellow_believer-u",
					description: "fellow_believer_desc-u"
				},
				defector_or_heretic: {
					name: "defector_or_heretic-u",
					description: "defector_or_heretic_desc-u"
				},
				watcher_or_handler: {
					name: "watcher_or_handler-u",
					description: "watcher_or_handler_desc-u"
				}
			}
		}
	},
	enforcer: {
		name: "enforcer-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"firearms_handgun", "firearms_rifle", "firearms_shotgun", "firearms_smg", "first_aid", "insight", "interrogation", "investigation", "law", "leadership", "perception"
			],
			exclusive_skill_sets: [
				["firearms_handgun", "firearms_rifle", "firearms_shotgun",  "firearms_smg"]
			]
		},
		feature: {
			name: "command_presence-u",
			description: "command_presence_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				duty_gear: {
					name: "duty_gear-u",
					description: "duty_gear_desc-u"
				},
				personal_sidearm_package: {
					name: "personal_sidearm_package-u",
					description: "personal_sidearm_package_desc-u"
				},
				response_loadout: {
					name: "response_loadout-u",
					description: "response_loadout_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				former_partner: {
					name: "former_partner-u",
					description: "former_partner_desc-u"
				},
				department_insider: {
					name: "department_insider-u",
					description: "department_insider_desc-u"
				},
				private_security_handler: {
					name: "private_security_handler-u",
					description: "private_security_handler_desc-u"
				}
			}
		}
	},
	fringer: {
		name: "fringer-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"athletics", "coordination", "insight", "navigate", "perception", "streetwise",	"stealth", "survival_urban", "survival_wilderness",	"survival_veil_touched"
			],
			exclusive_skill_sets: [
				["survival_urban", "survival_wilderness", "survival_veil_touched"]
			]
		},
		feature: {
			name: "edge_sense-u",
			description: "edge_sense_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				scrap_survival_kit: {
					name: "scrap_survival_kit-u",
					description: "scrap_survival_kit_desc-u"
				},
				fringe_mobility_gear: {
					name: "fringe_mobility_gear-u",
					description: "fringe_mobility_gear_desc-u"
				},
				hidden_cache_marker: {
					name: "hidden_cache_marker-u",
					description: "hidden_cache_marker_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				fringe_fixer: {
					name: "fringe_fixer-u",
					description: "fringe_fixer_desc-u"
				},
				settlement_elder_or_organizer: {
					name: "settlement_elder_or_organizer-u",
					description: "settlement_elder_or_organizer_desc-u"
				},
				scavenger_guide: {
					name: "scavenger_guide-u",
					description: "scavenger_guide_desc-u"
				}
			}
		}
	},
	laborer: {
		name: "laborer-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"athletics", "coordination", "electronics", "first_aid", "mechanics", "security", "perception", "tradecraft"
			]
		},
		feature: {
			name: "work_through_it-u",
			description: "work_through_it_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				tool_harness: {
					name: "tool_harness-u",
					description: "tool_harness_desc-u"
				},
				protective_gear: {
					name: "protective_gear-u",
					description: "protective_gear_desc-u"
				},
				union_or_work_crew_token: {
					name: "union_or_work_crew_token-u",
					description: "union_or_work_crew_token_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				shift_foreman: {
					name: "shift_foreman-u",
					description: "shift_foreman_desc-u"
				},
				infrastructure_tech: {
					name: "infrastructure_tech-u",
					description: "infrastructure_tech_desc-u"
				},
				labor_fixer: {
					name: "labor_fixer-u",
					description: "labor_fixer_desc-u"
				}
			}
		}
	}
	media: {
		name: "media-u",
		trained_skills: {
			choose_total: 5,
			options: [ "charm", "computer_use", "deception", "insight", "investigation", "persuade", "streetwise", "tradecraft_media", "tradecraft_creative"
			],
			group_rules: [
				{
					group: "perform",
					allow_additional: true,
					max_additional_picks: 1,
					exclude_explicit_options: true
				}
			],
			exclusive_skill_sets: [
				["tradecraft_media", "tradecraft_creative"]
			]
		},

		feature: {
			name: "control_the_narrative-u",
			description: "control_the_narrative_desc-u",
			usage_limit: "session"
		},

		starting_kit: {
			choose: 1,
			options: {
				recording_kit: {
					name: "recording_kit-u",
					description: "recording_kit_desc-u"
				},
				influencer_rig: {
					name: "influencer_rig-u",
					description: "influencer_rig_desc-u"
				},
				press_credentials: {
					name: "press_credentials-u",
					description: "press_credentials_desc-u"
				}
			}
		},

		contacts: {
			choose: 1,
			options: {
				editor_or_producer: {
					name: "editor_or_producer-u",
					description: "editor_or_producer_desc-u"
				},
				info_broker: {
					name: "info_broker-u",
					description: "info_broker_desc-u"
				},
				audience_liaison: {
					name: "audience_liaison-u",
					description: "audience_liaison_desc-u"
				}
			}
		}
	},
	nomad: {
		name: "nomad-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"athletics", "deception", "listen",	"navigate",	"perception", "stealth", "streetwise", "survival_urban", "survival_veil_touched", "survival_wilderness"
			],
			exclusive_skill_sets: [
				["survival_urban", "survival_veil_touched", "survival_wilderness"]
			]
		},
		feature: {
			name: "always_an_exit-u",
			description: "always_an_exit_desc-u",
			usage_limit: "session"
		},

		starting_kit: {
			choose: 1,
			options: {
				travel_pack: {
					name: "travel_pack-u",
					description: "travel_pack_desc-u"
				},
				worn_map_set: {
					name: "worn_map_set-u",
					description: "worn_map_set_desc-u"
				},
				keepsake_relic: {
					name: "keepsake_relic-u",
					description: "keepsake_relic_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				transit_network_contact: {
					name: "transit_network_contact-u",
					description: "transit_network_contact_desc-u"
				},
				temporary_employer: {
					name: "temporary_employer-u",
					description: "temporary_employer_desc-u"
				},
				fellow_nomad: {
					name: "fellow_nomad-u",
					description: "fellow_nomad_desc-u"
				}
			}
		}
	},
	offworlder: {
		name: "offworlder-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"athletics", "coordination", "electronics",	"mechanics", "navigate", "perception", "physics", "engineering", "pilotaircraft", "pilotarc", "pilotboat"
			],
			exclusive_skill_sets: [
				[ "physics", "engineering" ],
				[ "pilotaircraft", "pilotarc", "pilotboat" ]
			]
		},
		feature: {
			name: "environmental_discipline-u",
			description: "environmental_discipline_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				vacuum_go_bag: {
					name: "vacuum_go_bag-u",
					description: "vacuum_go_bag_desc-u"
				},
				systems_toolkit: {
					name: "systems_toolkit-u",
					description: "systems_toolkit_desc-u"
				},
				transit_locker: {
					name: "transit_locker-u",
					description: "transit_locker_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				station_tech_or_dockmaster: {
					name: "station_tech_or_dockmaster-u",
					description: "station_tech_or_dockmaster_desc-u"
				},
				colony_logistics_contact: {
					name: "colony_logistics_contact-u",
					description: "colony_logistics_contact_desc-u"
				},
				former_crew_member: {
					name: "former_crew_member-u",
					description: "former_crew_member_desc-u"
				}
			}
		}
	},
	privileged: {
		name: "privileged-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"etiquette_high_society", "persuade", "charm", "leadership", "law", "insight", "history"
			],
			group_rules: [
				{
					group: "perform",
					allow_additional: true,
					max_additional_picks: 1,
					exclude_explicit_options: true
				}
			],
		},
		feature: {
			name: "social_gravity-u",
			description: "social_gravity_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				tailored_wardrobe: {
					name: "tailored_wardrobe-u",
					description: "tailored_wardrobe_desc-u"
				},
				encrypted_personal_device: {
					name: "encrypted_personal_device-u",
					description: "encrypted_personal_device_desc-u"
				},
				family_relic: {
					name: "family_relic-u",
					description: "family_relic_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				family_connection: {
					name: "family_connection-u",
					description: "family_connection_desc-u"
				},
				corporate_or_political_insider: {
					name: "corporate_or_political_insider-u",
					description: "corporate_or_political_insider_desc-u"
				},
				social_fixer: {
					name: "social_fixer-u",
					description: "social_fixer_desc-u"
				}
			}
		}
	},
	streetborn: {
		name: "streetborn-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"deception", "insight", "intimidate", "listen", "perception", "persuade", "sleight_of_hand", "streetwise"
			]
		},
		feature: {
			name: "read_the_room-u",
			description: "read_the_room_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				everyday_carry: {
					name: "everyday_carry-u",
					description: "everyday_carry_desc-u"
				},
				back_alley_gear: {
					name: "back_alley_gear-u",
					description: "back_alley_gear_desc-u"
				},
				personal_stash: {
					name: "personal_stash-u",
					description: "personal_stash_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				neighborhood_fixer: {
					name: "neighborhood_fixer-u",
					description: "neighborhood_fixer_desc-u"
				},
				street_medic_or_fence: {
					name: "street_medic_or_fence-u",
					description: "street_medic_or_fence_desc-u"
				},
				old_crew_contact: {
					name: "old_crew_contact-u",
					description: "old_crew_contact_desc-u"
				}
			}
		}
	},
	survivor: {
		name: "survivor-u",
		trained_skills {
			choose_total: 5,
			options: [
				"athletics", "first_aid", "insight", "navigate", "perception", "stealth", "streetwise", "survival_urban", "survival_veil_touched", "survival_wilderness"
			],
			exclusive_skill_sets: [
				[ "survival_urban", "survival_veil_touched", "survival_wilderness" ]
			]
		},
		feature: {
			name: "keep_moving-u",
			description: "keep_moving_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				go_bag: {
					name: "go_bag-u",
					description: "go_bag_desc-u"
				},
				worn_map_set: {
					name: "worn_map_set-u",
					description: "worn_map_set_desc-u"
				},
				keepsake_relic: {
					name: "keepsake_relic-u",
					description: "keepsake_relic_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				refuge_network_contact: {
					name: "refuge_network_contact-u",
					description: "refuge_network_contact_desc-u"
				},
				smuggler_or_guide: {
					name: "smuggler_or_guide-u",
					description: "smuggler_or_guide_desc-u"
				},
				fellow_survivor: {
					name: "fellow_survivor-u",
					description: "fellow_survivor_desc-u"
				}
			}
		}
	},
	underworld: {
		name: "underworld-u",
		trained_skills: {
			choose_total: 5,
			options: [
				"streetwise", "deception", "intimidate", "sleight_of_hand", "security",	"forgery", "perception", "persuade"
			]
		},
		feature: {
			name: "known_quantity-u",
			description: "known_quantity_desc-u",
			usage_limit: "session"
		},
		starting_kit: {
			choose: 1,
			options: {
				burner_package: {
					name: "burner_package-u",
					description: "burner_package_desc-u"
				},
				concealment_rig: {
					name: "concealment_rig-u",
					description: "concealment_rig_desc-u"
				},
				debt_marker: {
					name: "debt_marker-u",
					description: "debt_marker_desc-u"
				}
			}
		},
		contacts: {
			choose: 1,
			options: {
				fixer: {
					name: "fixer-u",
					description: "fixer_desc-u"
				},
				fence: {
					name: "fence-u",
					description: "fence_desc-u"
				},
				enforcer_or_crew_mate: {
					name: "enforcer_or_crew_mate-u",
					description: "enforcer_or_crew_mate_desc-u"
				}
			}
		}
	}
};



