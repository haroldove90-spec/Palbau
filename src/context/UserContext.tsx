import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

type UserContextType = {
  users: UserProfile[];
  fetchUsers: () => Promise<void>;
  registerUser: (email: string, fullName: string, role: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const registerUser = async (email: string, fullName: string, role: string) => {
    try {
      // Note: In a real app, you'd use supabase.auth.signUp
      // For this admin panel, we'll just insert into profiles 
      // assuming auth is handled separately or via a trigger
      const { error } = await supabase
        .from('profiles')
        .insert([{ 
          email, 
          full_name: fullName, 
          role,
          id: crypto.randomUUID() // Placeholder ID if not using real auth signup here
        }]);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ users, fetchUsers, registerUser }}>
      {children}
    </UserContext.Provider>
  );
};
