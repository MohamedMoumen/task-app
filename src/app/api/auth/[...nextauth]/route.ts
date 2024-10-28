// /app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();

        // Find the user in your MongoDB database
        const user = await db.collection('users').findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('No user found with the entered email');
        }

        // Compare the provided password with the hashed password in the database
        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // If authentication is successful, return the user object
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export methods for handling the API requests in App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
