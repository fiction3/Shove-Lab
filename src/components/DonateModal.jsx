import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────
// Donation options.
//
// IMPORTANT — replace every placeholder below with your REAL details:
//   • each crypto `address`: your real receiving wallet address
//
// SAFETY NOTES (please read):
//   • Crypto transfers are IRREVERSIBLE. A wrong address = funds lost forever.
//     Double-check each address you paste in below, character for character.
//   • If an XRP/TRON address belongs to an EXCHANGE account, it may also need
//     a DESTINATION TAG / MEMO. If so, fill in the `memo` field and it will be
//     shown to donors. For personal self-custody wallets you can leave it blank.
// ─────────────────────────────────────────────────────────────────────

const CRYPTO_OPTIONS = [
  {
    key: "btc",
    label: "Bitcoin",
    ticker: "BTC",
    address: "bc1q6d2hwl5dj7welgg4ug9pdwczs34yleaplxtlj4",       // ← REPLACE
    memo: "",
    color: "#f7931a",
  },
  {
    key: "eth",
    label: "Ethereum",
    ticker: "ETH",
    address: "0x2eBE9B77726939d7e1B023d8796Eba533Cdf33D6",       // ← REPLACE
    memo: "",
    color: "#627eea",
  },
  {
    key: "xrp",
    label: "XRP",
    ticker: "XRP",
    address: "rHc36zpbXe1VHShpQmeH7XPDmvheFP3L5M",       // ← REPLACE
    memo: "",                                 // ← set a destination tag here if your XRP destination needs one
    color: "#23292f",
  },
  {
    key: "trx",
    label: "TRON",
    ticker: "TRX",
    address: "TZE817AiL4ezgypvReh9Q6KE5HxgB5rN47",      // ← REPLACE
    memo: "",
    color: "#ef0027",
  },
];

export default function DonateModal({ open, onClose }) {
  const [selected, setSelected] = useState(null); // crypto key currently expanded
  const [copied, setCopied] = useState(null);      // which field was just copied

  // Reset internal state whenever the modal is reopened.
  useEffect(() => {
    if (open) { setSelected(null); setCopied(null); }
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function copy(text, fieldId) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(fieldId);
      setTimeout(() => setCopied(c => (c === fieldId ? null : c)), 1800);
    } catch {
      // Clipboard can fail (permissions / insecure context); ignore silently.
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "rgba(4,12,10,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0d1f1b",
          border: "1px solid rgba(212,161,59,0.3)",
          borderRadius: 14,
          padding: 24,
          maxWidth: 440, width: "100%",
          maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, fontWeight: 600, margin: 0, color: "#d4a13b",
          }}>
            Support Shove·Lab
          </h2>
          <button onClick={onClose} style={{
            background: "transparent", border: "none",
            color: "rgba(232,227,211,0.6)", fontSize: 24,
            cursor: "pointer", lineHeight: 1, padding: "0 4px",
          }}>
            ×
          </button>
        </div>
        <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5, margin: "0 0 20px 0" }}>
          Shove·Lab is free. If it's helped your game, a small contribution helps keep it
          running and growing — entirely optional, and very appreciated.
        </p>

        {/* Crypto options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CRYPTO_OPTIONS.map(opt => (
            <CryptoRow
              key={opt.key}
              opt={opt}
              expanded={selected === opt.key}
              onToggle={() => setSelected(s => (s === opt.key ? null : opt.key))}
              onCopy={copy}
              copied={copied}
            />
          ))}
        </div>

        <p style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.5, margin: "18px 0 0 0" }}>
          Crypto transfers are irreversible. Copy the full address (or scan the QR) and
          double-check it in your wallet before sending.
        </p>
      </div>
    </div>
  );
}

function CryptoRow({ opt, expanded, onToggle, onCopy, copied }) {
  const [qr, setQr] = useState(null);

  // Generate a QR code (as an SVG data URI) for the address when expanded.
  // The qrcode library is imported dynamically so it's only loaded when a
  // donor actually opens a crypto option — keeping the initial bundle small.
  useEffect(() => {
    if (!expanded) return;
    let cancelled = false;
    import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toString(opt.address, { type: "svg", margin: 1, width: 160 })
      )
      .then(svg => {
        if (cancelled) return;
        const uri = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
        setQr(uri);
      })
      .catch(() => setQr(null));
    return () => { cancelled = true; };
  }, [expanded, opt.address]);

  return (
    <div style={{
      border: `1px solid ${expanded ? "rgba(212,161,59,0.4)" : "rgba(232,227,211,0.15)"}`,
      borderRadius: 8,
      overflow: "hidden",
      transition: "border-color 0.15s",
    }}>
      {/* Row header — click to expand */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", gap: 12,
          background: expanded ? "rgba(212,161,59,0.06)" : "transparent",
          border: "none", cursor: "pointer",
          padding: "12px 14px",
          fontFamily: "inherit", color: "#e8e3d3",
          textAlign: "left",
        }}
      >
        <span style={{
          width: 30, height: 30, borderRadius: "50%",
          background: opt.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#fff",
          flexShrink: 0,
        }}>
          {opt.ticker.slice(0, 3)}
        </span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>
          {opt.label} <span style={{ opacity: 0.5, fontWeight: 400 }}>({opt.ticker})</span>
        </span>
        <span style={{ opacity: 0.5, fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Expanded detail — QR + address + copy */}
      {expanded && (
        <div style={{ padding: "4px 14px 16px 14px" }}>
          {qr && (
            <div style={{
              display: "flex", justifyContent: "center", marginBottom: 12,
            }}>
              <div style={{ background: "#fff", padding: 8, borderRadius: 6 }}>
                <img src={qr} alt={`${opt.label} address QR`} width={150} height={150}/>
              </div>
            </div>
          )}

          <div style={{
            fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
            opacity: 0.5, marginBottom: 4,
          }}>
            Address
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: opt.memo ? 12 : 0 }}>
            <code style={{
              flex: 1, fontSize: 12, lineHeight: 1.4,
              background: "rgba(0,0,0,0.35)", borderRadius: 6,
              padding: "8px 10px", wordBreak: "break-all",
              fontFamily: "'JetBrains Mono', 'Menlo', monospace",
              color: "#e8e3d3",
            }}>
              {opt.address}
            </code>
            <button
              onClick={() => onCopy(opt.address, opt.key + "-addr")}
              style={{
                flexShrink: 0,
                background: copied === opt.key + "-addr" ? "#7fc69a" : "#d4a13b",
                color: "#0a1816", border: "none", borderRadius: 6,
                padding: "0 14px", cursor: "pointer",
                fontWeight: 700, fontSize: 12,
                fontFamily: "inherit",
              }}
            >
              {copied === opt.key + "-addr" ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Destination tag / memo, if the address needs one */}
          {opt.memo && (
            <>
              <div style={{
                fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
                opacity: 0.5, marginBottom: 4,
              }}>
                Destination tag / memo — required
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                <code style={{
                  flex: 1, fontSize: 12, lineHeight: 1.4,
                  background: "rgba(0,0,0,0.35)", borderRadius: 6,
                  padding: "8px 10px", wordBreak: "break-all",
                  fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                  color: "#e8e3d3",
                }}>
                  {opt.memo}
                </code>
                <button
                  onClick={() => onCopy(opt.memo, opt.key + "-memo")}
                  style={{
                    flexShrink: 0,
                    background: copied === opt.key + "-memo" ? "#7fc69a" : "#d4a13b",
                    color: "#0a1816", border: "none", borderRadius: 6,
                    padding: "0 14px", cursor: "pointer",
                    fontWeight: 700, fontSize: 12,
                    fontFamily: "inherit",
                  }}
                >
                  {copied === opt.key + "-memo" ? "Copied" : "Copy"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
