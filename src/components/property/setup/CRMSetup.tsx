import React, { useState } from 'react';
import { TrendingUp, Clock, User, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface CRMSetupProps {
  onBack: () => void;
}

const CRMSetup = ({ onBack }: CRMSetupProps) => {
  const [crmSettings, setCrmSettings] = useState({
    followUpTiming: {
      postTour: [1, 3, 7],
      postApplication: [1, 5],
      renewalNotice: [60, 30, 14]
    },
    requiredFields: {
      phone: true,
      email: true,
      income: true,
      employmentStatus: false,
      previousRental: false
    },
    leadSources: [
      { name: 'Google Ads', enabled: true, trackingCode: 'GA-123' },
      { name: 'Facebook/Instagram', enabled: true, trackingCode: 'FB-456' },
      { name: 'Zillow', enabled: true, trackingCode: 'ZL-789' },
      { name: 'Apartments.com', enabled: false, trackingCode: '' },
      { name: 'Referral', enabled: true, trackingCode: 'REF-001' }
    ],
    escalationRules: {
      missedFollowUp: true,
      overdueRenewal: true,
      highValueLead: true
    }
  });

  const updateFollowUpTiming = (type: string, value: string) => {
    const days = value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
    setCrmSettings(prev => ({
      ...prev,
      followUpTiming: {
        ...prev.followUpTiming,
        [type]: days
      }
    }));
  };

  const updateLeadSource = (index: number, field: string, value: any) => {
    setCrmSettings(prev => ({
      ...prev,
      leadSources: prev.leadSources.map((source, i) => 
        i === index ? { ...source, [field]: value } : source
      )
    }));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM & Follow-up Logic</h1>
          <p className="text-gray-600">Configure lead tracking and follow-up automation</p>
        </div>

        {/* Follow-up Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Follow-up Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Post-Tour Follow-ups (days after tour)</Label>
              <Input
                value={crmSettings.followUpTiming.postTour.join(', ')}
                onChange={(e) => updateFollowUpTiming('postTour', e.target.value)}
                placeholder="1, 3, 7"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Automatically send follow-up messages on these days after a tour
              </p>
            </div>

            <div>
              <Label>Post-Application Follow-ups (days after application)</Label>
              <Input
                value={crmSettings.followUpTiming.postApplication.join(', ')}
                onChange={(e) => updateFollowUpTiming('postApplication', e.target.value)}
                placeholder="1, 5"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Renewal Notices (days before lease expires)</Label>
              <Input
                value={crmSettings.followUpTiming.renewalNotice.join(', ')}
                onChange={(e) => updateFollowUpTiming('renewalNotice', e.target.value)}
                placeholder="60, 30, 14"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Required Contact Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Required Contact Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(crmSettings.requiredFields).map(([field, required]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    checked={required}
                    onCheckedChange={(checked) => 
                      setCrmSettings(prev => ({
                        ...prev,
                        requiredFields: {
                          ...prev.requiredFields,
                          [field]: checked as boolean
                        }
                      }))
                    }
                  />
                  <label className="text-sm font-medium">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Lead Source Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crmSettings.leadSources.map((source, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <Checkbox
                  checked={source.enabled}
                  onCheckedChange={(checked) => updateLeadSource(index, 'enabled', checked)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{source.name}</span>
                    <Badge className={source.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {source.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <Input
                    value={source.trackingCode}
                    onChange={(e) => updateLeadSource(index, 'trackingCode', e.target.value)}
                    placeholder="Tracking code..."
                    size={10}
                    disabled={!source.enabled}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Escalation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Escalation Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={crmSettings.escalationRules.missedFollowUp}
                onCheckedChange={(checked) => 
                  setCrmSettings(prev => ({
                    ...prev,
                    escalationRules: {
                      ...prev.escalationRules,
                      missedFollowUp: checked as boolean
                    }
                  }))
                }
              />
              <label className="text-sm font-medium">
                Alert when follow-ups are missed or skipped
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={crmSettings.escalationRules.overdueRenewal}
                onCheckedChange={(checked) => 
                  setCrmSettings(prev => ({
                    ...prev,
                    escalationRules: {
                      ...prev.escalationRules,
                      overdueRenewal: checked as boolean
                    }
                  }))
                }
              />
              <label className="text-sm font-medium">
                Alert for overdue renewal responses
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={crmSettings.escalationRules.highValueLead}
                onCheckedChange={(checked) => 
                  setCrmSettings(prev => ({
                    ...prev,
                    escalationRules: {
                      ...prev.escalationRules,
                      highValueLead: checked as boolean
                    }
                  }))
                }
              />
              <label className="text-sm font-medium">
                Priority alerts for high-value leads ($3000+ monthly rent)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save CRM Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CRMSetup;
