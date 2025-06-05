import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, User, Mail, Phone, Home, Heart, Shield, Bell, Calendar, Settings, CreditCard, Building } from 'lucide-react';
import PropertySetupModule from '@/components/property/PropertySetupModule';

interface PersonalizedSettingsProps {
  onClose: () => void;
  userRole: 'resident' | 'operator' | 'maintenance' | 'leasing' | 'senior_operator' | 'management';
}

interface ResidentData {
  name: string;
  email: string;
  phone: string;
  unitNumber: string;
  propertyName: string;
  leaseStart: string;
  leaseEnd: string;
  petName: string;
  petType: string;
  petBreed: string;
}

interface StaffData {
  name: string;
  email: string;
  phone: string;
  department: string;
  employeeId: string;
  startDate: string;
}

const PersonalizedSettings = ({ onClose, userRole }: PersonalizedSettingsProps) => {
  const [showPropertySetup, setShowPropertySetup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data based on role
  const getUserData = (): ResidentData | StaffData => {
    if (userRole === 'resident') {
      return {
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '(555) 123-4567',
        unitNumber: '304',
        propertyName: 'The Meridian',
        leaseStart: '2024-01-15',
        leaseEnd: '2024-12-31',
        petName: 'Luna',
        petType: 'dog',
        petBreed: 'Golden Retriever'
      };
    } else {
      return {
        name: 'John Smith',
        email: 'john.smith@meridian.com',
        phone: '(555) 987-6543',
        department: userRole === 'operator' || userRole === 'senior_operator' ? 'Property Management' : 
                   userRole === 'maintenance' ? 'Maintenance' : 'Leasing',
        employeeId: 'EMP-001',
        startDate: '2023-03-01'
      };
    }
  };

  const [formData, setFormData] = useState(getUserData());

  if (showPropertySetup) {
    return <PropertySetupModule onClose={() => setShowPropertySetup(false)} />;
  }

  const isResident = userRole === 'resident';
  const isStaff = ['operator', 'senior_operator', 'maintenance', 'leasing', 'management'].includes(userRole);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setIsEditing(false)}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isResident ? 'Account Settings' : 'Profile Settings'}
              </h1>
              <p className="text-gray-600">
                {isResident ? 'Manage your personal information and preferences' : 'Manage your professional profile and system preferences'}
              </p>
            </div>

            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16 flex-shrink-0">
                    <AvatarFallback className="text-xl font-bold bg-blue-600 text-white">
                      {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.name}</h2>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      {isResident ? (
                        <>
                          <Home className="w-4 h-4 flex-shrink-0" />
                          <span>{(formData as ResidentData).propertyName} • Apt {(formData as ResidentData).unitNumber}</span>
                        </>
                      ) : (
                        <>
                          <Building className="w-4 h-4 flex-shrink-0" />
                          <span>{(formData as StaffData).department} • {(formData as StaffData).employeeId}</span>
                        </>
                      )}
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-white disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-white disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resident-specific sections */}
            {isResident && (
              <>
                {/* Lease Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Lease Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Unit Number</Label>
                        <Input value={(formData as ResidentData).unitNumber} disabled className="bg-gray-100" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Property</Label>
                        <Input value={(formData as ResidentData).propertyName} disabled className="bg-gray-100" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Lease Start</Label>
                        <Input value={(formData as ResidentData).leaseStart} disabled className="bg-gray-100" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Lease End</Label>
                        <Input value={(formData as ResidentData).leaseEnd} disabled className="bg-gray-100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pet Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Pet Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Pet Name</Label>
                        <Input
                          value={(formData as ResidentData).petName}
                          onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                          disabled={!isEditing}
                          className="bg-white disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Pet Type</Label>
                        <select
                          value={(formData as ResidentData).petType}
                          onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-md text-sm ${isEditing ? 'bg-white' : 'bg-gray-100'} disabled:bg-gray-100`}
                        >
                          <option value="">Select pet type</option>
                          <option value="dog">Dog</option>
                          <option value="cat">Cat</option>
                          <option value="bird">Bird</option>
                          <option value="fish">Fish</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Breed</Label>
                      <Input
                        value={(formData as ResidentData).petBreed}
                        onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white disabled:bg-gray-100"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods - Residents only */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">•••• 4532</p>
                            <p className="text-sm text-gray-600">Expires 12/26</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Primary</Badge>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Staff-specific sections */}
            {isStaff && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Employment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Department</Label>
                      <Input value={(formData as StaffData).department} disabled className="bg-gray-100" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Employee ID</Label>
                      <Input value={(formData as StaffData).employeeId} disabled className="bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</Label>
                    <Input value={(formData as StaffData).startDate} disabled className="bg-gray-100" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Login Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  {isResident && (
                    <>
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Advertisement Preferences</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Personalized Ads</Label>
                              <p className="text-sm text-gray-600">Show ads based on your interests and activity</p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Local Business Ads</Label>
                              <p className="text-sm text-gray-600">Show ads from businesses in your area</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">Property Services Ads</Label>
                              <p className="text-sm text-gray-600">Show ads for property-related services and amenities</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Privacy Notice</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          We collect and use your information to provide property management services, 
                          process payments, and improve your living experience. Your data is protected 
                          and never shared with third parties without your consent.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-blue-600">
                          Read full privacy policy
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {isResident ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Maintenance Updates</Label>
                          <p className="text-sm text-gray-600">Get notified about work order status changes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Rent Reminders</Label>
                          <p className="text-sm text-gray-600">Receive reminders before rent is due</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Community Events</Label>
                          <p className="text-sm text-gray-600">Get notified about building events and activities</p>
                        </div>
                        <Switch />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Work Order Assignments</Label>
                          <p className="text-sm text-gray-600">Get notified when new work orders are assigned</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">System Alerts</Label>
                          <p className="text-sm text-gray-600">Receive important system notifications</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Schedule Changes</Label>
                          <p className="text-sm text-gray-600">Get notified about schedule updates</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scheduling Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Scheduling Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Availability Hours */}
                <div>
                  <h4 className="font-medium mb-3">Available Hours</h4>
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium">{day}</div>
                        <Switch defaultChecked={!['Saturday', 'Sunday'].includes(day)} />
                        <div className="flex items-center gap-2 text-sm">
                          <select className="px-2 py-1 border rounded text-sm">
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                          </select>
                          <span>to</span>
                          <select className="px-2 py-1 border rounded text-sm">
                            <option value="17:00">5:00 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="19:00">7:00 PM</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Default Settings */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Default Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Default Meeting Duration</span>
                      <select className="px-2 py-1 border rounded text-sm w-full sm:w-auto">
                        <option value="15">15 minutes</option>
                        <option value="30" selected>30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Buffer Time Between Appointments</span>
                      <select className="px-2 py-1 border rounded text-sm w-full sm:w-auto">
                        <option value="0">No buffer</option>
                        <option value="5">5 minutes</option>
                        <option value="10" selected>10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Setup - Staff only */}
            {(userRole === 'operator' || userRole === 'senior_operator' || userRole === 'management') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowPropertySetup(true)}
                    >
                      Property Configuration
                    </Button>
                    <p className="text-sm text-gray-600">
                      Configure property-wide settings, branding, and integrations
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedSettings;
