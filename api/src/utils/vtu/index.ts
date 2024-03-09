import * as crypto from "crypto"

import type { Bank, PaymentChannelKey, ProductChannelKey } from "techify-apx/types"
import type { Product } from "techify-apx/types/admin"

import axios from "./axios"
import { SHARDS_COUNT } from "./const"

type Reload = (channel: ProductChannelKey | PaymentChannelKey) => Promise<object>
type Meta = { reload: Reload }

const cached: { [i: string]: Meta } = {}

export const MERGE_DOC = { merge: true }

export const getMeta = async (index: "product" | "payment" | string): Promise<Meta> => {
	let meta: Meta | null = cached[index] || null
	if (!meta)
		cached[index] = (await import(`../apx-library/${index}/index`)).Meta
	meta = cached[index]
	return meta
}

export const camelCase = (str: string) => {
	const f = str.charAt(0).toUpperCase()
	const r = str.substring(1)
	return f + r
}

export const isValidEmail = (phone: string) => {
	return /^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/igs.test(phone)
}

export const isValidPhone = (phone: string) => {
	return /^\d{11}$/igs.test(phone)
}

export const isValidName = (phone: string) => {
	return /^[\w\s]{5,25}$/igs.test(phone)
}

export const isValidId = (index: string) => {
	return /^[A-Z0-9-]+$/i.test(index)
}

export const isValidBank = (bank: Bank) => {
	return /^[\d\w\s-]{5,25}$/ig.test(bank?.nam) &&
		/^[\d\w\s-]+$/ig.test(bank?.cod)
}

export const isValidNuban = (nuban: string) => {
	return /^\d{10}$/ig.test(nuban)
}

export const localPhone = (phone: string) => {
	return phone.replace(/[^0-9]+/igs, '')
		.replace(/^2340*(.+)$/igs, '0$1').substring(0, 11)
}

export const codedPhone = (phone: string) => (
	phone.indexOf('+') === 0 ? phone :
		phone.replace(/\D+/sg, '')
			.replace(/^0*(234)?/sg, '+234').substring(0, 14)
)

export const reportError = async (message: string) => {
	try {
		await axios.get('https://flowxo.com/hooks/a/z68g3v6g', {
			params: {
				msg: message,
				uid: 2348145737179
			}
		})
	} catch (error: Error | unknown) {
		// handle post error
	}
}

export const shortId = () => {
	return crypto.randomBytes(8).toString("hex")
}

export const makeString = (text: string, count: number) => {
	let s = ''
	for (let x = 0; x < count; x++)
		s += `${x === 0 ? '' : ','}${text}`
	return s
}

export const removeNoId = <T extends Product = Product>(e: T) => {
	return !!e.aid
}

export const shardDoc = () => {
	return String(Math.floor(Math.random() * SHARDS_COUNT))
}
