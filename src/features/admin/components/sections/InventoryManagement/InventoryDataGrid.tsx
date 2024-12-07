import React from 'react';
import { ExcelDataGrid } from '@/features/shared/components/ExcelDataGrid';
import { inventoryColumns } from './columns';
import type { InventoryCount } from '@/types/inventory';

interface InventoryDataGridProps {
  data: InventoryCount[];
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
}

export const InventoryDataGrid: React.FC<InventoryDataGridProps> = ({
  data,
  categoryFilter,
  onCategoryChange
}) => {
  return (
    <ExcelDataGrid
      columns={inventoryColumns}
      data={data}
      categoryFilter={categoryFilter}
      onCategoryChange={onCategoryChange}
      type="inventory"
    />
  );
};