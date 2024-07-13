/** @module handlers/msn/media */

import whatsapp from "../../utils/msn/whatsapp"

export const getWhatsAppMedia = async (mediaId: string) => {
	return await whatsapp.getMedia(mediaId)
}

export default {}
