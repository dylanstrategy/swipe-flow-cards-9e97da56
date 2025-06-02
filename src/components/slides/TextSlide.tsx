
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FormSlide from './FormSlide';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
}

interface TextSlideProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  fields: TextFieldProps[];
  canProceed?: boolean;
}

const TextSlide = ({ title, subtitle, icon, fields, canProceed }: TextSlideProps) => {
  return (
    <FormSlide 
      title={title} 
      subtitle={subtitle} 
      icon={icon}
      canProceed={canProceed}
    >
      {/* Compact content wrapper */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto">
        {fields.map((field, index) => (
          <div key={index}>
            <Label htmlFor={`field-${index}`} className="block text-xs font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={`field-${index}`}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="w-full min-h-[60px] max-h-[100px] text-sm"
                rows={2}
                style={{ fontSize: '16px' }} // Prevent zoom on iOS
              />
            ) : (
              <Input
                id={`field-${index}`}
                type={field.type || 'text'}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="w-full h-10 text-sm"
                style={{ fontSize: '16px' }} // Prevent zoom on iOS
              />
            )}
          </div>
        ))}
      </div>
    </FormSlide>
  );
};

export default TextSlide;
