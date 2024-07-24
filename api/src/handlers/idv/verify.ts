/** @module handlers/idv/verify */

import { AuthData } from "../../types/app"
import type { BVNDetails, NINDetails } from "../../types/idv"
import { getTransaction, putTransaction } from "../../utils/recents"
import { verifyByNIN, verifyByVNIN, verifyByBVN, verifyByPhone } from "../../utils/idv/verify"
import { saveFilesLocal } from "../../utils/cache"

export const handleVerifyNIN = async (auth: AuthData, data: object) => {
	let { paramType, paramValue } = data as Record<string, string>
	paramType = String(paramType).trim()
	paramValue = String(paramValue).trim()
	let details: NINDetails
	switch (paramType) {
		case "vnin":
			details = await verifyByVNIN(paramValue)
			break
		case "nin":
			if (paramValue.startsWith("0"))
				return null
			details = await verifyByNIN(paramValue)
			break
		case "phone":
			if (!paramValue.startsWith("0"))
				return null
			details = await verifyByPhone(paramValue)
			break
		default:
			return null
	}
	details = await saveFilesLocal(details)
	return {
		transactionId: await putTransaction(details)
	}
}

export const handleVerifyBVN = async (auth: AuthData, data: object) => {
	let { paramType, paramValue } = data as Record<string, string>
	paramType = String(paramType).trim()
	paramValue = String(paramValue).trim()
	if (paramType === "bvn" && paramValue.length !== 11)
		throw new Error("invalid bvn number provided")
	let details: BVNDetails
	switch (paramType) {
		case "bvn":
			if (paramValue.startsWith("0"))
				return null
			details = await verifyByBVN("seamfix", paramValue)
			break
		case "phone":
			if (!paramValue.startsWith("0"))
				return null
			details = await verifyByBVN("seamfix", paramValue)
			break
		default:
			return null
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
