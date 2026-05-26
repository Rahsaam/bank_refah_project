import { useSearchParams } from "react-router-dom";
import { Image, NotebookPen, Settings } from "lucide-react";
import ContentTab from "../../components/tabs/ContentTab";
import MediaTab from "../../components/tabs/MediaTab";
import ManagementTab from "../../components/tabs/ManagementTab";

type TabType = "content" | "media" | "management";

const TabsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = searchParams.get("tab") as TabType;
  const activeTab: TabType = ["content", "media", "management"].includes(urlTab)
    ? urlTab
    : "content";

  const activeSubtab = searchParams.get("subtab") || undefined;

  const tabs = [
    {
      id: "content",
      label: "محتوا (Content)",
      icon: <NotebookPen size={18} />,
    },
    { id: "media", label: "رسانه (Media)", icon: <Image size={18} /> },
    {
      id: "management",
      label: "مدیریت (Management)",
      icon: <Settings size={18} />,
    },
  ];

  const handleTabChange = (tabId: TabType) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-right">
          مدیریت داده‌های عمومی
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex">
                    <span className="ml-2">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {activeTab === "content" && <ContentTab initialSubtab={activeSubtab} />}
            {activeTab === "media" && <MediaTab initialSubtab={activeSubtab} />}
            {activeTab === "management" && <ManagementTab initialSubtab={activeSubtab} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabsPage;
