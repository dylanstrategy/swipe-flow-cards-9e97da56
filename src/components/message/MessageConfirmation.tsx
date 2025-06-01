
import React from 'react';
import { format, addHours } from 'date-fns';

interface MessageConfirmationProps {
  subject: string;
  message: string;
  recipientType: 'management' | 'maintenance' | 'leasing';
  onDone: () => void;
}

const MessageConfirmation = ({ subject, message, recipientType, onDone }: MessageConfirmationProps) => {
  // Simulate finding next available slot based on recipient type
  const getResponseTime = () => {
    const now = new Date();
    let hoursToAdd = 2; // Default 2 hours
    
    switch (recipientType) {
      case 'maintenance':
        hoursToAdd = 4; // Maintenance typically responds in 4 hours
        break;
      case 'leasing':
        hoursToAdd = 1; // Leasing office responds quickly (1 hour)
        break;
      case 'management':
      default:
        hoursToAdd = 2; // Management responds in 2 hours
        break;
    }
    
    // Add some randomness to make it more realistic
    const randomMinutes = Math.floor(Math.random() * 60);
    return addHours(now, hoursToAdd).getTime() + (randomMinutes * 60 * 1000);
  };

  const expectedResponseTime = new Date(getResponseTime());
  const timeString = format(expectedResponseTime, 'h:mm a');
  const dayString = format(expectedResponseTime, 'EEEE, MMMM d');

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Success Message */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900">
            Message received
          </h2>
          
          <p className="text-gray-600 text-lg">
            We'll respond shortly—check your calendar for updates.
          </p>
        </div>

        {/* Response Time Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {dayString}
          </h3>
          
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-gray-900 font-medium">
              Response expected by {timeString}
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onDone}
          className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default MessageConfirmation;
