/** @module utils/idv/verify */

import type { BVNDetails, NINDetails } from "../../types/idv"
import azure from "./azure"
import seamfix from "./seamfix"

export const verifyByNIN = async (paramValue: string): Promise<NINDetails> => (
	await seamfix.verifyNIN(paramValue) as NINDetails
)

export const verifyByVNIN = async (paramValue: string): Promise<NINDetails> => (
	await seamfix.verifyVNIN(paramValue)
)

export const verifyByPhone = async (paramValue: string): Promise<NINDetails> => (
	await seamfix.verifyPNIN(paramValue)
)

export const verifyByBVN = async (index: string, paramValue: string): Promise<BVNDetails> => {
	let data: BVNDetails
	if (index === "seamfix")
		data = await seamfix.verifyBVN2(paramValue)
	else
		data = await azure.verifyBVN(paramValue)
	return data
}

export default {}
