
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Settings } from 'lucide-react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    // Check if API key is stored
    const storedApiKey = localStorage.getItem('googleMapsApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      loadGoogleMaps(storedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const loadGoogleMaps = (key: string) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeAutocomplete();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
      initializeAutocomplete();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    document.head.appendChild(script);
  };

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      }
    );

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('googleMapsApiKey', apiKey.trim());
      setShowApiKeyInput(false);
      loadGoogleMaps(apiKey.trim());
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('googleMapsApiKey');
    setApiKey('');
    setShowApiKeyInput(true);
    setIsLoaded(false);
  };

  if (showApiKeyInput) {
    return (
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700">
          <MapPin className="w-5 h-5" />
          <h3 className="font-semibold">Google Maps API Key Required</h3>
        </div>
        <p className="text-sm text-blue-600">
          To enable address autocomplete, please enter your Google Maps API key.
          You can get one from the Google Cloud Console.
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter Google Maps API Key"
            className="flex-1"
          />
          <Button onClick={handleApiKeySubmit} size="sm">
            Save
          </Button>
        </div>
        <a 
          href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Get Google Maps API Key →
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearApiKey}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
        title="Change API Key"
      >
        <Settings className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default GoogleMapsAutocomplete;
