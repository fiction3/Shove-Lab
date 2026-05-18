import { SUIT_GLYPHS, SUIT_COLORS, rankLabel } from "../lib/handUtils.js";

/**
 * Triton-broadcast-style playing card. Tall (2:3) aspect, white face,
 * thin black border. Three elements stacked diagonally:
 *   1. Big rank top-left
 *   2. Small suit pip directly below rank (left side)
 *   3. Larger suit pip in the lower-right corner
 *
 * Colors come from the GGPoker 4-color scheme defined in handUtils.
 */
export default function TritonCard({ card, hidden, size = 60 }) {
  const width = size;
  const height = Math.round(size * 1.4);

  if (hidden) {
    return (
      <div style={{
        width, height, borderRadius: 3,
        background: "repeating-linear-gradient(45deg, #6b1421, #6b1421 3px, #4a0e17 3px, #4a0e17 6px)",
        border: "1px solid #1a1a1a",
        boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
      }}/>
    );
  }
  const rank = card[0];
  const suit = card[1];
  const color = SUIT_COLORS[suit];
  const isTen = rank === "T";

  return (
    <div style={{
      width, height, borderRadius: 3,
      background: "#ffffff",
      border: "1px solid #1a1a1a",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        position: "absolute",
        top: size * 0.02,
        left: size * 0.08,
        color,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize: isTen ? size * 0.58 : size * 0.72,
        lineHeight: 0.9,
        letterSpacing: "-0.05em",
      }}>
        {rankLabel(rank)}
      </div>
      <div style={{
        position: "absolute",
        top: size * 0.68,
        left: size * 0.12,
        color,
        fontSize: size * 0.28,
        lineHeight: 1,
      }}>
        {SUIT_GLYPHS[suit]}
      </div>
      <div style={{
        position: "absolute",
        bottom: size * 0.04,
        right: size * 0.06,
        color,
        fontSize: size * 0.5,
        lineHeight: 1,
      }}>
        {SUIT_GLYPHS[suit]}
      </div>
    </div>
  );
}
