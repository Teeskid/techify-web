/** @module routes/sim */

import axios from "axios";
import { Router as createRouter, type Request, type Response } from "express";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { randomBytes } from "crypto";

import { UssdCallback, UssdRequest } from "../types/sim";
import { postUssd } from "../utils/sim/client";
import { verifyIdToken } from "../utils/app/auth";

const sim = createRouter()

sim.route("/client/ussd").get((r, res) => {
    res.sendStatus(200)
}).post(async (r, res) => {
    /**
     * for running ussd code in (a)sync
     */
    try {
        await postUssd("token", "*310#", false)
        res.json({ code: 200, text: "USSD Code sent for processing on the server." })
    } catch (error: Error | unknown) {
        res.json({ code: 500, text: (error as Error).message })
    }
})

/**
 * TODO: register server for a user id
 */
sim.post("/auth", async (r, res) => {
	const context = await verifyIdToken(r, res)
	if (!context) {
		return
	}
	console.log(context)

	const token = String(r.body.token).trim()
	const title = String(r.body.title).trim()
	if ((!token || token.length === 0) || (!title || title.length === 0)) {
		res.json({
			code: 403,
			text: "invalid title / registration token provided"
		})
		return
	}

	const store = getFirestore()
	const devDoc = store.collection("usrs").doc(context.uid).collection("devs").doc()
	const codeId = randomBytes(999999).toString("hex")
	const devRes = await devDoc.create({
		nam: title,
		uid: token,
		cod: codeId,
		dat: Timestamp.now(),
		stt: null
	})

	res.json({
		code: 200,
		text: "device authentication successful",
		data: {
			cod: 0,
			uid: devDoc.id,
			dat: devRes.writeTime
		}
	})
})

/**
 * TODO: used to toggle server on / off
 */
sim.post("/power", async (r, res) => {
	const context = await verifyIdToken(r, res)
	if (!context) {
		return
	}

	const token = String(r.body.token).trim()
	if (!token || token.length === 0) {
		res.json({
			code: 403,
			text: "invalid registration token provided"
		})
		return
	}

	const subs = await getMessaging().subscribeToTopic(token, "sim-service")
	if (subs.failureCount !== 0) {
		res.json({
			code: 500,
			text: "failed to subscribe to sim service"
		})
		return
	}
	res.json({
		code: 200,
		text: "subscribed to sim service successfully"
	})

	console.log("AUTH: ", context)
})

sim.get("/status", (r, res) => {
	res.sendStatus(200)
})

sim.route("/sms").get((r, res) => {
	const data: object[] = []

	// return the json data
	res.json({
		data: data
	})
}).post((r, res) => {
	// request to send sms via the server
	res.sendStatus(200)

	const { recipent, message, retry } = r.body

	console.error("UNIMPLEMENTED")

	res.json({
		recipent,
		message,
		retry
	})
})

sim.route("/ussd").get((r, res) => {
	const data: object[] = []

	// return the json data
	res.json({
		data: data
	})
}).post((r, res) => {
	res.sendStatus(200)
})

/**
 * sim-hooks
 */
// ssd Steps Integers
const STEP_REDEEMS = 0
const STEP_ENTERED = 1
const STEP_SUCCESS = 2
const STEP_FAILURE = -1

const CODES_PREFIX = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"]
const MATCH_COUPON = /^\d{12}$/ig
const MATCH_ENTIRE = /^\*384\*000\*\d{12}#$/ig

// Hold States In Memory
const SESSN_LOGGER: Record<string, number> = {}

sim.get("/", (r, res) => {
	// stub route test
	res.sendStatus(200)
})

sim.route("/africa-callback").get((r, res) => {
	// stub route test
	res.sendStatus(200)
}).post(async (r: Request<{}, string, UssdRequest>, res: Response<string>) => {
	console.log('USSD-SESSION-BODY', JSON.stringify(r.body))
	// Read the variables sent via POST from our API
	let { sessionId, serviceCode, phoneNumber, text } = r.body || {}
	// redirect codes for strano
	if (MATCH_ENTIRE.test(serviceCode)) {
		if (MATCH_COUPON.test(serviceCode)) {
		}
		if (CODES_PREFIX.includes(serviceCode.substring(1))) {
		}
	} else {
		if (false) {
			const { data: strano } = await axios.post("https://api.strano.io/hooks/africa-callback", {
				...r.body,
				token: 'xczgdjgshdgjdgjhasfdgjshf'
			})
			res.json(strano)
			return
		}
	}

	// We are returning a response anyway
	let response: string = ""
	let currStep: number = NaN

	// run while handling errors
	try {
		// sanitize ussd request input
		sessionId = String(sessionId).trim()
		serviceCode = String(serviceCode).trim()
		phoneNumber = String(phoneNumber).trim()
		text = String(text).trim()

		// deal with the real handling now
		if (text.indexOf("*") !== -1) {
			// long multi session ussd not supported
			res.send("END Invalid request")
			return
		}

		// what does the user actually wants
		if (text === "") {
			response = "CON 1. Redeem Coupon Code\n2. Validate Coupon Code\n3. Find Nearest Agent"
			currStep = STEP_REDEEMS
		} else if (text === "1") {
			response = "CON Enter the coupon code"
			currStep = STEP_ENTERED
		} else if (MATCH_COUPON.test(text)) {
			response = "END Your line has been credited with 1GB SME Data successfully. Dial *323*4# to check balance."
			currStep = STEP_SUCCESS
		} else {
			response = "END The coupon code you entered is not valid. Please check and try again later."
			currStep = STEP_FAILURE
		}
	} catch (error: Error | unknown) {
		console.error('USSD-CALL-ERROR', error)
		response = `END An unknown error has occured. Please try later.`
		currStep = STEP_FAILURE
	} finally {
		// no empty response
		if (Number.isNaN(currStep)) {
			response = "END USSD Working Perfectly In Development"
			currStep = STEP_FAILURE
		}
		// Send the response back to the API
		res.send(response)

		// save the state in memory
		SESSN_LOGGER[phoneNumber] = currStep
	}
})

sim.route("/africa-events").get((r, res) => {
	// stub response
	res.sendStatus(200)
}).post(async (r: Request<{}, string, UssdCallback>, res) => {
	// set our headers right now
	res.sendStatus(200)

	// Read the variables sent via POST from our API
	let {
		sessionId,
		serviceCode,
		phoneNumber,
		input,
	} = r.body;

	try {
		// sanitize the inputs
		sessionId = String(sessionId).trim()
		serviceCode = String(serviceCode).trim()
		phoneNumber = String(phoneNumber).trim()
		input = String(input).trim()

		// save state to database 
		const store = getFirestore()
		const ussd = store.collection("ussd")

		const runDoc = ussd.doc()
		await runDoc.set({
			sid: sessionId,
			scc: serviceCode,
			uid: phoneNumber,
			uda: input,
			run: null,
			dat: Date.now(),
		})

		const runId = runDoc.id
		console.log('USSD-EVENT-DONE', runId)
	} catch (error: Error | unknown) {
		console.error('USSD-EVENT-ERROR', error)
	} finally {
		delete SESSN_LOGGER[phoneNumber]
	}
})

sim.all("/sms-callback", async (r: Request, res: Response) => {
	res.sendStatus(200)
	console.log("SIM_SMS_CALL", JSON.stringify(r.body))
})

sim.all("/ussd-callback", async (r: Request, res: Response) => {
	res.sendStatus(200)
	console.log("SIM_USSD_CALL", JSON.stringify(r.body))
})

sim.all("/status-callback", async (r: Request, res: Response) => {
	res.sendStatus(200)
	console.log("SIM_STATUS_CALL", JSON.stringify(r.body))
})

export default sim