import React from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { UploadedImage } from '../types';


interface ImagePreviewModalProps {
  image: UploadedImage | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-800 truncate max-w-md">
              {image.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display */}
        <div className="overflow-auto p-2 bg-slate-950 flex items-center justify-center max-h-[calc(90vh-60px)]">
          <img
            src={image.previewUrl}
            alt={image.name}
            className="max-h-[80vh] w-auto object-contain rounded"
          />
        </div>
      </div>
    </div>
  );
};
