import { Router as createRouter } from "express";

import { verifyRequest } from "../../tools/idv/nin";

const nin = createRouter()

nin.get("/", (r, res) => {
	res.sendStatus(200)
})

nin.get("/details", async (r, res) => {
	const details = await verifyRequest(r)
	res.json({
		code: 200,
		data: details
	})
})

nin.get("/normal", async (r, res) => {
	const details = await verifyRequest(r)
	res.render("idv/nin-normal", details)
})

nin.get("/standard", async (r, res) => {
	const details = await verifyRequest(r)
	res.render("idv/nin-standard", details)
})

nin.get("/premium", async (r, res) => {
	const details = await verifyRequest(r)
	res.render("idv/nin-premium", details)
})

export default nin
