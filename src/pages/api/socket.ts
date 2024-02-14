
import { chatSend } from "@/app/api/chat/action"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer } from "socket.io"
import { Server } from "socket.io"

const PORT = 3000

export const config = {
    api: {
        bodyParser: false,
    },
}

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}


export default async function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (res.socket.server.io) {
        res.status(200).json({ success: true, message: "Socket is already running", socket: `:${PORT + 1}` })
        return
    }

    const ioSocket = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } }).listen(PORT + 1)
    console.log("Starting Socket.IO server on port:", PORT + 1)


    ioSocket.on("connect", socket => {
        console.log("socket connect", socket.id)
        // console.log('SOCKET HEADER', socket.handshake.headers.cookie);

        socket.on("disconnect", async () => {
            console.log("socket disconnect")
        })


        socket.on("message:send", async (obj, callback) => {
            const body = obj as {
                target: string,
                message: {
                    from: { id: string, username: string },
                    message: string,
                    updateAt: string,
                    id: string
                }, targetChatId: string
            }

            const targetUsername = body?.target ? ('message:receive' + body?.target) : ''
            const message = body?.message ?? ''
            const targetChatId = body?.targetChatId ?? ''

            // console.log('CHATSSSSS', message);

            const res = await chatSend({ message, targetChatId })

            // console.log(res.data);

            if (res.message == 'success') {
                const dataMessage = res.data
                ioSocket.emit(targetUsername, { message: dataMessage, targetChatId });
                // console.log('sukses');
            } else {
                // console.log('gagal');
            }

            callback(res)
        });
    })

    res.socket.server.io = ioSocket
    res.status(201).json({ success: true, message: "Socket is started", socket: `:${PORT + 1}` })
}