/** @module utils */

import { getAuth, type DecodedIdToken } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

export const INTL_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
	dateStyle: "long"
})

export const requestRef = () => {
	return (Math.random() * 1000000000).toFixed(10)
}

export const decodeToken = async (rawToken: string): Promise<DecodedIdToken> => {
	const token = await getAuth().verifyIdToken(rawToken)
	return token
}

export const cacheRequest = async (r: string, data: object) => {
	await getFirestore().collection("data").doc().create({
		url: r,
		arg: r,
		ext: data,
		dat: Date.now()
	})
}

export const requestCache = async (r: string) => {
	const store = getFirestore()
	const cache = await store.collection("data").where("arg", "==", r).select("ext").limit(1).get()
	if (!cache.empty)
		return { data: cache.docs[0].data().ext }
	return null
}
