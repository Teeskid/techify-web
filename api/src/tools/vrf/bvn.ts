/** @module tools/vrf/bvn */

import type { BVNDetails } from "../../types/vrf"
import { readBVNMock } from "../../utils/vrf/bvn"
import seamfix from "../../utils/vrf/seamfix"
import azure from "../../utils/vrf/azure"

export const verifyBVN = async (index: string, bvnNumber: string): Promise<BVNDetails> => {
	let data: BVNDetails
	if (index === "azure")
		data = await azure.verifyBVN(bvnNumber)
	else if (index === "seamfix")
		data = await seamfix.verifyBVN3(bvnNumber)
	else
		data = readBVNMock(bvnNumber)
	return data
}

export default {}
