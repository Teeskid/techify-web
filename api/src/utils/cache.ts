/** @module utils/cache */

import { getFirestore } from "firebase-admin/firestore"
import { getDownloadURL, getStorage } from "firebase-admin/storage"
import QRCode from "qrcode"

import type { NINDetails, BVNDetails } from "../types/idv"

export const cacheRequest = async (r: string, data: object) => {
	await getFirestore().collection("data").doc().create({
		arg: r,
		ext: data,
		dat: Date.now()
	})
}

export const requestCache = async (r: string) => {
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

export const savePhotoLocal = async (data: NINDetails | BVNDetails): Promise<object> => {
    const bucket = getStorage().bucket()
    // save photo as a file
    const photoData = bucket.file(`cache/${data.ninNumber}.jpg`)
    await photoData.save(Buffer.from(data.photoData, "base64"))
    // return a re-assigned object
    return Object.assign(data, {
        photoData: await getDownloadURL(photoData),
    })
}

export const saveFilesLocal = async (data: NINDetails): Promise<NINDetails> => {
    const bucket = getStorage().bucket()
    // save photo as a file
    const photoData = bucket.file(`cache/${data.ninNumber}.jpg`)
    await photoData.save(Buffer.from(data.photoData, "base64"))
    // save qr code as a file
    const qrCodeData = bucket.file(`cache/${data.ninNumber}-qr.png`)
    await qrCodeData.save(await QRCode.toBuffer(`${data.firstName} ${data.middleName || "\b"} ${data.lastName} | NIN: ${data.ninNumber}`, {
        margin: 0,
        maskPattern: 1,
        type: "png",
    }))
    // return a re-assigned object
    return Object.assign(data, {
        photoData: await getDownloadURL(photoData),
        qrCodeData: await getDownloadURL(qrCodeData)
    })
}

export default {}
