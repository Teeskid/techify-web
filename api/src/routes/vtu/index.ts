/** @module routes/vtu */

import { Router as createRouter } from "express"

// app engine for running in app actions
import admin from "./admin"
import airtime from "./airtime"
import bundle from "./bundle"
import hook from "./hook"
import user from "./user"

const vtu = createRouter()

vtu.get("/", (r, res) => {
    res.sendStatus(200)
})
vtu.use("/hook", hook)
vtu.use("/admin", admin)
vtu.use("/user", user)
vtu.use("/bundle", bundle)
vtu.use("/airtime", airtime)

export default vtu
