export interface Customer {
    userId:      number;
    fullName:    string;
    email:       string;
    role:        string;
    identityId:  string;
    avatarPath:  string | null;
    phoneNumber: string | null;
    isActive:    boolean;
    createdAt:   Date;
    updatedAt:   Date | null;
    userDevices: null;
}

export interface CustomerData {

}

export interface CustomerEdit {
    userId: number;
    fullName: string | undefined;
    phoneNumber: string | undefined;
    avatarPath: string | undefined;
    customerData: CustomerData | undefined;
}

