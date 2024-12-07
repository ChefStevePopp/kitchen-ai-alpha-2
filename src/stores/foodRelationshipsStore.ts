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

      set({ 
        groups: data.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          icon: group.icon,
          color: group.color,
          sortOrder: group.sort_order,
          createdAt: group.created_at,
          updatedAt: group.updated_at
        }))
      });
    } catch (error) {
      console.error('Error fetching food category groups:', error);
      set({ error: 'Failed to load category groups' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async (groupId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      let query = supabase
        .from('food_categories')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId)
        .order('sort_order');

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ 
        categories: data.map(category => ({
          id: category.id,
          groupId: category.group_id,
          name: category.name,
          description: category.description,
          sortOrder: category.sort_order,
          createdAt: category.created_at,
          updatedAt: category.updated_at
        }))
      });
    } catch (error) {
      console.error('Error fetching food categories:', error);
      set({ error: 'Failed to load categories' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSubCategories: async (categoryId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      let query = supabase
        .from('food_sub_categories')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId)
        .order('sort_order');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ 
        subCategories: data.map(subCategory => ({
          id: subCategory.id,
          categoryId: subCategory.category_id,
          name: subCategory.name,
          description: subCategory.description,
          sortOrder: subCategory.sort_order,
          createdAt: subCategory.created_at,
          updatedAt: subCategory.updated_at
        }))
      });
    } catch (error) {
      console.error('Error fetching food sub-categories:', error);
      set({ error: 'Failed to load sub-categories' });
    } finally {
      set({ isLoading: false });
    }
  },

  addGroup: async (group) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('food_category_groups')
        .insert({
          organization_id: user.user_metadata.organizationId,
          name: group.name,
          description: group.description,
          icon: group.icon,
          color: group.color,
          sort_order: group.sortOrder
        });

      if (error) throw error;

      await get().fetchGroups();
      toast.success('Category group added successfully');
    } catch (error) {
      console.error('Error adding category group:', error);
      toast.error('Failed to add category group');
    }
  },

  updateGroup: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('food_category_groups')
        .update({
          name: updates.name,
          description: updates.description,
          icon: updates.icon,
          color: updates.color,
          sort_order: updates.sortOrder
        })
        .eq('id', id);

      if (error) throw error;

      await get().fetchGroups();
      toast.success('Category group updated successfully');
    } catch (error) {
      console.error('Error updating category group:', error);
      toast.error('Failed to update category group');
    }
  },

  deleteGroup: async (id) => {
    try {
      const { error } = await supabase
        .from('food_category_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchGroups();
      toast.success('Category group deleted successfully');
    } catch (error) {
      console.error('Error deleting category group:', error);
      toast.error('Failed to delete category group');
    }
  },

  addCategory: async (category) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('food_categories')
        .insert({
          organization_id: user.user_metadata.organizationId,
          group_id: category.groupId,
          name: category.name,
          description: category.description,
          sort_order: category.sortOrder
        });

      if (error) throw error;

      await get().fetchCategories(category.groupId);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('food_categories')
        .update({
          name: updates.name,
          description: updates.description,
          sort_order: updates.sortOrder
        })
        .eq('id', id);

      if (error) throw error;

      const category = get().categories.find(c => c.id === id);
      if (category) {
        await get().fetchCategories(category.groupId);
      }
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  },

  deleteCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('food_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const category = get().categories.find(c => c.id === id);
      if (category) {
        await get().fetchCategories(category.groupId);
      }
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  },

  addSubCategory: async (subCategory) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('food_sub_categories')
        .insert({
          organization_id: user.user_metadata.organizationId,
          category_id: subCategory.categoryId,
          name: subCategory.name,
          description: subCategory.description,
          sort_order: subCategory.sortOrder
        });

      if (error) throw error;

      await get().fetchSubCategories(subCategory.categoryId);
      toast.success('Sub-category added successfully');
    } catch (error) {
      console.error('Error adding sub-category:', error);
      toast.error('Failed to add sub-category');
    }
  },

  updateSubCategory: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('food_sub_categories')
        .update({
          name: updates.name,
          description: updates.description,
          sort_order: updates.sortOrder
        })
        .eq('id', id);

      if (error) throw error;

      const subCategory = get().subCategories.find(sc => sc.id === id);
      if (subCategory) {
        await get().fetchSubCategories(subCategory.categoryId);
      }
      toast.success('Sub-category updated successfully');
    } catch (error) {
      console.error('Error updating sub-category:', error);
      toast.error('Failed to update sub-category');
    }
  },

  deleteSubCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('food_sub_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const subCategory = get().subCategories.find(sc => sc.id === id);
      if (subCategory) {
        await get().fetchSubCategories(subCategory.categoryId);
      }
      toast.success('Sub-category deleted successfully');
    } catch (error) {
      console.error('Error deleting sub-category:', error);
      toast.error('Failed to delete sub-category');
    }
  }
}));