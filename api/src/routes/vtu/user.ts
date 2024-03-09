import { Router as createRouter } from "express";

const user = createRouter()

user.all('/', (r, res) => {
    res.sendStatus(200)
})

user.get("/info", (r, res) => {
    res.sendStatus(200)
})

user.get("/update", (r, res) => {
    res.sendStatus(200)
})

export default user
