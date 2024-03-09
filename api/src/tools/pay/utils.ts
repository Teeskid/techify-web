import type { PaymentChannelKey } from "techify-apx/types"

import type { Server } from "./types"

const cached: { [i: string]: Server } = {}

export const getServer = async (index: PaymentChannelKey) => {
    if (!cached[index])
        cached[index] = <Server>(await import(`./${index}`)).default
    return cached[index]
}
