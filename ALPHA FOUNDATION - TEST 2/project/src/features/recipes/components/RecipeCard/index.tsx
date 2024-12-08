import React from 'react';
import { Clock, Scale, DollarSign } from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  className?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, className = '' }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-200 
                 shadow-lg hover:shadow-xl relative group overflow-hidden border border-gray-700/50 ${className}`}
    >
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/50 to-transparent z-10" />
        <img
          src={recipe.imageUrl || "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=2000&q=80"}
          alt={recipe.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {recipe.name}
          </h3>
          <p className="text-sm text-gray-300 mt-1">{recipe.description}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Prep: {recipe.prepTime} mins</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Scale className="w-4 h-4" />
            <span>Yield: {recipe.recipeUnitRatio}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span>Cost/Unit: {formatCurrency(recipe.costPerRatioUnit)}</span>
          </div>
          <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-xs">
            {recipe.category}
          </span>
        </div>
      </div>
    </button>
  );
};