/** @module handlers/msn/media */

import whatsapp from "../../utils/msn/whatsapp"

export const getWhatsAppMedia = async (mediaId: string) => {
	const data = await whatsapp.getMediaFile(mediaId)
	return data
}

export default {}
