import { Router as createRouter, type Request, type Response } from "express";

 const hooks = createRouter()
 
 hooks.get("/", (r: Request, res: Response) => {
 	res.sendStatus(200)
 })

 export default hooks
 
