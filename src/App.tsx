import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductList, ProductDetails, ProductForm } from './pages/products';
import Dashboard from './pages/dashboard/Dashboard'
import TabsPage from './pages/tabs/TabsPage';
import { useAuth } from './hooks/useAuth';
import type { JSX } from 'react';


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
