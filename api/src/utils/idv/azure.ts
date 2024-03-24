/** @module utils/idv/azure */

import axios, { type AxiosError } from "axios"

const azure = axios.create({
	baseURL: "https://nmfbnode.azurewebsites.net/api/v1",
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	},
	timeout: 60000
})

const verifyNIN = async (ninNumber: string) => {
	// console.error(ninNumber)
	// throw new Error("unimplemented")
	const { data } = await azure.post("/ninvalidationsimple/", {
		nin: ninNumber
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
		ninNumber
	}
}

const verifyBVN = async (bvnNumber: string) => {
	const { data } = await azure.post("/bvnvalidationsimple/", {
		bvn: bvnNumber
	}).catch((error: AxiosError) => ({
		data: {
			error: error.message,
			data: error.response?.data
		}
	}))
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
		bvnNumber
	}
}

export default { verifyBVN, verifyNIN }
