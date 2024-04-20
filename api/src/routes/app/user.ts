import { Router as createRouter } from "express";
import { Timestamp, getFirestore } from "firebase-admin/firestore";

import type { Context } from "../../types/app";

import { changePIN, updateCore } from "../../handlers/app/user";
import { updateNuban } from "../../handlers/pay/nuban";
import { getContext } from "../../utils/app/auth";
import { genAPIKey } from "../../utils/app/user";

const user = createRouter()

user.post("/edit", (r) => {
    const { auth } = (r as any).context as Context
    if (!auth)
        return {}
    const { action, ...data } = r.body
    let result: object
    switch (action) {
        case 'update-core':
            result = updateCore(auth, data)
        case 'update-pin':
            result = changePIN(auth, data)
        case 'create-nuban':
            result = updateNuban(auth, data)
        default:
            result = {
                code: 401,
                text: "you are not allowed to access this path"
            }
    }
    return result
})

user.route("/keys").get(async (r, res) => {
    const { auth } = getContext(r)
    const store = getFirestore()
    const keyDoc = await store.collection("keys").doc(auth?.uid as string).get()
    if (!keyDoc.exists) {
        res.json({
            code: 400,
            text: "keys not generated yet"
        })
        return
    }
    const data = keyDoc.data()
    res.json({ code: 200, data })
}).post(async (r, res) => {
    const { auth } = getContext(r)
    if (!r.body.type)
        throw new Error("invalid arguments")
    const type = r.body.type
    const apiKey = genAPIKey()
    const store = getFirestore()
    const data = {
        sec: apiKey,
        iss: Date.now(),
        typ: type,
        exp: false
    }
    await store.collection("keys").doc(auth?.uid as string).create({
        ...data,
        iss: Timestamp.fromMillis(data.iss)
    })
    res.json({ code: 200, data })
})

export default user