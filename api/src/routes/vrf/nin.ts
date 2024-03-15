import { Router as createRouter, type Request } from "express";

import { verifyByNIN, verifyByPhone, verifyByVNIN } from "../../tools/vrf/nin";
import { NINDetails } from "../../types/vrf";

const nin = createRouter()

const getDetails = async (r: Request) => {
	const paramType = String(r.query.paramType).trim().substring(10)
	const searchParam = String(r.query.searchParam).trim().substring(0, paramType === "vnin" ? 16 : 11)
	let details: NINDetails
	if (paramType === "vnin") {
		details = await verifyByVNIN(searchParam)
	} else if (paramType === "phone") {
		details = await verifyByPhone(searchParam)
	} else {
		details = await verifyByNIN(searchParam)
	}
	return details
}

nin.get("/", (r, res) => {
	res.sendStatus(200)
})

nin.get("/data", async (r, res) => {
	const details = await getDetails(r)
	res.json({
		code: 200,
		data: details
	})
})

nin.get("/normal", async (r, res) => {
	const details = await getDetails(r)
	res.render("vrf/nin-normal", details)
})

nin.get("/standard", async (r, res) => {
	const details = await getDetails(r)
	res.render("vrf/nin-standard", details)
})

nin.get("/premium", async (r, res) => {
	const details = await getDetails(r)
	res.render("vrf/nin-premium", details)
})

export default nin
