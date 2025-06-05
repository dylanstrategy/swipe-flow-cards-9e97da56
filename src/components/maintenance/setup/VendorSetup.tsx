
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Phone, Mail, MapPin } from 'lucide-react';

const VendorSetup = () => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'ABC Plumbing',
      category: 'Plumbing',
      phone: '(555) 123-4567',
      email: 'contact@abcplumbing.com',
      responseTime: '2-4 hours',
      rate: '$85/hour'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ['Plumbing', 'Electrical', 'HVAC', 'Appliances', 'Security', 'Painting', 'Flooring', 'General'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Vendor Management</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Vendor
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Vendor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor-name">Vendor Name</Label>
                <Input id="vendor-name" placeholder="Company name" />
              </div>
              <div>
                <Label htmlFor="vendor-category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor-phone">Phone</Label>
                <Input id="vendor-phone" placeholder="(555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="vendor-email">Email</Label>
                <Input id="vendor-email" type="email" placeholder="contact@vendor.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="response-time">Response Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1-2hr">1-2 hours</SelectItem>
                    <SelectItem value="2-4hr">2-4 hours</SelectItem>
                    <SelectItem value="4-8hr">4-8 hours</SelectItem>
                    <SelectItem value="24hr">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vendor-rate">Hourly Rate</Label>
                <Input id="vendor-rate" placeholder="$85/hour" />
              </div>
            </div>
            <div>
              <Label htmlFor="vendor-notes">Notes</Label>
              <Textarea id="vendor-notes" placeholder="Special instructions, certifications, etc." />
            </div>
            <div className="flex gap-2">
              <Button>Save Vendor</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {vendors.map(vendor => (
          <Card key={vendor.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{vendor.name}</h3>
                  <Badge variant="outline" className="mt-1">{vendor.category}</Badge>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {vendor.email}
                </div>
                <div>Response: {vendor.responseTime}</div>
                <div>Rate: {vendor.rate}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorSetup;
