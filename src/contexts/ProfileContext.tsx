
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LifestyleTag {
  id: string;
  label: string;
  emoji: string;
}

interface ProfileData {
  lifestyleTags: string[];
  selectedLifestyleTags: LifestyleTag[];
  pets: Array<{ name: string; type: string; breed: string }>;
}

interface ProfileContextType {
  profile: ProfileData;
  updateLifestyleTags: (tags: string[]) => void;
  updatePets: (pets: Array<{ name: string; type: string; breed: string }>) => void;
  getPersonalizedContext: () => 'pet-service' | 'message' | 'appointment' | 'event' | 'work-order' | 'service' | 'document' | 'moving-service' | 'home-setup';
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>({
    lifestyleTags: [],
    selectedLifestyleTags: [],
    pets: [
      { name: 'Luna', type: 'dog', breed: 'Golden Retriever' },
      { name: 'Whiskers', type: 'cat', breed: 'Maine Coon' }
    ]
  });

  const lifestyleTagsMap = {
    'pets': { id: 'pets', label: 'Has space for pets', emoji: '🐾' },
    'foodAndDrinks': { id: 'foodAndDrinks', label: 'Walkable to great food & drinks', emoji: '🍽️' },
    'nature': { id: 'nature', label: 'Close to nature or green space', emoji: '🌿' },
    'calm': { id: 'calm', label: 'Feels calm and quiet', emoji: '🛋️' },
    'wifi': { id: 'wifi', label: 'Fast Wi-Fi for work or play', emoji: '📶' },
    'hosting': { id: 'hosting', label: 'Easy to host friends', emoji: '🎉' },
    'creativity': { id: 'creativity', label: 'Inspires creativity', emoji: '🎨' },
    'wellness': { id: 'wellness', label: 'Has wellness or fitness options', emoji: '🧘' },
    'maintenance': { id: 'maintenance', label: 'Worry-free maintenance', emoji: '🛠️' },
    'central': { id: 'central', label: 'In the middle of it all', emoji: '🏙️' },
    'private': { id: 'private', label: 'Cozy and private', emoji: '🛏️' },
    'community': { id: 'community', label: 'Has a sense of community', emoji: '🧑‍🤝‍🧑' },
    'soundproofing': { id: 'soundproofing', label: 'Good soundproofing for music or calls', emoji: '🎧' },
    'budget': { id: 'budget', label: 'Fits my budget comfortably', emoji: '💸' },
    'design': { id: 'design', label: 'Beautifully designed spaces', emoji: '✨' },
    'accessible': { id: 'accessible', label: 'Easy to get around / accessible', emoji: '♿' }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const discoveryData = localStorage.getItem('userPreferences');
    
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(prev => ({ ...prev, ...parsed }));
    } else if (discoveryData) {
      // Migrate from discovery data
      const parsed = JSON.parse(discoveryData);
      if (parsed.lifestyleTags) {
        updateLifestyleTags(parsed.lifestyleTags);
      }
    }
  }, []);

  const updateLifestyleTags = (tags: string[]) => {
    const selectedTags = tags.map(tagId => lifestyleTagsMap[tagId]).filter(Boolean);
    const updatedProfile = {
      ...profile,
      lifestyleTags: tags,
      selectedLifestyleTags: selectedTags
    };
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const updatePets = (pets: Array<{ name: string; type: string; breed: string }>) => {
    const updatedProfile = { ...profile, pets };
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const getPersonalizedContext = (): 'pet-service' | 'message' | 'appointment' | 'event' | 'work-order' | 'service' | 'document' | 'moving-service' | 'home-setup' => {
    const { lifestyleTags, pets } = profile;
    
    if (pets.length > 0) return 'pet-service';
    if (lifestyleTags.includes('foodAndDrinks')) return 'message';
    if (lifestyleTags.includes('wellness')) return 'appointment';
    if (lifestyleTags.includes('hosting')) return 'event';
    if (lifestyleTags.includes('maintenance')) return 'work-order';
    if (lifestyleTags.includes('community')) return 'event';
    
    return 'message';
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      updateLifestyleTags,
      updatePets,
      getPersonalizedContext
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
