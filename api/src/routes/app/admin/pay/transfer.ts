import { Router as routerBuilder, type Request, type Response } from "express"

import v2 from "../../../../tools/pay/v2"

/**
 * Upgrade hook
 * @param {Request} request
 * @param {Response} response
 * @return {Promise}
 */
const run = async (request: Request, response: Response): Promise<void> => {
    try {
        const server = await v2.getBankList()
        response.json({ banks: server })
    } catch (error: Error | unknown) {
        response.json(error)
    }
}

export default routerBuilder()
    .get('/run', run)
