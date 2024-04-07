import { Router as createRouter } from "express"

import client from "./client"
import hook from "./hook"
import server from "./server"

const sim = createRouter()

sim.get("/", (r, res) => {
	res.sendStatus(200)
})
sim.use("/client", client)
sim.use("/hook", hook)
sim.use("/server", server)

export default sim
