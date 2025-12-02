
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
  Master = 'Master'
}

export interface Ingredient {
  item: string;
  amount: string;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
}

export interface FlavorProfile {
  name: string;
  value: number; // 0-100
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  instructions: string[];
  cookingTips: string[];
  nutrition: Nutrition;
  tags: string[];
  flavorProfile: FlavorProfile[]; // For Recharts
  isFavorite?: boolean; // UI state
  
  // Vibe Coding & AI Metadata
  isAiGenerated?: boolean; // SynthID indicator
  originalRecipeId?: string; // If remix
  remixInstructions?: string; // The "Vibe Code" used
}

export type Tab = 'home' | 'search' | 'favorites' | 'profile';
