export interface Shop {
    id:          number;
    shopOwnerId: number;
    shopName:    string;
    phoneNumber: string;
    address:     string;
    city:        string | null;
    district:    string | null;
    latitude:    number | null;
    longitude:   number | null;
    description: string | null;
    avatar:      string | null;
    cover:       string | null;
    isActive:    boolean;
    isAccepted:  boolean;
    createdAt:   Date;
    updatedAt:   Date | null;
    payPalAccount: string | null;
    comment: string | null;
}
