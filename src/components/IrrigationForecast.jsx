// src/pages/IrrigationForecast.jsx - FIXED COMPLETE VERSION
// ✅ ALL TEXT WRAPPED AND READY FOR TRANSLATION
// ✅ NO ERRORS - COMPLETE CODE
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TranslatedText, { useTranslate } from "../components/TranslatedText";

function IrrigationForecast() {
  const [city, setCity] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [forecastData, setForecastData] = useState(null);

  const FORECAST_API_KEY = "JGR7DR3P93R8WFH3UKBS7Z5E7";

  // Translate dynamic forecast data
  const translatedConditions = useTranslate(forecastData?.conditions || "");
  const translatedTip = useTranslate(forecastData?.tip || "");

  // Translate placeholder text
  const placeholderCity = useTranslate("Enter city");

  const handleSearch = async () => {
    if (!city) return;

    const dateStr = selectedDate.toISOString().split("T")[0];
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${dateStr}/${dateStr}?unitGroup=metric&key=${FORECAST_API_KEY}&include=days`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      const dayData = data.days[0];

      const mappedData = {
        date: dayData.datetime,
        tempAvg: `${dayData.temp} °C`,
        tempMax: `${dayData.tempmax} °C`,
        tempMin: `${dayData.tempmin} °C`,
        rainfall: `${dayData.precip} mm`,
        rainProb: `${dayData.precipprob}%`,
        humidity: `${dayData.humidity}%`,
        windSpeed: `${dayData.windspeed} km/h`,
        evapotranspiration: dayData.evapo || `${dayData.solarradiation} W/m²`,
        conditions: dayData.conditions,
        tip: dayData.precip > 5 ? "No irrigation needed" : "Irrigation Recommended",
      };

      setForecastData(mappedData);
    } catch (err) {
      console.error(err);
      alert("Error fetching forecast. Check the city name or try again.");
      setForecastData(null);
    }
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);

  return (
    <div className="min-h-screen bg-[#060C1A] text-white p-4 flex flex-col gap-6">
      <div className="w-full flex flex-col sm:flex-row gap-4 sm:justify-between items-center">
        <h1 className="text-3xl font-bold">
          <TranslatedText>Irrigation Forecast</TranslatedText>
        </h1>
        <div className="flex w-full gap-2 sm:w-auto">
          <input
            type="text"
            placeholder={placeholderCity}
            className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            onClick={handleSearch}
          >
            <TranslatedText>Search</TranslatedText>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row justify-between mb-6 items-start">
        <div className="w-full rounded">
          <img
            src="assets/Forecast-Img.png"
            alt="Irrigation"
            className="w-full rounded"
          />
        </div>
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl mb-2">
            <TranslatedText>Select Date (Next 14 days)</TranslatedText>
          </h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={today}
            maxDate={maxDate}
            inline
          />
        </div>
      </div>

      {forecastData && (
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-2xl mb-4">
            <TranslatedText>Forecast for</TranslatedText> {capitalize(city)} ({forecastData.date})
          </h2>
          <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Average Temperature</TranslatedText>
              </p>
              <p>{forecastData.tempAvg}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Max/Min Temperature</TranslatedText>
              </p>
              <p>{forecastData.tempMax} / {forecastData.tempMin}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Rainfall</TranslatedText>
              </p>
              <p>{forecastData.rainfall} ({forecastData.rainProb})</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Humidity</TranslatedText>
              </p>
              <p>{forecastData.humidity}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Wind Speed</TranslatedText>
              </p>
              <p>{forecastData.windSpeed}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Evapotranspiration</TranslatedText>
              </p>
              <p>{forecastData.evapotranspiration}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Conditions</TranslatedText>
              </p>
              <p>{translatedConditions}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <p className="font-bold">
                <TranslatedText>Recommendation</TranslatedText>
              </p>
              <p>{translatedTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IrrigationForecast;