import { Box, Typography } from "@mui/joy"
import { Unsubscribe, getMessaging, getToken, onMessage } from "firebase/messaging"
import { useEffect, useState } from "react"

import SIMApi from "../../../modules/SIMApi"

type Message = {
    token: string,
    message: string
}

export default function SIMHomeRoot() {
    
    const [state, setState] = useState<Message>()
    useEffect(() => {
        const messaging = getMessaging()
        let unSubscribe: Unsubscribe | undefined
        getToken(messaging).then((token) => {
            setState({
                token: token,
                message: "N/A"
            })
            SIMApi.get().auth(token).then((result) => {
                console.log(result)
            }).catch((error) => {
                console.error(error)
            })
            unSubscribe = onMessage(messaging, (message) => {
                setState({
                    token: token,
                    message: JSON.stringify(message)
                })
            })
        }).catch((error: Error) => {
            console.error(error)
        })
        return unSubscribe
    }, [])

    return (
        <Box alignContent="flex-start" sx={{ textAlign: "left", marginX: "10px" }}>
            <Typography variant="solid">SIM Server Management</Typography>
            <Typography variant="plain">{state?.message}</Typography>
            <p>
                TOKEN: {state?.token}
            </p>
        </Box>
    )
}
