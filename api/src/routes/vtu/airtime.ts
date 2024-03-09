import { Router as createRouter } from "express";

const airtime = createRouter()

airtime.all('/', (r, res) => {
    res.sendStatus(200)
})

airtime.post("/order", (r, res) => {
    res.sendStatus(200)
})

airtime.get("/pricing", (r, res) => {
    res.sendStatus(200)
})

airtime.get("/transactions", (r, res) => {
    res.sendStatus(200)
})

export default airtime
