
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

  const expiringProducts = products.filter(p => {
  if (!p.expiryDate) return false;
  
  const expiryDate = new Date(p.expiryDate);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  
  return expiryDate < today;
}).length;

  

  return {
    totalProducts,
    discountedProducts,
    totalInventoryValue,
    expiringProducts,
    isLoading,
  };
};