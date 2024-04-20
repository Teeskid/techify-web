import { getFirestore } from "firebase-admin/firestore"

import { AuthData } from "../../types/app"
import { createVirtual as _updateVirtual } from "../../utils/pay/nuban"
import { MERGE_DOC, isValidEmail, isValidName, isValidPhone } from "../../utils/vtu"
import { UserConv } from "../../utils/vtu/convs"

export const updateNuban = async (auth: AuthData, data: object): Promise<object> => {
    if (!data) {
        return {
            code: 403,
            text: 'an error occured'
        }
    }
    try {
        // validate user data
        const firestore = getFirestore()
        const userRef = firestore.collection("users").doc(auth.uid).withConverter(UserConv)
        const user = (await userRef.get()).data()

        if (!user || user.typ !== 'wallet')
            throw new Error('you have not updated your profile yet')

        const errors = []
        if (!isValidEmail(user.eml))
            errors.push('invalid email')
        if (!isValidPhone(user.phn))
            errors.push('invalid phone number')
        if (!isValidName(user.nam))
            errors.push('invalid name')
        if (errors.length !== 0) {
            errors.push('please update your profile')
            throw new Error(errors.join(', '))
        }

        const walletRef = firestore.collection("uwlts").doc(userRef.id)
        const wallet = (await walletRef.get()).data()
        if (!wallet)
            throw new Error('you have not created a wallet yet')

        const virtual = await _updateVirtual(user, 'v2')
        if (!virtual)
            throw new Error('An error occured while generating your account number')

        // update user wallet
        await walletRef.set({
            kda: {
                nam: virtual.name,
                nbn: virtual.nuban
            }
        }, MERGE_DOC)

        return { status: true, message: 'profile updated successfully', data }
    } catch (error: Error | unknown) {
        return { status: false, message: (<Error>error).message }
    }
}

export default {}
