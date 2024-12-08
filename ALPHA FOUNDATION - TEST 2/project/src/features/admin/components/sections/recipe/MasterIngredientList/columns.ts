import type { ExcelColumn } from '@/types';

export const masterIngredientColumns: ExcelColumn[] = [
  { 
    key: 'itemCode', 
    name: 'Vendor Code | Bar Code', 
    type: 'text', 
    width: 120 
  },
  { 
    key: 'product', 
    name: 'Common Name', 
    type: 'text', 
    width: 200 
  },
  { 
    key: 'majorGroupName', 
    name: 'Major Group', 
    type: 'text', 
    width: 120 
  },
  { 
    key: 'categoryName', 
    name: 'Category', 
    type: 'text', 
    width: 120 
  },
  { 
    key: 'subCategoryName', 
    name: 'Sub-Category', 
    type: 'text', 
    width: 120 
  },
  { 
    key: 'vendor', 
    name: 'Vendor', 
    type: 'text', 
    width: 120 
  },
  { 
    key: 'caseSize', 
    name: 'Case Size', 
    type: 'text', 
    width: 100 
  },
  { 
    key: 'unitsPerCase', 
    name: 'Units/Case', 
    type: 'text', 
    width: 100 
  },
  { 
    key: 'unitOfMeasure', 
    name: 'Inventory Unit', 
    type: 'text', 
    width: 100 
  },
  { 
    key: 'currentPrice', 
    name: 'Case Price', 
    type: 'currency', 
    width: 100 
  },
  { 
    key: 'recipeUnitPerPurchaseUnit', 
    name: 'Recipe Units/Case', 
    type: 'number', 
    width: 120 
  },
  { 
    key: 'costPerRecipeUnit', 
    name: 'Cost/Recipe Unit', 
    type: 'currency', 
    width: 120 
  },
  { 
    key: 'yieldPercent', 
    name: 'Yield %', 
    type: 'percent', 
    width: 80 
  },
  { 
    key: 'imageUrl', 
    name: 'Image', 
    type: 'imageUrl', 
    width: 80 
  }
];