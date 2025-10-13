export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de'
}

export const SUPPORTED_LANGUAGES = Object.values(Language);

export function detectLanguage(text: string): Language {
  // Simple detection based on common words
  const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no'];
  const frenchWords = ['le', 'la', 'de', 'que', 'et', 'en', 'un', 'est', 'se', 'ne'];
  const germanWords = ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich'];

  const words = text.toLowerCase().split(/\s+/);

  const spanishCount = words.filter(word => spanishWords.includes(word)).length;
  const frenchCount = words.filter(word => frenchWords.includes(word)).length;
  const germanCount = words.filter(word => germanWords.includes(word)).length;

  if (spanishCount > frenchCount && spanishCount > germanCount) return Language.ES;
  if (frenchCount > spanishCount && frenchCount > germanCount) return Language.FR;
  if (germanCount > spanishCount && germanCount > frenchCount) return Language.DE;

  return Language.EN; // Default to English
}

export function getLanguageDisplayName(lang: Language): string {
  switch (lang) {
    case Language.EN: return 'English';
    case Language.ES: return 'Español';
    case Language.FR: return 'Français';
    case Language.DE: return 'Deutsch';
    default: return 'English';
  }
}