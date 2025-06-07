
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Pet {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed?: string;
  age?: number;
  image?: string;
}

interface LifestyleTag {
  id: string;
  label: string;
  emoji: string;
  category: 'fitness' | 'food' | 'entertainment' | 'lifestyle';
}

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  unit: string;
  building: string;
  pets: Pet[];
  selectedLifestyleTags: LifestyleTag[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: boolean;
    marketing: boolean;
    maintenance: boolean;
  };
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  addPet: (pet: Omit<Pet, 'id'>) => void;
  removePet: (petId: number) => void;
  toggleLifestyleTag: (tag: LifestyleTag) => void;
  getPersonalizedContext: () => string;
}

const defaultProfile: Profile = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@email.com',
  phone: '(555) 123-4567',
  unit: '204A',
  building: 'Building A',
  pets: [
    {
      id: 1,
      name: 'Max',
      type: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'
    }
  ],
  selectedLifestyleTags: [
    { id: 'fitness', label: 'Fitness Enthusiast', emoji: '💪', category: 'fitness' },
    { id: 'foodie', label: 'Foodie', emoji: '🍕', category: 'food' }
  ],
  emergencyContact: {
    name: 'Mike Johnson',
    phone: '(555) 987-6543',
    relationship: 'Spouse'
  },
  preferences: {
    notifications: true,
    marketing: false,
    maintenance: true
  }
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addPet = (pet: Omit<Pet, 'id'>) => {
    const newPet = { ...pet, id: Date.now() };
    setProfile(prev => ({ ...prev, pets: [...prev.pets, newPet] }));
  };

  const removePet = (petId: number) => {
    setProfile(prev => ({ ...prev, pets: prev.pets.filter(pet => pet.id !== petId) }));
  };

  const toggleLifestyleTag = (tag: LifestyleTag) => {
    setProfile(prev => {
      const exists = prev.selectedLifestyleTags.find(t => t.id === tag.id);
      if (exists) {
        return {
          ...prev,
          selectedLifestyleTags: prev.selectedLifestyleTags.filter(t => t.id !== tag.id)
        };
      } else {
        return {
          ...prev,
          selectedLifestyleTags: [...prev.selectedLifestyleTags, tag]
        };
      }
    });
  };

  const getPersonalizedContext = () => {
    if (profile.pets.length > 0) {
      return 'pet-service';
    }
    if (profile.selectedLifestyleTags.length > 0) {
      return profile.selectedLifestyleTags[0].category;
    }
    return 'general';
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      updateProfile,
      addPet,
      removePet,
      toggleLifestyleTag,
      getPersonalizedContext
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
