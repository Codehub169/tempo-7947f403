import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

// Define a User interface that extends NextAuthUser to include id, role, and token
interface IUser extends NextAuthUser {
  id: string;
  role: string;
  accessToken: string;
  name?: string | null;
  email?: string | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        // In a real application, you would call your backend API here
        // The NEXT_PUBLIC_API_BASE_URL is configured in next.config.js
        // It points to http://localhost:9000/api in development
        // and /api in production (which should be served by the same host as Next.js)
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/api';
        
        try {
          const res = await fetch(`${apiBaseUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const user = await res.json();

          if (res.ok && user && user.data) {
            // Assuming your backend returns user data and a token in user.data
            // Example: user.data = { id: '1', name: 'John Doe', email: '...', role: 'Admin', token: '...' }
            return {
              id: user.data.id,
              name: user.data.name,
              email: user.data.email,
              role: user.data.role, // Make sure your backend provides this
              accessToken: user.data.token, // And the access token
            } as IUser;
          } else {
            // If the response is not ok or user data is missing, throw an error or return null
            // The error message from the backend could be in user.message or similar
            throw new Error(user.message || 'Invalid credentials');
          }
        } catch (error: any) {
          // Handle network errors or other issues
          console.error('Login error:', error);
          throw new Error(error.message || 'Login failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user details to the token right after signin
      if (account && user) {
        const iUser = user as IUser; // Cast user to our extended IUser interface
        return {
          ...token,
          id: iUser.id,
          accessToken: iUser.accessToken,
          role: iUser.role,
          name: iUser.name,
          email: iUser.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user details from JWT
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    // error: '/auth/error', // Custom error page (optional)
    // signOut: '/auth/signout', // Custom signout page (optional)
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure NEXTAUTH_SECRET is set in your .env.local
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
