import { useState, useEffect } from "react";
import { GoogleGenAI, createUserContent } from "@google/genai";

export default function SoilRecommendation() {
  const [mode, setMode] = useState("general");
  const [place, setPlace] = useState("");
  const [soilData, setSoilData] = useState({ N: "", P: "", K: "", pH: "" });
  const [loading, setLoading] = useState(false);
  const [generalRecommendations, setGeneralRecommendations] = useState([]);
  const [specializedRecommendations, setSpecializedRecommendations] = useState([]);
  const [error, setError] = useState("");

  const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  // General Mode AI call
  const fetchCropsByPlace = async () => {
    if (!place) {
      alert("Please enter a place name!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const prompt = `You are an expert agronomist. Recommend 6 suitable crops for the location "${place}" in India.
Return only a valid JSON array. Each crop should have:
- name
- soilType
- climate
- waterRequirement
Optional fields (include if available):
- idealPH [min, max]
- bestSeason
- reasonForRecommendation
Answer in both languages english and hindi and
Do not add any extra text or explanations. Only return the JSON array.`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [createUserContent(prompt)],
        config: { temperature: 0.7 },
      });

      let textResponse = response.text || "";
      console.log("Raw Gemini response:", textResponse);

      textResponse = textResponse.trim().replace(/^```json/, "").replace(/```$/, "").trim();
      console.log("Cleaned response:", textResponse);

      if (!textResponse) {
        setError("No response received from Gemini API.");
        setGeneralRecommendations([]);
        return;
      }

      let crops = [];
      try {
        crops = JSON.parse(textResponse);
        console.log("Parsed crops array:", crops);
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr, textResponse);
        setError("Failed to parse AI response. Please try again.");
        setGeneralRecommendations([]);
        return;
      }

      while (crops.length < 5) crops.push({ ...crops[crops.length - 1] });

      setGeneralRecommendations(crops);
      localStorage.setItem("generalRecs", JSON.stringify(crops));
    } catch (err) {
      console.error("Gemini AI Error:", err);
      setError("Failed to fetch Gemini recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Specialized Mode AI call
  const fetchSpecializedCrops = async () => {
    const { N, P, K, pH } = soilData;
    if (!N || !P || !K || !pH) {
      alert("Please fill in all soil lab values!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const prompt = `You are an expert agronomist. Based on the following soil lab data:
- Nitrogen (N): ${N}
- Phosphorus (P): ${P}
- Potassium (K): ${K}
- pH: ${pH}

Recommend 6 crops that would grow best in these conditions In both english and hindi. Return only a valid JSON array with:
- name
- soilType
- climate
- waterRequirement
Optional fields:
- idealPH [min, max]
- idealN
- idealP
- idealK
- bestSeason
- reasonForRecommendation
Do not include any extra text or explanations. Only return the JSON array.`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [createUserContent(prompt)],
        config: { temperature: 0.7 },
      });

      let textResponse = response.text || "";
      console.log("Raw Specialized response:", textResponse);

      textResponse = textResponse.trim().replace(/^```json/, "").replace(/```$/, "").trim();
      console.log("Cleaned Specialized response:", textResponse);

      let crops = [];
      try {
        crops = JSON.parse(textResponse);
        console.log("Parsed Specialized crops:", crops);
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr, textResponse);
        setError("Failed to parse AI response. Please try again.");
        setSpecializedRecommendations([]);
        return;
      }

      while (crops.length < 6) crops.push({ ...crops[crops.length - 1] });

      setSpecializedRecommendations(crops);
      localStorage.setItem("specialRecs", JSON.stringify(crops));
    } catch (err) {
      console.error("Gemini AI Error:", err);
      setError("Failed to fetch specialized AI recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedGeneral = localStorage.getItem("generalRecs");
    if (savedGeneral) setGeneralRecommendations(JSON.parse(savedGeneral));

    const savedSpecial = localStorage.getItem("specialRecs");
    if (savedSpecial) setSpecializedRecommendations(JSON.parse(savedSpecial));
  }, []);

  return (
    <div className="flex flex-col gap-7 p-6 bg-[#060C1A] text-white w-full min-h-screen">
      <div className="flex flex-col xs:flex-row gap-4">
        <button
          className={`flex flex-row justify-start gap-2 px-4 py-2 rounded focus:outline-none ${
            mode === "general" ? "bg-[#742BEC]" : "bg-[#1C2230]"
          }`}
          onClick={() => setMode("general")}
        >
          <img
            src={mode === "general" ? "assets/global-active.png" : "assets/global-inactive.png"}
            alt="General Mode"
          />
          General Mode
        </button>
        <button
          className={`flex flex-row justify-start gap-2 px-4 py-2 rounded focus:outline-none ${
            mode === "specialized" ? "bg-[#742BEC]" : "bg-[#1C2230]"
          }`}
          onClick={() => setMode("specialized")}
        >
          <img
            src={mode === "specialized" ? "assets/stars-active.png" : "assets/stars-inactive.png"}
            alt="Specialized Mode"
          />
          Specialized Mode
        </button>
      </div>

      {/* General Mode */}
      {mode === "general" && (
        <div className="flex flex-col gap-4">
          <p>Enter your location (City, District, or Region):</p>
          <div className="w-full flex flex-col lg:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter a place name (e.g., Ranchi, Delhi, Pune)"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full xs:w-[300px] p-2 rounded bg-[#121B2F] text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={fetchCropsByPlace}
              className="w-full xs:w-[300px] px-4 bg-[#742BEC] rounded text-[#efefef]"
            >
              {loading ? "Fetching..." : "Get AI Recommendations"}
            </button>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      )}

      {/* Specialized Mode */}
      {mode === "specialized" && (
        <div className="flex flex-col gap-2">
          <p className="text-gray-300">
            Enter soil lab data below. These values should come from soil tests you have conducted. 
            The AI will suggest crops best suited for these nutrient levels.
          </p>
          <p className="text-gray-300">Typical ranges for most crops: N: 40-60, P: 20-40, K: 30-50, pH: 5.5-7.5</p>
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 justify-between">
            <input
              type="number"
              placeholder="N (Nitrogen)"
              value={soilData.N}
              onChange={(e) => setSoilData({ ...soilData, N: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="P (Phosphorus)"
              value={soilData.P}
              onChange={(e) => setSoilData({ ...soilData, P: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="K (Potassium)"
              value={soilData.K}
              onChange={(e) => setSoilData({ ...soilData, K: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="pH"
              value={soilData.pH}
              onChange={(e) => setSoilData({ ...soilData, pH: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={fetchSpecializedCrops}
              className="px-4 py-2 bg-[#742BEC] rounded w-[270px]"
            >
              {loading ? "Fetching..." : "Get AI Recommendations"}
            </button>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      )}

      {/* General Recommendations */}
      {mode === "general" && generalRecommendations.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Recommended Crops (AI-based for {place}):
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100%,1fr))] xs:grid-cols-[repeat(auto-fit,400px)] gap-2">
            {generalRecommendations.map((crop, index) => (
              <div
                key={index}
                className="p-4 rounded bg-[#121B2F] w-full xs:w-[400px]"
              >
                <h3 className="font-bold text-lg">{crop.name}</h3>
                <p className="text-sm">Soil: {crop.soilType}</p>
                <p className="text-sm">Climate: {crop.climate}</p>
                <p className="text-sm">Water: {crop.waterRequirement}</p>
                <p className="text-sm">
                  pH: {crop.idealPH?.[0]} - {crop.idealPH?.[1]}
                </p>
                {crop.bestSeason && <p className="text-sm">Season: {crop.bestSeason}</p>}
                {crop.reasonForRecommendation && (
                  <p className="text-sm mt-1">{crop.reasonForRecommendation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialized Recommendations */}
      {mode === "specialized" && specializedRecommendations.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Recommended Crops (Specialized Mode):
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100%,1fr))] xs:grid-cols-[repeat(auto-fit,400px)] gap-2">
            {specializedRecommendations.map((crop, index) => (
              <div
                key={index}
                className="p-4 rounded bg-[#121B2F] w-full xs:w-[400px]"
              >
                <h3 className="font-bold text-lg">{crop.name}</h3>
                <p className="text-sm">
                  Soil: {crop.soilType} | Climate: {crop.climate} | Water: {crop.waterRequirement}
                </p>
                <p className="text-sm">
                  pH: {crop.idealPH?.[0]} - {crop.idealPH?.[1]} | N: {crop.idealN} | P: {crop.idealP} | K: {crop.idealK}
                </p>
                {crop.bestSeason && <p className="text-sm">Season: {crop.bestSeason}</p>}
                {crop.reasonForRecommendation && (
                  <p className="text-sm mt-1">{crop.reasonForRecommendation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}