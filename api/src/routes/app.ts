/** @module routes/app */

import { Router as  createRouter } from "express"

import { AuthMiddleWare, SignIn, SignUp, ClearUser } from "../handlers/app/auth"
import { ClearCache } from "../handlers/app/misc"

const app = createRouter()

// makes sure that auth headers are where required
app.use(AuthMiddleWare)

app.post("/auth/sign-in", SignIn)
app.post("/auth/sign-up", SignUp)
app.post("/auth/clear-user", ClearUser)

app.get("/clear-cache", ClearCache)
 
export default app
