import { Router as createRouter, type Request, type Response } from "express";

import { verifyBVN } from "../../tools/vrf/bvn"

const bvn = createRouter()

bvn.get("/", (r, res) => {
	res.sendStatus(200)
})

bvn.get("/data", async (r: Request, res: Response) => {
	const bvnNumber = String(r.query.bvnNumber).trim()
	try {
		if (bvnNumber.length !== 11) {
			res.json({
				code: 401,
				text: "invalid bvn number provided"
			})
			return
		}
		const data = await verifyBVN("azure", bvnNumber)
		res.json(data)
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

export default bvn
