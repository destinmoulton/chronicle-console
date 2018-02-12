const fs = require("fs");

const chai = require("chai");
const consoleMock = require("console-mock");
const fetchMock = require("fetch-mock");
const nodeFetch = require("node-fetch");

const expect = chai.expect;

// The Chronicle Console we are going to test.
const ChronicleConsole = require("../index");

// Some constants (for configuration)
const SERVER = "http://testserver.com";
const APP = "TestApp";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

describe("console.action() ", () => {
    beforeEach(() => {
        // Monitor all POSTs
        fetchMock.restore();
        fetchMock.post(SERVER, 200);
        consoleMock.enabled(false);
        consoleMock.historyClear();

        const config = {
            serverURL: SERVER,
            appName: APP,
            clientInfo: {},
            toConsole: true, // enable the console, but nothing should be output to console
            fetch: nodeFetch
        };
        ChronicleConsole.init(config);
    });

    it("logs to the server NOT to the client console", () => {
        console.action("login", "Logindetails");
        console.action("click", "clickTarget");
    });
});
