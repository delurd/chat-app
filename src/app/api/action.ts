import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/action";


export const prisma = new PrismaClient();

export const userSession: any = async () => {
    const session = getServerSession(authOptions);

    return await session.then((res) => res?.user);
}