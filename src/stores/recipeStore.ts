import { create } from 'zustand';
import type { Recipe, RecipeStore } from '../types/recipe';
import { calculateRecipeCosts, calculateYield } from '@/utils/recipe/costCalculator';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  isLoading: false,
  currentRecipe: null,

  createRecipe: async (recipeData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const recipe: Recipe = {
        ...recipeData,
        id: `recipe-${Date.now()}`,
        lastModified: new Date().toISOString(),
        createdBy: user.id,
        updatedBy: user.id,
        versions: [{
          version: '1.0.0',
          date: new Date().toISOString(),
          author: user.id,
          changes: ['Initial version']
        }],
        currentVersion: '1.0.0'
      };

      const { error } = await supabase
        .from('recipes')
        .insert([recipe]);

      if (error) throw error;

      set(state => ({
        recipes: [...state.recipes, recipe]
      }));
      
      toast.success('Recipe created successfully');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
      throw error;
    }
  },

  updateRecipe: async (id, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const currentRecipe = get().recipes.find(r => r.id === id);
      if (!currentRecipe) throw new Error('Recipe not found');

      // Create new version if significant changes
      const needsNewVersion = hasSignificantChanges(updates);
      const newVersion = needsNewVersion ? 
        incrementVersion(currentRecipe.currentVersion) : 
        currentRecipe.currentVersion;

      const updatedRecipe = {
        ...currentRecipe,
        ...updates,
        lastModified: new Date().toISOString(),
        updatedBy: user.id,
        currentVersion: newVersion
      };

      if (needsNewVersion) {
        updatedRecipe.versions = [
          ...currentRecipe.versions,
          {
            version: newVersion,
            date: new Date().toISOString(),
            author: user.id,
            changes: getChangesList(updates)
          }
        ];
      }

      const { error } = await supabase
        .from('recipes')
        .update(updatedRecipe)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        recipes: state.recipes.map(recipe => 
          recipe.id === id ? updatedRecipe : recipe
        )
      }));

      toast.success('Recipe updated successfully');
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id)
      }));

      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
      throw error;
    }
  },

  setCurrentRecipe: (recipe) => {
    set({ currentRecipe: recipe });
  },

  calculateCosts: (recipe) => {
    return calculateRecipeCosts(
      recipe,
      useMasterIngredientsStore.getState().ingredients,
      usePreparedItemsStore.getState().items
    );
  },

  filterRecipes: (type, searchTerm) => {
    const { recipes } = get();
    return recipes.filter(recipe => {
      const matchesType = recipe.type === type;
      const matchesSearch = 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  },

  seedFromPreparedItems: async (preparedItems) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const newRecipes = preparedItems.map(item => ({
        id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'prepared' as const,
        name: item.product,
        category: item.category,
        subCategory: item.subCategory,
        description: `${item.subCategory} - ${item.station}`,
        
        // Costing
        ingredients: [],
        recipeYield: {
          value: 1,
          unit: 'batch'
        },
        costPerUnit: item.costPerRecipeUnit,
        totalCost: item.finalCost,

        // Production
        prepTime: 0,
        cookTime: 0,
        equipment: [],
        steps: [],

        // Station Management
        primaryStation: item.station,
        secondaryStations: [],

        // Storage
        storage: {
          temperature: {
            min: 35,
            max: 40,
            unit: 'F'
          },
          container: item.container,
          containerType: item.containerType,
          fifoLabeling: {
            required: true
          }
        },

        // Training & Quality
        training: {
          skillLevel: 'beginner'
        },
        qualityControl: {},

        // Allergens
        allergens: Object.entries(item)
          .filter(([key, value]) => key.startsWith('allergen_') && value === true)
          .map(([key]) => key.replace('allergen_', '')),

        // Version Control
        versions: [{
          version: '1.0.0',
          date: new Date().toISOString(),
          author: user.id,
          changes: ['Initial version']
        }],
        currentVersion: '1.0.0',
        lastModified: new Date().toISOString(),
        createdBy: user.id,
        updatedBy: user.id
      }));

      const { error } = await supabase
        .from('recipes')
        .insert(newRecipes);

      if (error) throw error;

      set(state => ({
        recipes: [
          ...state.recipes.filter(r => r.type === 'final'),
          ...newRecipes
        ]
      }));

      toast.success(`Successfully created ${newRecipes.length} recipe templates from prepared items`);
    } catch (error) {
      console.error('Error seeding recipes:', error);
      toast.error('Failed to create recipes from prepared items');
      throw error;
    }
  }
}));

// Helper functions
function hasSignificantChanges(updates: Partial<Recipe>): boolean {
  const significantFields = [
    'ingredients',
    'steps',
    'equipment',
    'storage',
    'qualityControl',
    'allergens'
  ];
  return significantFields.some(field => field in updates);
}

function incrementVersion(version: string): string {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

function getChangesList(updates: Partial<Recipe>): string[] {
  const changes: string[] = [];
  if (updates.ingredients) changes.push('Updated ingredients');
  if (updates.steps) changes.push('Modified recipe steps');
  if (updates.equipment) changes.push('Updated equipment requirements');
  if (updates.storage) changes.push('Modified storage requirements');
  if (updates.qualityControl) changes.push('Updated quality control standards');
  if (updates.allergens) changes.push('Modified allergen information');
  return changes;
}