import React from 'react';
import { Package } from 'lucide-react';
import { CategorySelector } from '@/components/CategorySelector';
import type { MasterIngredient } from '@/types/master-ingredient';
import type { OperationsSettings } from '@/types/operations';

interface BasicInformationProps {
  formData: MasterIngredient;
  settings: OperationsSettings | null;
  onChange: (updates: MasterIngredient) => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  settings,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Package className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-white">Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Item Code
          </label>
          <input
            type="text"
            value={formData.item_code}
            onChange={(e) => onChange({ ...formData, item_code: e.target.value })}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={formData.product}
            onChange={(e) => onChange({ ...formData, product: e.target.value })}
            className="input w-full"
            required
          />
        </div>
      </div>

      <CategorySelector
        organizationId={formData.organization_id}
        majorGroup={formData.major_group}
        category={formData.category}
        subCategory={formData.sub_category}
        onMajorGroupChange={(id) => onChange({ ...formData, major_group: id, category: null, sub_category: null })}
        onCategoryChange={(id) => onChange({ ...formData, category: id, sub_category: null })}
        onSubCategoryChange={(id) => onChange({ ...formData, sub_category: id })}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Vendor
          </label>
          <select
            value={formData.vendor}
            onChange={(e) => onChange({ ...formData, vendor: e.target.value })}
            className="input w-full"
            required
          >
            <option value="">Select vendor...</option>
            {settings?.vendors?.map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Storage Area
          </label>
          <select
            value={formData.storage_area}
            onChange={(e) => onChange({ ...formData, storage_area: e.target.value })}
            className="input w-full"
            required
          >
            <option value="">Select storage area...</option>
            {settings?.storage_areas?.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};