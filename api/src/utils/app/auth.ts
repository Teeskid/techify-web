import { type Request, type Response } from "express";
import { VerifyAppCheckTokenResponse, getAppCheck } from "firebase-admin/app-check";
import { getAuth } from "firebase-admin/auth";

import type { AuthData } from "../../types/app";

/**
 * verifies identity token with optional response object
 * if response object is specified, takes overroute response
 * @param {Request} r - request object
 * @param {Response} res - response handle
 * @return {Promise<AuthData | null>}
 */
export const verifyIdToken = async (r: Request, res?: Response): Promise<AuthData | null> => {
    const rawToken = String(r.get("authorization")).split(" ", 2)[1]
    try {
        if (!rawToken || rawToken.length === 0) {
            if (res) {
                res.json({
                    code: 403,
                    text: "missing authentication field in headers"
                })
                return null
            }
            throw new Error('invalid user authentication token')
        }
        return await getAuth().verifyIdToken(rawToken)
    } catch (error) {
        if (res) {
            res.json({
                code: 403,
                text: "user authentication failed"
            })
            return null
        }
        throw error
    }
}

export const verifyAppCheck = async (r: Request, res?: Response): Promise<VerifyAppCheckTokenResponse | null> => {
    // get the app check token
    const rawToken = String(r.header("X-Firebase-AppCheck")).trim()
    try {
        if (!rawToken || rawToken.length === 0) {
            if (res) {
                res.json({
                    code: 403,
                    text: "missing authentication field in headers"
                })
                return null
            }
            throw new Error('invalid user authentication token')
        }
        // verify app token usage
        return await getAppCheck().verifyToken(rawToken)
    } catch (error) {
        if (res) {
            res.json({
                code: 403,
                text: "user authentication failed"
            })
            return null
        }
        throw error
    }
}

export default {}
