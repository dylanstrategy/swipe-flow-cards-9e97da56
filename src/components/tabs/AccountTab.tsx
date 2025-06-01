
import React from 'react';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';

const AccountTab = () => {
  const { toast } = useToast();

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Account</h1>
      <p className="text-gray-600 mb-6">Manage your rental account</p>
      
      {/* Lease Card */}
      <SwipeCard
        onSwipeRight={{
          label: "Renew Lease",
          action: () => handleAction("Lease Renewal Started", "Lease Agreement"),
          color: "#10B981"
        }}
        onSwipeLeft={{
          label: "Transfer",
          action: () => handleAction("Transfer Initiated", "Lease Agreement"),
          color: "#F59E0B"
        }}
        onSwipeUp={{
          label: "View History",
          action: () => handleAction("History Opened", "Lease Agreement"),
          color: "#6366F1"
        }}
        onTap={() => handleAction("Viewed", "Lease Agreement")}
      >
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Lease
            </span>
            <span className="text-sm text-green-600 font-semibold">Active</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Apartment 204</h3>
          <p className="text-gray-600 mb-3">Lease expires March 31, 2025</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">🏠 1BR/1BA</span>
            <span>📅 18 months left</span>
          </div>
        </div>
      </SwipeCard>

      {/* Payments Card */}
      <SwipeCard
        onSwipeRight={{
          label: "Make Payment",
          action: () => handleAction("Payment Started", "Monthly Rent"),
          color: "#3B82F6"
        }}
        onSwipeLeft={{
          label: "Setup Autopay",
          action: () => handleAction("Autopay Setup", "Payment Settings"),
          color: "#8B5CF6"
        }}
        onSwipeUp={{
          label: "Full Ledger",
          action: () => handleAction("Ledger Opened", "Payment History"),
          color: "#06B6D4"
        }}
        onTap={() => handleAction("Viewed", "Payment Information")}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Payments
            </span>
            <span className="text-sm text-green-600 font-semibold">Paid</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">January Rent</h3>
          <p className="text-gray-600 mb-3">$1,250.00 - Due January 1st</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">💳 Auto-pay enabled</span>
            <span>✅ On time</span>
          </div>
        </div>
      </SwipeCard>

      {/* Maintenance Card */}
      <SwipeCard
        onSwipeRight={{
          label: "New Request",
          action: () => handleAction("New Request", "Maintenance"),
          color: "#F59E0B"
        }}
        onSwipeLeft={{
          label: "Emergency",
          action: () => handleAction("Emergency Request", "Maintenance"),
          color: "#EF4444"
        }}
        onSwipeUp={{
          label: "Request History",
          action: () => handleAction("History Opened", "Maintenance"),
          color: "#6B7280"
        }}
        onTap={() => handleAction("Viewed", "Maintenance")}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Maintenance
            </span>
            <span className="text-sm text-gray-500">2 active</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Requests</h3>
          <p className="text-gray-600 mb-3">Track and submit maintenance requests</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">🔧 HVAC scheduled</span>
            <span>🚿 Plumbing pending</span>
          </div>
        </div>
      </SwipeCard>

      {/* Loyalty Card */}
      <SwipeCard
        onSwipeRight={{
          label: "Redeem Points",
          action: () => handleAction("Points Redeemed", "Loyalty Program"),
          color: "#EC4899"
        }}
        onSwipeLeft={{
          label: "Refer Friend",
          action: () => handleAction("Referral Started", "Loyalty Program"),
          color: "#8B5CF6"
        }}
        onSwipeUp={{
          label: "Activity History",
          action: () => handleAction("Activity Opened", "Loyalty Program"),
          color: "#06B6D4"
        }}
        onTap={() => handleAction("Viewed", "Loyalty Program")}
      >
        <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Rewards
            </span>
            <span className="text-sm text-pink-600 font-semibold">1,250 pts</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resident Rewards</h3>
          <p className="text-gray-600 mb-3">Earn points for referrals and reviews</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">⭐ Gold Status</span>
            <span>🎁 250 pts to reward</span>
          </div>
        </div>
      </SwipeCard>
    </div>
  );
};

export default AccountTab;
