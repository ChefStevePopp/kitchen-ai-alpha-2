import React, { useEffect } from 'react';
import { useFoodRelationships } from '@/hooks/useFoodRelationships';

interface CategorySelectorProps {
  organizationId: string;
  majorGroup: string | null;
  category: string | null;
  subCategory: string | null;
  onMajorGroupChange: (id: string | null) => void;
  onCategoryChange: (id: string | null) => void;
  onSubCategoryChange: (id: string | null) => void;
  className?: string;
  disabled?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  organizationId,
  majorGroup,
  category,
  subCategory,
  onMajorGroupChange,
  onCategoryChange,
  onSubCategoryChange,
  className = '',
  disabled = false
}) => {
  const {
    groups,
    categories,
    subCategories,
    isLoading,
    error,
    setSelectedGroup,
    setSelectedCategory
  } = useFoodRelationships(organizationId, majorGroup, category);

  // Keep internal state in sync with props
  useEffect(() => {
    if (majorGroup) {
      setSelectedGroup(majorGroup);
    }
  }, [majorGroup, setSelectedGroup]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category, setSelectedCategory]);

  if (error) {
    return (
      <div className="text-red-400 text-sm p-2 bg-red-500/10 rounded-lg">
        Failed to load categories: {error}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {/* Major Group */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Major Group
        </label>
        <select
          value={majorGroup || ''}
          onChange={(e) => {
            const value = e.target.value || null;
            onMajorGroupChange(value);
            onCategoryChange(null); // Reset child selections
            onSubCategoryChange(null);
          }}
          className="input w-full"
          disabled={disabled || isLoading}
        >
          <option value="">Select major group...</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Category
        </label>
        <select
          value={category || ''}
          onChange={(e) => {
            const value = e.target.value || null;
            onCategoryChange(value);
            onSubCategoryChange(null); // Reset sub-category
          }}
          className="input w-full"
          disabled={disabled || isLoading || !majorGroup}
        >
          <option value="">Select category...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Category */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Sub-Category
        </label>
        <select
          value={subCategory || ''}
          onChange={(e) => {
            const value = e.target.value || null;
            onSubCategoryChange(value);
          }}
          className="input w-full"
          disabled={disabled || isLoading || !category}
        >
          <option value="">Select sub-category...</option>
          {subCategories.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};