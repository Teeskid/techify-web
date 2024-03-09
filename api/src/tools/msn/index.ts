import type { Channel } from "../../types/msn"
import { getServer } from "../../utils/msn"

export const sendText = async (index: Channel, recipient: string, message: string) => {
	const server = await getServer(index)
	await server.sendMessage(recipient, message)
	return {
		status: true,
		message: 'message sent successfully'
	}
}

export default {}
