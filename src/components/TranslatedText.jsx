// src/components/TranslatedText.jsx - KEEP THIS AS IS
import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TranslatedText({ children, className = '' }) {
  const { currentLanguage, getTranslation, translationVersion } = useLanguage();

  const translatedText = useMemo(() => {
    if (!children) return '';
    const text = typeof children === 'string' ? children : String(children);
    if (currentLanguage === 'en') return text;
    return getTranslation(text);
  }, [children, currentLanguage, getTranslation, translationVersion]);

  return <span className={className}>{translatedText}</span>;
}

export function useTranslate(text) {
  const { currentLanguage, getTranslation, translationVersion } = useLanguage();

  return useMemo(() => {
    if (!text || currentLanguage === 'en') return text;
    return getTranslation(text);
  }, [text, currentLanguage, getTranslation, translationVersion]);
}

export function useTranslateObject(obj) {
  const { currentLanguage, getTranslation, translationVersion } = useLanguage();

  return useMemo(() => {
    if (!obj || currentLanguage === 'en') return obj;

    const translateRecursive = (item) => {
      if (typeof item === 'string') {
        return getTranslation(item);
      }
      if (Array.isArray(item)) {
        return item.map(translateRecursive);
      }
      if (typeof item === 'object' && item !== null) {
        const translated = {};
        for (const [key, value] of Object.entries(item)) {
          translated[key] = translateRecursive(value);
        }
        return translated;
      }
      return item;
    };

    return translateRecursive(obj);
  }, [obj, currentLanguage, getTranslation, translationVersion]);
}