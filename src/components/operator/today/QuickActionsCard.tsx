
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, FileText, Calendar } from 'lucide-react';

const QuickActionsCard = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
            <Plus className="w-6 h-6" />
            <span className="text-sm">Add Resident</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
            <Wrench className="w-6 h-6" />
            <span className="text-sm">Create Work Order</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
            <FileText className="w-6 h-6" />
            <span className="text-sm">Generate Report</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Schedule Tour</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
