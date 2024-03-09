import { Router as createRouter, type Request, type Response } from "express";

 const vrf = createRouter()
 
 vrf.get("/", (r: Request, res: Response) => {
 	res.sendStatus(200)
 })

 export default vrf
 
