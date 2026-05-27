import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchPostById, updatePost } from "../../api/posts";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface EditPostModalProps {
  postId: number;
  onClose: () => void;
}

interface PostFormData {
  title: string;
  body: string;
}

const postModalSchema = yup.object({
  title: yup.string().required("وارد کردن عنوان الزامی است"),
  body: yup
    .string()
    .required("وارد کردن محتوا الزامی است"),
});

const EditPostModal = ({ postId, onClose }: EditPostModalProps) => {
  const queryClient = useQueryClient();


  const { data: post, isLoading, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    values: post ? { title: post.title, body: post.body } : undefined,
    resolver: yupResolver(postModalSchema),
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
    mutationFn: (data: PostFormData) => updatePost({ id: postId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
  });

  const onSubmit = (data: PostFormData) => {
    mutation.mutate(data);
  };


  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
        <div className="bg-white p-6 rounded-lg shadow-xl">در حال بارگذاری اطلاعات پست...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
        <div className="bg-white p-6 rounded-lg shadow-xl text-red-500">
          خطا در دریافت اطلاعات!
          <button onClick={onClose} className="mr-4 px-3 py-1 bg-gray-200 rounded">بستن</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative z-10 animate-fade-in">
        <h2 className="text-xl font-bold mb-4">ویرایش پست (کد: {postId})</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان پست</label>
            <input
              type="text"
              {...register("title")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">محتوای پست</label>
            <textarea
              rows={5}
              {...register("body")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
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
              {isSubmitting || mutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;