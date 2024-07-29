import { HttpsError } from "firebase-functions/v2/https"
import { type AuthData } from "firebase-functions/v2/tasks"


import { getServer } from "../../apx-library/payment/utils"
import type { Handler } from "../../__/types"

// Handles request to /users/payment/resolve-account
const resolveAccount: Handler = async (auth: AuthData, data: object): Promise<object> => {
	const { type, bankCode, acctNuban } = <{ type: string, bankCode: string, acctNuban: string }>data
	try {
		const server = await getServer(type)
		const response = await server.resolveInfo({ cod: bankCode, nam: '', slg: '' }, acctNuban)
		return { status: true, data: response }
	} catch (error: Error | unknown) {
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * Handles request to /users/payment/**
 * @param {AuthData} auth - decoded authentication token
 * @param {object} data - payload sent through post request
 * @param {string} todo - action to handle in this route
 * @return {Promise<object>}
 */
export default function handler(auth: AuthData, data: object, todo?: string): Promise<object> {
	switch (todo) {
		case 'resolve-account':
			return resolveAccount(auth, data)
		default:
	}
	throw new HttpsError('permission-denied', 'you are not allowed to access this path')
}
