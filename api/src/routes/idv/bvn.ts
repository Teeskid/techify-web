/** @module routes/idv/bvn */

import { Router as createRouter } from "express";

import { verifyRequest } from "../../tools/idv/bvn";

const bvn = createRouter()

bvn.get("/", (r, res) => {
	res.sendStatus(200)
})

bvn.get("/details", async (r, res) => {
	try {
		const details = await verifyRequest(r)
		res.json(details)
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

bvn.get("/normal", async (r, res) => {
	try {
		const details = await verifyRequest(r)
		res.render("idv/bvn-slip", details)
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

export default bvn
