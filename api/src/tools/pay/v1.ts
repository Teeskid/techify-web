/** @module apx-library/payment/v1 */
import * as https from "https"

import { isAxiosError, type AxiosInstance } from "axios"
import type { AccountInfo, Bank, Transfer, Virtual } from "techify-apx/types"
import axios from "../../utils/vtu/axios"
import { DEBUG_MODE, REQUEST_TIMEOUT } from "../../utils/vtu/const"
import { codedPhone } from "../../utils/vtu/utils"
import type { Server, SrvInfo } from "./types"

type _Virtual = {
	"status": boolean,
	"message": string,
	"data": {
		"transactions": [],
		"subscriptions": [],
		"authorizations": [],
		"first_name": null,
		"last_name": null,
		"email": string,
		"phone": string,
		"metadata": null,
		"domain": "live",
		"customer_code": string,
		"risk_action": "default",
		"id": 17593,
		"integration": 190972,
		"createdAt": "2019-10-25T15:05:23.000Z",
		"uda": "2019-10-25T15:05:23.000Z",
		"created_at": "2019-10-25T15:05:23.000Z",
		"updated_at": "2019-10-25T15:05:23.000Z",
		"total_transactions": 0,
		"total_transaction_value": [],
		"dedicated_account": {
			"id": 59,
			"account_name": "KAROKART/RHODA CHURCH",
			"account_number": "9807062474",
			"created_at": "2019-09-10T11:10:12.000Z",
			"updated_at": "2019-10-25T15:05:24.000Z",
			"currency": "NGN",
			"active": true,
			"assigned": true,
			"provider": {
				"id": 1,
				"provider_slug": "wema-bank",
				"bank_id": 20,
				"bank_name": "Wema Bank"
			},
			"assignment": {
				"assignee_id": 17593,
				"assignee_type": "Customer",
				"account_type": "PAY-WITH-TRANSFER-RECURRING",
				"integration": 190972
			}
		}
	}
}

type _Virtuals = {
	"status": true,
	"message": "Managed accounts successfully retrieved",
	"data": [
		{
			"customer": {
				"id": 1530104,
				"first_name": "yinka",
				"last_name": "Ojo",
				"email": "hello@company.co",
				"customer_code": "CUS_dy1r7ts03zixbq5",
				"phone": "08154239386",
				"risk_action": "default",
				"international_format_phone": null
			},
			"bank": {
				"name": "Wema Bank",
				"id": 20,
				"slg": "wema-bank"
			},
			"id": 173,
			"account_name": "KAROKART/A YINKA",
			"account_number": "9930020212",
			"created_at": "2019-12-09T13:31:38.000Z",
			"updated_at": "2020-06-11T14:04:28.000Z",
			"currency": "NGN",
			"split_config": {
				"subaccount": "ACCT_xdrne0tcvr5jkei"
			},
			"active": true,
			"assigned": true
		}
	],
	"meta": {
		"total": 1,
		"skipped": 0,
		"perPage": 50,
		"page": 1,
		"pageCount": 1
	}
}

/**
 * Paystack implementation
 * @implements {Server}
 */
class V1 implements Server {
	private static TEST_DATA = {
		phoneNumber: '08145737179',
		trackingReference: 'EagOTGlxZB4fsGCbtPmq7kisRiio'
	}
	VIRTUAL_INDEX = 'paystack'
	// available virtual banks
	VIRTUAL_BANKS: { [i: string]: Bank } = {
		wma: {
			slg: 'wema-bank',
			cod: '999',
			nam: 'Wema Bank'
		},
		acs: {
			slg: 'access-bank',
			cod: '999',
			nam: 'Access Bank'
		},
	}
	// internal axios instance
	#_axios: AxiosInstance
	_isEmulator = DEBUG_MODE

	/**
	 * @constructor
	 */
	constructor() {
		const [, PRIVATE_KEY] = (process.env.PAY_API_V1_XAUTH)?.split(':', 2) as [string, string]
		this.#_axios = axios.create({
			baseURL: 'https://api.paystack.co',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${PRIVATE_KEY}`,
			},
			timeout: REQUEST_TIMEOUT,
			httpsAgent: new https.Agent({ keepAlive: true })
		})
	}

	/**
	 * sends request to kuda open api
	 * @param {string} method
	 * @param {string} path
	 * @param {string | null} options
	 * @return {Promise<object>}
	 */
	async #_request<T extends object>(method: "GET" | "POST" | "PUT" | "DELETE" | string, path?: string, options?: Record<string, string | number | boolean | object>): Promise<T> {
		let requestPath
		let requestMethod
		if (!path) {
			requestPath = method
			requestMethod = 'GET'
		} else {
			requestPath = path
			requestMethod = method
		}
		let payLoad: object | null
		if (options) {
			if (this._isEmulator && requestPath.match('dedicated') !== null) {
				payLoad = Object.assign({}, options, V1.TEST_DATA)
			} else {
				payLoad = Object.assign({}, options)
			}
		} else {
			payLoad = null
		}
		payLoad = payLoad as object
		const { data } = await this.#_axios.request<T>({
			url: requestPath,
			method: requestMethod,
			data: payLoad,
		})
		return data
	}

	/**
	 * get basic data from payment server
	 * @return {Promise<SrvInfo>}
	 */
	async getBasic(): Promise<SrvInfo> {
		const response = await this.#_request<{
			status: boolean,
			message: string,
			data: {
				total_volume: number
			}
		}>('/transaction/totals')
		if (!response.status)
			throw new Error(response.message)
		const balance = response.data.total_volume / 100
		/*
		let { data: total } = await ('/settlement', {
			params: {
				perPage: 1
			}
		})
		*/
		return {
			bal: balance
		}
	}

	/**
	 * get banks list from payment server
	 * @return {Promise<Array<Bank>>}
	 */
	async getBankList(): Promise<Array<Bank>> {
		const response = await this.#_request<{
			status: boolean,
			message: string,
			data: Array<{ name: string, code: string, slug: string }>
		}>('/bank?country=nigeria&currency=NGN&type=nuban')
		if (!response.status)
			throw new Error(response.message)
		return response.data.map<Bank>(({ name, code, slug }) => (<Bank>{ nam: name, cod: code, slg: slug }))
	}

	/**
	 * fetches a nuban info on the server
	 * @param {string} uid
	 * @return {Promise<Virtual[]>}
	 */
	async getVirtual(uid: string): Promise<Virtual> {
		const response: _Virtual | null = await this.#_request<_Virtual>(`/dedicated_account/${uid}`).catch((error) => {
			if (isAxiosError<_Virtual>(error))
				return error.response?.data as _Virtual || null
			return null
		})
		if (!response || !response.status)
			throw new Error(response?.message)
		return {
			uid: response.data.customer_code,
			name: response.data.dedicated_account.account_name,
			email: response.data.email,
			nuban: response.data.dedicated_account.account_number,
			phone: response.data.phone,
			active: response.data.dedicated_account.active,
		}
	}

	/**
	 * get accounts list from payment server
	 * @param {number} page
	 * @return {Promise<Virtual[] | null>}
	 */
	async getVirtuals(page: number): Promise<Virtual[] | null> {
		const response: _Virtuals | null = await this.#_request<_Virtuals>(`dedicated_account?page=${page}`).catch((error) => {
			if (isAxiosError<_Virtuals>(error))
				return error.response?.data as _Virtuals | null
			return null
		})
		if (!response?.status)
			throw new Error(response?.message)
		return response.data.map<Virtual>((virtual) => ({
			uid: virtual.customer.customer_code,
			name: virtual.account_name,
			email: virtual.customer.email,
			nuban: virtual.account_number,
			phone: virtual.customer.phone,
			active: true
		}))
	}

	/**
	 * Fetches user balance by uid
	 * @param {string} uid
	 * @return {Promise<number>}
	 */
	async getBalance(uid: string): Promise<number> {
		// retrieve balance
		String(uid)
		throw new Error('unimplemented')
	}

	/**
	 * updates a nuban info on the server
	 * @param {string} uid
	 * @param {object} details
	 * @return {Promise<Array<Nuban>>}
	 */
	async createVirtual(uid: string, details: { email: string; phoneNumber: string; displayName: string }): Promise<Virtual> {
		let [firsName, middleName, lastName] = details.displayName.split(' ', 3)
		if (!lastName) {
			lastName = middleName
			middleName = ''
		}
		const { data } = await this.#_axios.post<{
			"status": boolean,
			"message": string
		}>('', {
			"email": details.email,
			"first_name": firsName,
			"middle_name": middleName,
			"last_name": lastName,
			"phone": codedPhone(details.phoneNumber),
			"preferred_bank": DEBUG_MODE ? "test-bank" : this.VIRTUAL_BANKS.wema.cod,
			"country": "NG"
		})
		if (!data.status)
			throw new Error(data.message)
		return await this.getVirtual(uid)
	}

	/**
	 * charges an account on the server
	 * @param {string} uid
	 * @param {number} amount
	 * @return {Promise<Array<Nuban>>}
	 */
	async chargeVirtual(uid: string, amount: number): Promise<string> {
		String(amount)
		throw new Error('unimplemented')
	}

	/**
	 * toggles virtual account on the server
	 * @param {string} uid
	 * @param {boolean} enable
	 * @return {Promise<string>}
	 */
	async disableVirtual(uid: string, enable: boolean): Promise<string> {
		String(enable)
		throw new Error('unimplemented')
	}

	/**
	 * Finds an existing bulk transfer request
	 * @param {string} reference
	 * @return {Promise<Transfer | null>}
	 */
	async findTransfer(reference: string): Promise<Transfer | null> {
		String(reference)
		return null
	}

	/**
	 * Resolves account information from the serve
	 * @param {Bank} bank
	 * @param {string} nuban
	 * @return {Promise<string | null>}
	 */
	async resolveInfo(bank: Bank, nuban: string): Promise<AccountInfo | null> {
		String(nuban)
		return null
	}

	/**
	 * Transfers fund to an account
	 * @param {string} uid
	 * @param {AccountInfo} acctInfo
	 * @param {number} amount
	 * @return {Promise<string  | null>}
	 */
	async iTransferFund(uid: string, acctInfo: AccountInfo, amount: number): Promise<string | null> {
		String(amount)
		return null
	}

	/**
	 * Transfers fund to an account
	 * @param {AccountInfo} acctInfo
	 * @param {number} amount
	 * @return {Promise<string | null>}
	 */
	async eTransferFund(acctInfo: AccountInfo, amount: number): Promise<string | null> {
		String(amount)
		return null
	}

	/**
	 * Handles bulk transfers in chunks
	 * @param {AccountInfo[]} acctInfo
	 * @param {number} amount
	 * @return {Promise<string | null>}
	 */
	async bulkTransfer(acctInfo: AccountInfo[], amount: number): Promise<string | null> {
		String(amount)
		return null
	}
}

/**
 *
 * *************
 * bank_transfer
 * amount
 * reference
 *
 * /charge
 *
 *  "email": "customer@email.com",
  "amount": "10000",
  "metadata": {
	"custom_fields": [
	  {
		"value": "makurdi",
		"display_name": "Donation for",
		"variable_name": "donation_for"
	  }
	]
  },
  "bank": {
	  code: "057",
	  account_number: "0000000000"
  },
  "birthday": "1995-12-23"

*************************************

   "status": true,
  "message": "Charge attempted",
  "data": {
	"amount": 200,
	"currency": "NGN",
	"transaction_date": "2017-05-24T05:56:12.000Z",
	"status": "success",
	"reference": "zuvbpizfcf2fs7y",
	"domain": "test",
	"metadata": {
	  "custom_fields": [
		{
		  "display_name": "Merchant name",
		  "variable_name": "merchant_name",
		  "value": "Van Damme"
		},
		{
		  "display_name": "Paid Via",
		  "variable_name": "paid_via",
		  "value": "API call"
		}
	  ]
	},
	"gateway_response": "Successful",
	"message": null,
	"channel": "card",
	"ip_address": "54.154.89.28, 162.158.38.82, 172.31.38.35",
	"log": null,
	"fees": 3,
	"authorization": {
	  "authorization_code": "AUTH_6tmt288t0o",
	  "bin": "408408",
	  "last4": "4081",
	  "exp_month": "12",
	  "exp_year": "2020",
	  "channel": "card",
	  "card_type": "visa visa",
	  "bank": "TEST BANK",
	  "country_code": "NG",
	  "brand": "visa",
	  "reusable": true,
	  "signature": "SIG_uSYN4fv1adlAuoij8QXh",
	  "account_name": "BoJack Horseman"
	},
	"customer": {
	  "id": 14571,
	  "first_name": null,
	  "last_name": null,
	  "email": "test@email.co",
	  "customer_code": "CUS_hns72vhhtos0f0k",
	  "phone": null,
	  "metadata": null,
	  "risk_action": "default"
	},
	"plan": null
  }


 */

export default new V1()
