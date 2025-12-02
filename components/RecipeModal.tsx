import React from 'react';
import { Recipe } from '../types';
import { X, Clock, Users, ChefHat, Lightbulb } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<Props> = ({ recipe, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header Image */}
        <div className="relative h-64 sm:h-80">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{recipe.title}</h2>
            <p className="text-white/90 text-sm line-clamp-2">{recipe.description}</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats */}
          <div className="flex justify-around bg-amber-50 p-4 rounded-xl border border-amber-100">
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
                <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between items-center text-stone-600 border-b border-stone-100 pb-2 last:border-0">
                    <span>{ing.item}</span>
                    <span className="font-semibold text-amber-600">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Flavor Profile Chart */}
            <div className="h-64 bg-stone-50 rounded-2xl p-4 flex flex-col items-center justify-center">
              <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Flavor Profile</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={recipe.flavorProfile}>
                  <PolarGrid stroke="#e5e5e5" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#78716c', fontSize: 10 }} />
                  <Radar
                    name="Flavor"
                    dataKey="value"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cooking Tips */}
          {recipe.cookingTips && recipe.cookingTips.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-600" />
                Chef Rolando's Secret Tips
              </h3>
              <ul className="space-y-2">
                {recipe.cookingTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-stone-700 italic">
                    <span className="text-amber-500 font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
              Instructions
            </h3>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-stone-600 leading-relaxed mt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-stone-900 text-stone-300 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4">Nutritional Info <span className="text-xs font-normal text-stone-500">(per serving)</span></h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-500">{recipe.nutrition.calories}</div>
                <div className="text-xs">Calories</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{recipe.nutrition.protein}</div>
                <div className="text-xs">Protein</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{recipe.nutrition.carbs}</div>
                <div className="text-xs">Carbs</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{recipe.nutrition.fats}</div>
                <div className="text-xs">Fats</div>
              </div>
            </div>
          </div>
          
          <div className="h-8"></div> {/* Spacer for bottom nav */}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;