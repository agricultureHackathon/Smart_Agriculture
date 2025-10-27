// src/pages/GovtSchemes.jsx - UPDATED WITH WORKING LINKS ONLY
import React from "react";
import TranslatedText from "../components/TranslatedText";

const schemes = [
  {
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description:
      "Focuses on enhancing irrigation coverage and improving water-use efficiency through 'Per Drop More Crop' initiatives. Provides subsidies for drip irrigation and sprinkler systems.",
    link: "https://pmksy.gov.in/",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description:
      "Comprehensive crop insurance scheme protecting farmers against yield losses due to natural calamities, pests, and diseases. Covers all food and oilseed crops with minimal premium.",
    link: "https://pmfby.gov.in/",
  },
  {
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description:
      "Direct income support of ₹6000 per year to eligible farmer families in three equal installments. Helps small and marginal farmers with cultivation and related expenses.",
    link: "https://pmkisan.gov.in/",
  },
  {
    name: "Soil Health Card Scheme",
    description:
      "Promotes soil testing and provides nutrient-based recommendations to improve productivity. Helps farmers understand soil health and apply balanced fertilizers for better yields.",
    link: "https://soilhealth.dac.gov.in/",
  },
  {
    name: "Kisan Credit Card (KCC) Scheme",
    description:
      "Provides adequate and timely credit support to farmers for cultivation, post-harvest expenses, and farming assets. Offers concessional interest rates and easy access to institutional credit.",
    link: "https://agricoop.nic.in/",
  },
  {
    name: "National Agriculture Market (e-NAM)",
    description:
      "Pan-India electronic trading platform for agricultural commodities. Ensures better price discovery, transparent auctions, and connects farmers directly with buyers across India.",
    link: "https://www.enam.gov.in/web/",
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description:
      "Promotes organic farming and sustainable agriculture practices. Provides financial support for organic inputs, certification, and marketing to boost chemical-free farming.",
    link: "https://pgsindia-ncof.gov.in/PKVY/Index.aspx",
  },
  {
    name: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description:
      "State-level initiatives for strengthening agricultural infrastructure including irrigation facilities, warehousing, cold storage, and market linkages in rural areas.",
    link: "https://rkvy.nic.in/",
  },
];

const SchemeCard = ({ scheme }) => {
  return (
    <div className="bg-[#0E1421] text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-[#742BEC]/20 transition-all flex flex-col justify-between min-h-[280px] border border-gray-800 hover:border-[#742BEC]/50">
      <div>
        <h3 className="text-xl font-bold mb-3 text-[#742BEC]">
          <TranslatedText>{scheme.name}</TranslatedText>
        </h3>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
          <TranslatedText>{scheme.description}</TranslatedText>
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
  return (
    <div className="min-h-screen bg-[#060C1A] text-white flex flex-col items-center py-10 px-4 sm:px-6">
      {/* Page Header */}
      <div className="text-center mb-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#742BEC] to-[#9d5ef0] bg-clip-text text-transparent">
          <TranslatedText>Government Schemes for Farmers</TranslatedText>
        </h1>
        <p className="text-gray-400 text-base">
          <TranslatedText>
            Explore major government initiatives focused on irrigation, water conservation, 
            crop insurance, and financial support for farmers across India.
          </TranslatedText>
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
        {schemes.map((scheme, index) => (
          <SchemeCard key={index} scheme={scheme} />
        ))}
      </div>

      {/* Footer Information */}
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