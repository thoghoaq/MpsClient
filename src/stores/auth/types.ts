export type Auth = {
    accessToken: string;
    user: User;
};

type User = {
    userId: number;
    uid: string;
    role: string[];
    isActive: boolean;
    email: string;
    displayName: string;
    photoUrl: string;
};