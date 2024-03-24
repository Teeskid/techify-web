import { Router as createRouter } from "express";

import app from "./app";
import idv from "./idv";
import msn from "./msn";
import pay from "./pay";
import sim from "./sim";
import vtu from "./vtu";

const routes = createRouter()

routes.get("/", async (r, res) => {
    res.redirect("https://docs.techify.ng")
})
routes.use("/app-v1", app)
routes.use("/idv-v1", idv)
routes.use("/msn-v1", msn)
routes.use("/pay-v1", pay)
routes.use("/sim-v1", sim)
routes.use("/vtu-v1", vtu)

export default routes
