// File: GovernmentSchemes.jsx
import React from "react";

/**
 * Placeholder scheme data.
 * Replace these objects with real government schemes (e.g., fetched via API or imported from a JSON file).
 */
const schemes = [
  {
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description:
      "Aims to enhance irrigation coverage and improve water-use efficiency through ‘Per Drop More Crop’ initiatives.",
    link: "https://pmksy.gov.in/",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description:
      "Provides crop insurance to farmers against yield losses due to natural calamities, pests, and diseases.",
    link: "https://pmfby.gov.in/",
  },
  {
    name: "Soil Health Card Scheme",
    description:
      "Promotes soil testing to provide farmers with nutrient recommendations to improve productivity.",
    link: "https://soilhealth.dac.gov.in/",
  },
];

/**
 * Reusable component for displaying each scheme card.
 * Uses Tailwind CSS for layout, colors, and hover effects.
 */
const SchemeCard = ({ scheme }) => {
  return (
    <div className="bg-[#0E1421] text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-3 text-[#742BEC]">
          {scheme.name}
        </h3>
        <p className="text-gray-300 mb-4 text-sm">{scheme.description}</p>
      </div>
      <a
        href={scheme.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto bg-[#742BEC] hover:bg-[#5b22b8] text-white text-sm font-medium px-4 py-2 rounded-lg text-center transition"
      >
        Learn More
      </a>
    </div>
  );
};

/**
 * Main component that displays all government schemes in a responsive grid.
 */
const GovernmentSchemes = () => {
  return (
    <div className="min-h-screen bg-[#060C1A] text-white flex flex-col items-center py-10 px-6">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        Government Schemes
      </h1>

      {/* Grid Layout for Schemes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {schemes.map((scheme, index) => (
          <SchemeCard key={index} scheme={scheme} />
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-gray-400 text-xs mt-10 text-center">
        Data sourced from official government portals. Always verify details on
        the official site before applying.
      </p>
    </div>
  );
};

export default GovernmentSchemes;
