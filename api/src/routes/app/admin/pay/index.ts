import { Router as createRouter } from "express";

import transfer from "./transfer";
import upgrade from "./upgrade";

export default createRouter()
    .all('/transfer', transfer)
    .all('/upgrade', upgrade)
