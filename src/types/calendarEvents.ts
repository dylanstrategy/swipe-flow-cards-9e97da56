
export interface CalendarEvent {
  id: number | string;
  date: Date;
  time: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: string;
  isDroppedSuggestion: boolean;
  rescheduledCount: number;
  building?: string;
  unit?: string;
  dueDate?: Date;
  image?: string;
  originalSuggestionId?: number;
  status?: string;
}
