import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { MasterIngredient } from '@/types/master-ingredient';
import toast from 'react-hot-toast';

interface MasterIngredientsStore {
  ingredients: MasterIngredient[];
  isLoading: boolean;
  error: string | null;
  fetchIngredients: () => Promise<void>;
  addIngredient: (ingredient: Partial<MasterIngredient>) => Promise<void>;
  updateIngredient: (id: string, updates: Partial<MasterIngredient>) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
  importIngredients: (data: any[]) => Promise<void>;
  clearIngredients: () => Promise<void>;
  saveIngredients: () => Promise<void>;
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
        .from('master_ingredients_with_categories')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId)
        .order('product');

      if (error) throw error;
      set({ ingredients: data || [], error: null });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      set({ error: 'Failed to load ingredients', ingredients: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addIngredient: async (ingredient) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('master_ingredients')
        .insert({
          ...ingredient,
          organization_id: user.user_metadata.organizationId,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        ingredients: [...state.ingredients, data]
      }));

      toast.success('Ingredient added successfully');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast.error('Failed to add ingredient');
      throw error;
    }
  },

  updateIngredient: async (id, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('master_ingredients')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;

      // Refresh ingredients to get updated data with category names
      await get().fetchIngredients();
      toast.success('Ingredient updated successfully');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Failed to update ingredient');
      throw error;
    }
  },

  deleteIngredient: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('master_ingredients')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;

      set(state => ({
        ingredients: state.ingredients.filter(ingredient => ingredient.id !== id)
      }));

      toast.success('Ingredient deleted successfully');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      toast.error('Failed to delete ingredient');
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
        item_code: row['Item Code'] || row['Vendor Code'] || row['Bar Code'],
        product: row['Product Name'] || row['Common Name'],
        vendor: row['Vendor'],
        case_size: row['Case Size'],
        units_per_case: row['Units/Case'],
        current_price: parseFloat(row['Case Price']?.toString().replace(/[$,]/g, '') || '0'),
        unit_of_measure: row['Unit of Measure'] || row['Inventory Unit'],
        recipe_unit_per_purchase_unit: parseFloat(row['Recipe Units/Case']?.toString() || '0'),
        recipe_unit_type: row['Recipe Unit Type'],
        yield_percent: parseFloat(row['Yield %']?.toString().replace(/%/g, '') || '100'),
        cost_per_recipe_unit: parseFloat(row['Cost/Recipe Unit']?.toString().replace(/[$,]/g, '') || '0'),
        storage_area: row['Storage Area'],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('master_ingredients')
        .upsert(importData, {
          onConflict: 'organization_id,item_code',
          ignoreDuplicates: false
        });

      if (error) throw error;

      await get().fetchIngredients();
      toast.success('Ingredients imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to import data');
      }
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
  },

  saveIngredients: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { ingredients } = get();
      
      // Process ingredients sequentially to avoid conflicts
      for (const ingredient of ingredients) {
        const { error } = await supabase
          .from('master_ingredients')
          .upsert({
            ...ingredient,
            organization_id: user.user_metadata.organizationId,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'organization_id,item_code'
          });

        if (error) throw error;
      }
      
      toast.success('Ingredients saved successfully');
    } catch (error) {
      console.error('Error saving ingredients:', error);
      toast.error('Failed to save ingredients');
    }
  }
}));