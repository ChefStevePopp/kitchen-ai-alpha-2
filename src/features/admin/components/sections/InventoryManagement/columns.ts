import type { ExcelColumn } from '@/types';

export const inventoryColumns: ExcelColumn[] = [
  { key: 'ingredient.uniqueId', name: 'Item ID', type: 'text', width: 100 },
  { key: 'ingredient.product', name: 'Product Name', type: 'text', width: 200 },
  { key: 'ingredient.majorGroupName', name: 'Major Group', type: 'text', width: 120 },
  { key: 'ingredient.categoryName', name: 'Category', type: 'text', width: 120 },
  { key: 'ingredient.subCategoryName', name: 'Sub-Category', type: 'text', width: 120 },
  { key: 'quantity', name: 'Quantity', type: 'number', width: 100 },
  { key: 'unitCost', name: 'Unit Cost', type: 'currency', width: 100 },
  { key: 'totalValue', name: 'Total Value', type: 'currency', width: 120 },
  { key: 'location', name: 'Location', type: 'text', width: 120 },
  { key: 'status', name: 'Status', type: 'text', width: 100 },
  { key: 'lastUpdated', name: 'Last Updated', type: 'text', width: 150 }
];