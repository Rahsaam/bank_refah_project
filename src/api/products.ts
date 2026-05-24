import { mockProducts } from "../mock/products";
import type { IProduct } from "../types";


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// دریافت محصولات
export const fetchProducts = async(): Promise<IProduct[]> => {
    await delay(500)
    return [...mockProducts]
}

// دریافت جزییات محصول
export const fetchProductById = async(id: number): Promise<IProduct> => {
    await delay(300)
    const product = mockProducts.find(product => product.id === id);
    if(!product) throw new Error('محصول مورد نظر یافت نشد')
    return {...product}
};

// ایجاد محصول
export const createProduct = async(product: Omit<IProduct, 'id'>): Promise<IProduct> => {
    await delay(500);
    const newProduct = {
        ...product,
        id: Math.max(...mockProducts.map(p => p.id)) + 1,
    }
    mockProducts.push(newProduct)
    return {...newProduct}
};

// ویرایش محصول
export const updateProduct = async ({ id, ...updatedData }: IProduct): Promise<IProduct> => {
  await delay(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('محصول یافت نشد');
  
  const updatedProduct = { ...mockProducts[index], ...updatedData };
  mockProducts[index] = updatedProduct;
  return { ...updatedProduct };
};

// حذف محصول
export const deleteProduct = async (id: number): Promise<void> => {
  await delay(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('محصول یافت نشد');
  mockProducts.splice(index, 1);
};