
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Building,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Home,
  TrendingUp,
  FileText,
  Settings,
  X
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: any;
  onClose: () => void;
}

const PropertyDetailsModal = ({ property, onClose }: PropertyDetailsModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            {property.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{property.units}</div>
                <div className="text-sm text-gray-600">Total Units</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{property.occupancy_rate}%</div>
                <div className="text-sm text-gray-600">Occupancy Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  ${((property.units * property.occupancy_rate / 100) * 1800).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(property.units * property.occupancy_rate / 100)}
                </div>
                <div className="text-sm text-gray-600">Occupied Units</div>
              </CardContent>
            </Card>
          </div>

          {/* Property Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{property.address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Property Type</label>
                  <p className="text-gray-900 capitalize">{property.property_type || 'Apartment Complex'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge className={property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {property.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Year Built</label>
                  <p className="text-gray-900">{property.year_built || '2018'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Management Company</label>
                  <p className="text-gray-900">{property.client_name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Email</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    contact@{property.client_name?.toLowerCase().replace(/\s+/g, '')}.com
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Phone</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    (555) 123-4567
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Contract Start</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    January 2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unit Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Unit Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">45</div>
                  <div className="text-sm text-gray-600">Studio</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">60</div>
                  <div className="text-sm text-gray-600">1 Bedroom</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">35</div>
                  <div className="text-sm text-gray-600">2 Bedroom</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">10</div>
                  <div className="text-sm text-gray-600">3 Bedroom</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Pool', 'Fitness Center', 'Rooftop Deck', 'Parking Garage', 'Pet Friendly', 'In-Unit Laundry', 'Concierge', 'Business Center'].map((amenity) => (
                  <Badge key={amenity} variant="outline" className="justify-center">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              View Contract
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Residents
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Property Settings
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
