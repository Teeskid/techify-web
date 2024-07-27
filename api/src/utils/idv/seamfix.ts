/** @module utils/idv/seamfix */

import axios, { type AxiosError } from "axios"

import type { BVNDetails, NINDetails } from "../../types/idv"
import { cacheRequest, requestCache, removeCache } from "../cache"
import { requestRef, formatDate } from "../utils"

if (process.env.IDV_API_V1_TOKEN === undefined)
	throw new Error("environment variables error")

const [ninKeys, bvnKeys] = process.env.IDV_API_V1_TOKEN.split(":", 2) || ['/', '/']
const [ninKey1, ninKey2] = ninKeys?.split("/", 2) || ['', '']
const [bvnKey1, bvnKey2] = bvnKeys?.split("/", 2) || ['', '']

const seamFix = axios.create({
	baseURL: "https://api.verified.africa/sfx-verify/v3/id-service/",
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"userid": process.env.IDV_API_V1_XUSER
	},
	timeout: 45000
})

const convertNINData = (ninNumber: string, raw: any): NINDetails => {
	// form a new object
	return {
		firstName: raw.firstName || "",
		lastName: raw.surname || "",
		middleName: raw.middleName || "",
		dateOfBirth: formatDate(raw.dateOfBirth)  || "",
		address: {
			stateName: "",
			localGovt: "",
			lineOne: ""
		},
		trackingId: "",
		phoneNumber: raw.trustedNumber || "",
		gender: raw.gender?.substring(0, 1) || "",
		userId: raw.userid || "",
		photoData: raw.photo,
		issueDate: formatDate(raw.ts) || "",
		vNinNumber: raw.vNIN || "",
		ninNumber
	}
}

const convertNINData2 = (ninNumber: string, raw: any): NINDetails => {
	// form a new object
	return {
		firstName: raw.firstname || "",
		lastName: raw.surname || "",
		middleName: raw.middlename || "",
		dateOfBirth: formatDate(raw.birthdate)  || "",
		address: {
			stateName: raw.residenceState || "",
			localGovt: raw.residenceLga || "",
			lineOne: raw.residenceAdressLine1 || ""
		},
		trackingId: "",
		phoneNumber: raw.telephoneno || "",
		gender: raw.gender?.substring(0, 1) || "",
		userId: raw.userid || "",
		photoData: raw.photo,
		issueDate: formatDate(new Date().toString()),
		vNinNumber: raw.vNIN || "",
		ninNumber: raw.nin || ninNumber
	}
}

const convertBVNData = (bvnNumber: string, raw: any): BVNDetails => {
	// reconstruct the details
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
	data: error.response?.data
})

const isInValid = (data: any): boolean => {
	if (!data || Object.keys(data).includes("error"))
		return true
	if (data.responseCode !== "00" || data.verificationStatus !== "VERIFIED")
		return true
	return false
}

const request = (paramType: string, paramValue: string, paramAuth: string) => (
	seamFix.post("/", {
		"countryCode": "NG",
		"searchParameter": paramValue || "SF895332826955L0",
		"verificationType":paramType,
		"transactionReference": requestRef()
	}, {
		headers: {
			"apiKey": paramAuth,
		}
	}).catch(handleErr)
)

const verifyVNIN = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (await request("V-NIN", paramValue || "SF895332826955L0", ninKey1)).data as Record<string, any>
		// cache only valid
		if (!isInValid(data))
			await cacheRequest(paramValue, data)
	} else {
		if (isInValid(data))
			await removeCache(paramValue)
	}
	if (isInValid(data))
		throw new Error(data.description)
	return convertNINData(paramValue, data.response)
}

const verifyNIN = async (paramValue: string): Promise<NINDetails> => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (await request("NIN-VERIFY", paramValue || "SF895332826955L0", ninKey2)).data as Record<string, any>
		// cache only valid data
		if (!isInValid(data))
			await cacheRequest(paramValue, data)
	} else {
		if (isInValid(data))
			await removeCache(paramValue)
		console.log(data)
	}
	if (isInValid(data))
		throw new Error(data.description)
	return convertNINData2(paramValue, data.response as Record<string, any>)
}

const verifyPNIN = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"countryCode": "NG",
				"searchParameter": paramValue || "07030000000",
				"verificationType": "NIN-PHONE-SEARCH",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": ninKey2,
				}
			}).catch(handleErr)
		).data as Record<string, any>
		// cache only valid
		if (!isInValid(data))
			await cacheRequest(paramValue, data)
	} else {
		if (isInValid(data))
			await removeCache(paramValue)
	}
	if (isInValid(data))
		throw new Error(data.description)
	return convertNINData2(paramValue, data.response as Record<string, any>)
}

const verifyBVN = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"searchParameter": paramValue || "11223344556",
				"verificationType": "BVN-FULL-DETAILS",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": bvnKey1,
				}
			}).catch(handleErr)
		).data as Record<string, any>
		// cache only valid
		if (!isInValid(data))
			await cacheRequest(paramValue, data)
	} else {
		if (isInValid(data))
			await removeCache(paramValue)
	}
	if (isInValid(data))
		throw new Error(data.description)
	return convertBVNData(paramValue, data.response)
}

const verifyBVN2 = async (paramValue: string) => {
	let data: Record<string, any> | null = await requestCache(paramValue)
	if (data === null) {
		data = (
			await seamFix.post("/", {
				"searchParameter": paramValue || "12345678901",
				"verificationType": "BVN-FULL-DETAILS",
				"transactionReference": requestRef()
			}, {
				headers: {
					"apiKey": bvnKey2,
				}
			}).catch(handleErr)
		).data as Record<string, any>
		// cache only valid
		if (!isInValid(data))
			await cacheRequest(paramValue, data)
	} else {
		if (isInValid(data))
			await removeCache(paramValue)
	}
	if (isInValid(data))
		throw new Error(data.description)
	return convertBVNData(paramValue, data.response as Record<string, any>)
}

export default { verifyNIN, verifyVNIN, verifyPNIN, verifyBVN, verifyBVN2 }
