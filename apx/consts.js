"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_CHANNELS = exports.PAYMENT_SERVICES = exports.PAYMENT_CH_NAMES = exports.PAYMENT_CHANNELS = exports.CAT_DISCO_PLAN = exports.CABLETV_CODES = exports.CAT_CABLE_PLAN = exports.BILLPAY_CODES = exports.SSCEEXAM_NAMES = exports.SSCEEXAM_CODES = exports.EDUSTUFF_CODES = exports.CAT_EDU_STUFF = exports.PRICING_LEVELS = exports.TEL_TOPUP_ENUMS = exports.TEL_DATA_ENUMS = exports.TEL_TOPUP_NAMES = exports.TEL_TOPUP_TYPES = exports.TEL_DATA_NAMES = exports.TEL_DATA_TYPES = exports.TEL_ZON_NAMES = exports.TEL_COM_ZONES = exports.TEL_COM_CODES = exports.TEL_COM_NAMES = exports.TEL_PRODUCTS = exports.TEL_PRO_RCOUPON = exports.TEL_PRO_BCOUPON = exports.TEL_PRO_AIRTIME = exports.TEL_PRO_BUNDLE = exports.BUSINESS_NAME = void 0;
exports.BUSINESS_NAME = "Jikstel NG";
exports.TEL_PRO_BUNDLE = "bundle";
exports.TEL_PRO_AIRTIME = "airtime";
exports.TEL_PRO_BCOUPON = "coupon";
exports.TEL_PRO_RCOUPON = "recharge";
exports.TEL_PRODUCTS = [exports.TEL_PRO_BUNDLE, exports.TEL_PRO_AIRTIME, exports.TEL_PRO_BCOUPON, exports.TEL_PRO_RCOUPON];
exports.TEL_COM_NAMES = ["MTN", "GLO", "AIRTEL", "9MOBILE"];
exports.TEL_COM_CODES = exports.TEL_COM_NAMES.map((code) => (code.substring(0, 3).toLocaleLowerCase()));
exports.TEL_COM_ZONES = ["v0", "v1", "v2", "v3"];
exports.TEL_ZON_NAMES = ["Sims", "MaskawaSub", "BilalSadaSub", "Saf27Data"];
exports.TEL_DATA_TYPES = ["sme", "gft", "cgft"];
exports.TEL_DATA_NAMES = ["sme", "gft", "cgft"];
exports.TEL_TOPUP_TYPES = ["vtu", "sns", "awf"];
exports.TEL_TOPUP_NAMES = ["VTU", "ShareNSell", "Awuf4U"];
exports.TEL_DATA_ENUMS = exports.TEL_DATA_TYPES.reduce((obj, val, key) => (Object.assign(Object.assign({}, obj), { [val]: exports.TEL_DATA_NAMES[key] })), {});
exports.TEL_TOPUP_ENUMS = exports.TEL_TOPUP_TYPES.reduce((obj, val, key) => (Object.assign(Object.assign({}, obj), { [val]: exports.TEL_DATA_NAMES[key] })), {});
exports.PRICING_LEVELS = ["def", "sta", "pro"];
exports.CAT_EDU_STUFF = "edustuff";
exports.EDUSTUFF_CODES = ["ssce"];
exports.SSCEEXAM_CODES = ["waec", "neco", "nabteb"];
exports.SSCEEXAM_NAMES = exports.SSCEEXAM_CODES.map((code) => code.toUpperCase());
exports.BILLPAY_CODES = ["cables", "discos"];
exports.CAT_CABLE_PLAN = "cableplan";
exports.CABLETV_CODES = ["startime", "dstv", "gotv"];
exports.CAT_DISCO_PLAN = "discosubs";
exports.PAYMENT_CHANNELS = ["v1", "v2", "v3", "v4"];
exports.PAYMENT_CH_NAMES = ["paystack", "kuda-mfb", "monnify", "flutter wave"];
exports.PAYMENT_SERVICES = ["nuban", "withdraw"];
exports.MESSAGE_CHANNELS = ["v1", "v2"];
exports.default = {
    BUSINESS_NAME: exports.BUSINESS_NAME, TEL_PRO_BUNDLE: exports.TEL_PRO_BUNDLE, TEL_PRO_AIRTIME: exports.TEL_PRO_AIRTIME, TEL_PRO_BCOUPON: exports.TEL_PRO_BCOUPON, TEL_PRO_RCOUPON: exports.TEL_PRO_RCOUPON, TEL_PRODUCTS: exports.TEL_PRODUCTS, TEL_COM_NAMES: exports.TEL_COM_NAMES, TEL_COM_CODES: exports.TEL_COM_CODES,
    TEL_ZON_NAMES: exports.TEL_ZON_NAMES, TEL_DATA_TYPES: exports.TEL_DATA_TYPES, TEL_DATA_NAMES: exports.TEL_DATA_NAMES, TEL_TOPUP_TYPES: exports.TEL_TOPUP_TYPES, TEL_TOPUP_NAMES: exports.TEL_TOPUP_NAMES, TEL_DATA_ENUMS: exports.TEL_DATA_ENUMS, TEL_TOPUP_ENUMS: exports.TEL_TOPUP_ENUMS, PRICING_LEVELS: exports.PRICING_LEVELS,
    EDUSTUFF_CODES: exports.EDUSTUFF_CODES, SSCEEXAM_CODES: exports.SSCEEXAM_CODES, SSCEEXAM_NAMES: exports.SSCEEXAM_NAMES, BILLPAY_CODES: exports.BILLPAY_CODES, CABLETV_CODES: exports.CABLETV_CODES, PAYMENT_CH_NAMES: exports.PAYMENT_CH_NAMES, PAYMENT_CHANNELS: exports.PAYMENT_CHANNELS, MESSAGE_CHANNELS: exports.MESSAGE_CHANNELS
};
