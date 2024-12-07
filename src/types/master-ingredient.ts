export interface MasterIngredient {
  id?: string;
  organization_id: string;
  item_code: string;
  major_group: string | null;
  category: string | null;
  sub_category: string | null;
  product: string;
  vendor: string;
  case_size: string;
  units_per_case: string;
  current_price: number;
  unit_of_measure: string;
  recipe_unit_per_purchase_unit: number;
  recipe_unit_type: string;
  yield_percent: number;
  cost_per_recipe_unit: number;
  image_url?: string;
  storage_area: string;
  
  // Category names from view
  major_group_name?: string;
  category_name?: string;
  sub_category_name?: string;
  
  // Allergen columns
  allergen_peanut: boolean;
  allergen_crustacean: boolean;
  allergen_treenut: boolean;
  allergen_shellfish: boolean;
  allergen_sesame: boolean;
  allergen_soy: boolean;
  allergen_fish: boolean;
  allergen_wheat: boolean;
  allergen_milk: boolean;
  allergen_sulphite: boolean;
  allergen_egg: boolean;
  allergen_gluten: boolean;
  allergen_mustard: boolean;
  allergen_celery: boolean;
  allergen_garlic: boolean;
  allergen_onion: boolean;
  allergen_nitrite: boolean;
  allergen_mushroom: boolean;
  allergen_hot_pepper: boolean;
  allergen_citrus: boolean;
  allergen_pork: boolean;
  
  // Custom allergen fields
  allergen_custom1_name?: string;
  allergen_custom1_active: boolean;
  allergen_custom2_name?: string;
  allergen_custom2_active: boolean;
  allergen_custom3_name?: string;
  allergen_custom3_active: boolean;
  allergen_notes?: string;
  
  updated_at?: string;
}