import * as Types from "./types";

class Environment {
    collate(info) {
        var env: Types.IEnvronment = {};

        return {
            ...this._browserInfo(info),
            ...this._sharedInfo(info),
            ...this._reactNativeInfo(info)
        };
    }

    private _browserInfo(info) {
        var env: Types.IEnvronment = {};

        // Web Browser Only Environment Info
        env.appCodeName = info.appCodeName || null;
        env.appVersion = info.appVersion || null;
        env.cookieEnabled = info.cookieEnabled || null;
        env.language = info.language || null;
        env.oscpu = info.oscpu || null;
        env.platform = info.platform || null;
        env.product = info.product || null;
        env.productSub = info.productSub || null;
        env.vendor = info.vendor || null;
        env.vendorSub = info.vendorSub || null;

        return env;
    }

    private _sharedInfo(info) {
        var env: Types.IEnvronment = {};

        // Web Browser AND React Native
        env.appName = info.appName || null;
        env.userAgent = info.userAgent || null;

        return env;
    }

    private _reactNativeInfo(info) {
        var env: Types.IEnvronment = {};

        // React Native Only Environment Info
        env.brand = info.brand || null;
        env.buildNumber = info.buildNumber || null;
        env.bundleId = info.bundleId || null;
        env.deviceCountry = info.deviceCountry || null;
        env.deviceId = info.deviceId || null;
        env.deviceLocale = info.deviceLocale || null;
        env.deviceName = info.deviceName || null;
        env.manufacturer = info.manufacturer || null;
        env.model = info.model || null;
        env.systemName = info.systemName || null;
        env.systemVersion = info.systemVersion || null;
        env.timezone = info.timezone || null;
        env.uniqueId = info.uniqueId || null;
        env.version = info.version || null;
        env.isEmulator = info.isEmulator || null;
        env.isTablet = info.isTablet || null;

        return env;
    }
}

export default new Environment();
