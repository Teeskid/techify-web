import { Router as createRouter } from "express";
import { getMessaging } from "firebase-admin/messaging";
import { randomBytes } from "crypto";

import { verifyIdToken } from "../../utils/app/auth";
import { Timestamp, getFirestore } from "firebase-admin/firestore";

const server = createRouter();

/**
 * TODO: stub route for test
 */
server.get("/", (r, res) => {
	res.sendStatus(200)
})

/**
 * TODO: register server for a user id
 */
server.post("/auth", async (r, res) => {
	const context = await verifyIdToken(r, res)
	if (!context) {
		return
	}

	const token = String(r.body.token).trim()
	const title = String(r.body.title).trim()
	if ((!token || token.length === 0) || (!title || title.length === 0)) {
		res.json({
			code: 403,
			text: "invalid title / registration token provided"
		})
		return
	}

	const store = getFirestore()
	const devDoc = store.collection("usrs").doc(context.uid).collection("devs").doc()
	const codeId = randomBytes(999999).toString("hex")
	const devRes = await devDoc.create({
		nam: title,
		uid: token,
		cod: codeId,
		dat: Timestamp.now(),
		stt: null
	})

	res.json({
		code: 200,
		text: "device authentication successful",
		data: {
			cod: 0,
			uid: devDoc.id,
			dat: devRes.writeTime
		}
	})
})

/**
 * TODO: used to toggle server on / off
 */
server.post("/power", async (r, res) => {
	const context = await verifyIdToken(r, res)
	if (!context) {
		return
	}

	const token = String(r.body.token).trim()
	if (!token || token.length === 0) {
		res.json({
			code: 403,
			text: "invalid registration token provided"
		})
		return
	}

	const subs = await getMessaging().subscribeToTopic(token, "sim-service")
	if (subs.failureCount !== 0) {
		res.json({
			code: 500,
			text: "failed to subscribe to sim service"
		})
		return
	}
	res.json({
		code: 200,
		text: "subscribed to sim service successfully"
	})

	console.log("AUTH: ", context)
})

server.get("/status", (r, res) => {
	res.sendStatus(200)
})

server.route("/sms").get((r, res) => {
	const data: object[] = []

	// return the json data
	res.json({
		data: data
	})
}).post((r, res) => {
	// request to send sms via the server
	res.sendStatus(200)

	const { recipent, message, retry } = r.body

	console.error("UNIMPLEMENTED")

	res.json({
		recipent,
		message,
		retry
	})
})

server.route("/ussd").get((r, res) => {
	const data: object[] = []

	// return the json data
	res.json({
		data: data
	})
}).post((r, res) => {
	res.sendStatus(200)
})

export default server
