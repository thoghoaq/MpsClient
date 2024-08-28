export interface Shop {
    id:            number;
    shopOwnerId:   number;
    shopName:      string;
    phoneNumber:   string;
    address:       string;
    city:          string;
    district:      string;
    latitude:      number | null;
    longitude:     number | null;
    description:   string | null;
    avatar:        string | string;
    cover:         string | null;
    isActive:      boolean;
    isAccepted:    boolean;
    payPalAccount: string;
    createdAt:     Date;
    updatedAt:     Date;
    businessLicenseImage: string | null;
}