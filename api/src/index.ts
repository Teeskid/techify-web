require("dotenv").config();

import parser from "body-parser";
import cors from "cors";
import express from "express";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import path from "path";

import routes from "./routes";

// kill server on exit / restart
process.on("SIGINT", () => {
	process.kill(process.pid)
})

initializeApp({
	credential: applicationDefault(),
	projectId: "techify-ng",
	storageBucket: "techify-ng.appspot.com",
	databaseURL: "https://techify-ng.firebaseio.com",
})

const app = express()
app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "./views"))
app.use(parser.json())
app.use(parser.urlencoded({ extended: false }))
app.use(cors({ origin: true }))
app.use("/static", express.static(path.resolve(__dirname, "../static")))

// access log middleware
app.use((r, res, next) => {
	// handle next route
	console.log(`${r.method} ${r.path}`)
	next()
})
// attach main routes
app.use(routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	console.log(`NODE-SERVICE @ ${PORT}`)
})
