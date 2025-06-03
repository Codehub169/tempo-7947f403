import { useSession } from 'next-auth/react';
import { UserRole } from '@/lib/authOptions'; // Assuming UserRole enum is here

// Define a more specific type for the user object based on your NextAuth setup
export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole | string; // Use UserRole enum if available, otherwise string
  // Add any other custom properties your user object might have
}

export interface AuthState {
  user: AuthenticatedUser | undefined;
  accessToken: string | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUnauthenticated: boolean;
  isAdmin: boolean;
  isSalesManager: boolean;
  isSalesRepresentative: boolean;
  hasRole: (role: UserRole | string) => boolean;
}

/**
 * Custom hook to manage and access authentication state.
 * Provides convenient access to user data, roles, and authentication status.
 */
export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session;
  const isUnauthenticated = status === 'unauthenticated';

  // Explicitly type the user from the session according to our NextAuth callbacks
  const user = session?.user as AuthenticatedUser | undefined;
  const accessToken = session?.accessToken as string | undefined;

  const hasRole = (roleToCheck: UserRole | string): boolean => {
    return !!user && user.role === roleToCheck;
  };

  const isAdmin = hasRole(UserRole.ADMINISTRATOR);
  const isSalesManager = hasRole(UserRole.SALES_MANAGER);
  const isSalesRepresentative = hasRole(UserRole.SALES_REPRESENTATIVE);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isUnauthenticated,
    isAdmin,
    isSalesManager,
    isSalesRepresentative,
    hasRole,
  };
};
