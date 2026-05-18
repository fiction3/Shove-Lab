// Reshove ranges (jamming over a min-raise, ~10-25bb depth).
// Wider than open-shove (dead money) but tighter than call (villain has a range).

const RESHOVE_BTN_VS_CO = {
  AA: 99, KK: 99, QQ: 99, JJ: 99, TT: 35, 99: 25, 88: 20, 77: 17, 66: 15, 55: 13, 44: 11, 33: 10, 22: 9,
  AKs: 99, AQs: 40, AJs: 28, ATs: 22, A9s: 16, A8s: 13, A7s: 11, A6s: 10, A5s: 13, A4s: 11, A3s: 10, A2s: 9,
  AKo: 50, AQo: 28, AJo: 20, ATo: 15, A9o: 11, A8o: 8, A7o: 6, A5o: 7,
  KQs: 22, KJs: 17, KTs: 14, K9s: 10, K8s: 7,
  KQo: 16, KJo: 12, KTo: 9, K9o: 5,
  QJs: 14, QTs: 11, Q9s: 7,
  QJo: 10, QTo: 7,
  JTs: 11, J9s: 7, JTo: 6,
  T9s: 7, "98s": 5, "87s": 4,
};

const RESHOVE_SB_VS_LP = {
  AA: 99, KK: 99, QQ: 99, JJ: 99, TT: 40, 99: 28, 88: 22, 77: 18, 66: 15, 55: 13, 44: 12, 33: 11, 22: 10,
  AKs: 99, AQs: 50, AJs: 32, ATs: 24, A9s: 17, A8s: 14, A7s: 12, A6s: 10, A5s: 14, A4s: 12, A3s: 11, A2s: 10,
  AKo: 60, AQo: 32, AJo: 22, ATo: 16, A9o: 12, A8o: 9, A7o: 7, A5o: 8,
  KQs: 25, KJs: 18, KTs: 15, K9s: 11, K8s: 8,
  KQo: 18, KJo: 13, KTo: 10, K9o: 6,
  QJs: 15, QTs: 12, Q9s: 8,
  QJo: 11, QTo: 8,
  JTs: 11, J9s: 8, JTo: 7,
  T9s: 8, "98s": 6, "87s": 5,
};

const RESHOVE_BB_VS_LP = {
  AA: 99, KK: 99, QQ: 99, JJ: 99, TT: 45, 99: 32, 88: 25, 77: 20, 66: 17, 55: 14, 44: 13, 33: 12, 22: 11,
  AKs: 99, AQs: 55, AJs: 35, ATs: 25, A9s: 18, A8s: 15, A7s: 13, A6s: 11, A5s: 15, A4s: 13, A3s: 12, A2s: 11,
  AKo: 65, AQo: 35, AJo: 25, ATo: 18, A9o: 13, A8o: 10, A7o: 8,
  KQs: 28, KJs: 20, KTs: 16, K9s: 12, K8s: 9,
  KQo: 20, KJo: 14, KTo: 11, K9o: 7,
  QJs: 16, QTs: 13, Q9s: 9,
  QJo: 12, QTo: 9,
  JTs: 12, J9s: 9, JTo: 7,
  T9s: 9, "98s": 7, "87s": 5,
};

export function getReshoveRange(heroPos /*, raiserPos */) {
  if (heroPos === "BTN") return RESHOVE_BTN_VS_CO;
  if (heroPos === "SB") return RESHOVE_SB_VS_LP;
  if (heroPos === "BB") return RESHOVE_BB_VS_LP;
  return RESHOVE_BB_VS_LP;
}
