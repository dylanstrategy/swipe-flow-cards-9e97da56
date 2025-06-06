
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Applaud</h1>
        
        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Residential Living. Never Made Easier.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={() => navigate('/resident')}
            >
              <span>Resident Dashboard</span>
              <span className="text-blue-600">→</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={() => navigate('/discovery')}
            >
              <span>Discovery</span>
              <span className="text-blue-600">→</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={() => navigate('/matches')}
            >
              <span>Matches</span>
              <span className="text-blue-600">→</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={() => navigate('/maintenance')}
            >
              <span>Maintenance</span>
              <span className="text-blue-600">→</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={() => navigate('/operator')}
            >
              <span>Operator</span>
              <span className="text-blue-600">→</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={() => navigate('/super-admin')}
            >
              <span>Super Admin</span>
              <span className="text-blue-600">→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
