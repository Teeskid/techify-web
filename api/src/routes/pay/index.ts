import { Router as createRouter } from "express"

import hooks from "./hooks"

const pay = createRouter()

pay.use("/hooks", hooks)

export default pay
