import ChronicleConsole from "./ChronicleConsole";
/// <reference types="requirejs" />
/// <reference types="node" />

/**
 * ChronicleConsole
 */
(function(global, factory) {
    var appName = "ChronicleConsole";
    if (typeof window === "object") {
        window[appName] = new ChronicleConsole();
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(appName, [], factory);
    } else if (typeof exports === "object") {
        exports[appName] = factory();
    } else {
        global[appName] = factory();
    }
})(this, function() {
    return new ChronicleConsole();
});
