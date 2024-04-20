import { type UserRecord } from "firebase-admin/auth"
import { FieldValue, getFirestore } from "firebase-admin/firestore"

import { StatConv, WalletConv } from "../../utils/vtu/convs"
import { MERGE_DOC, shardDoc } from "../../utils/vtu"

export const chargeWallet = async (user: UserRecord, amount: number, sender: string, channel: string, reference: string | null): Promise<number> => {
    const firestore = getFirestore()
    const walletRef = firestore.collection("uwlts").withConverter(WalletConv).doc(user.uid)
    const statRef = firestore.doc('stats/ltf').withConverter(StatConv).collection("cnt").doc(shardDoc())
    const itemRef = walletRef.collection("ivhs").doc()
    const balance = await firestore.runTransaction(async (t) => {
        const wallet = (await t.get(walletRef)).data()
        if (!wallet)
            throw new Error('failed to get wallet')
        const increase = FieldValue.increment(amount)
        wallet.ltc += 1
        t.update(walletRef, {
            bal: increase,
            ltf: increase,
            ltc: FieldValue.increment(1)
        })
        t.set(itemRef, {
            amt: amount,
            src: sender,
            sta: true,
            dst: user.email,
            typ: 'fund',
            dat: FieldValue.serverTimestamp(),
            inf: {
                via: channel
            },
            bal: wallet.bal,
            ref: reference
        })
        t.set(statRef, {
            val: increase
        }, MERGE_DOC)
        return wallet.bal + amount
    })
    return balance
}
