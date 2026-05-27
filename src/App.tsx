import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProductList, ProductDetails, ProductForm } from "./pages/products";
import Dashboard from "./pages/dashboard/Dashboard";
import TabsPage from "./pages/tabs/TabsPage";
import { useAuth } from "./hooks/useAuth";
import type { JSX } from "react";
import LoginPage from "./pages/login/LoginPage";
import Layout from "./components/layout/Layout";
import EditProductWrapper from "./components/common/EditProductWrapper";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Layout> {children} </Layout>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProductWrapper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tabs"
          element={
            <ProtectedRoute>
              <TabsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
