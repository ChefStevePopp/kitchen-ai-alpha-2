import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';
import { LoadingLogo } from '@/features/shared/components';
import { ExcelDataGrid } from '@/features/shared/components/ExcelDataGrid';
import { inventoryColumns } from './columns';
import toast from 'react-hot-toast';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<void>;
  type: 'inventory';
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImport,
  type
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [workbook, setWorkbook] = useState<any>(null);
  const [selectedSheet, setSelectedSheet] = useState('');

  // Required columns for inventory
  const requiredColumns = [
    'Item ID',
    'Product Name',
    'Category',
    'Vendor',
    'Unit of Measure',
    'Price',
    'Adjusted Price'
  ];

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const wb = read(buffer, { cellDates: true, cellNF: false, cellText: false });
      setWorkbook(wb);
      setSelectedSheet('');
      setPreviewData(null);
    } catch (error) {
      console.error('Error reading Excel:', error);
      toast.error('Failed to read Excel file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSheetChange = (sheetName: string) => {
    if (!workbook || !sheetName) return;
    
    try {
      setIsProcessing(true);
      const worksheet = workbook.Sheets[sheetName];
      
      // Read data using predefined column order
      const jsonData = utils.sheet_to_json(worksheet, {
        header: requiredColumns,
        range: 1, // Skip header row
        raw: false,
        defval: ''
      });

      // Filter out empty rows
      const validRows = jsonData.filter(row => {
        const itemId = row['Item ID']?.toString().trim();
        return itemId && itemId !== '0';
      });

      if (validRows.length === 0) {
        toast.error('No valid data rows found in selected sheet');
        setPreviewData(null);
        setSelectedSheet('');
        return;
      }

      setSelectedSheet(sheetName);
      setPreviewData(validRows.slice(0, 5)); // Show first 5 rows in preview
    } catch (error) {
      console.error('Error loading sheet:', error);
      toast.error('Failed to load sheet data');
      setPreviewData(null);
      setSelectedSheet('');
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm']
    },
    maxFiles: 1,
    onDrop: files => files[0] && handleFileUpload(files[0])
  });

  const handleImport = async () => {
    if (!workbook || !selectedSheet) {
      toast.error('Please select a worksheet first');
      return;
    }

    try {
      const worksheet = workbook.Sheets[selectedSheet];
      const jsonData = utils.sheet_to_json(worksheet, {
        header: requiredColumns,
        range: 1,
        raw: false,
        defval: ''
      });

      await onImport(jsonData);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Import Inventory Data</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isProcessing ? (
            <LoadingLogo message="Processing file..." />
          ) : workbook ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Select Worksheet
                </label>
                <select
                  value={selectedSheet}
                  onChange={(e) => handleSheetChange(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Choose a worksheet...</option>
                  {workbook.SheetNames.map((name: string) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {previewData && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Data Preview</h3>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <ExcelDataGrid
                      columns={inventoryColumns}
                      data={previewData}
                      categoryFilter="all"
                      onCategoryChange={() => {}}
                      type="inventory"
                    />
                    <p className="text-sm text-gray-400 mt-4 pt-4 border-t border-gray-700">
                      Showing first 5 rows of {previewData.length} total rows
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-500/10' 
                  : 'border-gray-700 hover:border-gray-600'
                }`}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                {isDragActive
                  ? 'Drop the Excel file here'
                  : 'Drag & drop an Excel file here, or click to select'}
              </p>
              <p className="text-sm text-gray-400">
                Supports .xlsx and .xlsm files
              </p>
            </div>
          )}

          <div className="mt-6 bg-yellow-500/10 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-medium">Required Columns</p>
                <p className="text-sm text-gray-300 mt-1">
                  The Excel file must contain the following columns:
                </p>
                <ul className="text-sm text-gray-300 mt-1 list-disc list-inside">
                  {requiredColumns.map(col => (
                    <li key={col}>{col}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-900 p-6 border-t border-gray-800 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!workbook || !selectedSheet || !previewData}
            className="btn-primary"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};