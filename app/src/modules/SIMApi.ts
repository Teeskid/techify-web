import axios, { type AxiosInstance } from "axios"
import { getAuth } from "firebase/auth"

import { APP_BASE_URL } from "../constants/server"

export default class SIMApi {
    private static INSTANCE: SIMApi | null = null
    private client: AxiosInstance = axios.create({
        baseURL: APP_BASE_URL,
    })
    constructor() {
    }
    static get(): SIMApi {
        if (this.INSTANCE === null) {
            this.INSTANCE = new SIMApi()
        }
        return this.INSTANCE
    }
    get AUTH_TOKEN() {
        return getAuth().currentUser?.refreshToken
    }
    async auth(token: string) {
        const { data } = await this.client.post("/auth", {
            token
        }, {
            headers: {
                "Authorization": `Bearer ${this.AUTH_TOKEN}`
            }
        })
        return data
    }
}
