
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
      {/* Content wrapper with controlled spacing and max height */}
      <div className="max-h-[400px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {options.map((option) => (
            <Button
              key={option.value}
              variant={isSelected(option.value) ? 'default' : 'outline'}
              onClick={() => handleSelection(option.value)}
              className="h-auto p-4 flex flex-col items-center text-center min-h-[60px]"
            >
              {option.icon && <span className="text-2xl mb-2">{option.icon}</span>}
              <span className="font-medium">{option.label}</span>
              {option.description && (
                <span className="text-sm text-gray-500 mt-1">{option.description}</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </FormSlide>
  );
};

export default SelectionSlide;
