import { useState } from "react";
import { HAND_RANKINGS, COMMON_COMPARISONS } from "../data/handRankings.js";
import TritonCard from "./TritonCard.jsx";
import MiniHandPreview from "./MiniHandPreview.jsx";

const RARITY_COLOR = {
  "Mythical":    "#9b5de5",
  "Very rare":   "#e85d75",
  "Rare":        "#e07a5f",
  "Uncommon":    "#d4a13b",
  "Solid":       "#7fc69a",
  "Common":      "#5a8a40",
  "Very common": "#6b8a8a",
  "Default":     "#6b6b6b",
};

export default function HandsView() {
  const [selectedRank, setSelectedRank] = useState(1);
  const active = HAND_RANKINGS.find(h => h.rank === selectedRank);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "360px 1fr",
      gap: 24,
      alignItems: "start",
    }}>
      {/* Hand list */}
      <aside style={{
        background: "rgba(10,24,22,0.6)",
        border: "1px solid rgba(232,227,211,0.1)",
        borderRadius: 12,
        padding: 14,
        position: "sticky",
        top: 24,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
          opacity: 0.5, marginBottom: 12, padding: "4px 6px",
        }}>
          Hand Rankings (best → worst)
        </div>
        {HAND_RANKINGS.map(hand => {
          const isActive = hand.rank === selectedRank;
          return (
            <button
              key={hand.rank}
              onClick={() => setSelectedRank(hand.rank)}
              style={{
                width: "100%", textAlign: "left",
                background: isActive ? "rgba(212,161,59,0.12)" : "transparent",
                color: isActive ? "#d4a13b" : "#e8e3d3",
                border: "none",
                borderLeft: `2px solid ${isActive ? "#d4a13b" : "transparent"}`,
                padding: "10px 12px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20, fontWeight: 600,
                color: isActive ? "#d4a13b" : "rgba(232,227,211,0.4)",
                width: 18, textAlign: "right", flexShrink: 0,
              }}>
                {hand.rank}
              </span>
              <span style={{
                fontWeight: isActive ? 600 : 500,
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {hand.name}
              </span>
              <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.85 }}>
                <MiniHandPreview cards={hand.example} height={22}/>
              </span>
            </button>
          );
        })}
      </aside>

      {/* Content */}
      <article style={{
        background: "rgba(10,24,22,0.6)",
        border: "1px solid rgba(232,227,211,0.1)",
        borderRadius: 12,
        padding: 32,
        maxWidth: 780,
      }}>
        <header style={{
          marginBottom: 24, paddingBottom: 18,
          borderBottom: "1px solid rgba(232,227,211,0.12)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
          }}>
            <span style={{
              fontSize: 10, letterSpacing: "0.25em",
              textTransform: "uppercase", opacity: 0.55,
            }}>
              Rank {active.rank} of {HAND_RANKINGS.length}
            </span>
            <span style={{
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: RARITY_COLOR[active.rarity],
              padding: "2px 8px",
              border: `1px solid ${RARITY_COLOR[active.rarity]}40`,
              borderRadius: 3,
              fontWeight: 600,
            }}>
              {active.rarity}
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 38, fontWeight: 600, letterSpacing: "-0.01em",
            margin: 0, color: "#d4a13b", lineHeight: 1.1,
          }}>
            {active.name}
          </h1>
          <p style={{
            fontSize: 16, opacity: 0.85, marginTop: 10, marginBottom: 0,
            lineHeight: 1.5,
          }}>
            {active.description}
          </p>
        </header>

        {/* Cards */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.25em",
            textTransform: "uppercase", opacity: 0.5, marginBottom: 12,
          }}>
            Example
          </div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", padding: "12px 0" }}>
            {active.example.map((card, i) => (
              <TritonCard key={i} card={card} size={78}/>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 12, marginBottom: 24,
        }}>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Odds (5 random cards)</div>
            <div style={statValueStyle}>{active.odds}</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Rarity</div>
            <div style={{
              ...statValueStyle,
              color: RARITY_COLOR[active.rarity],
            }}>
              {active.rarity}
            </div>
          </div>
        </div>

        {/* Tip */}
        <div style={{
          padding: "16px 18px",
          background: "rgba(212,161,59,0.06)",
          borderLeft: "3px solid #d4a13b",
          borderRadius: 4,
          marginBottom: 28,
        }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#d4a13b",
            marginBottom: 6,
          }}>
            Playing tip
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.92 }}>
            {active.tip}
          </div>
        </div>

        {/* Prev / Next nav */}
        <nav style={{
          paddingTop: 16,
          borderTop: "1px solid rgba(232,227,211,0.12)",
          display: "flex", justifyContent: "space-between", gap: 12,
        }}>
          <NavButton
            target={HAND_RANKINGS.find(h => h.rank === selectedRank - 1)}
            direction="prev"
            onClick={r => setSelectedRank(r)}
          />
          <NavButton
            target={HAND_RANKINGS.find(h => h.rank === selectedRank + 1)}
            direction="next"
            onClick={r => setSelectedRank(r)}
          />
        </nav>

        {/* Common confusions, only on rank 1 */}
        {selectedRank === 1 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22, fontWeight: 600, margin: "0 0 14px 0",
            }}>
              Common confusions
            </h2>
            <p style={{ fontSize: 13, opacity: 0.7, margin: "0 0 16px 0" }}>
              Beginners frequently misremember these matchups. Lock them in.
            </p>
            {COMMON_COMPARISONS.map((c, i) => (
              <div key={i} style={{
                marginBottom: 10, padding: "12px 14px",
                background: "rgba(0,0,0,0.2)", borderRadius: 6,
                borderLeft: "2px solid #7fc69a",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  <span style={{ color: "#7fc69a" }}>{c.winner}</span>
                  <span style={{ opacity: 0.5, margin: "0 8px" }}>beats</span>
                  <span style={{ color: "#e07a5f" }}>{c.loser}</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4, lineHeight: 1.5 }}>
                  {c.reason}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function NavButton({ target, direction, onClick }) {
  if (!target) return <span style={{ flex: 1 }}/>;
  return (
    <button
      onClick={() => onClick(target.rank)}
      style={{
        flex: 1, textAlign: direction === "next" ? "right" : "left",
        background: "transparent", color: "#e8e3d3",
        border: "1px solid rgba(232,227,211,0.15)",
        borderRadius: 6, padding: "12px 16px",
        cursor: "pointer", fontFamily: "inherit",
      }}
    >
      <div style={{
        fontSize: 10, letterSpacing: "0.2em",
        textTransform: "uppercase", opacity: 0.5,
      }}>
        {direction === "next" ? "Weaker" : "Stronger"}
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18, marginTop: 4,
      }}>
        {direction === "next" ? `${target.name} →` : `← ${target.name}`}
      </div>
    </button>
  );
}

const statBoxStyle = {
  background: "rgba(0,0,0,0.2)",
  borderRadius: 6,
  padding: "12px 16px",
};
const statLabelStyle = {
  fontSize: 10, letterSpacing: "0.22em",
  textTransform: "uppercase", opacity: 0.55,
};
const statValueStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 22, color: "#d4a13b",
  marginTop: 4,
};
