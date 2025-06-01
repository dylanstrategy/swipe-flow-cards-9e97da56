
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, User } from 'lucide-react';

const AccountTab = () => {
  const { toast } = useToast();

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const accountSections = [
    {
      title: "Open Work Orders",
      count: "5 WORK ORDERS",
      icon: "🔧",
      image: "/placeholder.svg",
      tag: "ELECTRICAL",
      action: () => handleAction("Viewed", "Work Orders")
    },
    {
      title: "Open Messages", 
      count: "3 MESSAGES",
      preview: "Is the pool open today?",
      action: () => handleAction("Viewed", "Messages")
    },
    {
      title: "Pending Moves",
      count: "2 MOVES", 
      icon: "📦",
      image: "/placeholder.svg",
      tag: "MOVING",
      action: () => handleAction("Viewed", "Moves")
    },
    {
      title: "Pending Leases",
      count: "2 LEASES",
      icon: "📄", 
      image: "/placeholder.svg",
      tag: "LEASE",
      action: () => handleAction("Viewed", "Leases")
    },
    {
      title: "Pending Work Orders",
      count: "4 WORK ORDERS",
      listView: true,
      action: () => handleAction("Viewed", "Pending Work Orders")
    },
    {
      title: "Upcoming Events",
      count: "1 EVENT",
      icon: "📅",
      action: () => handleAction("Viewed", "Events")
    }
  ];

  const quickActions = [
    { title: "Payment History", action: () => handleAction("Viewed", "Payment History") },
    { title: "Lease Documents", action: () => handleAction("Viewed", "Lease Documents") },
    { title: "Rewards Program", action: () => handleAction("Viewed", "Rewards") },
    { title: "Digital Wallet", action: () => handleAction("Viewed", "Wallet") },
    { title: "Maintenance History", action: () => handleAction("Viewed", "Maintenance History") },
    { title: "Community Events", action: () => handleAction("Viewed", "Community Events") }
  ];

  return (
    <div className="px-4 py-6 pb-24 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Account</h1>
      
      {/* User Profile Section */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">John Smith</h2>
            <p className="text-gray-600">Unit 4B</p>
          </div>
        </div>

        {/* Rent and Lease Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rent</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">$1,800</p>
            <p className="text-gray-500">Due May 1st</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lease</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">8 mos</p>
            <p className="text-gray-500">Remaining</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        {quickActions.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span className="text-lg font-medium text-gray-900">{item.title}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Account Sections Grid */}
      <div className="grid grid-cols-2 gap-4">
        {accountSections.map((section, index) => (
          <button
            key={index}
            onClick={section.action}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
            
            {section.image && (
              <div className="relative mb-3">
                <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-2xl">{section.icon}</span>
                </div>
                {section.tag && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                    {section.tag}
                  </span>
                )}
              </div>
            )}

            {section.preview && (
              <div className="mb-3">
                <p className="text-gray-600 text-sm">{section.preview}</p>
              </div>
            )}

            {section.listView && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            )}

            {section.icon && !section.image && (
              <div className="mb-3">
                <span className="text-2xl">{section.icon}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{section.count}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountTab;
