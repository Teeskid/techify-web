/** @module tools/idv/verify */


import { AuthData } from "../../types/app"
import type { BVNDetails, NINDetails } from "../../types/idv"
import azure from "../../utils/idv/azure"
import { saveFilesLocal } from "../../utils/idv/nin"
import seamfix from "../../utils/idv/seamfix"

export const verifyByNIN = async (ninNumber: string): Promise<NINDetails> => (
	await seamfix.verifyNIN(ninNumber) as NINDetails
)

export const verifyByVNIN = async (ninNumber: string): Promise<NINDetails> => {
	return await seamfix.verifyVNIN(ninNumber)
}

export const verifyByPhone = async (phoneNumber: string): Promise<NINDetails> => {
	return await seamfix.verifyPNIN(phoneNumber)
}

export const verifyBVN = async (index: string, bvnNumber: string): Promise<BVNDetails> => {
	let data: BVNDetails
	if (index === "seamfix")
		data = await seamfix.verifyBVN(bvnNumber)
	else
		data = await azure.verifyBVN(bvnNumber)
	return data
}

export const verifyNINDetails = async (auth: AuthData, data: object): Promise<NINDetails> => {
	let { paramType, paramValue } = data as Record<string, string>
	paramType = String(paramType).trim().substring(10)
	paramValue = String(paramValue).trim().substring(0, paramType === "vnin" ? 16 : 11)
	let details: NINDetails
	if (paramType === "vnin") {
		details = await verifyByVNIN(paramValue)
	} else if (paramType === "phone") {
		details = await verifyByPhone(paramValue)
	} else {
		details = await verifyByNIN(paramValue)
	}
	details = await saveFilesLocal(details)
	return details
}

export const verifyBVNDetails = async (auth: AuthData, data: object): Promise<BVNDetails | object> => {
	let { paramType, paramValue } = data as Record<string, string>
	paramType = String(paramType).trim().substring(10)
	paramValue = String(paramValue).trim().substring(0, paramType === "phone" ? 11 : 10)
	if (paramType === "bvn" && paramValue.length !== 11) {
		return {
			code: 401,
			text: "invalid bvn number provided"
		}
	}
	let details: BVNDetails | object
	if (paramType === "phone") {
		details = await verifyBVN("azure", paramValue)
	} else {
		details = await verifyBVN("azure", paramValue)
	}
	return details
}

export default {}
