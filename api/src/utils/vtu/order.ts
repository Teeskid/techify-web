import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { OrderConv } from "./convs";

/**
 * updates order status with target status
 * @param {string} ref
 * @param {string} status
 * @return {Promise<void>}
 */
export const updateOrder = async (ref: string, status: string): Promise<void> => {
	if (!ref || !status)
		throw new Error("invalid argument provided")
	const firestore = getFirestore()
	const searchQuery = firestore.collectionGroup("ivhs").withConverter(OrderConv).where("ref", "==", ref).select("ref", "sta")
	const searchOrder = await searchQuery.get()
	if (searchOrder.empty)
		throw new Error("failed to find transaction")
	const orderDoc = searchOrder.docs[0]
	const orderRef = orderDoc.ref
	const order = orderDoc.data()
	if (order.sta !== null)
		throw new Error("hook overriden")
	await orderRef.update({
		sta: Boolean(status.match(/success/)),
		dat: FieldValue.serverTimestamp()
	})
}
