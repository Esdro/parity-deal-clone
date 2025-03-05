import 'server-only'
import {Locale} from "./i18n-config";
 
const dictionaries = {
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: Locale) =>
    dictionaries[locale]?.() ?? await dictionaries.en();

export const formatDictionnaryText  = (text: string, dictText: string) => {
    return dictText.replace(/{([^}]+)}/g,text);
}
