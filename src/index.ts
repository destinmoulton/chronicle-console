import ChronicleConsole from "./ChronicleConsole";
import Environment from "./Environment";
import Helpers from "./Helpers";
/// <reference types="requirejs" />
/// <reference types="node" />

/**
 * ChronicleConsole
 */
(function(global, factory) {
    var appName = "ChronicleConsole";
    if (typeof window === "object") {
        window[appName] = factory();
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
    const argHelpers = new Helpers();
    const environmentParser = new Environment();
    return new ChronicleConsole(argHelpers, environmentParser);
});
