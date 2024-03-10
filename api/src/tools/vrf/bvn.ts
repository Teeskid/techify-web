/** @module tools/vrf/bvn */

import { getFirestore } from "firebase-admin/firestore"

import seamfix from "../../utils/vrf/seamfix"
import azure from "../../utils/vrf/azure"

export const verifyBVN = async (index: string, bvnNumber: string) => {
	let data: object
	if (index === "azure")
		data = await azure.verifyBVN(bvnNumber)
	else
		data = await seamfix.verifyBVN(bvnNumber)
	await getFirestore().collection("data").doc().create({
		cat: 'vrf/bvn',
		arg: bvnNumber,
		ext: JSON.stringify(data)
	})
	return data
}

export default {}
