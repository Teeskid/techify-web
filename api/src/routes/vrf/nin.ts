import { Router as createRouter } from "express";

import { verifyByNIN, verifyByPhone } from "../../tools/vrf/nin";

const nin = createRouter()

nin.get("/", (r, res) => {
	res.sendStatus(200)
})

nin.get("/data", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByNIN(searchParam))
	res.json({
		code: 200,
		data: details
	})
})

nin.get("/normal", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByNIN(searchParam))
	res.render("vrf/nin-normal", details)
})

nin.get("/standard", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByNIN(searchParam))
	res.render("vrf/nin-standard", details)
})

nin.get("/premium", async (r, res) => {
	const searchParam = String(r.query.searchParam).trim().substring(0, 11)
	const details = await (/^0\d/.test(searchParam) ? verifyByPhone(searchParam) : verifyByNIN(searchParam))
	res.render("vrf/nin-premium", details)
})

export default nin
