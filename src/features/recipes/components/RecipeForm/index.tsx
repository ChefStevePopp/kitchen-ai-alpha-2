import React, { useState } from 'react';
import { Plus, Trash2, Camera, Upload, Save, X } from 'lucide-react';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import { usePreparedItemsStore } from '@/stores/preparedItemsStore';
import type { Recipe, RecipeIngredient } from '@/types/recipe';

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: Partial<Recipe>) => void;
  onCancel: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Recipe>>(initialData || {
    name: '',
    type: 'prepared',
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
    ingredients: [],
    instructions: [],
    notes: '',
    allergens: []
  });

  const { ingredients: masterIngredients } = useMasterIngredientsStore();
  const { items: preparedItems } = usePreparedItemsStore();

  const handleIngredientChange = (index: number, updates: Partial<RecipeIngredient>) => {
    const newIngredients = [...(formData.ingredients || [])];
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

    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...(prev.ingredients || []),
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
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recipe Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'prepared' | 'final' }))}
            className="input w-full"
            required
          >
            <option value="prepared">Prepared Item</option>
            <option value="final">Final Plate</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Sub-Category
          </label>
          <input
            type="text"
            value={formData.subCategory}
            onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Station
          </label>
          <input
            type="text"
            value={formData.station}
            onChange={(e) => setFormData(prev => ({ ...prev, station: e.target.value }))}
            className="input w-full"
            required
          />
        </div>
      </div>

      {/* Storage Information */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Storage Area
          </label>
          <input
            type="text"
            value={formData.storageArea}
            onChange={(e) => setFormData(prev => ({ ...prev, storageArea: e.target.value }))}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Container
          </label>
          <input
            type="text"
            value={formData.container}
            onChange={(e) => setFormData(prev => ({ ...prev, container: e.target.value }))}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Container Type
          </label>
          <input
            type="text"
            value={formData.containerType}
            onChange={(e) => setFormData(prev => ({ ...prev, containerType: e.target.value }))}
            className="input w-full"
            required
          />
        </div>
      </div>

      {/* Recipe Details */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recipe Unit Ratio
          </label>
          <input
            type="text"
            value={formData.recipeUnitRatio}
            onChange={(e) => setFormData(prev => ({ ...prev, recipeUnitRatio: e.target.value }))}
            className="input w-full"
            placeholder="e.g. 4 servings"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Unit Type
          </label>
          <select
            value={formData.unitType}
            onChange={(e) => setFormData(prev => ({ ...prev, unitType: e.target.value }))}
            className="input w-full"
            required
          >
            <option value="servings">servings</option>
            <option value="portions">portions</option>
            <option value="pieces">pieces</option>
            <option value="g">grams</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">liters</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Shelf Life
          </label>
          <input
            type="text"
            value={formData.shelfLife}
            onChange={(e) => setFormData(prev => ({ ...prev, shelfLife: e.target.value }))}
            className="input w-full"
            required
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Ingredients</h3>
          <button
            type="button"
            onClick={addIngredient}
            className="btn-ghost"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Ingredient
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.ingredients?.map((ingredient, index) => (
            <div key={ingredient.id} className="grid grid-cols-6 gap-4 bg-gray-800/50 p-4 rounded-lg">
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

              <div className="flex items-end">
                <button
                  type="button"
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

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {initialData ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
};