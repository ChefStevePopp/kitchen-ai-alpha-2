import React from 'react';
import { GraduationCap, AlertTriangle, FileText, Award, Plus, X } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface TrainingProps {
  data: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const Training: React.FC<TrainingProps> = ({ data, onChange }) => {
  const updateTraining = (updates: Partial<Recipe['training']>) => {
    onChange({
      training: {
        ...data.training,
        ...updates
      }
    });
  };

  const addMistake = () => {
    const mistakes = data.training.commonMistakes || [];
    updateTraining({
      commonMistakes: [...mistakes, '']
    });
  };

  const addTrainingNote = () => {
    const notes = data.training.trainingNotes || [];
    updateTraining({
      trainingNotes: [...notes, '']
    });
  };

  const addCertification = () => {
    const certifications = data.training.certificationRequired || [];
    updateTraining({
      certificationRequired: [
        ...certifications,
        { type: '', description: '' }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Skill Level */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Required Skill Level</h3>
        </div>

        <select
          value={data.training.skillLevel}
          onChange={(e) => updateTraining({
            skillLevel: e.target.value as Recipe['training']['skillLevel']
          })}
          className="input w-full"
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>

        <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-2">Skill Level Description</h4>
          <p className="text-sm text-gray-400">
            {data.training.skillLevel === 'beginner' && 
              'Basic kitchen skills required. Suitable for new team members with proper supervision.'
            }
            {data.training.skillLevel === 'intermediate' && 
              'Comfortable with basic techniques and equipment. Some experience required.'
            }
            {data.training.skillLevel === 'advanced' && 
              'Significant experience required. Complex techniques and time management skills needed.'
            }
            {data.training.skillLevel === 'expert' && 
              'Master level skills required. Advanced techniques and deep understanding of culinary principles needed.'
            }
          </p>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">Common Mistakes</h3>
            <p className="text-sm text-gray-400">Document frequent errors to prevent issues</p>
          </div>
          <button
            onClick={addMistake}
            className="btn-ghost text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Mistake
          </button>
        </div>

        <div className="space-y-4">
          {(data.training.commonMistakes || []).map((mistake, index) => (
            <div key={index} className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <input
                type="text"
                value={mistake}
                onChange={(e) => {
                  const mistakes = [...(data.training.commonMistakes || [])];
                  mistakes[index] = e.target.value;
                  updateTraining({ commonMistakes: mistakes });
                }}
                className="input flex-1"
                placeholder="Describe common mistake and how to avoid it..."
              />
              <button
                onClick={() => {
                  const mistakes = [...(data.training.commonMistakes || [])];
                  mistakes.splice(index, 1);
                  updateTraining({ commonMistakes: mistakes });
                }}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Training Notes */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">Training Notes</h3>
            <p className="text-sm text-gray-400">Additional training instructions and tips</p>
          </div>
          <button
            onClick={addTrainingNote}
            className="btn-ghost text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </button>
        </div>

        <div className="space-y-4">
          {(data.training.trainingNotes || []).map((note, index) => (
            <div key={index} className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <input
                type="text"
                value={note}
                onChange={(e) => {
                  const notes = [...(data.training.trainingNotes || [])];
                  notes[index] = e.target.value;
                  updateTraining({ trainingNotes: notes });
                }}
                className="input flex-1"
                placeholder="Enter training note..."
              />
              <button
                onClick={() => {
                  const notes = [...(data.training.trainingNotes || [])];
                  notes.splice(index, 1);
                  updateTraining({ trainingNotes: notes });
                }}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Required Certifications */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">Required Certifications</h3>
            <p className="text-sm text-gray-400">Certifications needed to prepare this recipe</p>
          </div>
          <button
            onClick={addCertification}
            className="btn-ghost text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Certification
          </button>
        </div>

        <div className="space-y-4">
          {(data.training.certificationRequired || []).map((cert, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  value={cert.type}
                  onChange={(e) => {
                    const certs = [...(data.training.certificationRequired || [])];
                    certs[index] = { ...certs[index], type: e.target.value };
                    updateTraining({ certificationRequired: certs });
                  }}
                  className="input flex-1"
                  placeholder="Certification type..."
                />
                <button
                  onClick={() => {
                    const certs = [...(data.training.certificationRequired || [])];
                    certs.splice(index, 1);
                    updateTraining({ certificationRequired: certs });
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={cert.description}
                onChange={(e) => {
                  const certs = [...(data.training.certificationRequired || [])];
                  certs[index] = { ...certs[index], description: e.target.value };
                  updateTraining({ certificationRequired: certs });
                }}
                className="input w-full h-20"
                placeholder="Describe certification requirements..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```