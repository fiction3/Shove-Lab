// Card constants and hand-code utilities.

import { TABLE_CONFIGS } from "../data/tableConfigs.js";

export const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
export const SUITS = ["s", "h", "d", "c"];
export const SUIT_GLYPHS = { s: "♠", h: "♥", d: "♦", c: "♣" };

// 4-color GGPoker deck.
export const SUIT_COLORS = {
  s: "#1a1a1a", // spades — black
  h: "#d62828", // hearts — red
  d: "#1d6fb5", // diamonds — blue
  c: "#1f7a3a", // clubs — green
};

export function rankIndex(r) { return RANKS.indexOf(r); }
export function rankLabel(r) { return r === "T" ? "10" : r; }

// Convert two cards (e.g. "Ah", "Ks") to canonical hand code ("AKs", "AKo", "AA").
export function handCode(c1, c2) {
  const r1 = c1[0], r2 = c2[0], s1 = c1[1], s2 = c2[1];
  if (r1 === r2) return r1 + r2;
  const hi = rankIndex(r1) < rankIndex(r2) ? r1 : r2;
  const lo = rankIndex(r1) < rankIndex(r2) ? r2 : r1;
  return hi + lo + (s1 === s2 ? "s" : "o");
}

export function randomHand() {
  const deck = [];
  for (const r of RANKS) for (const s of SUITS) deck.push(r + s);
  const i = Math.floor(Math.random() * 52);
  let j = Math.floor(Math.random() * 52);
  while (j === i) j = Math.floor(Math.random() * 52);
  return [deck[i], deck[j]];
}

// Stack depth depends on mode — reshove uses deeper stacks.
export function randomStack(mode) {
  if (mode === "reshove") {
    const choices = [10, 12, 14, 16, 18, 20, 22, 25];
    return choices[Math.floor(Math.random() * choices.length)];
  }
  if (mode === "openRaise") {
    // Medium-stack RFI: 20-40bb territory where raise becomes the primary action.
    const choices = [20, 22, 25, 28, 30, 33, 35, 40];
    return choices[Math.floor(Math.random() * choices.length)];
  }
  const choices = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  return choices[Math.floor(Math.random() * choices.length)];
}

export function randomPositionFor(seatCount, lockedPosition, mode) {
  if (lockedPosition && lockedPosition !== "RANDOM") return lockedPosition;
  const opts = mode === "call" ? TABLE_CONFIGS[seatCount].callableFrom
             : mode === "reshove" ? TABLE_CONFIGS[seatCount].reshovableFrom
             : mode === "openRaise" ? TABLE_CONFIGS[seatCount].rfiTrainablePositions
             : TABLE_CONFIGS[seatCount].trainablePositions;
  return opts[Math.floor(Math.random() * opts.length)];
}

export function randomVillainBefore(seatCount, heroPos) {
  const positions = TABLE_CONFIGS[seatCount].positions;
  const heroIdx = positions.indexOf(heroPos);
  if (heroIdx <= 0) return null;
  const candidates = positions.slice(0, heroIdx);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function playersBehind(position, seatCount) {
  const positions = TABLE_CONFIGS[seatCount].positions;
  const idx = positions.indexOf(position);
  if (idx === -1) return 0;
  return positions.length - idx - 1;
}

export function rankCategory(hand) {
  if (/^(AA|KK|QQ|JJ|TT)$/.test(hand)) return "premium pair";
  if (/^([2-9])\1$/.test(hand)) return "small/medium pair";
  if (/^A.s$/.test(hand)) return "suited ace";
  if (/^A.o$/.test(hand)) return "offsuit ace";
  if (/^K.s$/.test(hand) || /^Q.s$/.test(hand)) return "suited broadway";
  if (/s$/.test(hand)) return "suited holding";
  return "offsuit holding";
}

export function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
