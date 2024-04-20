/** @module routes/app */

import { Router as createRouter } from "express";


import { setContext, verifyAppCheck, verifyIdToken } from "../../utils/app/auth";

import admin from './admin';
import auth from "./auth";
import user from './user';

const app = createRouter()

app.use(async (r, res, runNext) => {
	const [, pathName] = r.path.split("/", 2)
	if (pathName === "auth") {
		runNext()
		return
	}
	const appToken = await verifyAppCheck(r)
	const authToken = await verifyIdToken(r)
	setContext(r, appToken, authToken)
	// if (r.path.includes("/admin") || r.path.includes("/users")) {
	// 	if (!appToken || !authToken) {
	// 		res.json({
	// 			code: 401,
	// 			text: "failed to authorize request"
	// 		})
	// 	} else {
	// 		runNext()
	// 	}
	// 	return
	// }
	runNext()
})

app.use("/admin", admin)
app.use("/auth", auth)
app.use("/user", user)

export default app
