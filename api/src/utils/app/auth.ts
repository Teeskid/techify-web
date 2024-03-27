import { type Request, type Response } from "express";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

/**
 * verifies identity token with optional response object
 * if response object is specified, takes overroute response
 * @param {Request} r - request object
 * @param {Response} res - response handle
 * @return {Promise<DecodedIdToken | false>}
 */
export const verifyIdToken = async (r: Request, res?: Response): Promise<DecodedIdToken | false> => {
    const rawToken = String(r.get("authorization")).split(" ", 2)[1]
    try {
        if (!rawToken || rawToken.length === 0) {
            if (res) {
                res.json({
                    code: 403,
                    text: "missing authentication field in headers"
                })
                return false
            }
            throw new Error('invalid user authentication token')
        }
        const idToken = await getAuth().verifyIdToken(rawToken)
        return idToken
    } catch (error) {
        if (res) {
            res.json({
                code: 403,
                text: "user authentication failed"
            })
            return false
        }
        throw error
    }
}

export default {}
