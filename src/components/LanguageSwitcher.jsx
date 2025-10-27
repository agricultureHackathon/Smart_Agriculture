// src/components/LanguageSwitcher.jsx - INSTANT SWITCHING VERSION
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const currentLangObj = languages.find(lang => lang.code === currentLanguage);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle language change - INSTANT with visual feedback
  const handleLanguageChange = (langCode) => {
    if (langCode === currentLanguage) {
      setIsOpen(false);
      return;
    }

    // Show immediate visual feedback
    const button = document.getElementById(`lang-${langCode}`);
    if (button) {
      button.classList.add('scale-95', 'opacity-50');
      setTimeout(() => {
        button.classList.remove('scale-95', 'opacity-50');
      }, 150);
    }

    // Change language immediately
    changeLanguage(langCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Filter languages based on search
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-[#121B2F] to-[#1a2539] hover:from-[#1a2539] hover:to-[#232e48] transition-all w-full text-left group border border-gray-800 hover:border-[#742BEC]/50"
      >
        {/* Animated Globe Icon */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#742BEC] transition-transform group-hover:rotate-12"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {/* Pulse indicator */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#742BEC] rounded-full animate-pulse"></span>
        </div>

        {/* Current Language Display */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white truncate">
            {currentLangObj?.nativeName}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {currentLangObj?.name}
          </div>
        </div>

        {/* Chevron with rotation animation */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-[#742BEC]' : 'text-gray-400'
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu with Smooth Animation */}
      {isOpen && (
        <>
          {/* Backdrop with fade-in */}
          <div
            className="fixed inset-0 z-40 bg-black/20 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute left-0 right-0 mt-2 bg-[#0E1421] rounded-xl shadow-2xl z-50 border border-gray-800 overflow-hidden animate-slideDown">
            {/* Search Bar */}
            <div className="p-4 bg-[#121B2F]/50 border-b border-gray-800">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0E1421] text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#742BEC] placeholder-gray-400 border border-gray-700"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {filteredLanguages.length > 0 ? (
                <div className="p-2">
                  {filteredLanguages.map((lang) => {
                    const isActive = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        id={`lang-${lang.code}`}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 group ${
                          isActive
                            ? 'bg-gradient-to-r from-[#742BEC]/20 to-[#742BEC]/10 text-[#742BEC] border border-[#742BEC]/30'
                            : 'hover:bg-[#121B2F] hover:translate-x-1'
                        }`}
                      >
                        {/* Flag/Icon placeholder */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive ? 'bg-[#742BEC] text-white' : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                        }`}>
                          {lang.code.toUpperCase()}
                        </div>

                        {/* Language Names */}
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate ${isActive ? 'text-[#742BEC]' : 'text-white'}`}>
                            {lang.nativeName}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {lang.name}
                          </div>
                        </div>

                        {/* Check Icon for Active Language */}
                        {isActive && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="flex-shrink-0 text-[#742BEC] animate-scaleIn"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="mx-auto mb-3 text-gray-600"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <p className="text-gray-400 text-sm">No languages found</p>
                  <p className="text-gray-500 text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#121B2F]/50 border-t border-gray-800">
              <p className="text-xs text-gray-400 text-center">
                Showing {filteredLanguages.length} of {languages.length} languages
              </p>
            </div>
          </div>
        </>
      )}

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0E1421;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #742BEC;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a22b5;
        }
      `}</style>
    </div>
  );
}