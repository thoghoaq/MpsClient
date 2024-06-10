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
    account: '/account',
    image: '/image',
    datasource: '/datasource',
    seller: '/seller'
}

const getLoggedUser = function () {
    var auth = localStorage.getItem('auth');
    if (auth) {
        return JSON.parse(auth)["user"];
    }
    return null;
}

export const appConfig : AppConfig = {
    apiEndpoint: getAppPath(),
    language: 'vi-VN',
    api: {
        account: {
            login: getControllerUrl('login', controllers.account),
            all: getControllerUrl('all', controllers.account),
            register: getControllerUrl('register', controllers.account),
            details: getControllerUrl('details', controllers.account),
            update: getControllerUrl('update', controllers.account),
            status: getControllerUrl('status', controllers.account),
        },
        image: {
            upload: getControllerUrl('upload', controllers.image)
        },
        datasource: {
            categories: getControllerUrl('categories', controllers.datasource),
            category: getControllerUrl('category', controllers.datasource),
        },
        seller: {
            shops: getControllerUrl('shops', controllers.seller),
        }
    },
    loggedUser: getLoggedUser(),
    appendUrl: appendUrl,
}