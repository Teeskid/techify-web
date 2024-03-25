import { Router as createRouter } from "express"

import inbox from "./inbox"
import outbox from "./outbox"

const msn = createRouter()
msn.use("/inbox", inbox)
msn.use("/outbox", outbox)

export default msn
