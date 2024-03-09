import type { PaymentChannelKey, User, Virtual } from "techify-apx/types"

import { isValidEmail, isValidName, isValidPhone } from "../../utils/vtu"
import type { Server } from "./types"
import { getServer } from "./utils"

export const createVirtual = async (user: User, index: PaymentChannelKey): Promise<Virtual> => {
    // validate input data
    const errors: Array<string> = []
    if (!isValidEmail(user.eml))
        errors.push('invalid email')
    if (!isValidPhone(user.phn))
        errors.push('invalid phone number')
    if (!isValidName(user.nam))
        errors.push('invalid display name')
    if (errors.length !== 0) {
        throw new Error(errors.join(', '))
    }
    // get cached server module
    const server: Server = await getServer(index)
    // update a virtual account
    return await server.createVirtual(user.doc, { email: user.eml, phoneNumber: user.phn, displayName: user.nam })
}

export const chargeVirtual = async (index: PaymentChannelKey, userId: string, amount: number): Promise<void> => {
    // get cached server module
    const server: Server = await getServer(index)
    // fetch virtual accounts
    await server.chargeVirtual(userId, amount)
}

export const getVirtual = async (index: PaymentChannelKey, userId: string): Promise<Virtual | null> => {
    // get cached server module
    const server: Server = await getServer(index)
    // fetch virtual accounts
    return await server.getVirtual(userId)
}

export const getVirtuals = async (index: PaymentChannelKey, page: number) => {
    // get cached server module
    const server: Server = await getServer(index)
    // fetch virtual accounts
    return await server.getVirtuals(page)
}

export const getBalance = async (index: PaymentChannelKey, userId: string) => {
    // get cached server module
    const server: Server = await getServer(index)
    // fetch virtual accounts
    return await server.getBalance(userId)
}

export const disableVirtual = async (index: PaymentChannelKey, userId: string, enable: boolean): Promise<void> => {
    // get cached server module
    const server: Server = await getServer(index)
    // fetch virtual accounts
    await server.disableVirtual(userId, enable)
}

export default { getVirtual, getAccounts: getVirtuals, getBalance, createVirtual, chargeVirtual, disableVirtual }
