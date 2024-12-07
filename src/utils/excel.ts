import { utils, writeFile } from 'xlsx';

export function generateMasterIngredientsTemplate() {
  const headers = [
    'Item Code*', 'Product Name*', 'Major Group*', 'Category*', 'Sub-Category',
    'Vendor*', 'Case Size*', 'Units/Case*', 'Case Price*', 'Unit of Measure*',
    'Recipe Units/Case*', 'Recipe Unit Type*', 'Yield %*', 'Storage Area*',
    'Allergen: Peanut', 'Allergen: Crustacean', 'Allergen: Tree Nuts',
    'Allergen: Shellfish', 'Allergen: Sesame', 'Allergen: Soy', 'Allergen: Fish',
    'Allergen: Wheat', 'Allergen: Milk', 'Allergen: Sulphites', 'Allergen: Eggs',
    'Allergen: Gluten', 'Allergen: Mustard', 'Allergen: Celery', 'Allergen: Garlic',
    'Allergen: Onion', 'Allergen: Nitrites', 'Allergen: Mushroom',
    'Allergen: Hot Peppers', 'Allergen: Citrus', 'Allergen: Pork'
  ];

  const tooltips = {
    'Item Code*': 'Required. Unique identifier for the ingredient',
    'Product Name*': 'Required. Name of the product',
    'Major Group*': 'Required. Top level category (Food, Beverage, etc)',
    'Category*': 'Required. Category within major group',
    'Sub-Category': 'Optional. Sub-category specification',
    'Vendor*': 'Required. Supplier name',
    'Case Size*': 'Required. Case packaging (e.g. 4x2kg)',
    'Units/Case*': 'Required. Number of units in case',
    'Case Price*': 'Required. Price per case',
    'Unit of Measure*': 'Required. Base unit of measure',
    'Recipe Units/Case*': 'Required. Number of recipe units per case',
    'Recipe Unit Type*': 'Required. Type of recipe unit (portion, serving, etc)',
    'Yield %*': 'Required. Yield percentage (1-100)',
    'Storage Area*': 'Required. Storage location'
  };

  const exampleRows = [
    [
      'BEEF-001', 'Beef Brisket', 'Food', 'Proteins', 'Beef', 'US Foods',
      '2x5kg', '2', '125.99', 'kg', '10', 'portion', '85', 'Walk-in Cooler',
      '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
      '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
    ],
    [
      'CHIX-001', 'Chicken Breast', 'Food', 'Proteins', 'Poultry', 'Sysco',
      '4x2kg', '4', '89.99', 'kg', '8', 'portion', '90', 'Walk-in Cooler',
      '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
      '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
    ],
    [
      'MILK-001', 'Whole Milk', 'Food', 'Dairy', 'Milk', 'GFS',
      '4L', '1', '6.99', 'L', '16', 'cup', '100', 'Walk-in Cooler',
      '0', '0', '0', '0', '0', '0', '0', '0', '1', '0',
      '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
    ]
  ];

  const wb = utils.book_new();
  const ws = utils.aoa_to_sheet([headers, ...exampleRows]);

  // Add tooltips using cell comments
  Object.entries(tooltips).forEach(([header, tooltip], index) => {
    const cell = utils.encode_cell({ r: 0, c: index });
    if (!ws[cell]) ws[cell] = { t: 's', v: header };
    ws[cell].c = [{ a: 'Kitchen AI', t: tooltip }];
  });

  // Set column widths
  ws['!cols'] = [
    { wch: 12 }, // Item Code
    { wch: 25 }, // Product Name
    { wch: 15 }, // Major Group
    { wch: 15 }, // Category
    { wch: 15 }, // Sub-Category
    { wch: 15 }, // Vendor
    { wch: 12 }, // Case Size
    { wch: 12 }, // Units/Case
    { wch: 12 }, // Case Price
    { wch: 15 }, // Unit of Measure
    { wch: 15 }, // Recipe Units/Case
    { wch: 15 }, // Recipe Unit Type
    { wch: 10 }, // Yield %
    { wch: 15 }, // Storage Area
    ...Array(21).fill({ wch: 12 }) // Allergen columns
  ];

  // Add instructions sheet
  const instructionsWs = utils.aoa_to_sheet([
    ['Master Ingredients Import Template Instructions'],
    [''],
    ['Required Fields:'],
    ['- Fields marked with * are required'],
    ['- Item Code must be unique within your organization'],
    ['- Case Price should be the current price per case'],
    ['- Yield % should be between 1-100'],
    [''],
    ['Allergens:'],
    ['- Use 1 for Yes and 0 for No'],
    ['- Leave blank or use 0 for no allergen'],
    [''],
    ['Example Categories:'],
    ['Major Groups: Food, Beverage, Alcohol'],
    ['Categories: Proteins, Produce, Dairy, Dry Goods'],
    ['Sub-Categories: Beef, Poultry, Seafood, etc'],
    [''],
    ['Units of Measure:'],
    ['- Use standard abbreviations: kg, g, L, ml, ea'],
    ['- Be consistent with unit types'],
    [''],
    ['Tips:'],
    ['- Hover over column headers for field descriptions'],
    ['- Fill out one row completely as a reference'],
    ['- Copy formulas down for consistent formatting'],
    ['- Verify all required fields are filled'],
    ['- Double-check allergen markings']
  ]);

  instructionsWs['!cols'] = [{ wch: 60 }];

  utils.book_append_sheet(wb, ws, 'Master Ingredients');
  utils.book_append_sheet(wb, instructionsWs, 'Instructions');

  writeFile(wb, 'master-ingredients-template.xlsx');
}