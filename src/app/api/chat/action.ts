import { prisma, userSession } from "../action"


export const chatSend = async (body?: { targetChatId: string, message: any }) => {
    const targetConnectionId = body?.targetChatId ?? ''
    const message = body?.message?.message ?? ''
    const fromUsername = body?.message?.from?.username

    // console.log('CHAT SEND', targetConnectionId, message);


    try {
        const UserSession = await prisma.user.findUnique({ where: { username: fromUsername } })

        if (!UserSession)
            return { message: 'something went wrong!', error: 'not authenticate!', status: 403 }

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

        // console.log(res);

        return ({ message: 'success', data: res })
    } catch (error) {
        console.log(error);

        return { message: 'something went wrong!', error, status: 400 }
    }

}