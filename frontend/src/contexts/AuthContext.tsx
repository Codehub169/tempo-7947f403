import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSession, SessionContextValue } from 'next-auth/react';
import { UserRole } from '@/lib/authOptions'; // Defined in frontend/src/lib/authOptions.ts

// Define the shape of the user object we expect in the session
// This aligns with AuthenticatedUser in useAuth.ts and types/index.ts
export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: UserRole; // UserRole enum from authOptions
  // Add other app-specific user properties if needed
}

interface AuthContextProps {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Example: A function to check for more granular, application-specific permissions
  // hasAppPermission?: (permissionKey: string) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * AuthProvider component that wraps parts of the application needing access to this specific AuthContext.
 * This context is intended to supplement NextAuth's SessionProvider and the useAuth hook,
 * potentially offering a place for more application-specific auth-related state or utilities
 * beyond direct session data.
 * 
 * IMPORTANT: This Provider must be placed *within* NextAuth's <SessionProvider> in _app.tsx.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status }: SessionContextValue = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const user = useMemo(() => {
    if (isAuthenticated && session?.user) {
      // The session.user object from NextAuth might have a different structure initially.
      // We map it to our CurrentUser interface, ensuring type consistency.
      // The 'id' and 'role' fields are custom fields added in the NextAuth callbacks.
      const sessionUser = session.user as any; // Cast to any to access custom properties
      return {
        id: sessionUser.id || '', // Ensure id is a string, fallback if not present
        name: sessionUser.name,
        email: sessionUser.email,
        role: sessionUser.role as UserRole, // Cast string role from session to UserRole enum
      };
    }
    return null;
  }, [session, isAuthenticated]);

  // Placeholder for a more complex permission checking function if needed.
  // const hasAppPermission = (permissionKey: string): boolean => {
  //   if (!user) return false;
  //   // Example logic: check user.role or a potential user.permissions array
  //   // if (user.role === UserRole.ADMINISTRATOR && permissionKey.startsWith('admin:')) return true;
  //   // if (user.permissions?.includes(permissionKey)) return true;
  //   return false;
  // };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading /*, hasAppPermission */ }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the AuthContext.
 * Provides an alternative or supplementary way to access auth state, 
 * potentially for parts of the app that need specific logic encapsulated here.
 */
export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
