// Returns the Home Game walkthrough content for a given language, falling
// back to English for any untranslated language. Mirrors getBasicsLessons.

import { HOME_GAME_CONTENT_EN } from "../homeGameContent.js";
import { HOME_GAME_CONTENT_SV } from "../homeGameContent.sv.js";

const BY_LANG = {
  sv: HOME_GAME_CONTENT_SV,
};

export function getHomeGameContent(lang) {
  return BY_LANG[lang] || HOME_GAME_CONTENT_EN;
}
