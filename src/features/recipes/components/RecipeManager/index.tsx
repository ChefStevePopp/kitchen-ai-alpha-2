import React, { useState } from 'react';
import { ChefHat, Plus, Search, Upload, X } from 'lucide-react';
import { useRecipeStore } from '@/stores/recipeStore';
import { usePreparedItemsStore } from '@/stores/preparedItemsStore';
import { RecipeCard } from '../RecipeCard';
import { RecipeForm } from '../RecipeForm';
import type { Recipe } from '@/types/recipe';
import toast from 'react-hot-toast';

export const RecipeManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prepared' | 'final'>('prepared');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  
  const { recipes, filterRecipes, seedFromPreparedItems } = useRecipeStore();
  const { items: preparedItems, fetchItems } = usePreparedItemsStore();

  const handleManualSync = async () => {
    try {
      // First ensure we have latest prepared items
      await fetchItems();
      
      // Then sync to recipes
      await seedFromPreparedItems(preparedItems);
      
      toast.success('Successfully synced recipes from prepared items');
    } catch (error) {
      console.error('Error syncing recipes:', error);
      toast.error('Failed to sync recipes from prepared items');
    }
  };

  const filteredRecipes = filterRecipes(activeTab, searchTerm);

  const tabs = [
    {
      id: 'prepared' as const,
      label: 'Prepared Items',
      icon: ChefHat,
      color: 'primary'
    },
    {
      id: 'final' as const,
      label: 'Final Plates',
      icon: ChefHat,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Recipe Configuration</h1>
        <div className="flex gap-4">
          {activeTab === 'prepared' && (
            <button
              onClick={handleManualSync}
              className="btn-ghost"
            >
              <Upload className="w-5 h-5 mr-2" />
              Sync from Prepared Items
            </button>
          )}
          <button 
            className="btn-primary"
            onClick={() => setEditingRecipe({
              id: `new-${Date.now()}`,
              type: activeTab,
              name: '',
              category: '',
              subCategory: '',
              station: '',
              storageArea: '',
              container: '',
              containerType: '',
              shelfLife: '',
              description: '',
              prepTime: 0,
              cookTime: 0,
              recipeUnitRatio: '',
              unitType: '',
              costPerRatioUnit: 0,
              ingredients: [],
              instructions: [],
              notes: '',
              costPerServing: 0,
              lastUpdated: new Date().toISOString(),
              allergens: []
            })}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Recipe
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${tab.color} ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className={`w-5 h-5 ${
              activeTab === tab.id ? `text-${tab.color}-400` : 'text-current'
            }`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setEditingRecipe(recipe)}
          />
        ))}
      </div>

      {editingRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingRecipe.id.startsWith('new-') ? 'Create Recipe' : 'Edit Recipe'}
              </h2>
              <button 
                onClick={() => setEditingRecipe(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <RecipeForm
                initialData={editingRecipe}
                onSubmit={(data) => {
                  if (editingRecipe.id.startsWith('new-')) {
                    // Create new recipe
                    useRecipeStore.getState().createRecipe(data as Recipe);
                  } else {
                    // Update existing recipe
                    useRecipeStore.getState().updateRecipe(editingRecipe.id, data);
                  }
                  setEditingRecipe(null);
                }}
                onCancel={() => setEditingRecipe(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};