import React, { useState, useEffect } from 'react';
import { Package, Plus, Upload, Trash2 } from 'lucide-react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import { LoadingLogo } from '@/features/shared/components';
import { InventoryDataGrid } from './InventoryDataGrid';
import { ImportExcelModal } from './ImportExcelModal';
import toast from 'react-hot-toast';

export const InventoryManagement: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { 
    items, 
    isLoading: isLoadingInventory, 
    error: inventoryError,
    fetchItems,
    clearItems,
    importItems
  } = useInventoryStore();

  const {
    ingredients: masterIngredients,
    isLoading: isLoadingIngredients,
    error: ingredientsError,
    fetchIngredients
  } = useMasterIngredientsStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchItems(),
          fetchIngredients()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchItems, fetchIngredients]);

  const handleImport = async (data: any[]) => {
    try {
      await importItems(data);
      setIsImportModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to import inventory data');
      }
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all inventory data? This cannot be undone.')) {
      return;
    }

    try {
      await clearItems();
    } catch (error) {
      toast.error('Failed to clear inventory data');
    }
  };

  const isLoading = isLoadingInventory || isLoadingIngredients;
  const error = inventoryError || ingredientsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingLogo message="Loading inventory data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <Package className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => fetchItems()}
          className="btn-ghost text-primary-400"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        src/features/admin/components/sections/InventoryManagement/index.tsx
      </div>

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Food Inventory</h1>
          <p className="text-gray-400">Manage your inventory counts and stock levels</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleClearData}
            className="btn-ghost text-red-400 hover:text-red-300"
            disabled={!items || items.length === 0}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear Data
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-primary"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import Excel Data
          </button>
          <button
            onClick={() => {}}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Count
          </button>
        </div>
      </header>

      <div className="card p-6">
        <InventoryDataGrid 
          data={items}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      </div>

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        type="inventory"
      />
    </div>
  );
};