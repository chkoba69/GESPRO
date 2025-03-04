import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database operations
export const db = {
  select: async (table: string) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  insert: async (table: string, data: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (table: string, id: string, data: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
};