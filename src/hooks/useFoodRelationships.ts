import { useState, useEffect } from 'react';
import { useFoodRelationshipsStore } from '@/stores/foodRelationshipsStore';

export function useFoodRelationships(organizationId: string, initialGroup?: string | null, initialCategory?: string | null) {
  const { 
    groups,
    categories,
    subCategories,
    fetchGroups,
    fetchCategories,
    fetchSubCategories,
    isLoading,
    error
  } = useFoodRelationshipsStore();

  const [selectedGroup, setSelectedGroup] = useState<string | null>(initialGroup || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  // Initial fetch of all groups
  useEffect(() => {
    if (organizationId) {
      fetchGroups();
    }
  }, [organizationId, fetchGroups]);

  // Initial fetch of categories if we have an initial group
  useEffect(() => {
    if (initialGroup) {
      fetchCategories(initialGroup);
    }
  }, [initialGroup, fetchCategories]);

  // Initial fetch of sub-categories if we have an initial category
  useEffect(() => {
    if (initialCategory) {
      fetchSubCategories(initialCategory);
    }
  }, [initialCategory, fetchSubCategories]);

  // Fetch categories when group changes
  useEffect(() => {
    if (selectedGroup) {
      fetchCategories(selectedGroup);
    }
  }, [selectedGroup, fetchCategories]);

  // Fetch sub-categories when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory, fetchSubCategories]);

  // Get filtered lists based on organization
  const filteredGroups = groups.filter(g => g.organization_id === organizationId);
  const filteredCategories = categories.filter(c => 
    c.organization_id === organizationId && 
    c.group_id === selectedGroup
  );
  const filteredSubCategories = subCategories.filter(s => 
    s.organization_id === organizationId && 
    s.category_id === selectedCategory
  );

  return {
    groups: filteredGroups,
    categories: filteredCategories,
    subCategories: filteredSubCategories,
    selectedGroup,
    selectedCategory,
    setSelectedGroup,
    setSelectedCategory,
    isLoading,
    error
  };
}