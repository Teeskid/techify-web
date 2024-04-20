import { AuthData } from "../../types/app"
import { getServer } from "../../utils/pay/utils"

// Handles request to /users/payment/resolve-account
export const resolveAccount = async (auth: AuthData, data: object): Promise<object> => {
    const { type, bankCode, acctNuban } = <{ type: string, bankCode: string, acctNuban: string }>data
    try {
        const server = await getServer(type)
        const response = await server.resolveInfo({ cod: bankCode, nam: '', slg: '' }, acctNuban)
        return { status: true, data: response }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}
