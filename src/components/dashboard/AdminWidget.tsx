import { Package, Plus, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AdminWidget = ({
  productCount,
  hasCreatePermission,
  isLoading,
  error,
}: {
  productCount: string;
  hasCreatePermission: boolean;
  isLoading: boolean;
  error: unknown;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="bg-blue-500 p-2 rounded-lg text-white">
          <Package size={20} />
        </div>
        <div className="text-left">
          <p className="text-gray-500 text-sm">محصولات</p>
          <div className="text-2xl font-bold flex justify-end">
            {isLoading ? (
              <LoaderCircle size={24} className="animate-spin text-blue-500" />
            ) : error ? (
              <span className="text-red-500 text-sm">خطا در بارگذاری</span>
            ) : (
              productCount.toLocaleString()
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <Link to="/products" className="text-blue-600 text-sm hover:underline">
          مدیریت محصولات ←
        </Link>
        {hasCreatePermission && (
          <Link
            to="/products/new"
            className="bg-green-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
          >
            <Plus size={14} /> افزودن
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminWidget;
