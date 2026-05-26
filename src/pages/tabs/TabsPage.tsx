import { useSearchParams } from 'react-router-dom';
import ContentTab from '../../components/tabs/ContentTab';
import MediaTab from '../../components/tabs/MediaTab';
import ManagementTab from '../../components/tabs/ManagementTab';

type TabType = 'content' | 'media' | 'management';

const TabsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ۱. مقدار تب را مستقیم از URL می‌خوانیم. اگر وجود نداشت یا نامعتبر بود، به عنوان پیش‌فرض 'content' را در نظر می‌گیریم.
  const urlTab = searchParams.get('tab') as TabType;
  const activeTab: TabType = ['content', 'media', 'management'].includes(urlTab)
    ? urlTab
    : 'content';

  const tabs = [
    { id: 'content', label: 'محتوا (Content)', icon: '📝' },
    { id: 'media', label: 'رسانه (Media)', icon: '🖼' },
    { id: 'management', label: 'مدیریت (Management)', icon: '⚙' },
  ];

  // ۲. هنگام تغییر تب، فقط URL را بروزرسانی می‌کنیم؛ ری‌اکت خودش متوجه تغییر شده و کامپوننت را با مقدار جدید رندر می‌کند.
  const handleTabChange = (tabId: TabType) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-right">مدیریت داده‌های عمومی</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* تب‌های اصلی */}
          <div className="border-b">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="ml-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* محتوای تب فعال */}
          <div className="p-4">
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'media' && <MediaTab />}
            {activeTab === 'management' && <ManagementTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabsPage;