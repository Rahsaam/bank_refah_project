import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Table2,
  LogOut,
  User,
} from "lucide-react";
import bankLogo from "../../assets/bank_refah_logo.jpg";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeTab = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
    { path: "/products", label: "محصولات", icon: Package },
    { path: "/tabs", label: "مدیریت داده‌ها", icon: Table2 },
  ];

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "مدیر";
      case "editor":
        return "ویرایشگر";
      case "viewer":
        return "بیننده";
      default:
        return role;
    }
  };

  return (
    <>
      {/* هدر اصلی */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* لوگو و عنوان */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold text-sm">RF</span> */}
                <img src={bankLogo} alt="logo"/>
              </div>
              <span className="font-bold text-gray-800 hidden sm:inline">
                بانک رفاه
              </span>
            </Link>

            {/* منوی دسکتاپ */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors py-1 ${
                    activeTab === item.path
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* اطلاعات کاربر + دکمه خروج (دسکتاپ) */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <User size={16} className="text-gray-500" />
                <div className="text-sm">
                  <span className="font-medium text-gray-800">
                    {user?.username}
                  </span>
                  <span className="text-xs text-gray-500 mr-1">
                    ({getRoleName(user?.role || "")})
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>خروج</span>
              </button>
            </div>

            {/* دکمه منوی همبرگری (موبایل) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors z-55"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= منوی موبایل جدید با انیمیشن نرم ================= */}
      {/* ۱. اوورلی تیره با انیمیشن Fade */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 pointer-events-none ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ۲. منوی کناری با انیمیشن Slide از راست به چپ */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-55 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* بخش پروفایل کاربر */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-800">
                {user?.username}
              </div>
              <div className="text-xs text-gray-500">
                {getRoleName(user?.role || "")}
              </div>
            </div>
          </div>
        </div>

        {/* آیتم‌های منو */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === item.path
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}

          {/* دکمه خروج */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full mt-4 border-t border-gray-100 pt-4"
          >
            <LogOut size={20} />
            <span>خروج از سیستم</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;