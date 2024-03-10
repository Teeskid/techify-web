/** @module tools/vrf/nin */

import axios from "axios"
import { getFirestore } from "firebase-admin/firestore"

import type { NINDetails } from "../../types/vrf"
import { requestRef } from "../../utils"
import { sanifyDetails } from "../../utils/vrf/nin"

if (!process.env.VRF_API_V1_XAUTH)
	throw new Error("missing env variables")

const [userId, apiKey] = process.env.VRF_API_V1_XAUTH.split(':')

const seamFix = axios.create({
	baseURL: "https://api.verified.africa/sfx-verify/v3/id-service/",
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'userid': userId,
		'apiKey': apiKey,
	}
})

const fetchByNINS1 = async (ninNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': ninNumber || "09878778990",
		'verificationType': 'NIN-SEARCH',
		'transactionReference': requestRef()
	}).catch((error) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	await getFirestore().collection("data").doc().create({
		cat: 'vrf/nin',
		arg: ninNumber,
		ext: JSON.stringify(data)
	})
	console.log(data)
	return {
		firstName: "AHMAD",
		middleName: "",
		lastName: "TUKUR",
		dateOfBirth: "2001-12-06",
		ninNumber: "123456789001",
		photoData: "",
		qrCodeData: "",
		issueDate: "12-11-2023"
	}
}

const fetchByVNINS1 = async (ninNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': "SF895332826955L0",
		'verificationType': 'VNIN-SEARCH',
		'transactionReference': requestRef()
	}).catch((error) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
	await getFirestore().collection("data").doc().create({
		cat: 'vrf/nin',
		arg: ninNumber,
		ext: JSON.stringify(data)
	})
	console.log(ninNumber, data)
	return {
		firstName: "AHMAD",
		middleName: "",
		lastName: "TUKUR",
		dateOfBirth: "2001-12-06",
		ninNumber: "123456789001",
		photoData: "",
		qrCodeData: "",
		issueDate: "12-11-2023"
	}
}

const fetchByPhoneS1 = async (phoneNumber: string) => {
	const { data } = await seamFix.post("/", {
		'searchParameter': phoneNumber || "07012345678",
		'verificationType': 'NIN-PHONE-SEARCH',
		'transactionReference': requestRef()
	})
	await getFirestore().collection("data").doc().create({
		cat: 'vrf/nin',
		arg: phoneNumber,
		ext: JSON.stringify(data)
	})
	console.log(data)
	return {
		firstName: "AHMAD",
		middleName: "",
		lastName: "TUKUR",
		dateOfBirth: "2001-12-06",
		ninNumber: "123456789001",
		photoData: "",
		qrCodeData: "",
		issueDate: "12-11-2023"
	}
}

export const verifyByNIN = async (ninNumber: string): Promise<NINDetails> => {
	const details = await fetchByNINS1(ninNumber)
	return await sanifyDetails(details)
}

export const verifyByVNIN = async (ninNumber: string): Promise<NINDetails> => {
	const details = await fetchByVNINS1(ninNumber)
	return await sanifyDetails(details)
}

export const verifyByPhone = async (phoneNumber: string) => {
	const details = await fetchByPhoneS1(phoneNumber)
	return await sanifyDetails(details)
}
