/** @module routes/app/hooks */

import { Router as createRouter } from "express"

import idv from "./idv"
import msn from "./msn"
import pay from "./pay"
import sim from "./sim"
import vtu from "./vtu"

const hooks = createRouter()

hooks.get("/", (r, res) => {
    res.sendStatus(200)
})
hooks.use("/idv", idv)
hooks.use("/msn", msn)
hooks.use("/pay", pay)
hooks.use("/sim", sim)
hooks.use("/vtu", vtu)

export default hooks
