
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingDashboardProps {
  onBack: () => void;
}

interface CompProperty {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  weight: number;
}

interface OccupancyThreshold {
  id: string;
  minOccupancy: number;
  maxOccupancy: number;
  priceAdjustment: number;
  adjustmentType: 'percentage' | 'fixed';
}

interface ExpirationRule {
  id: string;
  month: string;
  maxPercentage: number;
}

interface Promotion {
  id: string;
  name: string;
  type: 'free_months' | 'deposit_waived' | 'reduced_deposit' | 'gift_card';
  value: number;
  description: string;
}

const PricingDashboard = ({ onBack }: PricingDashboardProps) => {
  const [compProperties, setCompProperties] = useState<CompProperty[]>([]);
  const [occupancyThresholds, setOccupancyThresholds] = useState<OccupancyThreshold[]>([]);
  const [expirationRules, setExpirationRules] = useState<ExpirationRule[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const addCompProperty = () => {
    const newProperty: CompProperty = {
      id: Date.now().toString(),
      name: '',
      minPrice: 0,
      maxPrice: 0,
      weight: 1
    };
    setCompProperties([...compProperties, newProperty]);
  };

  const updateCompProperty = (id: string, field: keyof CompProperty, value: string | number) => {
    setCompProperties(properties =>
      properties.map(prop =>
        prop.id === id ? { ...prop, [field]: value } : prop
      )
    );
  };

  const removeCompProperty = (id: string) => {
    setCompProperties(properties => properties.filter(prop => prop.id !== id));
  };

  const addOccupancyThreshold = () => {
    const newThreshold: OccupancyThreshold = {
      id: Date.now().toString(),
      minOccupancy: 0,
      maxOccupancy: 100,
      priceAdjustment: 0,
      adjustmentType: 'percentage'
    };
    setOccupancyThresholds([...occupancyThresholds, newThreshold]);
  };

  const updateOccupancyThreshold = (id: string, field: keyof OccupancyThreshold, value: string | number) => {
    setOccupancyThresholds(thresholds =>
      thresholds.map(threshold =>
        threshold.id === id ? { ...threshold, [field]: value } : threshold
      )
    );
  };

  const removeOccupancyThreshold = (id: string) => {
    setOccupancyThresholds(thresholds => thresholds.filter(threshold => threshold.id !== id));
  };

  const addExpirationRule = () => {
    const newRule: ExpirationRule = {
      id: Date.now().toString(),
      month: 'January',
      maxPercentage: 10
    };
    setExpirationRules([...expirationRules, newRule]);
  };

  const updateExpirationRule = (id: string, field: keyof ExpirationRule, value: string | number) => {
    setExpirationRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const removeExpirationRule = (id: string) => {
    setExpirationRules(rules => rules.filter(rule => rule.id !== id));
  };

  const addPromotion = () => {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      name: '',
      type: 'free_months',
      value: 0,
      description: ''
    };
    setPromotions([...promotions, newPromotion]);
  };

  const updatePromotion = (id: string, field: keyof Promotion, value: string | number) => {
    setPromotions(promos =>
      promos.map(promo =>
        promo.id === id ? { ...promo, [field]: value } : promo
      )
    );
  };

  const removePromotion = (id: string) => {
    setPromotions(promos => promos.filter(promo => promo.id !== id));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Competitor Properties</CardTitle>
                    <p className="text-sm text-gray-600">
                      Add competitor properties with pricing ranges and weights
                    </p>
                  </div>
                  <Button onClick={addCompProperty} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {compProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No competitor properties added yet.</p>
                  </div>
                ) : (
                  compProperties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Property Details</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCompProperty(property.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`name-${property.id}`}>Property Name</Label>
                          <Input
                            id={`name-${property.id}`}
                            value={property.name}
                            onChange={(e) => updateCompProperty(property.id, 'name', e.target.value)}
                            placeholder="e.g., Sunset Apartments"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`weight-${property.id}`}>Weight</Label>
                          <Input
                            id={`weight-${property.id}`}
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={property.weight}
                            onChange={(e) => updateCompProperty(property.id, 'weight', parseFloat(e.target.value) || 0)}
                            placeholder="1.0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`min-${property.id}`}>Min Price ($)</Label>
                          <Input
                            id={`min-${property.id}`}
                            type="number"
                            min="0"
                            value={property.minPrice}
                            onChange={(e) => updateCompProperty(property.id, 'minPrice', parseInt(e.target.value) || 0)}
                            placeholder="1200"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`max-${property.id}`}>Max Price ($)</Label>
                          <Input
                            id={`max-${property.id}`}
                            type="number"
                            min="0"
                            value={property.maxPrice}
                            onChange={(e) => updateCompProperty(property.id, 'maxPrice', parseInt(e.target.value) || 0)}
                            placeholder="1800"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Parameters Tab */}
          <TabsContent value="occupancy" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Occupancy Thresholds</CardTitle>
                    <p className="text-sm text-gray-600">
                      Set occupancy levels and corresponding pricing adjustments
                    </p>
                  </div>
                  <Button onClick={addOccupancyThreshold} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Threshold
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {occupancyThresholds.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No occupancy thresholds configured yet.</p>
                  </div>
                ) : (
                  occupancyThresholds.map((threshold) => (
                    <div key={threshold.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Threshold Configuration</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOccupancyThreshold(threshold.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`min-occ-${threshold.id}`}>Min Occupancy (%)</Label>
                          <Input
                            id={`min-occ-${threshold.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={threshold.minOccupancy}
                            onChange={(e) => updateOccupancyThreshold(threshold.id, 'minOccupancy', parseInt(e.target.value) || 0)}
                            placeholder="80"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`max-occ-${threshold.id}`}>Max Occupancy (%)</Label>
                          <Input
                            id={`max-occ-${threshold.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={threshold.maxOccupancy}
                            onChange={(e) => updateOccupancyThreshold(threshold.id, 'maxOccupancy', parseInt(e.target.value) || 0)}
                            placeholder="95"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`adj-type-${threshold.id}`}>Adjustment Type</Label>
                          <Select
                            value={threshold.adjustmentType}
                            onValueChange={(value: 'percentage' | 'fixed') => updateOccupancyThreshold(threshold.id, 'adjustmentType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`adj-val-${threshold.id}`}>
                            Price Adjustment ({threshold.adjustmentType === 'percentage' ? '%' : '$'})
                          </Label>
                          <Input
                            id={`adj-val-${threshold.id}`}
                            type="number"
                            value={threshold.priceAdjustment}
                            onChange={(e) => updateOccupancyThreshold(threshold.id, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                            placeholder={threshold.adjustmentType === 'percentage' ? '5' : '50'}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expiration Management Tab */}
          <TabsContent value="expiration" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Expiration Control</CardTitle>
                    <p className="text-sm text-gray-600">
                      Manage monthly expiration allocations and lease terms
                    </p>
                  </div>
                  <Button onClick={addExpirationRule} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {expirationRules.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No expiration rules configured yet.</p>
                  </div>
                ) : (
                  expirationRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Expiration Rule</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExpirationRule(rule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`month-${rule.id}`}>Month</Label>
                          <Select
                            value={rule.month}
                            onValueChange={(value) => updateExpirationRule(rule.id, 'month', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`max-pct-${rule.id}`}>Max Expiration (%)</Label>
                          <Input
                            id={`max-pct-${rule.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={rule.maxPercentage}
                            onChange={(e) => updateExpirationRule(rule.id, 'maxPercentage', parseInt(e.target.value) || 0)}
                            placeholder="15"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Promotions & Concessions</CardTitle>
                    <p className="text-sm text-gray-600">
                      Configure available promotions and concessions
                    </p>
                  </div>
                  <Button onClick={addPromotion} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Promotion
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {promotions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No promotions configured yet.</p>
                  </div>
                ) : (
                  promotions.map((promotion) => (
                    <div key={promotion.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Promotion Details</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePromotion(promotion.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`promo-name-${promotion.id}`}>Promotion Name</Label>
                          <Input
                            id={`promo-name-${promotion.id}`}
                            value={promotion.name}
                            onChange={(e) => updatePromotion(promotion.id, 'name', e.target.value)}
                            placeholder="e.g., First Month Free"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`promo-type-${promotion.id}`}>Type</Label>
                          <Select
                            value={promotion.type}
                            onValueChange={(value: 'free_months' | 'deposit_waived' | 'reduced_deposit' | 'gift_card') => updatePromotion(promotion.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free_months">Free Months</SelectItem>
                              <SelectItem value="deposit_waived">Deposit Waived</SelectItem>
                              <SelectItem value="reduced_deposit">Reduced Deposit</SelectItem>
                              <SelectItem value="gift_card">Gift Card</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`promo-value-${promotion.id}`}>
                          Value ({promotion.type === 'free_months' ? 'months' : '$'})
                        </Label>
                        <Input
                          id={`promo-value-${promotion.id}`}
                          type="number"
                          min="0"
                          value={promotion.value}
                          onChange={(e) => updatePromotion(promotion.id, 'value', parseFloat(e.target.value) || 0)}
                          placeholder={promotion.type === 'free_months' ? '1' : '500'}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`promo-desc-${promotion.id}`}>Description</Label>
                        <Input
                          id={`promo-desc-${promotion.id}`}
                          value={promotion.description}
                          onChange={(e) => updatePromotion(promotion.id, 'description', e.target.value)}
                          placeholder="Brief description of the promotion"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PricingDashboard;
