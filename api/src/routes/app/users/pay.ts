import { type Request, type Response } from "express"

import { resolveAccount } from "../../../tools/pay/gateway"
import { AuthData } from "../../../types/app"
import { verifyIdToken } from "../../../utils/app/auth"

/**
 * Handles request to /users/**
 * @param {Request} r
 * @param {Response} res
 * @return {Promise<void>}
 */
export default async function pay(r: Request, res: Response): Promise<void> {
	const idToken = await verifyIdToken(r, res) as AuthData
	const { action, ...data } = r.body
	let result: object
	switch (action) {
		case 'resolve-account':
			result = resolveAccount(idToken, data)
		default:
			result = { code: 401, text: "you are not allowed to access this path" }
	}
	res.json(result)
}
