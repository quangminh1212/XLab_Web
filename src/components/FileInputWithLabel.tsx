import { useTranslation } from '@/locales/clientTranslation';
import React, { useRef, useState, forwardRef, ForwardedRef } from 'react';

interface FileInputWithLabelProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  className?: string;
  language?: string;
}

const FileInputWithLabel = forwardRef<HTMLInputElement, FileInputWithLabelProps>(
  ({ onChange, accept = "image/*", className = "", language }, ref) => {
    const { t } = useTranslation(language);
    const innerRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>("");
    
    // Use forwarded ref if provided, otherwise use inner ref
    const inputRef = ref || innerRef;
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update fileName for UI
      if (e.target.files && e.target.files.length > 0) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName("");
      }
      
      // Call parent onChange handler
      onChange(e);
    };

    return (
      <div className={`flex items-center ${className}`}>
        <label className="relative cursor-pointer bg-teal-500 hover:bg-teal-600 transition-colors text-white py-2 px-4 rounded-l-md">
          <span>{t('admin.products.chooseFile')}</span>
          <input
            ref={inputRef as ForwardedRef<HTMLInputElement>}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
        <div className="border border-gray-300 py-2 px-4 rounded-r-md flex-grow bg-gray-50 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {fileName || t('admin.products.noFileSelected')}
        </div>
      </div>
    );
  }
);

FileInputWithLabel.displayName = 'FileInputWithLabel';

export default FileInputWithLabel; 