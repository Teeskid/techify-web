import { Router as createRouter } from "express";

import nin from "./nin";
import bvn from "./bvn";

const vrf = createRouter()

vrf.get("/", (r, res) => {
	res.sendStatus(200)
})
vrf.use("/nin", nin)
vrf.use("/bvn", bvn)

export default vrf
