import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchPostById, createPost, updatePost } from "../../api/posts";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IPost } from "../../types";
import toast from "react-hot-toast";

interface PostFormModalProps {
  postId?: number | null;
  onClose: () => void;
}

const postSchema = yup.object({
  title: yup.string().required("وارد کردن عنوان الزامی است"),
  body: yup.string().required("وارد کردن محتوا الزامی است"),
});

const PostFormModal = ({ postId, onClose }: PostFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!postId;

  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => fetchPostById(postId!),
    enabled: isEditMode && !!postId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IPost>({
    values: post ? { title: post.title, body: post.body } : undefined,
    defaultValues: {
      title: "",
      body: "",
      userId: 1,
    },
    resolver: yupResolver(postSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: IPost) => {
      if (isEditMode) {
        return updatePost({ id: postId!, ...data });
      }
      return createPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(
        isEditMode ? "پست با موفقیت ویرایش شد" : "پست با موفقیت ایجاد شد",
      );
      onClose();
    },
    onError: () => {
      toast.error("خطا در ذخیره پست");
    },
  });

  const onSubmit = (data: IPost) => {
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
          {isEditMode ? "ویرایش پست" : "ایجاد پست جدید"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان پست
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
              محتوای پست
            </label>
            <textarea
              rows={5}
              {...register("body")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.body && (
              <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>
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
              className="bg-blue-600
text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:bg-gray-400"
            >
              {isSubmitting || mutation.isPending
                ? "در حال ذخیره..."
                : isEditMode
                  ? "ذخیره تغییرات"
                  : "ایجاد پست"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;
