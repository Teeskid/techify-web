import { Router as createRouter, type Request, type Response } from "express";

import { updateOrder } from "../../../utils/vtu/order";

const vtu = createRouter();

/**
 * Web Hook For Product V1 API
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
vtu.all('/maskawasub', async (req: Request, res: Response): Promise<void> => {
	// respond early
	res.sendStatus(200)
	
	const status = String(req.body['Status']).trim()
	const reference = String(req.body['ident']).trim()
	try {
		await updateOrder(status, reference)
	} catch (error: Error | unknown) {
		console.error("VTU_HOOK_ERROR", error)
		res.json({ error })
	}
})

/**
 * Web Hook For Product V2 API
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
vtu.all('/bilalsadasub', async (req: Request, res: Response): Promise<void> => {
	// respond early
	res.sendStatus(200)

	const status = String(req.body['status'] || req.query['status'] || null).trim()
	const reference = String(req.body['request-id'] || req.query['request-id'] || null).trim()
	try {
		await updateOrder(status, reference)
	} catch (error: Error | unknown) {
		console.error("VTU_HOOK_ERROR", error)
	}
})

export default vtu
