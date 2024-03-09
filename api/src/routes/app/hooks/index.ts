/** @module routes/app/hooks */

import { Router as createRouter } from "express"

import vrf from "./vrf"
import pay from "./pay"
import sim from "./sim"
import msn from "./msn"
import vtu from "./vtu"

const hooks = createRouter()

hooks.get("/", (r, res) => {
    res.sendStatus(200)
})
hooks.use("/pay", pay)
hooks.use("/sim", sim)
hooks.use("/msn", msn)
hooks.use("/vtu", vtu)
hooks.use("/vrf", vrf)

export default hooks
