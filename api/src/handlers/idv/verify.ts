/** @module tools/idv/verify */

import { AuthData } from "../../types/app"
import type { BVNDetails, NINDetails } from "../../types/idv"
import { azure, seamfix } from "../../utils/idv"
import { getTransaction, putTransaction, saveFilesLocal } from "../../utils/idv/verify"

export const verifyByNIN = async (ninNumber: string): Promise<NINDetails> => (
	await seamfix.verifyNIN(ninNumber) as NINDetails
)

export const verifyByVNIN = async (ninNumber: string): Promise<NINDetails> => (
	await seamfix.verifyVNIN(ninNumber)
)

export const verifyByPhone = async (phoneNumber: string): Promise<NINDetails> => (
	await seamfix.verifyPNIN(phoneNumber)
)

export const verifyBVN = async (index: string, bvnNumber: string): Promise<BVNDetails> => {
	let data: BVNDetails
	if (index === "seamfix")
		data = await seamfix.verifyBVN(bvnNumber)
	else
		data = await azure.verifyBVN(bvnNumber)
	return data
}

export const handleVerifyNIN = async (auth: AuthData, data: object): Promise<string> => {
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
	return await putTransaction(details)
}

export const handleVerifyBVN = async (auth: AuthData, data: object): Promise<string> => {
	let { paramType, paramValue } = data as Record<string, string>
	paramType = String(paramType).trim().substring(10)
	paramValue = String(paramValue).trim().substring(0, paramType === "phone" ? 11 : 10)
	if (paramType === "bvn" && paramValue.length !== 11)
		throw new Error("invalid bvn number provided")
	let details: BVNDetails | object
	if (paramType === "phone") {
		details = await verifyBVN("azure", paramValue)
	} else {
		details = await verifyBVN("azure", paramValue)
	}
	return await putTransaction(details)
}

export const handleViewResult = async (auth: AuthData, data: object) => {
	let { transactionId, viewFormat } = data as Record<string, string>

	let viewId: string
	let result: object = await getTransaction(transactionId)
	if (viewFormat === "normal")
		viewId = "nin-normal"
	else if (viewFormat === "standard")
		viewId = "nin-standard"
	else if (viewFormat === "premium")
		viewId = "nin-premium"
	else {
		viewId = "raw-details"
		result = { data: result }
	}
	viewId = `prints/idv/${viewId}`

	return {
		viewId,
		result
	}
}

export default {}
