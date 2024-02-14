import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../action";
import { fetchBasic } from "@/hooks/fetch/useFetch";
import { getCsrfToken } from "next-auth/react";
import { hash } from "bcrypt";
import { host } from "@/utils/variables";



export const POST = async (req: NextRequest, res: NextResponse) => {
    const body = await req.formData()

    const username = body.get('username') as string ?? ''
    const email = body.get('email') as string ?? ''
    const password = body.get('password') as string ?? ''
    const csrfToken = body.get('csrfToken') as string ?? ''

    if (username && email && password) {
        try {
            const hasss = await hash(password, 10);

            if (hasss) {

                const data = await prisma.user.create({
                    data: { username, email, password: hasss, Profile: { create: { fullname: '' } } },
                    select: { email: true, username: true, id: true }
                })
                // await prisma.profile.create({ data: { userId: data.id } })

                // const csrfToken = await getCsrfToken()
                // const bodyLogin = `username=${username}&password=${password}&redirect=false&csrfToken=${csrfToken}&json=true&callbackUrl=http://localhost:3000/auth/login`;
                // console.log(bodyLogin);

                // const data = await fetchBasic('/api/auth/login', 'POST', JSON.stringify({ username, password }))
                // const data = await fetch(host + '/api/auth/callback/login', {
                //     method: 'POST',
                //     body: bodyLogin,
                //     headers: {
                //       'Content-Type': 'application/x-www-form-urlencoded',
                //     },
                //   });
                // const json = await data.json()
                // console.log(data.ok);


                return NextResponse.json({ message: 'success', data })
            }
        } catch (error) {
            return NextResponse.json({ message: 'something went wrong!', error }, { status: 400 })
        }
    }

    return NextResponse.json({ message: 'something went wrong!', error: ['please fill all required data!'] }, { status: 400 })
}