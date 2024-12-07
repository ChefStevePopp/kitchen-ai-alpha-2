import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { ExcelColumn } from '@/types';
import { formatCellValue } from './formatters';

interface ExcelDataGridProps {
  columns: ExcelColumn[];
  data: any[];
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  type: 'inventory' | 'prepared-items' | 'master-ingredients';
  onRowClick?: (row: any) => void;
}

export const ExcelDataGrid: React.FC<ExcelDataGridProps> = ({
  columns,
  data,
  categoryFilter,
  onCategoryChange,
  type,
  onRowClick
}) => {
  // Diagnostic Text
  const diagnosticPath = "src/features/shared/components/ExcelDataGrid/index.tsx";

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return Object.entries(item).some(([key, value]) => {
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null) return 1;
        if (bValue == null) return -1;
        if (aValue === bValue) return 0;

        const comparison = String(aValue).toLowerCase() < String(bValue).toLowerCase() ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  return (
    <div className="space-y-4">
      {/* Diagnostic Text */}
      <div className="text-xs text-gray-500 font-mono">
        {diagnosticPath}
      </div>

      {/* Search Control */}
      <div className="flex-1 relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 w-full text-sm"
        />
      </div>

      {/* Table */}
      <div className="relative rounded-lg border border-gray-700 bg-gray-800/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className={`sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm
                      px-3 py-3.5 text-center text-sm font-semibold text-gray-300
                      cursor-pointer hover:text-white transition-colors
                      ${column.width ? `min-w-[${column.width}px]` : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {column.name}
                      {sortConfig?.key === column.key && (
                        <span className="text-primary-400">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-transparent">
              {filteredAndSortedData.map((item, index) => (
                <tr 
                  key={item.id || index}
                  className="hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={`${item.id || index}-${column.key}`}
                      className="whitespace-nowrap px-3 py-3 text-sm text-gray-300 text-center"
                    >
                      {formatCellValue(item[column.key], column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400 text-right">
        Showing {filteredAndSortedData.length} of {data.length} items
      </div>
    </div>
  );
};