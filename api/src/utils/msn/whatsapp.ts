import axios, { type AxiosError } from "axios"

import type { Server } from "../../types/msn"

const whatsapp = axios.create({
	baseURL: `https://graph.facebook.com/v19.0/${process.env.MSN_API_V1_PH_ID}`,
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer: ${process.env.MSN_API_V1_TOKEN}`
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
					}
				}
			})
			console.log("WABA_MSN_SUCCESS", data)
		} catch (error: Error | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("WABA_MSN_SUCCESS", error.response?.data)
			}
		}
	}
	async sendMessage(recipient: string, message: string) {
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
		try {
			const { data } = await whatsapp.post("/messages", payLoad)
			console.log("WABA_MSN_SUCCESS", data)
		} catch (error: AxiosError | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("WABA_MSN_SUCCESS", error.response?.data)
			}
		}
	}
	async replyMessage(recipient: string, message: string, mainId: string) {
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
		if (mainId && mainId !== "") {
			payLoad.context = {
				"message_id": mainId
			}
		}
		try {
			const { data } = await whatsapp.post("/messages", payLoad)
			console.log("WABA_MSN_SUCCESS", data)
		} catch (error: AxiosError | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("WABA_MSN_SUCCESS", error.response?.data)
			}
		}
	}
}

export default new WhatsApp()
