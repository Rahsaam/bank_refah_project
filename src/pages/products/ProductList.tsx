import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../api/products';
// import { IProduct } from '../../types';
import { Pencil, Trash2, Eye, Plus, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ProductList = () => {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');

  // دریافت محصولات
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // حذف محصول
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // فیلتر و جستجو
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // مرتب‌سازی
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return a.title.localeCompare(b.title);
  });

  if (isLoading) return <div className="text-center p-8">در حال بارگذاری...</div>;

  return (
    <div className="container mx-auto p-4" dir="rtl">
      {/* هدر و دکمه افزودن */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        {hasPermission('create') && (
          <Link
            to="/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} /> افزودن محصول جدید
          </Link>
        )}
      </div>

      {/* فیلترها */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 p-2 border rounded-lg"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">همه دسته‌ها</option>
            <option value="electronics">الکترونیک</option>
            <option value="clothing">پوشاک</option>
            <option value="food">خوراکی</option>
            <option value="home">لوازم خانگی</option>
            <option value="books">کتاب</option>
          </select>
          <select
            value={sortBy}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 border rounded-lg"
          >
            <option value="name">مرتب‌سازی بر اساس نام</option>
            <option value="price-asc">قیمت: کم به زیاد</option>
            <option value="price-desc">قیمت: زیاد به کم</option>
          </select>
        </div>
      </div>

      {/* لیست محصولات - نمایش به صورت کارت در موبایل و جدول در دسکتاپ */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-right">تصویر</th>
              <th className="p-3 text-right">نام محصول</th>
<th className="p-3 text-right">دسته‌بندی</th>
              <th className="p-3 text-right">قیمت (تومان)</th>
              <th className="p-3 text-right">تخفیف</th>
              <th className="p-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-3">{product.title}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.price.toLocaleString()}</td>
                <td className="p-3">{product.discount}%</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="text-blue-600 hover:text-blue-800">
                      <Eye size={20} />
                    </Link>
                    {hasPermission('edit') && (
                      <Link to={`/products/${product.id}/edit`} className="text-yellow-600 hover:text-yellow-800">
                        <Pencil size={20} />
                      </Link>
                    )}
                    {hasPermission('delete') && (
                      <button onClick={() => deleteMutation.mutate(product.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نمایش کارتی در موبایل */}
      <div className="md:hidden space-y-4">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <img src={product.image} alt={product.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} تومان</p>
                {product.discount > 0 && <p className="text-sm text-red-500">تخفیف: {product.discount}%</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-3 pt-3 border-t">
              <Link to={`/products/${product.id}`} className="text-blue-600">جزئیات</Link>
              {hasPermission('edit') && <Link to={`/products/${product.id}/edit`} className="text-yellow-600">ویرایش</Link>}
              {hasPermission('delete') && (
                <button onClick={() => deleteMutation.mutate(product.id)} className="text-red-600">حذف</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;