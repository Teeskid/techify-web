import { Router as createRouter, type Request, type Response } from "express"

import { sendText } from "../../handlers/msn"

const outbox = createRouter()

outbox.get("/", async (r, res) => {
	res.sendStatus(200)
})

outbox.get("/send", async (r, res) => {
	res.sendStatus(200)
	const client = String(r.query.client).trim()
	try {
		// 2349091287856
		await sendText("whatsapp", client, "Malam Abdul Ya Kake?")
	} catch (error: Error | unknown) {
		console.error(error)
	}
})

outbox.all("/send-sms", (r: Request, res: Response) => {
	res.sendStatus(200)
})

outbox.all("/send-whatsapp", (r: Request, res: Response) => {
	res.sendStatus(200)
})

outbox.all("/send-telegram", (r: Request, res: Response) => {
	res.sendStatus(200)
})

export default outbox
