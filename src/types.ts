export interface IEnvronment {
    appCodeName?: string | null;
    appVersion?: string | null;
    cookieEnabled?: string | null;
    language?: string | null;
    oscpu?: string | null;
    platform?: string | null;
    product?: string | null;
    productSub?: string | null;
    vendor?: string | null;
    vendorSub?: string | null;

    appName?: string | null;
    userAgent?: string | null;

    brand?: string | null;
    buildNumber?: string | null;
    bundleId?: string | null;
    deviceCountry?: string | null;
    deviceId?: string | null;
    deviceLocale?: string | null;
    deviceName?: string | null;
    manufacturer?: string | null;
    model?: string | null;
    systemName?: string | null;
    systemVersion?: string | null;
    timezone?: string | null;
    uniqueId?: string | null;
    version?: string | null;
    isEmulator?: string | null;
    isTablet?: string | null;
}
