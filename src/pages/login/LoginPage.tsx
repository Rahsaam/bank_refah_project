import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, User, Lock } from "lucide-react";

const loginSchema = yup.object({
  username: yup.string().required("نام کاربری الزامی است"),
  password: yup
    .string()
    .min(4, "رمز عبور حداقل 4 کاراکتر")
    .required("رمز عبور الزامی است"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    const success = await login(data.username, data.password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ورود به سیستم</h1>
          <p className="text-gray-500 text-sm mt-2">بانک رفاه کارگران</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              نام کاربری
            </label>
            <div className="relative">
              <User
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                {...register("username")}
                placeholder="admin / editor / viewer"
                className="w-full pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                dir="ltr"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              رمز عبور
            </label>
            <div className="relative">
              <Lock
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                {...register("password")}
                placeholder="********"
                className="w-full pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                dir="ltr"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "در حال ورود..." : "ورود"}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-gray-400">حساب‌های آزمایشی:</p>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <div>
              <span className="font-medium text-blue-600">admin</span>
              <span className="text-gray-400"> / admin123</span>
            </div>
            <div>
              <span className="font-medium text-green-600">editor</span>
              <span className="text-gray-400"> / editor123</span>
            </div>
            <div>
              <span className="font-medium text-orange-600">viewer</span>
              <span className="text-gray-400"> / viewer123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
