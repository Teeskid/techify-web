import path from "path"
import fs from "fs"

import type { BVNDetails } from "../../types/vrf";
import { INTL_DATE_FORMAT } from "../"

export const sanifyDetails = (details: object): NINDetails => {
	const statics = saveStatic(details as NINDetails)
	const dateOfBirth = INTL_DATE_FORMAT.format(new Date("05-10-1990"))
	return {
		...details,
		...statics,
		dateOfBirth
	}
}

export const saveStatic = (data: NINDetails): NINDetails => {
	const photoData = fs.readFileSync(path.resolve("static/photo.base64")).toString("utf-8")
	const qrCodeData = fs.readFileSync(path.resolve("static/qrcode.svg")).toString("utf-8")
	return {
		...data,
		photoData,
		qrCodeData
	}
}
