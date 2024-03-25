/** @module routes/app/hooks/msn */

import { Router as createRouter, type Request, type Response } from "express";
import { getFirestore } from "firebase-admin/firestore";

import { sendText } from "../../../tools/msn";
import { MessageLine } from "../../../types/msn";

const msn = createRouter()

msn.route("/whatsapp").get(async (r: Request, res: Response) => {
	if (r.query['hub.mode'] === 'subscribe' && r.query['hub.verify_token'] === process.env.TOKEN) {
		res.send(r.query['hub.challenge'])
		return
	}
	res.sendStatus(400)
}).post(async (r: Request, res: Response) => {
	if (typeof r.body !== 'object' || r.body.object !== "whatsapp_business_account") {
		res.sendStatus(400)
		console.error("WABA_ERROR", JSON.stringify(r.body))
		return
	}
	// goes fine here
	res.sendStatus(200)
	const { entry } = r.body
	const items: MessageLine[] = []
	try {
		entry.forEach(({ changes }: any) => {
			changes.forEach(({ field, value }: any) => {
				if (field !== "messages" || value.messaging_product !== "whatsapp")
					return
				const { metadata, contacts, messages } = Array.isArray(value) ? value[0] : value
				if (metadata.phone_number_id !== process.env.MSN_API_V1_PHONE)
					return
				const contact = contacts[0]
				const message = messages[0]
				items.push({ contact, message })
			})
		})
		if (items.length === 0)
			return
		const store = getFirestore()
		const batch = store.batch()
		items.forEach((msg) => {
			batch.create(store.collection("waba").doc(), msg)
		})
		await batch.commit()
		const message = items[0]
		const display = `WhatsApp Message From ${message.contact.profile.name}\n: ${message.message.text.body}`
		await sendText("telegram", "2348020789906", display)
	} catch (error: Error | unknown) {
		console.error(error)
	}
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
