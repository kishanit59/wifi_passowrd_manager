import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      wifi_networks: {
        Row: {
          id: string
          user_id: string
          network_name: string
          encrypted_password: string
          location: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          network_name: string
          encrypted_password: string
          location?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          network_name?: string
          encrypted_password?: string
          location?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}