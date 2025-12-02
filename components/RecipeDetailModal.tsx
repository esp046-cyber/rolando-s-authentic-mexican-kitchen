import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, Difficulty } from '../types';
import { X, Clock, Users, ChefHat, Lightbulb, Share2, Wand2, Sparkles } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { remixRecipeWithAI } from '../services/geminiService';
import { generateDishImageUrl, getGenericFallbackUrl } from '../utils/imageUtils';

interface Props {
  recipe: Recipe;
  onClose: () => void;
  onUpdateRecipe?: (newRecipe: Recipe) => void; 
}

// Emergency fallback if even the static list fails (unlikely)
const EMERGENCY_MODAL_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";

const RecipeDetailModal: React.FC<Props> = ({ recipe, onClose, onUpdateRecipe }) => {
  const [vibeCodeInput, setVibeCodeInput] = useState('');
  const [isRemixing, setIsRemixing] = useState(false);
  
  // Image State: 0 = Primary, 1 = Fallback (Unsplash), 2 = Emergency
  const [imgLoadStage, setImgLoadStage] = useState(0);

  useEffect(() => {
    setImgLoadStage(0);
  }, [recipe.id, recipe.image]);

  // Determine Image Source
  const displayImage = useMemo(() => {
    if (imgLoadStage === 0) {
      if (recipe.image && recipe.image.startsWith('http')) return recipe.image;
      return generateDishImageUrl(recipe.title, recipe.tags, 'modal');
    }
    if (imgLoadStage === 1) {
      return getGenericFallbackUrl(recipe.title);
    }
    return EMERGENCY_MODAL_IMG;
  }, [recipe, imgLoadStage]);

  const handleImgError = () => {
    if (imgLoadStage < 2) {
      setImgLoadStage(prev => prev + 1);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chef Rolando's ${recipe.title}`,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href
        });
      } catch (err) { console.debug('Share cancelled'); }
    } else {
      alert("Share not supported");
    }
  };

  const handleRemix = async () => {
    if (!vibeCodeInput.trim() || !onUpdateRecipe) return;
    
    setIsRemixing(true);
    try {
      const remixedRecipe = await remixRecipeWithAI(recipe, vibeCodeInput);
      onUpdateRecipe(remixedRecipe);
      onClose(); 
    } catch (e) {
      alert("Lo siento, I could not remix this recipe right now.");
    } finally {
      setIsRemixing(false);
    }
  };

  // Fallback gradient for loading state
  const getFallbackGradient = () => {
    switch (recipe.difficulty) {
      case Difficulty.Easy: return "bg-gradient-to-br from-green-400 to-emerald-600";
      case Difficulty.Medium: return "bg-gradient-to-br from-amber-400 to-orange-600";
      case Difficulty.Hard: 
      case Difficulty.Master: return "bg-gradient-to-br from-red-500 to-rose-700";
      default: return "bg-stone-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 scroll-smooth no-scrollbar">
        
        {/* Header Image */}
        <div className={`relative h-64 sm:h-80 group ${imgLoadStage > 0 ? 'bg-stone-200' : getFallbackGradient()}`}>
          <img 
            src={displayImage} 
            alt={recipe.title} 
            className="w-full h-full object-cover transition-opacity duration-300" 
            loading="lazy"
            onError={handleImgError}
          />
          
          {recipe.isAiGenerated && imgLoadStage === 0 && (
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white/80 border border-white/10 flex items-center gap-1" title="SynthID Content Credentials">
               <Sparkles size={10} className="text-purple-400" /> AI Generated Content
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-3 z-20">
            <button onClick={handleShare} className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors">
              <Share2 size={24} />
            </button>
            <button onClick={onClose} className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{recipe.title}</h2>
            <p className="text-white/90 text-sm line-clamp-2 font-medium">{recipe.description}</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Vibe Coding / Remix Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-amber-100 opacity-50"><Wand2 size={100} /></div>
            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2 mb-2 relative z-10">
              <Sparkles size={16} /> Vibe Coding (Remix Recipe)
            </h3>
            <div className="flex gap-2 relative z-10">
              <input 
                value={vibeCodeInput}
                onChange={(e) => setVibeCodeInput(e.target.value)}
                placeholder='e.g., "Make it vegan", "Add mango", "Make it extremely spicy"'
                className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={isRemixing}
              />
              <button 
                onClick={handleRemix}
                disabled={isRemixing || !vibeCodeInput.trim()}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-amber-600 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
              >
                {isRemixing ? (
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                   <Wand2 size={16} />
                )}
                Remix
              </button>
            </div>
            {recipe.remixInstructions && (
               <p className="text-xs text-amber-600/80 mt-2 italic">
                 Remixed from original: "{recipe.remixInstructions}"
               </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-around bg-stone-50 p-4 rounded-xl border border-stone-100">
            <div className="text-center">
              <div className="flex justify-center text-amber-600 mb-1"><Clock size={20} /></div>
              <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Time</div>
              <div className="font-semibold text-stone-800">{recipe.prepTime + recipe.cookTime}m</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-amber-600 mb-1"><Users size={20} /></div>
              <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Serves</div>
              <div className="font-semibold text-stone-800">{recipe.servings}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center text-amber-600 mb-1"><ChefHat size={20} /></div>
              <div className="text-xs text-stone-500 uppercase font-bold tracking-wider">Level</div>
              <div className="font-semibold text-stone-800">{recipe.difficulty}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between items-center text-stone-600 border-b border-stone-100 pb-2 last:border-0 hover:bg-stone-50 transition-colors px-2 rounded-lg">
                    <span className="font-medium">{ing.item}</span>
                    <span className="font-bold text-amber-600 text-sm">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Flavor Profile Chart */}
            <div className="h-64 bg-stone-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-stone-100">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Flavor Profile</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={recipe.flavorProfile}>
                  <PolarGrid stroke="#e5e5e5" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#78716c', fontSize: 11, fontWeight: 500 }} />
                  <Radar name="Flavor" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cooking Tips */}
          {recipe.cookingTips && recipe.cookingTips.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ChefHat size={100} className="text-amber-500" />
               </div>
              <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2 relative z-10">
                <Lightbulb size={20} className="text-amber-600" />
                Chef Rolando's Secret Tips
              </h3>
              <ul className="space-y-2 relative z-10">
                {recipe.cookingTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-stone-700 italic">
                    <span className="text-amber-500 font-bold text-lg leading-none">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              Instructions
            </h3>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm ring-1 ring-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-stone-600 leading-relaxed mt-1 group-hover:text-stone-900 transition-colors">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-stone-900 text-stone-300 rounded-2xl p-6 shadow-lg">
            <h4 className="text-white font-bold mb-4 flex items-center justify-between">
              Nutritional Info 
              <span className="text-xs font-normal text-stone-500 bg-stone-800 px-2 py-1 rounded-full">per serving</span>
            </h4>
            <div className="grid grid-cols-4 gap-4 text-center divide-x divide-stone-800">
              <div className="px-1"><div className="text-2xl font-bold text-amber-500">{recipe.nutrition.calories}</div><div className="text-[10px] uppercase tracking-wider mt-1">Calories</div></div>
              <div className="px-1"><div className="text-lg font-bold text-white">{recipe.nutrition.protein}</div><div className="text-[10px] uppercase tracking-wider mt-1">Protein</div></div>
              <div className="px-1"><div className="text-lg font-bold text-white">{recipe.nutrition.carbs}</div><div className="text-[10px] uppercase tracking-wider mt-1">Carbs</div></div>
              <div className="px-1"><div className="text-lg font-bold text-white">{recipe.nutrition.fats}</div><div className="text-[10px] uppercase tracking-wider mt-1">Fats</div></div>
            </div>
          </div>
          
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;