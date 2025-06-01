
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, User } from 'lucide-react';
import SwipeCard from '../SwipeCard';

const AccountTab = () => {
  const { toast } = useToast();

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const accountCards = [
    {
      id: 'lease',
      title: "Lease Management",
      subtitle: "8 months remaining",
      icon: "🧾",
      swipeActions: {
        onSwipeRight: {
          label: "Renew Lease",
          action: () => handleAction("Started lease renewal", "Lease"),
          color: "#10B981",
          icon: "📝"
        },
        onSwipeLeft: {
          label: "Transfer/Cancel",
          action: () => handleAction("Started transfer request", "Lease"),
          color: "#EF4444",
          icon: "🔄"
        },
        onSwipeUp: {
          label: "Lease Docs",
          action: () => handleAction("Viewed lease documents", "Lease"),
          color: "#8B5CF6",
          icon: "📄"
        }
      }
    },
    {
      id: 'maintenance',
      title: "Maintenance",
      subtitle: "5 work orders",
      icon: "🧺",
      swipeActions: {
        onSwipeRight: {
          label: "Submit New",
          action: () => handleAction("Started new work order", "Maintenance"),
          color: "#3B82F6",
          icon: "➕"
        },
        onSwipeLeft: {
          label: "Vendor Contact",
          action: () => handleAction("Viewed vendor contact", "Maintenance"),
          color: "#F59E0B",
          icon: "📞"
        },
        onSwipeUp: {
          label: "Rate Service",
          action: () => handleAction("Opened service rating", "Maintenance"),
          color: "#8B5CF6",
          icon: "⭐"
        }
      }
    },
    {
      id: 'payments',
      title: "Payments",
      subtitle: "$1,800 rent due",
      icon: "💸",
      swipeActions: {
        onSwipeRight: {
          label: "Make Payment",
          action: () => handleAction("Started payment", "Rent"),
          color: "#10B981",
          icon: "💳"
        },
        onSwipeLeft: {
          label: "Setup Autopay",
          action: () => handleAction("Setup autopay", "Payments"),
          color: "#3B82F6",
          icon: "🔄"
        },
        onSwipeUp: {
          label: "Payment History",
          action: () => handleAction("Viewed payment history", "Payments"),
          color: "#8B5CF6",
          icon: "📊"
        }
      }
    },
    {
      id: 'loyalty',
      title: "Loyalty & Lifestyle",
      subtitle: "250 points available",
      icon: "🎯",
      swipeActions: {
        onSwipeRight: {
          label: "Redeem",
          action: () => handleAction("Started redemption", "Rewards"),
          color: "#10B981",
          icon: "🎁"
        },
        onSwipeLeft: {
          label: "Share with Friend",
          action: () => handleAction("Shared rewards", "Loyalty Program"),
          color: "#3B82F6",
          icon: "👥"
        },
        onSwipeUp: {
          label: "View Tags",
          action: () => handleAction("Viewed earned tags", "Lifestyle"),
          color: "#8B5CF6",
          icon: "🏷️"
        }
      }
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

      {/* Main Account Cards */}
      <div className="space-y-4 mb-6">
        {accountCards.map((card) => (
          <SwipeCard
            key={card.id}
            onSwipeRight={card.swipeActions.onSwipeRight}
            onSwipeLeft={card.swipeActions.onSwipeLeft}
            onSwipeUp={card.swipeActions.onSwipeUp}
            onTap={() => handleAction("Viewed", card.title)}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{card.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                    <p className="text-gray-600">{card.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </SwipeCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 px-3">Quick Actions</h3>
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
    </div>
  );
};

export default AccountTab;
