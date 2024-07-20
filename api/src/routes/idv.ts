/** @module routes/idv */

import { Router as createRouter  } from "express";
import { getStorage } from "firebase-admin/storage";

import { handleVerifyBVN, handleVerifyNIN, handleViewResult } from "../handlers/idv/verify";
import type { AuthData } from "../types/app";

const idv = createRouter()

idv.get("/verify-bvn", async (r, res) => {
	try {
		const { ...options } = Object.assign({}, r.query, r.body)
		const transactionId = await handleVerifyBVN({} as AuthData, options)
		res.json({
			code: 200,
			data: transactionId
		})
	} catch (error: Error | unknown) {
		console.error("IDV-BVN", error)
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

idv.all("/verify-nin", async (r, res) => {
	try {
		const { ...options } = Object.assign({}, r.query, r.body)
		const transactionId = await handleVerifyNIN({} as AuthData, options)
		res.json({
			code: 200,
			data: { transactionId }
		})
	} catch (error: Error | unknown) {
		console.error("IDV-NIN", error)
		res.json({
			code: 500,
			text: (error as Error).message
		})
	}
})

idv.get("/view-media", async (r, res) => {
    try {
        const { id } = Object.assign({}, r.query)
        const media = getStorage().bucket().file(`cache/${id}`)
        const stream = media.createReadStream()
        res.send(stream)
    } catch (error: Error | unknown) {
        console.error("IDV-QRC", error)
        res.sendStatus(500)
    }
})

idv.get("/view-result", async (r, res) => {
	const { ...options } = Object.assign({}, r.query)
	try {
		const { viewId, result } = await handleViewResult({} as AuthData, options)
		res.render(viewId, result)
	} catch (error: Error | unknown) {
		console.error("IDV-RES", error)
		res.sendStatus(500)
	}
})

export default idv
