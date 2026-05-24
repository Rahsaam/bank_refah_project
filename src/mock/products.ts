import type { IProduct } from '../types/index';

export const mockProducts: IProduct[] = [
  {
    id: 1,
    title: 'لپ‌تاپ ایسوس ROG',
    price: 45000000,
    discount: 10,
    expiryDate: '1404/12/01',
    category: 'electronics',
    image: 'https://picsum.photos/id/0/200/200',
    description: 'لپ‌تاپ گیمینگ با پردازنده Intel Core i9 و رم 32GB'
  },
  {
    id: 2,
    title: 'کیف چرم زنانه',
    price: 3500000,
    discount: 20,
    expiryDate: '1404/10/15',
    category: 'clothing',
    image: 'https://picsum.photos/id/1/200/200',
    description: 'کیف چرم طبیعی با طرح کلاسیک'
  },
  {
    id: 3,
    title: 'قهوه ترک 500 گرمی',
    price: 450000,
    discount: 5,
    expiryDate: '1404/08/20',
    category: 'food',
    image: 'https://picsum.photos/id/2/200/200',
    description: 'قهوه ترک درجه یک از شمال ایران'
  },
  {
    id: 4,
    title: 'یخچال ساید بای ساید',
    price: 85000000,
    discount: 15,
    expiryDate: '1404/12/30',
    category: 'home',
    image: 'https://picsum.photos/id/3/200/200',
    description: 'یخچال 800 لیتری با قابلیت هوشمند'
  },
  {
    id: 5,
    title: 'کتاب هنر جنگ سان تزو',
    price: 89000,
    discount: 0,
    expiryDate: '1405/01/01',
    category: 'books',
    image: 'https://picsum.photos/id/4/200/200',
    description: 'کتاب معروف استراتژی و رهبری'
  },
  {
    id: 6,
    title: 'هدفون بیس بی سیم',
    price: 2850000,
    discount: 25,
    expiryDate: '1404/09/15',
    category: 'electronics',
    image: 'https://picsum.photos/id/5/200/200',
    description: 'هدفون نویز کنسلینگ با 40 ساعت شارژدهی'
  },
];