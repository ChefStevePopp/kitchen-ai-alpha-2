import React from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import type { Recipe, RecipeEquipment } from '@/types/recipe';

interface EquipmentProps {
  data: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const Equipment: React.FC<EquipmentProps> = ({ data, onChange }) => {
  const addEquipment = () => {
    onChange({
      equipment: [
        ...data.equipment,
        {
          id: `equip-${Date.now()}`,
          name: '',
          required: true,
          notes: ''
        }
      ]
    });
  };

  const updateEquipment = (index: number, updates: Partial<RecipeEquipment>) => {
    const newEquipment = [...data.equipment];
    newEquipment[index] = { ...newEquipment[index], ...updates };
    onChange({ equipment: newEquipment });
  };

  const removeEquipment = (index: number) => {
    onChange({
      equipment: data.equipment.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Equipment Requirements</h3>
        <button
          onClick={addEquipment}
          className="btn-ghost"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Equipment
        </button>
      </div>

      <div className="space-y-4">
        {data.equipment.map((equipment, index) => (
          <div
            key={equipment.id}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={equipment.name}
                  onChange={(e) => updateEquipment(index, { name: e.target.value })}
                  className="input w-full"
                  placeholder="Enter equipment name..."
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={equipment.required}
                    onChange={(e) => updateEquipment(index, { required: e.target.checked })}
                    className="form-checkbox rounded bg-gray-700 border-gray-600 text-primary-500"
                  />
                  <span className="text-sm text-gray-300">Required</span>
                </label>

                <button
                  onClick={() => removeEquipment(index)}
                  className="text-red-400 hover:text-red-300 ml-auto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Notes
              </label>
              <textarea
                value={equipment.notes || ''}
                onChange={(e) => updateEquipment(index, { notes: e.target.value })}
                className="input w-full h-20"
                placeholder="Enter any special notes or requirements..."
              />
            </div>

            {equipment.required && !equipment.notes && (
              <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Consider adding notes for required equipment</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.equipment.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No equipment requirements added yet.</p>
          <p className="text-sm mt-1">Click the button above to add equipment.</p>
        </div>
      )}
    </div>
  );
};
```