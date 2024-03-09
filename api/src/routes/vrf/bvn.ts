import axios from 'axios';
import { Router as createRouter, type Request, type Response } from "express";

const bvn = createRouter()

bvn.get("/", (r, res) => {
	res.sendStatus(200)
})

bvn.get("/data", async (r: Request, res: Response) => {
	const bvnNumber = String(r.query.bvnNumber).trim()
	try {
		const { data } = await axios.post("https://nmfbnode.azurewebsites.net/api/v1/bvnvalidationsimple/", {
			bvn: bvnNumber
		}, {
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
		})
		res.json(data)
	} catch (error: Error | unknown) {
		let message: string
		if (axios.isAxiosError(error)) {
			message = error?.response?.data || error?.message
		} else {
			message = (error as Error).message
		}
		res.json({
			code: 500,
			error: message
		})
	}
})

export default bvn
