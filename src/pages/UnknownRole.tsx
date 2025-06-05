
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, LogOut, Mail } from 'lucide-react';

const UnknownRole = () => {
  const { userProfile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Role Not Recognized
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your account role is not configured properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">Account Details</h3>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {userProfile?.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Role:</strong> {userProfile?.role || 'Not assigned'}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">What to do next:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Contact your system administrator</li>
              <li>• Request proper role assignment</li>
              <li>• Try signing out and back in</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.location.href = 'mailto:support@applaudliving.com'}
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnknownRole;
