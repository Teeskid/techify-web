/** @module routes/msn */

import { Router as createRouter, type Request, type Response } from "express";
import { getFirestore } from "firebase-admin/firestore";

import { replyText, sendText } from "../handlers/msn";
import { MessageLine } from "../types/msn";
import { getWhatsAppMedia } from "../handlers/msn"

const msn = createRouter()

/**
 * inbox routing
 */
const inbox = createRouter()

inbox.get("/get-media", async (r, res) => {
    const media = await getWhatsAppMedia(r.query.mediaId as string)
    res.json({
        code: 200,
        data: media
    })
})

inbox.get("/list-all", async (r, res) => {
	const list = await getFirestore().collection("waba").get()
	const data = list.docs.forEach((doc) => ({
		id: doc.id,
		...doc.data()
	}))
	res.json({
		data
	})
})

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

const hooks = createRouter()

hooks.route("/whatsapp").get(async (r: Request, res: Response) => {
	if (r.query['hub.mode'] === 'subscribe' && r.query['hub.verify_token'] === process.env.MSN_API_V1_XHOOK) {
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
	// log it up
	console.log(r.body)
	
	const { entry } = r.body
	const items: MessageLine[] = []
	try {
		entry.forEach(({ changes }: any) => {
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
			await sendText("whatsapp", "2348020789906", display)
			await replyText("whatsapp", item.contact.wa_id, "Okay Tam Nagode. Allah ya saka da Alkhairi", item.message.id)
			await sendText("telegram", "2348020789906", display)
		}))
	} catch (error: Error | unknown) {
		console.error(error)
		console.log("PAYLOAD", JSON.stringify(entry))
	}
})

hooks.all("/telegram", async (r: Request, res: Response) => {
	// telegram hook receiver
	res.sendStatus(200)
	try {
		await sendText("whatsapp", "2348020789906", JSON.stringify(r.body))
	} catch (error: Error | unknown) {
		console.error(error)
	}
})

msn.use("/hooks", hooks)
msn.use("/inbox", inbox)
msn.use("/outbox", outbox)

export default msn
