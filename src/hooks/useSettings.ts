
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type SettingsType = 'identity' | 'notifications' | 'privacy' | 'payment';

interface SettingsHook {
  settings: any;
  saveSettings: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useSettings = (settingType: SettingsType): SettingsHook => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage or database
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try to load from localStorage first (for immediate access)
        const localStorageKey = `${user.id}_${settingType}_settings`;
        const localSettings = localStorage.getItem(localStorageKey);
        
        if (localSettings) {
          setSettings(JSON.parse(localSettings));
        }

        // Then load from database (for persistence across devices)
        const { data, error: dbError } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', user.id)
          .eq('setting_type', settingType)
          .single();

        if (dbError && dbError.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error loading settings from database:', dbError);
          setError(dbError.message);
        } else if (data) {
          setSettings(data.settings || {});
          // Update localStorage with database data
          localStorage.setItem(localStorageKey, JSON.stringify(data.settings || {}));
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user, settingType]);

  const saveSettings = async (data: any) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      
      // Save to localStorage immediately
      const localStorageKey = `${user.id}_${settingType}_settings`;
      localStorage.setItem(localStorageKey, JSON.stringify(data));
      setSettings(data);

      // Save to database for persistence
      const { error: dbError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          setting_type: settingType,
          settings: data,
          updated_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error saving settings to database:', dbError);
        setError(dbError.message);
        throw dbError;
      }

      console.log(`Successfully saved ${settingType} settings`);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    settings,
    saveSettings,
    loading,
    error
  };
};
