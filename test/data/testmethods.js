const STANDARD_TEST_DATA = require("./standardTestData");

module.exports = [
    {
        name: "action",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: false
    },
    {
        name: "error",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true,
        isCustom: false
    },
    {
        name: "info",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true,
        isCustom: false
    },
    {
        name: "log",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true,
        isCustom: false
    },
    {
        name: "table",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true,
        isCustom: false
    },
    {
        name: "warn",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true,
        isCustom: false
    },

    // Custom (will be added via the customMethods array)
    {
        name: "customOne",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: false,
        isCustom: true
    },
    {
        name: "customTwoWithLongName",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: false,
        isCustom: true
    },

    // Standard, but not logged by Chronicle
    {
        name: "clear",
        suite: [],
        canServerLog: false,
        canConsole: true,
        isCustom: false
    },
    {
        name: "count",
        suite: [],
        canServerLog: false,
        canConsole: true,
        isCustom: false
    },
    {
        name: "dir",
        suite: [],
        canServerLog: false,
        canConsole: true,
        isCustom: false
    },
    {
        name: "dirxml",
        suite: [],
        canServerLog: false,
        canConsole: true,
        isCustom: false
    },
    {
        name: "profile",
        suite: [],
        canServerLog: false,
        canConsole: true,
        isCustom: false
    },
    {
        name: "profileEnd",
        suite: [],
        canServerLog: false,
        canConsole: true,
        isCustom: false
    }
];
