/** @module routes/msn */

import { Router as createRouter, type Request, type Response } from "express";
import { getFirestore } from "firebase-admin/firestore";

import { getWhatsAppMedia } from "../handlers/msn/media"
import { sendText, sendTemplate } from "../handlers/msn/outbox";
import type { MessageLine } from "../types/msn";

/**
 * msn-routing
 */
const msn = createRouter()

/**
 * msn-top
 */
msn.get("/get-whatsapp-media", async (r: Request, res: Response) => {
	const mediaId = String(r.query.mediaId || "").trim()
	if (mediaId.length === 0) {
		res.json({
			code: 403,
			text: "invalid argument provided"
		})
	}
    const data = await getWhatsAppMedia(mediaId)
    res.json({
        code: 200,
        data
    })
})

/**
 * msn-inbox
 */
msn.get("/inbox/get-list", async (r: Request, res: Response) => {
	const list = await getFirestore().collection("waba").get()
	const data = list.docs.forEach((doc) => ({
		id: doc.id,
		...doc.data()
	}))
	res.json({
		code: 200,
		data
	})
})

/**
 * msn-outbox
 */
msn.get("/outbox", async (r, res) => {
	res.sendStatus(200)
})

msn.get("/outbox/send", async (r, res) => {
	const client = String(r.query.client || "").trim()
	try {
		// 2349091287856
		await sendText("whatsapp", client, "Malam Ya Kake?")
		res.sendStatus(200)
	} catch (error: Error | unknown) {
		console.error(error)
		res.sendStatus(500)
	}
})

msn.all("/outbox/send-sms", (r: Request, res: Response) => {
	res.sendStatus(200)
})

msn.all("/outbox/send-whatsapp", async (r: Request, res: Response) => {
	const line1 = await sendTemplate("whatsapp", "2348020789906", "sms_begin")
	const line2 = await sendText("whatsapp", "+2348020789906", "Did you see?")
	res.json({
		code: 200,
		text: "success",
		data: {
			line1, line2
		},
	})
})

msn.all("/outbox/send-telegram", (r: Request, res: Response) => {
	res.sendStatus(200)
})

/**
 * msn-hooks
 */
msn.route("/hooks/whatsapp").get(async (r: Request, res: Response) => {
	if (r.query['hub.mode'] === 'subscribe' && r.query['hub.verify_token'] === process.env.MSN_API_V1_XHOOK) {
		res.send(r.query['hub.challenge'])
		return
	}
	res.sendStatus(400)
}).post(async (r: Request, res: Response) => {
	// log it up here
	console.error("WABA_HOOK", JSON.stringify(r.body))
	if (typeof r.body !== 'object' || r.body.object !== "whatsapp_business_account") {
		res.sendStatus(400)
		return
	}	
	// goes fine here
	res.sendStatus(200)
	
	// forward to telegram
	await sendText("telegram", "2348145737179", JSON.stringify(r.body))

	// get on with real business
	try {
		const items: MessageLine[] = []
		r.body.entry.forEach(({ changes }: any) => {
			changes.forEach(({ field, value }: any) => {
				if (field !== "messages" || value.messaging_product !== "whatsapp")
					return
				const { metadata, contacts, messages, statuses } = Array.isArray(value) ? value[0] : value
				if (metadata.phone_number_id !== process.env.MSN_API_V1_PHONE)
					return
				// use the first one in each case
				const contact = contacts?.[0] || null
				const message = messages?.[0] || null
				const statuse = statuses?.[0] || null
				if (contact && message)
					items.push({ contact, message })
				if (statuse)
					console.log("READ_RECEIPT", statuse)
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
		await Promise.all(items.map(async (item) => {
			let display = item.message.type === "text" ? `${item.message.text.body}` : `${item.message.document.filename}`
			display = `WhatsApp {*${item.contact.profile.name}*}: ${display}\n`
			await sendText("telegram", "2348145737179", display)
		}))
	} catch (error: Error | unknown) {
		console.error(error)
	}
})

msn.all("/hooks/telegram", async (r: Request, res: Response) => {
	// telegram hook receiver
	console.log("TLG_HOOK", r.body)
	res.sendStatus(200)
	try {
		await sendText("whatsapp", "2348020789906", JSON.stringify(r.body))
	} catch (error: Error | unknown) {
		console.error(error)
	}
})

export default msn
