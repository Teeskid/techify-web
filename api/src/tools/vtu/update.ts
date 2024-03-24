import { getFirestore } from "firebase-admin/firestore"
import { getDownloadURL, getStorage } from "firebase-admin/storage"
import { type Change, type DocumentSnapshot, type FirestoreEvent } from "firebase-functions/v2/firestore"

import { PAYMENT_CHANNELS, SSCEEXAM_CODES, TEL_PRODUCTS } from "apx/consts"
import type { ExamChecker, Telecom } from "apx/types/admin"

import type { EventProps } from "../../types/vtu"
import { CONTENT_JSON } from "../../utils/vtu/const"
import { ApiMetaConv, AppConv, EduStuffConv, ExamCheckerConv, TelecomConv } from "../../utils/vtu/convs"

export const updateConfig = async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, EventProps>): Promise<void> => {
    if (!event.params.api)
        return

    // get the required features
    const firestore = getFirestore()
    const bucketRef = getStorage().bucket()

    // fetch enabled files
    const metaRef = firestore.doc('_meta/app')
    const filesRef = firestore.collection('files').withConverter(AppConv).where("crn", '==', true).orderBy('dat', 'desc')
    const meta = await metaRef.get()

    console.log(meta)

    const files = [...(await filesRef.get()).docs]
    const list = await Promise.all(files.map<Promise<{
        doc: string,
        nam: string,
        siz: number,
        loc: string
    }>>(async (snap) => {
        const app = snap.data()
        return {
            ...app,
            doc: snap.id,
            nam: app.nam,
            loc: app.loc,
            siz: app.siz,
            las: event.id,
            lnk: await getDownloadURL(bucketRef.file(app.loc)),
        }
    }))
    const content = JSON.stringify(list)
    const object = bucketRef.file('files-list.json')
    await object.save(content, CONTENT_JSON)
}

export const updateProducts = async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, EventProps>): Promise<void> => {
    if (!event.params.api)
        return

    // get the required features
    const firestore = getFirestore()
    const bucket = getStorage().bucket()

    // fetch enabled telecoms
    const telcosRef = firestore.collection('tlcms')
    const telecoms = [...(await telcosRef.orderBy('id').where("ena", "==", true).withConverter(TelecomConv).get()).docs].map<Telecom>((snap) => {
        const telecom = snap.data()
        return {
            doc: snap.id,
            aid: telecom.aid,
            nam: telecom.nam,
            prd: {},
            stk: 0,
            ena: true,
        }
    })
    await Promise.all(
        TEL_PRODUCTS.map<Promise<string>>(async (prodKey) => {
            let product = await Promise.all(
                telecoms.map(async (item) => {
                    if (!item.prd[prodKey] || item.prd[prodKey].length === 0)
                        return null
                    const sort = prodKey === 'airtime' ? 'stock' : 'volume'
                    const items = [...(
                        await telcosRef.doc(item.doc).collection(prodKey).where('ena', '==', true)
                            .orderBy(sort)
                            .orderBy('type')
                            .get()
                    ).docs].map((snap) => {
                        const item = { ...snap.data() }
                        return {
                            index: snap.id,
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            price: item.price.sta,
                            valid: Object.values(item.valid || 0).find((item) => !!item),
                        }
                        return item
                    })
                    const telecom = {
                        aid: item.aid,
                        name: item.nam,
                        index: item.doc,
                        items
                    }
                    return telecom
                })
            )
            product = product.filter((item) => !!item)
            const fileName = `product-${prodKey}.json`
            await bucket.file(fileName).save(JSON.stringify(product), CONTENT_JSON)
            return fileName
        })
    )

    // exam pins list
    const eduStuffRef = firestore.collection('edustuff').withConverter(EduStuffConv)
    const edustuff = [...(await eduStuffRef.orderBy('id').get()).docs].map((snap) => {
        const stuff = snap.data()
        return {
            aid: stuff.aid,
            doc: snap.id,
            nam: stuff.nam,
            ena: true,
            items: SSCEEXAM_CODES.reduce((obj, val) => ({ ...obj, [val]: [] as ExamChecker[] }), {}),
        }
    })
    let product = await Promise.all(
        edustuff.map(async (item) => {
            if (!item.items || Object.keys(item.items).length === 0)
                return null
            const items = [...(await eduStuffRef.doc(item.doc).collection('items').orderBy('id').withConverter(ExamCheckerConv).get()).docs].map((snap) => {
                const item = { ...snap.data() }
                return {
                    index: snap.id,
                    id: item.aid,
                    name: item.nam,
                    type: item.typ,
                    price: item.prc,
                    valid: Object.values(item.val || 0).find((item) => !!item),
                }
            })
            return {
                aid: item.aid,
                doc: item.doc,
                nam: item.nam,
                items
            }
        })
    )
    product = product.filter((item) => !!item)
    const fileName = `product-edustuff.json`
    await bucket.file(fileName).save(JSON.stringify(product), CONTENT_JSON)
}

export const updatePayments = async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, EventProps>): Promise<void> => {
    if (!event.params.api)
        return

    // fetch banks list
    const firestore = getFirestore()
    const paymentRef = firestore.doc('_meta/payment').withConverter(ApiMetaConv)
    const bucket = getStorage().bucket()
    // save to storage
    await Promise.all(
        PAYMENT_CHANNELS.map(async (channel) => {
            const banksRef = paymentRef.collection(`banks-${channel}`).orderBy("name")
            const bankList = (await banksRef.get()).docs.map((i) => i.data())
            // save file on cloud storage
            const fileName = `banklist-${channel}.json`
            await bucket.file(fileName).save(JSON.stringify(bankList), CONTENT_JSON)
            return fileName
        })
    )
}
