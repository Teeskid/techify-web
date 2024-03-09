import { type Request, type Response } from "express"

export type EventProps = {
    api?: "cfg" | "product" | "payment" | string
}

export type SubApps = "vtu" | ""


export type Route = (request: Request, response: Response<object>) => Promise<void>

export type Handler = (request: Request, response: Response<object>) => Promise<object>

export type RouteGroup = {
    [index: string]: Route
}
