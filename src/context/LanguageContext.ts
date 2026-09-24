import { createContext, useContext } from 'react';
import type { Lang } from '@/lib/translations';

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: import('@/lib/translations').TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
