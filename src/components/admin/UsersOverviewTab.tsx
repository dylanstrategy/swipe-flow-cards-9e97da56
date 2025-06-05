
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const UsersOverviewTab = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Users Overview</h3>
        <p className="text-gray-600">
          Users overview interface will be implemented here. This will show you all users across all companies with advanced filtering and management capabilities.
        </p>
      </CardContent>
    </Card>
  );
};

export default UsersOverviewTab;
