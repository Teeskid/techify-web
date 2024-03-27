import { HttpsError } from "firebase-functions/v2/https"
import { type AuthData } from "firebase-functions/v2/tasks"

import type { Handler } from "../../__/types"

/**
 * Handles request to /users/product/**
 * @param {AuthData} auth - decoded authentication token
 * @param {object} data - payload sent through post request
 * @param {string} todo - action to handle in this route
 * @return {Promise<object>}
 */
export default async function route(auth: AuthData, data: object, todo?: string): Promise<object> {
	// const __name = (<string>todo).replace(/-([a-z0-9_])/ig, (m, x: string[]) => camelCase(x[1]))
	let handle: Handler | undefined
	switch (todo) {
		// case 'order-telecom':
		// 	if (!__telecom)
		// 		__telecom = (await import('../../apx-library/product/telecom')).default as Handler
		// 	handle = __telecom
		// 	break
		default:
	}
	if (handle)
		return await handle(auth, data)
	throw new HttpsError('permission-denied', 'you are not allowed to access this path')
}
