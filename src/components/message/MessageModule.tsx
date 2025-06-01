
import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import MessageComposer from './MessageComposer';
import MessageConfirmation from './MessageConfirmation';

interface MessageModuleProps {
  onClose: () => void;
  initialSubject?: string;
  recipientType?: 'management' | 'maintenance' | 'leasing';
  mode?: 'compose' | 'reply';
}

const MessageModule = ({ 
  onClose, 
  initialSubject = '', 
  recipientType = 'management',
  mode = 'compose'
}: MessageModuleProps) => {
  const [currentView, setCurrentView] = useState<'compose' | 'confirmation'>('compose');
  const [messageData, setMessageData] = useState({
    subject: initialSubject,
    message: '',
    recipientType
  });

  const handleSendMessage = (subject: string, message: string) => {
    setMessageData({ subject, message, recipientType });
    setCurrentView('confirmation');
  };

  const handleDone = () => {
    onClose();
  };

  const getRecipientTitle = () => {
    switch (recipientType) {
      case 'management':
        return 'Contact Management';
      case 'maintenance':
        return 'Contact Maintenance';
      case 'leasing':
        return 'Contact Leasing Office';
      default:
        return 'Send Message';
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {getRecipientTitle()}
        </h1>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {currentView === 'compose' ? (
          <MessageComposer
            initialSubject={messageData.subject}
            onSend={handleSendMessage}
            recipientType={recipientType}
          />
        ) : (
          <MessageConfirmation
            subject={messageData.subject}
            message={messageData.message}
            recipientType={recipientType}
            onDone={handleDone}
          />
        )}
      </div>
    </div>
  );
};

export default MessageModule;
