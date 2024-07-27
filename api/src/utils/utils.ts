/** @module utils/utils */

import moment from "moment"
import qrcode from "qrcode"

import { DATE_FORMAT } from "./constants"

export const requestRef = () => (
	Math.floor(Math.random() * 1000000000)
)

export const formatDate = (date: Date | string) => {
	return moment(new Date(date)).format(DATE_FORMAT)
}

export const textBuffer = (text: string) => (
	Buffer.from(text, "base64")
)

export const textQrCode = (text: string) => (
	qrcode.toBuffer(text, {
		margin: 0,
		maskPattern: 1,
		type: "png",
	})
)

export default {}
