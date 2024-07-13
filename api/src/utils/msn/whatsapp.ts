import axios from "axios"
import crypto from "crypto"

import type { Server } from "../../types/msn"

// create proof mac
const proofMac = crypto.createHmac("sha256", process.env.MSN_API_V1_CRYPT as string)
proofMac.update(process.env.MSN_API_V1_TOKEN as string)
const proofSec = { "appsecret_proof": proofMac.digest("hex") }

const whatsapp = axios.create({
	baseURL: `https://graph.facebook.com/v20.0/${process.env.MSN_API_V1_PHONE}`,
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer ${process.env.MSN_API_V1_TOKEN}`
	},
	params: {
		...proofSec
	}
})

export class WhatsApp implements Server {
	async sendTemplate(recipient: string, template: string) {
		try {
			const { data } = await whatsapp.post("/messages", {
				"messaging_product": "whatsapp",
				"recipient_type": "individual",
				"to": recipient,
				"type": "template",
				"template": {
					"name": template,
					"language": {
						"code": "en_GB"
					},
					"components": [
						{
							"type": "body",
							"parameters": [
								{
									"type": "text",
									"text": "J$FpnYnP"
								},
							]
						},
						{
							"type": "button",
							"sub_type": "url",
							"index": "0",
							"parameters": [
								{
									"type": "text",
									"text": "J$FpnYnP"
								}
							]
						}
					]
				}
			})
			return data.messages?.[0].id || false
		} catch (error: Error | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("MSN_ERROR", error.response?.data)
			} else {
				console.error("MSN_ERROR", error)
			}
			return false
		}
	}
	async sendMessage(recipient: string, message: string, context?: string) {
		const payLoad: Record<string, string | object> = {
			"messaging_product": "whatsapp",
			"recipient_type": "individual",
			"to": recipient,
			"type": "text",
			"text": {
				"preview_url": false,
				"body": message
			}
		}
		if (context && context !== "") {
			payLoad.context = {
				"message_id": context
			}
		}
		try {
			const { data } = await whatsapp.post("/messages", payLoad)
			return data.messages?.[0].id || false
		} catch (error: Error | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("MSN_ERROR", error.response?.data)
			} else {
				console.error("MSN_ERROR", error)
			}
			return false
		}
	}
	async getMedia(mediaId: string) {
		try {
			const { data } = await whatsapp.get(`../${mediaId}`)
			console.log(data)
			return data
		} catch (error: Error | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("MSN_ERROR", error.response?.data)
			} else {
				console.error("MSN_ERROR", error)
			}
			return false
		}
	}
}

export default new WhatsApp()
