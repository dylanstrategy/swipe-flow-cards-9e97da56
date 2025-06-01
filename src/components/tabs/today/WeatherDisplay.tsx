
import React from 'react';
import { CloudSun } from 'lucide-react';

interface WeatherDisplayProps {
  weather: {
    temp: number;
    condition: string;
  };
}

const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <CloudSun size={16} className="text-blue-600" />
      <span>{weather.temp}°F • {weather.condition}</span>
    </div>
  );
};

export default WeatherDisplay;
