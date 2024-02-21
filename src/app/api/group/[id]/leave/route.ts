import { prisma, userSession } from "@/app/api/action"
import { NextRequest, NextResponse } from "next/server"


export const PUT = async (req: NextRequest, context: { params: { id: string } }) => {
    // LEAVE GROUP
    const UserSession = await userSession()
    const connectionId = context.params.id

    const userId = UserSession?.id

    try {
        const res = await prisma.userConnection.deleteMany({ where: { connectionId, userId } })

        return NextResponse.json({ message: 'success' })
    } catch (error) {
        return NextResponse.json({ message: 'success', error }, { status: 400 })
    }

}