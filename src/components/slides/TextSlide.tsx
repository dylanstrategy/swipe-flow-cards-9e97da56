
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
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`field-${index}`} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={`field-${index}`}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="w-full min-h-[100px] resize-none"
                rows={4}
              />
            ) : (
              <Input
                id={`field-${index}`}
                type={field.type || 'text'}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="w-full h-12"
              />
            )}
          </div>
        ))}
      </div>
    </FormSlide>
  );
};

export default TextSlide;
