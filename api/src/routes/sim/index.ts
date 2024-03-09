import { Router as createRouter, type Request, type Response } from "express"

type IDR = {
	id: string
}

const uid = createRouter()
const sim = createRouter()

uid.get("/", (r, res: Response) => {
	res.sendStatus(200)
})

uid.route("/sms").get((r: Request<IDR>, res) => {
	const data: object[] = []
	
	// return the json data
	res.json({
		data: data
	})
}).post((r: Request<IDR>, res) => {
	res.sendStatus(200)

	console.log('SEND-SMS-REQ', r.params, r.query)

	const userId = r.params.id
	const { recipent, message, retry } = r.body

	console.error("UNIMPLEMENTED")

	res.json({
		userId,
		recipent,
		message,
		retry
	})
})

uid.route("/ussd").get((r: Request<IDR>, res) => {
	const data: object[] = []

	// return the json data
	res.json({
		data: data
	})
}).post((r: Request<IDR>, res) => {
	res.sendStatus(200)

	console.log('RUN-USSD-REQ', r.params, r.query)

	const userId = r.params.id
	const { codeId, relay, retry } = r.body

	console.error("UNIMPLEMENTED")

	res.json({
		userId,
		codeId,
		relay,
		retry
	})
})

sim.get("/", (r, res) => {
	res.sendStatus(200)
})
sim.use("/:id", uid)

export default sim
