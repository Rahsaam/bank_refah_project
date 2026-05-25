
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';

export const useDashboardStats = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const totalProducts = products.length;

  const discountedProducts = products.filter(p => p.discount > 0).length;

  // مجموع ارزش موجودی (قیمت نهایی = قیمت * (1 - تخفیف/100))
  const totalInventoryValue = products.reduce((sum, p) => {
    const finalPrice = p.price * (1 - p.discount / 100);
    return sum + finalPrice;
  }, 0);

  const today = new Date();
  
  // محصولات منقضی شده یا نزدیک به انقضا (کمتر از 30 روز مونده)
  const expiringProducts = products.filter(p => {
    const expiryDate = new Date(p.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  return {
    totalProducts,
    discountedProducts,
    totalInventoryValue,
    expiringProducts,
    isLoading,
  };
};