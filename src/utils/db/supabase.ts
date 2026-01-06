import { Database } from '@appTypes/database.types';
import { createClient } from '@supabase/supabase-js';

export const SupabaseClient = createClient<Database>('https://qhgobczolsgloishqacj.supabase.co', 'sb_publishable_FVJM7Tbupdc-ITBonk4BPA_6jhMk98i');
