import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AllergenBadge } from '@/features/allergens/components/AllergenBadge';
import type { MasterIngredient } from '@/types/master-ingredient';
import type { AllergenType } from '@/features/allergens/types';

interface AllergenSectionProps {
  formData: MasterIngredient;
  onChange: (updates: MasterIngredient) => void;
}

export const AllergenSection: React.FC<AllergenSectionProps> = ({
  formData,
  onChange
}) => {
  // Diagnostic Text
  const diagnosticPath = "src/features/admin/components/sections/recipe/MasterIngredientList/EditIngredientModal/AllergenSection.tsx";

  const handleAllergenToggle = (allergenKey: string) => {
    const key = `allergen_${allergenKey}` as keyof MasterIngredient;
    onChange({
      ...formData,
      [key]: !formData[key]
    });
  };

  // Group allergens by severity
  const highPriorityAllergens = [
    { key: 'peanut', active: formData.allergen_peanut },
    { key: 'crustacean', active: formData.allergen_crustacean },
    { key: 'treenut', active: formData.allergen_treenut },
    { key: 'shellfish', active: formData.allergen_shellfish },
    { key: 'sesame', active: formData.allergen_sesame }
  ];

  const mediumPriorityAllergens = [
    { key: 'soy', active: formData.allergen_soy },
    { key: 'fish', active: formData.allergen_fish },
    { key: 'wheat', active: formData.allergen_wheat },
    { key: 'milk', active: formData.allergen_milk },
    { key: 'sulphite', active: formData.allergen_sulphite },
    { key: 'egg', active: formData.allergen_egg },
    { key: 'gluten', active: formData.allergen_gluten },
    { key: 'mustard', active: formData.allergen_mustard },
    { key: 'pork', active: formData.allergen_pork }
  ];

  const lowPriorityAllergens = [
    { key: 'celery', active: formData.allergen_celery },
    { key: 'garlic', active: formData.allergen_garlic },
    { key: 'onion', active: formData.allergen_onion },
    { key: 'nitrite', active: formData.allergen_nitrite },
    { key: 'mushroom', active: formData.allergen_mushroom },
    { key: 'hot_pepper', active: formData.allergen_hot_pepper },
    { key: 'citrus', active: formData.allergen_citrus }
  ];

  return (
    <div className="space-y-4">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        {diagnosticPath}
      </div>

      <div className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-4 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
        <div>
          <p className="text-yellow-400 font-medium">Allergen Information</p>
          <p className="text-sm text-gray-300 mt-1">
            Select all allergens that apply. This information will be used for allergen warnings and cross-contamination prevention.
          </p>
        </div>
      </div>

      {/* High Priority Allergens */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-red-400">High Priority Allergens</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {highPriorityAllergens.map(({ key, active }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={active}
                onChange={() => handleAllergenToggle(key)}
                className="form-checkbox rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500"
              />
              <AllergenBadge 
                type={key as AllergenType}
                showLabel 
                className="group-hover:scale-105 transition-transform"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Medium Priority Allergens */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-yellow-400">Medium Priority Allergens</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediumPriorityAllergens.map(({ key, active }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={active}
                onChange={() => handleAllergenToggle(key)}
                className="form-checkbox rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
              />
              <AllergenBadge 
                type={key as AllergenType}
                showLabel 
                className="group-hover:scale-105 transition-transform"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Low Priority Allergens */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-blue-400">Low Priority Allergens</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {lowPriorityAllergens.map(({ key, active }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={active}
                onChange={() => handleAllergenToggle(key)}
                className="form-checkbox rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <AllergenBadge 
                type={key as AllergenType}
                showLabel 
                className="group-hover:scale-105 transition-transform"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Custom Allergens */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white">Custom Allergens</h4>
        {[1, 2, 3].map(index => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[`allergen_custom${index}_active` as keyof MasterIngredient] as boolean}
                  onChange={(e) => onChange({
                    ...formData,
                    [`allergen_custom${index}_active`]: e.target.checked
                  })}
                  className="form-checkbox rounded bg-gray-700 border-gray-600 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-300">Custom Allergen {index}</span>
              </label>
              <input
                type="text"
                value={formData[`allergen_custom${index}_name` as keyof MasterIngredient] as string || ''}
                onChange={(e) => onChange({
                  ...formData,
                  [`allergen_custom${index}_name`]: e.target.value
                })}
                placeholder="Enter allergen name"
                className="input flex-1 text-sm"
                disabled={!formData[`allergen_custom${index}_active` as keyof MasterIngredient]}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Allergen Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Allergen Notes
        </label>
        <textarea
          value={formData.allergen_notes || ''}
          onChange={(e) => onChange({
            ...formData,
            allergen_notes: e.target.value
          })}
          className="input w-full h-24"
          placeholder="Enter any additional allergen information or handling requirements..."
        />
      </div>
    </div>
  );
};