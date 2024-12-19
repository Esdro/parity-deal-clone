export const i18n = {
    defaultLocale: "fr",
    locales: ["en", "fr", "es"],
} as const;
import DICTIONNARY from "./dictionaries/en.json";
export type Locale = (typeof i18n)["locales"][number];

export const dictionaryType = {
    dict: DICTIONNARY,
} as const;

export type DictionaryType = (typeof dictionaryType)['dict'];