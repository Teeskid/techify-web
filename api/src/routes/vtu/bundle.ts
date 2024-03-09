import { Router as createRouter } from "express";

const bundle = createRouter()

bundle.all('/', (r, res) => {
    res.sendStatus(200)
})

bundle.post("/order", (r, res) => {
    res.sendStatus(200)
})

bundle.get("/pricing", (r, res) => {
    res.sendStatus(200)
})

bundle.get("/transactions", (r, res) => {
    res.sendStatus(200)
})

export default bundle
