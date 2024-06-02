export type APIResponse<T> = {
    success: boolean;
    content: T;
    status?: number;
}

export interface AppConfig {
    apiEndpoint: string;
    api: {
        account: {
            login: string;
        }
    }
}