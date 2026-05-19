// 3-bet defense ranges at medium-deep stacks (25-40bb).
// You opened, someone 3-bet you. Should you fold, call, or 4-bet/shove?
//
// Coverage: opener × 3-bettor combinations most common in MTT play.
// All ranges assume standard sizings: open 2.2-2.5x, 3-bet ~3x the open.
//
// At 25-30bb, "fourBet" means a shove (jam) — non-shove 4-bets aren't
// strategically viable below ~32bb effective.
// At 32-40bb, "fourBet" includes a small non-allin 4-bet, but for grading
// purposes we treat them as the same button.
//
// Frequencies: { fold, call, fourBet } summing to 1.0.
// Sourced from public GTO solver outputs (Upswing Poker MTT charts,
// GTO Wizard medium-stack data) for chip-EV play.

// ─────────────────────────────────────────────────────────────────
// BTN open, vs SB 3-bet
// ─────────────────────────────────────────────────────────────────
const BTN_vs_SB = {
  // Pairs — value-call most, 4-bet/shove the premiums
  AA: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  KK: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  QQ: { fold: 0.00, call: 0.30, fourBet: 0.70 },
  JJ: { fold: 0.00, call: 0.55, fourBet: 0.45 },
  TT: { fold: 0.00, call: 0.75, fourBet: 0.25 },
  99: { fold: 0.00, call: 0.85, fourBet: 0.15 },
  88: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  77: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  66: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  55: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  44: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  33: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  22: { fold: 0.70, call: 0.30, fourBet: 0.00 },
  // Suited aces — strong calls, AK mixes 4-bet
  AKs: { fold: 0.00, call: 0.30, fourBet: 0.70 },
  AQs: { fold: 0.00, call: 0.60, fourBet: 0.40 },
  AJs: { fold: 0.00, call: 0.85, fourBet: 0.15 },
  ATs: { fold: 0.00, call: 0.95, fourBet: 0.05 },
  A9s: { fold: 0.10, call: 0.90, fourBet: 0.00 },
  A8s: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  A7s: { fold: 0.30, call: 0.65, fourBet: 0.05 },
  A6s: { fold: 0.40, call: 0.55, fourBet: 0.05 },
  A5s: { fold: 0.20, call: 0.65, fourBet: 0.15 }, // wheel 4-bet bluff combos
  A4s: { fold: 0.30, call: 0.55, fourBet: 0.15 },
  A3s: { fold: 0.45, call: 0.45, fourBet: 0.10 },
  A2s: { fold: 0.55, call: 0.40, fourBet: 0.05 },
  // Offsuit aces — mostly fold or call
  AKo: { fold: 0.00, call: 0.40, fourBet: 0.60 },
  AQo: { fold: 0.10, call: 0.70, fourBet: 0.20 },
  AJo: { fold: 0.30, call: 0.65, fourBet: 0.05 },
  ATo: { fold: 0.60, call: 0.40, fourBet: 0.00 },
  A9o: { fold: 0.85, call: 0.15, fourBet: 0.00 },
  A5o: { fold: 0.90, call: 0.10, fourBet: 0.00 },
  // Suited kings
  KQs: { fold: 0.00, call: 0.85, fourBet: 0.15 },
  KJs: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  KTs: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  K9s: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  K8s: { fold: 0.60, call: 0.40, fourBet: 0.00 },
  K7s: { fold: 0.75, call: 0.25, fourBet: 0.00 },
  // Offsuit kings
  KQo: { fold: 0.20, call: 0.75, fourBet: 0.05 },
  KJo: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  KTo: { fold: 0.80, call: 0.20, fourBet: 0.00 },
  // Queens and lower
  QJs: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  QTs: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  Q9s: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  Q8s: { fold: 0.75, call: 0.25, fourBet: 0.00 },
  QJo: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  QTo: { fold: 0.85, call: 0.15, fourBet: 0.00 },
  JTs: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  J9s: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  J8s: { fold: 0.75, call: 0.25, fourBet: 0.00 },
  T9s: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  T8s: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  // Suited connectors
  "98s": { fold: 0.35, call: 0.65, fourBet: 0.00 },
  "87s": { fold: 0.45, call: 0.55, fourBet: 0.00 },
  "76s": { fold: 0.60, call: 0.40, fourBet: 0.00 },
  "65s": { fold: 0.75, call: 0.25, fourBet: 0.00 },
  "54s": { fold: 0.85, call: 0.15, fourBet: 0.00 },
};

// ─────────────────────────────────────────────────────────────────
// BTN open, vs BB 3-bet — BB defends wider, so calls tighten slightly
// ─────────────────────────────────────────────────────────────────
const BTN_vs_BB = {
  AA: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  KK: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  QQ: { fold: 0.00, call: 0.35, fourBet: 0.65 },
  JJ: { fold: 0.00, call: 0.60, fourBet: 0.40 },
  TT: { fold: 0.00, call: 0.80, fourBet: 0.20 },
  99: { fold: 0.00, call: 0.90, fourBet: 0.10 },
  88: { fold: 0.05, call: 0.95, fourBet: 0.00 },
  77: { fold: 0.10, call: 0.90, fourBet: 0.00 },
  66: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  55: { fold: 0.35, call: 0.65, fourBet: 0.00 },
  44: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  33: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  22: { fold: 0.60, call: 0.40, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.40, fourBet: 0.60 },
  AQs: { fold: 0.00, call: 0.70, fourBet: 0.30 },
  AJs: { fold: 0.00, call: 0.90, fourBet: 0.10 },
  ATs: { fold: 0.05, call: 0.95, fourBet: 0.00 },
  A9s: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  A8s: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  A5s: { fold: 0.15, call: 0.70, fourBet: 0.15 },
  A4s: { fold: 0.25, call: 0.65, fourBet: 0.10 },
  AKo: { fold: 0.00, call: 0.55, fourBet: 0.45 },
  AQo: { fold: 0.10, call: 0.80, fourBet: 0.10 },
  AJo: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  ATo: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  KQs: { fold: 0.00, call: 0.90, fourBet: 0.10 },
  KJs: { fold: 0.05, call: 0.95, fourBet: 0.00 },
  KTs: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  K9s: { fold: 0.35, call: 0.65, fourBet: 0.00 },
  KQo: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  KJo: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  QJs: { fold: 0.05, call: 0.95, fourBet: 0.00 },
  QTs: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  Q9s: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  JTs: { fold: 0.10, call: 0.90, fourBet: 0.00 },
  J9s: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  T9s: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  T8s: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  "98s": { fold: 0.30, call: 0.70, fourBet: 0.00 },
  "87s": { fold: 0.40, call: 0.60, fourBet: 0.00 },
  "76s": { fold: 0.55, call: 0.45, fourBet: 0.00 },
  "65s": { fold: 0.70, call: 0.30, fourBet: 0.00 },
};

// ─────────────────────────────────────────────────────────────────
// CO open, vs SB / BB 3-bet — tighter than BTN
// ─────────────────────────────────────────────────────────────────
const CO_vs_SB = {
  AA: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  KK: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  QQ: { fold: 0.00, call: 0.25, fourBet: 0.75 },
  JJ: { fold: 0.00, call: 0.50, fourBet: 0.50 },
  TT: { fold: 0.00, call: 0.75, fourBet: 0.25 },
  99: { fold: 0.05, call: 0.85, fourBet: 0.10 },
  88: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  77: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  66: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  55: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  44: { fold: 0.75, call: 0.25, fourBet: 0.00 },
  33: { fold: 0.80, call: 0.20, fourBet: 0.00 },
  22: { fold: 0.85, call: 0.15, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.35, fourBet: 0.65 },
  AQs: { fold: 0.00, call: 0.60, fourBet: 0.40 },
  AJs: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  ATs: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  A9s: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  A5s: { fold: 0.30, call: 0.55, fourBet: 0.15 },
  AKo: { fold: 0.00, call: 0.45, fourBet: 0.55 },
  AQo: { fold: 0.15, call: 0.70, fourBet: 0.15 },
  AJo: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  ATo: { fold: 0.80, call: 0.20, fourBet: 0.00 },
  KQs: { fold: 0.05, call: 0.85, fourBet: 0.10 },
  KJs: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  KTs: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  KQo: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  KJo: { fold: 0.75, call: 0.25, fourBet: 0.00 },
  QJs: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  QTs: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  JTs: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  T9s: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  "98s": { fold: 0.50, call: 0.50, fourBet: 0.00 },
  "87s": { fold: 0.60, call: 0.40, fourBet: 0.00 },
  "76s": { fold: 0.75, call: 0.25, fourBet: 0.00 },
};

const CO_vs_BB = {
  AA: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  KK: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  QQ: { fold: 0.00, call: 0.30, fourBet: 0.70 },
  JJ: { fold: 0.00, call: 0.55, fourBet: 0.45 },
  TT: { fold: 0.00, call: 0.80, fourBet: 0.20 },
  99: { fold: 0.00, call: 0.90, fourBet: 0.10 },
  88: { fold: 0.10, call: 0.90, fourBet: 0.00 },
  77: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  66: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  55: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  44: { fold: 0.70, call: 0.30, fourBet: 0.00 },
  33: { fold: 0.75, call: 0.25, fourBet: 0.00 },
  22: { fold: 0.80, call: 0.20, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.40, fourBet: 0.60 },
  AQs: { fold: 0.00, call: 0.70, fourBet: 0.30 },
  AJs: { fold: 0.00, call: 0.95, fourBet: 0.05 },
  ATs: { fold: 0.10, call: 0.90, fourBet: 0.00 },
  A9s: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  A5s: { fold: 0.25, call: 0.60, fourBet: 0.15 },
  AKo: { fold: 0.00, call: 0.55, fourBet: 0.45 },
  AQo: { fold: 0.10, call: 0.80, fourBet: 0.10 },
  AJo: { fold: 0.35, call: 0.65, fourBet: 0.00 },
  KQs: { fold: 0.00, call: 0.95, fourBet: 0.05 },
  KJs: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  KTs: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  KQo: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  KJo: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  QJs: { fold: 0.10, call: 0.90, fourBet: 0.00 },
  QTs: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  JTs: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  T9s: { fold: 0.35, call: 0.65, fourBet: 0.00 },
  "98s": { fold: 0.45, call: 0.55, fourBet: 0.00 },
  "87s": { fold: 0.55, call: 0.45, fourBet: 0.00 },
};

// ─────────────────────────────────────────────────────────────────
// HJ open, vs SB / BB 3-bet — tighter still
// ─────────────────────────────────────────────────────────────────
const HJ_vs_SB = {
  AA: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  KK: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  QQ: { fold: 0.00, call: 0.20, fourBet: 0.80 },
  JJ: { fold: 0.00, call: 0.45, fourBet: 0.55 },
  TT: { fold: 0.00, call: 0.70, fourBet: 0.30 },
  99: { fold: 0.10, call: 0.80, fourBet: 0.10 },
  88: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  77: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  66: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  55: { fold: 0.75, call: 0.25, fourBet: 0.00 },
  44: { fold: 0.85, call: 0.15, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.30, fourBet: 0.70 },
  AQs: { fold: 0.00, call: 0.60, fourBet: 0.40 },
  AJs: { fold: 0.10, call: 0.85, fourBet: 0.05 },
  ATs: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  A5s: { fold: 0.40, call: 0.45, fourBet: 0.15 },
  AKo: { fold: 0.00, call: 0.40, fourBet: 0.60 },
  AQo: { fold: 0.20, call: 0.70, fourBet: 0.10 },
  AJo: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  KQs: { fold: 0.10, call: 0.85, fourBet: 0.05 },
  KJs: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  KTs: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  KQo: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  QJs: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  QTs: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  JTs: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  T9s: { fold: 0.60, call: 0.40, fourBet: 0.00 },
};

const HJ_vs_BB = {
  AA: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  KK: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  QQ: { fold: 0.00, call: 0.25, fourBet: 0.75 },
  JJ: { fold: 0.00, call: 0.50, fourBet: 0.50 },
  TT: { fold: 0.00, call: 0.75, fourBet: 0.25 },
  99: { fold: 0.05, call: 0.85, fourBet: 0.10 },
  88: { fold: 0.15, call: 0.85, fourBet: 0.00 },
  77: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  66: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  55: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.35, fourBet: 0.65 },
  AQs: { fold: 0.00, call: 0.65, fourBet: 0.35 },
  AJs: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  ATs: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  A5s: { fold: 0.35, call: 0.50, fourBet: 0.15 },
  AKo: { fold: 0.00, call: 0.50, fourBet: 0.50 },
  AQo: { fold: 0.15, call: 0.75, fourBet: 0.10 },
  AJo: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  KQs: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  KJs: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  KTs: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  KQo: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  QJs: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  QTs: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  JTs: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  T9s: { fold: 0.50, call: 0.50, fourBet: 0.00 },
};

// ─────────────────────────────────────────────────────────────────
// UTG open, vs SB / BB 3-bet — extremely tight, mostly 4-bet or fold
// ─────────────────────────────────────────────────────────────────
const UTG_vs_SB = {
  AA: { fold: 0.00, call: 0.05, fourBet: 0.95 },
  KK: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  QQ: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  JJ: { fold: 0.00, call: 0.35, fourBet: 0.65 },
  TT: { fold: 0.05, call: 0.65, fourBet: 0.30 },
  99: { fold: 0.20, call: 0.75, fourBet: 0.05 },
  88: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  77: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.20, fourBet: 0.80 },
  AQs: { fold: 0.00, call: 0.55, fourBet: 0.45 },
  AJs: { fold: 0.15, call: 0.80, fourBet: 0.05 },
  ATs: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  A5s: { fold: 0.50, call: 0.35, fourBet: 0.15 },
  AKo: { fold: 0.00, call: 0.30, fourBet: 0.70 },
  AQo: { fold: 0.25, call: 0.65, fourBet: 0.10 },
  AJo: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  KQs: { fold: 0.20, call: 0.75, fourBet: 0.05 },
  KJs: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  KQo: { fold: 0.65, call: 0.35, fourBet: 0.00 },
  QJs: { fold: 0.50, call: 0.50, fourBet: 0.00 },
};

const UTG_vs_BB = {
  AA: { fold: 0.00, call: 0.05, fourBet: 0.95 },
  KK: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  QQ: { fold: 0.00, call: 0.20, fourBet: 0.80 },
  JJ: { fold: 0.00, call: 0.40, fourBet: 0.60 },
  TT: { fold: 0.05, call: 0.70, fourBet: 0.25 },
  99: { fold: 0.15, call: 0.80, fourBet: 0.05 },
  88: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  77: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.25, fourBet: 0.75 },
  AQs: { fold: 0.00, call: 0.60, fourBet: 0.40 },
  AJs: { fold: 0.10, call: 0.85, fourBet: 0.05 },
  ATs: { fold: 0.35, call: 0.65, fourBet: 0.00 },
  A5s: { fold: 0.45, call: 0.40, fourBet: 0.15 },
  AKo: { fold: 0.00, call: 0.40, fourBet: 0.60 },
  AQo: { fold: 0.20, call: 0.70, fourBet: 0.10 },
  AJo: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  KQs: { fold: 0.15, call: 0.80, fourBet: 0.05 },
  KJs: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  KQo: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  QJs: { fold: 0.40, call: 0.60, fourBet: 0.00 },
};

// ─────────────────────────────────────────────────────────────────
// SB open vs BB 3-bet — out of position, defends tighter than BTN
// ─────────────────────────────────────────────────────────────────
const SB_vs_BB = {
  AA: { fold: 0.00, call: 0.10, fourBet: 0.90 },
  KK: { fold: 0.00, call: 0.15, fourBet: 0.85 },
  QQ: { fold: 0.00, call: 0.30, fourBet: 0.70 },
  JJ: { fold: 0.00, call: 0.55, fourBet: 0.45 },
  TT: { fold: 0.05, call: 0.75, fourBet: 0.20 },
  99: { fold: 0.15, call: 0.80, fourBet: 0.05 },
  88: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  77: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  66: { fold: 0.60, call: 0.40, fourBet: 0.00 },
  55: { fold: 0.70, call: 0.30, fourBet: 0.00 },
  AKs: { fold: 0.00, call: 0.35, fourBet: 0.65 },
  AQs: { fold: 0.00, call: 0.65, fourBet: 0.35 },
  AJs: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  ATs: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  A9s: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  A5s: { fold: 0.30, call: 0.55, fourBet: 0.15 },
  AKo: { fold: 0.00, call: 0.50, fourBet: 0.50 },
  AQo: { fold: 0.15, call: 0.75, fourBet: 0.10 },
  AJo: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  KQs: { fold: 0.05, call: 0.90, fourBet: 0.05 },
  KJs: { fold: 0.25, call: 0.75, fourBet: 0.00 },
  KTs: { fold: 0.50, call: 0.50, fourBet: 0.00 },
  KQo: { fold: 0.40, call: 0.60, fourBet: 0.00 },
  QJs: { fold: 0.20, call: 0.80, fourBet: 0.00 },
  QTs: { fold: 0.45, call: 0.55, fourBet: 0.00 },
  JTs: { fold: 0.30, call: 0.70, fourBet: 0.00 },
  T9s: { fold: 0.55, call: 0.45, fourBet: 0.00 },
  "98s": { fold: 0.65, call: 0.35, fourBet: 0.00 },
};

// ─────────────────────────────────────────────────────────────────
// Index by `${opener}_vs_${threeBettor}`
// ─────────────────────────────────────────────────────────────────

export const THREE_BET_DEFENSE_RANGES = {
  "BTN_vs_SB": BTN_vs_SB, "BTN_vs_BB": BTN_vs_BB,
  "CO_vs_SB":  CO_vs_SB,  "CO_vs_BB":  CO_vs_BB,
  "HJ_vs_SB":  HJ_vs_SB,  "HJ_vs_BB":  HJ_vs_BB,
  "UTG_vs_SB": UTG_vs_SB, "UTG_vs_BB": UTG_vs_BB,
  "SB_vs_BB":  SB_vs_BB,
};

/**
 * Which (opener, 3-bettor) combinations are valid given the table size.
 * UTG only exists in 6+ seats, SB exists everywhere, etc.
 */
export function validDefenseCombos(seatCount) {
  const combos = [];
  const openers = seatCount === 2 ? []                    // HU doesn't really have a "3-bet defense" trainer mode (would be just calling/raising a 3-bet from BB after SB open)
                : seatCount === 3 ? ["BTN", "SB"]
                : seatCount === 6 ? ["UTG", "HJ", "CO", "BTN", "SB"]
                : ["UTG", "HJ", "CO", "BTN", "SB"];      // 9-max: use the same trainable set; UTG covers all early positions
  for (const opener of openers) {
    // Possible 3-bettors: anyone between opener and BB.
    // SB can only get 3-bet by BB.
    if (opener === "SB") combos.push({ opener, threeBettor: "BB" });
    else {
      combos.push({ opener, threeBettor: "SB" });
      combos.push({ opener, threeBettor: "BB" });
    }
  }
  return combos.filter(c => THREE_BET_DEFENSE_RANGES[`${c.opener}_vs_${c.threeBettor}`]);
}

const DEFAULT_FREQ = { fold: 1, call: 0, fourBet: 0 };

export function getDefenseFrequency(opener, threeBettor, hand) {
  return THREE_BET_DEFENSE_RANGES[`${opener}_vs_${threeBettor}`]?.[hand] || DEFAULT_FREQ;
}

export function gradeDefenseAction(chosen, freq) {
  const f = freq[chosen] ?? 0;
  const max = Math.max(freq.fold, freq.call, freq.fourBet);
  if (f === max && f >= 0.4) return "exact";
  if (f >= 0.2) return "close";
  return "wrong";
}

export function primaryDefenseAction(freq) {
  if (freq.fold >= freq.call && freq.fold >= freq.fourBet) return "fold";
  if (freq.call >= freq.fourBet) return "call";
  return "fourBet";
}
