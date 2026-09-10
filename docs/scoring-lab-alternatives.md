# Scoring lab — alternative variations

Context for the experimental leaderboard score on `/tournament-results/scoring-lab`
(see `src/lib/scoring/`). The lab currently implements the **System B** family:

```
A       = Σ participation points                       (flat, not scaled)
        + Σ place weight × coefficient(event)          (scaled by field size)

adjPpg  = (A + shrinkage · avgPpg) / (participations + shrinkage)
eff     = (adjPpg / avgPpg) ^ efficiencyExponent
decay   = decayBase ^ max(0, missedTournaments − decayGrace)

S       = A × eff × decay
```

Decisions already settled:

- All-time cumulative board; activity is rewarded on purpose.
- "Additive with a rate guardrail" (option B), strong efficiency multiplier (option c).
- Shrinkage on, K = 2. K = 0 lets lucky short records through; K = 4 buries genuine
  short-sample performers (Michael loses his top-25% team spot).
- Difficulty coefficient by field size: head count for single events, team count
  (`participants / 2`, rounded up so a solo player is still a full team) for team
  events, normalised so a median-sized event is 1.0×.
- Coefficient scales podium points only, never participation points.
- Inactivity handled by a gradual decay (option a), not a cliff.
- Gut-truth T1 ("Marcel above Moritz W. on team") was dropped: it is incompatible
  with rewarding large fields, because Moritz W. won the biggest tournament on
  record and Marcel did not reach that podium.

Open knobs on the page: participation point, 1st-place weight, coefficient shape,
shrinkage K, efficiency exponent k, decay base d, decay grace G.

---

## Worth adding as lab variants

### 1. Decay scope — spare the "banked" points

Today `S = A × eff × decay`, so a returning player's *participation history* is also
multiplied down. Alternative: apply decay only to the podium portion (or only to the
efficiency input), leaving accumulated appearances untouched — "your podiums go stale,
your loyalty does not". Cheap to add; changes how punishing a comeback feels.

### 2. Recency half-life instead of a cliff

Instead of "full points forever, then a malus once you stop showing up", weight *every*
result by how recent it is (e.g. halve the weight every ~8 tournaments). Inactivity is
then handled for free — old results fade for everyone, so a player who drifts away slides
down without a special-cased penalty. Arguably the principled version of the inactivity
malus. Bigger conceptual shift, so worth seeing side by side.

### 3. Calendar time, not tournament count

"Missed 5 tournaments" means something very different across a busy month vs. a two-year
gap. Keying the decay to *months since last appearance* matches how people actually think
about who is still active. Small change, more intuitive.

---

## Decisions to settle (not "try and compare")

### 4. Coefficient anchor

Difficulty is normalised to the *median* event size. As the group grows, that median
drifts and every historical coefficient silently shifts. A fixed anchor ("a 10-player
tournament = 1.0×") keeps past values stable — better for a system meant to last.
Recommendation: switch to a fixed anchor.

### 5. One number or two

The lab collapses everything into a single `Score`. The current shipped table already
shows five columns and people sort by them. Keeping **Gesamtpunkte** (pure additive,
difficulty-weighted) and **Form/Quote** (the efficiency factor) as two visible columns,
sorted by total, is more transparent and less "magic coefficient". Decide before
committing to the single-score presentation.

### 6. Team win credit

Both members of a winning two-person team currently get the full win points. Fine ("you
won"), but the alternative is to split the points between team-mates. Flag and choose.

---

## Dead ends / blocked

### 7. A real rating system (Elo / Glicko / TrueSkill)

The "correct" way to measure strength and field difficulty, but: not cumulative, so it
does not reward activity (contradicts the goal); needs far more than 17 events to
stabilise; opaque for a friend group. Not worth it here.

### 8. Percentile / full-standings scoring

Scoring every player by where they finished in the field would fold in difficulty *and*
consistency cleanly — but `tournaments.json` records only places 1–3 plus the participant
list. Possible only if the full finishing order starts being recorded.

---

## Suggested next step

Build **1–3** into the lab as toggles, settle **4** (fixed anchor) and **5** (two columns
vs one) now, and leave the rest.
