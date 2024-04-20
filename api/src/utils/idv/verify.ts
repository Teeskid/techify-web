import { getFirestore } from "firebase-admin/firestore"
import { getDownloadURL, getStorage } from "firebase-admin/storage"
import moment from "moment"
import QRCode from "qrcode"

import type { NINDetails } from "../../types/idv"
import { DATE_FORMAT } from "../../utils/constants"

export const formatDate = (date: Date | string) => {
    return moment(new Date(date)).format(DATE_FORMAT)
}

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
