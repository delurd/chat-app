import { prisma, userSession } from "@/app/api/action";
import { NextRequest, NextResponse } from "next/server";



export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
    const UserSession = userSession()
    const connectionId = context?.params?.id

    const body = await req.json()
    const username = body?.username

    console.log(username, connectionId);


    try {
        const getUser = await prisma.user.findUnique({ where: { username } })

        if (getUser) {
            const userTargetId = getUser.id
            const cek = await prisma.userConnection.findFirst({ where: { connectionId, userId: userTargetId } })

            if (cek !== null) throw 'username has been a member'

            const res = await prisma.userConnection.create({
                data: { connectionId, userId: getUser.id },
                select: { user: { select: { username: true, id: true } } }
            })

            return NextResponse.json({ message: 'success', data: res })
        } else throw 'username not found'

    } catch (error) {
        return NextResponse.json({ message: error, error: 'something went wrong' }, { status: 400 })
    }

}