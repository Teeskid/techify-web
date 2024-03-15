import { exec } from "child_process"
import { getAuth, type UserRecord } from "firebase-admin/auth"
import { FieldValue, getFirestore, Timestamp, type Transaction } from "firebase-admin/firestore"
import type { BeforeCreateResponse } from "firebase-functions/lib/common/providers/identity"
import { type Change, type DocumentSnapshot, type FirestoreEvent } from "firebase-functions/v2/firestore"
import { HttpsError, type AuthBlockingEvent } from "firebase-functions/v2/identity"
import { promisify } from "util"
import { CloudEvent } from "firebase-functions/v2"
import { MessagePublishedData } from "firebase-functions/v2/pubsub"

import { UserRole } from "apx/types"

import { updateConfig, updatePayments, updateProducts } from "../tools/vtu/update"
import { sendText } from "../tools/msn"
import { OrderConv, StatConv, UserConv, WalletConv } from "../utils/vtu/convs"
import { MERGE_DOC, reportError, shardDoc } from "../utils/vtu/utils"
import type { EventProps } from "../types/vtu"

const asyncExec = promisify(exec)

const userSignUp = async (event: AuthBlockingEvent): Promise<BeforeCreateResponse> => {
	const user = event.data
	try {
		// get the db references
		const firestore = getFirestore()
		const userRef = firestore.collection("users").doc(user.uid).withConverter(UserConv)
		const statRef = firestore.doc("stats/luc").withConverter(StatConv)

		// create user details row
		const role = await firestore.runTransaction<UserRole | null>(async (t: Transaction) => {
			const __user = (await t.get(userRef)).data()
			// if user already created
			if (__user)
				return null
			const __stat = (await t.get(statRef)).data()

			// assign a user his role : 1st user is admin
			const role: UserRole = __stat ? UserRole.USER : UserRole.ADMIN

			// if site has been installed
			t.set(statRef.collection('cnt').doc(shardDoc()), { val: FieldValue.increment(1) })
			t.set(userRef, {
				eml: user.email,
				nam: user.displayName,
				phn: user.phoneNumber,
				rol: role,
				dat: Timestamp.fromMillis(Math.floor(Date.parse(user.metadata.creationTime) / 1000)),
				typ: 'default',
			}, MERGE_DOC)
			return role
		})

		// user already exists in db
		if (!role)
			throw new Error()

		// ping the support channel
		await reportError(`*New User Sign Up*\n\n${user.displayName}\n${user.email}\n_provider: ${JSON.stringify(user.providerData)}_`)

		return { customClaims: { role: role } }
	} catch (error) {
		// handle auth error
		await getAuth().deleteUser(user.uid).catch(() => void 0)
		await reportError(JSON.stringify(event.data))
		throw new HttpsError("cancelled", "failed to sign up user")
	}
}

const userDelete = async (user: UserRecord) => {
	try {
		const firestore = getFirestore()
		const userRef = firestore.collection("users").doc(user.uid).withConverter(UserConv)
		const walletRef = firestore.collection("uwlts").doc(user.uid).withConverter(WalletConv)
		const orderRef = walletRef.collection("ivhs").select("src").withConverter(OrderConv)
		const statRef = firestore.collection("stats/luc/cnt").doc(String(shardDoc())).withConverter(StatConv)
		// delete transaction
		await firestore.runTransaction(async (t) => {
			const item = [...(await orderRef.get()).docs]
			// clear order
			if (item.length !== 0)
				item.forEach(({ ref }) => t.delete(ref))
			t.delete(userRef)
			t.delete(walletRef)
			// update statistics
			t.set(statRef, { val: FieldValue.increment(-1) }, MERGE_DOC)
			return
		})
	} catch (error) {
		// handle errors
	}
	return Promise.resolve()
}

/**
 * Updates apps list cache file
 * @param {FirestoreEvent<Change<DocumentSnapshot> | undefined, EventProps>} event
 * @return {Promise<void>}
 */
const metaUpdate = async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, EventProps>): Promise<void> => {
	try {
		if (event.params.api === "cfg")
			await updateConfig(event)
		else if (event.params.api === "product") {
			await updateProducts(event)
		} else if (event.params.api === "payment") {
			await updatePayments(event)
		}
	} catch (error: Error | unknown) {
		// console.error(error)
	}
	return Promise.resolve()
}

/**
 * Updates apps list cache file
 * @param {CloudEvent<MessagePublishedData>} event
 * @return {Promise<void>}
 */
const ussdUpdate = async (event: CloudEvent<MessagePublishedData>): Promise<void> => {
	// const service = `simsrv/ussd/cmds/{cid}`
	const result = await asyncExec("termux-torch on").catch(() => 'failed sending command: ' + event.data.message.data.toString())
	await sendText("v2", 2348020789906, result.toString())
}

export default { userSignUp, userDelete, ussdUpdate, metaUpdate }
