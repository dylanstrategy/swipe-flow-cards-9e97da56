
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Home, Mail, Phone } from 'lucide-react';
import { useResident } from '@/contexts/ResidentContext';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';

const AccountTab = () => {
  const { profile } = useResident();
  const [showIdentitySetup, setShowIdentitySetup] = useState(false);

  if (showIdentitySetup) {
    return <ResidentIdentitySetup onBack={() => setShowIdentitySetup(false)} />;
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarFallback className="text-xl font-bold bg-blue-600 text-white">
                  {profile.preferredName.charAt(0)}{profile.fullName.split(' ')[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{profile.preferredName}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Home className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">The Meridian • Apt {profile.unitNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 min-w-0">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 flex-shrink-0">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto min-h-[3rem] px-4 py-3"
              onClick={() => setShowIdentitySetup(true)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Identity Setup</div>
                  <div className="text-sm text-gray-600 truncate">Update your personal information</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>

            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Bell className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Notifications</div>
                  <div className="text-sm text-gray-600 truncate">Manage your notification preferences</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>

            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Shield className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Privacy & Security</div>
                  <div className="text-sm text-gray-600 truncate">Manage your privacy settings</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>

            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <CreditCard className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Payment Methods</div>
                  <div className="text-sm text-gray-600 truncate">Manage rent payment options</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <HelpCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Help Center</div>
                  <div className="text-sm text-gray-600 truncate">FAQs and support articles</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>

            <Button variant="ghost" className="w-full justify-between h-auto min-h-[3rem] px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Mail className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate">Contact Support</div>
                  <div className="text-sm text-gray-600 truncate">Get help from our team</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="p-4">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountTab;
