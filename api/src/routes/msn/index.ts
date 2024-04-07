import { Router as createRouter } from "express"

import hook from "./hook"
import inbox from "./inbox"
import outbox from "./outbox"

const msn = createRouter()

msn.use("/hook", hook)
msn.use("/inbox", inbox)
msn.use("/outbox", outbox)

export default msn
