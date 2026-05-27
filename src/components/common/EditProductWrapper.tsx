import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductForm } from '../../pages/products';
import { fetchProductById } from '../../api/products';

const EditProductWrapper = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
  });

  console.log('product for special id', product);
  

  if (isLoading) return <div className="text-center p-8">در حال بارگذاری اطلاعات محصول...</div>;
  if (error || !product) return <div className="text-center p-8 text-red-500">خطا در دریافت اطلاعات محصول!</div>;

  return <ProductForm initialData={product} isEditMode={true} />;
};

export default EditProductWrapper;