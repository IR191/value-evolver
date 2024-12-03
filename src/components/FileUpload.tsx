import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onFileSelect: (file: File, data: any[][]) => void;
  accept: string;
  fileType: string;
}

export const FileUpload = ({ onFileSelect, accept, fileType }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            onFileSelect(file, jsonData as any[][]);
          } catch (error) {
            console.error('Error processing Excel file:', error);
          }
        };
        
        reader.readAsBinaryString(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out cursor-pointer",
        isDragActive
          ? "border-red-400 bg-red-50"
          : "border-gray-300 hover:border-red-300",
        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-red-100">
          <Upload className="w-6 h-6 text-red-600" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            Drop your {fileType} here, or click to browse
          </p>
          <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
        </div>
      </div>
    </div>
  );
};