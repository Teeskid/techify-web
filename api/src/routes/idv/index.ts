/** @module routes/idv */

import { Router as createRouter } from "express";

import hooks from "./hooks";
import media from "./media";
import verify from "./verify";

const idv = createRouter()

idv.use("/verify", verify)
idv.use("/media", media)
idv.use("/hooks", hooks)

export default idv
