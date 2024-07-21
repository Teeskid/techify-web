/** @module tools/idv/seamfix */

import axios, { type AxiosError } from "axios"

import type { BVNDetails, NINDetails } from "../../types/idv"
import { cacheRequest, requestCache, removeCache } from "../cache"
import { requestRef, formatDate } from "../utils"

if (process.env.IDV_API_V1_TOKEN === undefined)
	throw new Error("environment error")

const [ninKeys, bvnKeys] = process.env.IDV_API_V1_TOKEN.split(":", 2)
const [ninKey1, ninKey2] = ninKeys.split("/", 2) || ['', '']
const [bvnKey1, bvnKey2] = bvnKeys.split("/", 2) || ['', '']

const seamFix = axios.create({
	baseURL: "https://api.verified.africa/sfx-verify/v3/id-service/",
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"userid": process.env.IDV_API_V1_XUSER
	},
	timeout: 30000
})

const createNINDetails = (ninNumber: string, raw: any): NINDetails => {
	/**
	 * "firstName": "PROUD",
		"surname": "CITIZEN",
		"middleName": "NIGERIAN",
		"dateOfBirth": "01 OCT 1960",
		"userid": "ABCDEF-8910",
		"gender": "M",
		"trustedNumber": "2341234567890",
		"txid": "bd633743-cdb8-452f-b46b-55c63c81a605",
		"ts": "2022-06-29T12:08:10.567",
		"agentID": "ABCDEF-8910",
		"photo": "Base64",
		"vnin": "SF895332826955L0",
		"vNIN": "SF895332826955L0"
	 */
	return {
		firstName: raw.firstName || "",
		lastName: raw.surname || "",
		middleName: raw.middleName || "",
		dateOfBirth: formatDate(raw.dateOfBirth)  || "",
		address: {
			stateName: "",
			localGovt: "",
			lineTwo: ""
		},
		trackingId: "",
		phoneNumber: raw.trustedNumber || "",
		gender: raw.gender || "",
		userId: raw.userid || "",
		photoData: raw.photo,
		issueDate: formatDate(raw.ts) || "",
		vNinNumber: raw.vNIN || "",
		ninNumber
	}
}

const createBVNDetails = (bvnNumber: string, raw: any): BVNDetails => {
	/**
	 * "email": "",
		"gender": "male",
		"dob": "04-09-1970",
		"phone": "23490123456",
		"country": "nigeria",
		"nin": "00000000000",
		"bvn": "12345678901",
		"nationality": "Nigeria",
		"watchlisted": false,
		"avatar": "",
		"full_name": "ABDULHAKEEM CHIBUZOR IDOWU",
		"first_name": "ABDULHAKEEM",
		"middle_name": "CHIBUZOR",
		"last_name": "IDOWU",
		"alternate_phone": "23490123456",
		"state_of_origin": "Ogun State",
		"state_of_residence": "Lagos State",
		"lga_of_origin": "Ekiti, Kwara State",
		"lga_of_residence": "Ilorin West",
		"address_line_2": "Ogun State",
		"address_line_3": "nigeria",
		"marital_status": "married",
		"enrollment_bank": "000",
		"enrollment_branch": "ILORIN 23",
		"account_level": "Level 1"
	 */
	return {
		email: raw.email,
		firstName: raw.first_name,
		middleName: raw.middle_name,
		lastName: raw.last_name,
		gender: raw.gender,
		address: [
			raw.address_line_2,
			raw.address_line_3,
			raw.state_of_origin,
			raw.lga_of_residence
		].join(" ").trim(),
		nationality: raw.nationality || "",
		dateOfBirth: raw.dob || "",
		phoneNumber: raw.phone || "",
		phoneNumber2: raw.alternate_phone || "",
		photoData: raw.avatar || "",
		bvnNumber
	}
}

const handleErr = (error: AxiosError) => ({
	data: {
		error: error.message,
		data: error.response?.data
	}
})

const isInValid = (data: Record<string, any>): boolean => {
	if (Object.keys(data).includes("error"))
		return true
	if (data.responseCode !== "00" || data.verificationStatus !== "VERIFIED")
		return true
	return false
}

const verifyNIN = async (paramValue: string): Promise<NINDetails> => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"verificationType": "NIN-VERIFY",
				"searchParameter": paramValue || "02730846093",
				"countryCode": "NG",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": ninKey2,
				}
			}).catch(handleErr)
		).data
		if (!!data && !data.error)
			await cacheRequest(paramValue, data)
	} else {
		if (data.error) {
			await removeCache(paramValue)
			throw new Error("please try again")
		}
	}
	data = data as Record<string, any>
	if (isInValid(data))
		throw new Error(data.error || data.description)
	return createNINDetails(paramValue, data.response)
}

const verifyVNIN = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"countryCode": "NG",
				"searchParameter": paramValue || "SF895332826955L0",
				"verificationType": "V-NIN",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": ninKey1,
				}
			}).catch(handleErr)
		).data
		if (!!data && !data.error)
			await cacheRequest(paramValue, data)
	} else {
		if (data.error) {
			await removeCache(paramValue)
			throw new Error("please try again")
		}
	}
	data = data as Record<string, any>
	if (isInValid(data))
		throw new Error(data.error || data.description)
	return createNINDetails(paramValue, data.response)
}

const verifyPNIN = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"countryCode": "NG",
				"searchParameter": paramValue,
				"verificationType": "NIN-PHONE-SEARCH",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": ninKey1,
				}
			}).catch(handleErr)
		).data
		if (!!data && !data.error)
			await cacheRequest(paramValue, data)
	} else {
		if (data.error) {
			await removeCache(paramValue)
			throw new Error("please try again")
		}
	}
	data = data as Record<string, any>
	if (isInValid(data))
		throw new Error(data.error || data.description)
	return createNINDetails(paramValue, data.response)
}

const verifyBVN = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"searchParameter": paramValue,
				"verificationType": "BVN-FULL-DETAILS",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": bvnKey1,
				}
			}).catch(handleErr)
		).data
		if (!!data && !data.error)
			await cacheRequest(paramValue, data)
	} else {
		if (data.error) {
			await removeCache(paramValue)
			throw new Error("please try again")
		}
	}
	data = data as Record<string, any>
	if (isInValid(data))
		throw new Error(data.error || data.description)
	return createBVNDetails(paramValue, data.response)
}

const verifyBVN2 = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"searchParameter": paramValue,
				"verificationType": "BVN-FULL-DETAILS",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": bvnKey2,
				}
			}).catch(handleErr)
		).data
		if (!!data && !data.error)
			await cacheRequest(paramValue, data)
	} else {
		if (data.error) {
			await removeCache(paramValue)
			throw new Error("please try again")
		}
	}
	data = data as Record<string, any>
	if (isInValid(data))
		throw new Error(data.error || data.description)
	return createBVNDetails(paramValue, data.response)
}

export default { verifyNIN, verifyVNIN, verifyPNIN, verifyBVN, verifyBVN2 }
