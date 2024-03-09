import { getAuth, type DecodedIdToken } from "firebase-admin/auth"

export const INTL_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
    dateStyle: "long"
})

export const requestRef = () => {
    return (Math.random() * 1000000000).toFixed(10)
}

export const decodeToken = async (rawToken: string): Promise<DecodedIdToken> => {
	const token = await getAuth().verifyIdToken(rawToken)
	return token
}
