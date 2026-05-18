// Pure math helpers for odds & equity calculations. No React, no state.

/**
 * Pot odds: given a pot size and the amount you need to call, return both
 * the ratio (e.g. "3:1") and the required equity percentage to make the
 * call breakeven.
 *
 * Required equity = toCall / (pot + toCall)
 * where pot is the pot BEFORE you put in the call.
 */
export function potOdds(potBeforeCall, toCall) {
  if (toCall <= 0) return { ratio: "n/a", requiredEquity: 0 };
  const totalAfter = potBeforeCall + toCall;
  const requiredEquity = (toCall / totalAfter) * 100;
  // Ratio in "X:1" form, rounded
  const r = potBeforeCall / toCall;
  const ratio = `${r.toFixed(r >= 5 ? 0 : 1)}:1`;
  return { ratio, requiredEquity: +requiredEquity.toFixed(1), totalAfter };
}

/**
 * Equity from outs (Rule of 4 and 2):
 *   Flop -> river: outs * 4   (approximate)
 *   Turn -> river: outs * 2
 * The real formula is 1 - C(47-outs,2)/C(47,2) and 1 - (46-outs)/46.
 * We return both: the rule-of-thumb estimate AND the exact value.
 */
export function equityFromOuts(outs, street) {
  if (outs < 0) outs = 0;
  if (outs > 23) outs = 23;
  let exact, approx;
  if (street === "flop") {
    // P(hit by river) = 1 - C(47-outs,2)/C(47,2)
    const miss = ((47 - outs) * (46 - outs)) / (47 * 46);
    exact = (1 - miss) * 100;
    approx = outs * 4;
  } else {
    // Turn: one card left, 46 unknown
    exact = (outs / 46) * 100;
    approx = outs * 2;
  }
  return {
    exact: +exact.toFixed(1),
    approx,
    error: +(approx - exact).toFixed(1),
  };
}

/**
 * Fold equity & breakeven calculation.
 *
 * You're risking R chips to win P chips of dead money (the pot plus any
 * villain contribution that already exists). Villain folds with probability
 * f. When called, your equity vs their calling range is e.
 *
 * EV(shove) = f * P + (1 - f) * (e * (R + P) - R)
 *
 * Breakeven equity-when-called given a fold frequency f:
 *   solve EV(shove) = 0
 *   e* = (R - f*P - f*R) / ((1-f) * (R + P))
 *      = (R*(1-f) - f*P) / ((1-f) * (R + P))
 *      = R/(R+P) - (f*P) / ((1-f)*(R+P))
 *
 * Equivalently: you can compute the breakeven fold frequency given a target
 * equity-when-called.
 */
export function foldEquityBreakeven({ risk, pot, foldFreq }) {
  // Given a fold frequency, return the equity-when-called we need to break even.
  if (foldFreq >= 1) return 0;
  if (foldFreq < 0) foldFreq = 0;
  const numerator = risk - foldFreq * pot - foldFreq * risk;
  const denominator = (1 - foldFreq) * (risk + pot);
  if (denominator === 0) return 0;
  const e = numerator / denominator;
  return +(Math.max(0, Math.min(1, e)) * 100).toFixed(1);
}

/**
 * Given a target equity-when-called, return the fold frequency we need
 * to break even on the shove.
 */
export function requiredFoldFreq({ risk, pot, equityWhenCalled }) {
  // Solve EV = 0 for f given e:
  //   0 = f*P + (1-f) * (e*(R+P) - R)
  //   let A = e*(R+P) - R. Then 0 = f*P + (1-f)*A
  //   0 = f*P + A - f*A
  //   f*(P - A) = -A
  //   f = A / (A - P)         [note sign]
  const e = equityWhenCalled / 100;
  const A = e * (risk + pot) - risk;
  const denom = A - pot;
  if (denom === 0) return 0;
  const f = A / denom;
  return +(Math.max(0, Math.min(1, f)) * 100).toFixed(1);
}

/**
 * Format a percentage tolerance check: "is the user's answer within ±tol
 * percentage points of the truth?" Returns one of "exact", "close", "wrong".
 */
export function gradeAnswer(userValue, trueValue, exactTol = 1, closeTol = 5) {
  const diff = Math.abs(userValue - trueValue);
  if (diff <= exactTol) return "exact";
  if (diff <= closeTol) return "close";
  return "wrong";
}
