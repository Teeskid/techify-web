import axios, { type AxiosInstance } from "axios"

import { APP_BASE_URL } from "../utils/contants"
import { errorHandle } from "../utils/api"

export default class APPApi {
    private static INSTANCE: APPApi | null = null
    private client: AxiosInstance = axios.create({
        baseURL: APP_BASE_URL
    })
    constructor() {
    }
    static get(): APPApi {
        if (this.INSTANCE === null) {
            this.INSTANCE = new APPApi()
        }
        return this.INSTANCE
    }
    async signUp(data: object) {
        const { data: result } = await this.client.post("/auth/sign-up", data).catch(errorHandle)
        return result
    }
    async genKey(type: string) {
        const { data: result } = await this.client.post("/user/keys", {
            type: type,
            expiry: "never"
        }).catch(errorHandle)
        return result
    }
}
