export interface ShopOwner {
    id:      number;
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
    shopOwner: ShopOwnerInfo;
    shopOwnerData: ShopOwnerData;
}

export interface ShopOwnerData {
    identityFrontImage: string | null;
    identityBackImage:  string | null;
    taxNumber:          string | null;
}

export interface ShopOwnerEdit {
    userId: number;
    fullName: string | undefined;
    phoneNumber: string | undefined;
    avatarPath: string | undefined;
    shopOwnerData: ShopOwnerData | undefined;
}

export interface ShopOwnerInfo {
    userId:    number;
    createdAt: Date;
    updatedAt: Date | null;
    shops:     Shop[];
}

export interface Shop {
    id:            number;
    shopOwnerId:   number;
    shopName:      string;
    phoneNumber:   string;
    address:       string;
    city:          string;
    district:      string;
    latitude:      number;
    longitude:     number;
    description:   string;
    avatar:        string;
    cover:         null;
    isActive:      boolean;
    isAccepted:    boolean;
    payPalAccount: string;
    createdAt:     Date;
    updatedAt:     Date;
    comment:       string | null;
    payouts:       any[];
}

