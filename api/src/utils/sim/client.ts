import { getMessaging } from "firebase-admin/messaging"

export const postUssd  = async (token: string, ussd: string, sync: boolean) => {
    const result = await getMessaging().send({
        condition: "n/a",
        notification: {
            title: "First USSD Run Command",
            body: "This is the first ussd message sent from server to an mobile sim server"
        },
        data: {
            ussd,
            type: sync ? "sync" : "async"
        },
        topic: "sim-service",
        token
    })
    return result
}

export default {}
