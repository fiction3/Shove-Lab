import { createContext, useContext } from "react";
import useLocalStorage from "./useLocalStorage.js";
import { STRINGS } from "../data/i18n/strings.js";

// ─────────────────────────────────────────────────────────────────────
// Lightweight i18n.
//
// Design choices:
//   • Poker TERMS stay English in every language ("shove", "all-in",
//     "river", "pot odds", and the trainer mode names). Only UI chrome
//     and explanatory prose are translated.
//   • Lessons live in their own per-language data files (basicsLessons.sv.js
//     etc.) and are selected by language — they are NOT keyed through t().
//   • Short UI strings ARE keyed through t() against data/i18n/strings.js.
//   • Missing key or missing translation → falls back to English, then to
//     the key itself, so nothing ever renders blank.
// ─────────────────────────────────────────────────────────────────────

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sv", label: "Svenska" },
];

const LangContext = createContext({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage("lang", "en");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}

// Translate a UI string key. Usage: const { t } = useT(); t("tab.basics")
export function useT() {
  const { lang } = useLanguage();
  function t(key) {
    const table = STRINGS[lang] || {};
    if (key in table) return table[key];
    const en = STRINGS.en || {};
    if (key in en) return en[key];   // fall back to English
    return key;                       // last resort: show the key
  }
  return { t, lang };
}
