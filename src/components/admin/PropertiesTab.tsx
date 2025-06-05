
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Home } from 'lucide-react';

const PropertiesTab = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Properties Management</h3>
        <p className="text-gray-600">
          Properties management interface will be implemented here. This will allow you to view and manage all properties across all companies.
        </p>
      </CardContent>
    </Card>
  );
};

export default PropertiesTab;
