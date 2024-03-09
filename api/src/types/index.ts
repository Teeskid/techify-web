export interface UssdRequest {
    sessionId: string
    serviceCode: string
    phoneNumber: string
    text: string
}

export type Status = // The status of the USSD session. Possible values are:
    "Incomplete" | // The session was terminated while the user was on a menu where further input was required.
    "Success" | // The session reached its expected end.
    "Failed" // The session was terminated due to an error received from your server while expecting a response, this typically comes along with an errorMessage parameter.

export interface UssdCallback {
    sessionId: string
    serviceCode: string
    networkCode: number
    phoneNumber: string
    status: Status
    cost: string
    date: string // yyyy-MM-dd HH:mm:ss
    input: string
    hopsCount: number
    errorMessage: string
    lastAppResponse: string
    durationInMillis: string
}

export type AuthData = {
    uid: string
}
