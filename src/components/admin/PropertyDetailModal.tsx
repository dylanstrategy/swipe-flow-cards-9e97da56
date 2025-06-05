
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building, Users, Home, DollarSign, Settings, Palette, MessageSquare, Calendar, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Property, Unit, User } from '@/types/supabase';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onPropertyUpdated: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ 
  property, 
  isOpen, 
  onClose, 
  onPropertyUpdated 
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [residents, setResidents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (property && isOpen) {
      fetchPropertyData();
    }
  }, [property, isOpen]);

  const fetchPropertyData = async () => {
    if (!property) return;
    
    setLoading(true);
    try {
      // Fetch units for this property
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', property.id)
        .order('unit_number');

      if (unitsError) throw unitsError;
      setUnits(unitsData || []);

      // Fetch residents for this property
      const { data: residentsData, error: residentsError } = await supabase
        .from('residents')
        .select(`
          *,
          users!inner(*)
        `)
        .eq('property_id', property.id);

      if (residentsError) throw residentsError;
      setResidents(residentsData?.map(r => r.users).filter(Boolean) || []);

    } catch (error) {
      console.error('Error fetching property data:', error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUnitStats = () => {
    const occupied = units.filter(u => u.status === 'occupied').length;
    const available = units.filter(u => u.status === 'available').length;
    const maintenance = units.filter(u => u.status === 'maintenance').length;
    const occupancyRate = units.length > 0 ? Math.round((occupied / units.length) * 100) : 0;
    
    return { occupied, available, maintenance, occupancyRate, total: units.length };
  };

  const getPricingStats = () => {
    const unitsWithSqFt = units.filter(u => u.sq_ft);
    const avgSqFt = unitsWithSqFt.length > 0 
      ? Math.round(unitsWithSqFt.reduce((sum, u) => sum + (u.sq_ft || 0), 0) / unitsWithSqFt.length)
      : 0;
    
    // Mock pricing data - in real app this would come from pricing table
    const avgRent = 2850;
    const revenue = units.filter(u => u.status === 'occupied').length * avgRent;
    
    return { avgSqFt, avgRent, revenue };
  };

  const stats = getUnitStats();
  const pricing = getPricingStats();

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{property.name}</DialogTitle>
              <p className="text-sm text-gray-600">{property.address}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {stats.total} Units
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="units">Units ({stats.total})</TabsTrigger>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="mt-4 flex-1 overflow-hidden">
            <TabsContent value="overview" className="h-full overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Units</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{stats.occupied}</div>
                    <div className="text-sm text-gray-600">Occupied</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Home className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{stats.available}</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
                    <div className="text-sm text-gray-600">Occupied</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Address:</span>
                      <p className="font-medium">{property.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Timezone:</span>
                      <p className="font-medium">{property.timezone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Created:</span>
                      <p className="font-medium">{new Date(property.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Revenue Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Monthly Revenue:</span>
                      <p className="font-medium">${pricing.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Avg Rent:</span>
                      <p className="font-medium">${pricing.avgRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Avg Sq Ft:</span>
                      <p className="font-medium">{pricing.avgSqFt} sq ft</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="units" className="h-full overflow-y-auto">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : units.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No units found for this property
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {units.map((unit) => (
                      <Card key={unit.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Unit {unit.unit_number}</h3>
                            <Badge className={
                              unit.status === 'occupied' ? 'bg-green-100 text-green-800' :
                              unit.status === 'available' ? 'bg-blue-100 text-blue-800' :
                              unit.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {unit.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{unit.bedroom_type} • {unit.bath_type}</p>
                            {unit.sq_ft && <p>{unit.sq_ft} sq ft</p>}
                            {unit.floor && <p>Floor {unit.floor}</p>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="residents" className="h-full overflow-y-auto">
              <div className="space-y-4">
                {residents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No residents found for this property
                  </div>
                ) : (
                  <div className="space-y-3">
                    {residents.map((resident) => (
                      <Card key={resident.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{resident.first_name} {resident.last_name}</h3>
                              <p className="text-sm text-gray-600">{resident.email}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="h-full overflow-y-auto">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">${pricing.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Monthly Revenue</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${pricing.avgRent.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Average Rent</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{pricing.avgSqFt}</div>
                        <div className="text-sm text-gray-600">Avg Sq Ft</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Unit Mix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['1BR', '2BR', '3BR', '4BR'].map(type => {
                        const count = units.filter(u => u.bedroom_type === type).length;
                        const percentage = units.length > 0 ? Math.round((count / units.length) * 100) : 0;
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-sm">{type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12">{count} units</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="h-full overflow-y-auto">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Configuration Modules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { icon: Palette, name: 'Branding', status: 'configured' },
                        { icon: DollarSign, name: 'Pricing Rules', status: 'pending' },
                        { icon: MessageSquare, name: 'Message Templates', status: 'pending' },
                        { icon: Calendar, name: 'Amenity Booking', status: 'pending' },
                      ].map((module, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <module.icon className="w-5 h-5 text-gray-600" />
                            <span className="font-medium">{module.name}</span>
                          </div>
                          <Badge className={
                            module.status === 'configured' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }>
                            {module.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailModal;
