export interface NINDetails {
    firstName: string,
    lastName: string,
    middleName: string,
    dateOfBirth: string,
    phoneNumber: string,
    address: {
        stateName: string,
        localGovt: string,
        lineOne: string
    },
    gender: "M" | "F",
    userId: string,
    photoData: string,
    issueDate: string,
    ninNumber: string,
    trackingId: string,
    vNinNumber: string,
}

export type BVNDetails = Record<string, string>
