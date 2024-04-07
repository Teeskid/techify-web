import { AuthData } from "firebase-functions/v2/tasks";

/**
 * handles base routing users/**
 * @param {AuthData} auth
 * @param {object} data
 * @param {string|undefined} todo
 * @return {object}
 */
export default function handler(auth: AuthData, data: object, todo?: string): object {
    return {
        status: true,
        message: 'Users can hit this endpoint from out app',
        auth,
        data,
        todo
    }
}
