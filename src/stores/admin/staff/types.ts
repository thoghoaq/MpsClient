export interface Staff {
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

export interface StaffData {
    identityCard:          string | undefined;
    identityCardFrontPath: string | undefined;
    identityCardBackPath:  string | undefined;
    address:               string | undefined;
    certificatePath:       string | undefined;
}

export interface StaffEdit {
    userId: number;
    fullName: string | undefined;
    phoneNumber: string | undefined;
    avatarPath: string | undefined;
    staffData: StaffData | undefined;
}

