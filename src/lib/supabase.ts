import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://ahsrpefquqowmnzkfyvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoc3JwZWZxdXFvd21uemtmeXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTk2NDYsImV4cCI6MjA2Njg3NTY0Nn0.Ajs-oyZ6ZLhowyk7RjawMzhmvwLzYMSVpfehm7fAJ_E';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };