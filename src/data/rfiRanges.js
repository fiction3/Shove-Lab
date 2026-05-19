// Open-raise (RFI) ranges at medium stack depths (20-40bb), with mixed
// strategy frequencies. Based on published GTO solver outputs (Upswing
// Poker MTT charts, GTO Wizard public ranges) for chip-EV play.
//
// Frequencies are expressed as { raise, shove, fold } summing to 1.0.
// At deeper stacks (30bb+), pure raise becomes dominant; shoves are rare.
// At shorter stacks (20-25bb), both raise and shove appear in many spots.
//
// Hands not in the map default to { raise: 0, shove: 0, fold: 1.0 } — fold.

// ─────────────────────────────────────────────────────────────────
// BTN — opening when folded to. Widest range.
// ─────────────────────────────────────────────────────────────────

const BTN_RFI = {
  // Pairs
  AA: { raise: 0.85, shove: 0.10, fold: 0.05 }, // mostly raise to keep weaker hands in
  KK: { raise: 0.85, shove: 0.10, fold: 0.05 },
  QQ: { raise: 0.90, shove: 0.05, fold: 0.05 },
  JJ: { raise: 0.95, shove: 0.00, fold: 0.05 },
  TT: { raise: 1.00, shove: 0.00, fold: 0.00 },
  99: { raise: 1.00, shove: 0.00, fold: 0.00 },
  88: { raise: 1.00, shove: 0.00, fold: 0.00 },
  77: { raise: 1.00, shove: 0.00, fold: 0.00 },
  66: { raise: 1.00, shove: 0.00, fold: 0.00 },
  55: { raise: 1.00, shove: 0.00, fold: 0.00 },
  44: { raise: 1.00, shove: 0.00, fold: 0.00 },
  33: { raise: 1.00, shove: 0.00, fold: 0.00 },
  22: { raise: 1.00, shove: 0.00, fold: 0.00 },
  // Suited aces
  AKs: { raise: 0.80, shove: 0.15, fold: 0.05 },
  AQs: { raise: 0.95, shove: 0.05, fold: 0.00 },
  AJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A8s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A7s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A6s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A5s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A4s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A3s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A2s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  // Offsuit aces
  AKo: { raise: 0.80, shove: 0.15, fold: 0.05 },
  AQo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AJo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A9o: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A8o: { raise: 0.90, shove: 0.00, fold: 0.10 },
  A7o: { raise: 0.75, shove: 0.00, fold: 0.25 },
  A6o: { raise: 0.50, shove: 0.00, fold: 0.50 },
  A5o: { raise: 0.85, shove: 0.00, fold: 0.15 },
  A4o: { raise: 0.50, shove: 0.00, fold: 0.50 },
  A3o: { raise: 0.30, shove: 0.00, fold: 0.70 },
  A2o: { raise: 0.20, shove: 0.00, fold: 0.80 },
  // Suited kings
  KQs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K8s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K7s: { raise: 0.85, shove: 0.00, fold: 0.15 },
  K6s: { raise: 0.70, shove: 0.00, fold: 0.30 },
  K5s: { raise: 0.55, shove: 0.00, fold: 0.45 },
  K4s: { raise: 0.40, shove: 0.00, fold: 0.60 },
  K3s: { raise: 0.30, shove: 0.00, fold: 0.70 },
  K2s: { raise: 0.20, shove: 0.00, fold: 0.80 },
  // Offsuit kings
  KQo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KTo: { raise: 0.90, shove: 0.00, fold: 0.10 },
  K9o: { raise: 0.70, shove: 0.00, fold: 0.30 },
  K8o: { raise: 0.35, shove: 0.00, fold: 0.65 },
  K7o: { raise: 0.15, shove: 0.00, fold: 0.85 },
  // Queens
  QJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  QTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  Q9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  Q8s: { raise: 0.80, shove: 0.00, fold: 0.20 },
  Q7s: { raise: 0.40, shove: 0.00, fold: 0.60 },
  Q6s: { raise: 0.30, shove: 0.00, fold: 0.70 },
  Q5s: { raise: 0.25, shove: 0.00, fold: 0.75 },
  Q4s: { raise: 0.15, shove: 0.00, fold: 0.85 },
  QJo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  QTo: { raise: 0.90, shove: 0.00, fold: 0.10 },
  Q9o: { raise: 0.50, shove: 0.00, fold: 0.50 },
  Q8o: { raise: 0.15, shove: 0.00, fold: 0.85 },
  // Jacks and tens
  JTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  J9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  J8s: { raise: 0.85, shove: 0.00, fold: 0.15 },
  J7s: { raise: 0.45, shove: 0.00, fold: 0.55 },
  J6s: { raise: 0.20, shove: 0.00, fold: 0.80 },
  JTo: { raise: 0.95, shove: 0.00, fold: 0.05 },
  J9o: { raise: 0.55, shove: 0.00, fold: 0.45 },
  J8o: { raise: 0.20, shove: 0.00, fold: 0.80 },
  T9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  T8s: { raise: 0.95, shove: 0.00, fold: 0.05 },
  T7s: { raise: 0.65, shove: 0.00, fold: 0.35 },
  T6s: { raise: 0.30, shove: 0.00, fold: 0.70 },
  T9o: { raise: 0.65, shove: 0.00, fold: 0.35 },
  T8o: { raise: 0.25, shove: 0.00, fold: 0.75 },
  // Suited connectors and gappers
  "98s": { raise: 1.00, shove: 0.00, fold: 0.00 },
  "97s": { raise: 0.85, shove: 0.00, fold: 0.15 },
  "96s": { raise: 0.45, shove: 0.00, fold: 0.55 },
  "87s": { raise: 0.95, shove: 0.00, fold: 0.05 },
  "86s": { raise: 0.65, shove: 0.00, fold: 0.35 },
  "85s": { raise: 0.30, shove: 0.00, fold: 0.70 },
  "76s": { raise: 0.85, shove: 0.00, fold: 0.15 },
  "75s": { raise: 0.50, shove: 0.00, fold: 0.50 },
  "65s": { raise: 0.75, shove: 0.00, fold: 0.25 },
  "64s": { raise: 0.30, shove: 0.00, fold: 0.70 },
  "54s": { raise: 0.65, shove: 0.00, fold: 0.35 },
  "43s": { raise: 0.20, shove: 0.00, fold: 0.80 },
};

// ─────────────────────────────────────────────────────────────────
// CO — narrower than BTN.
// ─────────────────────────────────────────────────────────────────

const CO_RFI = {
  AA: { raise: 0.85, shove: 0.10, fold: 0.05 },
  KK: { raise: 0.85, shove: 0.10, fold: 0.05 },
  QQ: { raise: 0.90, shove: 0.05, fold: 0.05 },
  JJ: { raise: 0.95, shove: 0.00, fold: 0.05 },
  TT: { raise: 1.00, shove: 0.00, fold: 0.00 },
  99: { raise: 1.00, shove: 0.00, fold: 0.00 },
  88: { raise: 1.00, shove: 0.00, fold: 0.00 },
  77: { raise: 1.00, shove: 0.00, fold: 0.00 },
  66: { raise: 1.00, shove: 0.00, fold: 0.00 },
  55: { raise: 1.00, shove: 0.00, fold: 0.00 },
  44: { raise: 0.85, shove: 0.00, fold: 0.15 },
  33: { raise: 0.70, shove: 0.00, fold: 0.30 },
  22: { raise: 0.55, shove: 0.00, fold: 0.45 },
  AKs: { raise: 0.80, shove: 0.15, fold: 0.05 },
  AQs: { raise: 0.95, shove: 0.05, fold: 0.00 },
  AJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A8s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A7s: { raise: 0.95, shove: 0.00, fold: 0.05 },
  A6s: { raise: 0.85, shove: 0.00, fold: 0.15 },
  A5s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A4s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A3s: { raise: 0.90, shove: 0.00, fold: 0.10 },
  A2s: { raise: 0.75, shove: 0.00, fold: 0.25 },
  AKo: { raise: 0.80, shove: 0.15, fold: 0.05 },
  AQo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AJo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATo: { raise: 0.95, shove: 0.00, fold: 0.05 },
  A9o: { raise: 0.65, shove: 0.00, fold: 0.35 },
  A8o: { raise: 0.35, shove: 0.00, fold: 0.65 },
  A7o: { raise: 0.15, shove: 0.00, fold: 0.85 },
  A5o: { raise: 0.25, shove: 0.00, fold: 0.75 },
  KQs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K9s: { raise: 0.90, shove: 0.00, fold: 0.10 },
  K8s: { raise: 0.50, shove: 0.00, fold: 0.50 },
  K7s: { raise: 0.25, shove: 0.00, fold: 0.75 },
  KQo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJo: { raise: 0.95, shove: 0.00, fold: 0.05 },
  KTo: { raise: 0.65, shove: 0.00, fold: 0.35 },
  K9o: { raise: 0.20, shove: 0.00, fold: 0.80 },
  QJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  QTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  Q9s: { raise: 0.85, shove: 0.00, fold: 0.15 },
  Q8s: { raise: 0.35, shove: 0.00, fold: 0.65 },
  QJo: { raise: 0.85, shove: 0.00, fold: 0.15 },
  QTo: { raise: 0.50, shove: 0.00, fold: 0.50 },
  JTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  J9s: { raise: 0.90, shove: 0.00, fold: 0.10 },
  J8s: { raise: 0.40, shove: 0.00, fold: 0.60 },
  JTo: { raise: 0.55, shove: 0.00, fold: 0.45 },
  T9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  T8s: { raise: 0.75, shove: 0.00, fold: 0.25 },
  T7s: { raise: 0.20, shove: 0.00, fold: 0.80 },
  T9o: { raise: 0.20, shove: 0.00, fold: 0.80 },
  "98s": { raise: 0.90, shove: 0.00, fold: 0.10 },
  "97s": { raise: 0.50, shove: 0.00, fold: 0.50 },
  "87s": { raise: 0.85, shove: 0.00, fold: 0.15 },
  "86s": { raise: 0.30, shove: 0.00, fold: 0.70 },
  "76s": { raise: 0.75, shove: 0.00, fold: 0.25 },
  "65s": { raise: 0.60, shove: 0.00, fold: 0.40 },
  "54s": { raise: 0.35, shove: 0.00, fold: 0.65 },
};

// ─────────────────────────────────────────────────────────────────
// HJ — tighter still.
// ─────────────────────────────────────────────────────────────────

const HJ_RFI = {
  AA: { raise: 0.90, shove: 0.05, fold: 0.05 },
  KK: { raise: 0.90, shove: 0.05, fold: 0.05 },
  QQ: { raise: 0.95, shove: 0.00, fold: 0.05 },
  JJ: { raise: 1.00, shove: 0.00, fold: 0.00 },
  TT: { raise: 1.00, shove: 0.00, fold: 0.00 },
  99: { raise: 1.00, shove: 0.00, fold: 0.00 },
  88: { raise: 1.00, shove: 0.00, fold: 0.00 },
  77: { raise: 1.00, shove: 0.00, fold: 0.00 },
  66: { raise: 0.90, shove: 0.00, fold: 0.10 },
  55: { raise: 0.75, shove: 0.00, fold: 0.25 },
  44: { raise: 0.50, shove: 0.00, fold: 0.50 },
  33: { raise: 0.30, shove: 0.00, fold: 0.70 },
  22: { raise: 0.20, shove: 0.00, fold: 0.80 },
  AKs: { raise: 0.85, shove: 0.10, fold: 0.05 },
  AQs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A9s: { raise: 0.95, shove: 0.00, fold: 0.05 },
  A8s: { raise: 0.85, shove: 0.00, fold: 0.15 },
  A7s: { raise: 0.70, shove: 0.00, fold: 0.30 },
  A6s: { raise: 0.45, shove: 0.00, fold: 0.55 },
  A5s: { raise: 0.90, shove: 0.00, fold: 0.10 },
  A4s: { raise: 0.75, shove: 0.00, fold: 0.25 },
  A3s: { raise: 0.45, shove: 0.00, fold: 0.55 },
  A2s: { raise: 0.30, shove: 0.00, fold: 0.70 },
  AKo: { raise: 0.85, shove: 0.10, fold: 0.05 },
  AQo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AJo: { raise: 0.95, shove: 0.00, fold: 0.05 },
  ATo: { raise: 0.65, shove: 0.00, fold: 0.35 },
  KQs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KTs: { raise: 0.95, shove: 0.00, fold: 0.05 },
  K9s: { raise: 0.55, shove: 0.00, fold: 0.45 },
  KQo: { raise: 0.95, shove: 0.00, fold: 0.05 },
  KJo: { raise: 0.55, shove: 0.00, fold: 0.45 },
  QJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  QTs: { raise: 0.90, shove: 0.00, fold: 0.10 },
  Q9s: { raise: 0.45, shove: 0.00, fold: 0.55 },
  JTs: { raise: 0.95, shove: 0.00, fold: 0.05 },
  J9s: { raise: 0.55, shove: 0.00, fold: 0.45 },
  T9s: { raise: 0.85, shove: 0.00, fold: 0.15 },
  "98s": { raise: 0.55, shove: 0.00, fold: 0.45 },
  "87s": { raise: 0.45, shove: 0.00, fold: 0.55 },
  "76s": { raise: 0.40, shove: 0.00, fold: 0.60 },
};

// ─────────────────────────────────────────────────────────────────
// UTG — tightest open. (For 9-max, UTG, UTG+1, MP, MP+1 use this.)
// ─────────────────────────────────────────────────────────────────

const UTG_RFI = {
  AA: { raise: 0.90, shove: 0.05, fold: 0.05 },
  KK: { raise: 0.90, shove: 0.05, fold: 0.05 },
  QQ: { raise: 0.95, shove: 0.00, fold: 0.05 },
  JJ: { raise: 1.00, shove: 0.00, fold: 0.00 },
  TT: { raise: 1.00, shove: 0.00, fold: 0.00 },
  99: { raise: 0.95, shove: 0.00, fold: 0.05 },
  88: { raise: 0.85, shove: 0.00, fold: 0.15 },
  77: { raise: 0.70, shove: 0.00, fold: 0.30 },
  66: { raise: 0.50, shove: 0.00, fold: 0.50 },
  55: { raise: 0.30, shove: 0.00, fold: 0.70 },
  44: { raise: 0.20, shove: 0.00, fold: 0.80 },
  AKs: { raise: 0.90, shove: 0.05, fold: 0.05 },
  AQs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATs: { raise: 0.95, shove: 0.00, fold: 0.05 },
  A9s: { raise: 0.65, shove: 0.00, fold: 0.35 },
  A8s: { raise: 0.45, shove: 0.00, fold: 0.55 },
  A5s: { raise: 0.55, shove: 0.00, fold: 0.45 },
  AKo: { raise: 0.90, shove: 0.05, fold: 0.05 },
  AQo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AJo: { raise: 0.65, shove: 0.00, fold: 0.35 },
  KQs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJs: { raise: 0.85, shove: 0.00, fold: 0.15 },
  KTs: { raise: 0.50, shove: 0.00, fold: 0.50 },
  KQo: { raise: 0.55, shove: 0.00, fold: 0.45 },
  QJs: { raise: 0.75, shove: 0.00, fold: 0.25 },
  QTs: { raise: 0.40, shove: 0.00, fold: 0.60 },
  JTs: { raise: 0.50, shove: 0.00, fold: 0.50 },
};

// ─────────────────────────────────────────────────────────────────
// SB — special case: only BB behind. Plays more like 3-handed BTN.
// ─────────────────────────────────────────────────────────────────

const SB_RFI = {
  // SB opens wide because only one player is left behind.
  AA: { raise: 0.70, shove: 0.25, fold: 0.05 },
  KK: { raise: 0.70, shove: 0.25, fold: 0.05 },
  QQ: { raise: 0.75, shove: 0.20, fold: 0.05 },
  JJ: { raise: 0.85, shove: 0.10, fold: 0.05 },
  TT: { raise: 0.95, shove: 0.05, fold: 0.00 },
  99: { raise: 1.00, shove: 0.00, fold: 0.00 },
  88: { raise: 1.00, shove: 0.00, fold: 0.00 },
  77: { raise: 1.00, shove: 0.00, fold: 0.00 },
  66: { raise: 1.00, shove: 0.00, fold: 0.00 },
  55: { raise: 1.00, shove: 0.00, fold: 0.00 },
  44: { raise: 1.00, shove: 0.00, fold: 0.00 },
  33: { raise: 1.00, shove: 0.00, fold: 0.00 },
  22: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AKs: { raise: 0.65, shove: 0.30, fold: 0.05 },
  AQs: { raise: 0.85, shove: 0.10, fold: 0.05 },
  AJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A8s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A7s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A5s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A4s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A2s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  AKo: { raise: 0.65, shove: 0.30, fold: 0.05 },
  AQo: { raise: 0.90, shove: 0.05, fold: 0.05 },
  AJo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  ATo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A9o: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A8o: { raise: 1.00, shove: 0.00, fold: 0.00 },
  A5o: { raise: 0.95, shove: 0.00, fold: 0.05 },
  KQs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K8s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K7s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K6s: { raise: 0.95, shove: 0.00, fold: 0.05 },
  KQo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KJo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  KTo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  K9o: { raise: 0.90, shove: 0.00, fold: 0.10 },
  K8o: { raise: 0.70, shove: 0.00, fold: 0.30 },
  QJs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  QTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  Q9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  Q8s: { raise: 0.95, shove: 0.00, fold: 0.05 },
  Q7s: { raise: 0.85, shove: 0.00, fold: 0.15 },
  QJo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  QTo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  Q9o: { raise: 0.80, shove: 0.00, fold: 0.20 },
  JTs: { raise: 1.00, shove: 0.00, fold: 0.00 },
  J9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  J8s: { raise: 0.95, shove: 0.00, fold: 0.05 },
  JTo: { raise: 1.00, shove: 0.00, fold: 0.00 },
  J9o: { raise: 0.85, shove: 0.00, fold: 0.15 },
  T9s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  T8s: { raise: 1.00, shove: 0.00, fold: 0.00 },
  T9o: { raise: 0.85, shove: 0.00, fold: 0.15 },
  "98s": { raise: 1.00, shove: 0.00, fold: 0.00 },
  "97s": { raise: 0.90, shove: 0.00, fold: 0.10 },
  "87s": { raise: 1.00, shove: 0.00, fold: 0.00 },
  "76s": { raise: 0.95, shove: 0.00, fold: 0.05 },
  "65s": { raise: 0.85, shove: 0.00, fold: 0.15 },
  "54s": { raise: 0.70, shove: 0.00, fold: 0.30 },
};

export const RFI_RANGES = {
  UTG: UTG_RFI, UTG1: UTG_RFI, MP: UTG_RFI, MP1: HJ_RFI,
  HJ: HJ_RFI, CO: CO_RFI, BTN: BTN_RFI, SB: SB_RFI,
};

const DEFAULT_FREQ = { raise: 0, shove: 0, fold: 1 };

/**
 * Look up the GTO frequency for hero's hand at this position.
 * Returns { raise, shove, fold } summing to 1.
 */
export function getRfiFrequency(position, hand) {
  return RFI_RANGES[position]?.[hand] || DEFAULT_FREQ;
}

/**
 * Grade an action against the frequency distribution.
 * "exact" if the chosen action is the most frequent (and ≥ 40% of mix)
 * "close" if the chosen action has ≥ 20% frequency (i.e. GTO does it sometimes)
 * "wrong" otherwise.
 */
export function gradeRfiAction(chosen, freq) {
  const f = freq[chosen] ?? 0;
  const max = Math.max(freq.raise, freq.shove, freq.fold);
  if (f === max && f >= 0.4) return "exact";
  if (f >= 0.2) return "close";
  return "wrong";
}

/**
 * Recommended primary action — the most frequent action, used in feedback.
 */
export function primaryAction(freq) {
  if (freq.raise >= freq.shove && freq.raise >= freq.fold) return "raise";
  if (freq.shove >= freq.fold) return "shove";
  return "fold";
}
