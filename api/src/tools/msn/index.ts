import type { Channel } from "../../types/msn"
import { getServer } from "../../utils/msn"

export const sendText = async (index: Channel, recipient: string, message: string) => {
	const server = getServer(index)
	await server.sendMessage(recipient, message)
	return {
		status: true,
		message: 'message sent successfully'
	}
}

export const replyText = async (index: Channel, recipient: string, message: string, mainId: string) => {
	const server = getServer(index)
	await server.replyMessage(recipient, message, mainId)
	return {
		status: true,
		message: 'message sent successfully'
	}
}

export default {}
