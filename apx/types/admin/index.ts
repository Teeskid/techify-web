import type {
    CableItem as CableItemBase,
    CablePlanType,
    ExamCheckerType,
    PaymentChannelKey,
    Product as ProductBase,
    ProductChannelKey,
    Telecom as TelecomBase, TelecomProduct as TelecomProductBase,
    TelecomProductKey
} from "../index"

export type MetaData = {
    uid: string,
    bal: number,
    sec: string,
    uda: Date,
    ena: boolean,
}

export type PaymentSVCKey = "nuban" | "withdraw"

export type Virtual = {
    uid: string,
    name: string,
    email: string,
    phone: string,
    nuban: false,
    active: boolean,
    balance: number,
}

export type PaymentSVC = Record<PaymentChannelKey, boolean>

export type PaymentMetaData = MetaData & {
    doc: string,
    svc: PaymentSVC,
    cnt: number,
}

export type PaymentMeta = Record<PaymentChannelKey, PaymentMetaData>

export type ProductMetaData = MetaData & {
    doc: string,
    prd: Record<TelecomProductKey, boolean>,
    cnt: Record<TelecomProductKey, number>,
}

export type ProductMeta = Record<ProductChannelKey, ProductMetaData>

export type ApiMeta = {
    doc: string,
    payment: PaymentMeta,
    product: ProductMeta
}

export type ItemAID = Record<ProductChannelKey, string | number>

export type ProductSTK = Record<ProductChannelKey, number>

export type Product = ProductBase & {
    aid: ItemAID,
    stk: ProductSTK,
    ena: boolean
}

export type TelecomProduct = TelecomProductBase & {
    aid: ItemAID,
    stk: ProductSTK,
    ena: boolean
}

export type TelecomPRD = Record<TelecomProductKey, ProductChannelKey[]>

export type Telecom = TelecomBase<TelecomProduct> & {
    aid: ItemAID,
    prd: TelecomPRD,
    ena: boolean,
}

export type DataBundle = TelecomProduct & {
    vol: number
}

export type Airtime = TelecomProduct

export type Coupon = {
    lod: string,
    chk: string,
}

export type DataCoupon = DataBundle & Coupon

export type AirtimeCoupon = DataCoupon

export enum MeterType {
    PREPAID = 1,
    POSTPAID
}

export type DiscoItem = Product

export interface CablePlan extends Product {
    typ: CablePlanType
}

export type CableItem = CableItemBase & {
    aid: ItemAID,
    ena: boolean,
    list?: CablePlan[],
}

export type ExamChecker = Product & {
    typ: ExamCheckerType
}

export type EduStuff = Product & {
    list?: ExamChecker[],
}

export default {}
