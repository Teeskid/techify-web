/** @module tools/idv/nin */

import { type Request } from "express"

import type { NINDetails } from "../../types/idv"
import { readDetailsMock } from "../../utils/idv/nin"
import seamfix from "../../utils/idv/seamfix"

export const verifyByNIN = async (ninNumber: string): Promise<NINDetails> => {
	return await seamfix.verifyNIN(ninNumber)
}

export const verifyByVNIN = async (ninNumber: string): Promise<NINDetails> => {
	return await seamfix.verifyVNIN(ninNumber)
}

export const verifyByPhone = async (phoneNumber: string): Promise<NINDetails> => {
	return await seamfix.verifyPNIN(phoneNumber)
}

export const verifyRequest = async (r: Request): Promise<NINDetails> => {
	const paramType = String(r.query.paramType).trim().substring(10)
	const paramValue = String(r.query.paramValue).trim().substring(0, paramType === "vnin" ? 16 : 11)
	let details: NINDetails
	if (paramType === "vnin") {
		details = await verifyByVNIN(paramValue)
	} else if (paramType === "phone") {
		details = await verifyByPhone(paramValue)
	} else {
		if (true)
			details = await verifyByNIN(paramValue)
		else
			details = readDetailsMock(paramValue)
	}
	return details
}
