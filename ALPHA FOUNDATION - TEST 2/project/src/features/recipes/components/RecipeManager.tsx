import React from 'react';
import { ChefHat, Plus } from 'lucide-react';

export const RecipeManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Recipe Manager</h1>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          New Recipe
        </button>
      </header>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recipe Library</h2>
        {/* Recipe content */}
      </div>
    </div>
  );
};