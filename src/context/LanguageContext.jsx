// src/context/LanguageContext.jsx - COMPLETE FIX WITH COMPREHENSIVE DICTIONARY
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';

const LanguageContext = createContext();

// Verified languages - all supported by translation APIs
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

// Comprehensive offline dictionary for instant translations
const OFFLINE_DICTIONARY = {
  // Navigation & UI
  'Dashboard': { hi: 'डैशबोर्ड', bn: 'ড্যাশবোর্ড', te: 'డాష్‌బోర్డ్', ta: 'டாஷ்போர்டு', mr: 'डॅशबोर्ड', gu: 'ડેશબોર્ડ', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', ml: 'ഡാഷ്ബോർഡ്', pa: 'ਡੈਸ਼ਬੋਰਡ', ur: 'ڈیش بورڈ', ne: 'ड्यासबोर्ड', es: 'Panel', fr: 'Tableau de bord', ar: 'لوحة القيادة' },
  'Menu': { hi: 'मेनू', bn: 'মেনু', te: 'మెనూ', ta: 'பட்டி', mr: 'मेनू', gu: 'મેનુ', kn: 'ಮೆನು', ml: 'മെനു', pa: 'ਮੀਨੂ', ur: 'مینو', ne: 'मेनु', es: 'Menú', fr: 'Menu', ar: 'القائمة' },
  'Search': { hi: 'खोजें', bn: 'অনুসন্ধান', te: 'వెతకండి', ta: 'தேடு', mr: 'शोधा', gu: 'શોધો', kn: 'ಹುಡುಕಿ', ml: 'തിരയുക', pa: 'ਖੋਜੋ', ur: 'تلاش', ne: 'खोज्नुहोस्', es: 'Buscar', fr: 'Rechercher', ar: 'بحث' },
  'Login': { hi: 'लॉगिन', bn: 'লগইন', te: 'లాగిన్', ta: 'உள்நுழை', mr: 'लॉगिन', gu: 'લૉગિન', kn: 'ಲಾಗಿನ್', ml: 'ലോഗിൻ', pa: 'ਲਾਗਿਨ', ur: 'لاگ ان', ne: 'लगइन', es: 'Iniciar sesión', fr: 'Connexion', ar: 'تسجيل الدخول' },
  'Sign Up': { hi: 'साइन अप', bn: 'সাইন আপ', te: 'సైన్ అప్', ta: 'பதிவு செய்', mr: 'साइन अप', gu: 'સાઇન અપ', kn: 'ಸೈನ್ ಅಪ್', ml: 'സൈൻ അപ്പ്', pa: 'ਸਾਈਨ ਅਪ', ur: 'سائن اپ', ne: 'साइन अप', es: 'Registrarse', fr: "S'inscrire", ar: 'تسجيل' },
  'Logout': { hi: 'लॉगआउट', bn: 'লগআউট', te: 'లాగ్అవుట్', ta: 'வெளியேறு', mr: 'लॉगआउट', gu: 'લૉગઆઉટ', kn: 'ಲಾಗೌಟ್', ml: 'ലോഗൗട്ട്', pa: 'ਲਾਗਆਉਟ', ur: 'لاگ آؤٹ', ne: 'लगआउट', es: 'Cerrar sesión', fr: 'Déconnexion', ar: 'تسجيل الخروج' },
  "Don't have an account? Sign Up": { hi: 'खाता नहीं है? साइन अप करें', bn: 'অ্যাকাউন্ট নেই? সাইন আপ করুন', te: 'ఖాతా లేదా? సైన్ అప్ చేయండి', ta: 'கணக்கு இல்லையா? பதிவு செய்யுங்கள்', mr: 'खाते नाही? साइन अप करा', gu: 'એકાઉન્ટ નથી? સાઇન અપ કરો', kn: 'ಖಾತೆ ಇಲ್ಲವೇ? ಸೈನ್ ಅಪ್ ಮಾಡಿ', ml: 'അക്കൗണ്ട് ഇല്ലേ? സൈൻ അപ്പ് ചെയ്യുക', pa: 'ਖਾਤਾ ਨਹੀਂ ਹੈ? ਸਾਈਨ ਅਪ ਕਰੋ', ur: 'اکاؤنٹ نہیں ہے؟ سائن اپ کریں', ne: 'खाता छैन? साइन अप गर्नुहोस्', es: '¿No tienes cuenta? Registrarse', fr: "Pas de compte? S'inscrire", ar: 'لا يوجد حساب؟ سجل' },
  'Already have an account? Login': { hi: 'पहले से खाता है? लॉगिन करें', bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন', te: 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ చేయండి', ta: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக', mr: 'आधीच खाते आहे? लॉगिन करा', gu: 'પહેલેથી એકાઉન્ટ છે? લૉગિન કરો', kn: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ', ml: 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ ചെയ്യുക', pa: 'ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ਲਾਗਿਨ ਕਰੋ', ur: 'پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں', ne: 'पहिले नै खाता छ? लगइन गर्नुहोस्', es: '¿Ya tienes cuenta? Iniciar sesión', fr: 'Vous avez déjà un compte? Connexion', ar: 'لديك حساب؟ تسجيل الدخول' },
  
  // Weather & Sensors
  'Temperature': { hi: 'तापमान', bn: 'তাপমাত্রা', te: 'ఉష్ణోగ్రత', ta: 'வெப்பநிலை', mr: 'तापमान', gu: 'તાપમાન', kn: 'ತಾಪಮಾನ', ml: 'താപനില', pa: 'ਤਾਪਮਾਨ', ur: 'درجہ حرارت', ne: 'तापक्रम', es: 'Temperatura', fr: 'Température', ar: 'درجة الحرارة' },
  'Humidity': { hi: 'नमी', bn: 'আর্দ্রতা', te: 'తేమ', ta: 'ஈரப்பதம்', mr: 'आर्द्रता', gu: 'ભેજ', kn: 'ತೇವಾಂಶ', ml: 'ഈർപ്പം', pa: 'ਨਮੀ', ur: 'نمی', ne: 'आर्द्रता', es: 'Humedad', fr: 'Humidité', ar: 'الرطوبة' },
  'Soil Moisture': { hi: 'मिट्टी की नमी', bn: 'মাটির আর্দ্রতা', te: 'నేల తేమ', ta: 'மண் ஈரப்பதம்', mr: 'मातीची ओलावा', gu: 'માટીની ભેજ', kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶ', ml: 'മണ്ണിന്റെ ഈർപ്പം', pa: 'ਮਿੱਟੀ ਦੀ ਨਮੀ', ur: 'مٹی کی نمی', ne: 'माटोको आर्द्रता', es: 'Humedad del suelo', fr: 'Humidité du sol', ar: 'رطوبة التربة' },
  'Today Highlight': { hi: 'आज का मुख्य', bn: 'আজকের হাইলাইট', te: 'నేటి ముఖ్యాంశం', ta: 'இன்றைய சிறப்பம்சம்', mr: 'आजचे ठळक', gu: 'આજની હાઇલાઇટ', kn: 'ಇಂದಿನ ಮುಖ್ಯಾಂಶ', ml: 'ഇന്നത്തെ ഹൈലൈറ്റ്', pa: 'ਅੱਜ ਦਾ ਮੁੱਖ', ur: 'آج کی اہم بات', ne: 'आजको मुख्य', es: 'Resumen de hoy', fr: "Point d'aujourd'hui", ar: 'أبرز اليوم' },
  'Irrigation Tip': { hi: 'सिंचाई सुझाव', bn: 'সেচ টিপ', te: 'నీటిపారుదల చిట్కా', ta: 'நீர்ப்பாசன குறிப்பு', mr: 'सिंचन टीप', gu: 'સિંચાઈ ટિપ', kn: 'ನೀರಾವರಿ ಸಲಹೆ', ml: 'ജലസേചന നുറുങ്ങ്', pa: 'ਸਿੰਚਾਈ ਸੁਝਾਅ', ur: 'آبپاشی تجویز', ne: 'सिंचाइ सुझाव', es: 'Consejo de riego', fr: "Conseil d'irrigation", ar: 'نصيحة الري' },
  
  // Agriculture
  'AI Crop Recommendation': { hi: 'एआई फसल सिफारिश', bn: 'এআই ফসল সুপারিশ', te: 'ఏఐ పంట సిఫార్సు', ta: 'AI பயிர் பரிந்துரை', mr: 'एआय पीक शिफारस', gu: 'એઆઈ પાક ભલામણ', kn: 'ಎಐ ಬೆಳೆ ಶಿಫಾರಸು', ml: 'AI വിള ശുപാർശ', pa: 'AI ਫਸਲ ਸਿਫ਼ਾਰਸ਼', ur: 'AI فصل تجویز', ne: 'एआई बाली सिफारिस', es: 'Recomendación de cultivos IA', fr: 'Recommandation de cultures IA', ar: 'توصية المحاصيل بالذكاء الاصطناعي' },
  'AI Irrigation Forecast': { hi: 'एआई सिंचाई पूर्वानुमान', bn: 'এআই সেচ পূর্বাভাস', te: 'ఏఐ నీటిపారుదల అంచనా', ta: 'AI நீர்ப்பாசன முன்னறிவிப்பு', mr: 'एआय सिंचन अंदाज', gu: 'એઆઈ સિંચાઈ આગાહી', kn: 'ಎಐ ನೀರಾವರಿ ಮುನ್ಸೂಚನೆ', ml: 'AI ജലസേചന പ്രവചനം', pa: 'AI ਸਿੰਚਾਈ ਪੂਰਵ ਅਨੁਮਾਨ', ur: 'AI آبپاشی پیشن گوئی', ne: 'एआई सिंचाइ पूर्वानुमान', es: 'Pronóstico de riego IA', fr: "Prévision d'irrigation IA", ar: 'توقعات الري بالذكاء الاصطناعي' },
  'Government Schemes': { hi: 'सरकारी योजनाएं', bn: 'সরকারি প্রকল্প', te: 'ప్రభుత్వ పథకాలు', ta: 'அரசு திட்டங்கள்', mr: 'सरकारी योजना', gu: 'સરકારી યોજનાઓ', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', ml: 'സർക്കാർ പദ്ധതികൾ', pa: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', ur: 'سرکاری اسکیمیں', ne: 'सरकारी योजनाहरू', es: 'Esquemas gubernamentales', fr: 'Programmes gouvernementaux', ar: 'المخططات الحكومية' },
  'Control Pump': { hi: 'पंप नियंत्रण', bn: 'পাম্প নিয়ন্ত্রণ', te: 'పంపు నియంత్రణ', ta: 'பம்ப் கட்டுப்பாடு', mr: 'पंप नियंत्रण', gu: 'પંપ નિયંત્રણ', kn: 'ಪಂಪ್ ನಿಯಂತ್ರಣ', ml: 'പമ്പ് നിയന്ത്രണം', pa: 'ਪੰਪ ਨਿਯੰਤਰਣ', ur: 'پمپ کنٹرول', ne: 'पम्प नियन्त्रण', es: 'Control de bomba', fr: 'Contrôle de pompe', ar: 'التحكم في المضخة' },
  
  // Crop Recommendation
  'General Mode': { hi: 'सामान्य मोड', bn: 'সাধারণ মোড', te: 'సాధారణ మోడ్', ta: 'பொது பயன்முறை', mr: 'सामान्य मोड', gu: 'સામાન્ય મોડ', kn: 'ಸಾಮಾನ್ಯ ಮೋಡ್', ml: 'സാധാരണ മോഡ്', pa: 'ਆਮ ਮੋਡ', ur: 'عام موڈ', ne: 'सामान्य मोड', es: 'Modo general', fr: 'Mode général', ar: 'الوضع العام' },
  'Specialized Mode': { hi: 'विशेष मोड', bn: 'বিশেষ মোড', te: 'ప్రత్యేక మోడ్', ta: 'சிறப்பு பயன்முறை', mr: 'विशेष मोड', gu: 'વિશેષ મોડ', kn: 'ವಿಶೇಷ ಮೋಡ್', ml: 'പ്രത്യേക മോഡ്', pa: 'ਵਿਸ਼ੇਸ਼ ਮੋਡ', ur: 'خصوصی موڈ', ne: 'विशेष मोड', es: 'Modo especializado', fr: 'Mode spécialisé', ar: 'الوضع المتخصص' },
  'Get Recommendations': { hi: 'सिफारिशें प्राप्त करें', bn: 'সুপারিশ পান', te: 'సిఫార్సులు పొందండి', ta: 'பரிந்துரைகளைப் பெறுக', mr: 'शिफारशी मिळवा', gu: 'ભલામણો મેળવો', kn: 'ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ', ml: 'ശുപാർശകൾ നേടുക', pa: 'ਸਿਫ਼ਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ', ur: 'تجاویز حاصل کریں', ne: 'सिफारिसहरू प्राप्त गर्नुहोस्', es: 'Obtener recomendaciones', fr: 'Obtenir des recommandations', ar: 'احصل على التوصيات' },
  'Loading...': { hi: 'लोड हो रहा है...', bn: 'লোড হচ্ছে...', te: 'లోడ్ అవుతోంది...', ta: 'ஏற்றுகிறது...', mr: 'लोड होत आहे...', gu: 'લોડ થઈ રહ્યું છે...', kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', ml: 'ലോഡ് ചെയ്യുന്നു...', pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...', ur: 'لوڈ ہو رہا ہے...', ne: 'लोड हुँदैछ...', es: 'Cargando...', fr: 'Chargement...', ar: 'جار التحميل...' },
  'Processing...': { hi: 'प्रोसेस हो रहा है...', bn: 'প্রক্রিয়া করছে...', te: 'ప్రాసెస్ అవుతోంది...', ta: 'செயலாக்கப்படுகிறது...', mr: 'प्रक्रिया होत आहे...', gu: 'પ્રક્રિયા થઈ રહી છે...', kn: 'ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತಿದೆ...', ml: 'പ്രോസസ്സ് ചെയ്യുന്നു...', pa: 'ਪ੍ਰਕਿਰਿਆ ਹੋ ਰਹੀ ਹੈ...', ur: 'پروسیسنگ...', ne: 'प्रक्रिया हुँदैछ...', es: 'Procesando...', fr: 'Traitement...', ar: 'معالجة...' },
  
  // Days of week
  'Monday': { hi: 'सोमवार', bn: 'সোমবার', te: 'సోమవారం', ta: 'திங்கள்', mr: 'सोमवार', gu: 'સોમવાર', kn: 'ಸೋಮವಾರ', ml: 'തിങ്കൾ', pa: 'ਸੋਮਵਾਰ', ur: 'پیر', ne: 'सोमबार', es: 'Lunes', fr: 'Lundi', ar: 'الإثنين' },
  'Tuesday': { hi: 'मंगलवार', bn: 'মঙ্গলবার', te: 'మంగళవారం', ta: 'செவ்வாய்', mr: 'मंगळवार', gu: 'મંગળવાર', kn: 'ಮಂಗಳವಾರ', ml: 'ചൊവ്വ', pa: 'ਮੰਗਲਵਾਰ', ur: 'منگل', ne: 'मंगलबार', es: 'Martes', fr: 'Mardi', ar: 'الثلاثاء' },
  'Wednesday': { hi: 'बुधवार', bn: 'বুধবার', te: 'బుధవారం', ta: 'புதன்', mr: 'बुधवार', gu: 'બુધવાર', kn: 'ಬುಧವಾರ', ml: 'ബുധൻ', pa: 'ਬੁੱਧਵਾਰ', ur: 'بدھ', ne: 'बुधबार', es: 'Miércoles', fr: 'Mercredi', ar: 'الأربعاء' },
  'Thursday': { hi: 'गुरुवार', bn: 'বৃহস্পতিবার', te: 'గురువారం', ta: 'வியாழன்', mr: 'गुरुवार', gu: 'ગુરુવાર', kn: 'ಗುರುವಾರ', ml: 'വ്യാഴം', pa: 'ਵੀਰਵਾਰ', ur: 'جمعرات', ne: 'बिहिबार', es: 'Jueves', fr: 'Jeudi', ar: 'الخميس' },
  'Friday': { hi: 'शुक्रवार', bn: 'শুক্রবার', te: 'శుక్రవారం', ta: 'வெள்ளி', mr: 'शुक्रवार', gu: 'શુક્રવાર', kn: 'ಶುಕ್ರವಾರ', ml: 'വെള്ളി', pa: 'ਸ਼ੁੱਕਰਵਾਰ', ur: 'جمعہ', ne: 'शुक्रबार', es: 'Viernes', fr: 'Vendredi', ar: 'الجمعة' },
  'Saturday': { hi: 'शनिवार', bn: 'শনিবার', te: 'శనివారం', ta: 'சனி', mr: 'शनिवार', gu: 'શનિવાર', kn: 'ಶನಿವಾರ', ml: 'ശനി', pa: 'ਸ਼ਨੀਵਾਰ', ur: 'ہفتہ', ne: 'शनिबार', es: 'Sábado', fr: 'Samedi', ar: 'السبت' },
  'Sunday': { hi: 'रविवार', bn: 'রবিবার', te: 'ఆదివారం', ta: 'ஞாயிறு', mr: 'रविवार', gu: 'રવિવાર', kn: 'ಭಾನುವಾರ', ml: 'ഞായർ', pa: 'ਐਤਵਾਰ', ur: 'اتوار', ne: 'आइतबार', es: 'Domingo', fr: 'Dimanche', ar: 'الأحد' },
  
  // Soil parameters
  'Enter your location (City, District, or Region):': { hi: 'अपना स्थान दर्ज करें (शहर, जिला या क्षेत्र):', bn: 'আপনার অবস্থান লিখুন (শহর, জেলা বা অঞ্চল):', te: 'మీ స్థానాన్ని నమోదు చేయండి (నగరం, జిల్లా లేదా ప్రాంతం):', ta: 'உங்கள் இடத்தை உள்ளிடவும் (நகரம், மாவட்டம் அல்லது பகுதி):', mr: 'तुमचे स्थान प्रविष्ट करा (शहर, जिल्हा किंवा प्रदेश):', gu: 'તમારું સ્થાન દાખલ કરો (શહેર, જિલ્લો અથવા પ્રદેશ):', kn: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ (ನಗರ, ಜಿಲ್ಲೆ ಅಥವಾ ಪ್ರದೇಶ):', ml: 'നിങ്ങളുടെ സ്ഥലം നൽകുക (നഗരം, ജില്ല അല്ലെങ്കിൽ പ്രദേശം):', pa: 'ਆਪਣਾ ਸਥਾਨ ਦਰਜ ਕਰੋ (ਸ਼ਹਿਰ, ਜ਼ਿਲ੍ਹਾ ਜਾਂ ਖੇਤਰ):', ur: 'اپنا مقام درج کریں (شہر، ضلع یا علاقہ):', ne: 'आफ्नो स्थान प्रविष्ट गर्नुहोस् (शहर, जिल्ला वा क्षेत्र):', es: 'Ingrese su ubicación (ciudad, distrito o región):', fr: 'Entrez votre emplacement (ville, district ou région):', ar: 'أدخل موقعك (مدينة أو منطقة أو إقليم):' },
  'Enter soil lab data:': { hi: 'मिट्टी की जांच डेटा दर्ज करें:', bn: 'মাটি পরীক্ষা ডেটা লিখুন:', te: 'నేల పరీక్ష డేటా నమోదు చేయండి:', ta: 'மண் பரிசோதனை தரவை உள்ளிடவும்:', mr: 'माती चाचणी डेटा प्रविष्ट करा:', gu: 'માટી પરીક્ષણ ડેટા દાખલ કરો:', kn: 'ಮಣ್ಣು ಪರೀಕ್ಷೆ ಡೇಟಾವನ್ನು ನಮೂದಿಸಿ:', ml: 'മണ്ണ് പരിശോധന ഡാറ്റ നൽകുക:', pa: 'ਮਿੱਟੀ ਪਰੀਖਿਆ ਡੇਟਾ ਦਰਜ ਕਰੋ:', ur: 'مٹی کی جانچ ڈیٹا درج کریں:', ne: 'माटो परीक्षण डेटा प्रविष्ट गर्नुहोस्:', es: 'Ingrese datos de análisis de suelo:', fr: 'Entrez les données d\'analyse du sol:', ar: 'أدخل بيانات تحليل التربة:' },
  'Nitrogen (N)': { hi: 'नाइट्रोजन (N)', bn: 'নাইট্রোজেন (N)', te: 'నైట్రోజన్ (N)', ta: 'நைட்ரஜன் (N)', mr: 'नायट्रोजन (N)', gu: 'નાઇટ્રોજન (N)', kn: 'ನೈಟ್ರೋಜನ್ (N)', ml: 'നൈട്രജൻ (N)', pa: 'ਨਾਈਟ੍ਰੋਜਨ (N)', ur: 'نائٹروجن (N)', ne: 'नाइट्रोजन (N)', es: 'Nitrógeno (N)', fr: 'Azote (N)', ar: 'النيتروجين (N)' },
  'Phosphorus (P)': { hi: 'फास्फोरस (P)', bn: 'ফসফরাস (P)', te: 'ఫాస్ఫరస్ (P)', ta: 'பாஸ்பரஸ் (P)', mr: 'फॉस्फरस (P)', gu: 'ફોસ્ફરસ (P)', kn: 'ಫಾಸ್ಫರಸ್ (P)', ml: 'ഫോസ്ഫറസ് (P)', pa: 'ਫਾਸਫੋਰਸ (P)', ur: 'فاسفورس (P)', ne: 'फस्फोरस (P)', es: 'Fósforo (P)', fr: 'Phosphore (P)', ar: 'الفوسفور (P)' },
  'Potassium (K)': { hi: 'पोटेशियम (K)', bn: 'পটাশিয়াম (K)', te: 'పొటాషియం (K)', ta: 'பொட்டாசியம் (K)', mr: 'पोटॅशियम (K)', gu: 'પોટેશિયમ (K)', kn: 'ಪೊಟ್ಯಾಸಿಯಮ್ (K)', ml: 'പൊട്ടാസ്യം (K)', pa: 'ਪੋਟਾਸ਼ੀਅਮ (K)', ur: 'پوٹاشیم (K)', ne: 'पोटासियम (K)', es: 'Potasio (K)', fr: 'Potassium (K)', ar: 'البوتاسيوم (K)' },
  'Soil:': { hi: 'मिट्टी:', bn: 'মাটি:', te: 'నేల:', ta: 'மண்:', mr: 'माती:', gu: 'માટી:', kn: 'ಮಣ್ಣು:', ml: 'മണ്ണ്:', pa: 'ਮਿੱਟੀ:', ur: 'مٹی:', ne: 'माटो:', es: 'Suelo:', fr: 'Sol:', ar: 'التربة:' },
  'Climate:': { hi: 'जलवायु:', bn: 'জলবায়ু:', te: 'వాతావరణం:', ta: 'தட்பவெப்ப நிலை:', mr: 'हवामान:', gu: 'આબોહવા:', kn: 'ಹವಾಮಾನ:', ml: 'കാലാവസ്ഥ:', pa: 'ਜਲਵਾਯੂ:', ur: 'آب و ہوا:', ne: 'मौसम:', es: 'Clima:', fr: 'Climat:', ar: 'المناخ:' },
  'Water:': { hi: 'पानी:', bn: 'জল:', te: 'నీరు:', ta: 'நீர்:', mr: 'पाणी:', gu: 'પાણી:', kn: 'ನೀರು:', ml: 'വെള്ളം:', pa: 'ਪਾਣੀ:', ur: 'پانی:', ne: 'पानी:', es: 'Agua:', fr: 'Eau:', ar: 'ماء:' },
  'Season:': { hi: 'मौसम:', bn: 'ঋতু:', te: 'సీజన్:', ta: 'பருவம்:', mr: 'हंगाम:', gu: 'મોસમ:', kn: 'ಋತು:', ml: 'സീസൺ:', pa: 'ਮੌਸਮ:', ur: 'موسم:', ne: 'मौसम:', es: 'Temporada:', fr: 'Saison:', ar: 'الموسم:' },
  'Recommended Crops for': { hi: 'के लिए अनुशंसित फसलें', bn: 'জন্য প্রস্তাবিত ফসল', te: 'కోసం సిఫార్సు చేసిన పంటలు', ta: 'க்கான பரிந்துரைக்கப்பட்ட பயிர்கள்', mr: 'साठी शिफारस केलेली पिके', gu: 'માટે ભલામણ કરેલ પાકો', kn: 'ಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾದ ಬೆಳೆಗಳು', ml: 'വേണ്ടി ശുപാർശ ചെയ്ത വിളകൾ', pa: 'ਲਈ ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫਸਲਾਂ', ur: 'کے لیے تجویز کردہ فصلیں', ne: 'को लागि सिफारिस गरिएको बाली', es: 'Cultivos recomendados para', fr: 'Cultures recommandées pour', ar: 'المحاصيل الموصى بها لـ' },
  'Recommended Crops': { hi: 'अनुशंसित फसलें', bn: 'প্রস্তাবিত ফসল', te: 'సిఫార్సు చేసిన పంటలు', ta: 'பரிந்துரைக்கப்பட்ட பயிர்கள்', mr: 'शिफारस केलेली पिके', gu: 'ભલામણ કરેલ પાકો', kn: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ಬೆಳೆಗಳು', ml: 'ശുപാർശ ചെയ്ത വിളകൾ', pa: 'ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫਸਲਾਂ', ur: 'تجویز کردہ فصلیں', ne: 'सिफारिस गरिएको बाली', es: 'Cultivos recomendados', fr: 'Cultures recommandées', ar: 'المحاصيل الموصى بها' },
  'Specialized Analysis': { hi: 'विशेष विश्लेषण', bn: 'বিশেষ বিশ্লেষণ', te: 'ప్రత్యేక విశ్లేషణ', ta: 'சிறப்பு பகுப்பாய்வு', mr: 'विशेष विश्लेषण', gu: 'વિશેષ વિશ્લેષણ', kn: 'ವಿಶೇಷ ವಿಶ್ಲೇಷಣೆ', ml: 'പ്രത്യേക വിശകലനം', pa: 'ਵਿਸ਼ੇਸ਼ ਵਿਸ਼ਲੇਸ਼ਣ', ur: 'خصوصی تجزیہ', ne: 'विशेष विश्लेषण', es: 'Análisis especializado', fr: 'Analyse spécialisée', ar: 'التحليل المتخصص' },
  'Irrigation Forecast': { hi: 'सिंचाई पूर्वानुमान', bn: 'সেচ পূর্বাভাস', te: 'నీటిపారుదల అంచనా', ta: 'நீர்ப்பாசன முன்னறிவிப்பு', mr: 'सिंचन अंदाज', gu: 'સિંચાઈ આગાહી', kn: 'ನೀರಾವರಿ ಮುನ್ಸೂಚನೆ', ml: 'ജലസേചന പ്രവചനം', pa: 'ਸਿੰਚਾਈ ਪੂਰਵ ਅਨੁਮਾਨ', ur: 'آبپاشی پیشن گوئی', ne: 'सिंचाइ पूर्वानुमान', es: 'Pronóstico de riego', fr: "Prévision d'irrigation", ar: 'توقعات الري' },
  'Select Date (Next 14 days)': { hi: 'तिथि चुनें (अगले 14 दिन)', bn: 'তারিখ নির্বাচন করুন (পরবর্তী 14 দিন)', te: 'తేదీని ఎంచుకోండి (తదుపరి 14 రోజులు)', ta: 'தேதியைத் தேர்ந்தெடுக்கவும் (அடுத்த 14 நாட்கள்)', mr: 'तारीख निवडा (पुढील 14 दिवस)', gu: 'તારીખ પસંદ કરો (આગામી 14 દિવસ)', kn: 'ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಮುಂದಿನ 14 ದಿನಗಳು)', ml: 'തീയതി തിരഞ്ഞെടുക്കുക (അടുത്ത 14 ദിവസം)', pa: 'ਤਾਰੀਖ ਚੁਣੋ (ਅਗਲੇ 14 ਦਿਨ)', ur: 'تاریخ منتخب کریں (اگلے 14 دن)', ne: 'मिति चयन गर्नुहोस् (अर्को 14 दिन)', es: 'Seleccionar fecha (próximos 14 días)', fr: 'Sélectionner la date (14 prochains jours)', ar: 'حدد التاريخ (14 يومًا القادمة)' },
  'Forecast for': { hi: 'के लिए पूर्वानुमान', bn: 'জন্য পূর্বাভাস', te: 'కోసం అంచనా', ta: 'க்கான முன்னறிவிப்பு', mr: 'साठी अंदाज', gu: 'માટે આગાહી', kn: 'ಗಾಗಿ ಮುನ್ಸೂಚನೆ', ml: 'വേണ്ടിയുള്ള പ്രവചനം', pa: 'ਲਈ ਪੂਰਵ ਅਨੁਮਾਨ', ur: 'کے لیے پیشن گوئی', ne: 'को लागि पूर्वानुमान', es: 'Pronóstico para', fr: 'Prévision pour', ar: 'توقعات لـ' },
  'Average Temperature': { hi: 'औसत तापमान', bn: 'গড় তাপমাত্রা', te: 'సగటు ఉష్ణోగ్రత', ta: 'சராசரி வெப்பநிலை', mr: 'सरासरी तापमान', gu: 'સરેરાશ તાપમાન', kn: 'ಸರಾಸರಿ ತಾಪಮಾನ', ml: 'ശരാശരി താപനില', pa: 'ਔਸਤ ਤਾਪਮਾਨ', ur: 'اوسط درجہ حرارت', ne: 'औसत तापक्रम', es: 'Temperatura promedio', fr: 'Température moyenne', ar: 'متوسط ​​درجة الحرارة' },
  'Max/Min Temperature': { hi: 'अधिकतम/न्यूनतम तापमान', bn: 'সর্বোচ্চ/সর্বনিম্ন তাপমাত্রা', te: 'గరిష్ట/కనిష్ట ఉష్ణోగ్రత', ta: 'அதிகபட்ச/குறைந்தபட்ச வெப்பநிலை', mr: 'कमाल/किमान तापमान', gu: 'મહત્તમ/ન્યૂનતમ તાપમાન', kn: 'ಗರಿಷ್ಠ/ಕನಿಷ್ಠ ತಾಪಮಾನ', ml: 'പരമാവധി/കുറഞ്ഞ താപനില', pa: 'ਵੱਧ ਤੋਂ ਵੱਧ/ਘੱਟੋ-ਘੱਟ ਤਾਪਮਾਨ', ur: 'زیادہ سے زیادہ/کم از کم درجہ حرارت', ne: 'अधिकतम/न्यूनतम तापक्रम', es: 'Temperatura máx/mín', fr: 'Température max/min', ar: 'درجة الحرارة القصوى/الدنيا' },
  'Rainfall': { hi: 'वर्षा', bn: 'বৃষ্টিপাত', te: 'వర్షపాతం', ta: 'மழை', mr: 'पाऊस', gu: 'વરસાદ', kn: 'ಮಳೆ', ml: 'മഴ', pa: 'ਬਾਰਿਸ਼', ur: 'بارش', ne: 'वर्षा', es: 'Lluvia', fr: 'Pluie', ar: 'هطول الأمطار' },
  'Wind Speed': { hi: 'हवा की गति', bn: 'বাতাসের গতি', te: 'గాలి వేగం', ta: 'காற்றின் வேகம்', mr: 'वाऱ्याचा वेग', gu: 'પવનની ઝડપ', kn: 'ಗಾಳಿಯ ವೇಗ', ml: 'കാറ്റിന്റെ വേഗത', pa: 'ਹਵਾ ਦੀ ਗਤੀ', ur: 'ہوا کی رفتار', ne: 'हावाको गति', es: 'Velocidad del viento', fr: 'Vitesse du vent', ar: 'سرعة الرياح' },
  'Evapotranspiration': { hi: 'वाष्पोत्सर्जन', bn: 'বাষ্পীভবন', te: 'బాష్పవాయువు', ta: 'ஆவியாதல்', mr: 'बाष्पीभवन', gu: 'બાષ્પીભવન', kn: 'ಬಾಷ್ಪೀಕರಣ', ml: 'ബാഷ്പീകരണം', pa: 'ਵਾਸ਼ਪੀਕਰਨ', ur: 'بخارات', ne: 'वाष्पीकरण', es: 'Evapotranspiración', fr: 'Évapotranspiration', ar: 'التبخر' },
  'Conditions': { hi: 'स्थिति', bn: 'অবস্থা', te: 'పరిస్థితులు', ta: 'நிலைமைகள்', mr: 'परिस्थिती', gu: 'સ્થિતિ', kn: 'ಪರಿಸ್ಥಿತಿಗಳು', ml: 'അവസ്ഥകൾ', pa: 'ਸਥਿਤੀਆਂ', ur: 'حالات', ne: 'अवस्थाहरू', es: 'Condiciones', fr: 'Conditions', ar: 'الظروف' },
  'Recommendation': { hi: 'सिफारिश', bn: 'সুপারিশ', te: 'సిఫార్సు', ta: 'பரிந்துரை', mr: 'शिफारस', gu: 'ભલામણ', kn: 'ಶಿಫಾರಸು', ml: 'ശുപാർശ', pa: 'ਸਿਫ਼ਾਰਸ਼', ur: 'تجویز', ne: 'सिफारिस', es: 'Recomendación', fr: 'Recommandation', ar: 'توصية' },
  'Learn More': { hi: 'और जानें', bn: 'আরো জানুন', te: 'మరింత తెలుసుకోండి', ta: 'மேலும் அறிக', mr: 'अधिक जाणून घ्या', gu: 'વધુ જાણો', kn: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ', ml: 'കൂടുതൽ അറിയുക', pa: 'ਹੋਰ ਜਾਣੋ', ur: 'مزید جانیں', ne: 'थप जान्नुहोस्', es: 'Aprende más', fr: 'En savoir plus', ar: 'اعرف المزيد' },
  'Important Information': { hi: 'महत्वपूर्ण जानकारी', bn: 'গুরুত্বপূর্ণ তথ্য', te: 'ముఖ్యమైన సమాచారం', ta: 'முக்கிய தகவல்', mr: 'महत्त्वाची माहिती', gu: 'મહત્વપૂર્ણ માહિતી', kn: 'ಪ್ರಮುಖ ಮಾಹಿತಿ', ml: 'പ്രധാന വിവരം', pa: 'ਮਹੱਤਵਪੂਰਨ ਜਾਣਕਾਰੀ', ur: 'اہم معلومات', ne: 'महत्त्वपूर्ण जानकारी', es: 'Información importante', fr: 'Information importante', ar: 'معلومات مهمة' },
  'Enter a location to get crop recommendations': { hi: 'फसल सिफारिशें प्राप्त करने के लिए स्थान दर्ज करें', bn: 'ফসল সুপারিশ পেতে একটি অবস্থান লিখুন', te: 'పంట సిఫార్సులు పొందడానికి స్థానాన్ని నమోదు చేయండి', ta: 'பயிர் பரிந்துரைகளைப் பெற இடத்தை உள்ளிடவும்', mr: 'पीक शिफारशी मिळविण्यासाठी स्थान प्रविष्ट करा', gu: 'પાક ભલામણો મેળવવા માટે સ્થાન દાખલ કરો', kn: 'ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಲು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ', ml: 'വിള ശുപാർശകൾ ലഭിക്കാൻ സ്ഥലം നൽകുക', pa: 'ਫਸਲ ਸਿਫ਼ਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਸਥਾਨ ਦਰਜ ਕਰੋ', ur: 'فصل کی تجاویز حاصل کرنے کے لیے مقام درج کریں', ne: 'बाली सिफारिसहरू प्राप्त गर्न स्थान प्रविष्ट गर्नुहोस्', es: 'Ingrese una ubicación para obtener recomendaciones de cultivos', fr: 'Entrez un emplacement pour obtenir des recommandations de cultures', ar: 'أدخل موقعًا للحصول على توصيات المحاصيل' },
  'Enter soil data to get specialized recommendations': { hi: 'विशेष सिफारिशें प्राप्त करने के लिए मिट्टी डेटा दर्ज करें', bn: 'বিশেষ সুপারিশ পেতে মাটি ডেটা লিখুন', te: 'ప్రత్యేక సిఫార్సులు పొందడానికి నేల డేటా నమోదు చేయండి', ta: 'சிறப்பு பரிந்துரைகளைப் பெற மண் தரவை உள்ளிடவும்', mr: 'विशेष शिफारशी मिळविण्यासाठी माती डेटा प्रविष्ट करा', gu: 'વિશેષ ભલામણો મેળવવા માટે માટી ડેટા દાખલ કરો', kn: 'ವಿಶೇಷ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಲು ಮಣ್ಣಿನ ಡೇಟಾವನ್ನು ನಮೂದಿಸಿ', ml: 'പ്രത്യേക ശുപാർശകൾ ലഭിക്കാൻ മണ്ണിന്റെ ഡാറ്റ നൽകുക', pa: 'ਵਿਸ਼ੇਸ਼ ਸਿਫ਼ਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਮਿੱਟੀ ਡੇਟਾ ਦਰਜ ਕਰੋ', ur: 'خصوصی تجاویز حاصل کرنے کے لیے مٹی کا ڈیٹا درج کریں', ne: 'विशेष सिफारिसहरू प्राप्त गर्न माटो डेटा प्रविष्ट गर्नुहोस्', es: 'Ingrese datos del suelo para obtener recomendaciones especializadas', fr: 'Entrez les données du sol pour obtenir des recommandations spécialisées', ar: 'أدخل بيانات التربة للحصول على توصيات متخصصة' },
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translationCache, setTranslationCache] = useState({});
  const [translationVersion, setTranslationVersion] = useState(0);
  const [apiCallCount, setApiCallCount] = useState(0);
  
  const requestQueue = useRef([]);
  const processingQueue = useRef(false);
  const lastRequestTime = useRef(0);
  const failedRequests = useRef(new Set());

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    const savedCache = localStorage.getItem('translationCache');
    const savedCount = localStorage.getItem('apiCallCount');
    const savedDate = localStorage.getItem('apiCallDate');
    
    if (savedLang && LANGUAGES.find(l => l.code === savedLang)) {
      setCurrentLanguage(savedLang);
    }
    
    if (savedCache) {
      try {
        setTranslationCache(JSON.parse(savedCache));
      } catch (e) {
        console.error('Cache load error:', e);
      }
    }

    const today = new Date().toDateString();
    if (savedDate !== today) {
      localStorage.setItem('apiCallDate', today);
      localStorage.setItem('apiCallCount', '0');
      setApiCallCount(0);
    } else if (savedCount) {
      setApiCallCount(parseInt(savedCount, 10));
    }
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (Object.keys(translationCache).length > 0) {
        try {
          localStorage.setItem('translationCache', JSON.stringify(translationCache));
          localStorage.setItem('apiCallCount', apiCallCount.toString());
        } catch (e) {
          console.error('Cache save error:', e);
        }
      }
    }, 15000);
    
    return () => clearInterval(saveInterval);
  }, [translationCache, apiCallCount]);

  const changeLanguage = useCallback((langCode) => {
    if (LANGUAGES.find(l => l.code === langCode)) {
      setCurrentLanguage(langCode);
      localStorage.setItem('appLanguage', langCode);
      setTranslationVersion(prev => prev + 1);
    }
  }, []);

  const getOfflineTranslation = useCallback((text, targetLang) => {
    const trimmedText = text.trim();
    if (OFFLINE_DICTIONARY[trimmedText] && OFFLINE_DICTIONARY[trimmedText][targetLang]) {
      return OFFLINE_DICTIONARY[trimmedText][targetLang];
    }
    return null;
  }, []);

  const translateWithLibreTranslate = async (text, targetLang) => {
    try {
      const url = 'https://libretranslate.com/translate';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.translatedText) {
        return data.translatedText;
      }
      
      throw new Error('Invalid LibreTranslate response');
    } catch (error) {
      console.warn('LibreTranslate translation failed:', error.message);
      return null;
    }
  };

  const processQueue = useCallback(async () => {
    if (processingQueue.current || requestQueue.current.length === 0) {
      return;
    }

    processingQueue.current = true;

    while (requestQueue.current.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;
      if (timeSinceLastRequest < 300) {
        await new Promise(resolve => setTimeout(resolve, 300 - timeSinceLastRequest));
      }

      const { text, targetLang, cacheKey, resolve } = requestQueue.current.shift();

      try {
        let translatedText = null;

        translatedText = getOfflineTranslation(text, targetLang);

        if (!translatedText) {
          translatedText = await translateWithLibreTranslate(text, targetLang);
        }

        if (translatedText) {
          setTranslationCache(prev => ({
            ...prev,
            [cacheKey]: translatedText,
          }));

          setTranslationVersion(prev => prev + 1);
          failedRequests.current.delete(cacheKey);

          resolve(translatedText);
        } else {
          failedRequests.current.add(cacheKey);
          resolve(text);
        }

        lastRequestTime.current = Date.now();
      } catch (error) {
        console.error('Translation error:', error);
        failedRequests.current.add(cacheKey);
        resolve(text);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    processingQueue.current = false;
  }, [getOfflineTranslation]);

  const queueTranslation = useCallback((text, targetLang, cacheKey) => {
    return new Promise((resolve) => {
      const existingIndex = requestQueue.current.findIndex(
        req => req.cacheKey === cacheKey
      );

      if (existingIndex !== -1) {
        return;
      }

      requestQueue.current.push({
        text,
        targetLang,
        cacheKey,
        resolve,
      });

      processQueue();
    });
  }, [processQueue]);

  const getTranslation = useCallback((text, targetLang = null) => {
    const target = targetLang || currentLanguage;
    
    if (target === 'en' || !text || text.trim() === '') {
      return text;
    }

    const cacheKey = `${text}_${target}`;
    
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    const offlineTranslation = getOfflineTranslation(text, target);
    if (offlineTranslation) {
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: offlineTranslation,
      }));
      return offlineTranslation;
    }
    
    if (!failedRequests.current.has(cacheKey)) {
      queueTranslation(text, target, cacheKey);
    }
    
    return text;
  }, [currentLanguage, translationCache, getOfflineTranslation, queueTranslation]);

  const preTranslateContent = async (content, targetLang = null) => {
    const target = targetLang || currentLanguage;
    if (target === 'en' || !content) return content;

    const translateValue = async (value) => {
      if (typeof value === 'string' && value.trim()) {
        const cacheKey = `${value}_${target}`;
        
        if (translationCache[cacheKey]) {
          return translationCache[cacheKey];
        }

        const offlineTranslation = getOfflineTranslation(value, target);
        if (offlineTranslation) {
          setTranslationCache(prev => ({
            ...prev,
            [cacheKey]: offlineTranslation,
          }));
          return offlineTranslation;
        }

        try {
          const translatedText = await translateWithLibreTranslate(value, target);

          if (translatedText) {
            setTranslationCache(prev => ({
              ...prev,
              [cacheKey]: translatedText,
            }));
            return translatedText;
          }
        } catch (error) {
          console.error('Translation error:', error);
        }
        
        return value;
      }
      return value;
    };

    if (Array.isArray(content)) {
      const translated = [];
      for (const item of content) {
        if (typeof item === 'object' && item !== null) {
          const translatedItem = {};
          for (const [key, val] of Object.entries(item)) {
            translatedItem[key] = await translateValue(val);
            await new Promise(resolve => setTimeout(resolve, 350));
          }
          translated.push(translatedItem);
        } else {
          translated.push(await translateValue(item));
        }
      }
      return translated;
    }

    if (typeof content === 'object' && content !== null) {
      const translated = {};
      for (const [key, val] of Object.entries(content)) {
        translated[key] = await translateValue(val);
        await new Promise(resolve => setTimeout(resolve, 350));
      }
      return translated;
    }

    return await translateValue(content);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    getTranslation,
    preTranslateContent,
    translationVersion,
    languages: LANGUAGES,
    apiCallCount,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export default LanguageContext;