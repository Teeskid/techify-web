import { Router as createRouter } from "express";

import app from "./app";
import sim from "./sim";
import vrf from "./vrf";
import msn from "./msn";
import pay from "./pay";
import vtu from "./vtu";

const routes = createRouter()

routes.get("/", async (r, res) => {
    res.redirect("https://techify.ng/documentation")
})
routes.use("/app-v1", app)
routes.use("/msn-v1", msn)
routes.use("/sim-v1", sim)
routes.use("/vrf-v1", vrf)
routes.use("/pay-v1", pay)
routes.use("/vtu-v1", vtu)

export default routes
