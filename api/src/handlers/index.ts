/** @module tools */

import type { Request, Response } from "express"

export const __ = (r: Request, res: Response) => {
	res.sendStatus(200)
}
export { default as pay } from "./pay";
export { default as sim } from "./sim";
export { default as msn } from "./msn";
export { default as idv } from "./idv";
export { default as vtu } from "./vtu";

export default {}
