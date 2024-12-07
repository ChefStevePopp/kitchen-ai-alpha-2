import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { getUserOrganization } from '@/lib/auth-helpers';
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
  saveIngredients: () => Promise<void>;
}

export const useMasterIngredientsStore = create<MasterIngredientsStore>((set, get) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { organizationId } = await getUserOrganization();

      const { data: ingredients, error: fetchError } = await supabase
        .from('master_ingredients_with_categories')
        .select('*')
        .eq('organization_id', organizationId)
        .order('product');

      if (fetchError) throw fetchError;

      const transformedData = ingredients?.map(row => ({
        id: row.id,
        itemCode: row.item_code,
        majorGroup: row.major_group,
        category: row.category,
        subCategory: row.sub_category,
        product: row.product,
        vendor: row.vendor,
        caseSize: row.case_size,
        unitsPerCase: row.units_per_case,
        currentPrice: row.current_price,
        unitOfMeasure: row.unit_of_measure,
        recipeUnitPerPurchaseUnit: row.recipe_unit_per_purchase_unit,
        recipeUnitType: row.recipe_unit_type,
        yieldPercent: row.yield_percent,
        costPerRecipeUnit: row.cost_per_recipe_unit,
        imageUrl: row.image_url,
        storageArea: row.storage_area,
        allergenPeanut: row.allergen_peanut,
        allergenCrustacean: row.allergen_crustacean,
        allergenTreenut: row.allergen_treenut,
        allergenShellfish: row.allergen_shellfish,
        allergenSesame: row.allergen_sesame,
        allergenSoy: row.allergen_soy,
        allergenFish: row.allergen_fish,
        allergenWheat: row.allergen_wheat,
        allergenMilk: row.allergen_milk,
        allergenSulphite: row.allergen_sulphite,
        allergenEgg: row.allergen_egg,
        allergenGluten: row.allergen_gluten,
        allergenMustard: row.allergen_mustard,
        allergenCelery: row.allergen_celery,
        allergenGarlic: row.allergen_garlic,
        allergenOnion: row.allergen_onion,
        allergenNitrite: row.allergen_nitrite,
        allergenMushroom: row.allergen_mushroom,
        allergenHotPepper: row.allergen_hot_pepper,
        allergenCitrus: row.allergen_citrus,
        allergenPork: row.allergen_pork,
        allergenCustom1Name: row.allergen_custom1_name,
        allergenCustom1Active: row.allergen_custom1_active,
        allergenCustom2Name: row.allergen_custom2_name,
        allergenCustom2Active: row.allergen_custom2_active,
        allergenCustom3Name: row.allergen_custom3_name,
        allergenCustom3Active: row.allergen_custom3_active,
        allergenNotes: row.allergen_notes,
        lastUpdated: row.last_updated,
        // Category display names from the view
        majorGroupName: row.major_group_name,
        categoryName: row.category_name,
        subCategoryName: row.sub_category_name,
        organizationId
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
      const { organizationId } = await getUserOrganization();

      const updateData = {
        item_code: updates.itemCode,
        major_group: updates.majorGroup,
        category: updates.category,
        sub_category: updates.subCategory,
        product: updates.product,
        vendor: updates.vendor,
        case_size: updates.caseSize,
        units_per_case: updates.unitsPerCase,
        current_price: updates.currentPrice,
        unit_of_measure: updates.unitOfMeasure,
        recipe_unit_per_purchase_unit: updates.recipeUnitPerPurchaseUnit,
        recipe_unit_type: updates.recipeUnitType,
        yield_percent: updates.yieldPercent,
        cost_per_recipe_unit: updates.costPerRecipeUnit,
        image_url: updates.imageUrl,
        storage_area: updates.storageArea,
        allergen_peanut: updates.allergenPeanut,
        allergen_crustacean: updates.allergenCrustacean,
        allergen_treenut: updates.allergenTreenut,
        allergen_shellfish: updates.allergenShellfish,
        allergen_sesame: updates.allergenSesame,
        allergen_soy: updates.allergenSoy,
        allergen_fish: updates.allergenFish,
        allergen_wheat: updates.allergenWheat,
        allergen_milk: updates.allergenMilk,
        allergen_sulphite: updates.allergenSulphite,
        allergen_egg: updates.allergenEgg,
        allergen_gluten: updates.allergenGluten,
        allergen_mustard: updates.allergenMustard,
        allergen_celery: updates.allergenCelery,
        allergen_garlic: updates.allergenGarlic,
        allergen_onion: updates.allergenOnion,
        allergen_nitrite: updates.allergenNitrite,
        allergen_mushroom: updates.allergenMushroom,
        allergen_hot_pepper: updates.allergenHotPepper,
        allergen_citrus: updates.allergenCitrus,
        allergen_pork: updates.allergenPork,
        allergen_custom1_name: updates.allergenCustom1Name,
        allergen_custom1_active: updates.allergenCustom1Active,
        allergen_custom2_name: updates.allergenCustom2Name,
        allergen_custom2_active: updates.allergenCustom2Active,
        allergen_custom3_name: updates.allergenCustom3Name,
        allergen_custom3_active: updates.allergenCustom3Active,
        allergen_notes: updates.allergenNotes,
        last_updated: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('master_ingredients')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', organizationId);

      if (updateError) throw updateError;

      // Fetch updated data to get the resolved category names
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
      const { organizationId } = await getUserOrganization();

      const importData = data.map(row => ({
        organization_id: organizationId,
        item_code: row['Item Code'] || row['Vendor Code'] || row['Bar Code'],
        product: row['Product Name'] || row['Common Name'],
        vendor: row['Vendor'],
        case_size: row['Case Size'],
        units_per_case: row['Units/Case'],
        current_price: parseFloat(row['Case Price']?.toString().replace(/[$,]/g, '') || '0'),
        unit_of_measure: row['Unit of Measure'] || row['Inventory Unit'],
        recipe_unit_per_purchase_unit: parseFloat(row['Recipe Units/Case']?.toString() || '0'),
        yield_percent: parseFloat(row['Yield %']?.toString().replace(/%/g, '') || '100'),
        cost_per_recipe_unit: parseFloat(row['Cost/Recipe Unit']?.toString().replace(/[$,]/g, '') || '0'),
        last_updated: new Date().toISOString()
      }));

      const { error: importError } = await supabase
        .from('master_ingredients')
        .upsert(importData, {
          onConflict: 'organization_id,item_code',
          ignoreDuplicates: false
        });

      if (importError) throw importError;

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
      const { organizationId } = await getUserOrganization();

      const { error: clearError } = await supabase
        .from('master_ingredients')
        .delete()
        .eq('organization_id', organizationId);

      if (clearError) throw clearError;
      
      set({ ingredients: [] });
      toast.success('Ingredients cleared successfully');
    } catch (error) {
      console.error('Error clearing ingredients:', error);
      toast.error('Failed to clear ingredients');
    }
  },

  saveIngredients: async () => {
    try {
      const { organizationId } = await getUserOrganization();
      const { ingredients } = get();
      
      // Process ingredients sequentially to avoid conflicts
      for (const ingredient of ingredients) {
        const { error: saveError } = await supabase
          .from('master_ingredients')
          .upsert({
            id: ingredient.id,
            organization_id: organizationId,
            item_code: ingredient.itemCode,
            major_group: ingredient.majorGroup,
            category: ingredient.category,
            sub_category: ingredient.subCategory,
            product: ingredient.product,
            vendor: ingredient.vendor,
            case_size: ingredient.caseSize,
            units_per_case: ingredient.unitsPerCase,
            current_price: ingredient.currentPrice,
            unit_of_measure: ingredient.unitOfMeasure,
            recipe_unit_per_purchase_unit: ingredient.recipeUnitPerPurchaseUnit,
            recipe_unit_type: ingredient.recipeUnitType,
            yield_percent: ingredient.yieldPercent,
            cost_per_recipe_unit: ingredient.costPerRecipeUnit,
            image_url: ingredient.imageUrl,
            storage_area: ingredient.storageArea,
            allergen_peanut: ingredient.allergenPeanut,
            allergen_crustacean: ingredient.allergenCrustacean,
            allergen_treenut: ingredient.allergenTreenut,
            allergen_shellfish: ingredient.allergenShellfish,
            allergen_sesame: ingredient.allergenSesame,
            allergen_soy: ingredient.allergenSoy,
            allergen_fish: ingredient.allergenFish,
            allergen_wheat: ingredient.allergenWheat,
            allergen_milk: ingredient.allergenMilk,
            allergen_sulphite: ingredient.allergenSulphite,
            allergen_egg: ingredient.allergenEgg,
            allergen_gluten: ingredient.allergenGluten,
            allergen_mustard: ingredient.allergenMustard,
            allergen_celery: ingredient.allergenCelery,
            allergen_garlic: ingredient.allergenGarlic,
            allergen_onion: ingredient.allergenOnion,
            allergen_nitrite: ingredient.allergenNitrite,
            allergen_mushroom: ingredient.allergenMushroom,
            allergen_hot_pepper: ingredient.allergenHotPepper,
            allergen_citrus: ingredient.allergenCitrus,
            allergen_pork: ingredient.allergenPork,
            allergen_custom1_name: ingredient.allergenCustom1Name,
            allergen_custom1_active: ingredient.allergenCustom1Active,
            allergen_custom2_name: ingredient.allergenCustom2Name,
            allergen_custom2_active: ingredient.allergenCustom2Active,
            allergen_custom3_name: ingredient.allergenCustom3Name,
            allergen_custom3_active: ingredient.allergenCustom3Active,
            allergen_notes: ingredient.allergenNotes,
            last_updated: new Date().toISOString()
          }, {
            onConflict: 'id,organization_id'
          });

        if (saveError) throw saveError;
      }
      
      toast.success('Ingredients saved successfully');
    } catch (error) {
      console.error('Error saving ingredients:', error);
      toast.error('Failed to save ingredients');
      throw error;
    }
  }
}));