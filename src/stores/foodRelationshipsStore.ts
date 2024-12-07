import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { 
  FoodCategoryGroup, 
  FoodCategory, 
  FoodSubCategory,
  FoodRelationshipsStore 
} from '@/types/food-relationships';
import toast from 'react-hot-toast';

export const useFoodRelationshipsStore = create<FoodRelationshipsStore>((set, get) => ({
  groups: [],
  categories: [],
  subCategories: [],
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('food_category_groups')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId)
        .order('sort_order');

      if (error) throw error;
      set({ groups: data || [], error: null });
    } catch (error) {
      console.error('Error fetching food category groups:', error);
      set({ error: 'Failed to load category groups', groups: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async (groupId: string) => {
    if (!groupId) return;
    
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('food_categories')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId)
        .eq('group_id', groupId)
        .order('sort_order');

      if (error) throw error;
      set({ categories: data || [], error: null });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: 'Failed to load categories', categories: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSubCategories: async (categoryId: string) => {
    if (!categoryId) return;
    
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('food_sub_categories')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId)
        .eq('category_id', categoryId)
        .order('sort_order');

      if (error) throw error;
      set({ subCategories: data || [], error: null });
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
      set({ error: 'Failed to load sub-categories', subCategories: [] });
    } finally {
      set({ isLoading: false });
    }
  }
}));