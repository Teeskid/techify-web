/** @module utils/vrf/azure */

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
	console.error(ninNumber)
	throw new Error("unimplemented")
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
	}
}

export default { verifyBVN, verifyNIN }
