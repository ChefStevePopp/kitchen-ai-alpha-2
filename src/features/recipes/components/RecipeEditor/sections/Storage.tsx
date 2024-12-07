import React from 'react';
import { AlertTriangle, Thermometer, Droplets, Box, AlertCircle, ArrowDownUp } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface StorageProps {
  data: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const Storage: React.FC<StorageProps> = ({ data, onChange }) => {
  const updateStorage = (updates: Partial<Recipe['storage']>) => {
    onChange({
      storage: {
        ...data.storage,
        ...updates
      }
    });
  };

  const addCrossContaminationWarning = () => {
    const warnings = data.storage.crossContaminationWarnings || [];
    updateStorage({
      crossContaminationWarnings: [...warnings, '']
    });
  };

  return (
    <div className="space-y-6">
      {/* Temperature Requirements */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Temperature Requirements</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Min Temperature
            </label>
            <input
              type="number"
              value={data.storage.temperature.min}
              onChange={(e) => updateStorage({
                temperature: {
                  ...data.storage.temperature,
                  min: parseFloat(e.target.value)
                }
              })}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Max Temperature
            </label>
            <input
              type="number"
              value={data.storage.temperature.max}
              onChange={(e) => updateStorage({
                temperature: {
                  ...data.storage.temperature,
                  max: parseFloat(e.target.value)
                }
              })}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Unit
            </label>
            <select
              value={data.storage.temperature.unit}
              onChange={(e) => updateStorage({
                temperature: {
                  ...data.storage.temperature,
                  unit: e.target.value as 'F' | 'C'
                }
              })}
              className="input w-full"
              required
            >
              <option value="F">Fahrenheit (°F)</option>
              <option value="C">Celsius (°C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Humidity Requirements */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Humidity Requirements</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Min Humidity
            </label>
            <input
              type="number"
              value={data.storage.humidity?.min || ''}
              onChange={(e) => updateStorage({
                humidity: {
                  ...data.storage.humidity,
                  min: parseFloat(e.target.value),
                  unit: '%'
                }
              })}
              className="input w-full"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Max Humidity
            </label>
            <input
              type="number"
              value={data.storage.humidity?.max || ''}
              onChange={(e) => updateStorage({
                humidity: {
                  ...data.storage.humidity,
                  max: parseFloat(e.target.value),
                  unit: '%'
                }
              })}
              className="input w-full"
              placeholder="Optional"
            />
          </div>
          <div className="flex items-center">
            <span className="text-2xl text-gray-400">%</span>
          </div>
        </div>
      </div>

      {/* Container Requirements */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Box className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Container Requirements</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Container
            </label>
            <input
              type="text"
              value={data.storage.container}
              onChange={(e) => updateStorage({ container: e.target.value })}
              className="input w-full"
              placeholder="e.g., Cambro, Hotel Pan"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Container Type
            </label>
            <input
              type="text"
              value={data.storage.containerType}
              onChange={(e) => updateStorage({ containerType: e.target.value })}
              className="input w-full"
              placeholder="e.g., 1/6 Pan, 4qt"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Stacking Notes
          </label>
          <textarea
            value={data.storage.stackingNotes || ''}
            onChange={(e) => updateStorage({ stackingNotes: e.target.value })}
            className="input w-full h-20"
            placeholder="Enter any special stacking or storage instructions..."
          />
        </div>
      </div>

      {/* Cross-Contamination Warnings */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Cross-Contamination Warnings</h3>
        </div>

        <div className="space-y-4">
          {(data.storage.crossContaminationWarnings || []).map((warning, index) => (
            <div key={index} className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <input
                type="text"
                value={warning}
                onChange={(e) => {
                  const warnings = [...(data.storage.crossContaminationWarnings || [])];
                  warnings[index] = e.target.value;
                  updateStorage({ crossContaminationWarnings: warnings });
                }}
                className="input flex-1"
                placeholder="Enter warning..."
              />
              <button
                onClick={() => {
                  const warnings = [...(data.storage.crossContaminationWarnings || [])];
                  warnings.splice(index, 1);
                  updateStorage({ crossContaminationWarnings: warnings });
                }}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addCrossContaminationWarning}
            className="btn-ghost text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Warning
          </button>
        </div>
      </div>

      {/* FIFO Labeling */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <ArrowDownUp className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-white">FIFO Labeling</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.storage.fifoLabeling.required}
              onChange={(e) => updateStorage({
                fifoLabeling: {
                  ...data.storage.fifoLabeling,
                  required: e.target.checked
                }
              })}
              className="form-checkbox rounded bg-gray-700 border-gray-600 text-primary-500"
            />
            <span className="text-sm text-gray-300">FIFO Labeling Required</span>
          </label>

          {data.storage.fifoLabeling.required && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Labeling Instructions
              </label>
              <textarea
                value={data.storage.fifoLabeling.instructions || ''}
                onChange={(e) => updateStorage({
                  fifoLabeling: {
                    ...data.storage.fifoLabeling,
                    instructions: e.target.value
                  }
                })}
                className="input w-full h-20"
                placeholder="Enter specific labeling requirements and instructions..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```