/** @module handlers/app/misc */

import type { Request, Response } from "express"

import { clearCache } from "../../utils/cache";

export const ClearCache = async (r: Request, res: Response) => {
	try {
		await clearCache(100)
		res.json({
			code: 200,
			text: "cache clear success"
		})
	} catch (error: Error | unknown) {
		res.sendStatus(500)
	}
}

export default {}
