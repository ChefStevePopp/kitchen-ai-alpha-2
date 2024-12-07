import React, { useState, useEffect } from 'react';
import { 
  Box, Plus, Trash2, Edit2, Save, X, AlertTriangle,
  Beef, Fish, Carrot, Wheat, Coffee, Package,
  ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { useFoodRelationshipsStore } from '@/stores/foodRelationshipsStore';
import toast from 'react-hot-toast';

// Define color schemes for different group types
const GROUP_COLORS = {
  proteins: { bg: 'bg-rose-500/20', text: 'text-rose-400', hover: 'hover:bg-rose-500/30' },
  produce: { bg: 'bg-green-500/20', text: 'text-green-400', hover: 'hover:bg-green-500/30' },
  grains: { bg: 'bg-amber-500/20', text: 'text-amber-400', hover: 'hover:bg-amber-500/30' },
  dairy: { bg: 'bg-blue-500/20', text: 'text-blue-400', hover: 'hover:bg-blue-500/30' },
  beverages: { bg: 'bg-purple-500/20', text: 'text-purple-400', hover: 'hover:bg-purple-500/30' },
  default: { bg: 'bg-gray-500/20', text: 'text-gray-400', hover: 'hover:bg-gray-500/30' }
};

// Helper to get icon component
const getGroupIcon = (name: string) => {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('protein') || normalizedName.includes('meat')) return Beef;
  if (normalizedName.includes('seafood')) return Fish;
  if (normalizedName.includes('produce')) return Carrot;
  if (normalizedName.includes('grain')) return Wheat;
  if (normalizedName.includes('beverage')) return Coffee;
  return Package;
};

export const FoodRelationshipsManager: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string, value: string } | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: '', description: '' });
  
  const {
    groups,
    categories,
    subCategories,
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
    if (!newGroupData.name) return;

    try {
      await addGroup({
        name: newGroupData.name,
        description: newGroupData.description,
        icon: getGroupIcon(newGroupData.name).name,
        color: 'primary',
        sortOrder: groups.length
      });
      setIsAddingGroup(false);
      setNewGroupData({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding group:', error);
      toast.error('Failed to add group');
    }
  };

  const handleAddCategory = async () => {
    if (!selectedGroup) return;
    
    const name = prompt('Enter category name:');
    if (!name) return;

    try {
      await addCategory({
        groupId: selectedGroup,
        name,
        sortOrder: categories.length,
        description: ''
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddSubCategory = async () => {
    if (!selectedCategory) return;
    
    const name = prompt('Enter sub-category name:');
    if (!name) return;

    try {
      await addSubCategory({
        categoryId: selectedCategory,
        name,
        sortOrder: subCategories.length,
        description: ''
      });
    } catch (error) {
      console.error('Error adding sub-category:', error);
      toast.error('Failed to add sub-category');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      if (selectedCategory) {
        await updateSubCategory(editingItem.id, { name: editingItem.value });
      } else if (selectedGroup) {
        await updateCategory(editingItem.id, { name: editingItem.value });
      }
      setEditingItem(null);
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
          setSelectedGroup(null);
          break;
        case 'category':
          await deleteCategory(id);
          setSelectedCategory(null);
          break;
        case 'subcategory':
          await deleteSubCategory(id);
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleMoveItem = async (id: string, direction: 'up' | 'down', type: 'group' | 'category' | 'subcategory') => {
    const items = type === 'group' ? groups 
                : type === 'category' ? categories 
                : subCategories;
    
    const currentIndex = items.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    try {
      const updates = {
        sortOrder: items[newIndex].sortOrder
      };

      switch (type) {
        case 'group':
          await updateGroup(id, updates);
          break;
        case 'category':
          await updateCategory(id, updates);
          break;
        case 'subcategory':
          await updateSubCategory(id, updates);
          break;
      }
    } catch (error) {
      console.error('Error moving item:', error);
      toast.error('Failed to move item');
    }
  };

  return (
    <div className="space-y-6">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        src/features/admin/components/sections/OperationsManager/FoodRelationshipsManager.tsx
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Groups */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Category Groups</h3>
            <button
              onClick={() => setIsAddingGroup(true)}
              className="btn-ghost text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </button>
          </div>

          {isAddingGroup ? (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <input
                type="text"
                value={newGroupData.name}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                className="input w-full mb-2"
                placeholder="Group name"
                autoFocus
              />
              <textarea
                value={newGroupData.description}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                className="input w-full mb-4"
                placeholder="Description (optional)"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingGroup(false)}
                  className="btn-ghost text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  className="btn-primary text-sm"
                  disabled={!newGroupData.name}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Group
                </button>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            {groups.map((group, index) => {
              const Icon = getGroupIcon(group.name);
              const colors = GROUP_COLORS[group.name.toLowerCase() as keyof typeof GROUP_COLORS] || GROUP_COLORS.default;

              return (
                <div
                  key={group.id}
                  className={`p-3 rounded-lg transition-colors group ${
                    selectedGroup === group.id
                      ? colors.bg
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedGroup(group.id);
                        setSelectedCategory(null);
                      }}
                      className={`flex-1 text-left ${
                        selectedGroup === group.id
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {group.name}
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => handleMoveItem(group.id, 'up', 'group')}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <ArrowUpCircle className="w-4 h-4" />
                        </button>
                      )}
                      {index < groups.length - 1 && (
                        <button
                          onClick={() => handleMoveItem(group.id, 'down', 'group')}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <ArrowDownCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingItem({ id: group.id, value: group.name })}
                        className="text-gray-400 hover:text-primary-400 p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(group.id, 'group')}
                        className="text-gray-400 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {group.description && (
                    <p className="text-sm text-gray-400 mt-2 ml-11">{group.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Categories</h3>
            {selectedGroup && (
              <button
                onClick={handleAddCategory}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            )}
          </div>
          {selectedGroup ? (
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 group"
                >
                  {editingItem?.id === category.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingItem.value}
                        onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                        className="input flex-1"
                        autoFocus
                      />
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
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                        }}
                        className="text-gray-300 hover:text-white flex-1 text-left"
                      >
                        {category.name}
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => handleMoveItem(category.id, 'up', 'category')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                          </button>
                        )}
                        {index < categories.length - 1 && (
                          <button
                            onClick={() => handleMoveItem(category.id, 'down', 'category')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <ArrowDownCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingItem({ id: category.id, value: category.name })}
                          className="text-gray-400 hover:text-primary-400 p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(category.id, 'category')}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Group</h3>
              <p className="text-gray-400 max-w-md">
                Choose a category group from the left to view and manage its categories.
              </p>
            </div>
          )}
        </div>

        {/* Sub-Categories */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Sub-Categories</h3>
            {selectedCategory && (
              <button
                onClick={handleAddSubCategory}
                className="btn-ghost text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sub-Category
              </button>
            )}
          </div>
          {selectedCategory ? (
            <div className="space-y-2">
              {subCategories.map((subCategory, index) => (
                <div
                  key={subCategory.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 group"
                >
                  {editingItem?.id === subCategory.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingItem.value}
                        onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                        className="input flex-1"
                        autoFocus
                      />
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
                  ) : (
                    <>
                      <span className="text-gray-300">{subCategory.name}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => handleMoveItem(subCategory.id, 'up', 'subcategory')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                          </button>
                        )}
                        {index < subCategories.length - 1 && (
                          <button
                            onClick={() => handleMoveItem(subCategory.id, 'down', 'subcategory')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <ArrowDownCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingItem({ id: subCategory.id, value: subCategory.name })}
                          className="text-gray-400 hover:text-primary-400 p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(subCategory.id, 'subcategory')}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Category</h3>
              <p className="text-gray-400 max-w-md">
                Choose a category from the middle column to view and manage its sub-categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};