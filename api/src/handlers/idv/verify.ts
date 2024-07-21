/** @module handlers/idv/verify */

import { AuthData } from "../../types/app"
import type { BVNDetails, NINDetails } from "../../types/idv"
import { getTransaction, putTransaction } from "../../utils/recents"
import { verifyByNIN, verifyByVNIN, verifyByBVN, verifyByPhone } from "../../utils/idv/verify"
import { saveFilesLocal } from "../../utils/cache"

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
		details = await verifyByBVN("azure", paramValue)
	} else {
		details = await verifyByBVN("azure", paramValue)
	}
	return await putTransaction(details)
}

export const handleViewResult = async (auth: AuthData, data: object) => {
	let { transactionId, viewFormat } = data as Record<string, string>
	// find the suitable view
	let viewId: string
	let result: object = await getTransaction(transactionId)
	if (viewFormat === "normal")
		viewId = "nin-normal"
	else if (viewFormat === "standard")
		viewId = "nin-standard"
	else if (viewFormat === "premium")
		viewId = "nin-premium"
	else {
		viewId = "../../raw-data"
		result = { data: result }
	}
	// form and return results
	viewId = `prints/idv/${viewId}`
	return {
		viewId,
		result
	}
}

export default {}
