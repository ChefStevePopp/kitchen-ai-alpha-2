export interface RecipeIngredient {
  id: string;
  type: 'raw' | 'prepared';
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
  cost: number;
  preparedItemId?: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  description: string;
  subSteps?: {
    id: string;
    order: number;
    description: string;
  }[];
  equipment?: string[];
  temperature?: {
    value: number;
    unit: 'F' | 'C';
  };
  duration?: {
    value: number;
    unit: 'minutes' | 'hours';
  };
  qualityChecks?: {
    id: string;
    description: string;
    criteria: string;
  }[];
  warnings?: string[];
  tips?: string[];
  media?: {
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    timestamp?: string; // For video timestamps
    caption?: string;
  }[];
}

export interface RecipeEquipment {
  id: string;
  name: string;
  required: boolean;
  notes?: string;
}

export interface RecipeStorage {
  temperature: {
    min: number;
    max: number;
    unit: 'F' | 'C';
  };
  humidity?: {
    min: number;
    max: number;
    unit: '%';
  };
  container: string;
  containerType: string;
  stackingNotes?: string;
  crossContaminationWarnings?: string[];
  fifoLabeling: {
    required: boolean;
    instructions?: string;
  };
}

export interface RecipeTraining {
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  commonMistakes?: string[];
  trainingNotes?: string[];
  certificationRequired?: {
    type: string;
    description: string;
  }[];
}

export interface RecipeQualityControl {
  visualStandards?: {
    description: string;
    imageUrl?: string;
  }[];
  temperatureChecks?: {
    stage: string;
    minTemp: number;
    maxTemp: number;
    unit: 'F' | 'C';
  }[];
  textureGuidelines?: string[];
  consistencyChecks?: string[];
  platingStandards?: {
    description: string;
    imageUrl?: string;
  }[];
}

export interface RecipeVersion {
  version: string;
  date: string;
  author: string;
  changes: string[];
  approved?: {
    by: string;
    date: string;
    notes?: string;
  };
}

export interface Recipe {
  id: string;
  type: 'prepared' | 'final';
  name: string;
  category: string;
  subCategory: string;
  description: string;

  // Costing
  ingredients: RecipeIngredient[];
  recipeYield: {
    value: number;
    unit: string;
  };
  costPerUnit: number;
  totalCost: number;
  laborCost?: number;

  // Production
  prepTime: number;
  cookTime: number;
  equipment: RecipeEquipment[];
  steps: RecipeStep[];

  // Station Management
  primaryStation: string;
  secondaryStations?: string[];
  prepTimeline?: {
    stage: string;
    timeBeforeService: string;
    notes?: string;
  }[];

  // Storage
  storage: RecipeStorage;

  // Training & Quality
  training: RecipeTraining;
  qualityControl: RecipeQualityControl;

  // Allergens
  allergens: string[];
  crossContaminationRisks?: string[];
  cleaningRequirements?: string[];
  alternativeIngredients?: {
    ingredient: string;
    alternatives: string[];
  }[];

  // Version Control
  versions: RecipeVersion[];
  currentVersion: string;
  lastModified: string;
  createdBy: string;
  updatedBy: string;

  // Media
  imageUrl?: string;
  videoUrl?: string;
  documents?: {
    id: string;
    type: string;
    url: string;
    name: string;
  }[];

  // Notes
  notes?: string;
  internalNotes?: string;
}

export interface RecipeStore {
  recipes: Recipe[];
  isLoading: boolean;
  currentRecipe: Recipe | null;
  createRecipe: (recipe: Omit<Recipe, 'id' | 'lastModified'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  calculateCosts: (recipe: Recipe) => { totalCost: number; costPerUnit: number };
  filterRecipes: (type: 'prepared' | 'final', searchTerm: string) => Recipe[];
  seedFromPreparedItems: (preparedItems: any[]) => void;
}