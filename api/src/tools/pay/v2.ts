/** @module apx-library/payment/v2 */
import axios, { type AxiosInstance } from "axios"

import { BUSINESS_NAME } from "techify-apx/consts"
import type { AccountInfo, Bank, Transfer, Virtual } from "techify-apx/types"

import { DEBUG_MODE } from "../../utils/vtu/const"
import { localPhone, reportError, shortId } from "../../utils/vtu/utils"
import type { Server, SrvInfo } from "./types"

export type _Virtual = {
	accountName: string
	accountNumber: string,
	email: string,
	phoneNumber: string,
	lastName: string,
	firstName: string,
	middleName: string,
	bussinessName: string,
	creationDate: string,
	isDeleted: boolean,
	trackingReference: string
}

/**
 * Kuda Bank API implementation
 * @implements {Server}
 */
class V2 implements Server {
	private static KUDA_LIVE = 'https://kuda-openapi.kuda.com/v2.1'
	private static KUDA_TEST = 'http://kuda-openapi-uat.kudabank.com/v2.1'
	private static TEST_DATA = {
		phoneNumber: '08145737179',
		trackingReference: 'EagOTGlxZB4fsGCbtPmq7kisRiio'
	}

	VIRTUAL_INDEX = 'kuda-bank'
	VIRTUAL_BANKS: Record<string, Bank> = {
		kda: {
			slg: 'kuda-bank',
			cod: '999',
			nam: 'KUDA MFB'
		}
	}

	#_axios: AxiosInstance
	_authToken: object | undefined
	_isEmulator = DEBUG_MODE
	_lastAuthTime = 0

	/**
	 * @constructor
	 */
	constructor() {
		this.#_axios = axios.create({
			baseURL: this._isEmulator ? V2.KUDA_TEST : V2.KUDA_LIVE,
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
	async #getToken(): Promise<object> {
		if (this._authToken && (Date.now() - this._lastAuthTime) < 1000)
			return this._authToken
		const [email, apiKey] = (process.env.PAY_API_V2_XAUTH || ':').split(':', 2)
		if (email.length === 0 || apiKey.length === 0)
			throw new Error('invalid access credentials')
		const { data } = await this.#_axios.post('/Account/GetToken', {
			email, apiKey
		})
		this._authToken = data
		this._lastAuthTime = Date.now()
		return this._authToken as object
	}

	/**
	 * sends request to kuda open api
	 * @param {string} serviceType
	 * @param {string | null} options
	 * @return {Promise<object>}
	 */
	async request<T extends object>(serviceType: string, options?: Record<string, string | number | object>): Promise<T> {
		const token = await this.#getToken()
		let payLoad: object | string
		if (options) {
			if (this._isEmulator && serviceType.match('VIRTUAL_ACCOUNT') !== null) {
				payLoad = Object.assign({}, options, V2.TEST_DATA)
			} else {
				payLoad = Object.assign({}, options)
			}
		} else {
			payLoad = ''
		}
		payLoad = {
			requestRef: shortId(),
			serviceType,
			data: payLoad
		}
		const { data } = await this.#_axios.post<T>('', payLoad, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		return data
	}

	/**
	 * get basic data from payment server
	 * @return {Promise<SrvInfo>}
	 */
	async getBasic(): Promise<SrvInfo> {
		const response = await this.request<{
			status: boolean,
			message: string,
			data: {
				ledgerBalance: number,
				availableBalance: number,
				withdrawableBalance: number
			}
		}>('ADMIN_RETRIEVE_MAIN_ACCOUNT_BALANCE')
		if (!response.data)
			throw new Error(response.message)
		return {
			bal: response.data.availableBalance / 100,
		}
	}

	/**
	 * get banks list from payment server
	 * @return {Promise<Array<Bank>>}
	 */
	async getBankList(): Promise<Array<Bank>> {
		// fetch bank list
		const response = await this.request<{
			data: {
				banks: Array<{ bankName: string, bankCode: string }>
			},
			message: string
		}>('BANK_LIST')
		// an error occured
		if (!response.data)
			throw new Error(response.message)
		return response.data.banks.map(({ bankName, bankCode }) => ({
			slg: bankName.toLowerCase().replace(/[\W]+/ig, '-'),
			nam: bankName,
			cod: bankCode
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
		const retrieved = await this.request<{
			status: boolean,
			data: {
				account: _Virtual
			}, message: string
		}>('ADMIN_RETRIEVE_SINGLE_VIRTUAL_ACCOUNT', {
			trackingReference: uid
		})
		// an error occured
		if (retrieved.status !== true)
			throw new Error(retrieved.message)
		// basic account info
		const account = retrieved.data.account
		return {
			uid,
			name: account.accountName,
			phone: account.phoneNumber,
			email: account.email,
			nuban: account.accountNumber,
			active: !account.isDeleted
		}
	}

	/**
	 * fetches accounts list from the server
	 * @param {number} page
	 * @return {Promise<Array<Virtual>>}
	 */
	async getVirtuals(page: number): Promise<Virtual[]> {
		const { status, data: { accounts }, message } = await this.request<{
			status: boolean,
			data: {
				accounts: _Virtual[]
			}, message: string
		}>('ADMIN_VIRTUAL_ACCOUNTS', {
			pageSize: 10,
			pageNumber: page
		})
		if (status !== true)
			throw new Error(message)
		// restructure
		return accounts.map<Virtual>((account) => ({
			uid: account.trackingReference,
			name: account.accountName,
			email: account.email,
			phone: account.phoneNumber,
			nuban: account.phoneNumber,
			active: !account.isDeleted
		}))
	}

	/**
	 * Fetches user balance by his uid
	 * @param {string} uid
	 * @return {Promise<number>}
	 */
	async getBalance(uid: string): Promise<number> {
		// retrieve balance
		const balance = await this.request<{
			status: boolean,
			data: {
				withdrawableBalance: number
			}, message: string
		}>('RETRIEVE_VIRTUAL_ACCOUNT_BALANCE', {
			trackingReference: uid
		})

		if (balance.status !== true)
			throw new Error(<string>balance.message)

		return balance.data.withdrawableBalance
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
		let account: Virtual | false = await this.getVirtual(uid).catch(() => false)

		// create names from a single display name
		const [firstName, lastName] = displayName.trim().split(' ', 2)

		let payLoad = { trackingReference: uid, businessName: BUSINESS_NAME }
		let response
		if (account !== false) {
			// check for name | email changed
			let nameChanged = false
			payLoad = Object.assign(payLoad, { firstName, lastName })
			nameChanged = false
			// if (account.firstName !== firstName || account.lastName !== lastName) {
			// }
			if (account.email !== email) {
				payLoad = Object.assign(payLoad, { email })
			}

			// check if one name | email changed
			if (Object.keys(payLoad).length > 2) {
				// try updating an account with the id
				response = await this.request<{
					status: boolean,
					message: string,
					data: {
						accountNumber: string
					}
				}>('ADMIN_UPDATE_VIRTUAL_ACCOUNT', payLoad)
				if (response.status !== true)
					throw new Error(response.message)
				if (nameChanged) {
					// fetch the updated account
					account = await this.getVirtual(uid)
				} else {
					// replace some update
					account = Object.assign(account, payLoad)
				}
			}
		} else {
			// create an account if not found
			payLoad = Object.assign(payLoad, {
				email,
				firstName,
				lastName,
				phoneNumber: localPhone(phoneNumber)
			})

			// create an account
			response = await this.request<{
				status: boolean,
				message: string,
				data: {
					accountNumber: string
				}
			}>('ADMIN_CREATE_VIRTUAL_ACCOUNT', payLoad)

			// something else happened
			if (response.status !== true)
				throw new Error(response.message)

			// fetch the updated account
			account = await this.getVirtual(uid)
		}
		// formulate return data
		return account
	}

	/**
	 * charges account on the server
	 * @param {string} uid
	 * @param {number} amount
	 * @return {Promise<string>}
	 */
	async chargeVirtual(uid: string, amount: number): Promise<string> {
		await reportError('initiating withdraw on ' + uid)
		const { status, responseCode, message, transactionReference } = await this.request<{
			status: boolean,
			responseCode: string,
			message: string,
			transactionReference: string
		}>('WITHDRAW_VIRTUAL_ACCOUNT', {
			trackingReference: uid,
			amount,
			clientFeeCharge: 0,
			narration: shortId()
		})
		if (status !== true || responseCode !== '00')
			throw new Error(message)
		return transactionReference
	}

	/**
	 * toggles virtual account on the server
	 * @param {string} uid
	 * @param {boolean} enable
	 * @return {Promise<string>}
	 */
	async disableVirtual(uid: string, enable: boolean): Promise<string> {
		const { status, message, trackingReference } = await this.request<{
			status: boolean,
			responseCode: string,
			message: string,
			trackingReference: string
		}>(enable ? 'ADMIN_ENABLE_VIRTUAL_ACCOUNT' : 'ADMIN_DISABLE_VIRTUAL_ACCOUNT', {
			trackingReference: uid
		})
		if (status !== true)
			throw new Error(message)
		return trackingReference
	}

	/**
	 * Finds an existing bulk transfer request
	 * @param {string} reference
	 * @return {Promise<Transfer>}
	 */
	async findTransfer(reference: string): Promise<Transfer> {
		String(reference)
		return {} as Transfer
	}

	/**
	 * Resolves account information from the serve
	 * @param {Bank} bank
	 * @param {string} nuban
	 * @return {Promise<string | null>}
	 */
	async resolveInfo(bank: Bank, nuban: string): Promise<AccountInfo | null> {
		const { status, data } = await this.request<{
			status: boolean,
			message: string,
			data: {
				beneficiaryAccountNumber: string,
				beneficiaryName: string,
				senderAccountNumber: string,
				senderName: null,
				beneficiaryCustomerID: number,
				beneficiaryBankCode: string,
				nameEnquiryID: number,
				responseCode: null,
				transferCharge: number,
				sessionID: string
			}
		}>('NAME_ENQUIRY', {
			beneficiaryBankCode: bank.cod,
			beneficiaryAccountNumber: nuban,
			senderTrackingReference: '',
			isRequestFromVirtualAccount: 'false'
		})
		if (status !== true)
			return null
		return {
			name: data.beneficiaryName,
			bank: bank,
			nuban: nuban,
			sessId: data.sessionID,
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
		const { status, transactionReference } = await this.request<{
			requestReference: string,
			transactionReference: string,
			responseCode: string,
			status: boolean,
			message: string,
			data: null
		}>('VIRTUAL_ACCOUNT_FUND_TRANSFER', {
			trackingReference: uid,
			beneficiaryAccount: acctInfo.nuban,
			amount: amount,
			beneficiaryName: acctInfo.name,
			beneficiaryBankCode: acctInfo.bank.cod,
			senderName: BUSINESS_NAME,
			nameEnquiryId: acctInfo.sessId as string,
			clientFeeCharge: 0,
			narration: '',
		})
		if (status !== true)
			return null
		return transactionReference
	}

	/**
	 * Transfers fund to an account
	 * @param {AccountInfo} acctInfo
	 * @param {number} amount
	 * @return {Promise<string | null>}
	 */
	async eTransferFund(acctInfo: AccountInfo, amount: number): Promise<string | null> {
		const { status, data, responseCode } = await this.request<{
			requestReference: 1234567890,
			transactionReference: string,
			responseCode: string,
			status: true,
			message: string,
			data: null
		}>('SINGLE_FUND_TRANSFER', {
			beneficiaryBankCode: acctInfo.bank.cod,
			beneficiaryAccount: acctInfo.nuban,
			nameEnquirySessionID: acctInfo.sessId as string,
			beneficiaryName: acctInfo.name,
			senderName: BUSINESS_NAME,
			amount: amount,
			clientFeeCharge: 0,
			narration: ''
		})
		if (status !== true || responseCode !== '00')
			return null
		return data
	}

	/**
	 * Handles bulk transfers in chunks
	 * @param {AccountInfo[]} acctInfo
	 * @param {number} amount
	 * @return {Promise<number | null>}
	 */
	async bulkTransfer(acctInfo: AccountInfo[], amount: number): Promise<string | null> {
		const { status, responseCode, transactionReference } = await this.request<{
			requestReference: string,
			transactionReference: string,
			responseCode: string,
			status: boolean,
			message: string,
			data: null
		}>('SINGLE_FUND_TRANSFER', {
			fundTransferInstructions: acctInfo.map((item) => ({
				accountNumber: item.nuban,
				accountName: item.name,
				beneficiaryBankCode: item.bank.cod,
				amount: amount,
				bankCode: item.bank.cod,
				BankName: item.bank.nam,
				longCode: item.bank.cod,
				reference: shortId(),
				narration: '',
			}))
		})
		if (status !== true || responseCode !== '00')
			return null
		return transactionReference
	}
}

export default new V2()
