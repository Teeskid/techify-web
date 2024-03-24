import { Router as createRouter } from "express";

import nin from "./nin";
import bvn from "./bvn";

const idv = createRouter()

idv.get("/", (r, res) => {
	res.sendStatus(200)
})
idv.use("/nin", nin)
idv.use("/bvn", bvn)

export default idv
