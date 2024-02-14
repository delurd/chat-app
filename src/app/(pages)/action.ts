import { io } from "socket.io-client"

export const socket = io(`:${3000 + 1}`, { path: "/api/socket", addTrailingSlash: false })

export default function socketClient(targetUsername?: string) {

    socket.on("connect", () => {
        // console.log("Connected", targetUsername)
    })

    socket.on("disconnect", () => {
        // console.log("Disconnected")
    })

    socket.on("connect_error", async err => {
        console.log(`connect_error due to ${err.message}`)
        await fetch("/api/socket")
    })

    return socket
}