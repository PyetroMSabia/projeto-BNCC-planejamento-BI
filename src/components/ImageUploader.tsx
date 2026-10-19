import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  X, 
  Trash2, 
  Plus, 
  Eye, 
  Layers
} from 'lucide-react';
import type { UploadedImage } from '../types';


interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  onPreviewImage: (image: UploadedImage) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  onPreviewImage,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file) => {
      if (validTypes.includes(file.type)) {
        const previewUrl = URL.createObjectURL(file);
        newImages.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          previewUrl,
          mimeType: file.type,
        });
      }
    });

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = images.find((img) => img.id === id);
    if (target?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    onImagesChange([]);
  };

  const totalBytes = images.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="space-y-4">
      {/* Zona de Drop Principal */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 scale-[0.99] ring-4 ring-indigo-100'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/70 shadow-xs'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-800">
              Arraste e solte as fotos do planejamento aqui, ou{' '}
              <span className="text-indigo-600 hover:underline">procure no seu dispositivo</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Suporta múltiplos arquivos em formato <strong>JPG, PNG ou WEBP</strong> (pode enviar frente e verso juntos)
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Matérias divididas em várias fotos serão consolidadas automaticamente</span>
          </div>
        </div>
      </div>

      {/* Galeria de Thumbnails */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900">
                Fotos Selecionadas ({images.length})
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                {formatFileSize(totalBytes)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar mais
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={disabled}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar todas
              </button>
            </div>
          </div>

          {/* Grid de Fotos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Badge de Ordem */}
                <div className="absolute top-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  #{index + 1}
                </div>

                {/* Botão Remover */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOne(img.id, e)}
                  disabled={disabled}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-sm"
                  title="Remover esta foto"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* Imagem Thumbnail */}
                <div
                  className="relative aspect-4/3 w-full bg-slate-200 cursor-pointer overflow-hidden"
                  onClick={() => onPreviewImage(img)}
                  title="Clique para ampliar"
                >
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="p-1.5 bg-white/90 rounded-full text-slate-800 shadow-sm">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Legenda do Arquivo */}
                <div className="p-2 text-left">
                  <p className="text-xs font-medium text-slate-800 truncate" title={img.name}>
                    {img.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {formatFileSize(img.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
