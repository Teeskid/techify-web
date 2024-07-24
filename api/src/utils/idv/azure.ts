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

const handleErr = (error: AxiosError) => ({
	data: {
		error: error.message,
		data: error.response?.data
	}
})

const verifyBVN = async (bvnNumber: string) => {
	const { data } = await azure.post("/bvnvalidationsimple/", {
		bvn: bvnNumber
	}).catch(handleErr)
	if (!data || data.error !== undefined)
		throw new Error(data?.error || "unknown error")
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

export default { verifyBVN }
