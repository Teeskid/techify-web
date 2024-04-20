import { errorHandle } from "../utils/api"
import { IDV_BASE_URL } from "../utils/contants"
import BaseApi from "./BaseApi"

export default class IDVApi extends BaseApi {
    private static INSTANCE: IDVApi | null = null
    constructor() {
        super(IDV_BASE_URL)
    }
    static get(): IDVApi {
        if (this.INSTANCE === null) {
            this.INSTANCE = new IDVApi()
        }
        return this.INSTANCE
    }
    async verify(verPath: string, paramType: string, paramValue: string) {
        const { data } = await this.client.post(`/verify/${verPath}`, {
            paramType,
            paramValue,
        }, {
            headers: {
                "Authorization": `Bearer ${await this.__()}`
            }
        }).catch(errorHandle)
        return data
    }
    static buildViewLink(id: string, view: string) {
        return `${IDV_BASE_URL}/verify/result?transactionId=${id}&viewFormat=${view}`
    }
}
