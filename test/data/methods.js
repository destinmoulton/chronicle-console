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
        canConsole: true
    },
    {
        name: "info",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true
    },
    {
        name: "log",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true
    },
    {
        name: "table",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true
    },
    {
        name: "warn",
        suite: STANDARD_TEST_DATA,
        canServerLog: true,
        canConsole: true
    },
    {
        name: "clear",
        suite: [],
        canServerLog: false,
        canConsole: true
    },
    {
        name: "count",
        suite: [],
        canServerLog: false,
        canConsole: true
    },
    {
        name: "dir",
        suite: [],
        canServerLog: false,
        canConsole: true
    },
    {
        name: "dirxml",
        suite: [],
        canServerLog: false,
        canConsole: true
    },
    {
        name: "profile",
        suite: [],
        canServerLog: false,
        canConsole: true
    },
    {
        name: "profileEnd",
        suite: [],
        canServerLog: false,
        canConsole: true
    }
];
