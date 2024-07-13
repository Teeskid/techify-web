/** @module routes/idv/verify */

import { Router as createRouter } from "express";

import { handleVerifyBVN, handleVerifyNIN, handleViewResult } from "../../handlers/idv/verify";
import type { AuthData } from "../../types/app";

const verify = createRouter()

verify.get("/bvn", async (r, res) => {
	try {
		const { ...options } = r.body as object
		const transactionId = await handleVerifyBVN({} as AuthData, options)
		res.json({
			code: 200,
			data: transactionId
		})
	} catch (error: Error | unknown) {
		console.error(error)
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

verify.all("/nin", async (r, res) => {
	try {
		const { ...options } = Object.assign({}, r.query, r.body)
		const transactionId = await handleVerifyNIN({} as AuthData, options)
		res.json({
			code: 200,
			data: { transactionId }
		})
	} catch (error: Error | unknown) {
		console.error(error)
		res.json({
			code: 500,
			text: (error as Error).message
		})
	}
})

verify.get("/result", async (r, res) => {
	const { ...options } = r.query
	try {
		const { viewId, result } = await handleViewResult({} as AuthData, options)
		res.render(viewId, result)
	} catch (error: Error | unknown) {
		console.error(error)
		res.sendStatus(500)
	}
})

export default verify
