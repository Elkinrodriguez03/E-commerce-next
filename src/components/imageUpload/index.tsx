'use client';

import { useState, useRef, useCallback } from 'react';
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { AuthService } from '@/services/auth';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hasError?: boolean;
}

function ImageUpload({ value, onChange, error, hasError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [useUrl, setUseUrl] = useState(!value || value.startsWith('http'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const token = AuthService.getToken();
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          onChange(data.url);
          setUseUrl(false);
        } else {
          const data = await res.json();
          setUploadError(data.error || 'Upload failed');
        }
      } catch {
        setUploadError('Network error. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    } else {
      setUploadError('Please drop a valid image file');
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayError = uploadError || (hasError ? error : undefined);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Product Image</label>

      {/* Toggle between upload and URL */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setUseUrl(false)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
            !useUrl
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-gray-100 text-gray-500 border-gray-100 hover:bg-gray-200 hover:border-gray-200'
          }`}
        >
          <ArrowUpTrayIcon className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setUseUrl(true)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
            useUrl
              ? 'bg-transparent text-black-600 border-black-900'
              : 'bg-gray-100 text-gray-500 border-gray-100 hover:bg-gray-200 hover:border-gray-200'
          }`}
        >
          URL
        </button>
      </div>

      {useUrl ? (
        /* URL input mode */
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 transition-colors ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : value
                ? 'border-black-500 focus:ring-black-500'
                : 'border-gray-300 focus:ring-black'
          }`}
        />
      ) : (
        /* File upload mode */
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {value && !value.startsWith('http') ? (
            /* Preview uploaded image */
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img src={value} alt="Product preview" className="w-full h-48 object-contain" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
              >
                <XMarkIcon className="h-4 w-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-xs text-gray-600 px-3 py-1.5 rounded-full shadow-sm transition-colors"
              >
                Replace
              </button>
            </div>
          ) : (
            /* Drop zone */
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                isUploading
                  ? 'border-gray-300 bg-gray-50 cursor-wait'
                  : isDragging
                    ? 'border-black bg-gray-100'
                    : hasError
                      ? 'border-red-400 bg-red-50 hover:border-red-500'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="h-8 w-8 border-2 border-gray-400 border-t-black rounded-full animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Uploading...</p>
                </>
              ) : (
                <>
                  <PhotoIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP or GIF (max 5MB)</p>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Preview for URL mode */}
      {useUrl && value && value.startsWith('http') && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-contain"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        </div>
      )}

      {displayError && <p className="text-red-500 text-xs mt-1">{displayError}</p>}
    </div>
  );
}

export default ImageUpload;
