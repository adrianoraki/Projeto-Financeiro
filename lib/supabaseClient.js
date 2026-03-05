import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vqhwhflqgfwffhcgmctk.supabase.co';
// ATENÇÃO: A chave abaixo parece estar incorreta. 
// A chave anônima (anon key) do Supabase é um token JWT longo.
// Substitua pela sua chave correta encontrada no painel do seu projeto Supabase.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxaHdoZmxxZ2Z3ZmZoY2dtY3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4MDI0NjQsImV4cCI6MjAzMTM3ODQ2NH0.6924s6p2b_gS4r3i2i-3Wj_oEw3n_3A9s-O8a8zG0G0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Impede o Supabase de usar o localStorage no lado do servidor,
    // o que causava a falha na renderização do Next.js.
    persistSession: typeof window !== 'undefined'
  }
});
