import { useEffect } from "react";
import RangeViewer from "./RangeViewer.jsx";
import { ICM_STAGES } from "../data/icmStages.js";

/**
 * Modal overlay showing the current mode's range with the user's current
 * hand highlighted. Opened from the Trainer coaching panel.
 *
 * Click outside, press Escape, or click the × to close.
 */
export default function RangePopover({ open, onClose, mode, position, stage, customMult, highlightHand, villain }) {
  // Escape key to close
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const modeLabel = mode === "push" ? "Open Shove"
                  : mode === "openRaise" ? "Open Raise Range"
                  : mode === "call" ? "Call Range"
                  : mode === "reshove" ? "Reshove Range"
                  : mode === "threeBetDef" ? "3-Bet Defense Range"
                  : "Range";
  const villainContext = mode === "call" ? ` vs ${villain || "BTN"} shove`
                       : mode === "reshove" ? ` vs ${villain || "CO"} raise`
                       : mode === "threeBetDef" ? ` vs ${villain || "BB"} 3-bet`
                       : "";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(5, 11, 10, 0.85)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.15s ease-out",
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, rgba(15,40,32,0.95) 0%, rgba(8,22,18,0.98) 100%)",
          border: "1px solid rgba(212,161,59,0.3)",
          borderRadius: 14,
          padding: 28,
          maxWidth: 760,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          position: "relative",
        }}>
        {/* Close button */}
        <button onClick={onClose}
          aria-label="Close range view"
          style={{
            position: "absolute", top: 14, right: 14,
            background: "transparent",
            color: "rgba(232,227,211,0.7)",
            border: "1px solid rgba(232,227,211,0.2)",
            borderRadius: "50%",
            width: 32, height: 32,
            cursor: "pointer",
            fontSize: 16, fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center",
            lineHeight: 1,
          }}>
          ×
        </button>

        <div style={{
          fontSize: 10, letterSpacing: "0.25em",
          textTransform: "uppercase", opacity: 0.6, marginBottom: 4,
        }}>
          Range reference
        </div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 24, fontWeight: 600,
          margin: "0 0 4px 0", color: "#d4a13b",
        }}>
          {modeLabel} · {position}{villainContext}
        </h3>
        <p style={{ fontSize: 12, opacity: 0.65, margin: "0 0 16px 0" }}>
          Stage: {ICM_STAGES[stage].label}. Your current hand{highlightHand && <strong style={{ color: "#ffd96a" }}> {highlightHand} </strong>}is highlighted.
          Numbers in each cell = max effective stack (bb) at which the action is +EV.
        </p>

        <RangeViewer
          mode={mode}
          position={position}
          stage={stage}
          customMult={customMult}
          highlightHand={highlightHand}
          shoverPos={mode === "call" ? villain : undefined}
          raiserPos={mode === "reshove" ? villain : undefined}
          threeBettorPos={mode === "threeBetDef" ? villain : undefined}
        />

        <div style={{
          marginTop: 16, fontSize: 11, opacity: 0.55,
          textAlign: "center", fontStyle: "italic",
        }}>
          Press Escape or click outside to close
        </div>
      </div>
    </div>
  );
}
