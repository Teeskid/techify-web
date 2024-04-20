import { Router as createRouter } from "express"
import { getFirestore } from "firebase-admin/firestore"

import { getWhatsAppMedia } from "../../handlers/msn"

const inbox = createRouter()

inbox.get("/get-media", async (r, res) => {
    const media = await getWhatsAppMedia(r.query.mediaId as string)
    res.json({
        code: 200,
        data: media
    })
})

inbox.get("/list-all", async (r, res) => {
	const list = await getFirestore().collection("waba").get()
	const data = list.docs.forEach((doc) => ({
		id: doc.id,
		...doc.data()
	}))
	res.json({
		data
	})
})

export default inbox
