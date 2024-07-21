/** @module utils/utils */

import moment from "moment"

import { DATE_FORMAT } from "./constants"

export const requestRef = () => (
	Math.floor(Math.random() * 1000000000)
)

export const formatDate = (date: Date | string) => {
    return moment(new Date(date)).format(DATE_FORMAT)
}

export default {}
