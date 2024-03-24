import axios from "axios"

import type { Server } from "../../types/msn"

const whatsapp = axios.create({
	baseURL: `https://graph.facebook.com/v18.0/${process.env.MSN_API_V1_PH_ID}`,
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
		try {
			const { data } = await whatsapp.post("/messages", {
				"messaging_product": "whatsapp",
				"recipient_type": "individual",
				"to": recipient,
				"type": "text",
				"text": message
			})
			console.log("WABA_MSN_SUCCESS", data)
		} catch (error: Error | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("WABA_MSN_SUCCESS", error.response?.data)
			}
		}
	}
}

export default new WhatsApp()
