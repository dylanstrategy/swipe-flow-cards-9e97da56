
import React, { useState } from 'react';
import { ArrowLeft, Calculator, Settings, TrendingUp, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PricingDashboardProps {
  onBack: () => void;
}

const PricingDashboard = ({ onBack }: PricingDashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dynamic Pricing Dashboard</h1>
            <p className="text-sm text-gray-600">Configure pricing based on comp analysis and occupancy</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="comps" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="comps" className="text-xs">Comp Analysis</TabsTrigger>
            <TabsTrigger value="occupancy" className="text-xs">Occupancy</TabsTrigger>
            <TabsTrigger value="expiration" className="text-xs">Expiration</TabsTrigger>
            <TabsTrigger value="promotions" className="text-xs">Promotions</TabsTrigger>
          </TabsList>

          {/* Comp Analysis Tab */}
          <TabsContent value="comps" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Competitor Analysis</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure competitor properties with pricing ranges and weights
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-2">Add Competitor Properties</h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                    Add properties with their pricing ranges to calculate North Star pricing
                  </p>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Parameters Tab */}
          <TabsContent value="occupancy" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Occupancy Thresholds</CardTitle>
                <p className="text-sm text-gray-600">
                  Set occupancy levels and corresponding pricing adjustments
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-2">Configure Occupancy Rules</h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                    Set how pricing adjusts based on weekly occupancy levels
                  </p>
                  <Button size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Set Parameters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expiration Management Tab */}
          <TabsContent value="expiration" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Expiration Control</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage monthly expiration allocations and lease terms
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-2">Set Expiration Limits</h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                    Control expiration distribution to maintain balanced renewals
                  </p>
                  <Button size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Promotions & Concessions</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure available promotions and concessions
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-2">Add Promotions</h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                    Create promotions like free months and deposit specials
                  </p>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Promotion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PricingDashboard;
