import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchPhotoById, createPhoto, updatePhoto } from "../../api/photos";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IPhoto } from "../../types";
import toast from "react-hot-toast";

interface PhotoFormModalProps {
  photoId?: number | null;
  onClose: () => void;
}

const photoSchema = yup.object({
  title: yup.string().required("وارد کردن عنوان عکس الزامی است"),
  url: yup
    .string()
    .url("آدرس نامعتبر")
    .required("وارد کردن آدرس عکس الزامی است"),
  thumbnailUrl: yup
    .string()
    .url("آدرس نامعتبر")
    .required("وارد کردن آدرس بند انگشتی الزامی است"),
  albumId: yup
    .number()
    .min(1, "شناسه آلبوم معتبر نیست")
    .required("شناسه آلبوم الزامی است"),
});

const PhotoFormModal = ({ photoId, onClose }: PhotoFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!photoId;

  const { data: photo, isLoading } = useQuery({
    queryKey: ["photos", photoId],
    queryFn: () => fetchPhotoById(photoId!),
    enabled: isEditMode && !!photoId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IPhoto>({
    values: photo
      ? {
          title: photo.title,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl,
          albumId: photo.albumId,
        }
      : undefined,
    defaultValues: {
      title: "",
      url: "https://picsum.photos/200",
      thumbnailUrl: "https://picsum.photos/100",
      albumId: 1,
    },
    resolver: yupResolver(photoSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: IPhoto) => {
      if (isEditMode) {
        return updatePhoto({ id: photoId!, ...data });
      }
      return createPhoto(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(
        isEditMode ? "عکس با موفقیت ویرایش شد" : "عکس با موفقیت ایجاد شد",
      );
      onClose();
    },
    onError: () => {
      toast.error("خطا در ذخیره عکس");
    },
  });

  const onSubmit = (data: IPhoto) => {
    mutation.mutate(data);
  };

  if (isEditMode && isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 md:p-4"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-none md:rounded-lg shadow-xl w-full h-full md:h-auto md:max-w-lg md:p-6 p-4 relative z-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "ویرایش عکس" : "ایجاد عکس جدید"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان عکس
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس عکس
            </label>
            <input
              type="text"
              {...register("url")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس بند انگشتی
            </label>
            <input
              type="text"
              {...register("thumbnailUrl")}
              className="w-full
p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.thumbnailUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.thumbnailUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شناسه آلبوم
            </label>
            <input
              type="number"
              {...register("albumId")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.albumId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.albumId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:bg-gray-400"
            >
              {isSubmitting || mutation.isPending
                ? "در حال ذخیره..."
                : isEditMode
                  ? "ذخیره تغییرات"
                  : "ایجاد عکس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoFormModal;
