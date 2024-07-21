/** @module handlers/app/auth */

import { Router as createRouter, type Request, type Response } from "express";

import { UserRole } from "apx/types"

import { verifyIdToken } from "../../utils/app/auth"
import { MERGE_DOC, reportError, shardDoc } from "../../utils/vtu"
import { OrderConv, StatConv, UserConv, WalletConv } from "../../utils/vtu/convs"

export const AuthWare = async (r, res, runNext) => {
	const [, pathName] = r.path.split("/", 2)
	if (pathName === "auth") {
		runNext()
		return
	}
	const appToken = await verifyAppCheck(r)
	const authToken = await verifyIdToken(r)
	setContext(r, appToken, authToken)
	// if (r.path.includes("/admin") || r.path.includes("/users")) {
	// 	if (!appToken || !authToken) {
	// 		res.json({
	// 			code: 401,
	// 			text: "failed to authorize request"
	// 		})
	// 	} else {
	// 		runNext()
	// 	}
	// 	return
	// }
	runNext()
}

export const SignIn = async (r: Request, res: Response) => {
	res.sendStatus(200)
	const context = await verifyIdToken(r)
	if (!context) {
		return
	}
	const deviceId = r.body.deviceId

	console.log("AUTH: ", { ...context, deviceId })
	console.log("BODY: ", r.body)
}

export const SignUp = async (r: Request, res: Response) => {
	const auth = getAuth()
	const store = getFirestore()
	let user: UserRecord | undefined
	try {
		const data: { email: string, name: string, phone: string, password: string } = r.body
		// create an authentication user
		user = await auth.createUser({
			email: data.email,
			displayName: data.name,
			password: data.password
		})

		const userRef = store.collection("usrs").doc(user.uid).withConverter(UserConv)
		const statRef = store.doc("stats/luc").withConverter(StatConv)
		// create user details row
		const role = await store.runTransaction<UserRole | null>(async (t: Transaction) => {
			const __user = (await t.get(userRef)).data()

			// if user already created
			if (__user)
				return null
			const __stat = (await t.get(statRef)).data()

			// assign a user his role : 1st user is admin
			const role: UserRole = __stat ? UserRole.USER : UserRole.ADMIN

			// if site has been installed
			user = <UserRecord>user
			t.set(statRef.collection('cnt').doc(shardDoc()), { val: FieldValue.increment(1) })
			t.set(userRef, {
				eml: user.email,
				nam: user.displayName,
				phn: data.phone,
				rol: role,
				dat: FieldValue.serverTimestamp(),
				typ: 'default',
			}, MERGE_DOC)

			return role
		})

		// an error occured on the way
		if (!role)
			throw new Error()

		// assign the admin role to user
		await auth.setCustomUserClaims(user.uid, { role: role })

		// ping the support channel
		await reportError(`*New User Sign Up*\n\n${user.displayName}\n${data.email}\n_provider: ${JSON.stringify(user.providerData)}_`)

		res.json({
			code: 200,
			data: user,
			text: "user signed up successfully"
		})
	} catch (error: Error | unknown) {
		// handle authentication error
		if (user) {
			await getAuth().deleteUser(user.uid).catch(() => void 0)
		}
		console.error(error)
		await reportError(JSON.stringify(user))
		res.json({
			code: 500,
			text: "failed to sign up user",
			real: (error as Error).message
		})
	}
}

export const ClearUser = async (r, res, runNext) => {
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

export default {}
