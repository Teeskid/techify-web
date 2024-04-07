/** @module utils/idv/nin */

import { getDownloadURL, getStorage } from "firebase-admin/storage"
import QRCode from "qrcode"

import type { NINDetails } from "../../types/idv"

export const saveFilesLocal = async (data: NINDetails): Promise<NINDetails> => {
	const bucket = getStorage().bucket()
	// save photo as a file
	const photoData = bucket.file(`cache/${data.ninNumber}.jpg`)
	await photoData.save(Buffer.from(data.photoData, "base64"))
	// save qr code as a file
	const qrCodeData = bucket.file(`cache/${data.ninNumber}-qr.png`)
	await qrCodeData.save(await QRCode.toBuffer(JSON.stringify({ nin: data.ninNumber })))
	// return a re-assigned object
	return Object.assign(data, {
		photoData: await getDownloadURL(photoData),
		qrCodeData: await getDownloadURL(qrCodeData)
	})
}

export default {}