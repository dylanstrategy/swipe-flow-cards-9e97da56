
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AttachmentSection from './AttachmentSection';

interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'photo';
  url: string;
  size?: number;
}

interface MessageComposerProps {
  initialSubject: string;
  onSend: (subject: string, message: string, attachments: Attachment[]) => void;
  recipientType: 'management' | 'maintenance' | 'leasing';
  messageData: {
    subject: string;
    message: string;
    recipientType: string;
    attachments?: Attachment[];
  };
  setMessageData: (data: any) => void;
}

const MessageComposer = ({ initialSubject, onSend, recipientType, messageData, setMessageData }: MessageComposerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>(messageData.attachments || []);

  const handleSubjectChange = (value: string) => {
    setMessageData({ ...messageData, subject: value });
  };

  const handleMessageChange = (value: string) => {
    setMessageData({ ...messageData, message: value });
  };

  const handleAddAttachment = (attachment: Attachment) => {
    const newAttachments = [...attachments, attachment];
    setAttachments(newAttachments);
    setMessageData({ ...messageData, attachments: newAttachments });
  };

  const handleRemoveAttachment = (id: string) => {
    const newAttachments = attachments.filter(att => att.id !== id);
    setAttachments(newAttachments);
    setMessageData({ ...messageData, attachments: newAttachments });
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

  const isFormValid = messageData.subject.trim() !== '' && messageData.message.trim() !== '';

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
            value={messageData.subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
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
            value={messageData.message}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder={getPlaceholderText()}
            className="flex-1 min-h-[150px] text-base p-4 resize-none"
          />
        </div>

        <AttachmentSection
          attachments={attachments}
          onAddAttachment={handleAddAttachment}
          onRemoveAttachment={handleRemoveAttachment}
        />
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
