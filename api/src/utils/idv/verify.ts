/** @module utils/idv/verify */

import type { BVNDetails, NINDetails } from "../../types/idv"
import azure from "./azure"
import seamfix from "./seamfix"

export const verifyByNIN = async (ninNumber: string): Promise<NINDetails> => (
	await seamfix.verifyNIN(ninNumber) as NINDetails
)

export const verifyByVNIN = async (ninNumber: string): Promise<NINDetails> => (
	await seamfix.verifyVNIN(ninNumber)
)

export const verifyByPhone = async (phoneNumber: string): Promise<NINDetails> => (
	await seamfix.verifyPNIN(phoneNumber)
)

export const verifyByBVN = async (index: string, bvnNumber: string): Promise<BVNDetails> => {
	let data: BVNDetails
	if (index === "seamfix")
		data = await seamfix.verifyBVN(bvnNumber)
	else
		data = await azure.verifyBVN(bvnNumber)
	return data
}

export default {}
