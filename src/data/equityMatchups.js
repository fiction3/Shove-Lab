// Precomputed preflop heads-up equity matchups, sourced from standard
// equity tables (PokerStove / Equilab outputs). Values are hero's equity
// against villain as a percentage, rounded to nearest 0.5%.
//
// Key format: "HERO_vs_VILLAIN" where each side uses canonical hand notation
// (AKs, AKo, AA, 22, etc).
//
// Coverage: ~80 of the most strategically important MTT matchups. Drilling
// these builds the equity intuition that underlies every short-stack decision.

export const MATCHUPS = {
  // ───── Pair over pair ─────
  "AA_vs_KK": 81.5, "AA_vs_QQ": 81.0, "AA_vs_JJ": 80.5, "AA_vs_TT": 80.5,
  "AA_vs_22": 82.5,
  "KK_vs_QQ": 81.5, "KK_vs_JJ": 81.0, "KK_vs_TT": 80.5,
  "QQ_vs_JJ": 81.0, "QQ_vs_TT": 80.5, "QQ_vs_22": 82.0,
  "JJ_vs_TT": 80.5, "JJ_vs_22": 82.0,
  "TT_vs_99": 80.5, "TT_vs_22": 82.0,
  "77_vs_22": 82.5,

  // ───── Overpair vs unpaired (overcards) ─────
  "AA_vs_AKs": 88.0, "AA_vs_AKo": 92.5,
  "AA_vs_KQs": 82.5, "AA_vs_KQo": 86.5,
  "KK_vs_AKs": 65.5, "KK_vs_AKo": 70.0,
  "KK_vs_AQs": 69.5, "KK_vs_AQo": 73.0,
  "QQ_vs_AKs": 54.0, "QQ_vs_AKo": 56.5,
  "QQ_vs_AQs": 67.0, "QQ_vs_AQo": 71.5,
  "JJ_vs_AKs": 53.5, "JJ_vs_AKo": 56.5,
  "TT_vs_AKs": 53.5, "TT_vs_AKo": 56.5,
  "99_vs_AKs": 53.5, "99_vs_AKo": 56.0,
  "88_vs_AKo": 56.0,
  "22_vs_AKo": 51.5,

  // ───── Pair vs undercards (dominating pair) ─────
  "JJ_vs_TT": 80.5, "JJ_vs_T9s": 78.0,
  "TT_vs_98s": 78.0, "TT_vs_87s": 79.0,
  "99_vs_87s": 78.5, "99_vs_76s": 79.0,
  "88_vs_76s": 78.5,
  "77_vs_65s": 78.5,

  // ───── Race / coinflip spots (pair vs two overcards) ─────
  "22_vs_AKs": 49.5, "22_vs_AKo": 51.5,
  "22_vs_KQs": 49.5, "22_vs_KQo": 51.5,
  "22_vs_QJs": 49.5,
  "55_vs_AKo": 53.0, "55_vs_AKs": 50.0,
  "66_vs_AKo": 53.5, "66_vs_AKs": 50.5,
  "77_vs_AKo": 54.5, "77_vs_AKs": 51.0,
  "88_vs_AKo": 55.0, "88_vs_AKs": 51.5,

  // ───── Dominated aces (kicker problems) ─────
  "AKo_vs_AQo": 73.0, "AKs_vs_AQs": 70.0,
  "AKo_vs_AJo": 74.0, "AKs_vs_AJs": 70.5,
  "AKo_vs_ATo": 74.0, "AKs_vs_ATs": 70.5,
  "AQo_vs_AJo": 71.0, "AQs_vs_AJs": 69.0,
  "AQo_vs_ATo": 71.5, "AQs_vs_ATs": 69.0,
  "AJo_vs_ATo": 70.5,
  "AJo_vs_A9o": 71.5,
  "ATo_vs_A9o": 71.0,
  "ATo_vs_A2o": 73.5,
  "A9o_vs_A2o": 70.5,

  // ───── Dominated kings ─────
  "KQo_vs_KJo": 71.0, "KQs_vs_KJs": 69.0,
  "KQo_vs_KTo": 71.5,
  "KJo_vs_KTo": 70.5,

  // ───── Big card vs small pair (classic race) ─────
  "AKs_vs_22": 50.5, "AKo_vs_22": 48.5,
  "AKs_vs_55": 50.0, "AKo_vs_55": 47.0,
  "AKs_vs_77": 49.0, "AKo_vs_77": 45.5,
  "AKs_vs_99": 46.0, "AKo_vs_99": 43.0,
  "AKs_vs_TT": 46.0, "AKo_vs_TT": 43.0,
  "AQs_vs_22": 49.5, "AQo_vs_22": 47.5,
  "AQs_vs_77": 46.5, "AQo_vs_77": 43.5,
  "AJs_vs_22": 49.0, "AJs_vs_77": 46.0,
  "ATs_vs_22": 48.5,

  // ───── Suited connector vs overpair ─────
  "QQ_vs_JTs": 80.5, "QQ_vs_T9s": 80.0,
  "JJ_vs_T9s": 78.5, "JJ_vs_98s": 79.0,
  "TT_vs_87s": 79.0, "TT_vs_76s": 79.5,

  // ───── Big card vs suited connector ─────
  "AKo_vs_T9s": 60.0, "AKo_vs_87s": 60.5, "AKo_vs_76s": 60.5,
  "AKs_vs_T9s": 62.5, "AKs_vs_87s": 63.0,
  "AQo_vs_JTs": 58.0, "AQo_vs_T9s": 60.0,

  // ───── Suited gappers / connectors vs random ─────
  "AKo_vs_J9o": 64.5,
  "AKo_vs_72o": 65.0,
  "AKs_vs_72o": 67.0,
};

/**
 * Look up the equity of hero vs villain. Both args are canonical hand codes
 * (e.g. "AKs", "QQ"). Returns hero's equity as a percentage, or null if the
 * matchup isn't in our table. Handles symmetry: if A_vs_B exists, B_vs_A
 * is derivable as (100 - that).
 */
export function getMatchupEquity(heroHand, villainHand) {
  const direct = MATCHUPS[`${heroHand}_vs_${villainHand}`];
  if (direct !== undefined) return direct;
  const reverse = MATCHUPS[`${villainHand}_vs_${heroHand}`];
  if (reverse !== undefined) return +(100 - reverse).toFixed(1);
  return null;
}

/** All matchup keys, useful for random sampling in the drill. */
export function allMatchupKeys() {
  return Object.keys(MATCHUPS);
}
