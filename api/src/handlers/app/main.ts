/** @module handlers/app/main */

import { UserRecord, getAuth } from "firebase-admin/auth"
import { FieldValue, getFirestore } from "firebase-admin/firestore"
import { HttpsError } from "firebase-functions/v2/https"
import { type AuthData } from "firebase-functions/v2/tasks"

import type { Order, UserRole } from "apx/types"

import { chargeWallet as _chargeWallet } from "../../apx-library/internal/users"
import { OrderConv, UserConv, WalletConv } from "../../apx-utility/convs"
import { MERGE_DOC } from "../../apx-utility/utils"

type UserInfo = Partial<UserRecord & { creationTime: string }>

/**
 * list all registered users from authentication database
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const listUsers = async (auth: AuthData, data: object): Promise<object> => {
	const { max, sort, next } = <{ max: number, sort: string, next: string }>data
	try {
		const auth = getAuth()
		const { users, pageToken } = next ? await auth.listUsers(max, next) : await auth.listUsers(max)
		const userList: Array<UserInfo> = users.map((user) => ({
			uid: user.uid,
			email: user.email,
			phoneNumber: user.phoneNumber,
			displayName: user.displayName,
			creationTime: user.metadata.creationTime
		}))
		if (!sort) {
			userList.sort((a: UserInfo, b: UserInfo): number => {
				return Number(<string>a.creationTime > <string>b.creationTime)
			})
		}
		return { status: true, data: { data: userList, next: pageToken || null } }
	} catch (error: Error | unknown) {
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * Deletes a user record using a provided uid
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const deleteUser = async (auth: AuthData, data: object): Promise<object> => {
	const { userId } = <{ userId: string }>data
	try {
		if (auth.uid === userId)
			throw new Error('you cannot delete yourself')
		await getAuth().deleteUser(userId).catch(async () => {
			const store = getFirestore()
			const batch = store.batch()
			batch.delete(store.collection("users").doc(userId))
			batch.delete(store.collection("uwlts").doc(userId))
			const invoices = await store.collection("ivhs").listDocuments()
			invoices.forEach((ref) => {
				batch.delete(ref)
			})
			await batch.commit()
		})
		return { status: true, message: 'user has been deleted successfully', data: { uid: userId } }
	} catch (error: Error | unknown) {
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * Updates a pending transaction status
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const updateRole = async (auth: AuthData, data: object): Promise<object> => {
	const { userId, role } = <{ userId: string, role: UserRole }>data
	try {
		if (auth.uid === userId)
			throw new Error('Error')
		const fireAuth = getAuth()
		const authUser = await fireAuth.getUser(userId)
		const firestore = getFirestore()
		const userRef = firestore.collection("users").doc(authUser.uid).withConverter(UserConv)
		await firestore.runTransaction(async (t) => {
			const user = (await t.get(userRef)).data()
			// incase we lost one of them
			if (!user)
				throw new Error('user not found')
			// prevent downgrade
			if (user.rol === "admin" && role === 'user')
				throw new Error('downgrade error')
			// update fields
			if (user.rol !== role)
				t.update(userRef, {
					rol: role
				})
		})
		await fireAuth.setCustomUserClaims(userId, { ...authUser.customClaims, role })
		return { status: true, message: 'Changes applied successfuly' }
	} catch (error: Error | unknown) {
		// handle error
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * updates a pending transaction status
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const updateOrder = async (auth: AuthData, data: object): Promise<object> => {
	const { userId, itemId, action } = <{ userId: string, itemId: string, action: string }>data
	try {
		const authUser = await getAuth().getUser(userId)
		const firestore = getFirestore()
		const walletRef = firestore.collection("uwlts").doc(authUser.uid).withConverter(WalletConv)
		const orderRef = walletRef.collection("ivhs").doc(itemId).withConverter(OrderConv)
		await firestore.runTransaction(async (t) => {
			let item = (await t.get(orderRef)).data() as Order
			// incase we lost one of them
			if (!item)
				throw new Error('transaction not found')
			if (item.sta !== null)
				throw new Error('item does not need update')
			if (action === 'confirm') {
				t.update(orderRef, "sta", true)
			} else if (action === 'fail') {
				// update fields
				const wallet = { ...(await t.get(walletRef)).data() }
				const refunds = Math.abs(item.amt)
				// ...
				item.sta = false
				// ...
				t.update(walletRef, { bal: FieldValue.increment(refunds) })
				t.update(orderRef, { sta: item.sta })
				// create a new refund transaction
				item = {
					doc: orderRef.id,
					crc: "NGN",
					typ: 'refund',
					dst: item.dst,
					bal: wallet.bal as number,
					ref: null,
					inf: {
						via: 'mannual',
					},
					amt: refunds,
					src: "admin",
					sta: true,
					dat: new Date()
				}
				t.set(walletRef.collection('ivhs').doc(), item)
				t.set(firestore.collection('stats/luc/cnt').doc(String(Math.floor(Math.random() * 9))), {
					bal: FieldValue.increment(refunds),
					ltc: FieldValue.increment(1)
				}, MERGE_DOC)
			} else {
				throw new Error('invalid target status for transaction')
			}
		})
		return { status: true, message: 'Changes applied successfuly' }
	} catch (error: Error | unknown) {
		// handle error
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * updates a pending transaction status
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const correctWallet = async (auth: AuthData, data: object): Promise<object> => {
	const { userId, balance } = <{ userId: string, balance: string | number }>data
	try {
		const authUser = await getAuth().getUser(userId)
		const firestore = getFirestore()
		const walletRef = firestore.collection("uwlts").doc(authUser.uid)
		await firestore.runTransaction(async (t) => {
			const wallet = await t.get(walletRef)
			// incase we lost one of them
			if (!wallet.exists)
				throw new Error('wallet not found')
			// update fields
			// ...
			t.update(walletRef, {
				bal: Number.parseInt(<string>balance)
			})
		})
		return { status: true, message: 'Changes applied successfuly' }
	} catch (error: Error | unknown) {
		// handle error
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * updates a pending transaction status
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const correctOrder = async (auth: AuthData, data: object): Promise<object> => {
	const { userId, itemId, status, amount, balance } = <{ userId: string, itemId: string, status: string, amount: string, balance: string }>data
	try {
		const authUser = await getAuth().getUser(userId)
		const firestore = getFirestore()
		const walletRef = firestore.collection("uwlts").doc(authUser.uid)
		const itemRef = walletRef.collection("ivhs").doc(itemId)
		await firestore.runTransaction(async (t) => {
			const item = await t.get(itemRef)
			// incase we lost one of them
			if (!item.exists)
				throw new Error('transaction not found')
			// update fields
			// ...
			t.update(itemRef, {
				bal: Number.parseInt(balance),
				amt: Number.parseInt(amount),
				sta: status
			})
		})
		return { status: true, message: 'Changes applied successfuly' }
	} catch (error: Error | unknown) {
		// handle errorstateus
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * debits or credits user wallet
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const chargeWallet = async (auth: AuthData, data: object): Promise<object> => {
	const { userId, amount, polarity, charge } = <{ userId: string, amount: number, polarity: string, charge: boolean }>data
	try {
		const user = await getAuth().getUser(userId)
		let kobos = amount * 100
		if (kobos === 0)
			throw new Error('Amount below minimum')
		if (polarity === 'credit') {
			if (charge === true)
				kobos -= 5000
		} else {
			kobos *= -1
		}
		const balance = await _chargeWallet(user, kobos, auth.token.email || auth.uid, 'mannual', null)
		return { status: true, data: { balance }, message: `Wallet has been funded, new balance is now ${balance.toFixed(2)}` }
	} catch (error: Error | unknown) {
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * Main Admin Actions Handler
 * @param {AuthData} auth
 * @param {object} data
 * @param {string} todo
 * @return {Promise<object>}
 */
export default function route(auth: AuthData, data: object, todo: string): Promise<object> {
	switch (todo) {
		case 'auth-users':
			return listUsers(auth, data)
		case 'delete-user':
			return deleteUser(auth, data)
		case 'update-role':
			return updateRole(auth, data)
		case 'update-order':
			return updateOrder(auth, data)
		case 'correct-wallet':
			return correctWallet(auth, data)
		case 'correct-order':
			return correctOrder(auth, data)
		case 'charge-wallet':
			return chargeWallet(auth, data)
		default:
	}
	throw new HttpsError('not-found', 'the requested path is not found on the server')
}
