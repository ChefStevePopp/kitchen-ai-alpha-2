import type { Recipe, RecipeIngredient } from '@/types/recipe';
import type { MasterIngredient } from '@/types/master-ingredient';
import type { PreparedItem } from '@/types/prepared-items';

const LABOR_RATE_PER_HOUR = 30; // Default labor rate

export function calculateRecipeCosts(
  recipe: Recipe,
  masterIngredients: MasterIngredient[],
  preparedItems: PreparedItem[],
  laborRate: number = LABOR_RATE_PER_HOUR
) {
  // Calculate ingredient costs
  const ingredientCosts = recipe.ingredients.reduce((sum, ingredient) => {
    if (ingredient.type === 'raw') {
      // Look up cost from master ingredients
      const masterIngredient = masterIngredients.find(
        mi => mi.item_code === ingredient.id
      );
      
      if (!masterIngredient) return sum;
      return sum + (masterIngredient.cost_per_recipe_unit * parseFloat(ingredient.quantity));
    } else {
      // Look up cost from prepared items
      const preparedItem = preparedItems.find(
        pi => pi.id === ingredient.preparedItemId
      );
      
      if (!preparedItem) return sum;
      return sum + (preparedItem.cost_per_recipe_unit * parseFloat(ingredient.quantity));
    }
  }, 0);

  // Calculate labor cost
  const totalTime = (recipe.prepTime + recipe.cookTime) / 60; // Convert to hours
  const laborCost = totalTime * laborRate;

  // Calculate total cost
  const totalCost = ingredientCosts + laborCost;

  // Calculate cost per unit based on recipe yield
  const costPerUnit = totalCost / recipe.recipeYield.value;

  return {
    ingredientCosts,
    laborCost,
    totalCost,
    costPerUnit
  };
}

export function validateIngredientCosts(
  ingredients: RecipeIngredient[],
  masterIngredients: MasterIngredient[],
  preparedItems: PreparedItem[]
): string[] {
  const errors: string[] = [];

  ingredients.forEach((ingredient, index) => {
    if (ingredient.type === 'raw') {
      const masterIngredient = masterIngredients.find(
        mi => mi.item_code === ingredient.id
      );
      
      if (!masterIngredient) {
        errors.push(`Ingredient ${index + 1}: Master ingredient not found`);
      }
    } else {
      const preparedItem = preparedItems.find(
        pi => pi.id === ingredient.preparedItemId
      );
      
      if (!preparedItem) {
        errors.push(`Ingredient ${index + 1}: Prepared item not found`);
      }
    }

    // Validate quantity
    if (isNaN(parseFloat(ingredient.quantity)) || parseFloat(ingredient.quantity) <= 0) {
      errors.push(`Ingredient ${index + 1}: Invalid quantity`);
    }
  });

  return errors;
}

export function calculateYield(
  recipe: Recipe,
  masterIngredients: MasterIngredient[]
): number {
  // Calculate weighted average yield based on ingredient quantities
  const totalQuantity = recipe.ingredients.reduce((sum, ing) => {
    return sum + parseFloat(ing.quantity);
  }, 0);

  const weightedYield = recipe.ingredients.reduce((sum, ing) => {
    if (ing.type === 'raw') {
      const masterIng = masterIngredients.find(mi => mi.item_code === ing.id);
      if (!masterIng) return sum;

      const quantity = parseFloat(ing.quantity);
      return sum + ((masterIng.yield_percent / 100) * quantity);
    }
    return sum + parseFloat(ing.quantity);
  }, 0);

  return (weightedYield / totalQuantity) * 100;
}