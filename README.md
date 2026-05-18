# Shove·Lab

An MTT poker training tool with Nash equilibrium push/fold ranges, ICM-aware
decisions, and built-in coaching that explains the "why" before and after
every action.

Inspired by GTO Wizard, but with a focus on **teaching the thought process**
rather than just showing the solver's answer. Every spot can be drilled with
or without coaching, and the session review tracks where you're leaking.

## Features

- **Three training modes**
  - **Open Shove** — folded to you, decide whether to jam (6–15bb)
  - **Call** — villain shoves, decide whether to call all-in
  - **Reshove** — villain min-raises, decide whether to jam over (10–25bb)

- **Learn** — 8 foundation lessons covering position, pot odds, required
  equity, hand-vs-hand equity, outs counting, fold equity, ICM, and how
  it all comes together in short-stack strategy. Each lesson links to the
  relevant drill.

- **Drills** — six fast-paced math drills with per-drill accuracy and
  average-time tracking:
  - Pot odds (free input)
  - Required equity (multiple choice)
  - Hand-vs-hand equity (50+ matchups, multiple choice)
  - Outs counting + rule-of-4-and-2 application
  - Fold equity / breakeven calculations
  - Hand-rankings A/B comparison

- **Tournament stage selector** — Chip EV, Mid (ITM), Bubble, Final Table, or Custom ICM
  - Stage-based heuristic multipliers for quick play
  - **Custom ICM** uses the Malmuth-Harville algorithm with your stacks + payouts

- **Range Viewer** — 13×13 hand grid color-coded by Nash threshold
- **Session Review** — accuracy breakdown by mode, position, stage; identifies your worst leaks
- **Coaching toggle** — turn explanations on for learning, off for testing
- **4-color GGPoker deck** with Triton-broadcast-style card visuals
- **Flexible table** — Heads-Up, 3-max, 6-max, or 9-max

## Tech Stack

- React 18 (functional components + hooks)
- Vite for dev/build
- Pure CSS-in-JS (no styling library — keeps the bundle tiny)
- No backend yet (state lives in-memory; session resets on refresh)

## Setup

```bash
npm install
npm run dev          # local dev server at http://localhost:5173
npm run build        # production build into ./dist
npm run preview      # preview the production build
```

## Project Structure

```
src/
├── App.jsx                       # thin wrapper around the trainer
├── main.jsx                      # React entry point
├── index.css                     # global reset
├── components/
│   ├── PushFoldTrainer.jsx       # main orchestrator (tabs + state)
│   ├── TritonCard.jsx            # GGPoker 4-color card visual
│   ├── MiniTable.jsx             # interactive seat-count + position SVG table
│   ├── RangeViewer.jsx           # 13×13 hand grid, color-coded
│   ├── SessionReview.jsx         # trainer-hand stats + leak detection
│   ├── ICMSetup.jsx              # custom stacks + payouts editor
│   ├── LearnView.jsx             # lesson list + reader
│   ├── DrillsView.jsx            # drill picker + per-drill stats
│   ├── ChipRow.jsx               # reusable chip-style picker
│   └── drills/
│       ├── DrillShared.jsx       # frame, choice button, number input, feedback
│       ├── PotOddsDrill.jsx
│       ├── RequiredEquityDrill.jsx
│       ├── HandVsHandDrill.jsx
│       ├── OutsDrill.jsx
│       ├── FoldEquityDrill.jsx
│       └── HandRankingDrill.jsx
├── data/
│   ├── pushRanges.js             # Nash open-shove ranges by position
│   ├── callRanges.js             # call ranges vs different shover positions
│   ├── reshoveRanges.js          # reshove ranges over a min-raise
│   ├── tableConfigs.js           # HU / 3-max / 6-max / 9-max definitions
│   ├── icmStages.js              # stage-based ICM multipliers
│   ├── equityMatchups.js         # precomputed preflop heads-up equities
│   └── lessons.js                # lesson content (data, not JSX)
└── lib/
    ├── handUtils.js              # rank constants, hand-code, random dealing
    ├── decisionLogic.js          # optimal action + threshold lookups
    ├── reasoning.js              # template-based coaching text generation
    ├── oddsCalc.js               # pot odds, outs-to-equity, fold equity math
    └── icm.js                    # Malmuth-Harville ICM equity calculator
```

The split is deliberate: `data/` holds raw lookup tables (no logic), `lib/`
holds pure functions (no React), `components/` holds the UI (no math). Adding
a new training mode means a new file in `data/`, a few functions in `lib/`,
and either extending `PushFoldTrainer.jsx` or adding a new view component.

## Roadmap

- [ ] LLM-generated explanations (currently template-based — the hooks in `lib/reasoning.js` are ready for the swap)
- [ ] Persistent storage so session history survives a refresh
- [ ] User accounts + cloud sync
- [ ] 3-bet defense module (facing a 2.5-3x raise)
- [ ] Postflop play (requires a solver dataset)
- [ ] Mobile-responsive layout
- [ ] Custom range import (paste your own solver ranges)

## Data Sources

Push/call/reshove ranges are approximated from publicly published Nash
equilibrium charts (HoldemResources, ICMIZER, SnGWiz). They are accurate to
the strategic concept and within a couple of bb of true solver outputs for
the spots covered. ICM in Custom mode uses the standard Malmuth-Harville
recursive algorithm — accurate for short-handed final tables.

For a launched product we'd want to replace the approximated thresholds
with a fresh solver run, but the architecture is the same: JSON lookup
keyed by `(position, hand_code) → threshold_bb`.

## License

Personal/educational use. Not affiliated with GTO Wizard, GGPoker, Triton
Poker, or any commercial poker tool.
