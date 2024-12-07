import React, { useState } from 'react';
import { Save, X, Camera, Upload, AlertTriangle } from 'lucide-react';
import { useRecipeStore } from '@/stores/recipeStore';
import { BasicInfo } from './sections/BasicInfo';
import { Ingredients } from './sections/Ingredients';
import { Instructions } from './sections/Instructions';
import { Equipment } from './sections/Equipment';
import { Storage } from './sections/Storage';
import { Training } from './sections/Training';
import { QualityControl } from './sections/QualityControl';
import { Allergens } from './sections/Allergens';
import { Media } from './sections/Media';
import { validateRecipe } from '@/utils/recipe/validation';
import type { Recipe } from '@/types/recipe';
import toast from 'react-hot-toast';

interface RecipeEditorProps {
  recipe?: Recipe;
  onClose: () => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({ recipe, onClose }) => {
  const [formData, setFormData] = useState<Recipe>(recipe || {
    id: `recipe-${Date.now()}`,
    type: 'prepared',
    name: '',
    category: '',
    subCategory: '',
    description: '',
    ingredients: [],
    recipeYield: { value: 1, unit: 'batch' },
    costPerUnit: 0,
    totalCost: 0,
    prepTime: 0,
    cookTime: 0,
    equipment: [],
    steps: [],
    primaryStation: '',
    storage: {
      temperature: { min: 35, max: 40, unit: 'F' },
      container: '',
      containerType: '',
      fifoLabeling: { required: true }
    },
    training: { skillLevel: 'beginner' },
    qualityControl: {},
    allergens: [],
    versions: [],
    currentVersion: '1.0.0',
    lastModified: new Date().toISOString(),
    createdBy: '',
    updatedBy: ''
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<string[]>([]);
  const { createRecipe, updateRecipe } = useRecipeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate recipe
    const validationErrors = validateRecipe(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      if (recipe) {
        await updateRecipe(recipe.id, formData);
      } else {
        await createRecipe(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'instructions', label: 'Instructions' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'storage', label: 'Storage' },
    { id: 'training', label: 'Training' },
    { id: 'quality', label: 'Quality Control' },
    { id: 'allergens', label: 'Allergens' },
    { id: 'media', label: 'Media' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white">
            {recipe ? 'Edit Recipe' : 'Create Recipe'}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="btn-ghost"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Recipe
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Tab Navigation */}
          <div className="w-48 bg-gray-800/50 p-4 flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {errors.length > 0 && (
              <div className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-medium">Please fix the following errors:</h3>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'basic' && (
              <BasicInfo
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'ingredients' && (
              <Ingredients
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'instructions' && (
              <Instructions
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'equipment' && (
              <Equipment
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'storage' && (
              <Storage
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'training' && (
              <Training
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'quality' && (
              <QualityControl
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'allergens' && (
              <Allergens
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
            {activeTab === 'media' && (
              <Media
                data={formData}
                onChange={updates => setFormData(prev => ({ ...prev, ...updates }))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```