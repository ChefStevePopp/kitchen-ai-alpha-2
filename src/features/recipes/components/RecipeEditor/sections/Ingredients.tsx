import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import { usePreparedItemsStore } from '@/stores/preparedItemsStore';
import type { Recipe, RecipeIngredient } from '@/types/recipe';

interface IngredientsProps {
  data: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const Ingredients: React.FC<IngredientsProps> = ({ data, onChange }) => {
  const { ingredients: masterIngredients } = useMasterIngredientsStore();
  const { items: preparedItems } = usePreparedItemsStore();

  const handleIngredientChange = (index: number, updates: Partial<RecipeIngredient>) => {
    const newIngredients = [...data.ingredients];
    newIngredients[index] = { ...newIngredients[index], ...updates };

    // Update cost based on ingredient type
    if (updates.type === 'raw' && updates.id) {
      const masterIngredient = masterIngredients.find(mi => mi.item_code === updates.id);
      if (masterIngredient) {
        newIngredients[index].cost = masterIngredient.cost_per_recipe_unit;
      }
    } else if (updates.type === 'prepared' && updates.preparedItemId) {
      const preparedItem = preparedItems.find(pi => pi.id === updates.preparedItemId);
      if (preparedItem) {
        newIngredients[index].cost = preparedItem.cost_per_recipe_unit;
      }
    }

    onChange({ ingredients: newIngredients });
  };

  const addIngredient = () => {
    onChange({
      ingredients: [
        ...data.ingredients,
        {
          id: `ing-${Date.now()}`,
          type: 'raw',
          name: '',
          quantity: '0',
          unit: 'g',
          notes: '',
          cost: 0
        }
      ]
    });
  };

  const removeIngredient = (index: number) => {
    onChange({
      ingredients: data.ingredients.filter((_, i) => i !== index)
    });
  };

  const moveIngredient = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.ingredients.length) return;

    const newIngredients = [...data.ingredients];
    [newIngredients[index], newIngredients[newIndex]] = 
    [newIngredients[newIndex], newIngredients[index]];

    onChange({ ingredients: newIngredients });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Ingredients</h3>
        <button
          onClick={addIngredient}
          className="btn-ghost"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Ingredient
        </button>
      </div>

      <div className="space-y-4">
        {data.ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="grid grid-cols-6 gap-4 bg-gray-800/50 p-4 rounded-lg"
          >
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Ingredient Type
              </label>
              <select
                value={ingredient.type}
                onChange={(e) => handleIngredientChange(index, { 
                  type: e.target.value as 'raw' | 'prepared',
                  id: '', // Reset ID when changing type
                  preparedItemId: undefined
                })}
                className="input w-full"
                required
              >
                <option value="raw">Raw Ingredient</option>
                <option value="prepared">Prepared Item</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {ingredient.type === 'raw' ? 'Master Ingredient' : 'Prepared Item'}
              </label>
              <select
                value={ingredient.type === 'raw' ? ingredient.id : ingredient.preparedItemId}
                onChange={(e) => handleIngredientChange(index, 
                  ingredient.type === 'raw' 
                    ? { id: e.target.value }
                    : { preparedItemId: e.target.value }
                )}
                className="input w-full"
                required
              >
                <option value="">Select...</option>
                {ingredient.type === 'raw' 
                  ? masterIngredients.map(mi => (
                      <option key={mi.item_code} value={mi.item_code}>
                        {mi.product}
                      </option>
                    ))
                  : preparedItems.map(pi => (
                      <option key={pi.id} value={pi.id}>
                        {pi.product}
                      </option>
                    ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, { quantity: e.target.value })}
                className="input w-full"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Unit
              </label>
              <select
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, { unit: e.target.value })}
                className="input w-full"
                required
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="l">Liters (l)</option>
                <option value="unit">Units</option>
                <option value="tbsp">Tablespoon</option>
                <option value="tsp">Teaspoon</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              {index > 0 && (
                <button
                  onClick={() => moveIngredient(index, 'up')}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
              {index < data.ingredients.length - 1 && (
                <button
                  onClick={() => moveIngredient(index, 'down')}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => removeIngredient(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```