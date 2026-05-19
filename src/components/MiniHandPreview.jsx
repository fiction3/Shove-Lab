import { SUIT_GLYPHS, SUIT_COLORS, rankLabel } from "../lib/handUtils.js";

/**
 * Mini 5-card hand visual for inline display (e.g. sidebar rows).
 * Cards sit side-by-side with a thin gap (no overlap).
 *
 * Tuned for ~22px-tall rows.
 */
export default function MiniHandPreview({ cards, height = 24 }) {
  const cardW = Math.round(height * 0.68);

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 1,
      height,
    }}>
      {cards.map((card, i) => {
        const rank = card[0];
        const suit = card[1];
        const color = SUIT_COLORS[suit];
        return (
          <div key={i} style={{
            width: cardW,
            height,
            background: "#ffffff",
            border: "0.5px solid #1a1a1a",
            borderRadius: 2,
            position: "relative",
            boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            padding: "1px 0",
          }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: Math.round(height * 0.45),
              fontWeight: 700,
              color,
              letterSpacing: "-0.5px",
            }}>
              {rankLabel(rank)}
            </span>
            <span style={{
              fontSize: Math.round(height * 0.32),
              color,
              lineHeight: 1,
              marginTop: 1,
            }}>
              {SUIT_GLYPHS[suit]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
