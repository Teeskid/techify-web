import { Router as createRouter } from "express"

import hooks from "./hooks"
import inbox from "./inbox"
import outbox from "./outbox"

const msn = createRouter()

msn.use("/hooks", hooks)
msn.use("/inbox", inbox)
msn.use("/outbox", outbox)

export default msn
