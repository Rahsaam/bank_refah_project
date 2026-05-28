// src/components/common/AlbumFormModal.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchAlbumById, createAlbum, updateAlbum } from "../../api/albums";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IAlbum } from "../../types";

interface AlbumFormModalProps {
  albumId?: number | null;
  onClose: () => void;
}

const albumSchema = yup.object({
  title: yup.string().required("وارد کردن عنوان آلبوم الزامی است"),
  userId: yup
    .number()
    .min(1, "شناسه کاربر معتبر نیست")
    .required("شناسه کاربر الزامی است"),
});

const AlbumFormModal = ({ albumId, onClose }: AlbumFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!albumId;

  const { data: album, isLoading } = useQuery({
    queryKey: ["albums", albumId],
    queryFn: () => fetchAlbumById(albumId!),
    enabled: isEditMode && !!albumId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IAlbum>({
     values: album
      ? { title: album.title, userId: album.userId }
      : undefined,
    defaultValues: {
      title: "",
      userId: 1,
    },
    resolver: yupResolver(albumSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: IAlbum) => {
      if (isEditMode) {
        return updateAlbum({ id: albumId!, ...data });
      }
      return createAlbum(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      onClose();
    },
  });

  const onSubmit = (data: IAlbum) => {
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
          {isEditMode ? "ویرایش آلبوم" : "ایجاد آلبوم جدید"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان آلبوم
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
              شناسه کاربر
            </label>
            <input
              type="number"
              {...register("userId")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.userId.message}
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
                  : "ایجاد آلبوم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlbumFormModal;
