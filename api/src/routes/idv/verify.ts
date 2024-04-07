/** @module routes/idv/verify */

import { Router as createRouter } from "express";

import { __ } from "../../tools";
import { verifyBVNDetails, verifyNINDetails } from "../../tools/idv/verify";
import type { AuthData } from "../../types/app";

const verify = createRouter()

verify.get("/", __)

verify.get("/bvn", async (r, res) => {
	try {
		const details = await verifyBVNDetails({} as AuthData, r.body)
		const { viewFormat } = r.body
		if (viewFormat === "normal")
			res.render("idv/bvn-slip", details, (err, html) => {
				res.json({
					code: 200,
					data: html
				})
			})
		else
			res.json({
				code: 200,
				data: details
			})
	} catch (error: Error | unknown) {
		res.json({
			code: 500,
			error: (error as Error).message
		})
	}
})

verify.post("/nin", async (r, res) => {
	const { viewFormat, ...options } = r.body
	try {
		const details = await verifyNINDetails({} as AuthData, options)
		if (viewFormat === "normal")
			res.render("idv/nin-normal", details, (err, html) => {
				if (err)
					throw err
				res.json({
					code: 200,
					data: html
				})
			})
		else if (viewFormat === "standard")
			res.render("idv/nin-standard", details, (err, html) => {
				if (err)
					throw err
				res.json({
					code: 200,
					data: html
				})
			})
		else if (viewFormat === "premium")
			res.render("idv/nin-premium", details, (err, html) => {
				if (err)
					throw err
				res.json({
					code: 200,
					data: html
				})
			})
		else
			res.json({
				code: 200,
				data: JSON.stringify(details)
			})
	} catch (error: Error | unknown) {
		console.error(error)
		res.json({
			code: 500,
			text: (error as Error).message
		})
	}
})

export default verify