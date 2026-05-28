import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  fetchCommentById,
  createComment,
  updateComment,
} from "../../api/comments";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IComment } from "../../types";

interface CommentFormModalProps {
  commentId?: number | null;
  onClose: () => void;
}

const commentSchema = yup.object({
  name: yup.string().required("وارد کردن نام الزامی است"),
  email: yup
    .string()
    .email("ایمیل نامعتبر")
    .required("وارد کردن ایمیل الزامی است"),
  body: yup.string().required("وارد کردن متن کامنت الزامی است"),
});

const CommentFormModal = ({ commentId, onClose }: CommentFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!commentId;

  const { data: comment, isLoading } = useQuery({
    queryKey: ["comments", commentId],
    queryFn: () => fetchCommentById(commentId!),
    enabled: isEditMode && !!commentId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // reset,
  } = useForm<IComment>({
    values: comment
      ? { name: comment.name, email: comment.email, body: comment.body }
      : undefined,
    defaultValues: {
      name: "",
      email: "",
      body: "",
    },
    resolver: yupResolver(commentSchema),
  });

  // useEffect(() => {
  //   if (comment && isEditMode) {
  //     reset({
  //       name: comment.name,
  //       email: comment.email,
  //       body: comment.body,
  //     });
  //   }
  // }, [comment, reset, isEditMode]);

  const mutation = useMutation({
    mutationFn: (data: IComment) => {
      if (isEditMode) {
        return updateComment({ id: commentId!, ...data });
      }
      return createComment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      onClose();
    },
  });

  const onSubmit = (data: IComment) => {
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
          {isEditMode ? "ویرایش کامنت" : "ایجاد کامنت جدید"}
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  : "ایجاد کامنت"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentFormModal;
