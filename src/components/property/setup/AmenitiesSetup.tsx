
import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AmenitiesSetupProps {
  onBack: () => void;
}

const AmenitiesSetup = ({ onBack }: AmenitiesSetupProps) => {
  const [amenities, setAmenities] = useState([
    {
      id: 1,
      name: 'Rooftop Pool',
      description: 'Outdoor pool with city views',
      enabled: true,
      category: 'Recreation'
    },
    {
      id: 2,
      name: 'Fitness Center',
      description: 'Fully equipped gym with cardio and weights',
      enabled: true,
      category: 'Fitness'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmenity, setNewAmenity] = useState({
    name: '',
    description: '',
    category: 'Recreation'
  });

  const toggleAmenity = (id: number) => {
    setAmenities(amenities.map(amenity => 
      amenity.id === id ? { ...amenity, enabled: !amenity.enabled } : amenity
    ));
  };

  const deleteAmenity = (id: number) => {
    setAmenities(amenities.filter(amenity => amenity.id !== id));
  };

  const addAmenity = () => {
    if (newAmenity.name.trim()) {
      setAmenities([...amenities, {
        id: Date.now(),
        ...newAmenity,
        enabled: true
      }]);
      setNewAmenity({ name: '', description: '', category: 'Recreation' });
      setShowAddForm(false);
    }
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Amenities Setup</h1>
          <p className="text-gray-600">Configure amenities, hours of operation, booking requirements, and pricing</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Property Amenities</CardTitle>
                <p className="text-sm text-gray-600 mt-1">({amenities.length} amenities)</p>
              </div>
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Amenity
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{amenity.name}</h3>
                    <Switch
                      checked={amenity.enabled}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteAmenity(amenity.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600">{amenity.description}</p>
              </div>
            ))}

            {showAddForm && (
              <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-semibold text-blue-900">Add New Amenity</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Amenity Name</Label>
                      <Input
                        value={newAmenity.name}
                        onChange={(e) => setNewAmenity({...newAmenity, name: e.target.value})}
                        placeholder="e.g., Rooftop Pool"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newAmenity.description}
                        onChange={(e) => setNewAmenity({...newAmenity, description: e.target.value})}
                        placeholder="Brief description of the amenity..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={addAmenity} className="flex-1">
                        Add Amenity
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSetup;
