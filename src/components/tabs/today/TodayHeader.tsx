
import React from 'react';
import { Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import WeatherDisplay from './WeatherDisplay';

interface TodayHeaderProps {
  selectedDate: Date;
  weather: {
    temp: number;
    condition: string;
  };
  onTimelineClick: () => void;
}

const TodayHeader = ({ selectedDate, weather, onTimelineClick }: TodayHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'EEEE')}
            </h1>
            <WeatherDisplay weather={weather} />
          </div>
          <p className="text-gray-600">Good morning, John!</p>
        </div>
      </div>
      <button
        onClick={onTimelineClick}
        className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
        title="View Resident Timeline"
      >
        <Clock className="text-white" size={20} />
      </button>
    </div>
  );
};

export default TodayHeader;
