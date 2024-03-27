import { Router as createRouter } from "express";

import { postUssd } from "../../utils/sim/client";

const client = createRouter();

client.get("/", (r, res) => {
    /**
     * for listing past run ussd resuls
     */
    res.sendStatus(200)
})

client.route("/ussd").get((r, res) => {
    res.sendStatus(200)
}).post(async (r, res) => {
    /**
     * for running ussd code in (a)sync
     */
    try {
        await postUssd("token", "*310#", false)
        res.json({ code: 200, text: "USSD Code sent for processing on the server." })
    } catch (error: Error | unknown) {
        res.json({ code: 500, text: (error as Error).message })
    }
})

export default client
