import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Camera, Video, FileText, AlertTriangle, CheckCircle2, Thermometer, Clock } from 'lucide-react';
import { formatVideoUrl, validateMediaUrls } from '@/utils/recipe/media';
import type { Recipe, RecipeStep } from '@/types/recipe';

interface InstructionsProps {
  data: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ data, onChange }) => {
  const addStep = () => {
    onChange({
      steps: [
        ...data.steps,
        {
          id: `step-${Date.now()}`,
          order: data.steps.length + 1,
          description: '',
          subSteps: [],
          equipment: [],
          qualityChecks: [],
          warnings: [],
          tips: [],
          media: []
        }
      ]
    });
  };

  const updateStep = (index: number, updates: Partial<RecipeStep>) => {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    onChange({ steps: newSteps });
  };

  const removeStep = (index: number) => {
    onChange({
      steps: data.steps.filter((_, i) => i !== index)
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.steps.length) return;

    const newSteps = [...data.steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    
    // Update order numbers
    newSteps.forEach((step, i) => {
      step.order = i + 1;
    });

    onChange({ steps: newSteps });
  };

  const addSubStep = (stepIndex: number) => {
    const newSteps = [...data.steps];
    const step = newSteps[stepIndex];
    
    if (!step.subSteps) {
      step.subSteps = [];
    }

    step.subSteps.push({
      id: `substep-${Date.now()}`,
      order: step.subSteps.length + 1,
      description: ''
    });

    onChange({ steps: newSteps });
  };

  const addQualityCheck = (stepIndex: number) => {
    const newSteps = [...data.steps];
    const step = newSteps[stepIndex];
    
    if (!step.qualityChecks) {
      step.qualityChecks = [];
    }

    step.qualityChecks.push({
      id: `qc-${Date.now()}`,
      description: '',
      criteria: ''
    });

    onChange({ steps: newSteps });
  };

  const addMedia = (stepIndex: number, type: 'image' | 'video' | 'document') => {
    const newSteps = [...data.steps];
    const step = newSteps[stepIndex];
    
    if (!step.media) {
      step.media = [];
    }

    step.media.push({
      id: `media-${Date.now()}`,
      type,
      url: '',
      caption: ''
    });

    onChange({ steps: newSteps });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Instructions</h3>
        <button
          onClick={addStep}
          className="btn-ghost"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Step
        </button>
      </div>

      <div className="space-y-8">
        {data.steps.map((step, stepIndex) => (
          <div
            key={step.id}
            className="bg-gray-800/50 rounded-lg p-6 space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary-400">
                    {step.order}
                  </span>
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => updateStep(stepIndex, { description: e.target.value })}
                    className="input flex-1"
                    placeholder="Describe this step..."
                    required
                  />
                </div>

                {/* Temperature & Duration */}
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={step.temperature?.value || ''}
                      onChange={(e) => updateStep(stepIndex, {
                        temperature: {
                          value: parseInt(e.target.value) || 0,
                          unit: step.temperature?.unit || 'F'
                        }
                      })}
                      className="input w-20"
                      placeholder="Temp"
                    />
                    <select
                      value={step.temperature?.unit || 'F'}
                      onChange={(e) => updateStep(stepIndex, {
                        temperature: {
                          value: step.temperature?.value || 0,
                          unit: e.target.value as 'F' | 'C'
                        }
                      })}
                      className="input w-16"
                    >
                      <option value="F">°F</option>
                      <option value="C">°C</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={step.duration?.value || ''}
                      onChange={(e) => updateStep(stepIndex, {
                        duration: {
                          value: parseInt(e.target.value) || 0,
                          unit: step.duration?.unit || 'minutes'
                        }
                      })}
                      className="input w-20"
                      placeholder="Time"
                    />
                    <select
                      value={step.duration?.unit || 'minutes'}
                      onChange={(e) => updateStep(stepIndex, {
                        duration: {
                          value: step.duration?.value || 0,
                          unit: e.target.value as 'minutes' | 'hours'
                        }
                      })}
                      className="input w-24"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                </div>

                {/* Sub-steps */}
                {step.subSteps && step.subSteps.length > 0 && (
                  <div className="mt-4 space-y-2 pl-8">
                    {step.subSteps.map((subStep, subIndex) => (
                      <div key={subStep.id} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-400">
                          {step.order}.{subStep.order}
                        </span>
                        <input
                          type="text"
                          value={subStep.description}
                          onChange={(e) => {
                            const newSteps = [...data.steps];
                            const step = newSteps[stepIndex];
                            if (step.subSteps) {
                              step.subSteps[subIndex].description = e.target.value;
                              onChange({ steps: newSteps });
                            }
                          }}
                          className="input flex-1"
                          placeholder="Sub-step description..."
                        />
                        <button
                          onClick={() => {
                            const newSteps = [...data.steps];
                            const step = newSteps[stepIndex];
                            if (step.subSteps) {
                              step.subSteps = step.subSteps.filter((_, i) => i !== subIndex);
                              onChange({ steps: newSteps });
                            }
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quality Checks */}
                {step.qualityChecks && step.qualityChecks.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {step.qualityChecks.map((check, checkIndex) => (
                      <div key={check.id} className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <input
                            type="text"
                            value={check.description}
                            onChange={(e) => {
                              const newSteps = [...data.steps];
                              const step = newSteps[stepIndex];
                              if (step.qualityChecks) {
                                step.qualityChecks[checkIndex].description = e.target.value;
                                onChange({ steps: newSteps });
                              }
                            }}
                            className="input flex-1"
                            placeholder="Quality check description..."
                          />
                        </div>
                        <input
                          type="text"
                          value={check.criteria}
                          onChange={(e) => {
                            const newSteps = [...data.steps];
                            const step = newSteps[stepIndex];
                            if (step.qualityChecks) {
                              step.qualityChecks[checkIndex].criteria = e.target.value;
                              onChange({ steps: newSteps });
                            }
                          }}
                          className="input w-full"
                          placeholder="Success criteria..."
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings & Tips */}
                <div className="mt-4 space-y-4">
                  {step.warnings && step.warnings.length > 0 && (
                    <div className="bg-red-500/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <h4 className="font-medium text-red-400">Warnings</h4>
                      </div>
                      {step.warnings.map((warning, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={warning}
                            onChange={(e) => {
                              const newSteps = [...data.steps];
                              const step = newSteps[stepIndex];
                              if (step.warnings) {
                                step.warnings[index] = e.target.value;
                                onChange({ steps: newSteps });
                              }
                            }}
                            className="input flex-1 mt-2"
                            placeholder="Warning message..."
                          />
                          <button
                            onClick={() => {
                              const newSteps = [...data.steps];
                              const step = newSteps[stepIndex];
                              if (step.warnings) {
                                step.warnings = step.warnings.filter((_, i) => i !== index);
                                onChange({ steps: newSteps });
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.tips && step.tips.length > 0 && (
                    <div className="bg-blue-500/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-400" />
                        <h4 className="font-medium text-blue-400">Tips</h4>
                      </div>
                      {step.tips.map((tip, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tip}
                            onChange={(e) => {
                              const newSteps = [...data.steps];
                              const step = newSteps[stepIndex];
                              if (step.tips) {
                                step.tips[index] = e.target.value;
                                onChange({ steps: newSteps });
                              }
                            }}
                            className="input flex-1 mt-2"
                            placeholder="Helpful tip..."
                          />
                          <button
                            onClick={() => {
                              const newSteps = [...data.steps];
                              const step = newSteps[stepIndex];
                              if (step.tips) {
                                step.tips = step.tips.filter((_, i) => i !== index);
                                onChange({ steps: newSteps });
                              }
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Media */}
                {step.media && step.media.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {step.media.map((media, mediaIndex) => (
                      <div key={media.id} className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {media.type === 'image' && <Camera className="w-4 h-4 text-gray-400" />}
                            {media.type === 'video' && <Video className="w-4 h-4 text-gray-400" />}
                            {media.type === 'document' && <FileText className="w-4 h-4 text-gray-400" />}
                            <span className="text-sm font-medium text-gray-300 capitalize">
                              {media.type}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const newSteps = [...data.steps];
                              const step = newSteps[stepIndex];
                              if (step.media) {
                                step.media = step.media.filter((_, i) => i !== mediaIndex);
                                onChange({ steps: newSteps });
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={media.url}
                          onChange={(e) => {
                            const newSteps = [...data.steps];
                            const step = newSteps[stepIndex];
                            if (step.media) {
                              step.media[mediaIndex].url = e.target.value;
                              onChange({ steps: newSteps });
                            }
                          }}
                          className="input w-full mb-2"
                          placeholder={`${media.type} URL...`}
                        />
                        {media.type === 'video' && (
                          <input
                            type="text"
                            value={media.timestamp || ''}
                            onChange={(e) => {
                              const newSteps = [...data.steps];
                              const step = newSteps[stepIndex];
                              if (step.media) {
                                step.media[mediaIndex].timestamp = e.target.value;
                                onChange({ steps: newSteps });
                              }
                            }}
                            className="input w-full mb-2"
                            placeholder="Timestamp (e.g., 1:30)"
                          />
                        )}
                        <input
                          type="text"
                          value={media.caption || ''}
                          onChange={(e) => {
                            const newSteps = [...data.steps];
                            const step = newSteps[stepIndex];
                            if (step.media) {
                              step.media[mediaIndex].caption = e.target.value;
                              onChange({ steps: newSteps });
                            }
                          }}
                          className="input w-full"
                          placeholder="Caption..."
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step Actions */}
              <div className="flex flex-col gap-2">
                {stepIndex > 0 && (
                  <button
                    onClick={() => moveStep(stepIndex, 'up')}
                    className="text-gray-400 hover:text-white"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                )}
                {stepIndex < data.steps.length - 1 && (
                  <button
                    onClick={() => moveStep(stepIndex, 'down')}
                    className="text-gray-400 hover:text-white"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => removeStep(stepIndex)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => addSubStep(stepIndex)}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Sub-step
              </button>
              <button
                onClick={() => addQualityCheck(stepIndex)}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Quality Check
              </button>
              <button
                onClick={() => {
                  const newSteps = [...data.steps];
                  const step = newSteps[stepIndex];
                  if (!step.warnings) step.warnings = [];
                  step.warnings.push('');
                  onChange({ steps: newSteps });
                }}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Warning
              </button>
              <button
                onClick={() => {
                  const newSteps = [...data.steps];
                  const step = newSteps[stepIndex];
                  if (!step.tips) step.tips = [];
                  step.tips.push('');
                  onChange({ steps: newSteps });
                }}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tip
              </button>
              <button
                onClick={() => addMedia(stepIndex, 'image')}
                className="btn-ghost text-sm"
              >
                <Camera className="w-4 h-4 mr-1" />
                Image
              </button>
              <button
                onClick={() => addMedia(stepIndex, 'video')}
                className="btn-ghost text-sm"
              >
                <Video className="w-4 h-4 mr-1" />
                Video
              </button>
              <button
                onClick={() => addMedia(stepIndex, 'document')}
                className="btn-ghost text-sm"
              >
                <FileText className="w-4 h-4 mr-1" />
                Document
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```