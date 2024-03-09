import type { AccountInfo, Bank, Transfer, Virtual } from "techify-apx/types"

export type SrvInfo = {
    bal: number
}

export interface Server {
    VIRTUAL_INDEX: string
    VIRTUAL_BANKS: Record<string, Bank>
    getBasic(): Promise<SrvInfo>
    getBankList(): Promise<Bank[]>
    createVirtual(userId: string, details: {
        email: string,
        phoneNumber: string,
        displayName: string
    }): Promise<Virtual>
    getVirtual(uid: string): Promise<Virtual | null>
    getVirtuals(page: number): Promise<Virtual[] | null>
    getBalance(uid: string): Promise<number>
    chargeVirtual(uid: string, amount: number): Promise<string | null>
    resolveInfo(bank: Bank, nuban: string): Promise<AccountInfo | null>
    iTransferFund(uid: string, acctInfo: AccountInfo, amount: number): Promise<string | null>
    eTransferFund(acctInfo: AccountInfo, amount: number): Promise<string | null>
    bulkTransfer(acctInfo: AccountInfo[], amount: number): Promise<string | null>
    findTransfer(reference: string): Promise<Transfer | null>
    disableVirtual(uid: string, enable: boolean): Promise<string>
}
