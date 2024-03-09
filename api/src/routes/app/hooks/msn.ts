/** @module routes/app/hooks/msn */

import { Router as createRouter, type Request, type Response } from "express"
import { getFirestore } from "firebase-admin/firestore"

import { sendText } from "../../../tools/msn";

const msn = createRouter()

msn.route("/whatsapp").get(async (r: Request, res: Response) => {
	if (r.query['hub.mode'] === 'subscribe' && r.query['hub.verify_token'] === process.env.TOKEN) {
		res.send(r.query['hub.challenge'])
		return
	}
	res.sendStatus(400)
}).post(async (r: Request, res: Response) => {
	if (typeof r.body !== 'object' || r.body.field !== 'messages') {
		res.sendStatus(400)
		console.error("WABA_ERROR", JSON.stringify(r.body))
		return
	}
	// goes fine here
	res.sendStatus(200)
	const { field } = r.body
	await getFirestore().collection("waba").doc().create({
		url: r.url,
		msg: r.body,
		arg: r.query,
		fld: field
	})
	await sendText("telegram", "2348020789906", JSON.stringify(r.body))
})

msn.all("/telegram", async (r: Request, res: Response) => {
	// telegram hook receiver
	res.sendStatus(200)
	try {
		await sendText("whatsapp", "2348020789906", JSON.stringify(r.body))
	} catch (error: Error | unknown) {
		console.error(error)
	}
})

export default msn
