import { Router as createRouter, type Request, type Response } from "express"
import { getFirestore } from "firebase-admin/firestore"

const msn = createRouter()

msn.get("/list-all", async (r, res) => {
	const list = await getFirestore().collection("waba").get()
	const data = list.docs.forEach((doc) => ({
		id: doc.id,
		...doc.data()
	}))
	res.json({
		data
	})
})

msn.all("/send-sms", (r: Request, res: Response) => {
	res.sendStatus(200)
})

msn.all("/send-whatsapp", (r: Request, res: Response) => {
	res.sendStatus(200)
})

msn.all("/send-telegram", (r: Request, res: Response) => {
	res.sendStatus(200)
})

export default msn
