import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchUserById, createUser, updateUser } from "../../api/users";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import type { IClient } from "../../types";

interface UserFormModalProps {
  userId?: number | null;
  onClose: () => void;
}

const userSchema = yup.object({
  name: yup.string().required("وارد کردن نام الزامی است"),
  username: yup.string().required("وارد کردن نام کاربری الزامی است"),
  email: yup.string().email("ایمیل نامعتبر").required("وارد کردن ایمیل الزامی است"),
  phone: yup.string().required("وارد کردن تلفن الزامی است"),
  website: yup.string().required("آدرس وبسایت الزامی است"),
});

const UserFormModal = ({ userId, onClose }: UserFormModalProps) => {
  const queryClient = useQueryClient();
  const isEditMode = !!userId;

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => fetchUserById(userId!),
    enabled: isEditMode && !!userId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IClient>({
    values: user
      ? { name: user.name, username: user.username, email: user.email, phone: user.phone, website: user.website }
      : undefined,
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      website: "",
    },
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    if (user && isEditMode) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
      });
    }
  }, [user, reset, isEditMode]);

  const mutation = useMutation({
    mutationFn: (data: IClient) => {
      if (isEditMode) {
        return updateUser({ id: userId!, ...data });
      }
      return createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  const onSubmit = (data: IClient) => {
    mutation.mutate(data);
  };

  if (isEditMode && isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 md:p-4" dir="rtl">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-none md:rounded-lg shadow-xl w-full h-full md:h-auto md:max-w-lg md:p-6 p-4 relative z-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "ویرایش کاربر" : "ایجاد کاربر جدید"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
            <input
              type="text"
              {...register("username")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded-lg focus:ring-2focus:ring-blue-500 outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
            <input
              type="text"
              {...register("phone")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وبسایت</label>
            <input
              type="text"
              {...register("website")}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
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
                : "ایجاد کاربر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;