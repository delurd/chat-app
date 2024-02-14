import NextAuth from "next-auth/next";
import { authOptions } from "./action";


const nextAuth = NextAuth(authOptions)

export { nextAuth as GET, nextAuth as POST }