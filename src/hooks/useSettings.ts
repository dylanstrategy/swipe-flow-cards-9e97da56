
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SettingsData {
  [key: string]: any;
}

export const useSettings = (settingType: 'privacy' | 'notifications' | 'identity') => {
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load settings from Supabase
  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If no user, try to load from localStorage as fallback
        const localData = localStorage.getItem(`resident${settingType.charAt(0).toUpperCase() + settingType.slice(1)}`);
        if (localData) {
          setSettings(JSON.parse(localData));
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .eq('setting_type', settingType)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading settings:', error);
        toast({
          title: "Error loading settings",
          description: "Using local settings as fallback.",
          duration: 3000,
        });
        // Fallback to localStorage
        const localData = localStorage.getItem(`resident${settingType.charAt(0).toUpperCase() + settingType.slice(1)}`);
        if (localData) {
          setSettings(JSON.parse(localData));
        }
      } else if (data) {
        setSettings(data.settings);
        // Also save to localStorage as backup
        localStorage.setItem(`resident${settingType.charAt(0).toUpperCase() + settingType.slice(1)}`, JSON.stringify(data.settings));
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(`resident${settingType.charAt(0).toUpperCase() + settingType.slice(1)}`);
      if (localData) {
        setSettings(JSON.parse(localData));
      }
    }
    setLoading(false);
  };

  // Save settings to Supabase
  const saveSettings = async (newSettings: SettingsData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Always save to localStorage immediately for instant UI updates
      localStorage.setItem(`resident${settingType.charAt(0).toUpperCase() + settingType.slice(1)}`, JSON.stringify(newSettings));
      setSettings(newSettings);

      // Trigger storage event for other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: `resident${settingType.charAt(0).toUpperCase() + settingType.slice(1)}`,
        newValue: JSON.stringify(newSettings),
        oldValue: localStorage.getItem(`resident${settingType.charAt(0).toUpperCase() + settingType.slice(1)}`)
      }));

      if (!user) {
        console.log('No user logged in, settings saved locally only');
        return;
      }

      // Save to Supabase for persistence
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          setting_type: settingType,
          settings: newSettings
        });

      if (error) {
        console.error('Error saving settings to database:', error);
        toast({
          title: "Settings saved locally",
          description: "Could not sync to cloud, but changes are saved on this device.",
          duration: 3000,
        });
      } else {
        console.log('Settings successfully saved to database');
      }
    } catch (error) {
      console.error('Error in saveSettings:', error);
      toast({
        title: "Settings saved locally",
        description: "Could not sync to cloud, but changes are saved on this device.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    loadSettings();
  }, [settingType]);

  return {
    settings,
    setSettings,
    saveSettings,
    loading
  };
};
