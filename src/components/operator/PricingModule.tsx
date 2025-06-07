import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Calendar, DollarSign, TrendingUp, Building, Search, Grid, List, Users, MapPin, Send } from 'lucide-react';

interface PricingModuleProps {
  onClose: () => void;
  initialFilter?: 'all' | 'available' | 'vacant' | 'occupied';
}

const PricingModule = ({ onClose, initialFilter = 'all' }: PricingModuleProps) => {
  const [selectedView, setSelectedView] = useState<'units' | 'ppf' | 'comps'>('units');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'vacant' | 'occupied'>(initialFilter);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedProspectUnit, setSelectedProspectUnit] = useState<any>(null);

  // Set initial filter when component mounts
  useEffect(() => {
    setFilterStatus(initialFilter);
    // Auto-switch to cards view for available/vacant filters
    if (initialFilter === 'available' || initialFilter === 'vacant') {
      setViewMode('cards');
    }
  }, [initialFilter]);

  // Generate all 150 units (15 floors, 10 units per floor)
  const generateAllUnits = () => {
    const units = [];
    const unitTypes = ['Studio', '1BR', '2BR', '3BR'];
    const baseSqft = { 'Studio': 450, '1BR': 650, '2BR': 950, '3BR': 1200 };
    const baseRents = { 'Studio': 2500, '1BR': 3000, '2BR': 4200, '3BR': 5500 };
    
    for (let floor = 1; floor <= 15; floor++) {
      for (let unitNum = 1; unitNum <= 10; unitNum++) {
        const unitNumber = `${floor.toString().padStart(2, '0')}${unitNum.toString().padStart(2, '0')}`;
        const typeIndex = (floor + unitNum) % 4;
        const type = unitTypes[typeIndex];
        const sqft = baseSqft[type] + Math.floor(Math.random() * 100) - 50;
        const baseRent = baseRents[type];
        const marketRent = baseRent + Math.floor(Math.random() * 200) - 100;
        
        let status = 'occupied';
        const rand = Math.random();
        if (rand < 0.04) status = 'vacant';
        else if (rand < 0.08) status = 'available';
        
        const currentRent = status === 'occupied' ? marketRent - Math.floor(Math.random() * 100) : 0;
        const suggestedRent = status !== 'occupied' ? marketRent - 50 : 0;
        
        const moveOutDate = status === 'available' ? 
          new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '';
        const availableDate = moveOutDate ? 
          new Date(new Date(moveOutDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '';
        
        // Updated discount logic
        let discounts = null;
        if (status !== 'occupied') {
          const daysOut = Math.floor(Math.random() * 60) + 15;
          let discountType = 'Special';
          let discountAmount = 0;
          
          if (daysOut >= 40) {
            // Half month for 40+ days out
            discountAmount = Math.floor(marketRent / 2);
          } else if (daysOut >= 15) {
            // Full month for 15+ days out
            discountAmount = marketRent;
          }
          
          discounts = {
            type: discountType,
            amount: discountAmount,
            daysOut: daysOut
          };
        }
        
        units.push({
          unit: unitNumber,
          floor: floor,
          type: type,
          sqft: sqft,
          currentRent: currentRent,
          marketRent: marketRent,
          suggestedRent: suggestedRent,
          moveOutDate: moveOutDate,
          availableDate: availableDate,
          status: status,
          resident: status === 'occupied' ? `Resident ${unitNumber}` : '',
          leaseEnd: status === 'occupied' ? 
            new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
          discounts: discounts,
          premiums: Math.floor(Math.random() * 150),
          pricing: generatePricingTerms(marketRent)
        });
      }
    }
    return units;
  };

  const generatePricingTerms = (baseRent: number) => {
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

  const allUnits = generateAllUnits();

  // Filter units based on search and status
  const filteredUnits = allUnits.filter(unit => {
    const matchesSearch = unit.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.resident.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || unit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-yellow-100 text-yellow-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get summary stats
  const statusCounts = {
    total: allUnits.length,
    occupied: allUnits.filter(u => u.status === 'occupied').length,
    available: allUnits.filter(u => u.status === 'available').length,
    vacant: allUnits.filter(u => u.status === 'vacant').length
  };

  // Determine if we should show cards (when filtering by available/vacant)
  const shouldShowCards = filterStatus === 'available' || filterStatus === 'vacant';

  const handleSendApplication = (unit: any, term: number, moveDate: string) => {
    console.log('Sending application for:', { unit: unit.unit, term, moveDate, price: unit.pricing[term] });
    // Close the prospect modal
    setSelectedProspectUnit(null);
    // Here you would typically integrate with your CRM system
  };

  const ProspectModal = ({ unit, onClose }: { unit: any; onClose: () => void }) => {
    const [selectedTerm, setSelectedTerm] = useState(12);
    const [moveDate, setMoveDate] = useState('');
    const [prospectName, setProspectName] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Send Application - Unit {unit.unit}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prospect Name</label>
              <input
                type="text"
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                placeholder="Enter prospect name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lease Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(unit.pricing).map(([term, price]) => (
                  <option key={term} value={term}>
                    {term} months - ${(price as number).toLocaleString()}/mo
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desired Move Date</label>
              <input
                type="date"
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Monthly Rent: <span className="font-semibold">${(unit.pricing[selectedTerm] as number)?.toLocaleString()}</span></div>
              <div className="text-sm text-gray-600">Unit Type: <span className="font-semibold">{unit.type}</span></div>
              <div className="text-sm text-gray-600">Square Feet: <span className="font-semibold">{unit.sqft}</span></div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendApplication(unit, selectedTerm, moveDate)}
                disabled={!prospectName || !moveDate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>Send Application</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unit Directory & Pricing</h1>
          <p className="text-gray-600">All 150 Units • Live Data & Dynamic Pricing</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div 
          className="bg-blue-50 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => setFilterStatus('all')}
        >
          <div className="text-2xl font-bold text-blue-600">{statusCounts.total}</div>
          <div className="text-sm text-blue-800">Total Units</div>
        </div>
        <div 
          className="bg-green-50 p-4 rounded-lg text-center cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => setFilterStatus('occupied')}
        >
          <div className="text-2xl font-bold text-green-600">{statusCounts.occupied}</div>
          <div className="text-sm text-green-800">Occupied</div>
        </div>
        <div 
          className="bg-yellow-50 p-4 rounded-lg text-center cursor-pointer hover:bg-yellow-100 transition-colors"
          onClick={() => setFilterStatus('available')}
        >
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.available}</div>
          <div className="text-sm text-yellow-800">Available</div>
        </div>
        <div 
          className="bg-red-50 p-4 rounded-lg text-center cursor-pointer hover:bg-red-100 transition-colors"
          onClick={() => setFilterStatus('vacant')}
        >
          <div className="text-2xl font-bold text-red-600">{statusCounts.vacant}</div>
          <div className="text-sm text-red-800">Vacant</div>
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
          Unit Directory
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

      {/* Unit Directory View */}
      {selectedView === 'units' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Complete Unit Directory ({filteredUnits.length} units)</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid size={18} />
                </button>
              </div>
            </CardTitle>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by unit number, type, or resident..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                {['all', 'occupied', 'available', 'vacant'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'cards' ? (
              // Enhanced Card View for All Unit Types
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnits.map((unit) => (
                  <div key={unit.unit} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Unit Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Unit {unit.unit}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          Floor {unit.floor} • {unit.sqft} sq ft
                        </p>
                      </div>
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status}
                      </Badge>
                    </div>

                    {/* Unit Type & Size */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-900">{unit.type}</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${unit.status === 'occupied' ? unit.currentRent.toLocaleString() : unit.marketRent.toLocaleString()}
                        </span>
                      </div>
                      {unit.discounts && unit.status !== 'occupied' && (
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">{unit.discounts.type}</span>
                            <span className="text-sm font-bold text-green-600">-${unit.discounts.amount}</span>
                          </div>
                          <p className="text-xs text-green-700 mt-1">{unit.discounts.daysOut} days out concession</p>
                        </div>
                      )}
                    </div>

                    {/* Pricing Terms or Resident Info */}
                    {unit.status === 'occupied' ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Current Lease</h4>
                        <div className="bg-gray-50 p-3 rounded border">
                          <div className="text-sm">
                            <span className="font-medium">Resident:</span> {unit.resident}
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Lease End:</span> {unit.leaseEnd}
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Current Rent:</span> ${unit.currentRent.toLocaleString()}/mo
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Market Rent:</span> ${unit.marketRent.toLocaleString()}/mo
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Available Lease Terms</h4>
                        <div className="space-y-2">
                          {Object.entries(unit.pricing).slice(0, 4).map(([term, price]) => (
                            <div key={term} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                              <div className="text-sm">
                                <span className="font-medium">{term} months</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-gray-900">${(price as number).toLocaleString()}/mo</div>
                                <div className="text-xs text-gray-500">${((price as number) * Number(term)).toLocaleString()} total</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Availability & Actions */}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          {unit.status === 'occupied' ? (
                            <p className="text-sm text-blue-600">
                              <Users size={14} className="inline mr-1" />
                              Currently Occupied
                            </p>
                          ) : unit.availableDate ? (
                            <p className="text-sm text-gray-600">
                              <Calendar size={14} className="inline mr-1" />
                              Available: {unit.availableDate}
                            </p>
                          ) : (
                            <p className="text-sm text-green-600">
                              <Calendar size={14} className="inline mr-1" />
                              Available Now
                            </p>
                          )}
                        </div>
                        {unit.status !== 'occupied' && (
                          <button
                            onClick={() => setSelectedProspectUnit(unit)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                          >
                            <Send size={14} />
                            <span>Send App</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Table View
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sq Ft</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Rent</TableHead>
                      <TableHead>Market Rent</TableHead>
                      <TableHead>Resident/Next Available</TableHead>
                      <TableHead>Lease End/Move Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.map((unit) => (
                      <TableRow key={unit.unit} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{unit.unit}</TableCell>
                        <TableCell>{unit.floor}</TableCell>
                        <TableCell>{unit.type}</TableCell>
                        <TableCell>{unit.sqft}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(unit.status)}>
                            {unit.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {unit.currentRent > 0 ? `$${unit.currentRent.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${unit.marketRent.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {unit.status === 'occupied' ? unit.resident : 
                           unit.availableDate ? unit.availableDate : 'Available Now'}
                        </TableCell>
                        <TableCell>
                          {unit.status === 'occupied' ? unit.leaseEnd : 
                           unit.moveOutDate ? unit.moveOutDate : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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

      {/* Prospect Modal */}
      {selectedProspectUnit && (
        <ProspectModal 
          unit={selectedProspectUnit} 
          onClose={() => setSelectedProspectUnit(null)} 
        />
      )}
    </div>
  );
};

export default PricingModule;
