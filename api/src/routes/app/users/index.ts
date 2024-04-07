import { Router as createRouter } from "express";

import pay from "./pay";
import vtu from "./vtu";

const users = createRouter();

users.get("/", (r, res) => {
	res.sendStatus(200)
})
users.use("/vtu", vtu)
users.use("/pay", pay)

export default users
