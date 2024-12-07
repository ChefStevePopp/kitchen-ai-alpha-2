import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Save, X, AlertTriangle,
  ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { useFoodRelationshipsStore } from '@/stores/foodRelationshipsStore';
import toast from 'react-hot-toast';

interface FoodRelationshipsManagerProps {
  majorGroup: {
    id: string;
    name: string;
    icon: React.ComponentType;
    color: string;
    description: string;
  };
  activeCategory: string | null;
}

export const FoodRelationshipsManager: React.FC<FoodRelationshipsManagerProps> = ({
  majorGroup,
  activeCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string, value: string } | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  
  const {
    categories,
    subCategories,
    isLoading,
    error,
    fetchCategories,
    fetchSubCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useFoodRelationshipsStore();

  useEffect(() => {
    fetchCategories(majorGroup.id);
  }, [majorGroup.id, fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory, fetchSubCategories]);

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      if (categories.find(c => c.id === editingItem.id)) {
        await updateCategory(editingItem.id, { name: editingItem.value });
      } else {
        await updateSubCategory(editingItem.id, { name: editingItem.value });
      }
      setEditingItem(null);
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleAddCategory = async () => {
    if (!newItemName.trim()) return;

    try {
      await addCategory({
        groupId: majorGroup.id,
        name: newItemName.trim(),
        description: '',
        sortOrder: categories.length
      });
      setNewItemName('');
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
        description: '',
        sortOrder: subCategories.length
      });
      setNewItemName('');
      setIsAddingSubCategory(false);
      toast.success('Sub-category added successfully');
    } catch (error) {
      console.error('Error adding sub-category:', error);
      toast.error('Failed to add sub-category');
    }
  };

  const handleDeleteItem = async (id: string, type: 'category' | 'subcategory') => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

    try {
      if (type === 'category') {
        await deleteCategory(id);
        if (selectedCategory === id) {
          setSelectedCategory(null);
        }
      } else {
        await deleteSubCategory(id);
      }
      toast.success(`${type === 'category' ? 'Category' : 'Sub-category'} deleted successfully`);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        src/features/admin/components/sections/OperationsManager/FoodRelationshipsManager/index.tsx
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Categories Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Categories</h3>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="btn-ghost text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>

          {isAddingCategory && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="input flex-1"
                  placeholder="Enter category name"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="btn-primary"
                  disabled={!newItemName.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewItemName('');
                  }}
                  className="btn-ghost"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`p-4 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gray-700'
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
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
                        onClick={() => setSelectedCategory(category.id)}
                        className="text-white font-medium flex-1 text-left"
                      >
                        {category.name}
                      </button>
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
                          onClick={() => setEditingItem({ id: category.id, value: category.name })}
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
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Categories Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Sub-Categories</h3>
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
                Choose a category from the left to view and manage its sub-categories
              </p>
            </div>
          ) : (
            <>
              {isAddingSubCategory && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="input flex-1"
                      placeholder="Enter sub-category name"
                      autoFocus
                    />
                    <button
                      onClick={handleAddSubCategory}
                      className="btn-primary"
                      disabled={!newItemName.trim()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSubCategory(false);
                        setNewItemName('');
                      }}
                      className="btn-ghost"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">{subCategory.name}</span>
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
                              onClick={() => setEditingItem({ id: subCategory.id, value: subCategory.name })}
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