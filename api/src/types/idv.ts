export interface NINDetails {
    firstName: string,
    lastName: string,
    middleName: string,
    dateOfBirth: string,
    phoneNumber: string,
    address: {
        stateName: string,
        localGovt: string,
        lineTwo: string
    },
    gender: "M" | "F",
    trackingId: string,
    userId: string,
    photoData: string,
    issueDate: string,
    ninNumber: string,
    vNinNumber: string,
}
export type BVNDetails = Record<string, string>
export interface Server {

}
