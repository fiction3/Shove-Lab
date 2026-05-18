// Calling ranges (max bb at which calling an open-shove is +EV).
// Significantly tighter than push ranges: no fold equity, just pot odds + equity.

const BB_CALL_VS_SB = {
  AA: 99, KK: 99, QQ: 99, JJ: 99, TT: 60, 99: 35, 88: 25, 77: 20, 66: 17, 55: 14, 44: 12, 33: 11, 22: 10,
  AKs: 99, AQs: 60, AJs: 40, ATs: 30, A9s: 22, A8s: 18, A7s: 15, A6s: 13, A5s: 15, A4s: 13, A3s: 12, A2s: 11,
  AKo: 70, AQo: 40, AJo: 28, ATo: 20, A9o: 14, A8o: 11, A7o: 9, A6o: 8, A5o: 9, A4o: 7, A3o: 6, A2o: 6,
  KQs: 35, KJs: 25, KTs: 20, K9s: 14, K8s: 10, K7s: 8, K6s: 7, K5s: 6,
  KQo: 22, KJo: 15, KTo: 12, K9o: 8, K8o: 5, K7o: 3,
  QJs: 18, QTs: 14, Q9s: 10, Q8s: 7, Q7s: 5,
  QJo: 11, QTo: 8, Q9o: 5,
  JTs: 13, J9s: 9, J8s: 6, JTo: 7, J9o: 4,
  T9s: 8, T8s: 6, T7s: 4,
  "98s": 6, "87s": 5, "76s": 5, "65s": 4,
};

const BB_CALL_VS_BTN = {
  AA: 99, KK: 99, QQ: 99, JJ: 99, TT: 45, 99: 28, 88: 22, 77: 18, 66: 15, 55: 13, 44: 11, 33: 10, 22: 9,
  AKs: 99, AQs: 50, AJs: 30, ATs: 22, A9s: 16, A8s: 13, A7s: 11, A6s: 9, A5s: 11, A4s: 9, A3s: 8, A2s: 7,
  AKo: 60, AQo: 30, AJo: 22, ATo: 15, A9o: 11, A8o: 8, A7o: 6, A5o: 6,
  KQs: 28, KJs: 20, KTs: 16, K9s: 11, K8s: 8, K7s: 6,
  KQo: 18, KJo: 13, KTo: 10, K9o: 6, K8o: 4,
  QJs: 15, QTs: 12, Q9s: 8, Q8s: 5,
  QJo: 9, QTo: 6, Q9o: 3,
  JTs: 10, J9s: 7, J8s: 5, JTo: 5, J9o: 3,
  T9s: 7, T8s: 5,
  "98s": 5, "87s": 4, "76s": 4, "65s": 3,
};

const SB_CALL_VS_BTN = {
  AA: 99, KK: 99, QQ: 99, JJ: 60, TT: 30, 99: 20, 88: 15, 77: 12, 66: 10, 55: 9, 44: 8, 33: 7, 22: 6,
  AKs: 99, AQs: 35, AJs: 22, ATs: 16, A9s: 12, A8s: 10, A7s: 8, A5s: 9,
  AKo: 40, AQo: 22, AJo: 16, ATo: 11, A9o: 7,
  KQs: 20, KJs: 14, KTs: 11, K9s: 7,
  KQo: 12, KJo: 9, KTo: 6,
  QJs: 10, QTs: 8, JTs: 8,
};

const TIGHT_CALL = {
  AA: 99, KK: 99, QQ: 60, JJ: 35, TT: 22, 99: 15, 88: 12, 77: 10, 66: 8, 55: 6, 44: 5, 33: 5, 22: 4,
  AKs: 99, AQs: 30, AJs: 20, ATs: 14, A9s: 9,
  AKo: 50, AQo: 22, AJo: 15, ATo: 10,
  KQs: 16, KJs: 11, KTs: 8,
  KQo: 11, KJo: 7,
  QJs: 9, JTs: 7,
};

// Pick the right call range for a given hero/shover pairing.
export function getCallRange(heroPos, shoverPos) {
  if (heroPos === "BB" && shoverPos === "SB") return BB_CALL_VS_SB;
  if (heroPos === "BB" && shoverPos === "BTN") return BB_CALL_VS_BTN;
  if (heroPos === "BB") return BB_CALL_VS_BTN;
  if (heroPos === "SB" && shoverPos === "BTN") return SB_CALL_VS_BTN;
  if (heroPos === "SB") return SB_CALL_VS_BTN;
  return TIGHT_CALL;
}
