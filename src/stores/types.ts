import { User } from 'src/stores/auth/types'

export type APIResponse<T> = {
    success: boolean;
    content: T;
    status?: number;
}

export type APIResponseError<T> = APIResponse<T> & {
    reason: string;
}

export interface AppConfig {
    apiEndpoint: string;
    language: string;
    api: {
        account: {
            login: string;
            all: string;
            register: string;
            details: string;
            update: string;
            status: string;
        },
        image: {
            upload: string;
        },
        datasource: {
            categories: string;
            category: string;
        }
    },
    loggedUser: User,
    appendUrl: (url: string, params?: any) => string;
}

export enum ERole {
    Admin = 'Admin',
    Staff = 'Staff',
    ShopOwner = 'ShopOwner',
    Customer = 'Customer'
}

export enum EFileType {
    UserAvatars = 1,
    ProductImages = 2,
    General = 3
}