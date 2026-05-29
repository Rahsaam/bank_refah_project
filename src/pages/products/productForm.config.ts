import * as yup from "yup";
import heic2any from "heic2any";

export const productSchema = yup.object({
  title: yup
    .string()
    .min(3, "حداقل 3 کاراکتر")
    .required("نام محصول الزامی است"),
  price: yup
    .number()
    .min(10000, "حداقل قیمت 10,000 تومان")
    .max(100000000, "حداکثر قیمت 100,000,000 تومان")
    .required("قیمت الزامی است"),
  discount: yup
    .number()
    .min(0, "تخفیف نمیتواند منفی باشد")
    .max(70, "حداکثر تخفیف 70 درصد")
    .default(0),
  expiryDate: yup.string().required("تاریخ انقضا الزامی است"),
  category: yup
    .string()
    .oneOf(["electronics", "clothing", "food", "home", "books"])
    .required("دسته‌بندی الزامی است"),
  description: yup.string().optional(),
  image: yup.string().required("تصویر محصول الزامی است"),
});

export const categoryOptions = [
  { value: "electronics", label: "الکترونیک" },
  { value: "clothing", label: "پوشاک" },
  { value: "food", label: "خوراکی" },
  { value: "home", label: "لوازم خانگی" },
  { value: "books", label: "کتاب" },
];


export const convertHeicToJpeg = async (file: File): Promise<File> => {
  try {
    const blob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8,
    });

    const convertedFile = new File(
      [blob as Blob],
      file.name.replace(/\.(heic|heif)$/i, ".jpg"),
      {
        type: "image/jpeg",
      },
    );

    return convertedFile;
  } catch (error) {
    const err = error as Error;
    throw new Error(`خطا در تبدیل فرمت تصویر: ${err.message}`, {
      cause: error,
    });
  }
};

export const validateImageFile = async (
  file: File,
): Promise<{ isValid: boolean; error: string | null; processedFile: File }> => {
  const maxSize = 2 * 1024 * 1024; // 2MB

  let processedFile = file;


  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.match(/\.(heic|heif)$/i)
  ) {
    try {
      processedFile = await convertHeicToJpeg(file);
    } catch (err) {
      console.log(err);

      return {
        isValid: false,
        error:
          "فرمت تصویر پشتیبانی نمی‌شود. لطفاً تصویر را به فرمت JPEG تبدیل کنید.",
        processedFile: file,
      };
    }
  }

  if (processedFile.size > maxSize) {
    return {
      isValid: false,
      error: "حجم فایل نباید بیشتر از 2 مگابایت باشد",
      processedFile,
    };
  }

  return {
    isValid: true,
    error: null,
    processedFile,
  };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
