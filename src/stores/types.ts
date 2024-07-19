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
            refresh: string;
            loggedUser: string;
            all: string;
            register: string;
            details: string;
            update: string;
            status: string;
            sendPasswordResetEmail: string;
            staffs: {
                export: string;
                import: string;
            },
            devices: string;
        },
        image: {
            upload: string;
        },
        datasource: {
            categories: string;
            category: string;
            brands: string;
        },
        seller: {
            shops: string;
            shop: string;
            shopOverview: string;
        },
        shop: {
            base: string;
            product: string;
            products: string;
            orders: string;
            order: {
                status: string;
            },
            request: string;
            acceptRequest: string;
            ordersInPayoutDate: string;
            productStatus: string;
        },
        ecommerce: {
            products: string;
            checkout: string;
            orders: string;
            trackingProduct: string;
            feedback: string;
            feedbacks: string;
            similar: string;
        },
        payment: {
            details: string;
            requestMonthlyPayout: string;
            acceptPayout: string;
            customRequestPayout: string;
        },
        external: {
            payPal: {
                auth: string;
                customerInfo: string;
            }
        },
        setting: {
            base: string;
            shop: string;
            shopRefresh: string;
        },
        staff: {
            shop: {
                accept: string;
            },
            shops: string;
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

export enum EPaymentMethod {
    VnPay = 1,
}

export enum OrderStatus {
    Pending = 1,
    Processing = 2,
    Delivered = 3,
    Cancelled = 4,
    Returned = 5,
    Refunded = 6,
    Completed = 7
}

type ImportResult = {
    row: number;
    isSuccess: boolean;
    message: string | undefined;
}

export type ImportResponse = {
    message: string | undefined;
    results: ImportResult[];
}