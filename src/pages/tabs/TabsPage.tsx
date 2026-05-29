import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Image, NotebookPen, Settings } from "lucide-react";
import ContentTab from "../../components/tabs/ContentTab";
import MediaTab from "../../components/tabs/MediaTab";
import ManagementTab from "../../components/tabs/ManagementTab";

type TabType = "content" | "media" | "management";

const TabsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (tab && ["content", "media", "management"].includes(tab)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tab);
    }
  }, [searchParams]);

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
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setIsMobileMenuOpen(false);
  };

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "";

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-right">
          مدیریت داده‌های عمومی
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {windowWidth >= 768 ? (
            <div className="border-b">
              <div className="flex overflow-x-auto">
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
          ) : (
            <div className="border-b p-4">
              <div className="relative">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {tabs.find((tab) => tab.id === activeTab)?.icon}
                    </span>
                    <span className="font-medium">{activeTabLabel}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-20 overflow-hidden">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as TabType)}
                        className={`w-full text-right px-4 py-3 flex items-center gap-2 transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span>{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-4">
            {activeTab === "content" && (
              <ContentTab
                initialSubtab={searchParams.get("subtab") || undefined}
              />
            )}
            {activeTab === "media" && (
              <MediaTab
                initialSubtab={searchParams.get("subtab") || undefined}
              />
            )}
            {activeTab === "management" && (
              <ManagementTab
                initialSubtab={searchParams.get("subtab") || undefined}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabsPage;
