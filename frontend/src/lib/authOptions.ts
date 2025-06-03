/**
 * frontend/src/lib/authOptions.ts
 *
 * This file contains client-side constants and utility types related to authentication.
 * The main NextAuth configuration object (AuthOptions) is typically defined in `pages/api/auth/[...nextauth].ts`.
 * This file is for shared client-side auth values or types to avoid duplication and manage them centrally.
 */

// Defines standard user roles within the CRM application.
// This can be used for role-based access control (RBAC) on the client-side.
export enum UserRole {
  ADMINISTRATOR = 'Administrator',
  SALES_MANAGER = 'Sales Manager',
  SALES_REPRESENTATIVE = 'Sales Representative',
  // Add other roles as needed
}

// Common authentication-related paths used for navigation.
export const LOGIN_PATH = '/login';
export const DASHBOARD_PATH = '/dashboard';
export const UNAUTHORIZED_REDIRECT_PATH = '/login?error=SessionExpired'; // Example for redirect on 401

// Default path after a successful login if no specific redirect is provided.
export const DEFAULT_LOGIN_REDIRECT = DASHBOARD_PATH;

// You can also re-export types from next-auth if they are frequently used in client components,
// though it's often better to define specific app user types in `frontend/src/types/index.ts`.
// For example, if you had a client-specific User type extension:
// import type { User as NextAuthUser } from 'next-auth';
// export interface AppClientUser extends NextAuthUser {
//   customClientField?: string;
// }

// This file is intentionally kept lean. The core NextAuth options are in the API route.
