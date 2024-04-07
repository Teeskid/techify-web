/** @module utils/idv/bvn */

import fs from "fs"
import path from "path"

import type { BVNDetails } from "../../types/idv";
import { INTL_DATE_FORMAT } from "../"

export const sanifyDetails = (details: object): BVNDetails => {
	const statics = saveStatic(details as BVNDetails)
	const dateOfBirth = INTL_DATE_FORMAT.format(new Date("05-10-1990"))
	return {
		...details,
		...statics,
		dateOfBirth
	}
}

export const saveStatic = (data: BVNDetails): BVNDetails => {
	const photoData = fs.readFileSync(path.resolve("static/photo.base64")).toString("utf-8")
	const qrCodeData = fs.readFileSync(path.resolve("static/qrcode.svg")).toString("utf-8")
	return {
		...data,
		photoData,
		qrCodeData
	}
}

export default {}
