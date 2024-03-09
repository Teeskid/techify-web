import type { PricingLevelKey } from "./types/index"

export const BUSINESS_NAME = "Jikstel NG"

export const TEL_PRO_BUNDLE = "bundle"

export const TEL_PRO_AIRTIME = "airtime"

export const TEL_PRO_BCOUPON = "coupon"

export const TEL_PRO_RCOUPON = "recharge"

export const TEL_PRODUCTS = [TEL_PRO_BUNDLE, TEL_PRO_AIRTIME, TEL_PRO_BCOUPON, TEL_PRO_RCOUPON]

export const TEL_COM_NAMES = ["MTN", "GLO", "AIRTEL", "9MOBILE"]

export const TEL_COM_CODES = TEL_COM_NAMES.map((code) => (code.substring(0, 3).toLocaleLowerCase()))

export const TEL_COM_ZONES = ["v0", "v1", "v2", "v3"]

export const TEL_ZON_NAMES = ["Sims", "MaskawaSub", "BilalSadaSub", "Saf27Data"]

export const TEL_DATA_TYPES = ["sme", "gft", "cgft"]
export const TEL_DATA_NAMES = ["sme", "gft", "cgft"]

export const TEL_TOPUP_TYPES = ["vtu", "sns", "awf"]
export const TEL_TOPUP_NAMES = ["VTU", "ShareNSell", "Awuf4U"]

export const TEL_DATA_ENUMS: Record<string, string> = TEL_DATA_TYPES.reduce((obj, val, key) => ({ ...obj, [val]: TEL_DATA_NAMES[key] }), {})
export const TEL_TOPUP_ENUMS: Record<string, string> = TEL_TOPUP_TYPES.reduce((obj, val, key) => ({ ...obj, [val]: TEL_DATA_NAMES[key] }), {})

export const PRICING_LEVELS: PricingLevelKey[] = ["def", "sta", "pro"]

export const CAT_EDU_STUFF = "edustuff"
export const EDUSTUFF_CODES = ["ssce"]

export const SSCEEXAM_CODES = ["waec", "neco", "nabteb"]
export const SSCEEXAM_NAMES = SSCEEXAM_CODES.map((code) => code.toUpperCase())

export const BILLPAY_CODES = ["cables", "discos"]

export const CAT_CABLE_PLAN = "cableplan"

export const CABLETV_CODES = ["startime", "dstv", "gotv"]

export const CAT_DISCO_PLAN = "discosubs"

export const PAYMENT_CHANNELS = ["v1", "v2", "v3", "v4"]
export const PAYMENT_CH_NAMES = ["paystack", "kuda-mfb", "monnify", "flutter wave"]

export const PAYMENT_SERVICES = ["nuban", "withdraw"]

export const MESSAGE_CHANNELS = ["v1", "v2"]

export default {
    BUSINESS_NAME, TEL_PRO_BUNDLE, TEL_PRO_AIRTIME, TEL_PRO_BCOUPON, TEL_PRO_RCOUPON, TEL_PRODUCTS, TEL_COM_NAMES, TEL_COM_CODES,
    TEL_ZON_NAMES, TEL_DATA_TYPES, TEL_DATA_NAMES, TEL_TOPUP_TYPES, TEL_TOPUP_NAMES, TEL_DATA_ENUMS, TEL_TOPUP_ENUMS, PRICING_LEVELS,
    EDUSTUFF_CODES, SSCEEXAM_CODES, SSCEEXAM_NAMES, BILLPAY_CODES, CABLETV_CODES, PAYMENT_CH_NAMES, PAYMENT_CHANNELS, MESSAGE_CHANNELS
}