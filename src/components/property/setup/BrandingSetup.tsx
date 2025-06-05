
import React, { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BrandingSetupProps {
  onBack: () => void;
}

const BrandingSetup = ({ onBack }: BrandingSetupProps) => {
  const [branding, setBranding] = useState({
    logo: null,
    favicon: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#06B6D4'
  });

  const colorPresets = [
    { name: 'Ocean Blue', colors: ['#3B82F6', '#1E40AF', '#06B6D4'] },
    { name: 'Forest Green', colors: ['#10B981', '#059669', '#047857'] },
    { name: 'Sunset Orange', colors: ['#F59E0B', '#D97706', '#B45309'] },
    { name: 'Purple Royal', colors: ['#8B5CF6', '#7C3AED', '#6D28D9'] },
    { name: 'Rose Pink', colors: ['#EC4899', '#DB2777', '#BE185D'] }
  ];

  const handleColorPreset = (colors: string[]) => {
    setBranding({
      ...branding,
      primaryColor: colors[0],
      secondaryColor: colors[1],
      accentColor: colors[2]
    });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Branding & Design</h1>
          <p className="text-gray-600">Customize colors, logos, and visual identity</p>
        </div>

        {/* Logo & Favicon */}
        <Card>
          <CardHeader>
            <CardTitle>Logo & Favicon</CardTitle>
            <p className="text-sm text-gray-600">Upload your property logo and favicon</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">Logo (PNG/SVG)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2">
                  <div className="w-20 h-20 bg-gray-200 rounded mx-auto mb-4"></div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-base font-medium">Favicon (ICO/PNG)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2">
                  <div className="w-12 h-12 bg-blue-500 rounded mx-auto mb-4"></div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Favicon
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Quick Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleColorPreset(preset.colors)}
                    className="p-3 border rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <div className="flex gap-1 mb-2">
                      {preset.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-center font-medium">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-base font-medium">Primary Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <div
                    className="w-12 h-12 rounded border-2 border-gray-300"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <Input
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              <div>
                <Label className="text-base font-medium">Secondary Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <div
                    className="w-12 h-12 rounded border-2 border-gray-300"
                    style={{ backgroundColor: branding.secondaryColor }}
                  />
                  <Input
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                    placeholder="#1E40AF"
                  />
                </div>
              </div>
              <div>
                <Label className="text-base font-medium">Accent Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <div
                    className="w-12 h-12 rounded border-2 border-gray-300"
                    style={{ backgroundColor: branding.accentColor }}
                  />
                  <Input
                    value={branding.accentColor}
                    onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                    placeholder="#06B6D4"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save Branding
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandingSetup;
