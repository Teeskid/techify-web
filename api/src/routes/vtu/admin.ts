import { Router as createRouter } from "express";

export default createRouter().all('/', (r, res) => {
    res.sendStatus(200)
})
