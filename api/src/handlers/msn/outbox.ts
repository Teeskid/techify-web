/** @module handlers/msn/outbox */

import type { Channel } from "../../types/msn"
import { getServer } from "../../utils/msn"

export const sendText = async (index: Channel, recipient: string, message: string, context?: string) => {
	const server = getServer(index)
	return await server.sendMessage(recipient, message, context)
}

export const sendTemplate = async (index: Channel, recipient: string, template: string, context?: string) => {
	const server = getServer(index)
	return await server.sendTemplate(recipient, template, context)
}

export default {}
