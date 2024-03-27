import { Router as createRouter } from "express"

import vtu from "./vtu"

const users = createRouter();

users.get("/", (r, res) => {
	res.sendStatus(200)
})
users.use("/vtu", vtu)

export default users
