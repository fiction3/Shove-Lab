/**
 * Stylized mini range-grid icon. Renders a 13×13 grid where:
 *   - Premium hands (top-left): solid green (always in range)
 *   - Medium hands (middle): warm amber (sometimes)
 *   - Weak hands (bottom-right): dark grey (rarely / never)
 *   - The diagonal (pairs) gets a slightly brighter tint
 *
 * Used in place of an emoji icon on the "Show range grid" button.
 * Sized via the `size` prop (px). Designed to read clearly at 16–24px.
 */
export default function RangeGridIcon({ size = 18 }) {
  const N = 13;
  const cell = (size - 1) / N;

  // Color tier based on (row, col). Top-left = strongest hand region.
  // Each cell's "weight" is roughly how strong that hand is in a typical
  // medium-stack opening range. We map weight → one of 4 colors.
  function colorFor(i, j) {
    // Distance from top-left corner, normalized
    const dist = (i + j) / (2 * (N - 1));
    const isPair = i === j;
    if (dist < 0.18) return "#7fc69a"; // premium
    if (dist < 0.32) return isPair ? "#a87330" : "#9a7530";
    if (dist < 0.5)  return isPair ? "#6a5530" : "#4a3a20";
    return "#2a2a2a"; // fold
  }

  const cells = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={j * cell + 0.5}
          y={i * cell + 0.5}
          width={cell - 0.3}
          height={cell - 0.3}
          fill={colorFor(i, j)}
        />
      );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {cells}
    </svg>
  );
}
