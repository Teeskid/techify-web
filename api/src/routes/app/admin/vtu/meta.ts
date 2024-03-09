import { HttpsError } from "firebase-functions/v2/https"
import { type AuthData } from "firebase-functions/v2/tasks"

import type { PaymentChannelKey, ProductChannelKey } from "techify-apx/types"
import { getMeta } from "../../apx-utility/utils"

const reload = async (auth: object, data: object): Promise<object> => {
    // grab the data from the request
    const { index, channel } = <{ index: string, channel: ProductChannelKey | PaymentChannelKey }>data
    try {
        const meta = await getMeta(index)
        const metadata = await meta.reload(channel)
        return { status: true, message: 'apis refreshed successfully', data: metadata }
    } catch (error: Error | unknown) {
        console.error(error)
        return { status: false, message: (error as Error).message }
    }
}

/**
 * Api Management Route
 * @async
 * @satisfies /admin/meta/**
 * @param {AuthData} auth
 * @param {object} data
 * @param {string} todo
 * @return {Promise<object>}
 */
export default function handler(auth: AuthData, data: object, todo?: string): Promise<object> {
    switch (todo) {
        case 'reload':
            return reload(auth, data)
        default:
            throw new HttpsError('not-found', 'the requested path is not found on the server')
    }
}
