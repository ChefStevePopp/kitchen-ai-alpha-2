import { create } from 'zustand';
import type { Recipe, RecipeStore } from '../types';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import toast from 'react-hot-toast';

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  isLoading: false,
  currentRecipe: null,

  createRecipe: (recipeData) => {
    const recipe: Recipe = {
      ...recipeData,
      id: `recipe-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };

    const { totalCost, costPerServing } = get().calculateCosts(recipe);
    recipe.costPerRatioUnit = totalCost;
    recipe.costPerServing = costPerServing;

    set(state => ({
      recipes: [...state.recipes, recipe]
    }));
  },

  updateRecipe: (id, updates) => {
    set(state => ({
      recipes: state.recipes.map(recipe => {
        if (recipe.id !== id) return recipe;

        const updatedRecipe = {
          ...recipe,
          ...updates,
          lastUpdated: new Date().toISOString()
        };

        const { totalCost, costPerServing } = get().calculateCosts(updatedRecipe);
        return {
          ...updatedRecipe,
          costPerRatioUnit: totalCost,
          costPerServing
        };
      })
    }));
  },

  deleteRecipe: (id) => {
    set(state => ({
      recipes: state.recipes.filter(recipe => recipe.id !== id)
    }));
  },

  setCurrentRecipe: (recipe) => {
    set({ currentRecipe: recipe });
  },

  calculateCosts: (recipe) => {
    const masterIngredients = useMasterIngredientsStore.getState().ingredients;
    
    const totalCost = recipe.ingredients.reduce((sum, ingredient) => {
      const masterIngredient = masterIngredients.find(
        mi => mi.uniqueId === ingredient.id
      );
      
      if (!masterIngredient) return sum;

      const ingredientCost = masterIngredient.pricePerRatioUnit * parseFloat(ingredient.quantity);
      return sum + ingredientCost;
    }, 0);

    // Calculate cost per serving based on recipe unit ratio
    const recipeUnits = parseFloat(recipe.recipeUnitRatio) || 1;
    const costPerServing = totalCost / recipeUnits;

    return { totalCost, costPerServing };
  },

  filterRecipes: (type: 'prepared' | 'final', searchTerm: string) => {
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

  seedFromPreparedItems: (preparedItems) => {
    try {
      const recipes = preparedItems.map(item => ({
        id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'prepared' as const,
        name: item.product,
        category: item.category,
        subCategory: item.subCategory,
        station: item.station,
        storageArea: item.storageArea,
        container: item.container,
        containerType: item.containerType,
        shelfLife: item.shelfLife,
        description: `${item.subCategory} - ${item.station}`,
        prepTime: 0,
        cookTime: 0,
        recipeUnitRatio: item.recipeUnitRatio,
        unitType: item.unitType || 'unit',
        costPerRatioUnit: item.costPerRatioUnit,
        ingredients: [],
        instructions: [],
        notes: `Storage: ${item.container} (${item.containerType})
Shelf Life: ${item.shelfLife}`,
        costPerServing: item.finalCost,
        lastUpdated: new Date().toISOString(),
        allergens: item.allergens // Add allergens from prepared item
      }));

      set({ recipes });
      toast.success(`Successfully imported ${recipes.length} recipes from prepared items`);
    } catch (error) {
      console.error('Error seeding recipes:', error);
      toast.error('Failed to import recipes from prepared items');
    }
  }
}));