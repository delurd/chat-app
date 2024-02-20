import { NextRequest, NextResponse } from "next/server";
import { prisma, userSession } from "../action";



export const POST = async (req: NextRequest) => {
    const UserSession = await userSession()
    const body = await req.json()

    const _userId = UserSession?.id
    const groupName = body?.groupName
    const userIdList: any[] = body?.userIdList ?? []
    const groupMembers = userIdList?.map(userId => { return { userId } })

    console.log(groupName, groupMembers);

    try {
        if (!_userId) return NextResponse.json({ message: 'not authenticated' }, { status: 401 })

        const res = await prisma.connections.create({
            data: {
                name: groupName,
                type: 'group',
                user: {
                    createMany: {
                        data:
                            [
                                { userId: _userId },
                                ...groupMembers
                            ]
                    }
                }
            },
            include: {
                user: { select: { user: { select: { username: true, id: true } } } }
            }
        })

        return NextResponse.json({ message: 'success', data: res })

    } catch (error) {
        return NextResponse.json({ message: 'something went wrong', error }, { status: 400 })
    }

}