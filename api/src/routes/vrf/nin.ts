import { Router as createRouter } from "express";

import { verifyByNIN, verifyByVNIN, verifyByPhone } from "../../tools/vrf/nin";

const nin = createRouter()

nin.get("/", (r, res) => {
	res.sendStatus(200)
})

nin.get("/data", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByVNIN(searchParam))
	res.json({
		data: details
	})
})

nin.get("/normal", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByNIN(searchParam))
	res.render("nin-normal", {
		data: details
	})
})

nin.get("/standard", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByNIN(searchParam))
	res.render("nin-standard", {
		data: details
	})
})

nin.get("/premium", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByNIN(searchParam))
	res.render("nin-premium", {
		data: details
	})
})

export default nin
