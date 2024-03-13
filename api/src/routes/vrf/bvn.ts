/** @module routes/vrf/bvn */

import { Router as createRouter, type Request, type Response } from "express";

import { verifyBVN } from "../../tools/vrf/bvn"

const bvn = createRouter()

bvn.get("/", (r, res) => {
	res.sendStatus(200)
})

bvn.get("/match", async (r: Request, res: Response) => {
	res.json({ code: 200, text: "success" })
})

bvn.get("/details", async (r: Request, res: Response) => {
	const isDisplay = String(r.query.isDisplay).trim()
	const bvnNumber = String(r.query.bvnNumber).trim()
	try {
		if (bvnNumber.length !== 11) {
			res.json({
				code: 401,
				text: "invalid bvn number provided"
			})
			return
		}
		const data = await verifyBVN("seamfix", bvnNumber)
		if (isDisplay === "html") {
			res.render("vrf/bvn-slip", data)
		} else {
			res.json(data)
		}
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

export default bvn
