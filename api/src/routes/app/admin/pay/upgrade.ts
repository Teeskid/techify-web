import { Router as routerBuilder, type Request, type Response } from "express"
import { getAuth } from "firebase-admin/auth"
import { DocumentReference, getFirestore } from "firebase-admin/firestore"

import { OrderConv, StatConv, UserConv, WalletConv } from "../../../../utils/vtu/convs"

import v2 from "../../../../tools/pay/v2"

/**
 * Upgrade hook
 * @param {Request} request
 * @param {Response} response
 * user.type@return {Promise}
 */
const run = async (request: Request, response: Response): Promise<void> => {
	try {
		const firestore = getFirestore()
		const batch = firestore.batch()
		const auth = getAuth()

		// create logging data
		const statsRef = firestore.collection("stats").withConverter(StatConv)
		// create our shards
		const luc = statsRef.doc("luc").collection("cnt")
		const lbc = statsRef.doc("lbc").collection("cnt")
		const las = statsRef.doc("las").collection("cnt")
		const ltf = statsRef.doc("ltc").collection("cnt")
		const totalBonus = statsRef.doc("totalBonus").collection("cnt")
		for (let count = 0; count < 9; count++) {
			batch.set(luc.doc(String(count)), { val: 0 })
			batch.set(lbc.doc(String(count)), { val: 0 })
			batch.set(las.doc(String(count)), { val: 0 })
			batch.set(ltf.doc(String(count)), { val: 0 })
			batch.set(totalBonus.doc(String(count)), { val: 0 })
		}

		// get the old users collection
		const oldUsersRef = firestore.collection("users")
		const oldWalletsRef = firestore.collection("wallets")
		const newUsersRef = firestore.collection("users").withConverter(UserConv)
		const newWalletsRef = firestore.collection("uwlts").withConverter(WalletConv)

		// statistical items
		let _lbc = 0
		let _lcs = 0
		let _ltf = 0
		let _totalBonus = 0

		const oldUsers = [...(await oldUsersRef.get()).docs]
		await Promise.all(oldUsers.map(async (oldUser) => {
			// stat items
			let __ltf = 0

			const user = await auth.getUser(oldUser.id)
			const { type, referer } = oldUser.data()
			batch.set(newUsersRef.doc(oldUser.ref.id), {
				eml: user.email || '',
				nam: user.displayName || '',
				phn: user.phoneNumber || '',
				rol: user.customClaims?.role || "user",
				typ: type || "default",
				rfr: referer || '',
				dat: new Date(Date.parse(user.metadata.creationTime)),
				doc: '',
				pic: ''
			})

			// get old wallet object
			const oldWalletRef = oldWalletsRef.doc(oldUser.id)
			const oldWallet = { ...(await oldWalletRef.get()).data() }
			const { account, kudabank, bal, bonus, referCount, pin, locked } = oldWallet

			// get all old histories
			const oldInvoiceRef = oldWallet.ref.collection("ivhs")
			const oldInvoice = [...(await oldInvoiceRef.get()).docs]
			const newInvoiceRef = newWalletsRef.doc(oldWallet.ref.id).collection("ivhs").withConverter(OrderConv)

			// internal stats counter
			let __ltc = 0
			let __lbc = 0
			let __lcs = 0

			await Promise.all(oldInvoice.map((oldItem) => {
				const data = { ...oldItem.data() }

				batch.set(newInvoiceRef.doc(oldItem.ref.id), {
					src: data.sender || null,
					dst: data.target,
					typ: data.type ? (data.type === "data" ? "bundle" : data.type) : (
						(data.amount < 0 ? "debit" : "credit")
					),
					sta: data.status ? (
						data.status.match("fail") ? false : (
							data.status.match("pending") ? null : true
						)
					) : true,
					bal: data.bal,
					dat: data.date,
					amt: data.amount || 0,
					crc: "NGN",
					doc: '',
					ref: '',
					inf: {
						via: data.info?.channel || "v1",
						xvr: data.info?.xCheck ? true : false,
						cat: data.info?.network || null,
						prd: data.info?.product || data.info?.bundle || data.info?.airtime || null,
						qnt: data.info?.quantity || 1,
						dsc: data.info?.cardname || '',
						fee: 0,
					}
				})
				batch.delete(oldItem.ref)

				__ltc++
				if (data.type === "data" || data.type === "bundle") {
					__lbc++
					_lbc++
				} else if (data.type === "airtime") {
					__lcs++
					_lcs++
				} else if (data.type === "fund" || data.type === "credit") {
					__ltf++
					_ltf++
				}

				return true
			}))

			batch.delete(oldUser.ref)
			batch.delete(oldWallet.ref)

			_ltf += bal || 0
			_totalBonus += bonus || 0

			// create new wallet doc
			batch.set(newWalletsRef.doc(oldWalletRef.id), {
				kda: kudabank ? {
					slg: v2.VIRTUAL_BANKS.kda.slg,
					nbn: kudabank.nuban,
					nam: kudabank.name,
				} : undefined,
				bal: bal || 0,
				bon: bonus || 0,
				lbc: __lbc,
				las: __lcs,
				ltf: __ltf,
				ltc: __ltc,
				lrc: referCount || 0,
				pin: pin || '0000',
				lck: locked || false,
				eml: user.email || '',
				nam: user.displayName || '',
				phn: user.phoneNumber || '',
				act: account ? {
					nam: account.name,
					nbn: account.nuban,
					bnk: account.bank
				} : undefined,
				doc: '',
				lts: 0,
				lvl: "sta"
			})

			return true
		}))

		batch.update(luc.parent as DocumentReference, { val: oldUsers.length })
		batch.update(lbc.parent as DocumentReference, { val: _lbc })
		batch.update(las.parent as DocumentReference, { val: _lcs })
		batch.update(ltf.parent as DocumentReference, { val: _ltf })
		batch.update(totalBonus.parent as DocumentReference, { val: _totalBonus })

		await batch.commit()

		response.json({ status: false, message: "success", data: request.body })
	} catch (error: Error | unknown) {
		response.json({ status: false, message: (error as Error).message })
	}
}

export default routerBuilder()
	.get('/run', run)
