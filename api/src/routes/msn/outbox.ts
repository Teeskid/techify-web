import { Router as createRouter, type Request, type Response } from "express"

import { sendText } from "../../tools/msn"

const outbox = createRouter()

outbox.get("/", async (r, res) => {
	res.sendStatus(200)
})

outbox.get("/send", async (r, res) => {
	res.sendStatus(200)
	try {
		await sendText("whatsapp", "2349091287856", "Sani kana ina ne?")
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
