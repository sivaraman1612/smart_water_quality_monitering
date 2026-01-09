
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Compass, Search, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface MapPanelProps {
  center: { lat: number; lng: number };
  tanks: { name: string; lat: number; lng: number; status: string }[];
}

const MapPanel: React.FC<MapPanelProps> = ({ center, tanks }) => {
  const mapRef = useRef<any>(null);
  const leafletMap = useRef<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // State to hold grounding chunks for mandatory URL extraction and display
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);

  useEffect(() => {
    if (typeof (window as any).L === 'undefined') return;

    if (!leafletMap.current) {
      leafletMap.current = (window as any).L.map('leaflet-map-container').setView([center.lat, center.lng], 12);
      (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);
    } else {
      leafletMap.current.setView([center.lat, center.lng]);
    }

    // Add Markers
    tanks.forEach(tank => {
      (window as any).L.marker([tank.lat, tank.lng])
        .addTo(leafletMap.current)
        .bindPopup(`<b>${tank.name}</b><br>Status: ${tank.status}`);
    });

    return () => {
      // Clean up if needed, though usually Leaflet is fine
    };
  }, [center, tanks]);

  const askGeminiAboutNearby = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setGroundingChunks([]); // Reset previous grounding info
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am currently at latitude ${center.lat}, longitude ${center.lng}. 
        Find and suggest at least 3 prominent public water tanks, lakes, or reservoirs near this location in Tamil Nadu. 
        Explain why they are significant and mention their general capacity if possible. 
        Also, give me the Google Maps link for each.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      setAiAnalysis(response.text);
      
      // Mandatory extraction of website URLs from groundingChunks as per Google Search grounding guidelines
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setGroundingChunks(response.candidates[0].groundingMetadata.groundingChunks);
      }
    } catch (err) {
      console.error(err);
      setAiAnalysis("AI Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3.5rem] shadow-xl border border-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-sky-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-100">
              <Compass className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Geospatial Explorer</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leaflet Interactive Map Engine</p>
            </div>
          </div>
          <button
            onClick={askGeminiAboutNearby}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>AI Search Nearby</span>
          </button>
        </div>

        <div id="leaflet-map-container" className="shadow-inner border border-slate-100" />

        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-8 bg-sky-50 rounded-[2.5rem] border border-sky-100 space-y-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <h4 className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Gemini AI Grounding Report</h4>
            </div>
            <div className="text-slate-700 text-sm font-medium leading-relaxed prose prose-sky max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{aiAnalysis}</pre>
            </div>

            {/* Displaying extracted search grounding URLs as per mandatory guidelines */}
            {groundingChunks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-sky-200">
                <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Verified Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {groundingChunks.map((chunk, idx) => chunk.web && (
                    <a 
                      key={idx} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-sky-700 hover:text-sky-900 hover:underline bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-sm transition-all"
                    >
                      {chunk.web.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {isAnalyzing && (
          <div className="mt-8 p-12 bg-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 animate-pulse">
            <Sparkles className="w-10 h-10 text-sky-300 animate-spin" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Connecting to Gemini Brain...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPanel;
