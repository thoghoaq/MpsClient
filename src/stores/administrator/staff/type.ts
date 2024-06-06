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
