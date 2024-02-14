import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../action"
import { compare } from "bcrypt"


export const POST = async (req: NextRequest) => {
    // const body = await req.formData()
    const json = await req.json()

    // const username = body.get('username') as string ?? ''
    // const password = body.get('password') as string ?? ''
    const username = json?.username ?? ''
    const password = json?.password ?? ''

    // console.log('JSON', username, password);

    if (username && password) {
        try {
            const data = await prisma.user.findFirst({
                where: {
                    OR: [{ username: { equals: username } }, { email: { equals: username } }]
                },
            })

            // console.log(data);
            if (data) {
                const hasss = await compare(password, data.password);

                if (hasss) {
                    return NextResponse.json({ message: 'success', data: { id: data.id, username: data.username, email: data.email } })
                }
            }
        } catch (error) {
            return NextResponse.json({ message: 'something went wrong!', error }, { status: 400 })
        }
    }

    return NextResponse.json({ message: 'something went wrong!', error: ['please fill all required data!'] }, { status: 400 })
}