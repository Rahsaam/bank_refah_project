import { useDashboardStats } from "../../hooks/useDashboardStats";
import StatsCards from "../../components/dashboard/StatsCards";
import SalesChart from "../../components/dashboard/SalesChart";
import CategoryPieChart from "../../components/dashboard/CategoryPieChart";
import QuickAccessWidgets from "../../components/dashboard/QuickAccessWidgets";

const Dashboard = () => {
  const {
    totalProducts,
    discountedProducts,
    totalInventoryValue,
    expiringProducts,
    isLoading,
  } = useDashboardStats();

  if (isLoading) {
    return <div className="text-center p-8">در حال بارگذاری داشبورد...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-right">داشبورد مدیریت</h1>

        <StatsCards
          totalProducts={totalProducts}
          discountedProducts={discountedProducts}
          totalInventoryValue={totalInventoryValue}
          expiringProducts={expiringProducts}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesChart />
          <CategoryPieChart />
        </div>

        <QuickAccessWidgets />
      </div>
    </div>
  );
};

export default Dashboard;
