import { Router as createRouter } from "express";

const coupon = createRouter()

coupon.all('/', (r, res) => {
    res.sendStatus(200)
})

coupon.post("/order", (r, res) => {
    res.sendStatus(200)
})

coupon.get("/pricing", (r, res) => {
    res.sendStatus(200)
})

coupon.get("/transactions", (r, res) => {
    res.sendStatus(200)
})

export default coupon
