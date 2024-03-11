/** @module tools/vrf/nin */

import type { NINDetails } from "../../types/vrf"
import seamfix from "../../utils/vrf/seamfix"

export const verifyByNIN = async (ninNumber: string): Promise<NINDetails> => {
	const details = await seamfix.verifyNIN(ninNumber)
	return details
}

export const verifyByVNIN = async (ninNumber: string): Promise<NINDetails> => {
	const details = await seamfix.verifyVNIN(ninNumber)
	return details
}

export const verifyByPhone = async (phoneNumber: string) => {
	const details = await seamfix.verifyNIN2(phoneNumber)
	return details
}
