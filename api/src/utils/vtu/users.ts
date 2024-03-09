import { getFirestore } from "firebase-admin/firestore"

export const getUidForNuban = async (index: string, nuban: string) => {
	const firestore = getFirestore()
	const searchRef = firestore.collection("uwlts").where(`${index}.nuban`, '==', nuban).limit(1)
	const { docs } = await searchRef.get()
	if (docs.length <= 1)
		throw new Error('failed to find uid')
	return docs[0].ref.id
}
