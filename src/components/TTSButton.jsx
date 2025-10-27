// src/components/TTSButton.jsx - REUSABLE TEXT-TO-SPEECH COMPONENT
// Use this anywhere in your app!

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Volume2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const VolumeXIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="22" y1="9" x2="16" y2="15"></line>
    <line x1="16" y1="9" x2="22" y2="15"></line>
  </svg>
);

// Global audio element for stopping previous audio
let globalAudio = null;

const TTSButton = ({ 
  text, 
  className = "", 
  size = "md",
  variant = "icon" // "icon" or "button"
}) => {
  const { currentLanguage, getTranslation } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    // Stop any currently playing audio
    if (globalAudio) {
      globalAudio.pause();
      globalAudio = null;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Get translated text if needed
    const translatedText = getTranslation(text);

    const langMap = {
      'hi': 'hi', 'bn': 'bn', 'te': 'te', 'ta': 'ta', 'mr': 'mr',
      'gu': 'gu', 'kn': 'kn', 'ml': 'ml', 'pa': 'pa', 'ur': 'ur',
      'ne': 'ne', 'es': 'es', 'fr': 'fr', 'ar': 'ar', 'en': 'en'
    };

    const lang = langMap[currentLanguage] || 'en';
    
    // Method 1: Google Translate TTS (better for Indian languages)
    const audio = new Audio(
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(translatedText)}`
    );
    
    globalAudio = audio;
    
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => {
      setIsSpeaking(false);
      globalAudio = null;
    };
    audio.onerror = () => {
      // Fallback to browser TTS if Google fails
      console.log("Falling back to browser TTS");
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = `${lang}-IN`;
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    };
    
    audio.play();
  };

  // Size classes
  const sizeClasses = {
    sm: 'p-1.5 w-7 h-7',
    md: 'p-2 w-9 h-9',
    lg: 'p-3 w-12 h-12'
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleSpeak}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#742BEC]/10 hover:bg-[#742BEC]/20 transition-colors ${className}`}
        aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
        title={isSpeaking ? "Stop reading" : "Read aloud"}
      >
        {isSpeaking ? <VolumeXIcon /> : <Volume2Icon />}
        <span className="text-sm">{isSpeaking ? "Stop" : "Listen"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSpeak}
      className={`${sizeClasses[size]} rounded-lg bg-[#742BEC]/10 hover:bg-[#742BEC]/20 transition-colors flex items-center justify-center relative ${className}`}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      {isSpeaking && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#742BEC] rounded-full animate-pulse"></div>
      )}
      {isSpeaking ? <VolumeXIcon /> : <Volume2Icon />}
    </button>
  );
};

export default TTSButton;

// USAGE EXAMPLES:

// Example 1: Icon button (default)
// <TTSButton text="Your text here" />

// Example 2: Small icon button
// <TTSButton text="Your text here" size="sm" />

// Example 3: Button with text
// <TTSButton text="Your text here" variant="button" />

// Example 4: Custom styling
// <TTSButton text="Your text here" className="ml-4" />

// Example 5: Multiple texts combined
// <TTSButton text={`${title}. ${description}`} />