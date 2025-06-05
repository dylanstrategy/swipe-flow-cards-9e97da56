
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeSyncOptions {
  tables: string[];
  onDataChange?: (table: string, event: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) => void;
  enabled?: boolean;
}

export function useRealtimeSync({ tables, onDataChange, enabled = true }: RealtimeSyncOptions) {
  const channelRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled || !tables.length) return;

    // Create a unique channel name based on tables
    const channelName = `realtime-sync-${tables.join('-')}`;
    
    const channel = supabase.channel(channelName);

    // Subscribe to changes for each table
    tables.forEach(table => {
      channel
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table }, 
          (payload) => {
            console.log(`Real-time INSERT on ${table}:`, payload);
            onDataChange?.(table, 'INSERT', payload);
          }
        )
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table }, 
          (payload) => {
            console.log(`Real-time UPDATE on ${table}:`, payload);
            onDataChange?.(table, 'UPDATE', payload);
          }
        )
        .on('postgres_changes', 
          { event: 'DELETE', schema: 'public', table }, 
          (payload) => {
            console.log(`Real-time DELETE on ${table}:`, payload);
            onDataChange?.(table, 'DELETE', payload);
          }
        );
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Real-time subscribed to tables: ${tables.join(', ')}`);
      } else if (status === 'CHANNEL_ERROR') {
        toast({
          title: "Connection Issue",
          description: "Real-time updates temporarily unavailable",
          variant: "destructive",
        });
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [tables.join(','), enabled]); // Fix dependencies

  const disconnect = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };

  return { disconnect };
}
