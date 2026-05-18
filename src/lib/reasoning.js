// Templated coaching text for the "before" and "after" decision panels.
// Pure functions of (position, hand, stack, stage, ...) — easy to swap out
// for LLM-generated content later by keeping the same shape.

import { POSITION_LABELS } from "../data/tableConfigs.js";
import { ICM_STAGES } from "../data/icmStages.js";
import { rankCategory, playersBehind } from "./handUtils.js";
import {
  getMaxPushBB, getMaxCallBB, getMaxReshoveBB,
  optimalPushAction, optimalCallAction, optimalReshoveAction,
} from "./decisionLogic.js";

// ---------- PUSH ----------

export function pushBefore(position, hand, stackBB, seatCount, stage /* , customMult */) {
  const cat = rankCategory(hand);
  const behind = playersBehind(position, seatCount);
  const stageInfo = ICM_STAGES[stage];

  let stackContext;
  if (stackBB <= 8) stackContext = "critical short-stack territory — every orbit costs ~1.5bb and your fold equity is fading";
  else if (stackBB <= 12) stackContext = "the classic shove-or-fold zone";
  else stackContext = "the upper shove zone — open-raising is viable but jamming keeps it simple";

  let positionContext;
  if (position === "SB") positionContext = "From the SB only one player can wake up, and you have 0.5bb invested — wide range";
  else if (position === "BTN") positionContext = "From the BTN both blinds defend imperfectly — wide range";
  else if (position === "CO") positionContext = `From CO with ${behind} players behind — wider than HJ, tighter than BTN`;
  else if (position === "HJ") positionContext = `From HJ with ${behind} players behind — be selective`;
  else positionContext = `From ${position} with ${behind} players behind — tight range`;

  return {
    setup: `${stackBB}bb in ${position} with ${cat} (${hand}). ${behind} player${behind === 1 ? "" : "s"} behind.`,
    stack: stackContext,
    position: positionContext,
    icm: stage !== "CHIP_EV" ? `${stageInfo.label}: ${stageInfo.description}` : null,
    question: "At this depth and stage, does equity-when-called + fold equity beat folding?",
  };
}

export function pushAfter(position, hand, stackBB, chosen, stage, customMult) {
  const correct = optimalPushAction(position, hand, stackBB, stage, customMult);
  const max = getMaxPushBB(position, hand, stage, customMult);
  const m = max - stackBB;
  const verdict = chosen === correct ? "correct" : "mistake";
  let why;
  if (correct === "shove") {
    why = m >= 5
      ? `${hand} is a clear shove — threshold ${max.toFixed(1)}bb vs your ${stackBB}bb.`
      : `${hand} is a thin but +EV shove — threshold ${max.toFixed(1)}bb vs ${stackBB}bb, ${m.toFixed(1)}bb cushion.`;
  } else {
    why = m <= -5
      ? `${hand} is a clear fold — threshold only ${max.toFixed(1)}bb at this stage.`
      : `${hand} is a close fold — threshold ${max.toFixed(1)}bb vs ${stackBB}bb (${(-m).toFixed(1)}bb over).`;
  }
  const icmNote = stage !== "CHIP_EV"
    ? `${ICM_STAGES[stage].label}: thresholds adjusted for tournament equity, not just chip EV.`
    : null;
  let lesson;
  if (chosen !== correct && correct === "shove") lesson = "Folding profitable shoves is the #1 short-stack leak.";
  else if (chosen !== correct && correct === "fold") lesson = "Over-shoving marginal hands burns equity. Patience now, pressure later.";
  else if (chosen === correct && correct === "shove") lesson = "Short-stack MTT is math. Trust the threshold.";
  else lesson = "Disciplined fold preserves stack for higher-EV spots.";
  return { verdict, correct, why, lesson, max, icmNote };
}

// ---------- CALL ----------

export function callBefore(heroPos, shoverPos, hand, stackBB, seatCount, stage /* , customMult */) {
  const cat = rankCategory(hand);
  const stageInfo = ICM_STAGES[stage];
  const requiredEquity = Math.round((stackBB / (stackBB * 2 + 1.5)) * 100);

  let positionContext = heroPos === "BB"
    ? "From BB you have 1bb invested — slightly better pot odds"
    : heroPos === "SB"
      ? "From SB — sandwiched, BB still behind, no fold equity"
      : `From ${heroPos} — calling with no fold equity, pure equity vs range`;

  let shoverContext = shoverPos === "BTN" || shoverPos === "CO"
    ? `${shoverPos} shoves wide — your call range stays reasonably wide`
    : shoverPos === "SB"
      ? "SB shoves very wide — call wider than instinct says"
      : `${shoverPos} shoves tight — call threshold tightens`;

  return {
    setup: `${shoverPos} shoves ${stackBB}bb. You're ${heroPos} with ${cat} (${hand}).`,
    potOdds: `Risking ${stackBB}bb to win ~${(stackBB + 1.5).toFixed(1)}bb. Required equity ≈ ${requiredEquity}%.`,
    position: positionContext,
    shover: shoverContext,
    icm: stage !== "CHIP_EV"
      ? `${stageInfo.label}: calls tighten dramatically — tournament life is worth more than chips.`
      : null,
    question: `Do I have ~${requiredEquity}% equity vs their shoving range?`,
  };
}

export function callAfter(heroPos, shoverPos, hand, stackBB, chosen, stage, customMult) {
  const correct = optimalCallAction(heroPos, shoverPos, hand, stackBB, stage, customMult);
  const max = getMaxCallBB(heroPos, shoverPos, hand, stage, customMult);
  const m = max - stackBB;
  const verdict = chosen === correct ? "correct" : "mistake";
  let why;
  if (correct === "call") {
    why = m >= 5
      ? `${hand} is a clear call — threshold ${max.toFixed(1)}bb vs ${stackBB}bb. Enough equity to beat the price.`
      : `${hand} is a thin but +EV call — threshold ${max.toFixed(1)}bb, only ${m.toFixed(1)}bb cushion.`;
  } else {
    why = m <= -5
      ? `${hand} is a clear fold — threshold only ${max.toFixed(1)}bb. Not enough equity for the price.`
      : `${hand} is a close fold — threshold ${max.toFixed(1)}bb vs ${stackBB}bb (${(-m).toFixed(1)}bb over).`;
  }
  const icmNote = stage !== "CHIP_EV"
    ? `Near the money, calls tighten dramatically. Hands like AJo and small pairs become folds.`
    : null;
  let lesson;
  if (chosen !== correct && correct === "call") lesson = "If the math says call, call. Marginal +EV calls compound.";
  else if (chosen !== correct && correct === "fold") lesson = (stage === "BUBBLE" || stage === "FT")
    ? "Near the money, hero calls that 'feel right' often aren't. ICM is brutal on calls."
    : "Calling too wide vs short-stack shoves is a major leak.";
  else if (chosen === correct && correct === "call") lesson = "Good call. Pot odds + equity > price = call.";
  else lesson = "Good fold. Discipline preserves equity.";
  return { verdict, correct, why, lesson, max, icmNote };
}

// ---------- RESHOVE ----------

export function reshoveBefore(heroPos, raiserPos, hand, stackBB, seatCount, stage /* , customMult */) {
  const cat = rankCategory(hand);
  const stageInfo = ICM_STAGES[stage];

  return {
    setup: `${raiserPos} min-raises to 2bb. You're ${heroPos} with ${stackBB}bb and ${cat} (${hand}).`,
    potOdds: `~3.5bb of dead money in the pot. Your jam needs to fold out villain's marginal hands OR have equity when called.`,
    position: heroPos === "BB"
      ? "From BB you already have 1bb invested — reshoving threshold widens"
      : heroPos === "SB"
        ? "From SB you have 0.5bb invested, plus you sit between raiser and BB"
        : `From ${heroPos} — reshoving cold, no prior investment`,
    raiser: raiserPos === "BTN" || raiserPos === "CO" || raiserPos === "SB"
      ? `${raiserPos} opens wide — they fold a lot to jams`
      : `${raiserPos} opens tight — they call jams more often, reshove tighter`,
    icm: stage !== "CHIP_EV"
      ? `${stageInfo.label}: reshove range tightens — losing the flip costs tournament equity.`
      : null,
    question: "Does fold equity + equity-when-called justify risking my whole stack here?",
  };
}

export function reshoveAfter(heroPos, raiserPos, hand, stackBB, chosen, stage, customMult) {
  const correct = optimalReshoveAction(heroPos, raiserPos, hand, stackBB, stage, customMult);
  const max = getMaxReshoveBB(heroPos, raiserPos, hand, stage, customMult);
  const m = max - stackBB;
  const verdict = chosen === correct ? "correct" : "mistake";
  let why;
  if (correct === "shove") {
    why = m >= 5
      ? `${hand} is a clear reshove — threshold ${max.toFixed(1)}bb vs ${stackBB}bb. Fold equity + dead money make this print.`
      : `${hand} is a thin reshove — threshold ${max.toFixed(1)}bb, ${m.toFixed(1)}bb cushion. Reshove ranges are tighter than open-shove because villain has a real range.`;
  } else {
    why = m <= -5
      ? `${hand} is a clear fold — threshold only ${max.toFixed(1)}bb. Reshoving here gets called too often by hands that crush you.`
      : `${hand} is a close fold — threshold ${max.toFixed(1)}bb vs ${stackBB}bb (${(-m).toFixed(1)}bb over). Reshove math is brutal: villain's calling range is strong.`;
  }
  const icmNote = stage !== "CHIP_EV"
    ? `Reshoves carry ICM weight: you risk a whole stack to win ~3.5bb of dead money. Late-stage reshoves should be tighter.`
    : null;
  let lesson;
  if (chosen !== correct && correct === "shove") lesson = "Reshoving denies villain's equity realization. When the math is there, take it.";
  else if (chosen !== correct && correct === "fold") lesson = "Reshoving too wide is a common 12-20bb leak. Villain's open is real; their calling range is real.";
  else if (chosen === correct && correct === "shove") lesson = "Good reshove. Dead money + fold equity > equity loss when called.";
  else lesson = "Good fold. Save the stack for a better spot than a coin flip.";
  return { verdict, correct, why, lesson, max, icmNote };
}
