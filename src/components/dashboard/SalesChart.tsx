import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// داده‌های شبیه‌سازی شده برای فروش ۶ ماه اخیر
const salesData = [
  { month: 'دی', sales: 125000000 },
  { month: 'بهمن', sales: 150000000 },
  { month: 'اسفند', sales: 180000000 },
  { month: 'فروردین', sales: 220000000 },
  { month: 'اردیبهشت', sales: 210000000 },
  { month: 'خرداد', sales: 250000000 },
];

const formatPrice = (value: number) => {
  return `${(value / 1000000).toLocaleString()}M`;
};

const SalesChart = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold mb-4 text-right">روند فروش محصولات (شش ماه اخیر)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatPrice} width="auto" style={{ direction: 'ltr' }} />
          <Tooltip formatter={(value: number) => `${(value / 1000000).toLocaleString()} میلیون تومان`} />
          <Legend />
          <Bar dataKey="sales" fill="#3b82f6" name="فروش (تومان)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;