// src/components/GovtSchemes.jsx - TRANSLATION FIX
import React, { useEffect, useState } from "react";
import TranslatedText from "./TranslatedText";
import { useLanguage } from "../context/LanguageContext";

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

const schemesData = [
  {
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description: "Focuses on enhancing irrigation coverage and improving water-use efficiency through Per Drop More Crop initiatives. Provides subsidies for drip irrigation and sprinkler systems.",
    link: "https://pmksy.gov.in/",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Comprehensive crop insurance scheme protecting farmers against yield losses due to natural calamities, pests, and diseases. Covers all food and oilseed crops with minimal premium.",
    link: "https://pmfby.gov.in/",
  },
  {
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "Direct income support of Rs 6000 per year to eligible farmer families in three equal installments. Helps small and marginal farmers with cultivation and related expenses.",
    link: "https://pmkisan.gov.in/",
  },
  {
    name: "Soil Health Card Scheme",
    description: "Promotes soil testing and provides nutrient-based recommendations to improve productivity. Helps farmers understand soil health and apply balanced fertilizers for better yields.",
    link: "https://soilhealth.dac.gov.in/",
  },
  {
    name: "Kisan Credit Card (KCC) Scheme",
    description: "Provides adequate and timely credit support to farmers for cultivation, post-harvest expenses, and farming assets. Offers concessional interest rates and easy access to institutional credit.",
    link: "https://agricoop.nic.in/",
  },
  {
    name: "National Agriculture Market (e-NAM)",
    description: "Pan-India electronic trading platform for agricultural commodities. Ensures better price discovery, transparent auctions, and connects farmers directly with buyers across India.",
    link: "https://www.enam.gov.in/web/",
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Promotes organic farming and sustainable agriculture practices. Provides financial support for organic inputs, certification, and marketing to boost chemical-free farming.",
    link: "https://pgsindia-ncof.gov.in/PKVY/Index.aspx",
  },
  {
    name: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description: "State-level initiatives for strengthening agricultural infrastructure including irrigation facilities, warehousing, cold storage, and market linkages in rural areas.",
    link: "https://rkvy.nic.in/",
  },
];

const SchemeCard = ({ scheme, index }) => {
  const { currentLanguage, getTranslation } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Force re-render when language changes
  const translatedName = getTranslation(scheme.name);
  const translatedDescription = getTranslation(scheme.description);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Use Google Translate TTS as fallback for better Indian language support
    const langMap = {
      'hi': 'hi',
      'bn': 'bn',
      'te': 'te',
      'ta': 'ta',
      'mr': 'mr',
      'gu': 'gu',
      'kn': 'kn',
      'ml': 'ml',
      'pa': 'pa',
      'ur': 'ur',
      'ne': 'ne',
      'es': 'es',
      'fr': 'fr',
      'ar': 'ar',
      'en': 'en'
    };

    const textToSpeak = `${translatedName}. ${translatedDescription}`;
    const lang = langMap[currentLanguage] || 'en';
    
    // Use Google Translate TTS API (free, better quality for Indian languages)
    const audio = new Audio(
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(textToSpeak)}`
    );
    
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => {
      // Fallback to browser TTS if Google TTS fails
      console.log("Falling back to browser TTS");
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = `${lang}-IN`;
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };
    
    audio.play();
  };

  return (
    <div className="bg-[#0E1421] text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-[#742BEC]/20 transition-all flex flex-col justify-between min-h-[280px] border border-gray-800 hover:border-[#742BEC]/50 relative">
      {isSpeaking && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-[#742BEC] rounded-full animate-pulse"></div>
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-bold text-[#742BEC] flex-1">
            {translatedName}
          </h3>
          <button
            onClick={handleSpeak}
            className="p-2 rounded-lg bg-[#742BEC]/10 hover:bg-[#742BEC]/20 transition-colors flex-shrink-0"
            aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
            title={isSpeaking ? "Stop reading" : "Read aloud"}
          >
            {isSpeaking ? <VolumeXIcon /> : <Volume2Icon />}
          </button>
        </div>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
          {translatedDescription}
        </p>
      </div>
      <a
        href={scheme.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto bg-gradient-to-r from-[#742BEC] to-[#5a22b5] hover:from-[#5a22b5] hover:to-[#742BEC] text-white text-sm font-medium px-5 py-2.5 rounded-lg text-center transition-all shadow-lg shadow-[#742BEC]/30 hover:shadow-[#742BEC]/50"
      >
        <TranslatedText>Learn More</TranslatedText> →
      </a>
    </div>
  );
};

const GovernmentSchemes = () => {
  const { currentLanguage } = useLanguage();
  const [isSpeakingAll, setIsSpeakingAll] = useState(false);

  const handleSpeakAll = () => {
    if (isSpeakingAll) {
      window.speechSynthesis.cancel();
      setIsSpeakingAll(false);
      return;
    }

    const langMap = {
      'hi': 'hi', 'bn': 'bn', 'te': 'te', 'ta': 'ta', 'mr': 'mr',
      'gu': 'gu', 'kn': 'kn', 'ml': 'ml', 'pa': 'pa', 'ur': 'ur',
      'ne': 'ne', 'es': 'es', 'fr': 'fr', 'ar': 'ar', 'en': 'en'
    };

    const headerText = "Government Schemes for Farmers. Explore major government initiatives focused on irrigation, water conservation, crop insurance, and financial support for farmers across India.";
    const lang = langMap[currentLanguage] || 'en';
    
    const audio = new Audio(
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(headerText)}`
    );
    
    audio.onplay = () => setIsSpeakingAll(true);
    audio.onended = () => setIsSpeakingAll(false);
    audio.onerror = () => setIsSpeakingAll(false);
    
    audio.play();
  };

  return (
    <div className="min-h-screen bg-[#060C1A] text-white flex flex-col items-center py-10 px-4 sm:px-6">
      <div className="text-center mb-12 max-w-4xl">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#742BEC] to-[#9d5ef0] bg-clip-text text-transparent">
            <TranslatedText>Government Schemes for Farmers</TranslatedText>
          </h1>
          <button
            onClick={handleSpeakAll}
            className="p-3 rounded-full bg-[#742BEC]/10 hover:bg-[#742BEC]/20 transition-colors"
            aria-label={isSpeakingAll ? "Stop reading" : "Read header"}
            title={isSpeakingAll ? "Stop reading" : "Read header"}
          >
            {isSpeakingAll ? <VolumeXIcon /> : <Volume2Icon />}
          </button>
        </div>
        <p className="text-gray-400 text-base">
          <TranslatedText>
            Explore major government initiatives focused on irrigation, water conservation, 
            crop insurance, and financial support for farmers across India.
          </TranslatedText>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
        {schemesData.map((scheme, index) => (
          <SchemeCard key={`${index}-${currentLanguage}`} scheme={scheme} index={index} />
        ))}
      </div>

      <div className="mt-16 text-center max-w-3xl">
        <div className="bg-[#0E1421] border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-[#742BEC]">
            <TranslatedText>Important Information</TranslatedText>
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            <TranslatedText>
              All schemes listed above have verified official government websites. 
              Always verify eligibility criteria and application procedures on the official portals before applying.
            </TranslatedText>
          </p>
        </div>
        
        <p className="text-gray-500 text-xs">
          <TranslatedText>
            For detailed information about eligibility, required documents, and application process, 
            visit the respective scheme websites or contact your local agriculture department.
          </TranslatedText>
        </p>
      </div>
    </div>
  );
};

export default GovernmentSchemes;