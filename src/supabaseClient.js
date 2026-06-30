import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jonvkyvufcbiqdgsjhja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbnZreXZ1ZmNiaXFkZ3NqaGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTcwNjUsImV4cCI6MjA5ODM5MzA2NX0.5COjk0j25rCWLNG9qi8k3bG41lqR-CYM6335HJfnwqY'; 
// Dhyan dein: Upar line ke end me humne single quote (') aur semicolon (;) laga kar string close kar di hai.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);