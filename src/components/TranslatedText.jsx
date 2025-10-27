// src/components/TranslatedText.jsx - FIXED ASYNC VERSION
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TranslatedText({ children, className = '' }) {
  const { currentLanguage, getTranslation, translationVersion } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (!children) {
      setTranslatedText('');
      return;
    }

    const text = typeof children === 'string' ? children : String(children);
    
    if (currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    const translated = getTranslation(text);
    setTranslatedText(translated);

  }, [children, currentLanguage, getTranslation, translationVersion]);

  return <span className={className}>{translatedText}</span>;
}

export function useTranslate(text) {
  const { currentLanguage, getTranslation, translationVersion } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (!text) {
      setTranslatedText('');
      return;
    }

    if (currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    const translated = getTranslation(text);
    setTranslatedText(translated);

  }, [text, currentLanguage, getTranslation, translationVersion]);

  return translatedText || text;
}

export function useTranslateObject(obj) {
  const { currentLanguage, getTranslation, translationVersion } = useLanguage();
  const [translatedObj, setTranslatedObj] = useState(obj);

  useEffect(() => {
    if (!obj || currentLanguage === 'en') {
      setTranslatedObj(obj);
      return;
    }

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

    setTranslatedObj(translateRecursive(obj));
  }, [obj, currentLanguage, getTranslation, translationVersion]);

  return translatedObj;
}