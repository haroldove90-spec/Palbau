import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

import { User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

type UserContextType = {
  users: UserProfile[];
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  fetchUsers: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  registerUser: (email: string, fullName: string, role: string, password?: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<UserProfile>) => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    fetchUsers();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const registerUser = async (email: string, fullName: string, role: string, password?: string) => {
    try {
      // Si se proporciona contraseña, intentamos crear el usuario en Auth primero
      if (password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role
            }
          }
        });
        
        if (authError) throw authError;
        
        // El trigger de Supabase debería crear el perfil automáticamente, 
        // pero si no existe, lo insertamos manualmente
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([{ 
              id: authData.user.id,
              email, 
              full_name: fullName, 
              role
            }]);
          if (profileError) console.warn('Profile might already exist via trigger:', profileError);
        }
      } else {
        // Registro simple solo en la tabla profiles (legacy/fallback)
        const { error } = await supabase
          .from('profiles')
          .insert([{ 
            email, 
            full_name: fullName, 
            role,
            id: crypto.randomUUID()
          }]);
        if (error) throw error;
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <UserContext.Provider value={{ 
      users, 
      currentUser, 
      profile, 
      loading, 
      isAdmin, 
      fetchUsers, 
      fetchProfile,
      registerUser, 
      updateUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};
