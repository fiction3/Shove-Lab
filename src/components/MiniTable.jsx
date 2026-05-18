import { TABLE_CONFIGS } from "../data/tableConfigs.js";

/**
 * Mini felt-table SVG visualizing the seating arrangement, hero seat (gold),
 * villain seat (red, in call/reshove modes), and folded seats (grey).
 * Includes seat-count picker buttons at the top.
 */
export default function MiniTable({ seatCount, heroPosition, villainPosition, onChangeSeats, mode }) {
  const positions = TABLE_CONFIGS[seatCount].positions;
  const heroIdx = positions.indexOf(heroPosition);
  const villainIdx = villainPosition ? positions.indexOf(villainPosition) : -1;

  const cx = 130, cy = 90, rx = 110, ry = 70;
  const seats = positions.map((pos, i) => {
    const angle = Math.PI / 2 + ((i - heroIdx) * (2 * Math.PI / positions.length));
    return {
      pos,
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
      isHero: i === heroIdx,
      isVillain: i === villainIdx,
      isFolded: mode === "push" ? i < heroIdx : (i < heroIdx && i !== villainIdx),
    };
  });

  const villainLabel = mode === "call" ? "SHOVE" : mode === "reshove" ? "RAISE" : null;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, justifyContent: "center" }}>
        {[2, 3, 6, 9].map(n => (
          <button key={n} onClick={() => onChangeSeats(n)}
            style={{
              background: n === seatCount ? "#d4a13b" : "transparent",
              color: n === seatCount ? "#0a1816" : "#e8e3d3",
              border: "1px solid " + (n === seatCount ? "#d4a13b" : "rgba(232,227,211,0.2)"),
              padding: "6px 12px", borderRadius: 4, cursor: "pointer",
              fontSize: 11, letterSpacing: "0.15em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
            {n === 2 ? "HU" : `${n}-max`}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 260 180" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <radialGradient id="feltGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e4a3e"/>
            <stop offset="100%" stopColor="#0d2620"/>
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={rx + 8} ry={ry + 8} fill="#3a2418" stroke="#6b4226" strokeWidth="2"/>
        <ellipse cx={cx} cy={cy} rx={rx - 2} ry={ry - 2} fill="url(#feltGrad)"/>
        <text x={cx} y={cy + 4} textAnchor="middle"
          fontSize="9" fill="rgba(212,161,59,0.4)"
          fontFamily="'Cormorant Garamond', serif" letterSpacing="0.3em">
          SHOVE·LAB
        </text>

        {seats.map((seat, i) => {
          const fill = seat.isHero ? "#d4a13b"
                     : seat.isVillain ? "#c8102e"
                     : seat.isFolded ? "rgba(100,100,100,0.3)"
                     : "rgba(232,227,211,0.85)";
          const textCol = seat.isHero ? "#0a1816"
                        : seat.isVillain ? "#fafaf7"
                        : seat.isFolded ? "rgba(200,200,200,0.4)"
                        : "#1a1a1a";
          return (
            <g key={i}>
              <circle cx={seat.x} cy={seat.y} r="15" fill={fill}
                stroke={seat.isHero || seat.isVillain ? "#fff" : "rgba(0,0,0,0.3)"}
                strokeWidth={seat.isHero || seat.isVillain ? 2 : 1}/>
              <text x={seat.x} y={seat.y + 3} textAnchor="middle"
                fontSize="9" fontWeight="700" fill={textCol}
                fontFamily="'Inter', sans-serif">{seat.pos}</text>
              {seat.isHero && (
                <text x={seat.x} y={seat.y + 28} textAnchor="middle"
                  fontSize="7" fill="#d4a13b" letterSpacing="0.15em"
                  fontFamily="'Inter', sans-serif" fontWeight="600">HERO</text>
              )}
              {seat.isVillain && villainLabel && (
                <text x={seat.x} y={seat.y + 28} textAnchor="middle"
                  fontSize="7" fill="#c8102e" letterSpacing="0.15em"
                  fontFamily="'Inter', sans-serif" fontWeight="600">{villainLabel}</text>
              )}
              {seat.isFolded && (
                <text x={seat.x} y={seat.y + 28} textAnchor="middle"
                  fontSize="6" fill="rgba(200,200,200,0.4)" letterSpacing="0.1em"
                  fontFamily="'Inter', sans-serif">FOLD</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
