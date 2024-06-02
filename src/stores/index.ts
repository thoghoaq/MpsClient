import { AppConfig } from "./types";

const getAppPath = function () {
    return import.meta.env.VITE_API_ENDPOINT;
}

const getUrl = function (url: string, params?: any): string {
    return getAppPath() + appendUrl(url, params);
}

const appendUrl = function (url: string, params?: any) {
    if (params) {
        var urlParams = new URLSearchParams();
        for (var key in params) {
            let value = params[key];
            if (value) urlParams.set(key, value);
        }
        var paramStr = urlParams.toString();
        if (paramStr)
            url += (url.indexOf('?') == -1 ? '?' : '&') + paramStr;
    }
    return url;
};

const getControllerUrl = function (action: string, controller: string) {
    return getUrl(controller + '/' + action);
}

const controllers = {
    account: 'account'
}

export const appConfig : AppConfig = {
    apiEndpoint: getAppPath(),
    api: {
        account: {
            login: getControllerUrl('login', controllers.account)
        }
    }
}