'use client';

import { useState, useRef } from 'react';

const MAX_IMAGES = 3;
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUploader({
  images = [],
  onChange,
  onImageUploaded,
  onImageRemoved,
  error: externalError,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const activeError = externalError || error;

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Reset input value so same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setError(null);

    // Validate count before starting
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed per product. You can only add ${MAX_IMAGES - images.length} more.`);
      return;
    }

    // Validate file types and sizes before any upload
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(`"${file.name}" has an invalid file type (${file.type || 'unknown'}). Only JPEG, PNG, and WebP images are allowed.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        setError(`"${file.name}" is ${sizeMb} MB. Maximum allowed size is 3 MB.`);
        return;
      }
    }

    setUploading(true);

    try {
      const newlyUploaded = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);

        // 1. Fetch secure signature from server
        const sigRes = await fetch('/api/admin/media/signature');
        if (!sigRes.ok) {
          throw new Error('Failed to get secure upload authorization');
        }
        const sigData = await sigRes.json();

        // 2. Direct browser upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', sigData.apiKey);
        formData.append('timestamp', sigData.timestamp);
        formData.append('signature', sigData.signature);
        formData.append('folder', sigData.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Failed to upload "${file.name}" to media service`);
        }

        const uploadData = await uploadRes.json();
        const newImage = {
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
        };

        newlyUploaded.push(newImage);
        onImageUploaded?.(newImage.publicId);
      }

      onChange([...images, ...newlyUploaded]);
    } catch (err) {
      console.error('[ImageUploader] Upload error:', err);
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  function handleRemove(index) {
    const target = images[index];
    if (!target) return;

    setError(null);
    const remaining = images.filter((_, i) => i !== index);
    onChange(remaining);
    onImageRemoved?.(target.publicId);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-gray-500 font-medium">
          {images.length} / {MAX_IMAGES} images (Max 3MB each, JPEG/PNG/WebP)
        </span>
      </div>

      {activeError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <span>{activeError}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={img.publicId || index}
            className="group relative aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={`Product image ${index + 1}`}
              className="h-full w-full object-cover"
            />

            {/* Badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
              {index === 0 ? 'Primary' : `Image ${index + 1}`}
            </div>

            {/* Action overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors shadow flex items-center gap-1.5"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Upload Button Box if slots available */}
        {images.length < MAX_IMAGES && (
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`
              aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900
              flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors
              bg-gray-50 hover:bg-gray-100/70
              ${uploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={MAX_IMAGES - images.length > 1}
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Spinner className="w-6 h-6 text-gray-700 animate-spin" />
                <span className="text-xs text-gray-600 font-medium">{uploadProgress || 'Uploading...'}</span>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white shadow-sm border border-gray-200 mb-2 text-gray-600">
                  <UploadIcon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-gray-900">Upload Image</p>
                <p className="text-[11px] text-gray-500 mt-1">JPEG, PNG, WebP &le; 3MB</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  ({MAX_IMAGES - images.length} {MAX_IMAGES - images.length === 1 ? 'slot' : 'slots'} left)
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UploadIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function Spinner(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
