
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct } from '../../api/products';
import type { IProduct } from '../../types';
import { ArrowRight, Upload, X } from 'lucide-react';
import { useState } from 'react';


const productSchema = yup.object({
  title: yup.string().min(3, 'حداقل 3 کاراکتر').required('نام محصول الزامی است'),
  price: yup.number().min(10000, 'حداقل قیمت 10,000 تومان').max(100000000, 'حداکثر قیمت 100,000,000 تومان').required('قیمت الزامی است'),
  discount: yup.number().min(0, 'تخفیف نمیتواند منفی باشد').max(70, 'حداکثر تخفیف 70 درصد').default(0),
  expiryDate: yup.string().required('تاریخ انقضا الزامی است'),
  category: yup.string().oneOf(['electronics', 'clothing', 'food', 'home', 'books']).required('دسته‌بندی الزامی است'),
  description: yup.string().optional(),
});

type ProductFormData = Omit<IProduct, 'id'> & { imageFile?: File };

interface ProductFormProps {
  initialData?: IProduct;
  isEditMode?: boolean;
}

// تابع تبدیل فایل به Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// بررسی محدودیت‌های فایل
const validateImageFile = (file: File): string | null => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'فرمت فایل باید jpg، png یا webp باشد';
  }
  if (file.size > maxSize) {
    return 'حجم فایل نباید بیشتر از 2 مگابایت باشد';
  }
  return null;
};

const ProductForm = ({ initialData, isEditMode = false }: ProductFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image || '');
  const [imageError, setImageError] = useState<string>('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: initialData || {
      title: '',
      price: 0,
      discount: 0,
      expiryDate: '',
      category: 'electronics',
      description: '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // اعتبارسنجی فایل
    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      setPreviewUrl('');
      setValue('image', '');
      return;
    }

    setImageError('');
    
    // تبدیل به Base64 برای ذخیره و پیش‌نمایش
    const base64 = await fileToBase64(file);
    setPreviewUrl(base64);
    setValue('image', base64);
  };

  const removeImage = () => {
    setPreviewUrl('');
    setValue('image', '');
    setImageError('');
  };

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // اطمینان از وجود image (اگه آپلود نشده و ادیت مود نیست، از مقدار قبلی استفاده کن)
      const productData = {
        ...data,
        image: data.image || initialData?.image || '',
      };
      
      if (isEditMode && initialData) {
        return updateProduct({ ...productData, id: initialData.id } as IProduct);
      }
      return createProduct(productData as Omit<IProduct, 'id'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-4" dir="rtl">
      <div
className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">نام محصول *</label>
              <input {...register('title')} className="w-full p-2 border rounded-lg" />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">قیمت (تومان) *</label>
              <input type="number" {...register('price')} className="w-full p-2 border rounded-lg" />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تخفیف (%)</label>
              <input type="number" {...register('discount')} className="w-full p-2 border rounded-lg" />
              {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تاریخ انقضا *</label>
              <input type="date" {...register('expiryDate')} className="w-full p-2 border rounded-lg" />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">دسته‌بندی *</label>
              <select {...register('category')} className="w-full p-2 border rounded-lg">
                <option value="electronics">الکترونیک</option>
                <option value="clothing">پوشاک</option>
                <option value="food">خوراکی</option>
                <option value="home">لوازم خانگی</option>
                <option value="books">کتاب</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">تصویر محصول *</label>
              
              {/* منطقه آپلود و پیش‌نمایش */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {previewUrl ? (
                  <div className="relative inline-block">
                    <img src={previewUrl} alt="پیش‌نمایش" className="w-32 h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500 text-sm">برای آپلود تصویر کلیک کنید</p>
                    <p className="text-gray-400 text-xs mt-1">فرمت‌های مجاز: jpg, png, webp | حداکثر حجم: 2MB</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block mt-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 text-sm"
                >
                  {previewUrl ? 'تغییر تصویر' : 'انتخاب تصویر'}
                </label>
              </div>
              
              {imageError && <p className="text-red-500 text-sm
mt-1">{imageError}</p>}
              
              {/* فیلد مخفی برای ذخیره آدرس تصویر در فرم */}
              <input type="hidden" {...register('image')} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">توضیحات</label>
              <textarea {...register('description')} rows={3} className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/products')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              انصراف
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              {isSubmitting ? 'در حال ذخیره...' : (isEditMode ? 'ویرایش محصول' : 'افزودن محصول')}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;