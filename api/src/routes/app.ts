/** @module routes/app */

import { Router as  createRouter } from "express"

import { SignIn, SignUp, ClearUser } from "../handlers/app/auth"

const app = createRouter()

app.use(AuthWare)

app.post("/auth/sign-in", SignIn)
app.post("/auth/sign-up", SignUp)
app.post("/auth/clear-user", ClearUser)

export default app
