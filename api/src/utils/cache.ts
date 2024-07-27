/** @module utils/cache */

import { getFirestore } from "firebase-admin/firestore"
import { getDownloadURL, getStorage } from "firebase-admin/storage"

export const cacheFileData = async (key: string, data: any): Promise<string> => {
    const bucket = getStorage().bucket()
    // save photo as a file
    const handle = bucket.file(`cache/${key}`)
    await handle.save(data)
    // return a re-assigned object
    return await getDownloadURL(handle)
}

export const cacheRequest = async (r: string, data: Record<string, any>): Promise<void> => {
	await getFirestore().collection("data").doc().create({
		arg: r,
		ext: data,
		dat: Date.now()
	})
}

export const requestCache = async (r: string) : Promise<object | null> => {
	const store = getFirestore()
	const cache = await store.collection("data").where("arg", "==", r).select("ext").limit(1).get()
	if (!cache.empty)
		return { ...cache.docs[0].data().ext }
	return null
}

export const removeCache = async (r: string) => {
	const store = getFirestore()
	const cache = await store.collection("data").where("arg", "==", r).select("ext").limit(1).get()
	if (cache.empty)
		return false
	await cache.docs.forEach((doc) => doc.ref.delete())
	return true
}

export const clearCache = async (limit: number = 100) => {
	const store = getFirestore()
	const cache = await store.collection("data").limit(limit).get()
	if (cache.empty)
		return false
	await cache.docs.forEach((doc) => doc.ref.delete())
	return true
}

export default {}
