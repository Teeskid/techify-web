/** @module apx-library/payment/v3 */
import axios, { isAxiosError, type AxiosInstance } from "axios"

import type { AccountInfo, Bank, Transfer, Virtual } from "apx/types"

import { shortId } from "../../utils/vtu"
import { DEBUG_MODE } from "../../utils/vtu/const"
import type { Server, SrvInfo } from "./types"

type _GetBanks = {
	requestSuccessful: boolean,
	responseMessage: string,
	responseCode: string,
	responseBody: {
		name: string,
		code: string,
		ussdTemplate: string,
		baseUssdCode: string,
		transferUssdTemplate: string
	}[]
}

type _Auth = {
	requestSuccessful: boolean,
	responseMessage: string,
	responseCode: string,
	responseBody: {
		accessToken: string,
		expiresIn: number
	}
}

export type _Virtual = {
	requestSuccessful: boolean,
	responseMessage: string,
	responseCode: string,
	responseBody: {
		contractCode: string,
		accountReference: string,
		accountName: string,
		currencyCode: string,
		customerEmail: string,
		customerName: string,
		accounts: {
			bankCode: string,
			bankName: string,
			accountNumber: string
		}[],
		collectionChannel: string,
		reservationReference: string,
		reservedAccountType: string,
		status: string,
		createdOn: string,
		contract: {
			name: string,
			code: string,
			description: null
		},
		transactionCount: number,
		bvn: string,
		restrictPaymentSource: boolean
	}
}

type _Virtuals = {
	requestSuccessful: true,
	responseMessage: string,
	responseCode: '0',
	responseBody: {
		"contractCode": "915483727511",
		"accountReference": "1579703193286",
		"accountName": string,
		"currencyCode": "NGN",
		"customerEmail": string,
		"customerName": string,
		"accounts": [
			{
				"bankCode": "232",
				"bankName": "bank 1",
				"accountNumber": "0000000033"
			},
			{
				"bankCode": "111",
				"bankName": "Bank 2",
				"accountNumber": "8000021118"
			}
		],
		"collectionChannel": "RESERVED_ACCOUNT",
		"reservationReference": "KS4CSY7Y9BULTV2BLP8F",
		"reservedAccountType": "GENERAL",
		"status": "ACTIVE",
		"createdOn": "2020-01-22 14:26:34.0",
		"contract": {
			"name": "Default Contract 2",
			"code": "915483727511",
			"description": null
		},
		"transactionCount": 0,
		"bvn": "56787654577",
		"restrictPaymentSource": false
	}[]
}

/**
 * Monnify API implementation
 * @implements {Server}
 */
class V3 implements Server {
	private static KUDA_TEST = 'https://sandbox.monnify.com/api/'
	private static KUDA_LIVE = 'https://kuda-openapi.kuda.com/v2.1'

	public VIRTUAL_INDEX = 'kuda-bank'
	public VIRTUAL_BANKS = {
		wma: {
			slg: 'wema-bank',
			nam: 'Wema Bank',
			cod: "035",
		},
		mpt: {
			slg: 'moniepoint-mfb',
			nam: 'Monie Point MFB',
			cod: "50515",
		},
		stl: {
			slg: 'sterling-bank',
			nam: "Sterling Bank",
			cod: "232",
		},
		gtb: {
			slg: 'guarantee-trust-bank',
			nam: 'Guaranty Trust Bank',
			cod: "058",
		}
	}

	private static TEST_DATA = {
		customerName: 'Ahmad Tukur',
		customerFullName: 'Ahmad Tukur',
		customerEmail: 'jikamshiahmad@gmail.com',
		accountName: 'Ahmad Tukur',
		accountReference: 'EagOTGlxZB4fsGCbtPmq7kisRiio',
		currencyCode: "NGN",
		preferredBanks: ['035'],
	}

	#_axios: AxiosInstance
	_authToken: string | undefined
	_isEmulator = DEBUG_MODE
	_lastAuthTime = 0

	/**
	 * @constructor
	 */
	constructor() {
		this.#_axios = axios.create({
			baseURL: this._isEmulator ? V3.KUDA_TEST : V3.KUDA_LIVE,
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})
	}

	/**
	 * gets access token from kuda open api
	 * @return {Promise<SrvInfo>}
	 */
	async #_getToken(): Promise<string> {
		if (this._authToken && (Date.now() - this._lastAuthTime) < 1000)
			return this._authToken
		const token = Buffer.from(process.env.PAY_API_V3_XAUTH as string, "utf-8").toString("base64")
		if (!token)
			throw new Error('invalid access credentials')
		const { data } = await this.#_axios.post<_Auth>('/v1/auth/login', '', {
			headers: {
				"Authorization": `Basic ${token}`
			}
		})
		if (!data.requestSuccessful)
			throw new Error('invalid access credentials')
		this._authToken = data.responseBody.accessToken
		this._lastAuthTime = Date.now()
		return this._authToken as string
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
		const accessToken = await this.#_getToken()
		let payLoad: object | null
		if (options) {
			if (this._isEmulator && requestPath.match('reserved-accounts') !== null) {
				payLoad = Object.assign({}, options, V3.TEST_DATA)
			} else {
				payLoad = Object.assign({}, options)
			}
		} else {
			payLoad = null
		}
		payLoad = {
			...payLoad,
			requestRef: shortId(),
		}
		payLoad = payLoad as object
		const { data } = await this.#_axios.request<T>({
			url: requestPath,
			method: requestMethod,
			data: payLoad,
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		})
		return data
	}

	/**
	 * get basic data from payment server
	 * @return {Promise<SrvInfo>}
	 */
	async getBasic(): Promise<SrvInfo> {
		const balance = await this.getBalance(process.env.PAY_API_V3_NUBAN as string, true)
		return { bal: balance }
	}

	/**
	 * get banks list from payment server
	 * @return {Promise<Array<Bank>>}
	 */
	async getBankList(): Promise<Bank[]> {
		// fetch bank list
		const response = await this.#_request<_GetBanks>("/v1/sdk/transactions/banks")
		// an error occured
		if (!response.requestSuccessful)
			throw new Error(response.responseMessage)
		return response.responseBody.map(({ code, name }) => ({
			slg: name.toLowerCase().replace(/[\w]+/ig, '-'),
			nam: name,
			cod: code
		}))
	}

	/**
	 * fetches nuban info & balance from the server
	 * @param {string} uid
	 * @param {boolean | undefined} withBalance
	 * @return {Promise<Nuban>}
	 */
	async getVirtual(uid: string): Promise<Virtual> {
		// fetch the account info
		const virtual = await this.#_request<_Virtual>(`/v2/bank-transfer/reserved-accounts/${uid}`)
		// an error occured
		if (!virtual.requestSuccessful)
			throw new Error(virtual.responseMessage)
		// basic account info
		const account = virtual.responseBody
		return {
			uid: account.accountReference,
			name: account.accountName,
			phone: '',
			email: account.customerEmail,
			nuban: account.accounts.map((e) => e.accountNumber).join(','),
			active: account.status === "ACTIVE"
		}
	}

	/**
	 * fetches accounts list from the server
	 * @param {number} page
	 * @return {Promise<Array<Virtual>>}
	 */
	async getVirtuals(page: number): Promise<Virtual[]> {
		const virtuals: _Virtuals | null = await this.#_request<_Virtuals>(`/v1/bank-transfer/reserved-accounts/all?page=${page - 1}&size=10`)
			.catch((e) => {
				if (isAxiosError<_Virtuals>(e))
					return e.response?.data as _Virtuals
				return null
			})
		if (!virtuals?.requestSuccessful)
			throw new Error(virtuals?.responseMessage)
		// restructure the virtual account
		return virtuals.responseBody.map<Virtual>((virtual) => ({
			uid: virtual.accountReference,
			name: virtual.accountName,
			phone: '',
			email: virtual.customerEmail,
			nuban: virtual.accounts.map((e) => e.accountNumber).join(','),
			active: virtual.status === "ACTIVE"
		}))
	}

	/**
	 * Fetches user balance by his uid
	 * @param {string} uid
	 * @param {boolean} isWallet
	 * @return {Promise<number>}
	 */
	async getBalance(uid: string, isWallet?: boolean): Promise<number> {
		const nuban = isWallet ? uid : (await this.getVirtual(uid)).nuban
		// retrieve balance
		const balance = await this.#_request<{
			requestSuccessful: boolean,
			responseMessage: string,
			responseCode: string,
			responseBody: {
				availableBalance: number,
				ledgerBalance: number
			}
		}>(`/v2/disbursements/wallet-balance?accountNumber=${nuban}`)
		// an error ?
		if (!balance.requestSuccessful)
			throw new Error(balance.responseMessage)
		return balance.responseBody.availableBalance
	}

	/**
	 * Updates a nuban info on the server
	 * @async
	 * @param {string} uid
	 * @return {Promise<Array<Virtual>>}
	 */
	async createVirtual(uid: string, { email, phoneNumber, displayName }: {
		email: string,
		phoneNumber: string,
		displayName: string
	}): Promise<Virtual> {
		// try fetching the account
		let account: Virtual | null = await this.getVirtual(uid).catch(() => null)
		let response
		// create or update virtual
		// an account found, update
		if (typeof account === 'object' && account !== null) {
			// check for name | email changed
			const payLoad = {
				customerFullName: displayName,
				customerEmail: email
			}
			response = await this.#_request<{
				requestSuccessful: true,
				responseMessage: string,
				responseCode: string,
				responseBody: {
					customerFullName: string,
					customerEmail: string
				}
			}>('PUT', `/v1/customer/update/${email}`, payLoad)
			// an error ?
			if (!response.requestSuccessful)
				throw new Error(response.responseMessage)
			// replace the updated fields update
			account.name = response.responseBody.customerFullName
			account.email = response.responseBody.customerEmail
			account.phone = phoneNumber
		} else {
			// create an account instead
			const payLoad: {
				customerName: string,
				accountName: string,
				customerEmail: string,
				accountReference: string,
				// "bvn": "21212121212",
				currencyCode: "NGN",
				contractCode: string,
				preferredBanks: string[]
				getAllAvailableBanks: boolean,
			} = {
				customerName: displayName,
				accountName: displayName,
				customerEmail: email,
				accountReference: uid,
				currencyCode: "NGN",
				contractCode: process.env.PAY_API_V3_TOKEN as string,
				preferredBanks: [this.VIRTUAL_BANKS.wma.cod],
				getAllAvailableBanks: false,
			}
			// create an account
			response = await this.#_request<{
				requestSuccessful: boolean,
				responseMessage: string,
				responseCode: string,
				responseBody: {
					contractCode: string,
					accountReference: string,
					accountName: string,
					currencyCode: "NGN",
					customerEmail: string,
					customerName: string,
					accounts: {
						bankCode: string,
						bankName: string,
						accountNumber: string,
						accountName: string
					}[],
					collectionChannel: "RESERVED_ACCOUNT",
					reservedAccountType: "GENERAL",
					reservationReference: string,
					status: string,
					createdOn: string,
					incomeSplitConfig: [],
					bvn: string,
					restrictPaymentSource: boolean
				}
			}>('POST', '/v2/bank-transfer/reserved-accounts', payLoad)
			// something else happened
			if (!response.requestSuccessful)
				throw new Error(response.responseMessage)
			// fetch the updated account
			account = {
				uid: response.responseBody.accountReference,
				email: response.responseBody.customerEmail,
				name: response.responseBody.accountName,
				nuban: response.responseBody.accounts[0].accountNumber,
				phone: phoneNumber,
				active: response.responseBody.status === "ACTIVE"
			}
		}
		return account
	}

	/**
	 * charges account on the server
	 * @param {string} uid
	 * @param {number} amount
	 * @return {Promise<string | null>}
	 */
	async chargeVirtual(uid: string, amount: number): Promise<string | null> {
		const virtual = await this.getVirtual(uid)
		const getBank = (await this.getBankList()).find((bank) => bank.nam.match(/KUDA/i))
		const account = await this.resolveInfo(getBank as Bank, '3000092732') as AccountInfo
		return await this.eTransferFund(account, amount, virtual.nuban)
	}

	/**
	 * toggles virtual account on the server
	 * @param {string} uid
	 * @param {boolean} enable
	 * @return {Promise<string>}
	 */
	async disableVirtual(uid: string, enable: boolean): Promise<string> {
		if (enable)
			throw new Error('feature not supported on this server')
		const response = await this.#_request<{
			requestSuccessful: boolean,
			responseMessage: string,
			responseCode: 0,
			responseBody: {
				contractCode: string,
				accountReference: string,
				accountName: string,
				currencyCode: "NGN",
				customerEmail: string,
				accountNumber: string,
				bankName: string,
				bankCode: string,
				reservationReference: string,
				status: string,
				createdOn: string
			}
		}>('DELETE', `/v1/bank-transfer/reserved-accounts/reference/${uid}`)
		if (!response.requestSuccessful)
			throw new Error(response.responseMessage)
		return response.responseBody.accountReference
	}

	/**
	 * Finds an existing transfer request
	 * @param {string} reference
	 * @return {Promise<Transfer | null>}
	 */
	async findTransfer(reference: string): Promise<Transfer | null> {
		const transfer = await this.#_request<{
			requestSuccessful: boolean,
			responseMessage: string,
			responseCode: "0",
			responseBody: {
				transactionReference: string,
				paymentReference: string,
				amountPaid: string,
				totalPayable: string,
				settlementAmount: string,
				paidOn: string,
				paymentStatus: string,
				paymentDescription: string,
				currency: "NGN",
				paymentMethod: string,
				product: {
					type: string,
					reference: string
				},
				cardDetails: null,
				accountDetails: {
					accountName: string,
					accountNumber: string,
					bankCode: string,
					amountPaid: string
				},
				accountPayments: [
					{
						accountName: string,
						accountNumber: string,
						bankCode: string,
						amountPaid: string
					}
				],
				customer: {
					email: string,
					name: string
				},
				metaData: {
					name: string,
					age: string
				}
			}
		}>(`/v2/transactions/${reference}`)
		if (!transfer.requestSuccessful)
			return null
		return {
			status: transfer.responseBody.paymentStatus,
			amount: transfer.responseBody.amountPaid,
			channel: transfer.responseBody.paymentMethod,
			payer: {
				name: transfer.responseBody.customer.name,
				email: transfer.responseBody.customer.email,
			},
			reference: transfer.responseBody.paymentReference,
			info: {
				accountName: transfer.responseBody.accountDetails.accountName,
				accountNumber: transfer.responseBody.accountDetails.accountNumber,
				bankCode: transfer.responseBody.accountDetails.bankCode,
			}
		}
	}

	/**
	 * Resolves account information from the serve
	 * @param {Bank} bank
	 * @param {string} nuban
	 * @return {Promise<string | null>}
	 */
	async resolveInfo(bank: Bank, nuban: string): Promise<AccountInfo | null> {
		const info = await this.#_request<{
			requestSuccessful: boolean,
			responseMessage: string,
			responseCode: "0",
			responseBody: {
				accountNumber: string,
				accountName: string,
				bankCode: string
			}
		}>(`/v1/disbursements/account/validate?accountNumber=${nuban}&bankCode=${bank.cod}`)
		if (!info.requestSuccessful)
			return null
		return {
			name: info.responseBody.accountName,
			bank: bank,
			nuban: nuban,
		}
	}

	/**
	 * Transfers fund to an account
	 * @param {string} uid
	 * @param {AccountInfo} acctInfo
	 * @param {number} amount
	 * @return {Promise<string | null>}
	 */
	async iTransferFund(uid: string, acctInfo: AccountInfo, amount: number): Promise<string | null> {
		const virtual = await this.getVirtual(uid)
		return await this.eTransferFund(acctInfo, amount, virtual.nuban)
	}

	/**
	 * Transfers fund to an account
	 * @param {AccountInfo} acctInfo
	 * @param {number} amount
	 * @param {string} source
	 * @return {Promise<string | null>}
	 */
	async eTransferFund(acctInfo: AccountInfo, amount: number, source?: string): Promise<string | null> {
		//  0035785417 and destination bank code: 044. FAILED TRANSACTION TEST
		const transfer = await this.#_request<{
			requestSuccessful: true,
			responseMessage: string,
			responseCode: string,
			responseBody: {
				amount: string,
				reference: string,
				status: string,
				dateCreated: string,
				totalFee: string,
				sessionId: string,
				destinationAccountName: string,
				destinationBankName: string,
				destinationAccountNumber: string,
				destinationBankCode: string
			}
		}>('POST', '/v2/disbursements/single', {
			amount: amount,
			currency: "NGN",
			sourceAccountNumber: source || process.env.PAY_API_V3_NUBAN as string,
			destinationAccountName: acctInfo.name,
			destinationAccountNumber: acctInfo.nuban,
			destinationBankCode: acctInfo.bank.cod,
			reference: shortId(),
			narration: "",
		})
		if (!transfer.requestSuccessful || !(transfer.responseBody.status === "SUCCESS" ||
			transfer.responseBody.status === "COMPLETED" || transfer.responseBody.status === "DUPLICATE REQUEST (D07)" ||
			transfer.responseBody.status === "AWAITING_PROCESSING" || transfer.responseBody.status === "IN_PROGRESS"))
			return null
		return transfer.responseBody.reference
	}

	/**
	 * Handles bulk transfers in chunks
	 * @param {AccountInfo[]} acctInfo
	 * @param {number} amount
	 * @return {Promise<number | null>}
	 */
	async bulkTransfer(acctInfo: AccountInfo[], amount: number): Promise<string | null> {
		const transfer = await this.#_request<{
			requestSuccessful: boolean,
			responseMessage: string,
			responseCode: string,
			responseBody: {
				totalAmount: string,
				totalFee: number,
				batchReference: string,
				batchStatus: string,
				totalTransactions: number,
				dateCreated: string
			}
		}>('POST', '/v2/disbursements/batch', {
			title: 'Bulk Transfer',
			batchReference: shortId(),
			narration: "",
			sourceAccountNumber: process.env.PAY_API_V3_NUBAN as string,
			onValidationFailure: "CONTINUE",
			notificationInterval: 10,
			transactionList: acctInfo.map((acct) => ({
				amount: amount,
				reference: shortId(),
				narration: "",
				destinationBankCode: acct.bank.cod,
				destinationAccountName: acct.name,
				destinationAccountNumber: acct.nuban,
				currency: "NGN"
			}))
		})
		if (!transfer.requestSuccessful || !(transfer.responseBody.batchStatus === "SUCCESS" ||
			transfer.responseBody.batchStatus === "COMPLETED" || transfer.responseBody.batchStatus === "DUPLICATE REQUEST (D07)" ||
			transfer.responseBody.batchStatus === "AWAITING_PROCESSING" || transfer.responseBody.batchStatus === "IN_PROGRESS"))
			return null
		return transfer.responseBody.batchReference
	}
}

export default new V3()
