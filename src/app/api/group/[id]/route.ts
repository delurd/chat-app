import { NextRequest, NextResponse } from "next/server";
import { prisma, userSession } from "../../action";


export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    const UserSession = await userSession()
    const connectionId = context.params.id

    const userId = UserSession?.id

    try {
        const res = await prisma.connections.findFirst({
            where: {
                type: 'group',
                user: { some: { userId } },
                id: connectionId
            },
            include: { user: { select: { user: { select: { username: true, id: true } } } } }
        })

        if (!res) throw 'not found'

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {
        return NextResponse.json({ message: 'success', error }, { status: 400 })
    }
}