import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Recipe, Tab, Difficulty } from './types';
import { getRecipes } from './services/recipeService';
import { askChefRolando, ChatMessage } from './services/geminiService';
import RecipeCard from './components/RecipeCard';
import RecipeDetailModal from './components/RecipeDetailModal';
import Navbar from './components/Navbar';
import Header from './components/Header';
import { PLACEHOLDER_AVATAR } from './constants';
import { MessageCircle, Send, X, Loader2, AlertTriangle, Filter } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter State
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'ALL'>('ALL');
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hola! I am Chef Rolando. Ask me anything about authentic Mexican cuisine!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const allRecipes = getRecipes();
        
        if (!allRecipes || allRecipes.length === 0) {
          throw new Error("No recipes generated.");
        }

        // Safely load favorites
        let favSet = new Set<string>();
        try {
          const savedFavs = localStorage.getItem('rolando-favorites');
          if (savedFavs) {
            favSet = new Set(JSON.parse(savedFavs) as string[]);
          }
        } catch (e) {
          console.warn("Failed to parse favorites from localStorage", e);
        }
        setFavorites(favSet);

        const hydratedRecipes = allRecipes.map(r => ({
          ...r,
          isFavorite: favSet.has(r.id)
        }));
        setRecipes(hydratedRecipes);
      } catch (err) {
        console.error("Failed to load recipes", err);
        setError("Failed to load kitchen data.");
      } finally {
        setIsAppLoading(false);
      }
    };
    
    // Small delay to ensure DOM is ready
    setTimeout(loadData, 50);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) {
      newFavs.delete(id);
    } else {
      newFavs.add(id);
    }
    setFavorites(newFavs);
    localStorage.setItem('rolando-favorites', JSON.stringify(Array.from(newFavs)));
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  // Vibe Coding: Handle the newly generated recipe
  const handleRecipeRemix = (remixedRecipe: Recipe) => {
    setRecipes(prev => [remixedRecipe, ...prev]); // Add to top
    setSelectedRecipe(remixedRecipe); // Open it immediately
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const response = await askChefRolando(userMsg);
    
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsChatLoading(false);
  };

  const filteredRecipes = useMemo(() => {
    let list = recipes;
    
    // 1. Filter by Tab
    if (activeTab === 'favorites') {
      list = list.filter(r => r.isFavorite);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim() || activeTab === 'search') {
      const q = searchQuery.toLowerCase();
      // Handle comma separated search from Visual Search
      const searchTerms = q.split(',').map(s => s.trim()).filter(Boolean);
      
      list = list.filter(r => {
        if (searchTerms.length > 0) {
           // If any search term matches title or tags
           return searchTerms.some(term => 
             r.title.toLowerCase().includes(term) || 
             r.tags.some(t => t.toLowerCase().includes(term))
           );
        }
        return true;
      });
    }

    // 3. Filter by Difficulty
    if (difficultyFilter !== 'ALL') {
      list = list.filter(r => r.difficulty === difficultyFilter);
    }

    return list;
  }, [recipes, searchQuery, activeTab, difficultyFilter]);

  if (isAppLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rolando-bg text-amber-600 gap-4">
        <Loader2 size={48} className="animate-spin" />
        <h2 className="text-xl font-bold">Preparing Kitchen...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rolando-bg text-stone-600 gap-4 p-4 text-center">
        <AlertTriangle size={48} className="text-red-500" />
        <h2 className="text-xl font-bold text-stone-800">Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-amber-500 text-white rounded-lg">
          Reload Kitchen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-rolando-bg">
      <Header activeTab={activeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="px-4 py-6 max-w-4xl mx-auto">
        {activeTab === 'profile' ? (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-stone-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-xl">
               <img src={PLACEHOLDER_AVATAR} alt="Chef Rolando" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800">Chef Rolando</h2>
            <p className="text-stone-500 mb-6">Michelin Star • Oaxaca • Mexico City</p>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-left space-y-4">
              <p>Hola! Welcome to my digital kitchen. I have curated 200 of my most treasured recipes.</p>
              
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
              >
                <MessageCircle size={20} />
                Chat with Chef Rolando
              </button>

              <div className="pt-4 border-t border-stone-100">
                <h3 className="font-bold mb-2">App Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-amber-600">{recipes.length}</span>
                    <span className="text-xs text-stone-500">Recipes</span>
                  </div>
                   <div className="bg-pink-50 p-3 rounded-lg text-center">
                    <span className="block text-2xl font-bold text-pink-600">{favorites.size}</span>
                    <span className="text-xs text-stone-500">Favorites</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-800">
                {activeTab === 'favorites' ? 'Your Favorites' : 'Menu Selection'}
              </h2>
              <span className="text-xs text-stone-500 bg-white px-2 py-1 rounded-full shadow-sm">
                {filteredRecipes.length} dishes
              </span>
            </div>

            {/* Difficulty Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
              <button
                onClick={() => setDifficultyFilter('ALL')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1 ${
                  difficultyFilter === 'ALL'
                    ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-amber-300'
                }`}
              >
                <Filter size={12} /> All Levels
              </button>
              {Object.values(Difficulty).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                    difficultyFilter === level
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onClick={() => setSelectedRecipe(recipe)}
                  onToggleFavorite={(e) => toggleFavorite(e, recipe.id)}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-20 text-stone-400">
                <p>No recipes found matching your criteria.</p>
                {activeTab === 'favorites' && <p className="text-sm mt-2">Go to Home to like some dishes!</p>}
                {difficultyFilter !== 'ALL' && <button onClick={() => setDifficultyFilter('ALL')} className="text-amber-500 text-sm mt-2 underline">Clear Filters</button>}
              </div>
            )}
          </>
        )}
      </main>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsChatOpen(false)} />
          <div className="bg-white w-full max-w-md h-[600px] rounded-2xl relative z-10 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-amber-500 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <MessageCircle size={18} /> Chat with Rolando
              </h3>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-amber-500 text-white rounded-br-none' 
                      : 'bg-white text-stone-800 shadow-sm border border-stone-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-stone-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-stone-200 bg-white flex gap-2">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about tacos..."
                className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          onUpdateRecipe={handleRecipeRemix}
        />
      )}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;