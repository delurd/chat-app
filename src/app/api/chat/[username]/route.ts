import { NextRequest, NextResponse } from "next/server";
import { prisma, userSession } from "../../action";


export const GET = async (req: NextRequest, contex: { params: { username: string } }) => {
    const UserSession = await userSession()
    const targetConnectionId = contex.params.username

    try {
        if (!UserSession)
            return NextResponse.json({ message: 'something went wrong!', error: 'not authenticate!' }, { status: 401 })


        const cek = await prisma.connections.findUnique({
            where: {
                id:
                    targetConnectionId,
                user: { some: { userId: UserSession?.id } }
            }
        })
        if (!cek) throw 'not authorized!'

        const res = await prisma.chats.findMany({
            where: {
                toConnectionId: targetConnectionId
            },
            select: {
                id: true,
                message: true,
                updateAt: true,
                from: { select: { id: true, username: true } }
            },
        })


        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {
        return NextResponse.json({ message: 'something went wrong!', error }, { status: 400 })
    }
}


export const POST = async (req: NextRequest, contex: { params: { username: string } }) => {
    const UserSession = await userSession()
    const targetConnectionId = contex.params.username
    const body = await req.json()

    const message = body?.message ?? ''

    try {
        if (!UserSession)
            return NextResponse.json({ message: 'something went wrong!', error: 'not authenticate!' }, { status: 403 })

        const res = await prisma.chats.create({
            data: {
                toConnectionId: targetConnectionId,
                fromId: UserSession?.id,
                message
            },
            select: {
                id: true,
                message: true,
                updateAt: true,
                from: { select: { id: true, username: true } }
            },
        })

        // const connectionUser = await prisma.connections.findUnique({ where: { id: targetConnectionId }, select: { user: { include: { user: { select: { username: true } } } } } })

        // const filterTarget = connectionUser?.user?.filter((item: any) => item?.userId !== UserSession?.id)
        // const targetUsername = filterTarget[0]?.user?.username

        // console.log('targetUsername ', targetUsername);

        // targetUsername && ioSocket.emit(targetUsername, message, targetConnectionId);

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {
        return NextResponse.json({ message: 'something went wrong!', error }, { status: 400 })
    }
}