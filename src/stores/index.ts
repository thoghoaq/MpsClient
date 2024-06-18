import { User } from "./auth/types";
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
    seller: '/seller',
    shop: '/shop',
    ecommerce: '/ecommerce',
}

const getLoggedUser = function () {
    var auth = localStorage.getItem('auth');
    if (auth) {
        return JSON.parse(auth)["user"];
    }
    return <User>{
        isManagerGroup: false,
        isAdminGroup: false,
        isShopOwner: false,
        isCustomer: false,
        isGuest: true,
    };
}

export const appConfig : AppConfig = {
    apiEndpoint: getAppPath(),
    language: 'vi-VN',
    api: {
        account: {
            login: getControllerUrl('login', controllers.account),
            refresh: getControllerUrl('refresh', controllers.account),
            all: getControllerUrl('all', controllers.account),
            register: getControllerUrl('register', controllers.account),
            details: getControllerUrl('details', controllers.account),
            update: getControllerUrl('update', controllers.account),
            status: getControllerUrl('status', controllers.account),
            sendPasswordResetEmail: getControllerUrl('send-password-reset-email', controllers.account),
            staffs: {
                export: getControllerUrl('staffs/export', controllers.account),
                import: getControllerUrl('staffs/import', controllers.account),
            }
        },
        image: {
            upload: getControllerUrl('upload', controllers.image)
        },
        datasource: {
            categories: getControllerUrl('categories', controllers.datasource),
            category: getControllerUrl('category', controllers.datasource),
            brands: getControllerUrl('brands', controllers.datasource),
        },
        seller: {
            shops: getControllerUrl('shops', controllers.seller),
            shop: getControllerUrl('shop', controllers.seller),
        },
        shop: {
            product: getControllerUrl('product', controllers.shop),
            products: getControllerUrl('products', controllers.shop),
        },
        ecommerce: {
            products: getControllerUrl('products', controllers.ecommerce),
            checkout: getControllerUrl('checkout', controllers.ecommerce),
        }
    },
    loggedUser: getLoggedUser(),
    appendUrl: appendUrl,
}