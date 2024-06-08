export type Auth = {
    accessToken: string;
    user: User;
};

export type User = {
    userId: number;
    uid: string;
    role: string[];
    isActive: boolean;
    isAdminGroup: boolean;
    isManagerGroup: boolean;
    isCustomer: boolean;
    isShopOwner: boolean;
    data: Data
};

type Data = {
    email: string;
    displayName: string;
    photoUrl: string;
}