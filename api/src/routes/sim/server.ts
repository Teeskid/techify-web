import { Router as createRouter } from "express";

const server = createRouter();

server.get("/", (r, res) => {
	res.sendStatus(200)
})

server.get("/:id/", (r, res) => {
	res.sendStatus(200)
})

server.get("/:id/status", (r, res) => {
	res.sendStatus(200)
})

server.get("/:id/start", (r, res) => {
	res.sendStatus(200)
})

server.get("/:id/stop", (r, res) => {
	res.sendStatus(200)
})

server.route("/:id/sms").get((r, res) => {
	const data: object[] = []
	
	// return the json data
	res.json({
		data: data
	})
}).post((r, res) => {
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

server.route("/:id/ussd").get((r, res) => {
	const data: object[] = []

	// return the json data
	res.json({
		data: data
	})
}).post((r, res) => {
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

export default server
