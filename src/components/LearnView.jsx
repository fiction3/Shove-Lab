import { useState } from "react";
import { LESSONS } from "../data/lessons.js";
import useMediaQuery from "../lib/useMediaQuery.js";

/**
 * Two-pane lesson reader. Used by both the Learn tab (strategy lessons) and
 * the Basics tab (beginner lessons). Pass `lessons` to override the default
 * strategy lesson set, and `listLabel` to change the sidebar header.
 *
 * Section types supported: prose | heading | example | calc | list
 */
export default function LearnView({ onJumpToDrill, lessons = LESSONS, listLabel = "Lessons" }) {
  const [activeId, setActiveId] = useState(lessons[0].id);
  const active = lessons.find(l => l.id === activeId) || lessons[0];
  const isMobile = useMediaQuery(768);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "260px 1fr",
      gap: isMobile ? 16 : 24,
      alignItems: "start",
    }}>
      {/* Lesson list */}
      <aside style={{
        background: "rgba(10,24,22,0.6)",
        border: "1px solid rgba(232,227,211,0.1)",
        borderRadius: 12,
        padding: 16,
        position: isMobile ? "static" : "sticky",
        top: isMobile ? "auto" : 24,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
          opacity: 0.5, marginBottom: 12, padding: "0 4px",
        }}>
          {listLabel}
        </div>
        {lessons.map((lesson, i) => {
          const isActive = lesson.id === activeId;
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveId(lesson.id)}
              style={{
                width: "100%", textAlign: "left",
                background: isActive ? "rgba(212,161,59,0.12)" : "transparent",
                color: isActive ? "#d4a13b" : "#e8e3d3",
                border: "none",
                borderLeft: `2px solid ${isActive ? "#d4a13b" : "transparent"}`,
                padding: "10px 14px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                lineHeight: 1.3,
                marginBottom: 2,
              }}
            >
              <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 2 }}>
                {String(i + 1).padStart(2, "0")} · {lesson.estimatedMinutes} min
              </div>
              <div style={{ fontWeight: isActive ? 600 : 500 }}>
                {lesson.title}
              </div>
            </button>
          );
        })}
      </aside>

      {/* Lesson content */}
      <article style={{
        background: "rgba(10,24,22,0.6)",
        border: "1px solid rgba(232,227,211,0.1)",
        borderRadius: 12,
        padding: isMobile ? 18 : 36,
        maxWidth: 760,
      }}>
        <header style={{
          marginBottom: 28,
          paddingBottom: 18,
          borderBottom: "1px solid rgba(232,227,211,0.12)",
        }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.25em",
            textTransform: "uppercase", opacity: 0.5, marginBottom: 8,
          }}>
            {active.estimatedMinutes} minute read
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 38, fontWeight: 600, letterSpacing: "-0.01em",
            margin: 0, color: "#d4a13b", lineHeight: 1.1,
          }}>
            {active.title}
          </h1>
          <p style={{
            fontSize: 16, opacity: 0.75, marginTop: 8, marginBottom: 0,
            fontStyle: "italic", lineHeight: 1.4,
          }}>
            {active.subtitle}
          </p>
        </header>

        {active.sections.map((section, i) => (
          <Section key={i} section={section}/>
        ))}

        {active.drillSuggestion && (
          <div style={{
            marginTop: 32, padding: "18px 22px",
            background: "rgba(212,161,59,0.08)",
            border: "1px solid rgba(212,161,59,0.25)",
            borderRadius: 8,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: 16,
          }}>
            <div>
              <div style={{
                fontSize: 10, letterSpacing: "0.2em",
                textTransform: "uppercase", opacity: 0.6,
              }}>
                Practice this concept
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18, marginTop: 4, color: "#d4a13b",
              }}>
                Drill the math until it's reflex
              </div>
            </div>
            <button
              onClick={() => onJumpToDrill?.(active.drillSuggestion)}
              style={{
                background: "#d4a13b", color: "#0a1816",
                border: "none", padding: "10px 20px",
                borderRadius: 6, cursor: "pointer",
                fontSize: 12, letterSpacing: "0.2em",
                textTransform: "uppercase", fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Start drill →
            </button>
          </div>
        )}

        {/* Prev/next nav */}
        <nav style={{
          marginTop: 36, paddingTop: 20,
          borderTop: "1px solid rgba(232,227,211,0.12)",
          display: "flex", justifyContent: "space-between", gap: 16,
        }}>
          <LessonNavButton lessons={lessons} activeId={activeId} direction={-1} onClick={setActiveId}/>
          <LessonNavButton lessons={lessons} activeId={activeId} direction={1} onClick={setActiveId}/>
        </nav>
      </article>
    </div>
  );
}

function LessonNavButton({ lessons, activeId, direction, onClick }) {
  const idx = lessons.findIndex(l => l.id === activeId);
  const target = lessons[idx + direction];
  if (!target) return <span style={{ flex: 1 }}/>;
  return (
    <button
      onClick={() => onClick(target.id)}
      style={{
        flex: 1, textAlign: direction > 0 ? "right" : "left",
        background: "transparent", color: "#e8e3d3",
        border: "1px solid rgba(232,227,211,0.15)",
        borderRadius: 6, padding: "12px 16px",
        cursor: "pointer", fontFamily: "inherit",
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>
        {direction > 0 ? "Next" : "Previous"}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginTop: 4 }}>
        {direction > 0 ? `${target.title} →` : `← ${target.title}`}
      </div>
    </button>
  );
}

function Section({ section }) {
  switch (section.type) {
    case "prose":
      return (
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: "0 0 16px 0", opacity: 0.92 }}>
          {section.text}
        </p>
      );
    case "heading":
      return (
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, fontWeight: 600,
          margin: "28px 0 12px 0", color: "#e8e3d3",
        }}>
          {section.text}
        </h2>
      );
    case "list":
      return (
        <ul style={{ fontSize: 15, lineHeight: 1.7, paddingLeft: 24, margin: "0 0 16px 0" }}>
          {section.items.map((item, i) => (
            <li key={i} style={{ marginBottom: 8, opacity: 0.92 }}>{item}</li>
          ))}
        </ul>
      );
    case "example":
      return (
        <div style={{
          margin: "20px 0",
          padding: "16px 18px",
          background: "rgba(212,161,59,0.06)",
          borderLeft: "3px solid #d4a13b",
          borderRadius: 4,
        }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#d4a13b", marginBottom: 6,
          }}>
            {section.title}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.92 }}>
            {section.body}
          </div>
        </div>
      );
    case "calc":
      return (
        <div style={{
          margin: "20px 0",
          padding: "18px",
          background: "rgba(0,0,0,0.25)",
          borderRadius: 6,
          fontFamily: "'JetBrains Mono', 'Menlo', monospace",
          fontSize: 14,
          textAlign: "center",
          color: "#d4a13b",
          letterSpacing: "0.02em",
        }}>
          {section.expression}
        </div>
      );
    default:
      return null;
  }
}
