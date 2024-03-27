require("dotenv").config();

import parser from "body-parser";
import express, { type Request } from "express";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";
import cors from "cors"

import routes from "./routes";

// kill server on restart
process.on("SIGINT", () => {
	process.kill(process.pid)
})

const firebase = initializeApp({
	credential: applicationDefault(),
	projectId: "techify-ng"
})
const firestore = getFirestore(firebase)

const app = express();
app.set("view engine", "ejs")
app.use(parser.json())
app.use(parser.urlencoded({ extended: false }))
app.use(cors({ origin: ["http://localhost:5000"] }))

const doOnce = async (r: Request) => {
	// gather required data
	const ipa = r.socket.remoteAddress
	const url = r.path
	const dat = Date.now()

	// put them in database
	const logs = firestore.collection("logs")
	await logs.doc().create({
		url,
		ipa,
		dat,
		ext: {
			params: r.params,
			query: r.query,
			body: r.body
		}
	}).catch(console.error)
}

// access log middleware
app.use((r, res, next) => {
	// middleware action
	doOnce(r)
	// handle next route
	next()
})

// attach main routes
app.use(routes)
app.use("/static", express.static(path.join(__dirname, "static")))

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	console.log(`Server Running @ ${PORT}`);
})
