
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SwipeCard from '../SwipeCard';

interface MessageComposerProps {
  initialSubject: string;
  onSend: (subject: string, message: string) => void;
  recipientType: 'management' | 'maintenance' | 'leasing';
}

const MessageComposer = ({ initialSubject, onSend, recipientType }: MessageComposerProps) => {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
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

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Form Fields */}
      <div className="space-y-6 flex-1">
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

      {/* Send Action Card */}
      <div className="mt-6">
        <SwipeCard
          onSwipeUp={{
            label: "Send",
            action: handleSend,
            color: "#000000",
            icon: "↑"
          }}
          enableSwipeUp={true}
          className="mb-4"
        >
          <div className="bg-black text-white p-6 rounded-xl text-center">
            <div className="text-xl font-semibold mb-2">Ready to Send</div>
            <div className="text-gray-300 text-sm">
              Swipe up to send your message
            </div>
            <div className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-2">
              <span>↑</span>
              <span>Send</span>
            </div>
          </div>
        </SwipeCard>
      </div>
    </div>
  );
};

export default MessageComposer;
