
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../../api/products";
import type { IProduct } from "../../types";
import { ArrowRight } from "lucide-react";
import { productSchema, categoryOptions } from "./productForm.config";
import FormInput from "../../components/common/FormInput";
import FormSelect from "../../components/common/FormSelect";
import ImageUploader from "../../components/common/ImageUploader";
import PersianDatePicker from "../../components/common/PersianDatePicker";

type ProductFormData = Omit<IProduct, "id">;

interface ProductFormProps {
  initialData?: IProduct;
  isEditMode?: boolean;
}

const ProductForm = ({ initialData, isEditMode = false }: ProductFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<ProductFormData>({
    // @ts-expect-error یا مطمئن شو که در productSchema فیلد image تعریف شده است
    resolver: yupResolver(productSchema),
    values: initialData,
    defaultValues: {
      title: "",
      price: 0,
      discount: 0,
      expiryDate: "",
      category: "electronics",
      description: "",
      image: "",
    },
  });


  const expiryDateValue = useWatch({ control, name: "expiryDate" });

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEditMode && initialData
        ? updateProduct({ ...data, id: initialData.id })
        : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });


  const onSubmit = (data: IProduct) => mutation.mutate(data);

  return (
    <div className="max-w-3xl mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "ویرایش محصول" : "افزودن محصول جدید"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="نام محصول"
              name="title"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              register={register as any} // موقت
              error={errors.title}
              required
            />
            <FormInput
              label="قیمت (تومان)"
              name="price"
              type="number"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              register={register as any}
              error={errors.price}
              required
            />
            <FormInput
              label="تخفیف (%)"
              name="discount"
              type="number"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              register={register as any}
              error={errors.discount}
            />

            <div className="md:col-span-2">
              <PersianDatePicker
                value={expiryDateValue || ""}
                onChange={(date) =>
                  setValue("expiryDate", date, { shouldValidate: true })
                }
                error={errors.expiryDate?.message}
                placeholder="مثال: ۱۴۰۳/۱۲/۲۵"
              />
            </div>

            <FormSelect
              label="دسته‌بندی"
              name="category"
              options={categoryOptions}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              register={register as any}
              error={errors.category}
              required
            />

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">تصویر محصول *</label>
              <ImageUploader
                initialImage={initialData?.image}
                onImageChange={(base64) => setValue("image", base64, { shouldValidate: true })}
                error={errors.image?.message}
              />
            </div>

            <div className="md:col-span-2">
              <FormInput
                label="توضیحات"
                name="description"
                type="textarea"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                register={register as any}
                error={errors.description}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {isSubmitting
                ? "در حال ذخیره..."
                : isEditMode
                  ? "ویرایش محصول"
                  : "افزودن محصول"}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;