-- Drop and recreate prepared_items table with proper schema
DROP TABLE IF EXISTS prepared_items CASCADE;

CREATE TABLE prepared_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  category TEXT NOT NULL,
  product TEXT NOT NULL,
  station TEXT NOT NULL,
  sub_category TEXT,
  storage_area TEXT,
  container TEXT,
  container_type TEXT,
  shelf_life TEXT,
  recipe_unit TEXT NOT NULL,
  cost_per_recipe_unit DECIMAL(10,4) NOT NULL DEFAULT 0,
  yield_percent DECIMAL(5,2) NOT NULL DEFAULT 100,
  final_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Allergen columns
  allergen_peanut BOOLEAN NOT NULL DEFAULT false,
  allergen_crustacean BOOLEAN NOT NULL DEFAULT false,
  allergen_treenut BOOLEAN NOT NULL DEFAULT false,
  allergen_shellfish BOOLEAN NOT NULL DEFAULT false,
  allergen_sesame BOOLEAN NOT NULL DEFAULT false,
  allergen_soy BOOLEAN NOT NULL DEFAULT false,
  allergen_fish BOOLEAN NOT NULL DEFAULT false,
  allergen_wheat BOOLEAN NOT NULL DEFAULT false,
  allergen_milk BOOLEAN NOT NULL DEFAULT false,
  allergen_sulphite BOOLEAN NOT NULL DEFAULT false,
  allergen_egg BOOLEAN NOT NULL DEFAULT false,
  allergen_gluten BOOLEAN NOT NULL DEFAULT false,
  allergen_mustard BOOLEAN NOT NULL DEFAULT false,
  allergen_celery BOOLEAN NOT NULL DEFAULT false,
  allergen_garlic BOOLEAN NOT NULL DEFAULT false,
  allergen_onion BOOLEAN NOT NULL DEFAULT false,
  allergen_nitrite BOOLEAN NOT NULL DEFAULT false,
  allergen_mushroom BOOLEAN NOT NULL DEFAULT false,
  allergen_hot_pepper BOOLEAN NOT NULL DEFAULT false,
  allergen_citrus BOOLEAN NOT NULL DEFAULT false,
  allergen_pork BOOLEAN NOT NULL DEFAULT false,
  
  -- Custom allergen fields
  allergen_custom1_name TEXT,
  allergen_custom1_active BOOLEAN DEFAULT false,
  allergen_custom2_name TEXT,
  allergen_custom2_active BOOLEAN DEFAULT false,
  allergen_custom3_name TEXT,
  allergen_custom3_active BOOLEAN DEFAULT false,
  allergen_notes TEXT,

  -- Constraints
  UNIQUE(organization_id, item_id)
);

-- Enable RLS
ALTER TABLE prepared_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "View prepared items"
  ON prepared_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_roles
      WHERE organization_id = prepared_items.organization_id
      AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'dev'
    )
  );

CREATE POLICY "Manage prepared items"
  ON prepared_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_roles
      WHERE organization_id = prepared_items.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'dev'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_prepared_items_org_id ON prepared_items(organization_id);
CREATE INDEX idx_prepared_items_item_id ON prepared_items(item_id);
CREATE INDEX idx_prepared_items_category ON prepared_items(category);
CREATE INDEX idx_prepared_items_product ON prepared_items(product);

-- Add helpful comments
COMMENT ON TABLE prepared_items IS 'Stores prepared item recipes and specifications including allergen information';
COMMENT ON COLUMN prepared_items.item_id IS 'Unique identifier for the prepared item within an organization';
COMMENT ON COLUMN prepared_items.recipe_unit IS 'Recipe unit measurement (e.g., "1 portion", "4 servings")';