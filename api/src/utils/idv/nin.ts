/** @module utils/idv/nin */

import fs from "fs"
import path from "path"
import { getDownloadURL, getStorage } from "firebase-admin/storage"

import { INTL_DATE_FORMAT } from "../"
import type { NINDetails } from "../../types/idv"
import seamfix from "./seamfix"

export const sanifyDetails = async (details: NINDetails): Promise<NINDetails> => {
	const statics = await saveFilesLocal(details)
	const dateOfBirth = INTL_DATE_FORMAT.format(new Date(details.dateOfBirth))
	return {
		...details,
		...statics,
		dateOfBirth
	}
}

export const saveFilesLocal = async (data: NINDetails): Promise<NINDetails> => {
	const bucket = getStorage().bucket()
	const photoData = bucket.file(`cache/${data.ninNumber}.jpg`)
	await photoData.save(Buffer.from(data.photoData, "base64"))

	const qrCodeData = fs.readFileSync(path.resolve("static/qrcode.svg")).toString("utf-8")
	return {
		...data,
		photoData: await getDownloadURL(photoData),
		qrCodeData
	}
}

export const readDetailsMock = (ninNumber: string): NINDetails => {
	let data = JSON.parse(fs.readFileSync(path.resolve("mocks/nin-full-details.json")).toString("utf-8"))
	const details: NINDetails = data.response || data.data
	return seamfix.createNINDetails(ninNumber, details)
}

export default {}
