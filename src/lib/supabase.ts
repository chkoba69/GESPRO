import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://qfdwuivfdpexxxxbuofa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZHd1aXZmZHBleHh4eGJ1b2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTAwNjAsImV4cCI6MjA1NjYyNjA2MH0.hxjx9EmQb4A2qsQaQ0DnEfInIp02dMPJ4BBGF27P5vA';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database operations
export const db = {
  select: async (table: string) => {
    const { data, error } = await supabase
      .from(table)
      .select();
    
    if (error) throw error;
    return data || [];
  },
  
  insert: async (table: string, data: any) => {
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return insertedData?.[0] || null;
  },
  
  update: async (table: string, id: string, data: any) => {
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return updatedData?.[0] || null;
  },
  
  delete: async (table: string, id: string) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};