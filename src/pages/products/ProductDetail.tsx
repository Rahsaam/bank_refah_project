import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../../api/products';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { persianCategory } from '../../utils/persianCategory';

const ProductDetails = () => {
  const { id } = useParams();
  const { hasPermission } = useAuth();
  const { data: product, isLoading } = useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(Number(id)),
  });

  if (isLoading) return <div className="text-center p-8">در حال بارگذاری...</div>;
  if (!product) return <div className="text-center p-8 text-red-500">محصول یافت نشد</div>;

  const finalPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft size={20} className="ml-1" /> بازگشت به لیست محصولات
      </Link>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img src={product.image} alt={product.title} className="w-full h-64 md:h-full object-cover" />
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><span className="font-bold">دسته‌بندی:</span> {persianCategory(product.category)}</div>
              <div><span className="font-bold">قیمت اصلی:</span> {product.price.toLocaleString('fa-IR')} تومان</div>
              {product.discount > 0 && (
                <>
                  <div><span className="font-bold">تخفیف:</span> {product.discount.toLocaleString('fa-IR')}%</div>
                  <div><span className="font-bold text-green-600">قیمت نهایی:</span> {finalPrice.toLocaleString('fa-IR')} تومان</div>
                </>
              )}
              <div><span className="font-bold">تاریخ انقضا:</span> {product.expiryDate}</div>
            </div>

            <div className="flex gap-3">
              {hasPermission('edit') && (
                <Link to={`/products/${product.id}/edit`} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2">
                  <Pencil size={18} /> ویرایش
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;