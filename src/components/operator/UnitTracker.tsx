
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Home, Calendar, DollarSign, TrendingUp, Building } from 'lucide-react';

interface UnitTrackerProps {
  onClose: () => void;
}

const UnitTracker = ({ onClose }: UnitTrackerProps) => {
  const [selectedView, setSelectedView] = useState<'units' | 'ppf' | 'comps'>('units');

  // Sample unit data
  const units = [
    {
      unit: '101',
      type: 'Studio',
      sqft: 450,
      currentRent: 2597,
      marketRent: 2601,
      suggestedRent: 2550,
      moveOutDate: '2025-07-15',
      availableDate: '2025-07-20',
      discounts: { type: 'Half Month', amount: 1275, daysOut: 30 },
      premiums: 0,
      status: 'vacant'
    },
    {
      unit: '204',
      type: '1BR',
      sqft: 650,
      currentRent: 3056,
      marketRent: 3100,
      suggestedRent: 3025,
      moveOutDate: '2025-06-30',
      availableDate: '2025-07-05',
      discounts: { type: 'Full Month', amount: 3025, daysOut: 15 },
      premiums: 50,
      status: 'available'
    },
    {
      unit: '315',
      type: '2BR',
      sqft: 950,
      currentRent: 4309,
      marketRent: 4400,
      suggestedRent: 4250,
      moveOutDate: '2025-08-01',
      availableDate: '2025-08-05',
      discounts: { type: 'None', amount: 0, daysOut: 45 },
      premiums: 100,
      status: 'available'
    }
  ];

  // PPF Data (18 weeks)
  const ppfData = [
    { week: 'Week 1', month: 'Jan', occupancy: 96.2, expirations: { allowed: 8, actual: 5, remaining: 3 } },
    { week: 'Week 2', month: 'Jan', occupancy: 95.8, expirations: { allowed: 8, actual: 6, remaining: 2 } },
    { week: 'Week 3', month: 'Jan', occupancy: 96.1, expirations: { allowed: 8, actual: 7, remaining: 1 } },
    { week: 'Week 4', month: 'Feb', occupancy: 96.5, expirations: { allowed: 12, actual: 3, remaining: 9 } },
    { week: 'Week 5', month: 'Feb', occupancy: 97.2, expirations: { allowed: 12, actual: 5, remaining: 7 } },
    { week: 'Week 6', month: 'Feb', occupancy: 96.8, expirations: { allowed: 12, actual: 8, remaining: 4 } },
    { week: 'Week 7', month: 'Feb', occupancy: 97.0, expirations: { allowed: 12, actual: 10, remaining: 2 } },
    { week: 'Week 8', month: 'Mar', occupancy: 96.9, expirations: { allowed: 15, actual: 4, remaining: 11 } },
    { week: 'Week 9', month: 'Mar', occupancy: 97.5, expirations: { allowed: 15, actual: 6, remaining: 9 } },
    { week: 'Week 10', month: 'Mar', occupancy: 97.8, expirations: { allowed: 15, actual: 9, remaining: 6 } },
    { week: 'Week 11', month: 'Mar', occupancy: 98.1, expirations: { allowed: 15, actual: 12, remaining: 3 } },
    { week: 'Week 12', month: 'Apr', occupancy: 97.9, expirations: { allowed: 10, actual: 3, remaining: 7 } },
    { week: 'Week 13', month: 'Apr', occupancy: 98.2, expirations: { allowed: 10, actual: 5, remaining: 5 } },
    { week: 'Week 14', month: 'Apr', occupancy: 97.6, expirations: { allowed: 10, actual: 7, remaining: 3 } },
    { week: 'Week 15', month: 'May', occupancy: 97.8, expirations: { allowed: 8, actual: 2, remaining: 6 } },
    { week: 'Week 16', month: 'May', occupancy: 98.0, expirations: { allowed: 8, actual: 4, remaining: 4 } },
    { week: 'Week 17', month: 'May', occupancy: 98.3, expirations: { allowed: 8, actual: 6, remaining: 2 } },
    { week: 'Week 18', month: 'May', occupancy: 98.5, expirations: { allowed: 8, actual: 7, remaining: 1 } }
  ];

  // Competitive Analysis Data
  const compData = [
    { 
      unitType: 'Studio', 
      min: 2597, 
      max: 2601, 
      blended: 2423.58, 
      avgSqft: 450, 
      pricePerSqft: 5.39,
      properties: ['Journal Squared - 1', 'Journal Squared - 2', 'Journal Squared - 3']
    },
    { 
      unitType: '1BR', 
      min: 3056, 
      max: 3100, 
      blended: 2709.05, 
      avgSqft: 650, 
      pricePerSqft: 4.17,
      properties: ['Journal Squared - 1', 'Journal Squared - 2', 'Journal Squared - 3']
    },
    { 
      unitType: '2BR', 
      min: 4309, 
      max: 4400, 
      blended: 3911.21, 
      avgSqft: 950, 
      pricePerSqft: 4.12,
      properties: ['Journal Squared - 1', 'Journal Squared - 2', 'Journal Squared - 3']
    },
    { 
      unitType: '3BR', 
      min: 5745, 
      max: 6038, 
      blended: 5462.08, 
      avgSqft: 1200, 
      pricePerSqft: 4.55,
      properties: ['Journal Squared - 1', 'Journal Squared - 2', 'Journal Squared - 3']
    }
  ];

  const generatePricingGrid = (baseRent: number, unitType: string) => {
    const terms = [3, 6, 9, 12, 15, 18, 21, 24];
    const pricing: { [key: number]: number } = {};
    
    terms.forEach(term => {
      let adjustment = 0;
      if (term <= 6) adjustment = 100; // Short term premium
      else if (term >= 18) adjustment = -50; // Long term discount
      
      pricing[term] = baseRent + adjustment;
    });
    
    return pricing;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Tracker & Pricing</h1>
          <p className="text-gray-600">Comprehensive unit analysis with dynamic pricing</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSelectedView('units')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedView === 'units'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-4 h-4 inline mr-2" />
          Unit Pricing Grid
        </button>
        <button
          onClick={() => setSelectedView('ppf')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedView === 'ppf'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          PPF Forecast
        </button>
        <button
          onClick={() => setSelectedView('comps')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedView === 'comps'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Market Comps
        </button>
      </div>

      {/* Unit Pricing Grid View */}
      {selectedView === 'units' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Available Units - Dynamic Pricing Grid</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {units.map((unit) => {
                const pricingGrid = generatePricingGrid(unit.suggestedRent, unit.type);
                
                return (
                  <div key={unit.unit} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Unit</span>
                        <p className="font-semibold">{unit.unit}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Type</span>
                        <p className="font-semibold">{unit.type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Sq Ft</span>
                        <p className="font-semibold">{unit.sqft}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge className={getStatusColor(unit.status)}>
                          {unit.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Current Market</span>
                        <p className="font-semibold">${unit.marketRent}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Suggested Rent</span>
                        <p className="font-semibold text-green-600">${unit.suggestedRent}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Move Out</span>
                        <p className="font-semibold">{unit.moveOutDate}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Available</span>
                        <p className="font-semibold">{unit.availableDate}</p>
                      </div>
                    </div>

                    {/* Discounts & Premiums */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm text-gray-600">Current Discount</span>
                        <p className="font-semibold text-red-600">
                          {unit.discounts.type}: -${unit.discounts.amount} ({unit.discounts.daysOut} days out)
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Unit Premiums</span>
                        <p className="font-semibold text-green-600">+${unit.premiums}</p>
                      </div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Term</TableHead>
                            <TableHead>3 Mo</TableHead>
                            <TableHead>6 Mo</TableHead>
                            <TableHead>9 Mo</TableHead>
                            <TableHead>12 Mo</TableHead>
                            <TableHead>15 Mo</TableHead>
                            <TableHead>18 Mo</TableHead>
                            <TableHead>21 Mo</TableHead>
                            <TableHead>24 Mo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Price</TableCell>
                            {Object.entries(pricingGrid).map(([term, price]) => (
                              <TableCell key={term} className="font-semibold">
                                ${price}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PPF Forecast View */}
      {selectedView === 'ppf' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Property Performance Forecast (18 Weeks)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Projected Occupancy</TableHead>
                    <TableHead>Allowed Expirations</TableHead>
                    <TableHead>Actual Expirations</TableHead>
                    <TableHead>Remaining Allowance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ppfData.map((week, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{week.week}</TableCell>
                      <TableCell>{week.month}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          week.occupancy >= 98 ? 'text-green-600' : 
                          week.occupancy >= 96 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {week.occupancy}%
                        </span>
                      </TableCell>
                      <TableCell>{week.expirations.allowed}</TableCell>
                      <TableCell>{week.expirations.actual}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          week.expirations.remaining > 5 ? 'text-green-600' :
                          week.expirations.remaining > 2 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {week.expirations.remaining}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          week.expirations.remaining > 5 ? 'bg-green-100 text-green-800' :
                          week.expirations.remaining > 2 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }>
                          {week.expirations.remaining > 5 ? 'Good' :
                           week.expirations.remaining > 2 ? 'Caution' : 'Alert'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Comps View */}
      {selectedView === 'comps' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Competitive Market Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead>Market Min</TableHead>
                    <TableHead>Market Max</TableHead>
                    <TableHead>Blended Rate</TableHead>
                    <TableHead>Avg Sq Ft</TableHead>
                    <TableHead>Price/Sq Ft</TableHead>
                    <TableHead>Competitive Properties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compData.map((comp) => (
                    <TableRow key={comp.unitType}>
                      <TableCell className="font-medium">{comp.unitType}</TableCell>
                      <TableCell>${comp.min.toLocaleString()}</TableCell>
                      <TableCell>${comp.max.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        ${comp.blended.toLocaleString()}
                      </TableCell>
                      <TableCell>{comp.avgSqft}</TableCell>
                      <TableCell>${comp.pricePerSqft}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {comp.properties.slice(0, 2).map(prop => (
                            <div key={prop}>{prop}</div>
                          ))}
                          {comp.properties.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{comp.properties.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Average Blended Rate</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${(compData.reduce((sum, comp) => sum + comp.blended, 0) / compData.length).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Avg Price/Sq Ft</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${(compData.reduce((sum, comp) => sum + comp.pricePerSqft, 0) / compData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Market Position</h3>
                <p className="text-2xl font-bold text-purple-600">Competitive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnitTracker;
