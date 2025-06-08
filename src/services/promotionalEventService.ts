
import { createPromotionalEvents } from '@/data/testEvents';

export const generatePromotionalEventsForProfile = (profile: any) => {
  // Extract lifestyle tags from profile
  const lifestyleTags = profile.lifestyleTags || [];
  
  // Also check selectedLifestyleTags for compatibility
  const selectedTags = profile.selectedLifestyleTags?.map((tag: any) => {
    if (tag.category === 'fitness') return 'wellness';
    if (tag.category === 'food') return 'foodAndDrinks';
    if (tag.label?.includes('Creative') || tag.label?.includes('Art')) return 'creativity';
    return tag.id;
  }) || [];

  // Combine both sources of lifestyle data
  const allTags = [...new Set([...lifestyleTags, ...selectedTags])];
  
  console.log('Generating promotional events for lifestyle tags:', allTags);
  
  return createPromotionalEvents(allTags);
};

export const handlePromoEventAction = (event: any, action: 'view' | 'redeem' | 'schedule') => {
  console.log(`Handling promo event action: ${action} for event:`, event);
  
  switch (action) {
    case 'view':
      return {
        modalType: 'promotional',
        event: event
      };
    
    case 'redeem':
      return {
        modalType: 'redeem',
        event: {
          ...event,
          metadata: {
            ...event.metadata,
            isRedeemed: true,
            redeemedAt: new Date()
          }
        }
      };
    
    case 'schedule':
      return {
        modalType: 'schedule',
        event: event
      };
    
    default:
      return { modalType: 'view', event: event };
  }
};
