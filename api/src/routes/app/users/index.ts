import { Router as createRouter } from "express"

import auth from "./auth"

const users = createRouter();

users.get("/", (r, res) => {
	res.sendStatus(200)
})
users.use("/auth", auth)

export default users
