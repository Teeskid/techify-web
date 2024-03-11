/** @module tools/vrf/bvn */

import seamfix from "../../utils/vrf/seamfix"
import azure from "../../utils/vrf/azure"

export const verifyBVN = async (index: string, bvnNumber: string) => {
	let data: object
	if (index === "azure")
		data = await azure.verifyBVN(bvnNumber)
	else
		data = await seamfix.verifyBVN3(bvnNumber)
	return data
}

export default {}
