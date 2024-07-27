/** @module routes/app */

import { Router as  createRouter } from "express"

import { AppAuth, SignIn, SignUp, ClearUser } from "../handlers/app/auth"
import { ClearCache } from "../handlers/app/misc"

const app = createRouter()

app.use(AppAuth)

app.post("/auth/sign-in", SignIn)
app.post("/auth/sign-up", SignUp)
app.post("/auth/clear-user", ClearUser)

app.get("/clear-cache", ClearCache)
 
export default app
