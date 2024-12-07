import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AllergenBadge } from '../AllergenBadge';
import { getAllergensByCategory } from '../../constants';
import type { MasterIngredient } from '@/types/master-ingredient';

interface AllergenSelectorProps {
  ingredient: MasterIngredient;
  onChange: (updates: Partial<MasterIngredient>) => void;
  className?: string;
}

export const AllergenSelector: React.FC<AllergenSelectorProps> = ({
  ingredient,
  onChange,
  className = ''
}) => {
  const handleAllergenToggle = (allergenKey: string) => {
    const key = `allergen${allergenKey.charAt(0).toUpperCase() + allergenKey.slice(1)}` as keyof MasterIngredient;
    onChange({
      [key]: !ingredient[key]
    });
  };

  // Group allergens by severity
  const highPriorityAllergens = [
    { key: 'peanut', active: ingredient.allergenPeanut },
    { key: 'crustacean', active: ingredient.allergenCrustacean },
    { key: 'treenut', active: ingredient.allergenTreenut },
    { key: 'shellfish', active: ingredient.allergenShellfish },
    { key: 'sesame', active: ingredient.allergenSesame }
  ];

  const mediumPriorityAllergens = [
    { key: 'soy', active: ingredient.allergenSoy },
    { key: 'wheat', active: ingredient.allergenWheat },
    { key: 'milk', active: ingredient.allergenMilk },
    { key: 'sulphite', active: ingredient.allergenSulphite },
    { key: 'egg', active: ingredient.allergenEgg },
    { key: 'gluten', active: ingredient.allergenGluten },
    { key: 'mustard', active: ingredient.allergenMustard },
    { key: 'pork', active: ingredient.allergenPork }
  ];

  const lowPriorityAllergens = [
    { key: 'celery', active: ingredient.allergenCelery },
    { key: 'garlic', active: ingredient.allergenGarlic },
    { key: 'onion', active: ingredient.allergenOnion },
    { key: 'nitrite', active: ingredient.allergenNitrite },
    { key: 'mushroom', active: ingredient.allergenMushroom },
    { key: 'hotPepper', active: ingredient.allergenHotPepper },
    { key: 'citrus', active: ingredient.allergenCitrus }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
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
                type={key}
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
                type={key}
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
                type={key}
                showLabel 
                className="group-hover:scale-105 transition-transform"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};