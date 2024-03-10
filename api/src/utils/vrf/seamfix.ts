/** @module tools/vrf/seamfix */

import axios, { type AxiosError } from "axios"

import { requestRef } from "../../utils"

if (!process.env.VRF_API_V1_XAUTH)
	throw new Error("missing env variables")

const [userId, ninKey, bvnKey] = process.env.VRF_API_V1_XAUTH.split(':')

const seamFix = axios.create({
	baseURL: "https://api.verified.africa/sfx-verify/v3/id-service/",
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'userid': userId
	}
})

const verifyNIN = async (ninNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': ninNumber,
		'verificationType': 'NIN-SEARCH',
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': ninKey,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	console.log(data)
	if (data.error !== undefined)
		return data
	return {
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
		ninNumber
	}
}

const verifyBVN = async (bvnNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': bvnNumber,
		'verificationType': 'BVN-SEARCH',
		'transactionReference': requestRef()
	}, {
		headers: {
			'apiKey': bvnKey,
		}
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	if (data.error !== undefined)
		return data
	console.log(data)
	return {
		firstName: "AHMAD",
		middleName: "",
		lastName: "TUKUR",
		dateOfBirth: "2001-12-06",
		ninNumber: "123456789001",
		photoData: "",
		qrCodeData: "",
		issueDate: "12-11-2023",
		bvnNumber
	}
}

export default { verifyBVN, verifyNIN }
