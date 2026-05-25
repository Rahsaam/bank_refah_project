
import * as yup from 'yup';


export const productSchema = yup.object({
  title: yup.string().min(3, 'حداقل 3 کاراکتر').required('نام محصول الزامی است'),
  price: yup.number().min(10000, 'حداقل قیمت 10,000 تومان').max(100000000, 'حداکثر قیمت 100,000,000 تومان').required('قیمت الزامی است'),
  discount: yup.number().min(0, 'تخفیف نمیتواند منفی باشد').max(70, 'حداکثر تخفیف 70 درصد').default(0),
  expiryDate: yup.string().required('تاریخ انقضا الزامی است'),
  category: yup.string().oneOf(['electronics', 'clothing', 'food', 'home', 'books']).required('دسته‌بندی الزامی است'),
  description: yup.string().optional(),
  image: yup.string().required("تصویر محصول الزامی است"),
});


export const categoryOptions = [
  { value: 'electronics', label: 'الکترونیک' },
  { value: 'clothing', label: 'پوشاک' },
  { value: 'food', label: 'خوراکی' },
  { value: 'home', label: 'لوازم خانگی' },
  { value: 'books', label: 'کتاب' },
];

export const validateImageFile = (file: File): string | null => {
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


export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};