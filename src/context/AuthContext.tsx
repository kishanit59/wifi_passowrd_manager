import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { storage, LocalUser } from '../lib/storage';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: LocalUser | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LocalUser | null>(null);
    const [loading, setLoading] = useState(true);
    const hasShownInitialToast = useRef(false);

    useEffect(() => {
        const session = storage.getSession();
        setUser(session);
        setLoading(false);
    }, []);

    const signUp = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const users = storage.getUsers();

            if (users.find(u => u.email === email)) {
                throw new Error('User already exists');
            }

            const newUser: LocalUser = {
                id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2),
                email,
                password
            };

            storage.saveUser(newUser);

            toast.success('Account created successfully! Please sign in.');
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Failed to create account');
            console.error('Error signing up:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const users = storage.getUsers();
            const foundUser = users.find(u => u.email === email && u.password === password);

            if (!foundUser) {
                throw new Error('Invalid email or password');
            }

            const { password: _, ...userWithoutPassword } = foundUser;
            storage.setSession(userWithoutPassword);
            setUser(userWithoutPassword);

            if (!hasShownInitialToast.current) {
                toast.success('Successfully signed in!');
                hasShownInitialToast.current = true;
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in');
            console.error('Error signing in:', error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            storage.setSession(null);
            setUser(null);
            toast.success('Successfully signed out!');
        } catch (error) {
            toast.error('Failed to sign out');
            console.error('Error signing out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
