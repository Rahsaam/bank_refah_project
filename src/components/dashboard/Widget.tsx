import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Widget = ({ title, value, icon: Icon, linkTo, linkText, color, isLoading, error }: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  linkTo: string;
  linkText: string;
  color: string;
  isLoading: boolean;
  error: unknown;
}) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <div className={`${color} p-2 rounded-lg text-white`}>
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className="text-gray-500 text-sm">{title}</p>
        {isLoading ? (
              <LoaderCircle size={24} className="animate-spin text-blue-500" />
            ) : error ? (
              <span className="text-red-500 text-sm">خطا در بارگذاری</span>
            ) : (
              value.toLocaleString()
            )}
      </div>
    </div>
    <Link to={linkTo} className="text-blue-600 text-sm hover:underline block text-left">
      {linkText} ←
    </Link>
  </div>
);

export default Widget;