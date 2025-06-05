
import React, { useState, useEffect } from 'react';
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
  // Current occupancy for the property
  const [currentOccupancy, setCurrentOccupancy] = useState(96.5);
  
  // Market comparables configuration
  const [marketComps, setMarketComps] = useState([
    { 
      name: 'Journal Squared 1', 
      studioMin: 2597, studioMax: 2601,
      oneBRMin: 3056, oneBRMax: 3100,
      twoBRMin: 4309, twoBRMax: 0,
      threeBRMin: 5745, threeBRMax: 5745,
      weight: 20, 
      quality: 9 
    },
    { 
      name: 'Journal Squared 2', 
      studioMin: 2597, studioMax: 2783,
      oneBRMin: 3056, oneBRMax: 3068,
      twoBRMin: 4300, twoBRMax: 0,
      threeBRMin: 0, threeBRMax: 0,
      weight: 15, 
      quality: 9 
    },
    { 
      name: '28 Cottage Street', 
      studioMin: 2200, studioMax: 2300,
      oneBRMin: 2400, oneBRMax: 2500,
      twoBRMin: 5890, twoBRMax: 0,
      threeBRMin: 6000, threeBRMax: 6038,
      weight: 25, 
      quality: 8 
    },
    { 
      name: 'MetroVue', 
      studioMin: 1990, studioMax: 0,
      oneBRMin: 1867, oneBRMax: 0,
      twoBRMin: 2755, twoBRMax: 2896,
      threeBRMin: 0, threeBRMax: 0,
      weight: 10, 
      quality: 7 
    },
    { 
      name: 'Urby JSQ', 
      studioMin: 2700, studioMax: 2700,
      oneBRMin: 2745, oneBRMax: 2995,
      twoBRMin: 4345, twoBRMax: 4465,
      threeBRMin: 4414, threeBRMax: 4690,
      weight: 30, 
      quality: 9 
    }
  ]);

  // Occupancy thresholds with pricing adjustments
  const [occupancyThresholds, setOccupancyThresholds] = useState([
    { threshold: 98, adjustment: 5, type: 'percent' },
    { threshold: 97, adjustment: 2, type: 'percent' },
    { threshold: 95, adjustment: 0, type: 'percent' },
    { threshold: 93, adjustment: -2, type: 'percent' },
    { threshold: 90, adjustment: -5, type: 'percent' },
    { threshold: 85, adjustment: -8, type: 'percent' }
  ]);

  // Unit type pricing configuration with market rent
  const [unitTypePricing, setUnitTypePricing] = useState([
    { 
      type: 'Studio', 
      marketRent: 2650, 
      minRent: 2400, 
      maxRent: 2900, 
      available: true,
      unitCount: 45
    },
    { 
      type: '1BR', 
      marketRent: 3200, 
      minRent: 2950, 
      maxRent: 3500, 
      available: true,
      unitCount: 120
    },
    { 
      type: '2BR', 
      marketRent: 4100, 
      minRent: 3800, 
      maxRent: 4500, 
      available: true,
      unitCount: 80
    },
    { 
      type: '3BR', 
      marketRent: 5200, 
      minRent: 4800, 
      maxRent: 5700, 
      available: true,
      unitCount: 35
    }
  ]);

  // Monthly expiration allocation limits
  const [expirationAllocation, setExpirationAllocation] = useState([
    { month: 'Jan', percentage: 8, maxUnits: 24, currentCount: 18 },
    { month: 'Feb', percentage: 12, maxUnits: 36, currentCount: 32 },
    { month: 'Mar', percentage: 15, maxUnits: 45, currentCount: 41 },
    { month: 'Apr', percentage: 10, maxUnits: 30, currentCount: 28 },
    { month: 'May', percentage: 8, maxUnits: 24, currentCount: 22 },
    { month: 'Jun', percentage: 6, maxUnits: 18, currentCount: 15 },
    { month: 'Jul', percentage: 7, maxUnits: 21, currentCount: 19 },
    { month: 'Aug', percentage: 9, maxUnits: 27, currentCount: 24 },
    { month: 'Sep', percentage: 11, maxUnits: 33, currentCount: 30 },
    { month: 'Oct', percentage: 6, maxUnits: 18, currentCount: 16 },
    { month: 'Nov', percentage: 4, maxUnits: 12, currentCount: 10 },
    { month: 'Dec', percentage: 4, maxUnits: 12, currentCount: 8 }
  ]);

  // Lease term adjustments
  const [leaseTermAdjustments, setLeaseTermAdjustments] = useState([
    { term: 6, adjustment: -150, type: 'dollar' },
    { term: 7, adjustment: -100, type: 'dollar' },
    { term: 8, adjustment: -75, type: 'dollar' },
    { term: 9, adjustment: -50, type: 'dollar' },
    { term: 10, adjustment: -25, type: 'dollar' },
    { term: 11, adjustment: 0, type: 'dollar' },
    { term: 12, adjustment: 0, type: 'dollar' },
    { term: 13, adjustment: 25, type: 'dollar' },
    { term: 14, adjustment: 50, type: 'dollar' },
    { term: 15, adjustment: 75, type: 'dollar' }
  ]);

  // Promotions and concessions
  const [promotions, setPromotions] = useState([
    { name: '2 Months Free', value: 2, type: 'months_free', active: true },
    { name: '1 Month Free', value: 1, type: 'months_free', active: true },
    { name: '$500 Deposit Special', value: 500, type: 'deposit_discount', active: false },
    { name: 'Waived App Fee', value: 100, type: 'fee_waiver', active: true }
  ]);

  // 18-week forecast with occupancy projections
  const [weeklyForecast] = useState(() => {
    const weeks = [];
    for (let i = 1; i <= 18; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i * 7));
      weeks.push({
        week: i,
        date: date.toDateString(),
        occupancy: Math.max(85, currentOccupancy - Math.random() * 8 + Math.random() * 3),
        moveIns: Math.floor(Math.random() * 8) + 2,
        moveOuts: Math.floor(Math.random() * 6) + 1
      });
    }
    return weeks;
  });

  // Calculate blended comp price for a unit type
  const calculateCompPrice = (unitType: string) => {
    const totalWeight = marketComps.reduce((sum, comp) => sum + comp.weight, 0);
    
    let weightedPrice = 0;
    marketComps.forEach(comp => {
      let price = 0;
      switch (unitType) {
        case 'Studio':
          price = comp.studioMin || comp.studioMax || 0;
          break;
        case '1BR':
          price = comp.oneBRMin || comp.oneBRMax || 0;
          break;
        case '2BR':
          price = comp.twoBRMin || comp.twoBRMax || 0;
          break;
        case '3BR':
          price = comp.threeBRMin || comp.threeBRMax || 0;
          break;
      }
      
      if (price > 0) {
        weightedPrice += (price * comp.weight / totalWeight);
      }
    });

    return Math.round(weightedPrice);
  };

  // Get occupancy adjustment based on current occupancy
  const getOccupancyAdjustment = (basePrice: number) => {
    const threshold = occupancyThresholds.find(t => currentOccupancy >= t.threshold);
    if (!threshold) return 0;
    
    return threshold.type === 'percent' 
      ? Math.round(basePrice * (threshold.adjustment / 100))
      : threshold.adjustment;
  };

  // Calculate final pricing for a unit type with all factors
  const calculateFinalPricing = (unitType: string) => {
    const selectedUnit = unitTypePricing.find(unit => unit.type === unitType);
    if (!selectedUnit) return [];

    const compPrice = calculateCompPrice(unitType);
    const marketRent = selectedUnit.marketRent;
    
    // North Star price (blended market and comp)
    const northStarPrice = Math.round((marketRent + compPrice) / 2);
    const occupancyAdjustment = getOccupancyAdjustment(northStarPrice);

    const pricing = [];

    for (const termAdj of leaseTermAdjustments) {
      // Calculate expiration month
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + termAdj.term);
      const expirationMonth = expirationDate.toLocaleDateString('en-US', { month: 'short' });
      
      // Check if expiration is allowed
      const monthData = expirationAllocation.find(month => month.month === expirationMonth);
      const isTermAllowed = monthData ? monthData.currentCount < monthData.maxUnits : true;

      // Calculate final rent
      let finalRent = northStarPrice + occupancyAdjustment;
      finalRent += termAdj.type === 'percent' 
        ? Math.round(finalRent * (termAdj.adjustment / 100))
        : termAdj.adjustment;

      // Apply min/max constraints
      finalRent = Math.max(selectedUnit.minRent, Math.min(selectedUnit.maxRent, finalRent));

      pricing.push({
        term: termAdj.term,
        rent: Math.round(finalRent),
        expirationMonth,
        isAllowed: isTermAllowed,
        compPrice,
        marketRent,
        northStarPrice,
        occupancyAdjustment,
        termAdjustment: termAdj.adjustment
      });
    }

    return pricing.sort((a, b) => b.rent - a.rent);
  };

  const addNewComp = () => {
    setMarketComps([...marketComps, {
      name: 'New Property',
      studioMin: 2500, studioMax: 0,
      oneBRMin: 3000, oneBRMax: 0,
      twoBRMin: 3800, twoBRMax: 0,
      threeBRMin: 4800, threeBRMax: 0,
      weight: 0,
      quality: 5
    }]);
  };

  const removeComp = (index: number) => {
    setMarketComps(marketComps.filter((_, i) => i !== index));
  };

  const addNewPromotion = () => {
    setPromotions([...promotions, {
      name: 'New Promotion',
      value: 0,
      type: 'months_free',
      active: false
    }]);
  };

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
          <p className="text-gray-600">Comprehensive pricing engine with comp analysis, occupancy thresholds, and PPF management</p>
        </div>

        <Tabs defaultValue="comps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="comps">Comp Analysis</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy Rules</TabsTrigger>
            <TabsTrigger value="expiration">Expiration Control</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Engine</TabsTrigger>
          </TabsList>

          {/* Comp Analysis Tab */}
          <TabsContent value="comps" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Market Comparables Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Configure competitor properties with min/max pricing by unit type</p>
                </div>
                <Button onClick={addNewComp} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Property
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Studio Min</TableHead>
                      <TableHead>Studio Max</TableHead>
                      <TableHead>1BR Min</TableHead>
                      <TableHead>1BR Max</TableHead>
                      <TableHead>2BR Min</TableHead>
                      <TableHead>2BR Max</TableHead>
                      <TableHead>3BR Min</TableHead>
                      <TableHead>3BR Max</TableHead>
                      <TableHead>Weight (%)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketComps.map((comp, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={comp.name}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].name = e.target.value;
                              setMarketComps(newComps);
                            }}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.studioMin}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].studioMin = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.studioMax}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].studioMax = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.oneBRMin}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].oneBRMin = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.oneBRMax}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].oneBRMax = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.twoBRMin}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].twoBRMin = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.twoBRMax}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].twoBRMax = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.threeBRMin}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].threeBRMin = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.threeBRMax}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].threeBRMax = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.weight}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].weight = parseInt(e.target.value) || 0;
                              setMarketComps(newComps);
                            }}
                            className="w-16"
                            min="0"
                            max="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeComp(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Blended Rates by Unit Type</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Studio</div>
                      <div className="text-lg font-semibold">${calculateCompPrice('Studio').toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">1BR</div>
                      <div className="text-lg font-semibold">${calculateCompPrice('1BR').toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">2BR</div>
                      <div className="text-lg font-semibold">${calculateCompPrice('2BR').toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">3BR</div>
                      <div className="text-lg font-semibold">${calculateCompPrice('3BR').toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Rules Tab */}
          <TabsContent value="occupancy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Thresholds & Adjustments</CardTitle>
                  <p className="text-sm text-gray-600">Configure pricing adjustments based on occupancy levels</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Label>Current Occupancy (%)</Label>
                    <Input
                      type="number"
                      value={currentOccupancy}
                      onChange={(e) => setCurrentOccupancy(parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {occupancyThresholds.map((threshold, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Label className="text-sm">≥{threshold.threshold}% occupancy</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={threshold.adjustment}
                            onChange={(e) => {
                              const newThresholds = [...occupancyThresholds];
                              newThresholds[index].adjustment = parseFloat(e.target.value);
                              setOccupancyThresholds(newThresholds);
                            }}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unit Type Market Rents</CardTitle>
                  <p className="text-sm text-gray-600">Set market rent and constraints by unit type</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {unitTypePricing.map((unit, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{unit.type}</h4>
                          <Badge>{unit.unitCount} units</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Min Rent</Label>
                            <Input
                              type="number"
                              value={unit.minRent}
                              onChange={(e) => {
                                const newUnits = [...unitTypePricing];
                                newUnits[index].minRent = parseInt(e.target.value);
                                setUnitTypePricing(newUnits);
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Market Rent</Label>
                            <Input
                              type="number"
                              value={unit.marketRent}
                              onChange={(e) => {
                                const newUnits = [...unitTypePricing];
                                newUnits[index].marketRent = parseInt(e.target.value);
                                setUnitTypePricing(newUnits);
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Max Rent</Label>
                            <Input
                              type="number"
                              value={unit.maxRent}
                              onChange={(e) => {
                                const newUnits = [...unitTypePricing];
                                newUnits[index].maxRent = parseInt(e.target.value);
                                setUnitTypePricing(newUnits);
                              }}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expiration Control Tab */}
          <TabsContent value="expiration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expiration Allocation</CardTitle>
                <p className="text-sm text-gray-600">
                  Set the maximum percentage of total expirations allowed per month
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {expirationAllocation.map((month, index) => (
                    <Card key={month.month} className="p-4">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold">{month.month}</h4>
                        <Badge className={
                          month.currentCount >= month.maxUnits ? 'bg-red-100 text-red-800' :
                          month.currentCount >= month.maxUnits * 0.9 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {month.currentCount}/{month.maxUnits}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">Allocation %</Label>
                          <Input
                            type="number"
                            value={month.percentage}
                            onChange={(e) => {
                              const newAllocation = [...expirationAllocation];
                              newAllocation[index].percentage = parseInt(e.target.value);
                              newAllocation[index].maxUnits = Math.floor(300 * parseInt(e.target.value) / 100);
                              setExpirationAllocation(newAllocation);
                            }}
                            className="h-8 text-sm"
                            min="0"
                            max="25"
                          />
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          Available: {Math.max(0, month.maxUnits - month.currentCount)} units
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Promotions & Concessions</CardTitle>
                  <p className="text-sm text-gray-600">Configure available promotions and concessions</p>
                </div>
                <Button onClick={addNewPromotion} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Promotion
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promotions.map((promo, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={promo.name}
                          onChange={(e) => {
                            const newPromos = [...promotions];
                            newPromos[index].name = e.target.value;
                            setPromotions(newPromos);
                          }}
                          placeholder="Promotion name"
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={promo.value}
                          onChange={(e) => {
                            const newPromos = [...promotions];
                            newPromos[index].value = parseInt(e.target.value);
                            setPromotions(newPromos);
                          }}
                          placeholder="Value"
                        />
                      </div>
                      <div className="w-32">
                        <Select 
                          value={promo.type} 
                          onValueChange={(value) => {
                            const newPromos = [...promotions];
                            newPromos[index].type = value;
                            setPromotions(newPromos);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="months_free">Months Free</SelectItem>
                            <SelectItem value="deposit_discount">Deposit Discount</SelectItem>
                            <SelectItem value="fee_waiver">Fee Waiver</SelectItem>
                            <SelectItem value="rent_discount">Rent Discount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge className={promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {promo.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Engine Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {unitTypePricing.filter(unit => unit.available).map((unit) => {
                const pricing = calculateFinalPricing(unit.type);
                return (
                  <Card key={unit.type}>
                    <CardHeader>
                      <CardTitle className="text-lg">{unit.type} Pricing</CardTitle>
                      <p className="text-sm text-gray-600">{unit.unitCount} units available</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-gray-600">North Star Price</div>
                          <div className="text-lg font-semibold text-blue-700">
                            ${pricing[0]?.northStarPrice?.toLocaleString() || 0}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-gray-600">Market</div>
                            <div className="font-medium">${unit.marketRent.toLocaleString()}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600">Comp</div>
                            <div className="font-medium">${calculateCompPrice(unit.type).toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="text-center text-xs">
                          <div className="text-gray-600">Occupancy Adjustment</div>
                          <div className="font-medium text-purple-700">
                            {pricing[0]?.occupancyAdjustment >= 0 ? '+' : ''}
                            ${pricing[0]?.occupancyAdjustment?.toLocaleString() || 0}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Lease Terms</h5>
                        {pricing.slice(0, 5).map((p) => (
                          <div key={p.term} className="flex justify-between items-center text-sm p-2 border rounded">
                            <span>{p.term}mo</span>
                            <span className="font-semibold">${p.rent.toLocaleString()}</span>
                            {!p.isAllowed && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Restricted
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingDashboard;
