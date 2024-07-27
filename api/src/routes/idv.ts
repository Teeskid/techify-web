/** @module routes/idv */

import { Router as createRouter  } from "express";
import { getStorage } from "firebase-admin/storage";

import { VerifyBVN, VerifyNIN, ViewRecents, ViewResult, ClearRecents } from "../handlers/idv/verify";
import type { AuthData } from "../types/app";

const idv = createRouter()

idv.get("/verify-bvn", async (r, res) => {
	try {
		const options = { ...r.query, ...r.body }
		const data = await VerifyBVN({} as AuthData, options)
		if (data === null) {
			res.json({
				code: 400,
				text: "bvn details not found"
			})
			return
		}
		res.json({
			code: 200,
			data
		})
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

idv.all("/verify-nin", async (r, res) => {
	try {
		const options = { ...r.query, ...r.body }
		const data = await VerifyNIN({} as AuthData, options)
		if (data === null) {
			res.json({
				code: 400,
				text: "details not found"
			})
			return
		}
		res.json({
			code: 200,
			data
		})
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			text: (error as Error).message
		})
	}
})

idv.get("/view-recents", async (r, res) => {
	try {
		const options = { ...r.query, ...r.body }
		const data = await ViewRecents({} as AuthData, options)
		if (data.length === 0) {
			res.json({
				code: 201,
				text: "no record found"
			})
			return
		}
		res.json({
			code: 200,
			data
		})
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			text: (error as Error).message
		})
	}
})

idv.get("/clear-recents", async (r, res) => {
	try {
		const options = { ...r.query }
		await ClearRecents({} as AuthData, options)
		res.json({
			code: 200,
			text: "recents cleared"
		})
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			text: (error as Error).message
		})
	}
})

idv.get("/view-result", async (r, res) => {
	const options = { ...r.query }
	try {
		const data = await ViewResult({} as AuthData, options)
		if (data === null) {
			res.sendStatus(400)
			return
		}
		res.render(data.vid, data.res)
	} catch (error: Error | unknown) {
		res.sendStatus(500)
	}
})

idv.get("/view-media", async (r, res) => {
    try {
		const options = { ...r.query }
        const media = getStorage().bucket().file(`cache/${options.id}`)
        const stream = media.createReadStream()
        res.send(stream)
    } catch (error: Error | unknown) {
        console.error("IDV-QRC", error)
        res.sendStatus(500)
    }
})

export default idv
