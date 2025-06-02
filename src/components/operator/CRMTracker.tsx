
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Search, Calendar, DollarSign, Home, Phone, Mail, Eye, Play, FileText, ChevronRight, MessageCircle, Plus, Edit, Upload, Video, Image } from 'lucide-react';

interface CRMTrackerProps {
  onClose: () => void;
  initialFilter: 'leases' | 'shows' | 'outreach';
}

const CRMTracker: React.FC<CRMTrackerProps> = ({ onClose, initialFilter }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'photo'>('video');
  const [newNote, setNewNote] = useState('');

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
      status: 'reschedule',
      priceRange: '$1,500-$1,700',
      notes: [
        { date: '4/25/2025', text: 'Initial contact made, interested in studio' },
        { date: '4/26/2025', text: 'Scheduled tour for tomorrow' }
      ],
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
      status: 'follow-up',
      priceRange: '$1,800-$2,200',
      notes: [
        { date: '4/28/2025', text: 'Has a roommate - seemed really interested' },
        { date: '4/29/2025', text: 'Roommate also reached out in the CRM' }
      ],
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
      status: 'scheduled',
      priceRange: '$1,200-$1,500',
      notes: [
        { date: '5/1/2025', text: 'Sent text 5.9 DB' }
      ],
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
      status: 'won',
      priceRange: '$1,300-$1,600',
      notes: [
        { date: '5/4/2025', text: 'Signed lease agreement!' }
      ],
      toured: true,
      tourVideos: [],
      apartmentsSeen: ['SB1', 'SB2'],
      feedback: 'Perfect fit for their budget'
    }
  ];

  const getFilteredProspects = () => {
    let filtered = prospects;
    
    if (filter === 'leases') {
      filtered = prospects.filter(p => p.toured);
    } else if (filter === 'shows') {
      filtered = prospects.filter(p => p.status === 'scheduled');
    } else if (filter === 'outreach') {
      filtered = prospects.filter(p => p.status === 'reschedule' || p.status === 'follow-up');
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
      case 'reschedule': return 'bg-orange-100 text-orange-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'toured': return 'bg-purple-100 text-purple-800';
      case 'won': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilterTitle = () => {
    switch (filter) {
      case 'leases': return 'Toured Prospects Pipeline';
      case 'shows': return 'Scheduled Shows Pipeline';
      case 'outreach': return 'Outreach Required Pipeline';
      default: return 'CRM Pipeline';
    }
  };

  const addNote = () => {
    if (newNote.trim() && selectedProspect) {
      const updatedNotes = [
        ...selectedProspect.notes,
        { date: new Date().toLocaleDateString(), text: newNote.trim() }
      ];
      setSelectedProspect({ ...selectedProspect, notes: updatedNotes });
      setNewNote('');
      setShowNotesDialog(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && selectedProspect) {
      const file = files[0];
      const fileName = file.name;
      
      if (uploadType === 'video') {
        const updatedVideos = [...selectedProspect.tourVideos, `https://example.com/${fileName}`];
        setSelectedProspect({ ...selectedProspect, tourVideos: updatedVideos });
      } else {
        const updatedPhotos = [...(selectedProspect.tourPhotos || []), `/placeholder.svg`];
        setSelectedProspect({ ...selectedProspect, tourPhotos: updatedPhotos });
      }
      
      setShowUploadDialog(false);
      console.log(`Uploaded ${uploadType}:`, fileName);
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
                {selectedProspect.status.replace('-', ' ').toUpperCase()}
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

            {/* Notes Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Activity Notes</h3>
                <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus size={16} className="mr-2" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Note</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button onClick={addNote}>Add Note</Button>
                        <Button variant="outline" onClick={() => setShowNotesDialog(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {selectedProspect.notes.map((note: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-sm">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedProspect.toured && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Tour Media</h3>
                    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Upload size={16} className="mr-2" />
                          Upload Media
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Tour Media</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Button
                              variant={uploadType === 'video' ? 'default' : 'outline'}
                              onClick={() => setUploadType('video')}
                              className="flex-1"
                            >
                              <Video size={16} className="mr-2" />
                              Video
                            </Button>
                            <Button
                              variant={uploadType === 'photo' ? 'default' : 'outline'}
                              onClick={() => setUploadType('photo')}
                              className="flex-1"
                            >
                              <Image size={16} className="mr-2" />
                              Photo
                            </Button>
                          </div>
                          <Input
                            type="file"
                            accept={uploadType === 'video' ? 'video/*' : 'image/*'}
                            onChange={handleFileUpload}
                          />
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
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
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProspect.tourVideos.map((video: string, index: number) => (
                          <Button key={index} variant="outline" size="sm" className="justify-start">
                            <Play size={16} className="mr-2" />
                            Tour Video {index + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProspect.tourPhotos && selectedProspect.tourPhotos.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Tour Photos</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProspect.tourPhotos.map((photo: string, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`Tour photo ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                          </div>
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

            {/* Action Buttons - Stacked */}
            <div className="space-y-3">
              <Button className="w-full">
                <Phone size={16} className="mr-2" />
                Call
              </Button>
              <Button variant="outline" className="w-full">
                <Mail size={16} className="mr-2" />
                Email
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar size={16} className="mr-2" />
                Schedule Tour
              </Button>
              <Button variant="outline" className="w-full">
                <MessageCircle size={16} className="mr-2" />
                Send Message
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
          Toured
        </Button>
        <Button
          variant={filter === 'shows' ? 'default' : 'outline'}
          onClick={() => setFilter('shows')}
          size="sm"
        >
          Scheduled
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
                  {prospect.status.replace('-', ' ').toUpperCase()}
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

              {prospect.notes.length > 0 && (
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mb-2">
                  Latest: {prospect.notes[prospect.notes.length - 1].text}
                </p>
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
