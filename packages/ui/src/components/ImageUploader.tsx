'use client';

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { XIcon, ImageUpIcon } from 'lucide-react';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';

interface ImageUploaderProps {
  value: File | string | null;
  onChange: (file: File | string | null) => void;
  maxSize?: number;
}

export interface ImageUploaderRef {
  triggerUpload: () => void;
  clear: () => void;
}

export const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  ({ value, onChange, maxSize = 10 * 1024 * 1024 }, ref) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Expose methods to parent via ref (e.g., for external buttons to trigger upload or clear file)
    useImperativeHandle(ref, () => ({
      triggerUpload: () => fileInputRef.current?.click(),
      clear: clearFile,
    }));

    // Update preview image when `value` changes
    useEffect(() => {
      if (!value) {
        setPreviewUrl(null);
        return;
      }

      if (typeof value === 'string') {
        setPreviewUrl(value); // Remote image or base64 string
      } else {
        // Local file: generate a preview URL using FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviewUrl(e.target.result as string);
          }
        };
        reader.readAsDataURL(value);
      }
    }, [value]);

    // Clear the file and preview
    const clearFile = () => {
      onChange(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Validate and handle selected or dropped file
    const handleFile = (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('Only image files allowed');
        return;
      }

      if (file.size > maxSize) {
        alert(`File too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }

      onChange(file);
    };

    // Handle file selection via input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    };

    // Handle file dropped into drop zone
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    };

    // Drag enter/over/leave handlers to update UI state
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    // Prevent browser default behavior (e.g., opening image in new tab on drop)
    useEffect(() => {
      const preventDefaults = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const handleWindowDrop = (e: DragEvent) => {
        const uploaderElement = document.getElementById('image-uploader-dropzone');
        if (uploaderElement && !uploaderElement.contains(e.target as Node)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener('dragenter', preventDefaults);
      window.addEventListener('dragover', preventDefaults);
      window.addEventListener('dragleave', preventDefaults);
      window.addEventListener('drop', handleWindowDrop);

      return () => {
        window.removeEventListener('dragenter', preventDefaults);
        window.removeEventListener('dragover', preventDefaults);
        window.removeEventListener('dragleave', preventDefaults);
        window.removeEventListener('drop', handleWindowDrop);
      };
    }, []);

    return (
      <div className="flex flex-col gap-2" id="image-uploader-dropzone">
        {!previewUrl ? (
          // Drop zone UI when no image is selected
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
              isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
            }`}
          >
            <ImageUpIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm">
              <span className="text-blue-600 font-medium">Drop your image here</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF (max {Math.round(maxSize / 1024 / 1024)}MB)
            </p>

            {/* Hidden file input */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          // Image preview UI
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain border rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 cursor-pointer"
              onClick={clearFile}
              aria-label="Remove image"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = 'ImageUploader';
