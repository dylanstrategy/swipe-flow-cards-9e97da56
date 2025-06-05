

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
  Edit3,
  Undo,
  Database
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mergeFieldsService, type MergeField } from '@/services/mergeFieldsLibrary';

interface DocumentField {
  id: string;
  type: 'signature' | 'initial' | 'date' | 'text' | 'checkbox' | 'merge';
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
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [fieldHistory, setFieldHistory] = useState<DocumentField[][]>([]);
  const [selectedMergeCategory, setSelectedMergeCategory] = useState<string>('all');

  const fieldTypes = [
    { type: 'signature' as const, icon: PenTool, label: 'Signature', color: 'bg-blue-500' },
    { type: 'initial' as const, icon: Edit3, label: 'Initial', color: 'bg-green-500' },
    { type: 'date' as const, icon: Calendar, label: 'Date', color: 'bg-purple-500' },
    { type: 'text' as const, icon: Type, label: 'Text', color: 'bg-orange-500' },
    { type: 'checkbox' as const, icon: CheckSquare, label: 'Checkbox', color: 'bg-red-500' },
    { type: 'merge' as const, icon: Database, label: 'Merge Field', color: 'bg-teal-500' },
  ];

  // Get merge fields from the library
  const mergeFieldCategories = mergeFieldsService.getAllCategories();
  const availableMergeFields = selectedMergeCategory === 'all' 
    ? mergeFieldsService.getAllFields()
    : mergeFieldsService.getFieldsByCategory(selectedMergeCategory);

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

    // Draw all fields with colored boxes
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
      merge: '#14B8A6',
    };

    const color = colors[field.type];
    const isSelected = selectedField?.id === field.id;

    // Draw field boundary with colored background
    ctx.fillStyle = color + '30'; // Semi-transparent background
    ctx.fillRect(field.x, field.y, field.width, field.height);
    
    // Draw border (thicker if selected)
    ctx.strokeStyle = color;
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(field.x, field.y, field.width, field.height);

    // Draw field label
    ctx.fillStyle = color;
    ctx.font = 'bold 10px Arial';
    const labelText = field.type.toUpperCase() + 
      (field.mergeField ? ` (${field.mergeField.replace(/_/g, ' ')})` : '');
    
    // Background for label
    const textMetrics = ctx.measureText(labelText);
    const labelHeight = 14;
    ctx.fillStyle = color;
    ctx.fillRect(field.x, field.y - labelHeight, textMetrics.width + 8, labelHeight);
    
    // Label text
    ctx.fillStyle = 'white';
    ctx.fillText(labelText, field.x + 4, field.y - 3);

    // Draw selection handles if selected
    if (isSelected) {
      const handleSize = 6;
      ctx.fillStyle = color;
      // Corner handles
      ctx.fillRect(field.x - handleSize/2, field.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(field.x + field.width - handleSize/2, field.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(field.x - handleSize/2, field.y + field.height - handleSize/2, handleSize, handleSize);
      ctx.fillRect(field.x + field.width - handleSize/2, field.y + field.height - handleSize/2, handleSize, handleSize);
    }
  };

  const saveToHistory = () => {
    setFieldHistory(prev => [...prev.slice(-9), [...fields]]);
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

    // Save current state to history before adding new field
    saveToHistory();

    // Create new field
    const defaultSizes = {
      signature: { width: 150, height: 30 },
      initial: { width: 50, height: 30 },
      date: { width: 100, height: 25 },
      text: { width: 120, height: 25 },
      checkbox: { width: 20, height: 20 },
      merge: { width: 120, height: 25 },
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
      mergeField: selectedTool === 'merge' ? availableMergeFields[0]?.name : undefined,
    };

    setFields(prev => [...prev, newField]);
    setSelectedField(newField);
    
    setTimeout(() => {
      redrawFields();
    }, 0);

    toast({
      title: "Field Added",
      description: `${selectedTool} field placed on document`,
    });
  };

  const updateField = (fieldId: string, updates: Partial<DocumentField>) => {
    saveToHistory();
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
    saveToHistory();
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
    
    setTimeout(() => {
      redrawFields();
    }, 0);

    toast({
      title: "Field Deleted",
      description: "Document field has been removed",
    });
  };

  const handleUndo = () => {
    if (fieldHistory.length === 0) return;
    
    const previousState = fieldHistory[fieldHistory.length - 1];
    setFields(previousState);
    setFieldHistory(prev => prev.slice(0, -1));
    setSelectedField(null);
    
    setTimeout(() => {
      redrawFields();
    }, 0);

    toast({
      title: "Undone",
      description: "Last action has been undone",
    });
  };

  const handleSave = () => {
    if (fields.length === 0) {
      toast({
        title: "No Fields Added",
        description: "Please add at least one field to the document",
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-gray-900 truncate">{documentName}</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Add signature fields and merge fields</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUndo}
            disabled={fieldHistory.length === 0}
            className="flex-shrink-0"
          >
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
            <Save className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Save Template</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Field Tools */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-3">Field Tools</h3>
            <div className="space-y-2">
              {fieldTypes.map(({ type, icon: Icon, label, color }) => (
                <Button
                  key={type}
                  variant={selectedTool === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool(selectedTool === type ? null : type)}
                  className={`w-full flex items-center gap-3 justify-start h-10 px-3 text-sm ${
                    selectedTool === type 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded flex-shrink-0 ${selectedTool === type ? 'bg-white' : color}`} />
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </Button>
              ))}
            </div>
            {selectedTool && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">
                  {selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} tool selected
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Click on the document to place the field
                </p>
              </div>
            )}
          </div>

          {/* Field Properties */}
          {selectedField && (
            <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-3">Field Properties</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-700">Field Type</Label>
                  <Badge className="ml-2 text-xs bg-gray-100 text-gray-800">
                    {selectedField.type.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <Label htmlFor="role" className="text-sm text-gray-700">Signer Role</Label>
                  <Select 
                    value={selectedField.role} 
                    onValueChange={(value) => updateField(selectedField.id, { role: value })}
                  >
                    <SelectTrigger className="h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Signer 1">Signer 1</SelectItem>
                      <SelectItem value="Signer 2">Signer 2</SelectItem>
                      <SelectItem value="Witness">Witness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(selectedField.type === 'text' || selectedField.type === 'date' || selectedField.type === 'merge') && (
                  <>
                    {selectedField.type === 'merge' && (
                      <div>
                        <Label htmlFor="merge-category" className="text-sm text-gray-700">Category</Label>
                        <Select 
                          value={selectedMergeCategory} 
                          onValueChange={setSelectedMergeCategory}
                        >
                          <SelectTrigger className="h-9 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Fields</SelectItem>
                            {mergeFieldCategories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="merge-field" className="text-sm text-gray-700">
                        {selectedField.type === 'merge' ? 'Merge Field' : 'Merge Field (Optional)'}
                      </Label>
                      <Select 
                        value={selectedField.mergeField || ''} 
                        onValueChange={(value) => updateField(selectedField.id, { mergeField: value || undefined })}
                      >
                        <SelectTrigger className="h-9 mt-1">
                          <SelectValue placeholder="Select merge field" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedField.type !== 'merge' && <SelectItem value="">None</SelectItem>}
                          {availableMergeFields.map(field => (
                            <SelectItem key={field.id} value={field.name}>
                              <div className="flex flex-col">
                                <span className="font-medium">{field.label}</span>
                                <span className="text-xs text-gray-500">{field.description}</span>
                                {field.example && (
                                  <span className="text-xs text-blue-600">Example: {field.example}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="width" className="text-sm text-gray-700">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={selectedField.width}
                      onChange={(e) => updateField(selectedField.id, { width: parseInt(e.target.value) || 0 })}
                      className="h-9 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm text-gray-700">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={selectedField.height}
                      onChange={(e) => updateField(selectedField.id, { height: parseInt(e.target.value) || 0 })}
                      className="h-9 mt-1"
                    />
                  </div>
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Document Fields ({fields.length})</h3>
              {fieldHistory.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {fieldHistory.length} in history
                </Badge>
              )}
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {fields.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No fields added yet. Select a tool and click on the document to add fields.
                </p>
              ) : (
                fields.map(field => (
                  <div 
                    key={field.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedField?.id === field.id 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900 capitalize">
                        {field.type}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {field.role}
                      </Badge>
                    </div>
                    {field.mergeField && (
                      <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mt-1">
                        {field.mergeField.replace(/_/g, ' ')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <div className="bg-white rounded-lg shadow-sm border inline-block max-w-full">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-crosshair border rounded max-w-full h-auto"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
          </div>
          {selectedTool && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                <strong>{selectedTool.toUpperCase()}</strong> tool selected
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Click on the document to place the field.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentFieldEditor;

