/** @module tools/vrf/seamfix */

import axios, { type AxiosError } from "axios"

import { cacheRequest, requestRef } from "../../utils"

if (!process.env.VRF_API_V1_XUSER || !process.env.VRF_API_V1_TOKEN)
	throw new Error("missing env variables")

const [ninKeys, bvnKeys] = process.env.VRF_API_V1_TOKEN.split(':', 2)
const [ninKey1, ninKey2] = ninKeys.split("/", 3)
const [bvnKey1, bvnKey2, bvnKey3] = bvnKeys.split("/", 3)

const seamFix = axios.create({
	baseURL: "https://api.verified.africa/sfx-verify/v3/id-service/",
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'userid': process.env.VRF_API_V1_XUSER
	},
	timeout: 60000
})

const verifyNIN = async (ninNumber: string) => {
	const { data } = await seamFix.post("/", {
		'verificationType': 'NIN-VERIFY',
		'searchParameter': ninNumber,
		'countryCode': 'NG',
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': ninKey2,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	console.log(data)
	await cacheRequest(ninNumber, data)
	if (data.error !== undefined)
		return data
	const details = data.response
	return {
		firstName: details.firstName,
		lastName: details.surname,
		middleName: details.middleName,
		dateOfBirth: details.dateOfBirth,
		phoneNumber: details.trustedNumber,
		gender: details.gender,
		userId: details.userid,
		photoData: details.photo,
		issueDate: new Date(details.ts).toTimeString(),
		vNinNumber: details.vNIN,
		ninNumber
	}
}

const verifyVNIN = async (vNinNumber: string) => {
	const { data } = await seamFix.post("/", {
		"countryCode": "NG",
		'searchParameter': vNinNumber || "SF895332826955L0",
		'verificationType': "V-NIN",
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': ninKey1,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	console.log(data)
	await cacheRequest(vNinNumber, data)
	if (data.error !== undefined || data.response.responseCode !== "00")
		return data
	const details = data.response
	return {
		firstName: details.firstName,
		lastName: details.surname,
		middleName: details.middleName,
		dateOfBirth: details.dateOfBirth,
		gender: details.gender,
		userId: details.userid,
		photoData: details.photo,
		issueDate: new Date(details.ts).toTimeString(),
		phoneNumber: details.trustedNumber,
		vNinNumber: details.vNIN,
		qrCodeData: "",
	}
}

const verifyNIN2 = async (ninNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': ninNumber,
		'verificationType': 'NIN-SEARCH',
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': ninKey2,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	console.log(data)
	await cacheRequest(ninNumber, data)
	if (data.error !== undefined)
		return data
	return {
		...data,
		/*
		firstName: data.firstName,
		middleName: data.middleName,
		lastName: data.lastName,
		gender: data.gender,
		address: data.residentialAddress,
		dateOfBirth: data.dateOfBirth,
		phoneNumber: data.phoneNumber,
		photoData: "",
		qrCodeData: "",
		issueDate: "12-11-2023",
		*/
		ninNumber
	}
}

const verifyBVN = async (bvnNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': bvnNumber,
		'verificationType': 'BVN-BOOLEAN-MATCH',
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': bvnKey1,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	console.log(data)
	await cacheRequest(bvnNumber, data)
	if (data.error !== undefined)
		return data
	return {
		...data,
		bvnNumber
	}
}

const verifyBVN2 = async (bvnNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': bvnNumber,
		'verificationType': 'BVN-FULL-DETAILS-IGREE',
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': bvnKey2,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	console.log(data)
	await cacheRequest(bvnNumber, data)
	if (data.error !== undefined)
		return data
	return {
		...data,
		bvnNumber
	}
}

const verifyBVN3 = async (bvnNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': bvnNumber,
		'verificationType': 'BVN-FULL-DETAILS',
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': bvnKey3,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	console.log(data)
	await cacheRequest(bvnNumber, data)
	if (data.error !== undefined)
		return data
	return {
		...data,
		bvnNumber
	}
}

export default { verifyNIN, verifyVNIN, verifyNIN2, verifyBVN, verifyBVN2, verifyBVN3 }
