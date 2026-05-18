// Decision logic: given a spot, return the +EV action and the threshold value.

import { PUSH_RANGES } from "../data/pushRanges.js";
import { getCallRange } from "../data/callRanges.js";
import { getReshoveRange } from "../data/reshoveRanges.js";
import { ICM_STAGES } from "../data/icmStages.js";

export function getMaxPushBB(position, hand, stage, customMult) {
  const raw = PUSH_RANGES[position]?.[hand] ?? 0;
  const mult = stage === "CUSTOM" ? (customMult?.push ?? 1) : ICM_STAGES[stage].pushMult;
  return raw * mult;
}

export function getMaxCallBB(heroPos, shoverPos, hand, stage, customMult) {
  const range = getCallRange(heroPos, shoverPos);
  const raw = range[hand] ?? 0;
  const mult = stage === "CUSTOM" ? (customMult?.call ?? 1) : ICM_STAGES[stage].callMult;
  return raw * mult;
}

export function getMaxReshoveBB(heroPos, raiserPos, hand, stage, customMult) {
  const range = getReshoveRange(heroPos, raiserPos);
  const raw = range[hand] ?? 0;
  const mult = stage === "CUSTOM" ? (customMult?.reshove ?? 1) : ICM_STAGES[stage].reshoveMult;
  return raw * mult;
}

export function optimalPushAction(position, hand, stackBB, stage, customMult) {
  return stackBB <= getMaxPushBB(position, hand, stage, customMult) ? "shove" : "fold";
}

export function optimalCallAction(heroPos, shoverPos, hand, stackBB, stage, customMult) {
  return stackBB <= getMaxCallBB(heroPos, shoverPos, hand, stage, customMult) ? "call" : "fold";
}

export function optimalReshoveAction(heroPos, raiserPos, hand, stackBB, stage, customMult) {
  return stackBB <= getMaxReshoveBB(heroPos, raiserPos, hand, stage, customMult) ? "shove" : "fold";
}
