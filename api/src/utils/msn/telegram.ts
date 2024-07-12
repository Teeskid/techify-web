import axios from "axios"
import { Server } from "../../types/msn"

const telegram = axios.create({
	baseURL: 'https://flowxo.com/hooks/a/z68g3v6g',
	headers: {
		"Content-Type": "application/json",
	}
})

export class Telegram implements Server {
	async sendTemplate(recipient: string, template: string): Promise<string | false> {
		return false
	}
	async sendMessage(recipient: string, message: string): Promise<string | false> {
		try {
			const { data } = await telegram.request({
				params: {
					uid: recipient,
					msg: message
				}
			})
			return data ? "success" : false
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

export default new Telegram()
