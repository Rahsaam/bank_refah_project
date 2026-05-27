import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchCommentById, updateComment } from "../../api/comments";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface EditCommentModalProps {
  commentId: number;
  onClose: () => void;
}

interface CommentFormData {
  name: string;
  email: string;
  body: string;
}

const commentModalSchema = yup.object({
  name: yup.string().required("وارد کردن نام الزامی است"),
  email: yup
    .string()
    .email("فرمت ایمیل وارد شده معتبر نیست")
    .required("وارد کردن ایمیل الزامی است"),
  body: yup.string().required("وارد کردن متن کامنت الزامی است"),

});
const EditCommentModal = ({ commentId, onClose }: EditCommentModalProps) => {
  const queryClient = useQueryClient();

  const {
    data: comment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", commentId],
    queryFn: () => fetchCommentById(commentId),
    enabled: !!commentId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    values: comment
      ? { name: comment.name, email: comment.email, body: comment.body }
      : undefined,
    resolver: yupResolver(commentModalSchema)
  });

  //   useEffect(() => {
  //     if (post) {
  //       reset({
  //         title: post.title,
  //         body: post.body,
  //       });
  //     }
  //   }, [post, reset]);

  const mutation = useMutation({
    mutationFn: (data: CommentFormData) =>
      updateComment({ id: commentId, postId: comment?.postId || 1, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      onClose();
    },
  });

  const onSubmit = (data: CommentFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        dir="rtl"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl">
          در حال بارگذاری اطلاعات کامنت...
        </div>
      </div>
    );
  }

  if (error || !comment) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        dir="rtl"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl text-red-500">
          خطا در دریافت اطلاعات!
          <button
            onClick={onClose}
            className="mr-4 px-3 py-1 bg-gray-200 rounded"
          >
            بستن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative z-10">
        <h2 className="text-xl font-bold mb-4">
          ویرایش کامنت (کد: {commentId})
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ltr text-right"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              متن کامنت
            </label>
            <textarea
              rows={4}
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
              className="px-4 py-2 border rounded-lg text-sm"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              {isSubmitting || mutation.isPending
                ? "در حال ذخیره..."
                : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCommentModal;
