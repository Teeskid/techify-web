import { Router as createRouter } from "express"

import client from "./client"
import server from "./server"

const sim = createRouter()

sim.get("/", (r, res) => {
	res.sendStatus(200)
})
sim.use("/client", client)
sim.use("/server", server)

export default sim
