import { Router as createRouter } from "express";
import { getMessaging } from "firebase-admin/messaging"

const client = createRouter();

client.get("/", (r, res) => {
    res.sendStatus(200)
})
client.get("/run-ussd", async (r, res) => {
    await getMessaging().send({
        condition: "",
        notification: {
            title: "",
            body: ""
        }
    })
    res.json({ status: true })
})

export default client;
