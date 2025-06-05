
import React, { useState } from 'react';
import { ChevronLeft, Clock, DollarSign, Calendar, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface AmenitiesSetupProps {
  onBack: () => void;
}

interface Amenity {
  id: string;
  name: string;
  description: string;
  requiresBooking: boolean;
  isActive: boolean;
  maxCapacity: number;
  hoursOfOperation: {
    [key: string]: {
      enabled: boolean;
      openTime: string;
      closeTime: string;
    };
  };
  bookingSettings: {
    advanceBookingDays: number;
    maxBookingDuration: number;
    timeSlotDuration: number;
    cost: number;
    depositRequired: boolean;
    depositAmount: number;
    cancellationPolicy: string;
  };
}

const AmenitiesSetup = ({ onBack }: AmenitiesSetupProps) => {
  const [amenities, setAmenities] = useState<Amenity[]>([
    {
      id: '1',
      name: 'Rooftop Pool',
      description: 'Outdoor pool with city views',
      requiresBooking: true,
      isActive: true,
      maxCapacity: 20,
      hoursOfOperation: {
        monday: { enabled: true, openTime: '06:00', closeTime: '22:00' },
        tuesday: { enabled: true, openTime: '06:00', closeTime: '22:00' },
        wednesday: { enabled: true, openTime: '06:00', closeTime: '22:00' },
        thursday: { enabled: true, openTime: '06:00', closeTime: '22:00' },
        friday: { enabled: true, openTime: '06:00', closeTime: '22:00' },
        saturday: { enabled: true, openTime: '08:00', closeTime: '23:00' },
        sunday: { enabled: true, openTime: '08:00', closeTime: '22:00' }
      },
      bookingSettings: {
        advanceBookingDays: 7,
        maxBookingDuration: 4,
        timeSlotDuration: 2,
        cost: 0,
        depositRequired: false,
        depositAmount: 0,
        cancellationPolicy: '24 hours notice required'
      }
    },
    {
      id: '2',
      name: 'Fitness Center',
      description: 'Fully equipped gym with cardio and weights',
      requiresBooking: false,
      isActive: true,
      maxCapacity: 15,
      hoursOfOperation: {
        monday: { enabled: true, openTime: '05:00', closeTime: '23:00' },
        tuesday: { enabled: true, openTime: '05:00', closeTime: '23:00' },
        wednesday: { enabled: true, openTime: '05:00', closeTime: '23:00' },
        thursday: { enabled: true, openTime: '05:00', closeTime: '23:00' },
        friday: { enabled: true, openTime: '05:00', closeTime: '23:00' },
        saturday: { enabled: true, openTime: '06:00', closeTime: '22:00' },
        sunday: { enabled: true, openTime: '06:00', closeTime: '22:00' }
      },
      bookingSettings: {
        advanceBookingDays: 0,
        maxBookingDuration: 0,
        timeSlotDuration: 0,
        cost: 0,
        depositRequired: false,
        depositAmount: 0,
        cancellationPolicy: ''
      }
    }
  ]);

  const [editingAmenity, setEditingAmenity] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Amenity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const startEditing = (amenity: Amenity) => {
    setEditingAmenity(amenity.id);
    setEditedData({ ...amenity });
  };

  const cancelEditing = () => {
    setEditingAmenity(null);
    setEditedData(null);
  };

  const saveChanges = () => {
    if (editedData) {
      setAmenities(amenities.map(amenity => 
        amenity.id === editedData.id ? editedData : amenity
      ));
      setEditingAmenity(null);
      setEditedData(null);
    }
  };

  const addNewAmenity = () => {
    const newAmenity: Amenity = {
      id: Date.now().toString(),
      name: '',
      description: '',
      requiresBooking: false,
      isActive: true,
      maxCapacity: 10,
      hoursOfOperation: {
        monday: { enabled: true, openTime: '09:00', closeTime: '17:00' },
        tuesday: { enabled: true, openTime: '09:00', closeTime: '17:00' },
        wednesday: { enabled: true, openTime: '09:00', closeTime: '17:00' },
        thursday: { enabled: true, openTime: '09:00', closeTime: '17:00' },
        friday: { enabled: true, openTime: '09:00', closeTime: '17:00' },
        saturday: { enabled: true, openTime: '10:00', closeTime: '16:00' },
        sunday: { enabled: false, openTime: '10:00', closeTime: '16:00' }
      },
      bookingSettings: {
        advanceBookingDays: 1,
        maxBookingDuration: 2,
        timeSlotDuration: 1,
        cost: 0,
        depositRequired: false,
        depositAmount: 0,
        cancellationPolicy: '2 hours notice required'
      }
    };
    
    setAmenities([...amenities, newAmenity]);
    startEditing(newAmenity);
    setShowAddForm(false);
  };

  const updateEditedData = (updates: Partial<Amenity>) => {
    if (editedData) {
      setEditedData({ ...editedData, ...updates });
    }
  };

  const deleteAmenity = (id: string) => {
    setAmenities(amenities.filter(amenity => amenity.id !== id));
    if (editingAmenity === id) {
      cancelEditing();
    }
  };

  const updateHours = (day: string, field: string, value: string | boolean) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        hoursOfOperation: {
          ...editedData.hoursOfOperation,
          [day]: {
            ...editedData.hoursOfOperation[day],
            [field]: value
          }
        }
      });
    }
  };

  const renderAmenityCard = (amenity: Amenity) => {
    const isEditing = editingAmenity === amenity.id;
    const displayData = isEditing ? editedData! : amenity;
    
    return (
      <Card key={amenity.id} className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{displayData.name || 'New Amenity'}</CardTitle>
              <Switch
                checked={displayData.isActive}
                onCheckedChange={(checked) => {
                  if (isEditing) {
                    updateEditedData({ isActive: checked });
                  }
                }}
                disabled={!isEditing}
              />
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(amenity)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAmenity(amenity.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveChanges}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {displayData.description && (
            <p className="text-sm text-gray-600">{displayData.description}</p>
          )}
        </CardHeader>

        {isEditing && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Amenity Name</Label>
                <Input
                  value={displayData.name}
                  onChange={(e) => updateEditedData({ name: e.target.value })}
                  placeholder="e.g., Swimming Pool"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Max Capacity</Label>
                <Input
                  type="number"
                  value={displayData.maxCapacity}
                  onChange={(e) => updateEditedData({ maxCapacity: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={displayData.description}
                onChange={(e) => updateEditedData({ description: e.target.value })}
                placeholder="Brief description of the amenity"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={displayData.requiresBooking}
                onCheckedChange={(checked) => updateEditedData({ requiresBooking: checked })}
              />
              <Label className="text-sm font-medium">Requires Booking/Reservation</Label>
            </div>

            {/* Hours of Operation */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Hours of Operation</Label>
              <div className="space-y-2">
                {Object.entries(displayData.hoursOfOperation).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
                    <div className="w-20">
                      <Switch
                        checked={hours.enabled}
                        onCheckedChange={(checked) => updateHours(day, 'enabled', checked)}
                      />
                      <Label className="capitalize text-xs font-medium mt-1 block">{day}</Label>
                    </div>
                    
                    {hours.enabled ? (
                      <div className="flex gap-2 flex-1">
                        <div className="flex-1">
                          <Label className="text-xs text-gray-500">Open</Label>
                          <Input
                            type="time"
                            value={hours.openTime}
                            onChange={(e) => updateHours(day, 'openTime', e.target.value)}
                            className="mt-1 h-8 text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs text-gray-500">Close</Label>
                          <Input
                            type="time"
                            value={hours.closeTime}
                            onChange={(e) => updateHours(day, 'closeTime', e.target.value)}
                            className="mt-1 h-8 text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-gray-400 text-sm">Closed</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Settings */}
            {displayData.requiresBooking && (
              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-3 block">Booking Settings</Label>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs text-gray-600">Advance Booking (days)</Label>
                    <Input
                      type="number"
                      value={displayData.bookingSettings.advanceBookingDays}
                      onChange={(e) => updateEditedData({
                        bookingSettings: {
                          ...displayData.bookingSettings,
                          advanceBookingDays: parseInt(e.target.value) || 0
                        }
                      })}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Max Booking Duration (hours)</Label>
                    <Input
                      type="number"
                      value={displayData.bookingSettings.maxBookingDuration}
                      onChange={(e) => updateEditedData({
                        bookingSettings: {
                          ...displayData.bookingSettings,
                          maxBookingDuration: parseInt(e.target.value) || 0
                        }
                      })}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Time Slot Duration (hours)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={displayData.bookingSettings.timeSlotDuration}
                      onChange={(e) => updateEditedData({
                        bookingSettings: {
                          ...displayData.bookingSettings,
                          timeSlotDuration: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Cost per booking ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={displayData.bookingSettings.cost}
                      onChange={(e) => updateEditedData({
                        bookingSettings: {
                          ...displayData.bookingSettings,
                          cost: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <Switch
                    checked={displayData.bookingSettings.depositRequired}
                    onCheckedChange={(checked) => updateEditedData({
                      bookingSettings: {
                        ...displayData.bookingSettings,
                        depositRequired: checked
                      }
                    })}
                  />
                  <Label className="text-sm font-medium">Require Security Deposit</Label>
                </div>

                {displayData.bookingSettings.depositRequired && (
                  <div className="mb-3">
                    <Label className="text-xs text-gray-600">Deposit Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={displayData.bookingSettings.depositAmount}
                      onChange={(e) => updateEditedData({
                        bookingSettings: {
                          ...displayData.bookingSettings,
                          depositAmount: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-xs text-gray-600">Cancellation Policy</Label>
                  <Textarea
                    value={displayData.bookingSettings.cancellationPolicy}
                    onChange={(e) => updateEditedData({
                      bookingSettings: {
                        ...displayData.bookingSettings,
                        cancellationPolicy: e.target.value
                      }
                    })}
                    placeholder="e.g., 24 hours notice required for cancellation"
                    className="mt-1 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 text-sm"
        >
          <ChevronLeft size={18} />
          Back to Property Setup
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Amenities Setup</h1>
        <p className="text-gray-600">Configure amenities, hours of operation, booking requirements, and pricing</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Property Amenities</h2>
          <span className="text-sm text-gray-500">({amenities.length} amenities)</span>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Amenity
        </Button>
      </div>

      {showAddForm && (
        <Card className="shadow-sm border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Add New Amenity</h3>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Create a new amenity and configure its settings. You can edit all details after creation.
            </p>
            <Button onClick={addNewAmenity} className="w-full">
              Create New Amenity
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {amenities.map(renderAmenityCard)}
      </div>

      {amenities.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Calendar className="w-12 h-12 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700">No Amenities Configured</h3>
              <p className="text-gray-500 max-w-md">
                Add amenities like pools, gyms, rooftops, and community spaces to help residents discover and book them.
              </p>
              <Button onClick={() => setShowAddForm(true)} className="mt-2">
                Add Your First Amenity
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AmenitiesSetup;
