import { Router as createRouter, type Request, type Response } from "express";

 const idv = createRouter()
 
 idv.get("/", (r: Request, res: Response) => {
 	res.sendStatus(200)
 })

 export default idv
 
