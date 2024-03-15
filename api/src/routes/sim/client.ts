import { Router as createRouter } from "express";

const client = createRouter();

client.get("/", (r, res) => {
	res.sendStatus(200)
})

export default client;
