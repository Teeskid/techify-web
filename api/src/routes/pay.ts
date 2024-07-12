/** @module routes/pay */

import { Router as createRouter } from "express";

import { flutterHook, monnifyHook, kudaBankHook, payStackHook } from "../handlers/pay/hooks";

const pay = createRouter();

pay.all("/hooks/flutter", flutterHook)
pay.all("/hooks/monnify", monnifyHook)
pay.all("/hooks/kudabank", kudaBankHook)
pay.all('/hooks/paystack', payStackHook)

export default pay
