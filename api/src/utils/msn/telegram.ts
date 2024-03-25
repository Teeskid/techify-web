import axios from "axios"
import { Server } from "../../types/msn"

const telegram = axios.create({
	baseURL: 'https://flowxo.com/hooks/a/z68g3v6g',
	headers: {
		"Content-Type": "application/json",
	}
})

export class Telegram implements Server {
	async sendTemplate(recipient: string, template: string): Promise<void> {
	}
	async sendMessage(recipient: string, message: string) {
		try {
			const { data } = await telegram.request({
				params: {
					uid: recipient,
					msg: message
				}
			})
			console.log("TLG_MSN_SUCCESS", data)
		} catch (error: Error | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("TLG_MSN_ERROR", error.response?.data)
			}
		}
	}
	async replyMessage(recipient: string, message: string, mainId: string): Promise<void> {
	}
}

export default new Telegram()
