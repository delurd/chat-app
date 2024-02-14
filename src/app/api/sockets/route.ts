import { NextResponse } from "next/server";
import { Server } from "socket.io";


// UNUSED
const SocketHandler = async (req: any, res: any) => {
    const io = new Server(res?.socket?.server?.io)
    console.log('socket.............');


    res?.socket?.server?.io && (res.socket.server.io = io)
    io.on('connection', socket => {
        console.log('someone connect', socket.id);

        socket.on("send-message", (obj) => {
            console.log('MESSAGE...... ', obj);

            io.emit("receive-message", 'dari BE');
        });
    })


    return NextResponse.json({ message: 'success' })
}


export { SocketHandler as GET, SocketHandler as POST }