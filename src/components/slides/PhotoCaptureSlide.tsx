
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import FormSlide from './FormSlide';

interface PhotoCaptureSlideProps {
  title: string;
  subtitle?: string;
  capturedPhoto: string;
  setCapturedPhoto: (photo: string) => void;
  allowMultiple?: boolean;
  capturedPhotos?: string[];
  setCapturedPhotos?: (photos: string[]) => void;
}

const PhotoCaptureSlide = ({ 
  title, 
  subtitle, 
  capturedPhoto, 
  setCapturedPhoto,
  allowMultiple = false,
  capturedPhotos = [],
  setCapturedPhotos
}: PhotoCaptureSlideProps) => {
  const canProceed = allowMultiple ? capturedPhotos.length > 0 : capturedPhoto !== '';

  const handleCapture = () => {
    if (allowMultiple && setCapturedPhotos) {
      setCapturedPhotos([...capturedPhotos, 'captured']);
    } else {
      setCapturedPhoto('captured');
    }
  };

  const handleRetake = (index?: number) => {
    if (allowMultiple && setCapturedPhotos && index !== undefined) {
      const newPhotos = capturedPhotos.filter((_, i) => i !== index);
      setCapturedPhotos(newPhotos);
    } else {
      setCapturedPhoto('');
    }
  };

  return (
    <FormSlide 
      title={title} 
      subtitle={subtitle} 
      icon={<Camera className="text-blue-600" size={28} />}
      canProceed={canProceed}
    >
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md px-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 min-h-[280px] flex flex-col items-center justify-center">
            {canProceed ? (
              <div className="space-y-4 w-full">
                {allowMultiple ? (
                  <>
                    {capturedPhotos.map((_, index) => (
                      <div key={index} className="w-full h-24 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-200 animate-scale-in">
                        <span className="text-green-600 font-medium">📸 Photo {index + 1} Captured</span>
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <Button onClick={handleCapture} className="flex-1 h-11">
                        Add Another Photo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRetake(capturedPhotos.length - 1)}
                        className="h-11"
                      >
                        Remove Last
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-200 mb-4 animate-scale-in">
                      <span className="text-green-600 font-medium text-lg">📸 Photo Captured</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleRetake()}
                      className="w-full h-11"
                    >
                      Retake Photo
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-gray-600 font-medium">
                    {allowMultiple ? 'Capture Photos' : 'Capture Photo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Take a clear photo of the issue
                  </p>
                </div>
                <Button onClick={handleCapture} className="w-full h-11 text-base">
                  {allowMultiple ? 'Capture Photos' : 'Capture Photo'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormSlide>
  );
};

export default PhotoCaptureSlide;
