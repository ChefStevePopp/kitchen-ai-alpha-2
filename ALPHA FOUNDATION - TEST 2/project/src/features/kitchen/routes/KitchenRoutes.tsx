import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { KitchenDashboard } from '../components/KitchenDashboard';
import { InventoryManagement } from '@/features/admin/components/sections/InventoryManagement';
import { RecipeManager } from '@/features/recipes/components/RecipeManager';
import { ProductionBoard } from '@/features/production/components/ProductionBoard';

export const KitchenRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<KitchenDashboard />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="recipes" element={<RecipeManager />} />
      <Route path="production" element={<ProductionBoard />} />
    </Routes>
  );
};