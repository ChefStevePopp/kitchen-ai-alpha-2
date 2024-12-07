export interface FoodCategoryGroup {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodCategory {
  id: string;
  organization_id: string;
  group_id: string;
  name: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodSubCategory {
  id: string;
  organization_id: string;
  category_id: string;
  name: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodRelationshipsStore {
  groups: FoodCategoryGroup[];
  categories: FoodCategory[];
  subCategories: FoodSubCategory[];
  isLoading: boolean;
  error: string | null;
  
  // Fetch methods
  fetchGroups: () => Promise<void>;
  fetchCategories: (groupId: string) => Promise<void>;
  fetchSubCategories: (categoryId: string) => Promise<void>;
}