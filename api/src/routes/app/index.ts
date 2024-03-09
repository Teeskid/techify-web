import { Router as createRouter } from "express";

import admin from './admin';
import hooks from './hooks';
import users from './users';

const app = createRouter();

app.get("/", (r, res) => {
	res.sendStatus(200)
})
app.use("/admin", admin)
app.use("/hooks", hooks)
app.use("/users", users)

export default app
