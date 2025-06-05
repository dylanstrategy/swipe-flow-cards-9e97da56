import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  MousePointer, 
  Type, 
  Calendar,
  CheckSquare,
  PenTool,
  Save,
  ArrowLeft,
  Trash2,
  Edit3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentField {
  id: string;
  type: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';
  x: number;
  y: number;
  width: number;
  height: number;
  role: string;
  mergeField?: string;
  required: boolean;
  placeholder?: string;
}

interface DocumentFieldEditorProps {
  documentUrl: string;
  documentName: string;
  onSave: (fields: DocumentField[]) => void;
  onBack: () => void;
  initialFields?: DocumentField[];
}

const DocumentFieldEditor: React.FC<DocumentFieldEditorProps> = ({
  documentUrl,
  documentName,
  onSave,
  onBack,
  initialFields = []
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fields, setFields] = useState<DocumentField[]>(initialFields);
  const [selectedTool, setSelectedTool] = useState<DocumentField['type'] | null>(null);
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [scale, setScale] = useState(1);

  const fieldTypes = [
    { type: 'signature' as const, icon: PenTool, label: 'Signature', color: 'bg-blue-500' },
    { type: 'initial' as const, icon: Edit3, label: 'Initial', color: 'bg-green-500' },
    { type: 'date' as const, icon: Calendar, label: 'Date', color: 'bg-purple-500' },
    { type: 'text' as const, icon: Type, label: 'Text', color: 'bg-orange-500' },
    { type: 'checkbox' as const, icon: CheckSquare, label: 'Checkbox', color: 'bg-red-500' },
  ];

  const mergeFields = [
    'resident_name',
    'resident_email', 
    'unit_number',
    'property_name',
    'lease_start_date',
    'lease_end_date',
    'monthly_rent',
    'security_deposit',
    'move_in_date'
  ];

  useEffect(() => {
    loadDocument();
  }, [documentUrl]);

  const loadDocument = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // For demo purposes, we'll create a mock PDF page
      // In a real implementation, you'd use PDF.js to render the actual PDF
      canvas.width = 600;
      canvas.height = 800;
      
      // Draw a white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some sample document content
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.fillText('LEASE AGREEMENT', 50, 50);
      ctx.font = '12px Arial';
      ctx.fillText('This lease agreement is between:', 50, 100);
      ctx.fillText('Property Owner: _________________________', 50, 130);
      ctx.fillText('Tenant: _________________________', 50, 160);
      ctx.fillText('Unit Number: _________________________', 50, 190);
      
      // Draw signature lines
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 700);
      ctx.lineTo(250, 700);
      ctx.stroke();
      ctx.fillText('Tenant Signature', 50, 720);
      
      ctx.beginPath();
      ctx.moveTo(350, 700);
      ctx.lineTo(550, 700);
      ctx.stroke();
      ctx.fillText('Date', 350, 720);

      setDocumentLoaded(true);
      redrawFields();
    } catch (error) {
      console.error('Error loading document:', error);
      toast({
        title: "Error Loading Document",
        description: "Failed to load the document for editing",
        variant: "destructive",
      });
    }
  };

  const redrawFields = () => {
    if (!canvasRef.current || !documentLoaded) return;
    
    loadDocument(); // Redraw document first
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw all fields
    fields.forEach(field => {
      drawField(ctx, field);
    });
  };

  const drawField = (ctx: CanvasRenderingContext2D, field: DocumentField) => {
    const colors = {
      signature: '#3B82F6',
      initial: '#10B981',
      date: '#8B5CF6',
      text: '#F59E0B',
      checkbox: '#EF4444',
    };

    ctx.strokeStyle = colors[field.type];
    ctx.fillStyle = colors[field.type] + '20';
    ctx.lineWidth = 2;

    // Draw field boundary
    ctx.fillRect(field.x, field.y, field.width, field.height);
    ctx.strokeRect(field.x, field.y, field.width, field.height);

    // Draw field label
    ctx.fillStyle = colors[field.type];
    ctx.font = '10px Arial';
    ctx.fillText(
      field.type.toUpperCase() + (field.mergeField ? ` (${field.mergeField})` : ''),
      field.x,
      field.y - 5
    );
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedTool || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;

    // Check if clicking on existing field
    const clickedField = fields.find(field => 
      x >= field.x && x <= field.x + field.width &&
      y >= field.y && y <= field.y + field.height
    );

    if (clickedField) {
      setSelectedField(clickedField);
      return;
    }

    // Create new field
    const defaultSizes = {
      signature: { width: 150, height: 30 },
      initial: { width: 50, height: 30 },
      date: { width: 100, height: 25 },
      text: { width: 120, height: 25 },
      checkbox: { width: 20, height: 20 },
    };

    const size = defaultSizes[selectedTool];
    const newField: DocumentField = {
      id: Date.now().toString(),
      type: selectedTool,
      x: Math.max(0, x - size.width / 2),
      y: Math.max(0, y - size.height / 2),
      width: size.width,
      height: size.height,
      role: 'Signer 1',
      required: true,
    };

    setFields(prev => [...prev, newField]);
    setSelectedField(newField);
    
    setTimeout(() => {
      redrawFields();
    }, 0);
  };

  const updateField = (fieldId: string, updates: Partial<DocumentField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
    
    setTimeout(() => {
      redrawFields();
    }, 0);
  };

  const deleteField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
    
    setTimeout(() => {
      redrawFields();
    }, 0);
  };

  const handleSave = () => {
    if (fields.length === 0) {
      toast({
        title: "No Fields Added",
        description: "Please add at least one signature field to the document",
        variant: "destructive",
      });
      return;
    }

    onSave(fields);
    toast({
      title: "Template Saved",
      description: `Document template with ${fields.length} fields has been saved`,
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{documentName}</h1>
            <p className="text-sm text-gray-600">Add signature fields and merge fields</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Template
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tools Panel */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Field Tools */}
          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">Field Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {fieldTypes.map(({ type, icon: Icon, label, color }) => (
                <Button
                  key={type}
                  variant={selectedTool === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool(selectedTool === type ? null : type)}
                  className="flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded ${color}`} />
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
            {selectedTool && (
              <p className="text-xs text-gray-600 mt-2">
                Click on the document to place a {selectedTool} field
              </p>
            )}
          </div>

          {/* Field Properties */}
          {selectedField && (
            <div className="p-4 border-b flex-1">
              <h3 className="font-medium mb-3">Field Properties</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Field Type</Label>
                  <Badge className="ml-2 text-xs">
                    {selectedField.type.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <Label htmlFor="role" className="text-xs">Signer Role</Label>
                  <Select 
                    value={selectedField.role} 
                    onValueChange={(value) => updateField(selectedField.id, { role: value })}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Signer 1">Signer 1</SelectItem>
                      <SelectItem value="Signer 2">Signer 2</SelectItem>
                      <SelectItem value="Witness">Witness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(selectedField.type === 'text' || selectedField.type === 'date') && (
                  <div>
                    <Label htmlFor="merge-field" className="text-xs">Merge Field (Optional)</Label>
                    <Select 
                      value={selectedField.mergeField || ''} 
                      onValueChange={(value) => updateField(selectedField.id, { mergeField: value || undefined })}
                    >
                      <SelectTrigger className="h-8 mt-1">
                        <SelectValue placeholder="Select merge field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {mergeFields.map(field => (
                          <SelectItem key={field} value={field}>
                            {field.replace(/_/g, ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="width" className="text-xs">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={selectedField.width}
                    onChange={(e) => updateField(selectedField.id, { width: parseInt(e.target.value) })}
                    className="h-8 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="text-xs">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={selectedField.height}
                    onChange={(e) => updateField(selectedField.id, { height: parseInt(e.target.value) })}
                    className="h-8 mt-1"
                  />
                </div>

                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => deleteField(selectedField.id)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Field
                </Button>
              </div>
            </div>
          )}

          {/* Fields List */}
          <div className="p-4">
            <h3 className="font-medium mb-3">Document Fields ({fields.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {fields.map(field => (
                <div 
                  key={field.id}
                  className={`p-2 rounded border cursor-pointer text-xs ${
                    selectedField?.id === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedField(field)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{field.type.toUpperCase()}</span>
                    <Badge variant="outline" className="text-xs">{field.role}</Badge>
                  </div>
                  {field.mergeField && (
                    <div className="text-gray-500 mt-1">{field.mergeField}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-sm border inline-block">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-crosshair border"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentFieldEditor;
