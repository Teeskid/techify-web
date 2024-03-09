import { Router as createRouter } from "express"

const users = createRouter();

users.get("/", (r, res) => {
	res.sendStatus(200)
})

export default users
