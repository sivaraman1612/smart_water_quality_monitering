
import { Language, TranslationSchema, SafetyLevel } from './types';

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en: {
    title: "Smart Water Quality Monitoring",
    subtitle: "Real-time surveillance & disease risk forecasting",
    loginAs: "Access Role",
    admin: "Smart User",
    user: "Standard User",
    selectDistrict: "Select District",
    selectSource: "Select Water Source",
    safetyStatus: "Water Safety Status",
    safe: "SAFE",
    lowRisk: "LOW RISK",
    highRisk: "HIGH RISK",
    critical: "CRITICAL",
    lastUpdated: "Last Updated",
    params: {
      ph: "pH Level",
      temp: "Temperature (°C)",
      turbidity: "Turbidity (NTU)",
      tds: "TDS (ppm)"
    },
    aiPrediction: "AI Disease Risk Prediction",
    possibleDiseases: "Predicted Water-borne Diseases",
    recommendations: "Action Recommended",
    nearestTanks: "Nearest Water Tanks",
    distance: "Distance",
    updateData: "Update Parameters",
    manualEntry: "Manual Entry",
    iotConnection: "IoT Device Management",
    connectIot: "Connect Personal ESP32 Kit",
    disclaimer: "This system predicts water quality risk based on sensor indicators and does not replace laboratory testing.",
    confidence: "Confidence Level"
  },
  ta: {
    title: "ஸ்மார்ட் குடிநீர் தர கண்காணிப்பு",
    subtitle: "நிகழ்நேர கண்காணிப்பு மற்றும் நோய் அபாய கணிப்பு",
    loginAs: "அணுகல் பங்கு",
    admin: "ஸ்மார்ட் பயனர்",
    user: "நிலையான பயனர்",
    selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    selectSource: "நீர் ஆதாரத்தைத் தேர்ந்தெடுக்கவும்",
    safetyStatus: "நீர் பாதுகாப்பு நிலை",
    safe: "பாதுகாப்பானது",
    lowRisk: "குறைந்த ஆபத்து",
    highRisk: "அதிக ஆபத்து",
    critical: "மிகவும் ஆபத்தானது",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    params: {
      ph: "pH அளவு",
      temp: "வெப்பநிலை (°C)",
      turbidity: "கலங்கல் (NTU)",
      tds: "TDS (ppm)"
    },
    aiPrediction: "AI நோய் அபாய கணிப்பு",
    possibleDiseases: "கணிக்கப்பட்ட நோய்கள்",
    recommendations: "பரிந்துரைக்கப்பட்ட நடவடிக்கை",
    nearestTanks: "அருகிலுள்ள நீர் தொட்டிகள்",
    distance: "தூரம்",
    updateData: "தரவைப் புதுப்பிக்கவும்",
    manualEntry: "கைமுறை பதிவு",
    iotConnection: "IoT சாதன மேலாண்மை",
    connectIot: "தனிப்பட்ட IoT கருவியை இணைக்கவும்",
    disclaimer: "இந்த அமைப்பு உணரி குறிகாட்டிகளின் அடிப்படையில் நீர் தர அபாயத்தைக் கணிக்கும், இது ஆய்வக சோதனையை மாற்றாது.",
    confidence: "நம்பிக்கை நிலை"
  },
  hi: {
    title: "स्मार्ट जल गुणवत्ता निगरानी",
    subtitle: "वास्तविक समय निगरानी और रोग जोखिम भविष्यवाणी",
    loginAs: "एक्सेस भूमिका",
    admin: "स्मार्ट उपयोगकर्ता",
    user: "मानक उपयोगकर्ता",
    selectDistrict: "जिला चुनें",
    selectSource: "जल स्रोत चुनें",
    safetyStatus: "जल सुरक्षा स्थिति",
    safe: "सुरक्षित",
    lowRisk: "कम जोखिम",
    highRisk: "उच्च जोखिम",
    critical: "गंभीर",
    lastUpdated: "अंतिम अपडेट",
    params: {
      ph: "pH स्तर",
      temp: "तापमान (°C)",
      turbidity: "मैलापन (NTU)",
      tds: "TDS (ppm)"
    },
    aiPrediction: "AI रोग जोखिम भविष्यवाणी",
    possibleDiseases: "संभावित जलजनित रोग",
    recommendations: "अनुशंसित कार्रवाई",
    nearestTanks: "निकटतम पानी की टंकियां",
    distance: "दूरी",
    updateData: "पैरामीटर अपडेट करें",
    manualEntry: "मैनुअल प्रविष्टि",
    iotConnection: "IoT डिवाइस प्रबंधन",
    connectIot: "व्यक्तिगत IoT किट कनेक्ट करें",
    disclaimer: "यह प्रणाली सेंसर संकेतकों के आधार पर जल गुणवत्ता जोखिम की भविष्यवाणी करती है और प्रयोगशाला परीक्षण का स्थान नहीं लेती है।",
    confidence: "विश्वास स्तर"
  }
};

export const TAMIL_NADU_DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Salem", "Trichy", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Nagercoil"
];

export const WATER_SOURCES_BY_DISTRICT: Record<string, string[]> = {
  "Salem": ["Mettur Dam", "Yercaud Lake", "Thirumanimutharu River"],
  "Chennai": ["Red Hills Lake", "Chembarambakkam Lake", "Poondi Reservoir"],
  "Coimbatore": ["Siruvani Dam", "Pillur Dam", "Aliyar Dam"],
  "Madurai": ["Vaigai Dam", "Periyar River"],
  "Erode": ["Bhavanisagar Dam", "Cauvery River"]
};

export const INITIAL_WATER_DATA: Record<string, any> = {
  "Mettur Dam": {
    ph: 7.2,
    temp: 28,
    turbidity: 3.5,
    tds: 180,
    lastUpdated: new Date().toLocaleTimeString(),
    sourceType: 'IOT',
    location: { lat: 11.7853, lng: 77.8016 }
  },
  "Red Hills Lake": {
    ph: 7.0,
    temp: 29,
    turbidity: 2.1,
    tds: 210,
    lastUpdated: new Date().toLocaleTimeString(),
    sourceType: 'IOT',
    location: { lat: 13.1866, lng: 80.1706 }
  }
};
