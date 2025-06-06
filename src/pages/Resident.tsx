
import React from 'react';
import ResidentPreview from '@/components/admin/ResidentPreview';
import { Card, CardContent } from "@/components/ui/card";

const Resident = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]"> {/* Set proper height */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resident Dashboard</h1>
        
        {/* Resident Dashboard */}
        <Card className="flex flex-col h-[calc(100vh-8rem)]"> {/* Set proper height */}
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ResidentPreview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resident;
