import { useState, useEffect, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const previousUserRef = useRef<User | null>(null)
  const hasShownInitialToast = useRef(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      if (!supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      previousUserRef.current = session?.user ?? null
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null
        const previousUser = previousUserRef.current

        // Only update state if user actually changed
        if (newUser?.id !== previousUser?.id) {
          setUser(newUser)
          previousUserRef.current = newUser

          // Show toast only for actual state changes, not initial load
          if (!loading && hasShownInitialToast.current) {
            if (event === 'SIGNED_IN' && newUser && !previousUser) {
              toast.success('Successfully signed in!')
            } else if (event === 'SIGNED_OUT' && !newUser && previousUser) {
              toast.success('Successfully signed out!')
            }
          }

          hasShownInitialToast.current = true
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [loading])

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      toast.error('Supabase not configured')
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      })
      if (error) throw error
      toast.success('Account created successfully! Please check your email to verify your account.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
      console.error('Error signing up:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      toast.error('Supabase not configured')
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      console.error('Error signing in:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!supabase) return
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      toast.error('Failed to sign out')
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }
}