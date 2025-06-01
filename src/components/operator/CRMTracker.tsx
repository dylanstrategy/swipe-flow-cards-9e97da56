
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Search, Calendar, DollarSign, Home, Phone, Mail, Eye, Play, FileText } from 'lucide-react';

interface CRMTrackerProps {
  onClose: () => void;
  initialFilter: 'leases' | 'shows' | 'outreach';
}

const CRMTracker: React.FC<CRMTrackerProps> = ({ onClose, initialFilter }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProspect, setSelectedProspect] = useState<any>(null);

  const prospects = [
    {
      id: 1,
      name: 'Nithash Veeramachaneni',
      property: 'Le Leo',
      suiteType: 'Classic',
      unit: '315',
      unitType: 'Studio',
      appointmentDate: '4/29/2025',
      tourDate: '4/26/2025',
      event: 'Reschedule',
      agent: 'Amanda Ortiz',
      reason: 'Select',
      rent: '$7,271/1906',
      moveIn: '7/27/1906',
      source: 'Call',
      status: 'Reschedule',
      priceRange: '$1,500-$1,700',
      notes: '',
      toured: true,
      tourVideos: ['https://example.com/tour1.mp4'],
      apartmentsSeen: ['315', '317', '320'],
      feedback: 'Loved the studio layout, concerned about noise from street'
    },
    {
      id: 2,
      name: 'Wei Xiao',
      property: 'Le Leo',
      suiteType: 'Classic',
      unit: '317',
      unitType: '2B',
      appointmentDate: '4/29/2025',
      tourDate: '4/29/2025',
      event: 'Follow Up',
      agent: 'Amanda Ortiz',
      reason: 'Select',
      rent: '4K',
      moveIn: '6/6/2025',
      source: '',
      status: 'Follow Up',
      priceRange: '$1,800-$2,200',
      notes: 'Has a roommate - seemed really interested - Roommate also reached out in the CRM',
      toured: true,
      tourVideos: ['https://example.com/tour2.mp4'],
      apartmentsSeen: ['317', '318'],
      feedback: 'Great for roommates, liked the layout'
    },
    {
      id: 3,
      name: 'Paritosh Joshi',
      property: 'Le Leo',
      suiteType: 'Coliving',
      unit: 'Select',
      unitType: '',
      appointmentDate: '4/26/2025',
      tourDate: '5/3/2025',
      event: 'Follow Up',
      agent: '',
      reason: 'Lease Terms/Pet Rules',
      rent: '',
      moveIn: '8/1/2025',
      source: '',
      status: 'Follow Up',
      priceRange: '$1,200-$1,500',
      notes: 'Sent text 5.9 DB',
      toured: false,
      tourVideos: [],
      apartmentsSeen: [],
      feedback: ''
    },
    {
      id: 4,
      name: 'Gina Cordoba',
      property: 'Le Leo',
      suiteType: 'Coliving',
      unit: 'SB',
      unitType: '',
      appointmentDate: '5/5/2025',
      tourDate: '5/8/2025',
      event: 'Reschedule',
      agent: 'Amanda Ortiz',
      reason: 'Select',
      rent: '',
      moveIn: '',
      source: '',
      status: 'Reschedule',
      priceRange: '$1,300-$1,600',
      notes: '',
      toured: false,
      tourVideos: [],
      apartmentsSeen: [],
      feedback: ''
    }
  ];

  const getFilteredProspects = () => {
    let filtered = prospects;
    
    if (filter === 'leases') {
      filtered = prospects.filter(p => p.status === 'Follow Up' && p.toured);
    } else if (filter === 'shows') {
      filtered = prospects.filter(p => p.status === 'Reschedule' || !p.toured);
    } else if (filter === 'outreach') {
      filtered = prospects.filter(p => p.notes.includes('text') || p.notes.includes('call') || p.notes.includes('email'));
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reschedule': return 'bg-orange-100 text-orange-800';
      case 'Follow Up': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilterTitle = () => {
    switch (filter) {
      case 'leases': return 'Required Leases Pipeline';
      case 'shows': return 'Required Shows Pipeline';
      case 'outreach': return 'Required Outreach Pipeline';
      default: return 'CRM Pipeline';
    }
  };

  if (selectedProspect) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setSelectedProspect(null)} className="mr-4">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Prospect Profile</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedProspect.name}
              <Badge className={getStatusColor(selectedProspect.status)}>
                {selectedProspect.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Property</p>
                <p className="font-medium">{selectedProspect.property}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price Range</p>
                <p className="font-medium">{selectedProspect.priceRange}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Move In Date</p>
                <p className="font-medium">{selectedProspect.moveIn || 'TBD'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agent</p>
                <p className="font-medium">{selectedProspect.agent || 'Unassigned'}</p>
              </div>
            </div>

            {selectedProspect.notes && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="bg-gray-50 p-3 rounded-md">{selectedProspect.notes}</p>
              </div>
            )}

            {selectedProspect.toured && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tour Details</h3>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Apartments Viewed</p>
                    <div className="flex gap-2">
                      {selectedProspect.apartmentsSeen.map((unit: string) => (
                        <Badge key={unit} variant="outline">{unit}</Badge>
                      ))}
                    </div>
                  </div>

                  {selectedProspect.tourVideos.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Tour Videos</p>
                      <div className="flex gap-2">
                        {selectedProspect.tourVideos.map((video: string, index: number) => (
                          <Button key={index} variant="outline" size="sm">
                            <Play size={16} className="mr-2" />
                            Tour Video {index + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProspect.feedback && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Feedback</p>
                      <p className="bg-blue-50 p-3 rounded-md">{selectedProspect.feedback}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button className="flex-1">
                <Phone size={16} className="mr-2" />
                Call
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail size={16} className="mr-2" />
                Email
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar size={16} className="mr-2" />
                Schedule Tour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onClose} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{getFilterTitle()}</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === 'leases' ? 'default' : 'outline'}
          onClick={() => setFilter('leases')}
          size="sm"
        >
          Leases
        </Button>
        <Button
          variant={filter === 'shows' ? 'default' : 'outline'}
          onClick={() => setFilter('shows')}
          size="sm"
        >
          Shows
        </Button>
        <Button
          variant={filter === 'outreach' ? 'default' : 'outline'}
          onClick={() => setFilter('outreach')}
          size="sm"
        >
          Outreach
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search prospects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {getFilteredProspects().map((prospect) => (
          <Card key={prospect.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedProspect(prospect)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{prospect.name}</h3>
                <Badge className={getStatusColor(prospect.status)}>
                  {prospect.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Home size={14} className="mr-1" />
                  {prospect.suiteType} {prospect.unit}
                </div>
                <div className="flex items-center">
                  <DollarSign size={14} className="mr-1" />
                  {prospect.priceRange}
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Tour: {prospect.tourDate}
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Move: {prospect.moveIn || 'TBD'}
                </div>
              </div>

              {prospect.notes && (
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-2">{prospect.notes}</p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Agent: {prospect.agent || 'Unassigned'}</span>
                <div className="flex gap-1">
                  {prospect.toured && <Badge variant="outline">Toured</Badge>}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CRMTracker;
