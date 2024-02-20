import { NextRequest, NextResponse } from "next/server";
import { prisma, userSession } from "../action";


export const GET = async (req: NextRequest) => {
    const UserSession = await userSession();
    if (!UserSession)
        return NextResponse.json({ message: 'not authenticate!' }, { status: 401 });

    const userId = UserSession.id

    try {
        const res = await prisma.connections.findMany({
            where: {
                user: { some: { userId } },
                OR: [
                    {
                        type: 'personal', chats: {
                            some: {
                                OR: [
                                    { fromId: userId, message: '' },
                                    { message: { not: '' } }
                                ]
                            }
                        }
                    },
                    {
                        type: 'group'
                    }
                ],

            },
            include: {
                user: { select: { user: { select: { username: true, id: true } } } }
            }
        })

        // console.log(res);

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {
        return NextResponse.json({ message: 'something went wrong!', error }, { status: 400 })
    }
}




export const POST = async (req: NextRequest) => {
    const UserSession = await userSession();
    if (!UserSession)
        return NextResponse.json({ message: 'not authenticate!' }, { status: 401 });

    const body = await req.json();
    const userId = UserSession?.id;
    const targetUsername = body?.username ?? '';


    try {
        const target = await prisma.user.findUnique({
            where: { username: targetUsername },
        });

        if (!target) throw 'username target unknown!';

        const findConnection = await prisma.connections.findFirst({
            where: {
                AND: [
                    { user: { some: { userId } } },
                    { user: { some: { userId: target?.id } } },
                ],
            },
        });


        if (!findConnection) {
            const res = await prisma.connections.create({
                data: {
                    user: {
                        createMany: {
                            data: [
                                { userId },
                                { userId: target?.id }
                            ]
                        }
                    },
                    chats: { create: { fromId: userId, message: "" } }
                },
                include: {
                    user: { select: { user: { select: { username: true, id: true } } } }
                }
            })

            return NextResponse.json({ message: 'success', data: res });
        }

        throw 'contact has been registered'
    } catch (error) {
        return NextResponse.json(
            { message: 'something went wrong!', error },
            { status: 400 }
        );
    }
};