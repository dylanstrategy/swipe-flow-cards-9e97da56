
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, File, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadModalProps {
  onClose: () => void;
  onComplete: () => void;
  taskTitle: string;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

const FileUploadModal = ({ onClose, onComplete, taskTitle, acceptedFileTypes = ".pdf,.jpg,.png", maxSizeMB = 10 }: FileUploadModalProps) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const validFiles = files.filter(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than ${maxSizeMB}MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
      onComplete();
      toast({
        title: "Files uploaded successfully",
        description: `${uploadedFiles.length} file(s) uploaded for ${taskTitle}`,
      });
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{taskTitle}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Accepted: {acceptedFileTypes} (max {maxSizeMB}MB)
            </p>
            <input
              type="file"
              multiple
              accept={acceptedFileTypes}
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Selected Files:</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={uploading || uploadedFiles.length === 0}
            className="w-full"
          >
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
