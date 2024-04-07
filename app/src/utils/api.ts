import { isAxiosError, type AxiosError } from "axios"

export const errorHandle = (error: AxiosError | unknown) => {
    if (!isAxiosError(error))
        return {
            code: 500,
            text: "an internal server error has occured"
        }
    return {
        data: {
            code: 400,
            data: error.response?.data,
            text: error.message
        }
    }
}

export default {}
