// src/pages/SoilRecommendation.jsx - GEMINI RETURNS TRANSLATED RESULTS DIRECTLY
import { useState, useEffect } from "react";
import { GoogleGenAI, createUserContent } from "@google/genai";
import TranslatedText, { useTranslate } from "../components/TranslatedText";
import { useLanguage } from "../context/LanguageContext";

export default function SoilRecommendation() {
  const [mode, setMode] = useState("general");
  const [place, setPlace] = useState("");
  const [soilData, setSoilData] = useState({ N: "", P: "", K: "", pH: "" });
  const [loading, setLoading] = useState(false);
  const [generalRecommendations, setGeneralRecommendations] = useState([]);
  const [specializedRecommendations, setSpecializedRecommendations] = useState([]);
  const [error, setError] = useState("");

  const { currentLanguage, languages } = useLanguage();
  const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  // Get language name for Gemini prompt
  const getLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : 'English';
  };

  const WEATHER_API_KEY = "ddce2934c4f79c76915207c99d113f30";

  // Fetch crops by place
  const fetchCropsByPlace = async () => {
    if (!place || place.trim() === "") {
      setError("Please enter a place name!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const targetLanguage = getLanguageName();
      
      const prompt = `You are an expert agronomist. Recommend 6 suitable crops for the location "${place.trim()}" in India.

IMPORTANT: Return the response in ${targetLanguage} language. ALL text including crop names, soil types, climate descriptions, and recommendations MUST be in ${targetLanguage}.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "Rice (in ${targetLanguage})",
    "soilType": "Clay loam (in ${targetLanguage})",
    "climate": "Warm and humid (in ${targetLanguage})",
    "waterRequirement": "High (in ${targetLanguage})",
    "idealPH": [5.5, 6.5],
    "bestSeason": "Kharif (in ${targetLanguage})",
    "reasonForRecommendation": "Well-suited for monsoon regions (in ${targetLanguage})"
  }
]

CRITICAL RULES:
- Return ONLY the JSON array
- No markdown formatting, no code blocks
- No explanatory text before or after
- ALL string values MUST be in ${targetLanguage} language
- Keep idealPH as number array
- Translate crop names to ${targetLanguage} if possible`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [createUserContent(prompt)],
        config: { 
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      if (!response || !response.text) {
        throw new Error("No response from AI");
      }

      // Clean the response
      let textResponse = response.text
        .trim()
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      // Remove any text before the first [
      const firstBracket = textResponse.indexOf('[');
      if (firstBracket > 0) {
        textResponse = textResponse.substring(firstBracket);
      }

      // Remove any text after the last ]
      const lastBracket = textResponse.lastIndexOf(']');
      if (lastBracket !== -1 && lastBracket < textResponse.length - 1) {
        textResponse = textResponse.substring(0, lastBracket + 1);
      }

      if (!textResponse || !textResponse.startsWith('[')) {
        throw new Error("Invalid JSON format from AI");
      }

      let crops = [];
      try {
        crops = JSON.parse(textResponse);
      } catch (parseErr) {
        console.error("Parse error:", parseErr);
        console.error("Response text:", textResponse);
        throw new Error("Failed to parse AI response");
      }

      // Validate crops array
      if (!Array.isArray(crops) || crops.length === 0) {
        throw new Error("AI returned empty or invalid crop list");
      }

      // Ensure we have at least 6 crops
      while (crops.length < 6) {
        crops.push({ ...crops[0], name: `${crops[0].name} (Alt)` });
      }

      setGeneralRecommendations(crops);
      localStorage.setItem(`generalRecs_${currentLanguage}`, JSON.stringify(crops));

    } catch (err) {
      console.error("Gemini AI Error:", err);
      setError(`Failed to fetch recommendations: ${err.message}`);
      setGeneralRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialized crops
  const fetchSpecializedCrops = async () => {
    const { N, P, K, pH } = soilData;
    
    // Validate inputs
    if (!N || !P || !K || !pH) {
      setError("Please fill in all soil values (N, P, K, pH)");
      return;
    }

    // Validate numeric values
    if (isNaN(N) || isNaN(P) || isNaN(K) || isNaN(pH)) {
      setError("All soil values must be valid numbers");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const targetLanguage = getLanguageName();
      
      const prompt = `You are an expert agronomist. Analyze this soil data and recommend 6 suitable crops:

Soil Data:
- Nitrogen (N): ${N}
- Phosphorus (P): ${P}
- Potassium (K): ${K}
- pH: ${pH}

IMPORTANT: Return the response in ${targetLanguage} language. ALL text including crop names, soil types, climate descriptions, water requirements, seasons, and recommendations MUST be in ${targetLanguage}.

Return ONLY a valid JSON array with this structure:
[
  {
    "name": "Rice (in ${targetLanguage})",
    "soilType": "Clay loam (in ${targetLanguage})",
    "climate": "Warm humid (in ${targetLanguage})",
    "waterRequirement": "High (in ${targetLanguage})",
    "idealPH": [5.5, 6.5],
    "idealN": 50,
    "idealP": 30,
    "idealK": 40,
    "bestSeason": "Kharif (in ${targetLanguage})",
    "reasonForRecommendation": "Matches the high nitrogen and pH range (in ${targetLanguage})"
  }
]

CRITICAL RULES:
- Return ONLY the JSON array
- No markdown, no explanatory text
- ALL string values MUST be in ${targetLanguage} language
- Include idealN, idealP, idealK as numbers
- Keep idealPH as number array [min, max]
- Translate everything including crop names`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [createUserContent(prompt)],
        config: { 
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      if (!response || !response.text) {
        throw new Error("No response from AI");
      }

      // Clean response
      let textResponse = response.text
        .trim()
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const firstBracket = textResponse.indexOf('[');
      if (firstBracket > 0) {
        textResponse = textResponse.substring(firstBracket);
      }

      const lastBracket = textResponse.lastIndexOf(']');
      if (lastBracket !== -1 && lastBracket < textResponse.length - 1) {
        textResponse = textResponse.substring(0, lastBracket + 1);
      }

      if (!textResponse || !textResponse.startsWith('[')) {
        throw new Error("Invalid JSON format from AI");
      }

      let crops = [];
      try {
        crops = JSON.parse(textResponse);
      } catch (parseErr) {
        console.error("Parse error:", parseErr);
        console.error("Response text:", textResponse);
        throw new Error("Failed to parse AI response");
      }

      if (!Array.isArray(crops) || crops.length === 0) {
        throw new Error("AI returned empty or invalid crop list");
      }

      while (crops.length < 6) {
        crops.push({ ...crops[0], name: `${crops[0].name} (Alt)` });
      }

      setSpecializedRecommendations(crops);
      localStorage.setItem(`specialRecs_${currentLanguage}`, JSON.stringify(crops));

    } catch (err) {
      console.error("Gemini AI Error:", err);
      setError(`Failed to fetch recommendations: ${err.message}`);
      setSpecializedRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cached data on mount and language change
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const genCache = localStorage.getItem(`generalRecs_${currentLanguage}`);
        if (genCache) {
          const parsed = JSON.parse(genCache);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGeneralRecommendations(parsed);
          }
        }

        const specCache = localStorage.getItem(`specialRecs_${currentLanguage}`);
        if (specCache) {
          const parsed = JSON.parse(specCache);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSpecializedRecommendations(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load cached data:", err);
      }
    };

    loadCachedData();
  }, [currentLanguage]);

  // Clear error when switching modes
  useEffect(() => {
    setError("");
  }, [mode]);

  // Clear recommendations when language changes
  useEffect(() => {
    // Don't clear if we have cached data for this language
    const genCache = localStorage.getItem(`generalRecs_${currentLanguage}`);
    const specCache = localStorage.getItem(`specialRecs_${currentLanguage}`);
    
    if (!genCache) {
      setGeneralRecommendations([]);
    }
    if (!specCache) {
      setSpecializedRecommendations([]);
    }
  }, [currentLanguage]);

  return (
    <div className="flex flex-col gap-7 p-4 sm:p-6 bg-[#060C1A] text-white w-full min-h-screen">
      {/* Mode Selector */}
      <div className="flex flex-col xs:flex-row gap-4">
        <button
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            mode === "general" 
              ? "bg-[#742BEC] shadow-lg shadow-[#742BEC]/30" 
              : "bg-[#1C2230] hover:bg-[#2a3040]"
          }`}
          onClick={() => setMode("general")}
        >
          <img
            src={mode === "general" ? "assets/global-active.png" : "assets/global-inactive.png"}
            alt=""
            className="w-5 h-5"
          />
          <TranslatedText>General Mode</TranslatedText>
        </button>
        <button
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            mode === "specialized" 
              ? "bg-[#742BEC] shadow-lg shadow-[#742BEC]/30" 
              : "bg-[#1C2230] hover:bg-[#2a3040]"
          }`}
          onClick={() => setMode("specialized")}
        >
          <img
            src={mode === "specialized" ? "assets/stars-active.png" : "assets/stars-inactive.png"}
            alt=""
            className="w-5 h-5"
          />
          <TranslatedText>Specialized Mode</TranslatedText>
        </button>
      </div>

      {/* General Mode Input */}
      {mode === "general" && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#121B2F] p-5 rounded-xl border border-gray-800">
            <p className="text-lg mb-3 font-medium">
              <TranslatedText>Enter your location (City, District, or Region):</TranslatedText>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g., Ranchi, Delhi, Pune"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    fetchCropsByPlace();
                  }
                }}
                disabled={loading}
                className="flex-1 p-3 rounded-lg bg-[#0E1421] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC] border border-gray-700 disabled:opacity-50"
              />
              <button
                onClick={fetchCropsByPlace}
                disabled={loading || !place.trim()}
                className="px-8 py-3 bg-[#742BEC] rounded-lg font-medium hover:bg-[#5a22b5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#742BEC]/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <TranslatedText>Loading...</TranslatedText>
                  </span>
                ) : (
                  <TranslatedText>Get Recommendations</TranslatedText>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Specialized Mode Input */}
      {mode === "specialized" && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#121B2F] p-5 rounded-xl border border-gray-800">
            <p className="text-lg mb-2 font-medium">
              <TranslatedText>Enter soil lab data:</TranslatedText>
            </p>
            <p className="text-sm text-gray-400 mb-4">
              <TranslatedText>Typical ranges: N (40-60), P (20-40), K (30-50), pH (5.5-7.5)</TranslatedText>
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  <TranslatedText>Nitrogen (N)</TranslatedText>
                </label>
                <input
                  type="number"
                  placeholder="40-60"
                  value={soilData.N}
                  onChange={(e) => setSoilData({ ...soilData, N: e.target.value })}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#0E1421] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC] border border-gray-700 text-center disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  <TranslatedText>Phosphorus (P)</TranslatedText>
                </label>
                <input
                  type="number"
                  placeholder="20-40"
                  value={soilData.P}
                  onChange={(e) => setSoilData({ ...soilData, P: e.target.value })}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#0E1421] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC] border border-gray-700 text-center disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  <TranslatedText>Potassium (K)</TranslatedText>
                </label>
                <input
                  type="number"
                  placeholder="30-50"
                  value={soilData.K}
                  onChange={(e) => setSoilData({ ...soilData, K: e.target.value })}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#0E1421] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC] border border-gray-700 text-center disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">pH</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="5.5-7.5"
                  value={soilData.pH}
                  onChange={(e) => setSoilData({ ...soilData, pH: e.target.value })}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[#0E1421] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC] border border-gray-700 text-center disabled:opacity-50"
                />
              </div>
            </div>
            
            <button
              onClick={fetchSpecializedCrops}
              disabled={loading || !soilData.N || !soilData.P || !soilData.K || !soilData.pH}
              className="w-full px-8 py-3 bg-[#742BEC] rounded-lg font-medium hover:bg-[#5a22b5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#742BEC]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <TranslatedText>Loading...</TranslatedText>
                </span>
              ) : (
                <TranslatedText>Get Recommendations</TranslatedText>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* General Recommendations Display */}
      {mode === "general" && generalRecommendations && generalRecommendations.length > 0 && (
        <div className="mt-4">
          <h2 className="text-3xl font-bold mb-6">
            <TranslatedText>Recommended Crops for</TranslatedText>{" "}
            <span className="text-[#742BEC]">{place}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {generalRecommendations.map((crop, index) => (
              <div
                key={`gen-${index}`}
                className="p-6 rounded-xl bg-gradient-to-br from-[#121B2F] to-[#0E1421] border border-gray-800 hover:border-[#742BEC] transition-all hover:shadow-lg hover:shadow-[#742BEC]/10"
              >
                <h3 className="font-bold text-2xl mb-4 text-[#742BEC]">{crop.name || "Unknown Crop"}</h3>
                <div className="space-y-2.5 text-sm">
                  {crop.soilType && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Soil:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.soilType}</span>
                    </p>
                  )}
                  {crop.climate && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Climate:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.climate}</span>
                    </p>
                  )}
                  {crop.waterRequirement && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Water:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.waterRequirement}</span>
                    </p>
                  )}
                  {crop.idealPH && Array.isArray(crop.idealPH) && crop.idealPH.length === 2 && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400">pH:</span>
                      <span className="text-right flex-1">{crop.idealPH[0]} - {crop.idealPH[1]}</span>
                    </p>
                  )}
                  {crop.bestSeason && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Season:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.bestSeason}</span>
                    </p>
                  )}
                  {crop.reasonForRecommendation && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-300 text-xs leading-relaxed italic">
                        {crop.reasonForRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialized Recommendations Display */}
      {mode === "specialized" && specializedRecommendations && specializedRecommendations.length > 0 && (
        <div className="mt-4">
          <h2 className="text-3xl font-bold mb-6">
            <TranslatedText>Recommended Crops</TranslatedText>{" "}
            <span className="text-gray-400 text-xl">(<TranslatedText>Specialized Analysis</TranslatedText>)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {specializedRecommendations.map((crop, index) => (
              <div
                key={`spec-${index}`}
                className="p-6 rounded-xl bg-gradient-to-br from-[#121B2F] to-[#0E1421] border border-gray-800 hover:border-[#742BEC] transition-all hover:shadow-lg hover:shadow-[#742BEC]/10"
              >
                <h3 className="font-bold text-2xl mb-4 text-[#742BEC]">{crop.name || "Unknown Crop"}</h3>
                <div className="space-y-2.5 text-sm">
                  {crop.soilType && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Soil:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.soilType}</span>
                    </p>
                  )}
                  {crop.climate && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Climate:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.climate}</span>
                    </p>
                  )}
                  {crop.waterRequirement && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Water:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.waterRequirement}</span>
                    </p>
                  )}
                  
                  {/* Soil Parameters Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-700">
                    {crop.idealPH && Array.isArray(crop.idealPH) && crop.idealPH.length === 2 && (
                      <p className="text-xs">
                        <span className="text-gray-400">pH:</span> {crop.idealPH[0]}-{crop.idealPH[1]}
                      </p>
                    )}
                    {crop.idealN && (
                      <p className="text-xs">
                        <span className="text-gray-400">N:</span> {crop.idealN}
                      </p>
                    )}
                    {crop.idealP && (
                      <p className="text-xs">
                        <span className="text-gray-400">P:</span> {crop.idealP}
                      </p>
                    )}
                    {crop.idealK && (
                      <p className="text-xs">
                        <span className="text-gray-400">K:</span> {crop.idealK}
                      </p>
                    )}
                  </div>
                  
                  {crop.bestSeason && (
                    <p className="flex justify-between gap-2">
                      <span className="text-gray-400"><TranslatedText>Season:</TranslatedText></span>
                      <span className="text-right flex-1">{crop.bestSeason}</span>
                    </p>
                  )}
                  {crop.reasonForRecommendation && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-300 text-xs leading-relaxed italic">
                        {crop.reasonForRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {mode === "general" && generalRecommendations.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
            <path d="M12 2v20M2 12h20"/>
          </svg>
          <p className="text-lg"><TranslatedText>Enter a location to get crop recommendations</TranslatedText></p>
        </div>
      )}

      {mode === "specialized" && specializedRecommendations.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
            <path d="M12 2v20M2 12h20"/>
          </svg>
          <p className="text-lg"><TranslatedText>Enter soil data to get specialized recommendations</TranslatedText></p>
        </div>
      )}
    </div>
  );
}