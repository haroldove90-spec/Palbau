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

  return (
    <UserContext.Provider value={{ users, fetchUsers, registerUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
