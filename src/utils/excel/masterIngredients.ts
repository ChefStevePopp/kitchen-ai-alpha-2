import { type MasterIngredient } from '@/types/master-ingredient';
import { supabase } from '@/lib/supabase';

// Map Excel column headers to database column names
export const ALLERGEN_MAPPING = {
  'Peanut': 'allergen_peanut',
  'Crustacean': 'allergen_crustacean',
  'Tree Nut': 'allergen_treenut',
  'Shellfish': 'allergen_shellfish',
  'Sesame': 'allergen_sesame',
  'Soy': 'allergen_soy',
  'Fish': 'allergen_fish',
  'Wheat': 'allergen_wheat',
  'Milk': 'allergen_milk',
  'Sulphite': 'allergen_sulphite',
  'Egg': 'allergen_egg',
  'Gluten': 'allergen_gluten',
  'Mustard': 'allergen_mustard',
  'Celery': 'allergen_celery',
  'Garlic': 'allergen_garlic',
  'Onion': 'allergen_onion',
  'Nitrite': 'allergen_nitrite',
  'Mushroom': 'allergen_mushroom',
  'Hot Pepper': 'allergen_hot_pepper',
  'Citrus': 'allergen_citrus',
  'Pork': 'allergen_pork'
} as const;

// Required columns for import
export const REQUIRED_COLUMNS = [
  'Item Code',
  'Product Name',
  'Major Group',
  'Category',
  'Sub-Category',
  'Vendor',
  'Case Size',
  'Units/Case',
  'Case Price',
  'Unit of Measure',
  'Recipe Units/Case',
  'Recipe Unit Type',
  'Yield %',
  'Storage Area'
] as const;

export async function validateMasterIngredients(data: any[], organizationId: string): Promise<Omit<MasterIngredient, 'id'> & { organization_id: string }[]> {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }

  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    throw new Error('Invalid data format: No valid rows found');
  }

  // Check for missing required columns
  const missingColumns = REQUIRED_COLUMNS.filter(col => !(col in firstRow));
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  // Get food relationship IDs
  const { data: groups } = await supabase
    .from('food_category_groups')
    .select('id, name')
    .eq('organization_id', organizationId);

  const { data: categories } = await supabase
    .from('food_categories')
    .select('id, name, group_id')
    .eq('organization_id', organizationId);

  const { data: subCategories } = await supabase
    .from('food_sub_categories')
    .select('id, name, category_id')
    .eq('organization_id', organizationId);

  // Create lookup maps
  const groupMap = new Map(groups?.map(g => [g.name.toLowerCase(), g.id]) || []);
  const categoryMap = new Map(categories?.map(c => [c.name.toLowerCase(), c.id]) || []);
  const subCategoryMap = new Map(subCategories?.map(s => [s.name.toLowerCase(), s.id]) || []);

  return data
    .filter(row => {
      const productName = row['Product Name']?.toString().trim();
      const itemCode = row['Item Code']?.toString().trim();
      return productName && itemCode && productName !== '0' && itemCode !== '0';
    })
    .map(row => {
      // Get UUIDs for food relationships
      const majorGroupName = row['Major Group']?.toString().trim().toLowerCase();
      const categoryName = row['Category']?.toString().trim().toLowerCase();
      const subCategoryName = row['Sub-Category']?.toString().trim().toLowerCase();

      const majorGroupId = groupMap.get(majorGroupName);
      const categoryId = categoryMap.get(categoryName);
      const subCategoryId = subCategoryMap.get(subCategoryName);

      // Process allergens
      const allergens = Object.entries(ALLERGEN_MAPPING).reduce((acc, [excelName, dbColumn]) => {
        const value = row[excelName]?.toString().trim();
        acc[dbColumn] = value === '1' || value === 'true';
        return acc;
      }, {} as Record<string, boolean>);

      return {
        organization_id: organizationId,
        item_code: row['Item Code']?.toString().trim() || '',
        major_group: majorGroupId || null,
        category: categoryId || null,
        sub_category: subCategoryId || null,
        product: row['Product Name']?.toString().trim() || '',
        vendor: row['Vendor']?.toString().trim() || '',
        case_size: row['Case Size']?.toString().trim() || '',
        units_per_case: row['Units/Case']?.toString().trim() || '',
        current_price: parseFloat(row['Case Price']?.toString().replace(/[$,]/g, '') || '0'),
        unit_of_measure: row['Unit of Measure']?.toString().trim() || '',
        recipe_unit_per_purchase_unit: parseFloat(row['Recipe Units/Case']?.toString() || '0'),
        recipe_unit_type: row['Recipe Unit Type']?.toString().trim() || '',
        yield_percent: parseFloat(row['Yield %']?.toString().replace(/%/g, '') || '100'),
        image_url: row['Image URL']?.toString().trim() || '',
        storage_area: row['Storage Area']?.toString().trim() || '',
        ...allergens,
        allergen_custom1_name: '',
        allergen_custom1_active: false,
        allergen_custom2_name: '',
        allergen_custom2_active: false,
        allergen_custom3_name: '',
        allergen_custom3_active: false,
        allergen_notes: '',
        updated_at: new Date().toISOString()
      };
    });
}