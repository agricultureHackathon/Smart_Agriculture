// src/components/Dashboard.jsx - WITH TTS SUPPORT
// Key changes: Added TTSButton import and buttons throughout

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import TranslatedText, { useTranslate } from "./TranslatedText";
import TTSButton from "./TTSButton"; // ADD THIS IMPORT

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    soilMoisture: 45,
    temperature: null,
    humidity: null,
    condition: "",
    recommendation: "No Irrigation",
  });

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("India");
  const [username, setUsername] = useState("User");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const translatedCondition = useTranslate(sensorData.condition);
  const translatedRecommendation = useTranslate(sensorData.recommendation);

  const WEATHER_API_KEY = "ddce2934c4f79c76915207c99d113f30";
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email?.split('@')[0] || "User";
        setUsername(displayName);
        setIsLoadingUser(false);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchWeather = async (city) => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        const temp = Math.round(data.main.temp);
        const hum = data.main.humidity;
        const condition = data.weather[0].main;

        setSensorData((prev) => ({
          ...prev,
          temperature: temp,
          humidity: hum,
          condition,
          recommendation: prev.soilMoisture < 40 ? "Irrigate" : "No Irrigation",
        }));

        setLocation(data.name);
      } else {
        alert(`City not found: ${city}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching weather data");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      fetchWeather(search);
      setSearch("");
    }
  };

  const formatDate = () => {
    const today = new Date();
    return {
      day: today.toLocaleDateString("en-US", { weekday: "long" }),
      date: today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  };

  const { day, date } = formatDate();

  useEffect(() => {
    fetchWeather("Delhi");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => {
        const soilFluctuation = Math.floor(Math.random() * 5) - 2;
        const tempFluctuation = Math.floor(Math.random() * 3) - 1;
        const humFluctuation = Math.floor(Math.random() * 4) - 2;

        let newSoil = Math.max(0, Math.min(100, prev.soilMoisture + soilFluctuation));
        let newTemp = prev.temperature !== null ? Math.max(-10, Math.min(50, prev.temperature + tempFluctuation)) : prev.temperature;
        let newHum = prev.humidity !== null ? Math.max(0, Math.min(100, prev.humidity + humFluctuation)) : prev.humidity;

        return {
          ...prev,
          soilMoisture: newSoil,
          temperature: newTemp,
          humidity: newHum,
          recommendation: newSoil < 40 ? "Irrigate" : "No Irrigation",
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getIrrigationTip = () => {
    if (sensorData.temperature === null) return "";
    
    if (sensorData.temperature > 35) {
      return "High heat detected. Water your crops early morning or late evening to reduce evaporation.";
    } else if (sensorData.temperature >= 25 && sensorData.temperature <= 35) {
      return "Moderate temperature. Regular irrigation is sufficient.";
    } else if (sensorData.temperature < 25) {
      return "Cool conditions. Irrigation may not be urgently required.";
    }
    return "";
  };

  const irrigationTip = getIrrigationTip();
  const translatedTip = useTranslate(irrigationTip);

  return (
    <div className="min-h-screen flex flex-col gap-[25px] bg-[#060C1A] text-white p-4 md:p-8 overflow-x-hidden">
      <div className="w-full flex flex-col gap-2.5 justify-between lg:flex-row items-center">
        <div className="w-full flex flex-row gap-3 justify-center bg-[#0E1421] lg:w-[520px] rounded-[50px] px-[22px] py-[11px] shadow-[0_0_6px_rgba(255,255,255,0.4)]">
          <img src="/assets/search-icon.png" alt="" className="w-[18px] h-[18px]" />
          <input
            type="text"
            placeholder="Search a City...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-[#f7f8f9] text-sm focus:outline-none bg-transparent"
          />
        </div>

        <button
          onClick={() => {
            if (search.trim() !== "") {
              fetchWeather(search);
              setSearch("");
            }
          }}
          className="px-6 py-2 bg-[#742BEC] rounded-full text-white text-sm hover:bg-[#5a22b5] transition-colors"
        >
          <TranslatedText>Search</TranslatedText>
        </button>

        <div className="w-full lg:w-[322px] p-[8px] bg-[#0E1421] rounded-[50px] flex flex-row gap-[10px] items-center">
          <div className="w-[30px] p-[2px] bg-[#742BEC] rounded-[50px]">
            <img src="/assets/user.png" alt="" className="w-full" />
          </div>
          <p className="text-sm text-[#ffffff]">
            {isLoadingUser ? "Loading..." : username}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 justify-between items-center lg:flex-row">
        <div className="w-full lg:w-[500px] h-auto lg:h-[370px] bg-[#0E1421] rounded-[40px] p-6 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col gap-[34px]">
            <div className="bg-[#742BEC] w-auto h-[40px] rounded-[50px] px-[13px] py-[10px] flex flex-row gap-[5px] items-center">
              <img src="/assets/location.png" alt="" />
              <p className="w-full">{location}</p>
              {/* ADD TTS BUTTON FOR LOCATION */}
              <TTSButton text={`Current location ${location}`} size="sm" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-[40px] font-medium">
                  <TranslatedText>{day}</TranslatedText>
                </h2>
                {/* ADD TTS BUTTON FOR DATE */}
                <TTSButton text={`${day}. ${date}`} size="sm" />
              </div>
              <p>
                <TranslatedText>{date}</TranslatedText>
              </p>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-2">
                <p className="text-5xl font-bold">
                  {sensorData.temperature !== null
                    ? `${sensorData.temperature}°C`
                    : "--"}
                </p>
                {/* ADD TTS BUTTON FOR WEATHER */}
                {sensorData.temperature !== null && (
                  <TTSButton 
                    text={`Temperature is ${sensorData.temperature} degrees celsius. Condition: ${sensorData.condition}`} 
                    size="sm" 
                  />
                )}
              </div>
              <p className="text-lg">{translatedCondition || "Condition"}</p>
            </div>
          </div>
          <div className="flex flex-col items-center mt-4 lg:mt-0">
            <img src="/assets/Cloud.png" alt="" className="w-32 h-32" />
          </div>
        </div>

        <div className="w-full lg:w-[450px] h-auto px-[18px] py-[16px] rounded-[30px] bg-[#121B2F]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px]">
              <TranslatedText>Today Highlight</TranslatedText>
            </h2>
            {/* ADD TTS BUTTON FOR HIGHLIGHTS */}
            <TTSButton 
              text={`Today's highlights. Temperature: ${sensorData.temperature || 0} degrees. Humidity: ${sensorData.humidity || 0} percent. Soil Moisture: ${sensorData.soilMoisture} percent.`}
              size="sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0E1421] h-[170px] rounded-[22px] p-4 flex flex-col justify-center gap-[20px]">
              <h3 className="font-semibold">
                <TranslatedText>Temperature</TranslatedText>
              </h3>
              <p className="w-full text-center text-5xl">
                {sensorData.temperature !== null
                  ? `${sensorData.temperature}°C`
                  : "--"}
              </p>
            </div>
            <div className="bg-[#0E1421] h-[170px] rounded-[22px] p-4 flex flex-col justify-center gap-[20px]">
              <h3 className="font-semibold">
                <TranslatedText>Humidity</TranslatedText>
              </h3>
              <p className="w-full text-center text-5xl">
                {sensorData.humidity !== null ? `${sensorData.humidity}%` : "--"}
              </p>
            </div>
            <div className="bg-[#0E1421] h-[170px] rounded-[22px] p-4 flex flex-col justify-center gap-[20px] md:col-span-2">
              <h3 className="font-semibold">
                <TranslatedText>Soil Moisture</TranslatedText>
              </h3>
              <p className="w-full text-center text-5xl">
                {sensorData.soilMoisture}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {sensorData.temperature !== null && irrigationTip && (
        <div className="w-full bg-[#0E1421] mt-6 p-6 rounded-[20px] text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h3 className="text-lg font-semibold">
              <TranslatedText>Irrigation Tip</TranslatedText>
            </h3>
            {/* ADD TTS BUTTON FOR IRRIGATION TIP */}
            <TTSButton text={`Irrigation tip: ${irrigationTip}`} size="sm" />
          </div>
          <p className="text-sm text-gray-300">{translatedTip}</p>
        </div>
      )}
    </div>
  );
}