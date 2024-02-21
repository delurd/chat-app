import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"


export const useSelectedContact = () => {
    const querClient = useQueryClient()
    // const [selectedContact, setSelectedContact] = useState({})

    const setSelectedContact = (data: any) => {
        querClient.setQueryData(['selectedContact'], () => { return data })
    }

    const selectedContact: any = (() => {
        const data = querClient.getQueryData(['selectedContact'])

        if (data == undefined) return {}

        return data
    })()

    return { selectedContact, setSelectedContact }
}