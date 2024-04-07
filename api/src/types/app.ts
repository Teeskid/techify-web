import type { VerifyAppCheckTokenResponse } from "firebase-admin/app-check"
import type { DecodedIdToken } from "firebase-admin/auth"

export interface AuthData extends DecodedIdToken {
}

export interface AppToken extends VerifyAppCheckTokenResponse {
}

export interface Context {
    app: AppToken | null
    auth: AuthData | null
}

export default {}
