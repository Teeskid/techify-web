import axios, { type AxiosInstance } from "axios"
import { getAuth } from "firebase/auth"


export default class BaseApi {
    protected client: AxiosInstance
    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 60000
        })
    }
    async __() {
        return await getAuth().currentUser?.getIdToken()
    }
}
