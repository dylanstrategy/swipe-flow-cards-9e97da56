
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Copy, Link } from 'lucide-react';
import type { AppRole } from '@/types/supabase';

interface Property {
  id: string;
  name: string;
}

const RegistrationLinkGenerator = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'resident' as AppRole,
    propertyId: ''
  });
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase.from('properties').select('id, name');
      setProperties(data || []);
    };
    
    fetchProperties();
  }, []);

  const getAvailableRoles = (): AppRole[] => {
    if (userProfile?.role === 'super_admin') {
      return ['senior_operator', 'operator', 'maintenance', 'leasing', 'resident', 'vendor'];
    } else if (userProfile?.role === 'senior_operator') {
      return ['operator', 'maintenance', 'leasing', 'resident', 'vendor'];
    }
    return [];
  };

  const generateLink = () => {
    if (!formData.email || !formData.role || !formData.propertyId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a registration link.",
        variant: "destructive",
      });
      return;
    }

    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      email: formData.email,
      role: formData.role,
      property: formData.propertyId
    });
    
    const link = `${baseUrl}/register?${params.toString()}`;
    setGeneratedLink(link);
    
    toast({
      title: "Registration Link Generated",
      description: "Link has been generated successfully. Click copy to share it.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied to Clipboard",
      description: "Registration link has been copied to your clipboard.",
    });
  };

  const availableRoles = getAvailableRoles();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Generate Registration Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@example.com"
          />
        </div>
        
        <div>
          <Label htmlFor="reg-role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as AppRole })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="reg-property">Property</Label>
          <Select value={formData.propertyId} onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={generateLink} className="w-full">
          Generate Registration Link
        </Button>

        {generatedLink && (
          <div className="space-y-2">
            <Label>Generated Link</Label>
            <div className="flex gap-2">
              <Input 
                value={generatedLink} 
                readOnly 
                className="font-mono text-xs"
              />
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Share this link with the user to allow them to register with pre-filled information.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationLinkGenerator;
