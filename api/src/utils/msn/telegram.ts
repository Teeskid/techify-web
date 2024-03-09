import axios from "axios"

const telegram = axios.create({
	baseURL: 'https://flowxo.com/hooks/a/z68g3v6g',
	headers: {
		"Content-Type": "application/json",
	}
})

export class Telegram {
	async sendMessage(recipient: string, message: string) {
		try {
			const { data } = await telegram.request({
				params: {
					uid: recipient,
					msg: message
				}
			})
			console.log("TLG_MSN_SUCCESS", data)
		} catch(error: Error | unknown) {
			if (axios.isAxiosError(error)) {
				console.error("TLG_MSN_ERROR", error.response?.data)
			}
		}
	}
}

export default new Telegram()
