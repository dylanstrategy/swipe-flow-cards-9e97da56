
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface MessageComposerProps {
  initialSubject: string;
  onSend: (subject: string, message: string) => void;
  recipientType: 'management' | 'maintenance' | 'leasing';
}

const MessageComposer = ({ initialSubject, onSend, recipientType }: MessageComposerProps) => {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (subject.trim() && message.trim()) {
      onSend(subject.trim(), message.trim());
    }
  };

  const getPlaceholderText = () => {
    switch (recipientType) {
      case 'maintenance':
        return 'Describe the maintenance issue or request...';
      case 'leasing':
        return 'What can we help you with regarding your lease?';
      default:
        return 'Type your message here...';
    }
  };

  const isFormValid = subject.trim() !== '' && message.trim() !== '';

  return (
    <div className="flex-1 flex flex-col">
      {/* Form Fields */}
      <div className="space-y-6 flex-1 mb-4">
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-base font-medium text-gray-900">
            Subject
          </Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="text-base p-4 h-12"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <Label htmlFor="message" className="text-base font-medium text-gray-900">
            Message
          </Label>
          <Textarea
            ref={textareaRef}
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getPlaceholderText()}
            className="flex-1 min-h-[200px] text-base p-4 resize-none"
          />
        </div>
      </div>

      {/* Swipe Instruction */}
      {isFormValid && (
        <div className="py-4 text-center text-gray-500 text-sm border-t border-gray-100">
          <p>Swipe up to send your message</p>
          <div className="mt-2 text-xs flex items-center justify-center gap-1">
            <span className="text-gray-400">↑</span>
            <span>Send message</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComposer;
