import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { MasterIngredient } from '@/types/master-ingredient';
import toast from 'react-hot-toast';

interface MasterIngredientsStore {
  ingredients: MasterIngredient[];
  isLoading: boolean;
  error: string | null;
  fetchIngredients: () => Promise<void>;
  updateIngredient: (id: string, updates: Partial<MasterIngredient>) => Promise<void>;
  importIngredients: (data: any[]) => Promise<void>;
  clearIngredients: () => Promise<void>;
}

export const useMasterIngredientsStore = create<MasterIngredientsStore>((set, get) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('master_ingredients')
        .select(`
          *,
          food_category_groups!major_group(name),
          food_categories!category(name),
          food_sub_categories!sub_category(name)
        `)
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;

      // Transform the data to match our expected format
      const transformedData = data?.map(item => ({
        ...item,
        major_group_name: item.food_category_groups?.name,
        category_name: item.food_categories?.name,
        sub_category_name: item.food_sub_categories?.name
      }));

      set({ ingredients: transformedData || [], error: null });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      set({ error: 'Failed to load ingredients', ingredients: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  updateIngredient: async (id, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      // Prepare update data by removing view-related fields
      const {
        major_group_name,
        category_name,
        sub_category_name,
        food_category_groups,
        food_categories,
        food_sub_categories,
        ...updateData
      } = updates as any;

      // Add organization_id and updated_at
      const dataToUpdate = {
        ...updateData,
        organization_id: user.user_metadata.organizationId,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('master_ingredients')
        .update(dataToUpdate)
        .eq('id', id)
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;

      // Refresh ingredients to get updated data
      await get().fetchIngredients();
      toast.success('Ingredient updated successfully');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Failed to update ingredient');
      throw error;
    }
  },

  importIngredients: async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const importData = data.map(row => ({
        organization_id: user.user_metadata.organizationId,
        item_code: row['Item Code'],
        major_group: row['Major Group'],
        category: row['Category'],
        sub_category: row['Sub-Category'],
        product: row['Product Name'],
        vendor: row['Vendor'],
        case_size: row['Case Size'],
        units_per_case: row['Units/Case'],
        current_price: parseFloat(row['Case Price']?.toString().replace(/[$,]/g, '') || '0'),
        unit_of_measure: row['Unit of Measure'],
        recipe_unit_per_purchase_unit: parseFloat(row['Recipe Units/Case'] || '0'),
        recipe_unit_type: row['Recipe Unit Type'],
        yield_percent: parseFloat(row['Yield %']?.toString().replace(/%/g, '') || '100'),
        storage_area: row['Storage Area'],
        image_url: row['Image URL'],
        
        // Allergens
        allergen_peanut: row['Peanut'] === '1' || row['Peanut'] === 'true',
        allergen_crustacean: row['Crustacean'] === '1' || row['Crustacean'] === 'true',
        allergen_treenut: row['Tree Nut'] === '1' || row['Tree Nut'] === 'true',
        allergen_shellfish: row['Shellfish'] === '1' || row['Shellfish'] === 'true',
        allergen_sesame: row['Sesame'] === '1' || row['Sesame'] === 'true',
        allergen_soy: row['Soy'] === '1' || row['Soy'] === 'true',
        allergen_fish: row['Fish'] === '1' || row['Fish'] === 'true',
        allergen_wheat: row['Wheat'] === '1' || row['Wheat'] === 'true',
        allergen_milk: row['Milk'] === '1' || row['Milk'] === 'true',
        allergen_sulphite: row['Sulphite'] === '1' || row['Sulphite'] === 'true',
        allergen_egg: row['Egg'] === '1' || row['Egg'] === 'true',
        allergen_gluten: row['Gluten'] === '1' || row['Gluten'] === 'true',
        allergen_mustard: row['Mustard'] === '1' || row['Mustard'] === 'true',
        allergen_celery: row['Celery'] === '1' || row['Celery'] === 'true',
        allergen_garlic: row['Garlic'] === '1' || row['Garlic'] === 'true',
        allergen_onion: row['Onion'] === '1' || row['Onion'] === 'true',
        allergen_nitrite: row['Nitrite'] === '1' || row['Nitrite'] === 'true',
        allergen_mushroom: row['Mushroom'] === '1' || row['Mushroom'] === 'true',
        allergen_hot_pepper: row['Hot Pepper'] === '1' || row['Hot Pepper'] === 'true',
        allergen_citrus: row['Citrus'] === '1' || row['Citrus'] === 'true',
        allergen_pork: row['Pork'] === '1' || row['Pork'] === 'true',

        // Custom allergens
        allergen_custom1_name: row['Custom Allergen 1 Name'],
        allergen_custom1_active: row['Custom Allergen 1 Active'] === '1',
        allergen_custom2_name: row['Custom Allergen 2 Name'],
        allergen_custom2_active: row['Custom Allergen 2 Active'] === '1',
        allergen_custom3_name: row['Custom Allergen 3 Name'],
        allergen_custom3_active: row['Custom Allergen 3 Active'] === '1',
        allergen_notes: row['Allergen Notes'],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('master_ingredients')
        .upsert(importData, {
          onConflict: 'organization_id,item_code',
          ignoreDuplicates: false
        });

      if (error) throw error;

      // Refresh ingredients list
      await get().fetchIngredients();
      toast.success('Ingredients imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import ingredients');
      throw error;
    }
  },

  clearIngredients: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('master_ingredients')
        .delete()
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;
      
      set({ ingredients: [] });
      toast.success('Ingredients cleared successfully');
    } catch (error) {
      console.error('Error clearing ingredients:', error);
      toast.error('Failed to clear ingredients');
    }
  }
}));