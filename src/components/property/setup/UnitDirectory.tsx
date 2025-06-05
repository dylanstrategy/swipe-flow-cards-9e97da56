
import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Save, X, Building, DollarSign, Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface UnitDirectoryProps {
  onBack: () => void;
}

interface UnitType {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  baseRent: number;
  floorPlanCode: string;
}

interface Unit {
  id: string;
  unitNumber: string;
  unitTypeId: string;
  floor: number;
  premiums: {
    view: number;
    corner: number;
    highFloor: number;
    balcony: number;
    other: number;
  };
  status: 'occupied' | 'vacant' | 'maintenance' | 'future';
  residentId?: string;
}

const UnitDirectory = ({ onBack }: UnitDirectoryProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingUnitType, setEditingUnitType] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);

  // 16 Unit Types (4 floor plans x 4 unit categories)
  const [unitTypes] = useState<UnitType[]>([
    // Studio Floor Plans
    { id: 'ST-A', name: 'Studio A', bedrooms: 0, bathrooms: 1, sqft: 450, baseRent: 2400, floorPlanCode: 'ST-A' },
    { id: 'ST-B', name: 'Studio B', bedrooms: 0, bathrooms: 1, sqft: 475, baseRent: 2450, floorPlanCode: 'ST-B' },
    { id: 'ST-C', name: 'Studio C', bedrooms: 0, bathrooms: 1, sqft: 500, baseRent: 2500, floorPlanCode: 'ST-C' },
    { id: 'ST-D', name: 'Studio D', bedrooms: 0, bathrooms: 1, sqft: 525, baseRent: 2550, floorPlanCode: 'ST-D' },
    
    // 1BR Floor Plans
    { id: '1BR-A', name: '1BR A', bedrooms: 1, bathrooms: 1, sqft: 650, baseRent: 2800, floorPlanCode: '1BR-A' },
    { id: '1BR-B', name: '1BR B', bedrooms: 1, bathrooms: 1, sqft: 675, baseRent: 2850, floorPlanCode: '1BR-B' },
    { id: '1BR-C', name: '1BR C', bedrooms: 1, bathrooms: 1, sqft: 700, baseRent: 2900, floorPlanCode: '1BR-C' },
    { id: '1BR-D', name: '1BR D', bedrooms: 1, bathrooms: 1.5, sqft: 725, baseRent: 2950, floorPlanCode: '1BR-D' },
    
    // 2BR Floor Plans
    { id: '2BR-A', name: '2BR A', bedrooms: 2, bathrooms: 2, sqft: 950, baseRent: 3600, floorPlanCode: '2BR-A' },
    { id: '2BR-B', name: '2BR B', bedrooms: 2, bathrooms: 2, sqft: 975, baseRent: 3650, floorPlanCode: '2BR-B' },
    { id: '2BR-C', name: '2BR C', bedrooms: 2, bathrooms: 2, sqft: 1000, baseRent: 3700, floorPlanCode: '2BR-C' },
    { id: '2BR-D', name: '2BR D', bedrooms: 2, bathrooms: 2.5, sqft: 1025, baseRent: 3750, floorPlanCode: '2BR-D' },
    
    // 4BR Floor Plans
    { id: '4BR-A', name: '4BR A', bedrooms: 4, bathrooms: 3, sqft: 1400, baseRent: 5200, floorPlanCode: '4BR-A' },
    { id: '4BR-B', name: '4BR B', bedrooms: 4, bathrooms: 3, sqft: 1450, baseRent: 5300, floorPlanCode: '4BR-B' },
    { id: '4BR-C', name: '4BR C', bedrooms: 4, bathrooms: 3.5, sqft: 1500, baseRent: 5400, floorPlanCode: '4BR-C' },
    { id: '4BR-D', name: '4BR D', bedrooms: 4, bathrooms: 4, sqft: 1550, baseRent: 5500, floorPlanCode: '4BR-D' }
  ]);

  // Generate 100 units with distribution: 25 studio, 35 1BR, 20 2BR, 20 4BR
  const generateUnits = (): Unit[] => {
    const units: Unit[] = [];
    let unitCounter = 1;
    
    // Distribution mapping
    const distribution = [
      { types: ['ST-A', 'ST-B', 'ST-C', 'ST-D'], count: 25 }, // Studios
      { types: ['1BR-A', '1BR-B', '1BR-C', '1BR-D'], count: 35 }, // 1BR
      { types: ['2BR-A', '2BR-B', '2BR-C', '2BR-D'], count: 20 }, // 2BR
      { types: ['4BR-A', '4BR-B', '4BR-C', '4BR-D'], count: 20 } // 4BR
    ];

    distribution.forEach(({ types, count }) => {
      const unitsPerType = Math.floor(count / types.length);
      const remainder = count % types.length;
      
      types.forEach((typeId, index) => {
        const typeCount = unitsPerType + (index < remainder ? 1 : 0);
        
        for (let i = 0; i < typeCount; i++) {
          const floor = Math.floor((unitCounter - 1) / 10) + 1;
          const unitOnFloor = ((unitCounter - 1) % 10) + 1;
          const unitNumber = `${floor}${unitOnFloor.toString().padStart(2, '0')}`;
          
          units.push({
            id: `unit-${unitCounter}`,
            unitNumber,
            unitTypeId: typeId,
            floor,
            premiums: {
              view: Math.random() > 0.7 ? 50 : 0,
              corner: Math.random() > 0.8 ? 75 : 0,
              highFloor: floor > 5 ? 25 : 0,
              balcony: Math.random() > 0.6 ? 30 : 0,
              other: 0
            },
            status: 'occupied' // Will be updated with resident assignment
          });
          unitCounter++;
        }
      });
    });

    return units;
  };

  const [units] = useState<Unit[]>(generateUnits());

  const getUnitTypeStats = () => {
    const stats = unitTypes.map(type => {
      const typeUnits = units.filter(u => u.unitTypeId === type.id);
      const occupied = typeUnits.filter(u => u.status === 'occupied').length;
      const vacant = typeUnits.filter(u => u.status === 'vacant').length;
      const future = typeUnits.filter(u => u.status === 'future').length;
      
      return {
        ...type,
        totalUnits: typeUnits.length,
        occupied,
        vacant,
        future,
        occupancyRate: typeUnits.length > 0 ? (occupied / typeUnits.length) * 100 : 0
      };
    });
    
    return stats;
  };

  const unitTypeStats = getUnitTypeStats();

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
            <h1 className="text-xl font-bold text-gray-900">Unit Directory</h1>
            <p className="text-sm text-gray-600">Manage unit types, floor plans, and pricing</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="unit-types" className="text-xs">Unit Types</TabsTrigger>
            <TabsTrigger value="units" className="text-xs">Individual Units</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{units.length}</div>
                  <div className="text-sm text-gray-600">Total Units</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{units.filter(u => u.status === 'occupied').length}</div>
                  <div className="text-sm text-gray-600">Occupied</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Home className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">{units.filter(u => u.status === 'vacant').length}</div>
                  <div className="text-sm text-gray-600">Vacant</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">
                    ${Math.round(unitTypes.reduce((sum, type) => sum + type.baseRent, 0) / unitTypes.length).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Avg Base Rent</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Unit Type Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unitTypeStats.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-sm text-gray-600">
                            {type.sqft} sq ft • ${type.baseRent.toLocaleString()}/mo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{type.totalUnits}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">{type.occupied}</div>
                          <div className="text-xs text-gray-500">Occupied</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-orange-600">{type.vacant}</div>
                          <div className="text-xs text-gray-500">Vacant</div>
                        </div>
                        <Badge className={`${
                          type.occupancyRate >= 95 ? 'bg-green-100 text-green-800' :
                          type.occupancyRate >= 90 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {type.occupancyRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unit Types Tab */}
          <TabsContent value="unit-types" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Floor Plan Types</CardTitle>
                    <p className="text-sm text-gray-600">16 unique floor plans across 4 unit categories</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {unitTypes.map((type) => {
                    const typeUnits = units.filter(u => u.unitTypeId === type.id);
                    const isEditing = editingUnitType === type.id;
                    
                    return (
                      <div key={type.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{type.name}</h3>
                            <p className="text-sm text-gray-600">Floor Plan Code: {type.floorPlanCode}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUnitType(isEditing ? null : type.id)}
                          >
                            {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <Label className="text-xs text-gray-500">Bedrooms</Label>
                            <p className="font-medium">{type.bedrooms === 0 ? 'Studio' : type.bedrooms}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Bathrooms</Label>
                            <p className="font-medium">{type.bathrooms}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Square Feet</Label>
                            <p className="font-medium">{type.sqft.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Base Rent</Label>
                            <p className="font-medium">${type.baseRent.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          {typeUnits.length} units of this type
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Individual Units Tab */}
          <TabsContent value="units" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Units ({units.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {units.map((unit) => {
                    const unitType = unitTypes.find(t => t.id === unit.unitTypeId);
                    const totalPremiums = Object.values(unit.premiums).reduce((sum, val) => sum + val, 0);
                    const effectiveRent = unitType ? unitType.baseRent + totalPremiums : 0;
                    
                    return (
                      <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">Unit {unit.unitNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {unitType?.name} • Floor {unit.floor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">${effectiveRent.toLocaleString()}</div>
                            {totalPremiums > 0 && (
                              <div className="text-xs text-green-600">+${totalPremiums} premiums</div>
                            )}
                          </div>
                          <Badge className={`${
                            unit.status === 'occupied' ? 'bg-green-100 text-green-800' :
                            unit.status === 'vacant' ? 'bg-orange-100 text-orange-800' :
                            unit.status === 'future' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {unit.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnitDirectory;
