// Malmuth-Harville ICM equity calculation.
// Given chip stacks and a payout structure, computes each player's expected
// tournament equity ($) — the standard algorithm used by every poker ICM tool.
//
// We use this to derive position-aware multipliers that tighten Nash thresholds
// in proportion to how much ICM pressure hero faces.

export function icmEquities(stacks, payouts) {
  const n = stacks.length;
  const totalStack = stacks.reduce((a, b) => a + b, 0);
  if (totalStack === 0 || payouts.length === 0) return stacks.map(() => 0);

  const pads = [...payouts];
  while (pads.length < n) pads.push(0);

  function recurse(activeIdxs, place, eq) {
    if (place >= pads.length || activeIdxs.length === 0) return;
    const sum = activeIdxs.reduce((s, i) => s + stacks[i], 0);
    if (sum === 0) return;
    for (const i of activeIdxs) {
      const probTakesThisPlace = stacks[i] / sum;
      eq[i] += probTakesThisPlace * pads[place];
    }
    if (place + 1 >= pads.length) return;
    for (const j of activeIdxs) {
      const probTakesThisPlace = stacks[j] / sum;
      if (probTakesThisPlace === 0) continue;
      const remaining = activeIdxs.filter(x => x !== j);
      const subEq = new Array(n).fill(0);
      recurse(remaining, place + 1, subEq);
      for (let k = 0; k < n; k++) eq[k] += probTakesThisPlace * subEq[k];
    }
  }

  const eq = new Array(n).fill(0);
  recurse([...Array(n).keys()], 0, eq);
  return eq;
}

// Derive push/call/reshove multipliers from hero's ICM equity vs. baseline.
// Lower ratio (hero's chips devalued by ICM) -> tighter multipliers.
// Calls multiplied harder than pushes (no fold equity available on calls).
export function deriveMultipliers(stacks, payouts) {
  if (stacks.length < 2 || payouts.length === 0) {
    return { push: 1, call: 1, reshove: 1 };
  }
  const totalChips = stacks.reduce((a, b) => a + b, 0);
  if (totalChips === 0) return { push: 1, call: 1, reshove: 1 };

  const eq = icmEquities(stacks, payouts);
  const heroEq = eq[0];
  const totalPayout = payouts.reduce((a, b) => a + b, 0);
  if (totalPayout === 0) return { push: 1, call: 1, reshove: 1 };

  const heroDollarPerChip = heroEq / stacks[0];
  const avgDollarPerChip = totalPayout / totalChips;
  const ratio = heroDollarPerChip / avgDollarPerChip;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const pushMult = clamp(0.7 + 0.3 * ratio, 0.7, 1.1);
  const callMult = clamp(0.3 + 0.7 * ratio, 0.4, 1.05);
  const reshoveMult = clamp(0.5 + 0.5 * ratio, 0.55, 1.05);

  return { push: pushMult, call: callMult, reshove: reshoveMult };
}
