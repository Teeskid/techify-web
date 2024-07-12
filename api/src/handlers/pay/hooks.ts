/** @module handlers/pay/hooks  */

import * as crypto from "crypto";
import type { Request, Response } from "express";
import { getAuth, type UserRecord } from "firebase-admin/auth";

import { sendText } from "../../handlers/msn/outbox";
import { chargeWallet } from "../../handlers/vtu/users";
import { chargeVirtual } from "../../utils/pay/nuban";
import { reportError } from "../../utils/vtu";
import { DEBUG_MODE } from "../../utils/vtu/const";
import { getUidForNuban } from "../../utils/vtu/users";

/**
 * Web Hook For Paystack
 * @param {Request} r
 * @param {Response} res
 * @return {Promise}
 */
export const payStackHook = async (r: Request, res: Response): Promise<void> => {
	// verify event source
	await sendText("telegram", "2348020789906", 'Hook received')
	if (!DEBUG_MODE) {
		const [, PRIVATE_KEY] = (process.env.PAY_API_V1_XAUTH)?.split(':', 2) as [string, string]
		const signature = crypto.createHmac('sha512', PRIVATE_KEY)
			.update(JSON.stringify(r.body)).digest('hex');
		if (signature !== r.headers['x-paystack-signature']) {
			res.sendStatus(401)
			return
		}
	} else {
		console.log('PAYSTACK AUTHENTICATED BYPASSED FOR LOCAL')
	}
	res.sendStatus(200)
	try {
		const { event, data } = r.body
		const email = data.email || data.customer?.email
		if (!event || !email)
			throw new Error('invalid event id')
		const user = await getAuth().getUserByEmail(email)
		let { status, reference, authorization: { channel }, amount } = data
		switch (event) {
			case 'charge.success':
				if (!status || !channel || !amount)
					throw new Error('Invalid paystack transaction')
				amount = parseInt(amount)
				if (amount < 10000)
					throw new Error('Paystack transaction amount below minimum')
				amount -= 5000
				await chargeWallet(user, amount, 'paystack', channel, reference)
				break
			default:
		}
	} catch (error: Error | unknown) {
		// report the error
		const data = JSON.stringify({ headers: r.headers, body: r.body })
		await reportError(`${(<Error>error).message}: ${data}`)
	}
}

/**
 * Web Hook For Kudabank
 * @param {Request} r
 * @param {Response} res
 * @return {Promise<void>}
 */
export const kudaBankHook = async (r: Request, res: Response): Promise<void> => {
	try {

		if (!DEBUG_MODE) {
			const [USERNAME, PASSWORD] = (process.env.PAY_API_V2_XHOOK || ':').split(':')
			const XENCODED = Buffer.from(PASSWORD, 'utf-8').toString('base64')
			if (USERNAME !== r.headers.username || XENCODED !== r.headers.password) {
				res.sendStatus(401)
				throw new Error(`failed kuda authentication`)
			}
		} else {
			// respond with a hi...
			console.log('KUDA AUTHENTICATED BYPASSED FOR LOCAL')
		}
		res.sendStatus(200)
		let { transactionType, transactionReference, accountNumber, amount } = r.body
		if (!transactionReference || !accountNumber || !amount)
			throw new Error('invalid kuda hook request')
		amount = Number.parseFloat(amount)
		if (accountNumber === '3000092732') {
			const { senderName, payingBank } = r.body
			const message = `You have ${transactionType === 'Credit' ? 'received' : 'sent'} ${amount} through kuda kuda biz.\nBank Name: ${payingBank}\nSender Name: ${senderName}`
			throw new Error(message)
		}
		const user: UserRecord = await getAuth().getUser(await getUidForNuban('kudabank', accountNumber))
		switch (transactionType) {
			case 'Credit':
				if (amount < 5000)
					throw new Error('amount below minimum')
				// charge the account on server
				await chargeVirtual('v2', user.uid, amount)
				amount -= 5000
				// send deposit to wallet
				await chargeWallet(user, amount, 'kudabank', 'nuban', transactionReference)
				break
			case 'Reversal':
				// charge the account on server
				amount += 5000
				amount *= -1
				// send deposit to wallet
				await chargeWallet(user, amount, 'kudabank', 'nuban', transactionReference)
				break
			default:
		}
	} catch (error: Error | unknown) {
		// report the error
		const data = JSON.stringify({ headers: r.headers, body: r.body })
		await reportError(`${(<Error>error).message}: ${data}`)
	}
}

/**
 * Web Hook For Payment API V3
 * @param {Request} r
 * @param {Response} res
 * @return {Promise<void>}
 */
export const monnifyHook = async (r: Request, res: Response): Promise<void> => {
	// let's verify the event sent
	try {
		const [, PAY_API_V3_SECRET] = (process.env.PAY_API_V2_XAUTH as string).split(':', 2)
		const hasher = crypto.createHmac("sha512", PAY_API_V3_SECRET)
		const hashed = hasher.update(JSON.stringify(r.body), "utf-8").digest("hex")
		await reportError(hashed)
		// a hi to respond with
		res.sendStatus(200)
	} catch (error: Error | unknown) {
		res.sendStatus(500)
		await reportError((<Error>error).message)
	}

	let { eventType, eventData } = <{ eventType: string, eventData: object }>r.body

	switch (eventType) {
		case 'SUCCESSFUL_TRANSACTION':
			eventData = <{
				"product": {
					"reference": "1636106097661",
					"type": "RESERVED_ACCOUNT" | "WEB_SDK" | "OFFLINE_PAYMENT_AGENT"
				},
				"transactionReference": "MNFY|04|20211117112842|000170",
				"paymentReference": "MNFY|04|20211117112842|000170",
				"paidOn": "2021-11-17 11:28:42.615",
				"paymentDescription": "Adm",
				"metaData": object, // json: name, email
				"paymentSourceInformation": [
					{
						"bankCode": "",
						"amountPaid": 3000,
						"accountName": "Monnify Limited",
						"sessionId": "e6cV1smlpkwG38Cg6d5F9B2PRnIq5FqA",
						"accountNumber": "0065432190"
					}
				],
				"destinationAccountInformation": {
					"bankCode": "232",
					"bankName": "Sterling bank",
					"accountNumber": "6000140770"
				},
				"amountPaid": 3000,
				"totalPayable": 3000,
				"cardDetails": object,
				"paymentMethod": "ACCOUNT_TRANSFER",
				"currency": "NGN",
				"settlementAmount": "2990.00",
				"paymentStatus": "PAID",
				"customer": {
					"name": "John Doe",
					"email": "test@tester.com"
				}
			}>eventData

			// CARD PAYMENT
			eventData = <{
				"product": {
					"reference": "596048268",
					"type": "WEB_SDK"
				},
				"transactionReference": "MNFY|23|20211117124920|042042",
				"paymentReference": "596048268",
				"paidOn": "2021-11-17 12:50:19.269",
				"paymentDescription": "Pay With Monnify",
				"metaData": {
					"name": "Damilare",
					"age": "45"
				},
				"paymentSourceInformation": [],
				"destinationAccountInformation": object,
				"amountPaid": 100,
				"totalPayable": 100,
				"cardDetails": {
					"last4": "2718",
					"expMonth": "10",
					"expYear": "22",
					"bin": "506102",
					"reusable": false
				},
				"paymentMethod": "CARD",
				"currency": "NGN",
				"settlementAmount": "98.71",
				"paymentStatus": "PAID",
				"customer": {
					"name": "",
					"email": "ore2@monnify.com"
				}
			}>eventData

			// OFFLINE_PAYMENT_AGENT
			eventData = <{
				"product": {
					"reference": "MNF-Tl9Noo0G48000890",
					"type": "OFFLINE_PAYMENT_AGENT"
				},
				"transactionReference": "MNFY|76|20230830171357|000252",
				"invoiceReference": "MNF-Tl9Noo0G48000890",
				"paymentReference": "MNF-Tl9Noo0G48000890",
				"paidOn": "30/08/2023 5:13:57 PM",
				"paymentDescription": "adron",
				"metaData": {
					"phoneNumber": "08088523241",
					"name": "Khalid"
				},
				"destinationAccountInformation": object,
				"paymentSourceInformation": object,
				"amountPaid": 15000,
				"totalPayable": 15000,
				"offlineProductInformation": {
					"amount": 15000,
					"code": "56417",
					"type": "INVOICE"
				},
				"cardDetails": object,
				"paymentMethod": "CASH",
				"currency": "NGN",
				"settlementAmount": 14990,
				"paymentStatus": "PAID",
				"customer": {
					"name": "David Customer",
					"email": "mayluv55@hotmail.co.uk"
				}
			}>eventData
			break;
		case 'SUCCESSFUL_DISBURSEMENT':
			eventData = <{
				"amount": 10,
				"transactionReference": "MFDS|20210317032332|002431",
				"fee": 8,
				"transactionDescription": "Approved or completed successfully",
				"destinationAccountNumber": "0068687503",
				"sessionId": "090405210317032336726272971260",
				"createdOn": "17/03/2021 3:23:32 AM",
				"destinationAccountName": "DAMILARE SAMUEL OGUNNAIKE",
				"reference": "ref1615947809303",
				"destinationBankCode": "232",
				"completedOn": "17/03/2021 3:23:38 AM",
				"narration": "This is a quite long narration",
				"currency": "NGN",
				"destinationBankName": "Sterling bank",
				"status": "SUCCESS"
			}>eventData
			break
		case 'FAILED_DISBURSEMENT':
			eventData = <{
				"amount": 1001,
				"transactionReference": "MFDS|20210317032705|002433",
				"fee": 8,
				"destinationAccountNumber": "0068687503",
				"sessionId": "",
				"createdOn": "17/03/2021 3:27:05 AM",
				"destinationAccountName": "DAMILARE SAMUEL OGUNNAIKE",
				"reference": "ref1615948022891",
				"destinationBankCode": "232",
				"completedOn": "17/03/2021 3:32:09 AM",
				"narration": "This is a quite long narration",
				"currency": "NGN",
				"destinationBankName": "Sterling bank",
				"status": "FAILED"
			}>eventData
			break
		case 'REVERSED_DISBURSEMENT':
			eventData = <{
				"transactionReference": "MFDS20210629125410AAAADP",
				"reference": "ref1624967649578",
				"narration": "911 Transaction",
				"currency": "NGN",
				"amount": 10.00,
				"status": "REVERSED",
				"fee": 1.00,
				"destinationAccountNumber": "0700306714",
				"destinationAccountName": "MEKILIUWA SMART CHINONSO",
				"destinationBankCode": "101",
				"sessionId": "ATL210629AABGPF",
				"createdOn": "29/06/2021 12:54:10 PM",
				"completedOn": "29/06/2021 12:54:12 PM"
			}>eventData
			break
		case 'SUCCESSFUL_REFUND':
			eventData = <{
				"merchantReason": "defective goods",
				"transactionReference": "MNFY|20190816083102|000021",
				"completedOn": "14/04/2021 4:24:05 PM",
				"refundStatus": "COMPLETED",
				"customerNote": "defects",
				"createdOn": "14/04/2021 4:23:37 PM",
				"refundReference": "ref001",
				"refundAmount": string
			}>eventData
			break
		case 'FAILED_REFUND':
			eventData = <{
				"merchantReason": "defective goods",
				"transactionReference": "MNFY|20190816083102|000021",
				"completedOn": "14/04/2021 4:24:05 PM",
				"refundStatus": "FAILED",
				"customerNote": "defects",
				"createdOn": "14/04/2021 4:23:37 PM",
				"refundReference": "ref001",
				"refundAmount": string
			}>eventData
			break
		case 'SETTLEMENT':
			eventData = <{
				"amount": "1199.00",
				"settlementTime": "11/11/2021 02:29:00 PM",
				"settlementReference": "LB8HG1PNZT4ATJGZXQBY",
				"destinationAccountNumber": "6000000249",
				"destinationBankName": "Fidelity Bank",
				"destinationAccountName": "Teamapt Limited234",
				"transactionsCount": 1,
				"transactions": [
					{
						"product": {
							"reference": "2134565wda",
							"type": "2134565wda"
						},
						"transactionReference": "MNFY|26|20211111142601|000001",
						"paymentReference": "MNFY|26|20211111142601|000001",
						"paidOn": "11/11/2021 02:26:02 PM",
						"paymentDescription": "Seg",
						"accountPayments": [
							{
								"bankCode": "000014",
								"amountPaid": "1234.00",
								"accountName": "Okeke Chimezie",
								"accountNumber": "******1070"
							}
						],
						"amountPaid": "1234.00",
						"totalPayable": "1234.00",
						"accountDetails": {
							"bankCode": "000014",
							"amountPaid": "1234.00",
							"accountName": "Okeke Chimezie",
							"accountNumber": "******1070"
						},
						"cardDetails": object,
						"paymentMethod": "ACCOUNT_TRANSFER",
						"currency": "NGN",
						"paymentStatus": "PAID",
						"customer": {
							"name": "Segun Adeponle",
							"email": "segunadeponle@gmail.com"
						}
					}
				]
			}>eventData
			break
		case 'REJECTED_PAYMENT':
			eventData = <{
				"metaData": string, // "{"name":"Marvelous","age":"90"}",
				"product": {
					"reference": "MNFY|PAYREF|GENERATED|1687798434397393735",
					"type": "WEB_SDK"
				},
				"amount": 100,
				"paymentSourceInformation": {
					"bankCode": "50515",
					"amountPaid": 40,
					"accountName": "MARVELOUS BENJI",
					"sessionId": "090405230626180003067844645188",
					"accountNumber": "5141901487"
				},
				"transactionReference": "MNFY|85|20230626175354|041855",
				"created_on": "2023-06-26 17:53:55.0",
				"paymentReference": "MNFY|PAYREF|GENERATED|1687798434397393735",
				"paymentRejectionInformation": {
					"bankCode": "035",
					"destinationAccountNumber": "7023576853",
					"bankName": "Wema bank",
					"rejectionReason": "UNDER_PAYMENT" | "OVER_PAYMENT" | "ACCOUNT_NOT_IN_USE",
					"expectedAmount": 100
				},
				"paymentDescription": "lets pay",
				"customer": {
					"name": "Marvelous Benji",
					"email": "benji71@gmail.com"
				}
			}>eventData
			break
	}
	await reportError(JSON.stringify(eventData))
	/**
	 *
	 * Supported Event Types
	 *
	 * Successful Collection: A successful payment was made on your account. This could be card, account transfer or cash payments.
	 * Successful Disbursement: This is sent when a disbursement transaction has a successful definite status.
	 * Failed Disbursement: This is sent when a disbursement transaction fails.
	 * Successful Refund: This is sent when an initiated refund has been processed successfully.
	 * Failed Refund: This is sent when an initiated refund fails.
	 * Settlement Completion: This is sent when settlement to your bank account or wallet is processed successfully.
	 */
}

/**
 * Web Hook For FlutterWave
 * @param {Request} r
 * @param {Response} res
 * @return {Promise<void>}
 */
export const flutterHook = async (r: Request, res: Response): Promise<void> => {
	res.sendStatus(400)
}

export default {}
