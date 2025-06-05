
import React, { useState } from 'react';
import { ArrowLeft, Calculator, Settings, TrendingUp, AlertTriangle, CheckCircle, Edit, Building, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingDashboardProps {
  onBack: () => void;
}

const PricingDashboard = ({ onBack }: PricingDashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Property Setup
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dynamic Pricing Dashboard</h1>
          <p className="text-gray-600">Configure pricing based on comp analysis, occupancy thresholds, and expiration management</p>
        </div>

        <Tabs defaultValue="comps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="comps">Comp Analysis</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy Parameters</TabsTrigger>
            <TabsTrigger value="expiration">Expiration Management</TabsTrigger>
            <TabsTrigger value="promotions">Promotions & Concessions</TabsTrigger>
          </TabsList>

          {/* Comp Analysis Tab */}
          <TabsContent value="comps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comp Analysis Configuration</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure competitor properties with min/max pricing by unit type and weights for blended analysis
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comp Analysis Setup</h3>
                  <p className="text-gray-600 mb-6">
                    Add competitor properties with their pricing ranges and weights to calculate North Star pricing
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Parameters Tab */}
          <TabsContent value="occupancy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Parameters</CardTitle>
                <p className="text-sm text-gray-600">
                  Set occupancy thresholds and corresponding pricing adjustments
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Occupancy Rules</h3>
                  <p className="text-gray-600 mb-6">
                    Configure how pricing adjusts based on weekly occupancy levels (e.g., 98% = +5%, 95% = market rate)
                  </p>
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Parameters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expiration Management Tab */}
          <TabsContent value="expiration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expiration Management</CardTitle>
                <p className="text-sm text-gray-600">
                  Set monthly expiration allocations and lease term restrictions
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Expiration Control</h3>
                  <p className="text-gray-600 mb-6">
                    Manage expiration distribution across months to maintain balanced renewals
                  </p>
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Set Allocations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Promotions & Concessions</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure available promotions and concessions for pricing
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Promotions Setup</h3>
                  <p className="text-gray-600 mb-6">
                    Add promotions like free months, deposit specials, and fee waivers
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Promotion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1" disabled>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingDashboard;
