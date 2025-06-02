
import React from 'react';
import { Button } from '@/components/ui/button';
import FormSlide from './FormSlide';

interface SelectionOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface SelectionSlideProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  options: SelectionOption[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  multiSelect?: boolean;
  selectedValues?: string[];
  setSelectedValues?: (values: string[]) => void;
}

const SelectionSlide = ({ 
  title, 
  subtitle, 
  icon, 
  options, 
  selectedValue, 
  setSelectedValue,
  multiSelect = false,
  selectedValues = [],
  setSelectedValues
}: SelectionSlideProps) => {
  const canProceed = multiSelect ? selectedValues.length > 0 : selectedValue !== '';

  const handleSelection = (value: string) => {
    if (multiSelect && setSelectedValues) {
      if (selectedValues.includes(value)) {
        setSelectedValues(selectedValues.filter(v => v !== value));
      } else {
        setSelectedValues([...selectedValues, value]);
      }
    } else {
      setSelectedValue(value);
    }
  };

  const isSelected = (value: string) => {
    return multiSelect ? selectedValues.includes(value) : selectedValue === value;
  };

  return (
    <FormSlide 
      title={title} 
      subtitle={subtitle} 
      icon={icon}
      canProceed={canProceed}
    >
      <div className="space-y-4">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={isSelected(option.value) ? 'default' : 'outline'}
            onClick={() => handleSelection(option.value)}
            className="w-full h-auto p-6 flex flex-col items-center text-center min-h-[80px] space-y-2"
          >
            {option.icon && <span className="text-3xl">{option.icon}</span>}
            <div className="space-y-1">
              <span className="font-semibold text-base">{option.label}</span>
              {option.description && (
                <span className="text-sm opacity-80 block">{option.description}</span>
              )}
            </div>
          </Button>
        ))}
      </div>
    </FormSlide>
  );
};

export default SelectionSlide;
