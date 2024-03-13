/** @module utils/vrf/bvn */

import fs from "fs"
import path from "path"

import type { BVNDetails } from "../../types/vrf";
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

export const readBVNMock = (bvnNumber: string): BVNDetails => {
	const data = JSON.parse(fs.readFileSync(path.resolve("mocks/bvn-full-details.json")).toString("utf-8")).response as BVNDetails
	return {
		firstName: data.firstName,
		middleName: data.middleName,
		lastName: data.lastName,
		dateOfBirth: data.dob,
		dateOfReg: data.registrationDate,
		email: data.email,
		gender: data.gender,
		phone: data.phone,
		alternatePhone: data.alternatePhone,
		country: data.country,
		stateOfOrigin: data.stateOfOrigin,
		addressLine3: data.addressLine3,
		maritalStatus: data.maritalStatus,
		photoData: data.avatar,
		bvnNumber,
	}
}
