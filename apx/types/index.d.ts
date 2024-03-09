import type { CABLETV_CODES, EDUSTUFF_CODES, PAYMENT_CHANNELS, SSCEEXAM_CODES, TEL_COM_CODES, TEL_COM_ZONES, TEL_DATA_ENUMS, TEL_PRODUCTS, TEL_TOPUP_ENUMS } from "../consts";
/** Firestore Models */
export type App = {
    doc: string;
    nam: string;
    siz: number;
    mim: string;
    lnk: string;
    loc: string;
    crn: boolean;
    plf: string;
    dat: Date;
};
export declare enum UserRole {
    USER = "user",
    STAFF = "staff",
    ADMIN = "admin"
}
export type UserType = "default" | "wallet";
export type User = {
    doc: string;
    eml: string;
    nam: string;
    phn: string;
    pic: string;
    dat: Date;
    rol: UserRole;
    typ: UserType;
    rfr: string;
};
export type Account = {
    bnk: Bank;
    nam: string;
    nbn: string;
};
export type Nuban = {
    nam: string;
    nbn: string;
    slg: string;
};
export type PricingLevelKey = "def" | "sta" | "pro";
export type Wallet = {
    doc: string;
    nam: string;
    eml: string;
    phn: string;
    bal: number;
    bon: number;
    pin: string;
    ltf: number;
    lts: number;
    ltc: number;
    las: number;
    lbc: number;
    lrc: number;
    lvl: PricingLevelKey;
    lck: boolean;
    kda?: Nuban;
    act?: Account;
};
export type ProductChannelKey = typeof TEL_COM_ZONES[number];
export type PaymentChannelKey = typeof PAYMENT_CHANNELS[number];
export type TelecomProductKey = typeof TEL_PRODUCTS[number];
export type TelecomProductType = keyof typeof TEL_DATA_ENUMS | keyof typeof TEL_TOPUP_ENUMS;
export type ExamCheckerType = typeof SSCEEXAM_CODES[number];
export type CablePlanType = typeof CABLETV_CODES[number];
export type TelecomKey = typeof TEL_COM_CODES[number];
export type EduStuffKey = typeof EDUSTUFF_CODES[number];
export type CableKey = typeof CABLETV_CODES[number];
export type Item = {
    doc: string;
    nam: string;
};
export type ProductPRC = Record<PricingLevelKey, number>;
export type ProductEXP = Record<ProductChannelKey, number>;
export type Product = Item & {
    cat: string;
    typ: string;
    val?: number;
    prc?: ProductPRC;
};
export type Telecom<T extends {}> = Item & {
    list?: T[];
};
export type TelecomProduct = Product & {
    cat: TelecomProductKey;
    typ: TelecomProductType;
    exp?: ProductEXP;
};
export type DataBundle = TelecomProduct & {
    vol: number;
};
export type Airtime = TelecomProduct;
export type DataCoupon = TelecomProduct & {
    lod: string;
    chk: string;
};
export type AirtimeCoupon = DataCoupon;
export type DiscoItem = Product;
export type CablePlan = Item & {
    typ: CablePlanType;
};
export type CableItem = Item & {
    list?: CablePlan[];
};
export type EduStuff = Item & {
    list?: ExamChecker[];
};
export type EduStuffProduct = Product & {
    typ: ExamCheckerType;
};
export type ExamChecker = EduStuffProduct;
export type OrderStatus = boolean | null;
export type Order = {
    doc: string;
    amt: number;
    crc: "NGN";
    sta: OrderStatus;
    bal: number;
    src: string;
    dst: string;
    inf: {
        via: string;
        api?: ProductChannelKey | null;
        cat?: string;
        prd?: string;
        qnt?: number;
        dsc?: string | object;
        rlt?: string;
        xvr?: boolean;
        fee?: number | 0;
    };
    dat: Date;
    typ: string;
    ref: string | null;
};
export type Message = {
    doc: string;
    msg: string;
    dat: Date;
};
export type Stat = {
    doc: string;
    val: number;
};
export type Stats = {
    doc: string;
    luc: Stat;
    ltc: Stat;
};
export type Printable = {
    PIN: string;
    SER: string;
    TYP: string;
    LOD: string;
    CHK: string;
};
/** Payment API Types */
export type AccountInfo = {
    bank: Bank;
    name: string;
    nuban: string;
    sessId?: string;
};
export type Bank = {
    nam: string;
    cod: string;
    slg: string;
};
export type Virtual = {
    uid: string;
    name: string;
    nuban: string;
    email: string;
    phone: string;
    active: boolean;
};
export type Transfer = {
    reference: string;
    amount: string;
    status: string;
    info: {
        accountName: string;
        accountNumber: string;
        bankCode: string;
    };
    channel: string;
    payer: {
        email: string;
        name: string;
    };
};
declare const _default: {};
export default _default;
