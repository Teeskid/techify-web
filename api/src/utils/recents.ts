/** @module utils/recents */

import { getFirestore } from "firebase-admin/firestore"

export const getTransaction = async (key: string): Promise<object> => {
    const store = getFirestore()
    const resultDoc = await store.collection("_idv").doc(key).get()
    if (!resultDoc.exists)
        throw new Error("transaction record has been deleted")
    return { ...resultDoc.data() }
}

export const putTransaction = async (data: any): Promise<string> => {
    const store = getFirestore()
    const result = store.collection("_idv").doc()
    await result.create(data)
    return result.id
}

export const delTransaction = async (key: string): Promise<void> => {
    const store = getFirestore()
    const result = store.collection("_idv").doc(key)
    await result.delete()
}

export default {}
