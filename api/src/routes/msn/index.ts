import { Router as createRouter, type Request, type Response } from "express"
import { getFirestore } from "firebase-admin/firestore"

import { sendText } from "../../tools/msn"

const msn = createRouter()

msn.get("/test", async (r, res) => {
	res.sendStatus(200)
	try {
		await sendText("whatsapp", "2349091287856", "Sani Ya Kake Ne")
	} catch (error: Error | unknown) {
		console.error(error)
	}
})

msn.get("/list-all", async (r, res) => {
	const list = await getFirestore().collection("waba").get()
	const data = list.docs.forEach((doc) => ({
		id: doc.id,
		...doc.data()
	}))
	res.json({
		data
	})
})

msn.all("/send-sms", (r: Request, res: Response) => {
	res.sendStatus(200)
})

msn.all("/send-whatsapp", (r: Request, res: Response) => {
	res.sendStatus(200)
})

msn.all("/send-telegram", (r: Request, res: Response) => {
	res.sendStatus(200)
})

export default msn
