import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';
import moment from 'moment-jalaali';

export const useDashboardStats = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const totalProducts = products.length;

  const discountedProducts = products.filter(p => p.discount > 0).length;

  const totalInventoryValue = products.reduce((sum, p) => {
    const finalPrice = p.price * (1 - p.discount / 100);
    return sum + finalPrice;
  }, 0);

  const expiringProducts = products.filter(p => {
    if (!p.expiryDate) return false;
    

    const expiryDate = moment(p.expiryDate).toDate();
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