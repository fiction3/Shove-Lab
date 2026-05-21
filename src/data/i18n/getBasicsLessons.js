// Returns the Basics lessons for a given language.
//
// Falls back to English per-lesson: any lesson not yet translated into the
// target language shows its English version, so the list is always complete
// and in the same order while translation is in progress.

import { BASICS_LESSONS } from "../basicsLessons.js";
import { BASICS_LESSONS_SV } from "../basicsLessons.sv.js";

const BY_LANG = {
  sv: BASICS_LESSONS_SV,
};

export function getBasicsLessons(lang) {
  const translated = BY_LANG[lang];
  if (!translated) return BASICS_LESSONS; // English (or unknown lang)

  const byId = Object.fromEntries(translated.map(l => [l.id, l]));
  // Preserve English order; swap in translated lessons where available.
  return BASICS_LESSONS.map(en => byId[en.id] || en);
}
