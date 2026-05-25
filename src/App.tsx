// import { useState } from "react";
// import { useAuth } from "./hooks/useAuth";

// function App() {
//   const { login, user, logout, hasPermission, isAuthenticated } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const success = await login(username, password);
//     if (!success) {
//       setError("نام کاربری یا رمز عبور اشتباه است");
//     } else {
//       setError("");
//       setUsername("");
//       setPassword("");
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
//           <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
//             ورود به سیستم
//           </h1>
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 mb-2">نام کاربری</label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="admin / editor / viewer"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">رمز عبور</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               ورود
//             </button>
//           </form>
//           <div className="mt-4 text-sm text-gray-500 text-center">
//             <p>admin / admin123</p>
//             <p>editor / editor123</p>
//             <p>viewer / viewer123</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-lg">
//                 خوش آمدی، <span className="font-bold">{user?.username}</span>
//               </p>
//               <p className="text-sm text-gray-500">
//                 نقش:{" "}
//                 {user?.role === "admin"
//                   ? "مدیر"
//                   : user?.role === "editor"
//                     ? "ویرایشگر"
//                     : "بیننده"}
//               </p>
//             </div>
//             <button
//               onClick={logout}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//             >
//               خروج
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-bold mb-4">دسترسی‌ها</h2>
//           <div className="space-y-2">
//             <p>
//               مشاهده:{" "}
//               {hasPermission("view") ? "دارد" : "ندارد"}
//             </p>
//             <p>
//               ایجاد:{" "}
//               {hasPermission("create") ? "دارد" : "ندارد"}
//             </p>
//             <p>ویرایش: {hasPermission("edit") ? "دارد" : "ندارد"}</p>
//             <p>حذف: {hasPermission("delete") ? "دارد" : "ندارد"}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;





import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductList, ProductDetails, ProductForm } from './pages/products';
import { useAuth } from './hooks/useAuth';
import type { JSX } from 'react';

// یک کامپوننت ساده برای صفحات در حال ساخت (بعداً با صفحات واقعی جایگزین میشه)
const Dashboard = () => <div className="p-8 text-center">داشبورد (در حال ساخت)</div>;
const TabsPage = () => <div className="p-8 text-center">صفحه تب‌ها (در حال ساخت)</div>;
// محافظت از مسیرها (نیازمند احراز هویت)

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* صفحه لاگین - اگر لاگین بود به داشبورد بره */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <div>صفحه لاگین (در حال ساخت)</div>
        } />
        
        {/* مسیرهای محافظت شده */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* ماژول محصولات */}
        <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/products/:id/edit" element={<ProtectedRoute><ProductForm isEditMode /></ProtectedRoute>} />
        
        {/* در اینده صفحه تب‌ها */}
        <Route path="/tabs" element={<ProtectedRoute><TabsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
