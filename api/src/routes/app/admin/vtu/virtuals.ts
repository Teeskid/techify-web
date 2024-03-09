import { getFirestore } from "firebase-admin/firestore"
import { HttpsError } from "firebase-functions/v2/https"
import { type AuthData } from "firebase-functions/v2/tasks"

import type { PaymentChannelKey } from "techify-apx/types"

import { getBalance as _getBalance, chargeVirtual, createVirtual, disableVirtual, getVirtual, getVirtuals } from "../../../vtu/apx-library/payment/virtuals"
import { UserConv } from "../../../vtu/vtu/convs"
import { MERGE_DOC, isValidEmail, isValidName, isValidPhone } from "../../../vtu/vtu/utils"

/**
 * gets a single account info from server
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const single = async (auth: AuthData, data: object): Promise<object> => {
    const { uid } = <{ uid: string }>data
    try {
        // fetch the account info
        const data = getVirtual('v2', uid)
        return { status: true, data }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

/**
 * gets account balance from server
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const balance = async (auth: AuthData, data: object): Promise<object> => {
    const { uid } = <{ uid: string }>data
    try {
        // fetch the account info
        const balance = await _getBalance('v2', uid)
        return { status: true, data: { balance } }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

/**
 * list all registered users from authentication database
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const list = async (auth: AuthData, data: object): Promise<object> => {
    let { type, page } = <{ type: string, page: string | number }>data
    page = Number.parseInt(<string>page) || 1
    try {
        const data = await getVirtuals(type as PaymentChannelKey, page)
        if (data) {
            const prev = page > 1 ? page - 1 : null
            const next = data.length === 10 ? page + 1 : null
            return { status: true, data: { data, prev, next } }
        }
        throw new Error('failed to load virtual content')
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

/**
 * Generates a virtual account number for userId
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const update = async (auth: AuthData, data: object): Promise<object> => {
    const { userId } = <{ userId: string, gateway: string }>data
    try {
        // validate user data
        if (!userId)
            throw new Error('invalid user id / gateway')

        const firestore = getFirestore()
        const userRef = firestore.collection("users").doc(userId).withConverter(UserConv)

        const user = (await userRef.get()).data()

        if (!user || user.typ !== 'wallet')
            throw new Error('wallet not found for user')

        user.eml = String(user.eml)
        user.phn = String(user.phn)
        user.nam = String(user.nam)

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
            throw new Error('user profile needs update')

        const virtual = await createVirtual(user, 'v2')
        if (!virtual)
            throw new Error('An error occured while generating your account number')

        // update user wallet
        await walletRef.set({ kda: virtual }, MERGE_DOC)

        return { status: true, message: 'nuban generated successfully', data: wallet.kudabank }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

/**
 * reloads virtual account for uid
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const reload = async (auth: AuthData, data: object): Promise<object> => {
    const { uid } = <{ uid: string }>data
    try {
        const firestore = getFirestore()
        const userRef = firestore.collection("users").doc(uid).withConverter(UserConv)

        const user = (await userRef.get()).data()

        if (!user || user.typ !== 'wallet')
            throw new Error('wallet not found for user')

        user.eml = String(user.eml)
        user.phn = String(user.phn)
        user.nam = String(user.nam)

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
        // const wallet = (await walletRef.get()).data()
        // if (!wallet)
        //     throw new Error('user profile needs update')

        const data = await createVirtual(user, 'v2')
        if (!data)
            throw new Error('An error occured while generating your account number')

        // update user wallet
        await walletRef.set({ kda: data }, MERGE_DOC)

        return { status: true, data, message: 'account reloaded successfully' }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

/**
 * charges user account on the server
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const charge = async (auth: AuthData, data: object): Promise<object> => {
    let { uid, amount } = <{ uid: string, amount: string | number }>data
    try {
        // execute action on api
        amount = Number.parseFloat(<string>amount)
        if (isNaN(amount))
            throw new Error('invalid charge amount')
        await chargeVirtual('v2', uid, amount)
        return { status: true, message: 'charged successfully' }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

/**
 * toggle an account on | off on the server
 * @param {AuthData} auth
 * @param {object} data
 * @return {Promise<object>}
 */
const toggle = async (auth: AuthData, data: object): Promise<object> => {
    const { uid, enable } = <{ uid: string, enable: boolean }>data
    try {
        // execute action on api
        await disableVirtual('v2', uid, enable)
        return { status: true, message: 'charged successfully' }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

/**
 * Admin Virtual Accounts Actions Handler: /admin/virtuals/**
 * @param {AuthData} auth
 * @param {object} data
 * @param {string} todo
 * @return {Promise<object>}
 */
export default function handler(auth: AuthData, data: object, todo: string): Promise<object> {
    switch (todo) {
        case 'get-single':
            return single(auth, data)
        case 'get-balance':
            return balance(auth, data)
        case 'get-list':
            return list(auth, data)
        case 'update':
            return update(auth, data)
        case 'reload':
            return reload(auth, data)
        case 'charge':
            return charge(auth, data)
        case 'toggle':
            return toggle(auth, data)
        default:
            throw new HttpsError('not-found', 'the requested path is not found on the server')
    }
}
