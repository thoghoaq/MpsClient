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
        }
    }
}