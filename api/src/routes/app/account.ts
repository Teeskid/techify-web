
import { changePIN, updateCore } from "../../tools/app/user"
import { updateNuban } from "../../tools/pay/nuban"
import { Context } from "../../types/app"

/**
 * Handles request to /users/mandate/**
 * @param {Context} context
 * @param {object} content
 * @return {Promise<object>}
 */
export default async function handler(context: Context, content: object): Promise<object> {
	const { auth } = context
	if (!auth)
		return {}
	const { action, ...data } = content as any
	let result: object
	switch (action) {
		case 'update-core':
			result = updateCore(auth, data)
		case 'update-pin':
			result = changePIN(auth, data)
		case 'create-nuban':
			result = updateNuban(auth, data)
		default:
			result = {
				code: 401,
				text: "you are not allowed to access this path"
			}
	}
	return result
}
