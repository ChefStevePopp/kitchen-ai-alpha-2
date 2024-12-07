import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Save, X, AlertTriangle,
  ArrowUpCircle, ArrowDownCircle,
  Box, Tags, Package, Info
} from 'lucide-react';
import { useFoodRelationshipsStore } from '@/stores/foodRelationshipsStore';
import toast from 'react-hot-toast';

// Example major groups with descriptions
const EXAMPLE_GROUPS = [
  {
    name: 'Food',
    description: 'All food items including prepared dishes, ingredients, and components',
    icon: 'Package',
    color: 'primary'
  },
  {
    name: 'Beverage',
    description: 'Non-alcoholic beverages including soft drinks, coffee, tea, and juices',
    icon: 'Coffee',
    color: 'amber'
  },
  {
    name: 'Alcohol',
    description: 'Alcoholic beverages including beer, wine, and spirits',
    icon: 'Wine',
    color: 'rose'
  }
];

export const FoodRelationshipsManager: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string, value: string, description?: string } | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  
  const {
    groups,
    categories,
    subCategories,
    isLoading,
    error,
    fetchGroups,
    fetchCategories,
    fetchSubCategories,
    addGroup,
    updateGroup,
    deleteGroup,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useFoodRelationshipsStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroup) {
      fetchCategories(selectedGroup);
    }
  }, [selectedGroup, fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory, fetchSubCategories]);

  const handleAddGroup = async () => {
    if (!newItemName.trim()) return;

    try {
      await addGroup({
        name: newItemName.trim(),
        description: newItemDescription.trim(),
        icon: 'Box',
        color: 'primary',
        sortOrder: groups.length
      });
      setNewItemName('');
      setNewItemDescription('');
      setIsAddingGroup(false);
      toast.success('Major group added successfully');
    } catch (error) {
      console.error('Error adding major group:', error);
      toast.error('Failed to add major group');
    }
  };

  const handleAddCategory = async () => {
    if (!newItemName.trim() || !selectedGroup) return;

    try {
      await addCategory({
        groupId: selectedGroup,
        name: newItemName.trim(),
        description: newItemDescription.trim(),
        sortOrder: categories.length
      });
      setNewItemName('');
      setNewItemDescription('');
      setIsAddingCategory(false);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddSubCategory = async () => {
    if (!newItemName.trim() || !selectedCategory) return;

    try {
      await addSubCategory({
        categoryId: selectedCategory,
        name: newItemName.trim(),
        description: newItemDescription.trim(),
        sortOrder: subCategories.length
      });
      setNewItemName('');
      setNewItemDescription('');
      setIsAddingSubCategory(false);
      toast.success('Sub-category added successfully');
    } catch (error) {
      console.error('Error adding sub-category:', error);
      toast.error('Failed to add sub-category');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const itemType = groups.find(g => g.id === editingItem.id) ? 'group' :
                      categories.find(c => c.id === editingItem.id) ? 'category' :
                      'subcategory';

      switch (itemType) {
        case 'group':
          await updateGroup(editingItem.id, { 
            name: editingItem.value,
            description: editingItem.description 
          });
          break;
        case 'category':
          await updateCategory(editingItem.id, { 
            name: editingItem.value,
            description: editingItem.description 
          });
          break;
        case 'subcategory':
          await updateSubCategory(editingItem.id, { 
            name: editingItem.value,
            description: editingItem.description 
          });
          break;
      }

      setEditingItem(null);
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string, type: 'group' | 'category' | 'subcategory') => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

    try {
      switch (type) {
        case 'group':
          await deleteGroup(id);
          if (selectedGroup === id) {
            setSelectedGroup(null);
            setSelectedCategory(null);
          }
          break;
        case 'category':
          await deleteCategory(id);
          if (selectedCategory === id) {
            setSelectedCategory(null);
          }
          break;
        case 'subcategory':
          await deleteSubCategory(id);
          break;
      }
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        src/features/admin/components/sections/FoodRelationshipsManager/index.tsx
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Food Relationships</h1>
        <p className="text-purple-400">
          Configure and manage hierarchical relationships between food categories, enabling better organization and classification of your inventory items.
        </p>
        <div className="bg-purple-500/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-purple-400 font-medium">Organization Structure</h3>
              <p className="text-sm text-gray-300">
                Create a three-tiered classification system:
              </p>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                <li>Major Groups (e.g., Food, Beverage, Alcohol)</li>
                <li>Categories (e.g., Proteins, Produce, Spirits)</li>
                <li>Sub-categories (e.g., Beef, Leafy Greens, Whiskey)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Major Groups Column */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between h-14 mb-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Major Groups</h3>
            <button
              onClick={() => setIsAddingGroup(true)}
              className="btn-ghost text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </button>
          </div>

          {isAddingGroup && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <div className="space-y-4">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="input w-full"
                  placeholder="Enter major group name"
                  autoFocus
                />
                <textarea
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="input w-full h-20"
                  placeholder="Enter group description (optional)"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsAddingGroup(false);
                      setNewItemName('');
                      setNewItemDescription('');
                    }}
                    className="btn-ghost"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAddGroup}
                    className="btn-primary"
                    disabled={!newItemName.trim()}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Example Groups Info */}
          {groups.length === 0 && !isAddingGroup && (
            <div className="bg-purple-500/10 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-purple-400 mb-2">Example Major Groups</h4>
              <div className="space-y-3">
                {EXAMPLE_GROUPS.map((group, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="font-medium text-white mb-1">{group.name}</div>
                    <p className="text-sm text-gray-400">{group.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {groups.map((group, index) => {
              const Icon = {
                Box,
                Tags,
                Package
              }[group.icon as keyof typeof Box] || Box;

              return (
                <div
                  key={group.id}
                  className={`p-4 rounded-lg transition-colors ${
                    selectedGroup === group.id
                      ? 'bg-gray-700'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${group.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${group.color}-400`} />
                    </div>
                    {editingItem?.id === group.id ? (
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={editingItem.value}
                          onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                          className="input w-full"
                          autoFocus
                        />
                        <textarea
                          value={editingItem.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="input w-full h-20"
                          placeholder="Enter description (optional)"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleUpdateItem}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <button
                            onClick={() => {
                              setSelectedGroup(group.id);
                              setSelectedCategory(null);
                            }}
                            className="text-white font-medium text-left block w-full"
                          >
                            {group.name}
                          </button>
                          {group.description && (
                            <p className="text-sm text-gray-400 mt-1">{group.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={() => updateGroup(group.id, { sortOrder: group.sortOrder - 1 })}
                              className="text-gray-400 hover:text-white"
                            >
                              <ArrowUpCircle className="w-4 h-4" />
                            </button>
                          )}
                          {index < groups.length - 1 && (
                            <button
                              onClick={() => updateGroup(group.id, { sortOrder: group.sortOrder + 1 })}
                              className="text-gray-400 hover:text-white"
                            >
                              <ArrowDownCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingItem({ 
                              id: group.id, 
                              value: group.name,
                              description: group.description 
                            })}
                            className="text-gray-400 hover:text-primary-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(group.id, 'group')}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Column */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between h-14 mb-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            {selectedGroup && (
              <button
                onClick={() => setIsAddingCategory(true)}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            )}
          </div>

          {!selectedGroup ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Major Group</h3>
              <p className="text-gray-400 max-w-md">
                Choose a major group from the left to view and manage its categories
              </p>
            </div>
          ) : (
            <>
              {isAddingCategory && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="input w-full"
                      placeholder="Enter category name"
                      autoFocus
                    />
                    <textarea
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      className="input w-full h-20"
                      placeholder="Enter description (optional)"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsAddingCategory(false);
                          setNewItemName('');
                          setNewItemDescription('');
                        }}
                        className="btn-ghost"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleAddCategory}
                        className="btn-primary"
                        disabled={!newItemName.trim()}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {categories
                  .filter(cat => cat.groupId === selectedGroup)
                  .map((category, index) => (
                    <div
                      key={category.id}
                      className={`p-4 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-gray-700'
                          : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                    >
                      {editingItem?.id === category.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingItem.value}
                            onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                            className="input w-full"
                            autoFocus
                          />
                          <textarea
                            value={editingItem.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className="input w-full h-20"
                            placeholder="Enter description (optional)"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleUpdateItem}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <button
                              onClick={() => setSelectedCategory(category.id)}
                              className="text-white font-medium text-left block w-full"
                            >
                              {category.name}
                            </button>
                            {category.description && (
                              <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {index > 0 && (
                              <button
                                onClick={() => updateCategory(category.id, { sortOrder: category.sortOrder - 1 })}
                                className="text-gray-400 hover:text-white"
                              >
                                <ArrowUpCircle className="w-4 h-4" />
                              </button>
                            )}
                            {index < categories.length - 1 && (
                              <button
                                onClick={() => updateCategory(category.id, { sortOrder: category.sortOrder + 1 })}
                                className="text-gray-400 hover:text-white"
                              >
                                <ArrowDownCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingItem({ 
                                id: category.id, 
                                value: category.name,
                                description: category.description 
                              })}
                              className="text-gray-400 hover:text-primary-400"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(category.id, 'category')}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Sub-Categories Column */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between h-14 mb-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Sub-Categories</h3>
            {selectedCategory && (
              <button
                onClick={() => setIsAddingSubCategory(true)}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sub-Category
              </button>
            )}
          </div>

          {!selectedCategory ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Category</h3>
              <p className="text-gray-400 max-w-md">
                Choose a category from the middle column to view and manage its sub-categories
              </p>
            </div>
          ) : (
            <>
              {isAddingSubCategory && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="input w-full"
                      placeholder="Enter sub-category name"
                      autoFocus
                    />
                    <textarea
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      className="input w-full h-20"
                      placeholder="Enter description (optional)"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsAddingSubCategory(false);
                          setNewItemName('');
                          setNewItemDescription('');
                        }}
                        className="btn-ghost"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleAddSubCategory}
                        className="btn-primary"
                        disabled={!newItemName.trim()}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {subCategories
                  .filter(sub => sub.categoryId === selectedCategory)
                  .map((subCategory, index) => (
                    <div
                      key={subCategory.id}
                      className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      {editingItem?.id === subCategory.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingItem.value}
                            onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                            className="input w-full"
                            autoFocus
                          />
                          <textarea
                            value={editingItem.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className="input w-full h-20"
                            placeholder="Enter description (optional)"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleUpdateItem}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="text-white font-medium">{subCategory.name}</span>
                            {subCategory.description && (
                              <p className="text-sm text-gray-400 mt-1">{subCategory.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {index > 0 && (
                              <button
                                onClick={() => updateSubCategory(subCategory.id, { sortOrder: subCategory.sortOrder - 1 })}
                                className="text-gray-400 hover:text-white"
                              >
                                <ArrowUpCircle className="w-4 h-4" />
                              </button>
                            )}
                            {index < subCategories.length - 1 && (
                              <button
                                onClick={() => updateSubCategory(subCategory.id, { sortOrder: subCategory.sortOrder + 1 })}
                                className="text-gray-400 hover:text-white"
                              >
                                <ArrowDownCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingItem({ 
                                id: subCategory.id, 
                                value: subCategory.name,
                                description: subCategory.description 
                              })}
                              className="text-gray-400 hover:text-primary-400"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(subCategory.id, 'subcategory')}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};