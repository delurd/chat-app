import { authOptions } from "@/app/api/auth/[...nextauth]/action";
import { host } from "@/utils/variables";
import { getServerSession } from "next-auth";


export const fetchBasic = async (url: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: BodyInit) => {

    return await fetch(host + url, { method, body }).then(async (res) => {
        if (!res.ok) {
            throw await res.json()
        }
        return await res.json();
    })
}

export const fetchWithToken = async (url: string, method?: 'GET' | 'POST', body?: BodyInit) => {

    const session = getServerSession(authOptions)
    const user: any = await session.then((res) => res?.user);

    return await fetch(host + url, { method, body, headers: { 'authorization': user?.id ?? '' } }).then(async (res) => {
        if (!res.ok) {
            throw await res.json()
        }
        return await res.json();
    })
}