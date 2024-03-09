import { Router as createRouter } from "express"

const admin = createRouter();

admin.get("/", (r, res) => {
	res.sendStatus(200)
})

export default admin
