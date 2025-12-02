import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, Difficulty } from '../types';
import { Clock, Users, Flame, Heart, Share2 } from 'lucide-react';
import { generateDishImageUrl, getGenericFallbackUrl } from '../utils/imageUtils';

interface Props {
  recipe: Recipe;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

// A rock-solid, high-availability image of a Mexican food spread to use if EVERYTHING else fails.
// This guarantees "Real Food" is always shown, never text.
const EMERGENCY_FALLBACK_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";

const RecipeCard: React.FC<Props> = ({ recipe, onClick, onToggleFavorite }) => {
  // 0 = Primary AI Image
  // 1 = Semantic AI Fallback
  // 2 = Unsplash Category Fallback (Static)
  // 3 = Emergency Unsplash Fallback (Guaranteed)
  const [loadStage, setLoadStage] = useState(0);
  
  // Reset state if recipe changes
  useEffect(() => {
    setLoadStage(0);
  }, [recipe.id, recipe.image]);

  // Calculate the current image source based on load stage
  const currentImgSrc = useMemo(() => {
    if (loadStage === 0) {
      if (recipe.image && recipe.image.startsWith('http')) return recipe.image;
      return generateDishImageUrl(recipe.title, recipe.tags, 'card', false);
    } 
    if (loadStage === 1) {
      return generateDishImageUrl(recipe.title, recipe.tags, 'card', true);
    }
    if (loadStage === 2) {
      // Use the curated Unsplash list based on title hash
      return getGenericFallbackUrl(recipe.title);
    }
    // Stage 3+: Return the Emergency Image
    return EMERGENCY_FALLBACK_IMG;
  }, [recipe, loadStage]);

  const handleImgError = () => {
    // If we are already at the emergency stage and it fails (unlikely), 
    // we stop updating to prevent infinite loops, effectively leaving the broken image icon 
    // (or we could try a different emergency image, but this one is highly reliable).
    if (loadStage < 3) {
      setLoadStage(prev => prev + 1);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chef Rolando's ${recipe.title}`,
          text: `Check out this authentic recipe for ${recipe.title} in Rolando's Authentic Mexican Kitchen!`,
          url: window.location.href
        });
      } catch (err) {
        console.debug('Share cancelled');
      }
    } else {
      alert(`Share functionality is not supported on this device/browser.\n\nRecipe: ${recipe.title}`);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer relative h-full flex flex-col"
    >
      {/* Visual Header */}
      <div className="relative h-52 flex-shrink-0 overflow-hidden flex items-center justify-center bg-stone-100">
        <img 
          src={currentImgSrc} 
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={handleImgError}
        />
        
        {/* Floating Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-black/40 transition-colors shadow-sm active:scale-90"
            aria-label="Share recipe"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm active:scale-90 border ${
              recipe.isFavorite 
                ? 'bg-red-500/90 border-red-500 text-white' 
                : 'bg-black/20 border-white/20 text-white hover:bg-black/40'
            }`}
            aria-label={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={recipe.isFavorite ? "fill-current" : ""} size={18} />
          </button>
        </div>

        {/* Text Protection Gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-4 px-4">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md tracking-wide">
            {recipe.title}
          </h3>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div className="flex justify-between items-center text-xs text-stone-500 mb-3 font-medium">
          <span className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-md">
            <Clock size={14} className="text-amber-500" /> {recipe.prepTime + recipe.cookTime}m
          </span>
          <span className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-md">
            <Users size={14} className="text-amber-500" /> {recipe.servings}
          </span>
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md font-bold ${
            recipe.difficulty === Difficulty.Easy ? 'bg-green-100 text-green-700' :
            recipe.difficulty === Difficulty.Medium ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            <Flame size={14} /> {recipe.difficulty}
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full text-[10px] font-semibold border border-amber-100">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;