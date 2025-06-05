
import React, { useState } from 'react';
import { Upload, Palette, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BrandingSetupProps {
  onBack: () => void;
}

const BrandingSetup = ({ onBack }: BrandingSetupProps) => {
  const [branding, setBranding] = useState({
    logo: '/placeholder.svg',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#06B6D4',
    domain: 'myProperty.lovable.app',
    favicon: '/favicon.ico'
  });

  const colorPresets = [
    { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#06B6D4' },
    { name: 'Forest Green', primary: '#10B981', secondary: '#047857', accent: '#34D399' },
    { name: 'Sunset Orange', primary: '#F59E0B', secondary: '#D97706', accent: '#FCD34D' },
    { name: 'Purple Royal', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
    { name: 'Rose Pink', primary: '#EC4899', secondary: '#DB2777', accent: '#F9A8D4' }
  ];

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setBranding(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">White-Label Branding</h2>
        <p className="text-gray-600">Customize your property's brand appearance</p>
      </div>

      {/* Logo Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Logo & Favicon</h3>
              <p className="text-gray-600 mb-4">Upload your property logo and favicon</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo">Logo (PNG/SVG)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <img src={branding.logo} alt="Logo" className="w-16 h-16 mx-auto mb-2 object-contain" />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="favicon">Favicon (ICO/PNG)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
          
          {/* Color Presets */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Quick Presets</Label>
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleColorPreset(preset)}
                  className="flex flex-col items-center p-3 rounded-lg border hover:border-blue-300 transition-colors"
                >
                  <div className="flex gap-1 mb-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary">Primary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 p-1 border"
                />
                <Input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondary">Secondary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-10 p-1 border"
                />
                <Input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="accent">Accent Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={branding.accentColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-10 p-1 border"
                />
                <Input
                  type="text"
                  value={branding.accentColor}
                  onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="domain">Custom Domain</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="text"
                  value={branding.domain}
                  onChange={(e) => setBranding(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="myProperty.com"
                  className="flex-1"
                />
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Point your domain to our servers to enable custom branding
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div 
            className="border rounded-lg p-4"
            style={{ 
              background: `linear-gradient(135deg, ${branding.primaryColor}20, ${branding.accentColor}20)`,
              borderColor: branding.primaryColor + '40'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={branding.logo} alt="Logo" className="w-8 h-8" />
              <span className="font-semibold" style={{ color: branding.primaryColor }}>
                Property Management Portal
              </span>
            </div>
            <Button 
              size="sm" 
              style={{ 
                backgroundColor: branding.primaryColor,
                borderColor: branding.primaryColor 
              }}
            >
              Sample Button
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button className="flex-1">
          Save Branding
        </Button>
      </div>
    </div>
  );
};

export default BrandingSetup;
