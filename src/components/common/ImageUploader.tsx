import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { validateImageFile, fileToBase64 } from '../../pages/products/productForm.config';
import type { IImageUploaderProps } from '../../types';

const ImageUploader = ({ initialImage, onImageChange, error }: IImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage || '');
  const [imageError, setImageError] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    
    try {
      const result = await validateImageFile(file);
      
      if (!result.isValid || result.error) {
        setImageError(result.error || 'فرمت فایل نامعتبر است');
        setPreviewUrl('');
        onImageChange('');
        setIsConverting(false);
        return;
      }

      setImageError('');
      const base64 = await fileToBase64(result.processedFile);
      setPreviewUrl(base64);
      onImageChange(base64);
    } catch {
      setImageError('خطا در پردازش تصویر');
      setPreviewUrl('');
      onImageChange('');
    } finally {
      setIsConverting(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageChange('');
    setImageError('');
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
      {(error || imageError) && (
        <p className="text-red-500 text-sm mb-2">{error || imageError}</p>
      )}
      
      {isConverting && (
        <div className="text-blue-500 text-sm mb-2">
          در حال تبدیل تصویر...
        </div>
      )}
      
      {previewUrl ? (
        <div className="flex flex-col items-center gap-3">
          {/* عکس */}
          <div className="relative inline-block">
            <img src={previewUrl} alt="پیش‌نمایش" className="w-32 h-32 object-cover rounded-lg" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload-change"
            disabled={isConverting}
          />
          <label
            htmlFor="image-upload-change"
            className={`bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 text-sm transition-colors ${
              isConverting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            تغییر تصویر
          </label>
        </div>
      ) : (
        <div className="py-4">
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-500 text-sm">برای آپلود تصویر کلیک کنید</p>
          <p className="text-gray-400 text-xs mt-1">فرمت‌های مجاز: jpg, png, webp, heic, heif | حداکثر حجم: 2MB</p>
          
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
            disabled={isConverting}
          />
          <label
            htmlFor="image-upload"
            className={`inline-block mt-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 text-sm ${
              isConverting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            انتخاب تصویر
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;