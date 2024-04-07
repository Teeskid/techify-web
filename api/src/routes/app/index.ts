import { Router as createRouter } from "express";

import { verifyAppCheck, verifyIdToken } from "../../utils/app/auth";

import { Context } from "../../types/app";
import { DEBUG_MODE } from "../../utils/vtu/const";
import account from './account';
import admin from './admin';
import auth from "./auth";
import users from './users';

const app = createRouter()

app.use(async (r, res, runNext) => {
	const [, pathName] = r.path.split("/", 2)
	if (pathName === "auth") {
		runNext()
		return
	}
	const appToken = await verifyAppCheck(r)
	const authToken = await verifyIdToken(r)
	if (r.path.includes("/admin") || r.path.includes("/users")) {
		if (!appToken || !authToken) {
			res.json({
				code: 401,
				text: "failed to authorize request"
			})
		} else {
			runNext()
		}
		return
	}
	const context: Context = { app: appToken, auth: authToken }
	let response: object
	try {
		// // protect admin-only routes
		// if (r.path.includes("/admin")) {
		// 	res.json({
		// 		code: 403,
		// 		text: "access to path denied by system"
		// 	})
		// 	return
		// }
		response = await account(context, r.body)
	} catch (error: Error | unknown) {
		if (DEBUG_MODE)
			console.error(error)
		response = {
			code: 500,
			text: (error as Error).message
		}
	}
	res.json(response)
})
app.get("/", (r, res) => {
	res.sendStatus(200)
})
app.use("/auth", auth)
app.use("/admin", admin)
app.use("/users", users)

export default app
