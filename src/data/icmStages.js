// Tournament stage multipliers applied to Nash thresholds. Heuristic — used
// when not in CUSTOM mode. Calls tighten much more than pushes because no
// fold equity is available on a call decision.

export const ICM_STAGES = {
  CHIP_EV: {
    label: "Chip EV",
    description: "Early/mid tournament. Pure Nash.",
    pushMult: 1.0, callMult: 1.0, reshoveMult: 1.0,
  },
  MID: {
    label: "Mid (ITM near)",
    description: "Approaching the money. Slight tightening.",
    pushMult: 0.95, callMult: 0.85, reshoveMult: 0.92,
  },
  BUBBLE: {
    label: "Bubble",
    description: "On or near the money bubble. Calls dramatically tighter.",
    pushMult: 0.90, callMult: 0.60, reshoveMult: 0.80,
  },
  FT: {
    label: "Final Table",
    description: "Pay jumps are large. Calls and reshoves tighten heavily.",
    pushMult: 0.85, callMult: 0.55, reshoveMult: 0.72,
  },
  CUSTOM: {
    label: "Custom ICM",
    description: "Calculated from your stacks + payouts.",
    pushMult: null, callMult: null, reshoveMult: null,
  },
};
