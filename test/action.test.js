const fs = require("fs");

const chai = require("chai");
const mockConsole = require("console-mock");
const mockFetch = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;
const nodeFetch = require("node-fetch");

const expect = chai.expect;

const generateExpectedClient = require("./lib/generateExpectedClient");

// The Chronicle Console we are going to test.
const chronicleConsole = require("../dist/chronicleconsole");

// Some constants (for configuration)
const SERVER = "http://testserver.com";
const APP = "TestApp";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

let EXPECTED_BODIES = [
    {
        app: "TestApp",
        client: {},
        type: "action",
        data: ["login", "Logindetails"]
    },
    {
        app: "TestApp",
        client: {},
        type: "action",
        data: ["click", "clickTarget"]
    }
];

describe("console.action() ", () => {
    beforeEach(() => {
        // Monitor all POSTs
        mockFetch.restore();
        mockFetch.post(SERVER, 200);
        mockConsole.enabled(false);
        mockConsole.historyClear();

        // Build a mock for the window.navigator
        mockWindow = new MockBrowser().getWindow();
        global.navigator = mockWindow.navigator;

        // Add the window navigator to the expected info
        const expectedClient = generateExpectedClient(global.navigator);
        EXPECTED_BODIES[0].client = expectedClient;
        EXPECTED_BODIES[1].client = expectedClient;

        const config = {
            server: SERVER,
            app: APP,
            toConsole: false, // Regular console is enabled, though nothing should be added
            consoleObject: mockConsole.create(),
            globalize: false
        };
        chronicleConsole.init(config);
    });

    it("logs to the server NOT to the client console", () => {
        chronicleConsole.action("login", "Logindetails");
        chronicleConsole.action("click", "clickTarget");

        const history = mockConsole.history();

        expect(history)
            .to.be.an("array")
            .and.have.length(0);

        const fetchedCalls = mockFetch.calls();

        expect(fetchedCalls)
            .to.be.an("array")
            .of.length(2);

        fetchedCalls.forEach((call, idx) => {
            const pkg = call[1];
            const { app, client, type, data, trace } = JSON.parse(pkg.body);
            expect(pkg.method).to.equal(EXPECTED_METHOD);
            expect(pkg.headers).to.deep.equal(EXPECTED_HEADERS);
            expect(app).to.equal(EXPECTED_BODIES[idx].app);
            expect(client).to.deep.equal(EXPECTED_BODIES[idx].client);
            expect(type).to.equal(EXPECTED_BODIES[idx].type);
            expect(data).to.deep.equal(EXPECTED_BODIES[idx].data);
            expect(trace).to.be.length.gt(4);
        });
    });
});
