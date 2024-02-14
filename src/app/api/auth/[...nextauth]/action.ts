
import { host } from "@/utils/variables";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'login',
            id: 'login',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const username = credentials?.username ?? ''
                const password = credentials?.password ?? ''

                const res = await fetch(host + '/api/auth/login', {
                    method: "POST",
                    body: JSON.stringify({ username, password })
                })
                const json = await res.json()
                const user: any = {
                    name: json?.data?.username ?? '',
                    email: json?.data?.email ?? '',
                    id: json?.data?.id ?? ''
                }

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            // session.accessToken = token.accessToken
            // console.log("SESSION ", session, user, token);
            const t = token as any

            session.user = {
                ...session.user,
                ...t.user
            }

            return session
        },
        async jwt({ session, token, user }) {
            // console.log("JWT ", user);

            if (typeof user !== "undefined") {
                // user has just signed in so the user object is populated
                token.user = user
            }
            return token
        }
    }
}