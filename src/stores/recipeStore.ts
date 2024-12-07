import { create } from 'zustand';
import type { Recipe, RecipeStore } from '../types/recipe';
import { useMasterIngredientsStore } from './masterIngredientsStore';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, updateRecipeIngredients } from '@/lib/db';
import toast from 'react-hot-toast';

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  isLoading: false,
  currentRecipe: null,

  fetchRecipes: async (organizationId: string) => {
    set({ isLoading: true });
    try {
      const recipes = await getRecipes(organizationId);
      set({ recipes });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      set({ isLoading: false });
    }
  },

  createRecipe: async (organizationId: string, recipeData) => {
    set({ isLoading: true });
    try {
      const recipe = await createRecipe(organizationId, recipeData);
      set(state => ({
        recipes: [...state.recipes, recipe]
      }));
      toast.success('Recipe created successfully');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRecipe: async (id, updates) => {
    set({ isLoading: true });
    try {
      const updatedRecipe = await updateRecipe(id, updates);
      if (updates.ingredients) {
        await updateRecipeIngredients(id, updates.ingredients);
      }
      set(state => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
        )
      }));
      toast.success('Recipe updated successfully');
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRecipe: async (id) => {
    set({ isLoading: true });
    try {
      await deleteRecipe(id);
      set(state => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id)
      }));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
      throw error;
    } finally {
      set({ isLoading: false });
    }
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
  }
}));