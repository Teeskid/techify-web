// import fs from "fs"
// import path from "path"
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
		ext: data,
		dat: Date.now()
	})
}
