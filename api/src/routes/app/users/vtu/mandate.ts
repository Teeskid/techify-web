import { getFirestore } from "firebase-admin/firestore"
import { HttpsError } from "firebase-functions/v2/https"
import { type AuthData } from "firebase-functions/v2/tasks"

import type { Bank, UserType } from "techify-apx/types"

import { createVirtual as _updateVirtual } from "../../apx-library/payment/virtuals"
import { BankConv, UserConv, WalletConv } from "../../apx-utility/convs"
import { MERGE_DOC, isValidBank, isValidEmail, isValidName, isValidNuban, isValidPhone } from "../../apx-utility/utils"

/**
 * Update core user profile data
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const updateCore = async (auth: AuthData, data: object): Promise<object> => {
	let { email, phoneNumber, displayName, bankCode, accountName, accountNuban, referer, upgrade } = <{
		email: string,
		phoneNumber: string,
		displayName: string,
		bankCode?: string,
		accountName?: string,
		accountNuban?: string,
		referer: string,
		upgrade: UserType
	}>data
	// parse user payload
	email = String(email || auth.token.email)
	phoneNumber = String(phoneNumber || auth.token.phone_number)
	displayName = String(displayName || auth.token.name)
	accountName = String(accountName || '')
	accountNuban = String(accountNuban || '')
	bankCode = String(bankCode || '')
	upgrade = upgrade === 'wallet' ? <UserType>String(upgrade) : 'default'
	try {
		// validate user data
		const firestore = getFirestore()
		const users = firestore.collection("users")
		const userRef = users.doc(auth.uid).withConverter(UserConv)
		const walletsRef = firestore.collection("uwlts").withConverter(WalletConv)
		const batch = firestore.batch()
		// update user details if required
		const user = { ...(await userRef.get()).data() }
		if (user.typ === 'wallet' && upgrade === 'default')
			throw new Error('Downgrade not supported')
		// handle basic profile
		if (isValidEmail(email))
			user.eml = email
		if (isValidPhone(phoneNumber))
			user.phn = phoneNumber
		if (isValidName(displayName))
			user.nam = displayName
		user.typ = upgrade as UserType
		// handle user referer
		if (user.rfr === undefined) {
			if (referer && referer !== auth.uid) {
				const refererRef = walletsRef.doc(referer)
				const refererDoc = (await refererRef.get()).data()
				if (refererDoc) {
					user.rfr = refererRef.id
					if (isNaN(refererDoc.lrc))
						refererDoc.lrc = 0
					batch.set(refererRef, { 'lrc': ++refererDoc.lrc }, MERGE_DOC)
				}
			}
		}
		// save user info to database
		batch.set(userRef, user, MERGE_DOC)
		// if user is really upgrading
		if (upgrade === 'wallet') {
			const walletRef = walletsRef.doc(auth.uid)
			const wallet = { ...(await walletRef.get()).data() }
			// set initials
			wallet.bal = wallet.bal || 0
			wallet.bon = wallet.bon || 0
			wallet.ltc = 0
			wallet.lrc = 0
			wallet.ltf = 0
			wallet.lbc = 0
			wallet.las = 0
			wallet.lck = Boolean(wallet.lck)
			wallet.pin = wallet.pin || '0000'
			// begin custom
			const bankItem: Bank | undefined = (await firestore.collection('_meta/payment/banks-v2').withConverter(BankConv).where('cod', '==', bankCode).get()).docs[0]?.data() as Bank
			if (!bankItem && isValidBank(bankItem) && isValidName(accountName) && isValidNuban(accountNuban))
				wallet.act = {
					nam: accountName,
					nbn: accountNuban,
					bnk: bankItem
				}
			batch.set(walletRef, wallet, MERGE_DOC)
		}
		// save changes made
		await batch.commit()
		return { status: true, message: 'profile updated successfully' }
	} catch (error: Error | unknown) {
		throw new HttpsError('unknown', (<Error>error).message)
	}
}

const updateNuban = async (auth: AuthData, data: object): Promise<object> => {
	try {
		if (data)
			throw new HttpsError('failed-precondition', 'an error occured')
		// validate user data
		const firestore = getFirestore()
		const userRef = firestore.collection("users").doc(auth.uid).withConverter(UserConv)
		const user = (await userRef.get()).data()

		if (!user || user.typ !== 'wallet')
			throw new Error('you have not updated your profile yet')

		const errors = []
		if (!isValidEmail(user.eml))
			errors.push('invalid email')
		if (!isValidPhone(user.phn))
			errors.push('invalid phone number')
		if (!isValidName(user.nam))
			errors.push('invalid name')
		if (errors.length !== 0) {
			errors.push('please update your profile')
			throw new Error(errors.join(', '))
		}

		const walletRef = firestore.collection("uwlts").doc(userRef.id)
		const wallet = (await walletRef.get()).data()
		if (!wallet)
			throw new Error('you have not created a wallet yet')

		const virtual = await _updateVirtual(user, 'v2')
		if (!virtual)
			throw new Error('An error occured while generating your account number')

		// update user wallet
		await walletRef.set({
			kda: {
				nam: virtual.name,
				nbn: virtual.nuban
			}
		}, MERGE_DOC)

		return { status: true, message: 'profile updated successfully', data }
	} catch (error: Error | unknown) {
		return { status: false, message: (<Error>error).message }
	}
}

const changePIN = async (auth: AuthData, data: object): Promise<object> => {
	const userId = auth.uid
	const { newPIN } = <{ newPIN: string }>data
	try {
		if (!/^\d{4}$/.test(newPIN))
			throw new Error('PIN must be four digits')
		const walletRef = getFirestore().collection("uwlts").doc(userId)
		await walletRef.update({ pin: newPIN })
		return Promise.resolve({ status: true })
	} catch (error: Error | unknown) {
		return { status: false, message: (<Error>error).message }
	}
}

/**
 * Handles request to /users/mandate/**
 * @param {AuthData} auth - decoded authentication token
 * @param {object} data - payload sent through post request
 * @param {string} todo - action to handle in this route
 * @return {Promise<object>}
 */
export default function handler(auth: AuthData, data: object, todo?: string): Promise<object> {
	switch (todo) {
		case 'update-core':
			return updateCore(auth, data)
		case 'update-pin':
			return changePIN(auth, data)
		case 'create-nuban':
			return updateNuban(auth, data)
		default:
	}
	throw new HttpsError('permission-denied', 'you are not allowed to access this path')
}
