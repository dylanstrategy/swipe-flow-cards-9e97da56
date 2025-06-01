
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { File, Image, X } from 'lucide-react';

interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'photo';
  url: string;
  size?: number;
}

interface AttachmentSectionProps {
  attachments: Attachment[];
  onAddAttachment: (attachment: Attachment) => void;
  onRemoveAttachment: (id: string) => void;
}

const AttachmentSection = ({ attachments, onAddAttachment, onRemoveAttachment }: AttachmentSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'photo') => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        url,
        size: file.size
      };
      onAddAttachment(attachment);
    });

    // Reset input
    event.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium text-gray-900">
        Attachments
      </Label>
      
      {/* Attachment Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 h-10"
        >
          <File size={16} />
          Add File
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => photoInputRef.current?.click()}
          className="flex items-center gap-2 h-10"
        >
          <Image size={16} />
          Add Photo
        </Button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
        onChange={(e) => handleFileSelect(e, 'file')}
        className="hidden"
      />
      <input
        ref={photoInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'photo')}
        className="hidden"
      />

      {/* Attachment List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {attachment.type === 'photo' ? (
                  <div className="flex items-center gap-2">
                    <Image size={20} className="text-green-600 flex-shrink-0" />
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-8 h-8 object-cover rounded border"
                    />
                  </div>
                ) : (
                  <File size={20} className="text-blue-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  {attachment.size && (
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(attachment.id)}
                className="text-gray-400 hover:text-gray-600 p-1 h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentSection;
