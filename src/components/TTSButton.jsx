// src/components/TTSButton.jsx - FIXED FOR INDIAN LANGUAGES
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Volume2Icon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const VolumeXIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="22" y1="9" x2="16" y2="15"></line>
    <line x1="16" y1="9" x2="22" y2="15"></line>
  </svg>
);

const TTSButton = ({ 
  text, 
  className = "", 
  size = "md",
  variant = "icon",
  showLabel = false
}) => {
  const { currentLanguage, getTranslation } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    // Update translated text when language or text changes
    if (currentLanguage === 'en') {
      setTranslatedText(text);
    } else {
      const translated = getTranslation(text);
      setTranslatedText(translated);
    }
  }, [text, currentLanguage, getTranslation]);

  useEffect(() => {
    // Cleanup: stop speaking when component unmounts
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const langMap = {
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'ur': 'ur-PK',
      'ne': 'ne-NP',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'ar': 'ar-SA',
      'en': 'en-US'
    };

    const ttsLang = langMap[currentLanguage] || 'en-US';

    // Use Web Speech API which has better support for Indian languages
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = ttsLang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (error) => {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleSpeak}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#742BEC]/10 hover:bg-[#742BEC]/20 transition-all active:scale-95 ${className}`}
        aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
        title={isSpeaking ? "Stop reading" : "Read aloud"}
      >
        {isSpeaking ? <VolumeXIcon size={iconSizes[size]} /> : <Volume2Icon size={iconSizes[size]} />}
        {showLabel && (
          <span className="text-sm font-medium">
            {isSpeaking ? "Stop" : "Listen"}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleSpeak}
      className={`${sizeClasses[size]} rounded-lg bg-[#742BEC]/10 hover:bg-[#742BEC]/20 transition-all active:scale-95 flex items-center justify-center relative ${className}`}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      {isSpeaking && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#742BEC] rounded-full animate-pulse"></div>
      )}
      {isSpeaking ? <VolumeXIcon size={iconSizes[size]} /> : <Volume2Icon size={iconSizes[size]} />}
    </button>
  );
};

export default TTSButton;