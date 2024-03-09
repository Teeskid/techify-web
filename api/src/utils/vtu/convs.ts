/* eslint-disable no-unused-vars */
import { FirestoreDataConverter, QueryDocumentSnapshot } from "firebase-admin/firestore"

import type { App, Bank, Message, Order, Stat, TelecomProduct, User, Wallet } from "techify-apx/types"
import type { ApiMeta, CableItem, DiscoItem, EduStuff, ExamChecker, Telecom } from "techify-apx/types/admin"

export const createConverter = <T extends { doc: string }>(): FirestoreDataConverter<T> => ({
    toFirestore({ doc, ...invoiceItem }: T) {
        if (!doc)
            return {}
        return { ...invoiceItem }
    },
    fromFirestore(snap: QueryDocumentSnapshot<T>) {
        const data = snap.data()
        return { ...data, doc: snap.id }
    }
})

export const AppConv = createConverter<App>()

export const UserConv = createConverter<User>()

export const WalletConv = createConverter<Wallet>()

export const TelecomConv = createConverter<Telecom>()

export const ProductConv = createConverter<TelecomProduct>()

export const OrderConv = createConverter<Order>()

export const MessageConv = createConverter<Message>()

export const StatConv = createConverter<Stat>()

export const BankConv = createConverter<Bank & { doc: string }>()

export const DiscoConv = createConverter<DiscoItem>()

export const CableConv = createConverter<CableItem>()

export const EduStuffConv = createConverter<EduStuff>()

export const ExamCheckerConv = createConverter<ExamChecker>()

export const ApiMetaConv = createConverter<ApiMeta>()

