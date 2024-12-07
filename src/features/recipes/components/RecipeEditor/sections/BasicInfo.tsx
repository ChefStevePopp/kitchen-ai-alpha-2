import React from 'react';
import type { Recipe } from '@/types/recipe';

interface BasicInfoProps {
  data: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recipe Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Type
          </label>
          <select
            value={data.type}
            onChange={(e) => onChange({ type: e.target.value as 'prepared' | 'final' })}
            className="input w-full"
            required
          >
            <option value="prepared">Prepared Item</option>
            <option value="final">Final Plate</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Category
          </label>
          <input
            type="text"
            value={data.category}
            onChange={(e) => onChange({ category: e.target.value })}
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
            value={data.subCategory}
            onChange={(e) => onChange({ subCategory: e.target.value })}
            className="input w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="input w-full h-24"
          placeholder="Enter a detailed description of the recipe..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Prep Time (minutes)
          </label>
          <input
            type="number"
            value={data.prepTime}
            onChange={(e) => onChange({ prepTime: parseInt(e.target.value) || 0 })}
            className="input w-full"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Cook Time (minutes)
          </label>
          <input
            type="number"
            value={data.cookTime}
            onChange={(e) => onChange({ cookTime: parseInt(e.target.value) || 0 })}
            className="input w-full"
            min="0"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recipe Yield Value
          </label>
          <input
            type="number"
            value={data.recipeYield.value}
            onChange={(e) => onChange({
              recipeYield: {
                ...data.recipeYield,
                value: parseFloat(e.target.value) || 1
              }
            })}
            className="input w-full"
            min="0.1"
            step="0.1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Yield Unit
          </label>
          <input
            type="text"
            value={data.recipeYield.unit}
            onChange={(e) => onChange({
              recipeYield: {
                ...data.recipeYield,
                unit: e.target.value
              }
            })}
            className="input w-full"
            placeholder="e.g., servings, portions, batch"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Internal Notes
        </label>
        <textarea
          value={data.internalNotes || ''}
          onChange={(e) => onChange({ internalNotes: e.target.value })}
          className="input w-full h-24"
          placeholder="Enter any internal notes or comments..."
        />
      </div>
    </div>
  );
};
```