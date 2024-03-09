import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { OrderConv } from "./convs";

/**
 * Generic Hooks resolver
 * @param {string} status
 * @param {string} reference
 * @param {Response} res
 * @return {Promise<void>}
 */
export const updateOrder = async (status: string, reference: string): Promise<void> => {
	if (!status || !reference)
		throw new Error('invalid argument')
	const firestore = getFirestore()
	const itemDoc = (await firestore.collectionGroup("ivhs").withConverter(OrderConv).where('ref', '==', reference).select('ref', 'sta').get()).docs[0]
	if (!itemDoc)
		throw new Error('failed to find transaction')
	const itemRef = itemDoc.ref
	const item = itemDoc.data()
	if (item.sta !== null)
		throw new Error('hook overriden')
	await itemRef.update({
		sta: Boolean(status.match(/success/)),
		dat: FieldValue.serverTimestamp()
	})
}
