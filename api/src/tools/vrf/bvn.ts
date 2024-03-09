/** @module tools/vrf/bvn */

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

const fetchByBVNS1 = async (bvnNumber: string) => {
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

export const verifyByBVN = () => {
	
}

export default {}
