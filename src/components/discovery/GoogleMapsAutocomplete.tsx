
import React from 'react';
import { Input } from '@/components/ui/input';

interface GoogleMapsAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const GoogleMapsAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Enter your address",
  className 
}: GoogleMapsAutocompleteProps) => {
  // For now, just use a regular input with mock address suggestions
  const mockAddresses = [
    "123 Wall Street, New York, NY 10005",
    "456 Broadway, New York, NY 10013",
    "789 Fifth Avenue, New York, NY 10022",
    "321 Park Avenue, New York, NY 10010"
  ];

  // Set default value to mock address if empty
  React.useEffect(() => {
    if (!value) {
      onChange("123 Wall Street, New York, NY 10005");
    }
  }, [value, onChange]);

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
      
      {/* Show mock suggestions when input is focused and empty/short */}
      {value.length < 3 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
          {mockAddresses.map((address, index) => (
            <button
              key={index}
              onClick={() => onChange(address)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
            >
              {address}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleMapsAutocomplete;
