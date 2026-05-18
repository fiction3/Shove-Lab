// Nash equilibrium open-shove ranges. Each map: hand code -> max effective
// stack (bb) at which open-shoving is +EV when folded to.
// Source: approximated from publicly published Nash charts (HoldemResources,
// SnGWiz). Accurate to the strategic concept, within ~1-2bb of solver outputs.

const BTN_PUSH = {
  AA: 99, KK: 99, QQ: 99, JJ: 99, TT: 50, 99: 40, 88: 30, 77: 25, 66: 22, 55: 20, 44: 18, 33: 16, 22: 15,
  AKs: 99, AQs: 50, AJs: 40, ATs: 30, A9s: 22, A8s: 20, A7s: 18, A6s: 16, A5s: 18, A4s: 16, A3s: 15, A2s: 14,
  AKo: 60, AQo: 35, AJo: 25, ATo: 20, A9o: 16, A8o: 14, A7o: 12, A6o: 11, A5o: 12, A4o: 10, A3o: 9, A2o: 8,
  KQs: 30, KJs: 22, KTs: 20, K9s: 16, K8s: 14, K7s: 12, K6s: 11, K5s: 10, K4s: 9, K3s: 8, K2s: 7,
  KQo: 22, KJo: 18, KTo: 15, K9o: 12, K8o: 9, K7o: 7, K6o: 6, K5o: 5, K4o: 4, K3o: 3, K2o: 3,
  QJs: 20, QTs: 18, Q9s: 14, Q8s: 11, Q7s: 9, Q6s: 8, Q5s: 7, Q4s: 6, Q3s: 5, Q2s: 4,
  QJo: 15, QTo: 12, Q9o: 9, Q8o: 6, Q7o: 4, Q6o: 3, Q5o: 3, Q4o: 2, Q3o: 2, Q2o: 2,
  JTs: 17, J9s: 13, J8s: 10, J7s: 7, J6s: 5, J5s: 4, J4s: 3, J3s: 3, J2s: 2,
  JTo: 11, J9o: 8, J8o: 5, J7o: 3,
  T9s: 12, T8s: 9, T7s: 6, T6s: 4, T9o: 7, T8o: 4,
  "98s": 9, "97s": 6, "96s": 4, "98o": 5,
  "87s": 8, "86s": 5, "76s": 7, "65s": 6, "54s": 5,
};

const CO_PUSH = {
  AA: 99, KK: 99, QQ: 99, JJ: 60, TT: 35, 99: 25, 88: 20, 77: 17, 66: 14, 55: 12, 44: 10, 33: 9, 22: 8,
  AKs: 99, AQs: 35, AJs: 25, ATs: 20, A9s: 14, A8s: 12, A7s: 11, A6s: 9, A5s: 11, A4s: 9, A3s: 8, A2s: 7,
  AKo: 40, AQo: 22, AJo: 17, ATo: 13, A9o: 10, A8o: 8, A7o: 6, A6o: 5, A5o: 6, A4o: 4, A3o: 3, A2o: 3,
  KQs: 20, KJs: 15, KTs: 13, K9s: 9, K8s: 6, K7s: 4, K6s: 3,
  KQo: 14, KJo: 11, KTo: 9, K9o: 5, K8o: 3,
  QJs: 13, QTs: 11, Q9s: 7, Q8s: 4, QJo: 9, QTo: 7, Q9o: 4,
  JTs: 11, J9s: 7, J8s: 5, JTo: 6, J9o: 3,
  T9s: 7, T8s: 5, T9o: 3,
  "98s": 5, "87s": 4, "76s": 4, "65s": 3,
};

const HJ_PUSH = {
  AA: 99, KK: 99, QQ: 99, JJ: 40, TT: 25, 99: 18, 88: 15, 77: 13, 66: 11, 55: 10, 44: 9, 33: 8, 22: 7,
  AKs: 99, AQs: 25, AJs: 18, ATs: 14, A9s: 10, A8s: 9, A7s: 8, A6s: 7, A5s: 9, A4s: 8, A3s: 7, A2s: 6,
  AKo: 30, AQo: 17, AJo: 13, ATo: 10, A9o: 7, A8o: 5, A7o: 4, A5o: 4,
  KQs: 14, KJs: 11, KTs: 9, K9s: 6, K8s: 4,
  KQo: 11, KJo: 8, KTo: 6, K9o: 3,
  QJs: 10, QTs: 8, Q9s: 5, QJo: 6, QTo: 4,
  JTs: 8, J9s: 5, JTo: 4,
  T9s: 5, "98s": 4, "87s": 3,
};

const UTG_PUSH = {
  AA: 99, KK: 99, QQ: 60, JJ: 30, TT: 18, 99: 13, 88: 11, 77: 9, 66: 8, 55: 7, 44: 6, 33: 5, 22: 5,
  AKs: 50, AQs: 18, AJs: 13, ATs: 10, A9s: 7, A8s: 6, A7s: 5, A5s: 6, A4s: 5,
  AKo: 20, AQo: 13, AJo: 9, ATo: 6, A9o: 4,
  KQs: 10, KJs: 8, KTs: 6, K9s: 4,
  KQo: 8, KJo: 5, KTo: 4,
  QJs: 7, QTs: 5, JTs: 6,
};

const SB_PUSH = {
  AA: 99, KK: 99, QQ: 99, JJ: 99, TT: 99, 99: 99, 88: 99, 77: 99, 66: 60, 55: 45, 44: 35, 33: 28, 22: 25,
  AKs: 99, AQs: 99, AJs: 99, ATs: 99, A9s: 80, A8s: 60, A7s: 50, A6s: 40, A5s: 55, A4s: 45, A3s: 38, A2s: 33,
  AKo: 99, AQo: 99, AJo: 99, ATo: 60, A9o: 35, A8o: 25, A7o: 20, A6o: 17, A5o: 22, A4o: 17, A3o: 15, A2o: 13,
  KQs: 99, KJs: 80, KTs: 60, K9s: 35, K8s: 25, K7s: 20, K6s: 17, K5s: 15, K4s: 13, K3s: 11, K2s: 10,
  KQo: 60, KJo: 40, KTo: 28, K9o: 18, K8o: 13, K7o: 10, K6o: 8, K5o: 7, K4o: 6, K3o: 5, K2o: 5,
  QJs: 50, QTs: 35, Q9s: 22, Q8s: 16, Q7s: 12, Q6s: 10, Q5s: 9, Q4s: 8, Q3s: 7, Q2s: 6,
  QJo: 28, QTo: 22, Q9o: 14, Q8o: 10, Q7o: 7, Q6o: 6, Q5o: 5, Q4o: 4, Q3o: 4, Q2o: 3,
  JTs: 35, J9s: 22, J8s: 15, J7s: 11, J6s: 8, J5s: 7, J4s: 6, J3s: 5, J2s: 5,
  JTo: 22, J9o: 14, J8o: 9, J7o: 6, J6o: 4, J5o: 4,
  T9s: 22, T8s: 14, T7s: 10, T6s: 8, T5s: 6, T4s: 5,
  T9o: 13, T8o: 9, T7o: 6, T6o: 4,
  "98s": 14, "97s": 10, "96s": 7, "95s": 5, "98o": 8, "97o": 5,
  "87s": 12, "86s": 8, "85s": 6, "87o": 6,
  "76s": 10, "75s": 7, "65s": 9, "64s": 6, "54s": 7, "43s": 5,
};

export const PUSH_RANGES = {
  UTG: UTG_PUSH, UTG1: UTG_PUSH, MP: UTG_PUSH, MP1: HJ_PUSH,
  HJ: HJ_PUSH, CO: CO_PUSH, BTN: BTN_PUSH, SB: SB_PUSH,
};
