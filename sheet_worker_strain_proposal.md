# Sheet Worker Proposal: Tracker Strain Deduction

---

## Overview

When a player checks a tracker checkbox for a per-scene or per-session talent, the sheet
worker automatically rolls the talent's strain value, deducts the result from current Strain,
and sends a public chat message with the talent name, economy type, tag, and amount spent.
Clearing the scene or session tracker does not refund any Strain previously spent.

---

## Strain Rules Reference

- Strain costs must always be paid in full.
- If a roll would reduce Strain below 0, Strain floors at 0 — the partial cost is absorbed.
- At 0 Strain, the character becomes **Exhausted**: only one total action per round (Action,
  Maneuver, or Reaction), and cannot spend Strain or activate abilities that require it.
- A talent **cannot be activated** if the character is already at 0 Strain and the talent has
  a non-zero cost.
- When Strain hits 0, the worker automatically writes **Exhausted** to the first empty status
  field (`attr_status1` through `attr_status4`). If all four status fields are occupied,
  the chat message flags it instead:
  > *"[Character Name] is Exhausted — no status slot available. Add manually."*
- When Strain rises above 0 (via manual adjustment or recovery), the worker removes
  **Exhausted** from whichever status field holds it, if present.

---

## Trigger

Watch `attr_used_scene_<career>_<talent>` and `attr_used_session_<career>_<talent>` attributes.

- Value changes `0 → 1`: fire the strain deduction worker
- Value changes `1 → 0`: silently ignored — no refund

---

## Worker Flow

1. Check the `attr_clearing_tracker` flag — if `"1"`, skip entirely
2. Look up the talent key from the attribute name
3. Find the strain value, economy type, and tag from careerDataMap
4. If strain is `""` or `"0"` — no deduction, no roll, still send chat message
5. If strain has a non-zero cost, check current Strain:
   - If current Strain is already 0 — block activation, send blocked message, uncheck the box
   - If current Strain is above 0 — proceed
6. If strain is a fixed value (e.g. `"2"`) — deduct directly, no roll
7. If strain is a dice expression (e.g. `"1d6"`, `"1d4+1"`) — roll it, deduct result
8. Floor current Strain at 0 — if the roll exceeds remaining Strain, Strain becomes 0
9. Write new Strain value to sheet
10. Send public chat message

---

## Chat Message Format

All activations send a public message regardless of cost or economy type.

```
[Character Name] uses [Talent Name] ([Economy] — [Tag])
Strain Cost: [result] ([expression if dice])
Remaining Strain: [current] / [max]
```

### Examples

```
Kira Voss uses Flashstep (Free Action — Mobility)
Strain Cost: 2
Remaining Strain: 4 / 7

Maren Cole uses Strain Buffer (Passive — Strain Increase)
Strain Cost: 0
Remaining Strain: 7 / 7

Dex uses Eye of the Storm (Free Action — Veil Trance)
Strain Cost: 4 (1d6)
Remaining Strain: 3 / 7

Rook uses Severing Round (Action — Attack)
Strain Cost: 5 (1d6)
Remaining Strain: 2 / 7

Rook uses Flashstep (Free Action — Mobility)
⚠ Cannot activate — Rook is Exhausted (0 Strain remaining).
```

### Floored at 0 Example

```
Dex uses Stormcaller's Edge (Free Action — Overchannel)
Strain Cost: 4 (1d6) — Strain floored at 0 (2 unspent)
Remaining Strain: 0 / 7
```

---

## Economy Display Mapping

| Raw value          | Display          |
|--------------------|------------------|
| `free_action`      | Free Action      |
| `action`           | Action           |
| `reaction`         | Reaction         |
| `maneuver`         | Maneuver         |
| `passive`          | Passive          |
| `special_immediate`| Special Immediate|
| `special`          | Special          |

---

## Tag Display

snake_case converted to Title Case:

| Raw value        | Display        |
|------------------|----------------|
| `strain_increase`| Strain Increase|
| `veil_trance`    | Veil Trance    |
| `follow_up`      | Follow Up      |

---

## Clear Scene / Clear Session Guard

Before the clear fires, set `attr_clearing_tracker = "1"`. The worker checks this flag at
the top of its handler and skips all deduction and messaging if it is set. After the clear
completes, reset the flag to `"0"`. This ensures bulk checkbox resets never trigger false
strain costs or chat spam.

---

## Accidental Check

No refund on uncheck. Strain is a committed resource — unchecking is silently ignored by
the worker. A static reminder appears near the tracker panel:

> *"Activating a talent spends its Strain cost. To correct a mistake, adjust your Strain
> total manually using the ± button."*

---

## Visibility

All messages are sent publicly — visible to the active player, all other players, and the
GM. No whisper mode. GM visibility of Strain expenditure in real time is considered a feature.

---

## Scope

The tracker worker handles **scene and session** talents and traits only.

| Source                  | Scene | Session | Total trackable |
|-------------------------|-------|---------|-----------------|
| Career talents          | 291   | 241     | 532             |
| Ancestry traits         | 4     | 15      | 19              |
| Ancestry talents        | 50    | 73      | 123             |
| **Total**               | **345** | **329** | **674**       |

At-will talents (145 total) have no tracker checkbox and are out of scope for this worker.
If at-will strain tracking is needed in the future, a separate button-based mechanism would
be required.

---

## Resolved Questions

1. **Career name in chat?** — Talent name only. No career prefix.
2. **Strain floored at 0?** — Yes, flag it in the message so the player knows the full cost
   was not paid (see floored example above).
3. **At-will talents?** — Out of scope. No checkbox to watch.
