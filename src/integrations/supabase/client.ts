
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://msujdvczbmnhkfpjikwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdWpkdmN6Ym1uaGtmcGppa3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMDIyNDgsImV4cCI6MjA2NDY3ODI0OH0.ONtSG1Hyd5nwUPb_MbFdQWrL9ATrAvJIl_X8HS_9cOk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
