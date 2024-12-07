import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { PreparedItem, PreparedItemsStore } from '../types/prepared-items';
import toast from 'react-hot-toast';

export const usePreparedItemsStore = create<PreparedItemsStore>((set, get) => ({
  items: [],
  isLoading: false,
  isImporting: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const organizationId = user?.user_metadata?.organizationId;
      
      if (!organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('prepared_items')
        .select('*')
        .eq('organization_id', organizationId)
        .order('product');

      if (error) throw error;

      const transformedData = data.map(item => ({
        id: item.id,
        itemId: item.item_id,
        category: item.category,
        product: item.product,
        station: item.station,
        subCategory: item.sub_category,
        storageArea: item.storage_area,
        container: item.container,
        containerType: item.container_type,
        shelfLife: item.shelf_life,
        recipeUnit: item.recipe_unit,
        costPerRecipeUnit: item.cost_per_recipe_unit,
        yieldPercent: item.yield_percent,
        finalCost: item.final_cost,
        allergens: Object.entries(item)
          .filter(([key, value]) => key.startsWith('allergen_') && value === true)
          .map(([key]) => key.replace('allergen_', '')),
        lastUpdated: item.updated_at
      }));

      set({ items: transformedData });
    } catch (error) {
      console.error('Error fetching prepared items:', error);
      toast.error('Failed to load prepared items');
    } finally {
      set({ isLoading: false });
    }
  },

  importItems: async (data: any[]) => {
    set({ isImporting: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const organizationId = user?.user_metadata?.organizationId;
      
      if (!organizationId) {
        throw new Error('No organization ID found');
      }

      // Process and validate import data
      const importData = data.map(row => ({
        organization_id: organizationId,
        item_id: row['Item ID']?.toString().trim(),
        category: row['CATEGORY']?.toString().trim(),
        product: row['PRODUCT']?.toString().trim(),
        station: row['STATION']?.toString().trim(),
        sub_category: row['SUB CATEGORY']?.toString().trim(),
        storage_area: row['STORAGE AREA']?.toString().trim(),
        container: row['CONTAINER']?.toString().trim(),
        container_type: row['CONTAINER TYPE']?.toString().trim(),
        shelf_life: row['SHELF LIFE']?.toString().trim(),
        recipe_unit: row['RECIPE UNIT']?.toString().trim(),
        cost_per_recipe_unit: parseFloat(row['COST PER R/U']?.toString().replace(/[$,]/g, '') || '0'),
        yield_percent: parseFloat(row['YIELD %']?.toString().replace(/%/g, '') || '100'),
        final_cost: parseFloat(row['FINAL $']?.toString().replace(/[$,]/g, '') || '0'),
        
        // Allergens
        allergen_peanut: row['Peanut'] === '1',
        allergen_crustacean: row['Crustacean'] === '1',
        allergen_treenut: row['Tree Nut'] === '1',
        allergen_shellfish: row['Shellfish'] === '1',
        allergen_sesame: row['Sesame'] === '1',
        allergen_soy: row['Soy'] === '1',
        allergen_fish: row['Fish'] === '1',
        allergen_wheat: row['Wheat'] === '1',
        allergen_milk: row['Milk'] === '1',
        allergen_sulphite: row['Sulphite'] === '1',
        allergen_egg: row['Egg'] === '1',
        allergen_gluten: row['Gluten'] === '1',
        allergen_mustard: row['Mustard'] === '1',
        allergen_celery: row['Celery'] === '1',
        allergen_garlic: row['Garlic'] === '1',
        allergen_onion: row['Onion'] === '1',
        allergen_nitrite: row['Nitrite'] === '1',
        allergen_mushroom: row['Mushroom'] === '1',
        allergen_hot_pepper: row['Hot Pepper'] === '1',
        allergen_citrus: row['Citrus'] === '1',
        allergen_pork: row['Pork'] === '1',
        
        // Custom allergens
        allergen_custom1_name: row['Custom Allergen 1 Name']?.toString().trim(),
        allergen_custom1_active: row['Custom Allergen 1 Active'] === '1',
        allergen_custom2_name: row['Custom Allergen 2 Name']?.toString().trim(),
        allergen_custom2_active: row['Custom Allergen 2 Active'] === '1',
        allergen_custom3_name: row['Custom Allergen 3 Name']?.toString().trim(),
        allergen_custom3_active: row['Custom Allergen 3 Active'] === '1',
        allergen_notes: row['Allergen Notes']?.toString().trim()
      }));

      // Insert data into Supabase
      const { error } = await supabase
        .from('prepared_items')
        .upsert(importData, {
          onConflict: 'organization_id,item_id',
          ignoreDuplicates: false
        });

      if (error) throw error;

      // Refresh the items list
      await get().fetchItems();
      toast.success('Prepared items imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to import prepared items');
      }
      throw error;
    } finally {
      set({ isImporting: false });
    }
  },

  clearItems: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const organizationId = user?.user_metadata?.organizationId;
      
      if (!organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('prepared_items')
        .delete()
        .eq('organization_id', organizationId);

      if (error) throw error;
      
      set({ items: [] });
      toast.success('Prepared items cleared successfully');
    } catch (error) {
      console.error('Error clearing items:', error);
      toast.error('Failed to clear prepared items');
    }
  },

  saveItems: async () => {
    try {
      const { items } = get();
      const { data: { user } } = await supabase.auth.getUser();
      const organizationId = user?.user_metadata?.organizationId;
      
      if (!organizationId) {
        throw new Error('No organization ID found');
      }

      // Update all items
      for (const item of items) {
        const { error } = await supabase
          .from('prepared_items')
          .upsert({
            organization_id: organizationId,
            ...item
          });

        if (error) throw error;
      }

      toast.success('Prepared items saved successfully');
    } catch (error) {
      console.error('Error saving items:', error);
      toast.error('Failed to save prepared items');
    }
  }
}));