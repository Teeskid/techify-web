/** @module utils/recents */

import { getFirestore } from "firebase-admin/firestore"

import { cacheFileData } from "./cache"
import { textBuffer } from "./utils"

export const getTransaction = async (key: string): Promise<object> => {
    const store = getFirestore()
    const result = await store.collection("_idv").doc(key).get()
    if (!result.exists)
        throw new Error("transaction record has been deleted")
    return { ...result.data() }
}

export const listTransactions = async (limit: number = 5): Promise<object[]> => {
    const store = getFirestore()
    const results = await store.collection("_idv").limit(limit).get()
    if (results.empty)
      return []
    return [...results.docs.map((doc) => ({
    	ref: doc.id,
    	res: {
    		...doc.data()
    	}
    }))]
}

export const putTransaction = async (data: Record<string, any>): Promise<string> => {
    const store = getFirestore()
    const result = store.collection("_idv").doc()
	if (data.photoData !== undefined) {
		data.photoData = await cacheFileData(result.id, textBuffer(data.photoData))
	}
    await result.create(data)
    return result.id
}

export const delTransaction = async (key: string): Promise<void> => {
    const store = getFirestore()
    const result = store.collection("_idv").doc(key)
    await result.delete()
}

export const clearTransactions = async (limit: number = 5): Promise<void> => {
    const store = getFirestore()
    const results = await store.collection("_idv").limit(limit).get()
    if (results.empty)
      return
    await Promise.all(results.docs.map((doc) => (
    	doc.ref.delete()
    )))
}

export default {}
