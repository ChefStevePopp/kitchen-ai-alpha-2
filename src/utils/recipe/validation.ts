import type { Recipe, RecipeIngredient, RecipeStep } from '@/types/recipe';

export function validateRecipe(recipe: Recipe): string[] {
  const errors: string[] = [];

  // Basic info validation
  if (!recipe.name?.trim()) {
    errors.push('Recipe name is required');
  }

  if (!recipe.category?.trim()) {
    errors.push('Category is required');
  }

  // Ingredients validation
  if (!recipe.ingredients?.length) {
    errors.push('At least one ingredient is required');
  } else {
    recipe.ingredients.forEach((ingredient, index) => {
      const ingredientErrors = validateIngredient(ingredient);
      errors.push(...ingredientErrors.map(err => `Ingredient ${index + 1}: ${err}`));
    });
  }

  // Steps validation
  if (!recipe.steps?.length) {
    errors.push('At least one step is required');
  } else {
    recipe.steps.forEach((step, index) => {
      const stepErrors = validateStep(step);
      errors.push(...stepErrors.map(err => `Step ${index + 1}: ${err}`));
    });
  }

  // Equipment validation
  if (recipe.equipment?.length) {
    recipe.equipment.forEach((equipment, index) => {
      if (!equipment.name?.trim()) {
        errors.push(`Equipment ${index + 1}: Name is required`);
      }
    });
  }

  // Storage validation
  const storageErrors = validateStorage(recipe.storage);
  errors.push(...storageErrors);

  // Training validation
  if (!recipe.training?.skillLevel) {
    errors.push('Skill level is required');
  }

  // Quality control validation
  if (recipe.qualityControl?.temperatureChecks?.length) {
    recipe.qualityControl.temperatureChecks.forEach((check, index) => {
      if (!check.stage?.trim()) {
        errors.push(`Temperature check ${index + 1}: Stage is required`);
      }
      if (check.minTemp >= check.maxTemp) {
        errors.push(`Temperature check ${index + 1}: Min temperature must be less than max temperature`);
      }
    });
  }

  // Version validation
  if (!recipe.versions?.length || !recipe.currentVersion) {
    errors.push('Version information is required');
  }

  return errors;
}

function validateIngredient(ingredient: RecipeIngredient): string[] {
  const errors: string[] = [];

  if (!ingredient.name?.trim()) {
    errors.push('Name is required');
  }

  if (!ingredient.quantity || isNaN(parseFloat(ingredient.quantity))) {
    errors.push('Valid quantity is required');
  }

  if (!ingredient.unit?.trim()) {
    errors.push('Unit is required');
  }

  if (ingredient.type === 'prepared' && !ingredient.preparedItemId) {
    errors.push('Prepared item reference is required');
  }

  return errors;
}

function validateStep(step: RecipeStep): string[] {
  const errors: string[] = [];

  if (!step.description?.trim()) {
    errors.push('Description is required');
  }

  if (step.temperature) {
    if (!step.temperature.value || isNaN(step.temperature.value)) {
      errors.push('Valid temperature value is required');
    }
    if (!step.temperature.unit) {
      errors.push('Temperature unit is required');
    }
  }

  if (step.duration) {
    if (!step.duration.value || isNaN(step.duration.value)) {
      errors.push('Valid duration value is required');
    }
    if (!step.duration.unit) {
      errors.push('Duration unit is required');
    }
  }

  if (step.qualityChecks?.length) {
    step.qualityChecks.forEach((check, index) => {
      if (!check.description?.trim()) {
        errors.push(`Quality check ${index + 1}: Description is required`);
      }
      if (!check.criteria?.trim()) {
        errors.push(`Quality check ${index + 1}: Criteria is required`);
      }
    });
  }

  return errors;
}

function validateStorage(storage: Recipe['storage']): string[] {
  const errors: string[] = [];

  if (!storage.temperature) {
    errors.push('Storage temperature is required');
  } else {
    if (storage.temperature.min >= storage.temperature.max) {
      errors.push('Min temperature must be less than max temperature');
    }
    if (!storage.temperature.unit) {
      errors.push('Temperature unit is required');
    }
  }

  if (!storage.container?.trim()) {
    errors.push('Storage container is required');
  }

  if (!storage.containerType?.trim()) {
    errors.push('Container type is required');
  }

  if (storage.humidity) {
    if (storage.humidity.min >= storage.humidity.max) {
      errors.push('Min humidity must be less than max humidity');
    }
    if (!storage.humidity.unit) {
      errors.push('Humidity unit is required');
    }
  }

  return errors;
}