
import React, { useRef, useState } from 'react';
import { Search, Camera, Loader2, Sparkles, X } from 'lucide-react';
import { processImageForAI } from '../utils/imageUtils';
import { analyzeImageForSearch } from '../services/geminiService';

interface Props {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<Props> = ({ activeTab, searchQuery, setSearchQuery }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimisticPreview, setOptimisticPreview] = useState<string | null>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setOptimisticPreview(null);
    setSearchQuery('');
  };

  // Adaptive Upload Strategy with Optimistic UI
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      
      // 1. OPTIMISTIC UI: Immediately show the selected image
      // We use a raw blob URL first for zero-latency feedback
      const rawPreview = URL.createObjectURL(file);
      setOptimisticPreview(rawPreview);
      
      // 2. Set Search Bar to "Loading" state
      setSearchQuery("Analyzing ingredients...");

      // 3. Process Image (Client-side WebP conversion + Token Tiling/Scaling)
      // This happens in the background while the UI is already updated
      const processed = await processImageForAI(file);

      // 4. Send optimized base64 to Gemini
      // The imageUtils ensures we are sending a token-efficient payload
      const keywords = await analyzeImageForSearch(processed.base64);
      
      // 5. IMMEDIATE UPDATE: Replace "Analyzing..." with actual results
      if (keywords) {
        setSearchQuery(keywords);
      } else {
        setSearchQuery("No food identified");
      }

    } catch (err) {
      console.error("Visual search failed", err);
      setSearchQuery("Error analyzing image");
    } finally {
      setIsAnalyzing(false);
      // We keep the preview visible for a moment so the user sees what was analyzed,
      // then give them a way to clear it via the X button.
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm transition-all duration-300 border-b border-stone-100">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">
            Rolando's <span className="text-amber-500">Kitchen</span>
          </h1>
          <p className="text-xs text-stone-500">Authentic Mexican Cuisine</p>
        </div>
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-amber-100">
          R
        </div>
      </div>
      
      {/* Search Bar */}
      {(activeTab === 'search' || activeTab === 'home') && (
        <div className="max-w-4xl mx-auto mt-4 relative animate-in fade-in slide-in-from-top-2 duration-300">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isAnalyzing ? 'text-amber-500' : 'text-stone-400'}`} size={18} />
          
          <input 
            type="text"
            placeholder="Search mole, tacos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isAnalyzing}
            className={`w-full bg-stone-100 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-stone-400 ${isAnalyzing ? 'animate-pulse bg-amber-50' : ''}`}
          />

          {/* Visual Search Button */}
          <button 
            onClick={handleCameraClick}
            disabled={isAnalyzing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm hover:bg-amber-50 text-stone-500 hover:text-amber-600 transition-colors border border-stone-200"
            aria-label="Visual Search"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin text-amber-500"/> : <Camera size={18} />}
          </button>
          
          {/* Hidden File Input for Adaptive Upload */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Optimistic Preview Badge with Scanning Overlay */}
      {optimisticPreview && (
        <div className="max-w-4xl mx-auto mt-3 flex items-center justify-between bg-stone-50 p-2 rounded-xl border border-stone-100 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200">
               <img 
                 src={optimisticPreview} 
                 className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? 'scale-110 blur-[1px]' : 'scale-100'}`} 
                 alt="Visual Search Preview"
               />
               
               {/* Scanning Overlay Effect */}
               {isAnalyzing && (
                 <div className="absolute inset-0 bg-amber-500/20 z-10">
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-amber-400/50 animate-scan"></div>
                 </div>
               )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                {isAnalyzing ? (
                  <>Processing <Loader2 size={10} className="animate-spin" /></>
                ) : (
                  <>Identified <Sparkles size={10} className="text-amber-500" /></>
                )}
              </span>
              <span className="text-[10px] text-stone-500 max-w-[200px] truncate">
                {isAnalyzing ? "Analyzing ingredients..." : "Search updated"}
              </span>
            </div>
          </div>
          
          <button 
            onClick={clearPreview}
            className="p-2 text-stone-400 hover:text-stone-600"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
