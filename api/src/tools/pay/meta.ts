import { getFirestore } from "firebase-admin/firestore"

import type { AccountInfo, PaymentChannelKey } from "techify-apx/types"

import { PaymentMetaData } from "techify-apx/types/admin"
import { BankConv } from "../../utils/vtu/convs"
import { MERGE_DOC } from "../../utils/vtu/utils"
import type { Server } from "./types"
import { getServer } from "./utils"

const reload = async (channel: PaymentChannelKey): Promise<object> => {
    // get the api server module and data
    const server: Server | null = await getServer(channel)
    const source = await server.getBasic()
    const bankList = await server.getBankList()

    const metadata: Partial<PaymentMetaData> = {
        bal: source.bal,
        uda: new Date(),
        cnt: bankList.length
    }

    // commit to database
    const firestore = getFirestore()
    const paymentRef = firestore.doc('_meta/payment')
    const bankListRef = paymentRef.collection(`banks-${channel}`).withConverter(BankConv)
    const dbBatch = firestore.batch()

    // add items to batch
    bankList.forEach((bank) => {
        dbBatch.set(bankListRef.doc(bank.cod), bank)
    })

    // commit at once
    await dbBatch.commit()

    await paymentRef.set({
        [channel]: metadata
    }, MERGE_DOC)

    return metadata
}

export const resolveAccount = async (index: PaymentChannelKey, bankCode: string, nuban: string): Promise<AccountInfo | null> => {
    // get cached server module
    const server: Server = await getServer(index)
    // fetch virtual accounts
    return await server.resolveInfo({ slg: '', cod: bankCode, nam: '' }, nuban)
}

export default { reload }
