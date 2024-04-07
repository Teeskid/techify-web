import axios, { type AxiosInstance } from "axios"
import { getAuth } from "firebase/auth"

import { SIM_BASE_URL } from "../utils/contants"
import { errorHandle } from "../utils/api"

export default class SIMApi {
    private static INSTANCE: SIMApi | null = null
    private client: AxiosInstance = axios.create({
        baseURL: SIM_BASE_URL,
    })
    constructor() {
    }
    static get(): SIMApi {
        if (this.INSTANCE === null) {
            this.INSTANCE = new SIMApi()
        }
        return this.INSTANCE
    }
    async __() {
        return await getAuth().currentUser?.getIdToken()
    }
    async auth(token: string) {
        const { data } = await this.client.post("/server/auth", {
            token
        }, {
            headers: {
                "Authorization": `Bearer ${await this.__()}`
            }
        }).catch(errorHandle)
        console.log(data)
        return data
    }
}
