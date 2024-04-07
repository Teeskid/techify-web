/** @module routes/idv */

import { Router as createRouter } from "express";

import { __ } from "../../tools";
import hooks from "./hooks";
import verify from "./verify";

const idv = createRouter()

idv.get("/", __)
idv.use("/verify", verify)
idv.use("/hooks", hooks)

export default idv
