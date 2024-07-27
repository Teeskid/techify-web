/** @module handlers/idv/verify */

import { AuthData } from "../../types/app"
import type { BVNDetails, NINDetails } from "../../types/idv"
import { getTransaction, listTransactions, putTransaction, clearTransactions } from "../../utils/recents"
import { verifyByNIN, verifyByVNIN, verifyByBVN, verifyByPhone } from "../../utils/idv/verify"

export const VerifyBVN = async (auth: AuthData, data: object) => {
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
	return {
		ref: await putTransaction(details),
		res: details
	}
}

export const VerifyNIN = async (auth: AuthData, data: object) => {
	let { paramType, paramValue } = data as Record<string, string>
	paramType = String(paramType).trim()
	paramValue = String(paramValue).trim()
	let details: NINDetails
	switch (paramType) {
		case "nin":
			if (paramValue.startsWith("0"))
				return null
			details = await verifyByNIN(paramValue)
			break
		case "vnin":
			details = await verifyByVNIN(paramValue)
			break
		case "phone":
			if (!paramValue.startsWith("0"))
				return null
			details = await verifyByPhone(paramValue)
			break
		default:
			return null
	}
	return {
		ref: await putTransaction(details),
		res: details
	}
}

export const ViewRecents = async (auth: AuthData, data: object) => {
	let { page } = data as Record<string, string | number>
	page = Number.parseInt(page as string)
	if (page)
		throw new Error("invalid paging provided")
	return await listTransactions()
}

export const ClearRecents = async (auth: AuthData, data: object) => {
	await clearTransactions()
}

export const ViewResult = async (auth: AuthData, data: object) => {
	let { ref, dsp } = data as Record<string, string>
	// find the suitable view
	let result: object = await getTransaction(ref)
	if (result === null)
		return null
	let viewId: string
	if (dsp === "normal")
		viewId = "nin-normal"
	else if (dsp === "standard")
		viewId = "nin-standard"
	else if (dsp === "premium")
		viewId = "nin-premium"
	else {
		viewId = "../../raw-data"
		result = { data: result }
	}
	// form and return results
	viewId = `prints/idv/${dsp}`
	return {
		ref,
		res: result,
		vid: viewId,
	}
}

export default {}
