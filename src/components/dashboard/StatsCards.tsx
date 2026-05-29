import { Package, Percent, Banknote, CalendarClock } from 'lucide-react';
import type { IStatsCardsProps } from '../../types';
import { formatPrice } from '../../utils/formatPrice';

const StatsCards = ({
  totalProducts,
  discountedProducts,
  totalInventoryValue,
  expiringProducts,
}: IStatsCardsProps) => {
  const cards = [
    {
      title: 'کل محصولات',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      format: 'number',
    },
    {
      title: 'محصولات با تخفیف',
      value: discountedProducts,
      icon: Percent,
      color: 'bg-green-500',
      format: 'number',
    },
    {
      title: 'مجموع ارزش موجودی',
      value: totalInventoryValue,
      icon: Banknote,
      color: 'bg-purple-500',
      format: 'price',
    },
    {
      title: 'محصولات منقضی شده',
      value: expiringProducts,
      icon: CalendarClock,
      color: 'bg-red-500',
      format: 'number',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">{card.title}</p>
            <p className="text-2xl font-bold">
              {card.format === 'price' ? `${formatPrice(card.value)} تومان` : formatPrice(card.value)}
            </p>
          </div>
          <div className={`${card.color} p-3 rounded-full text-white`}>
            <card.icon size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;