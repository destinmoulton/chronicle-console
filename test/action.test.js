const fs = require("fs");

const chai = require("chai");
const consoleMock = require("console-mock");
const fetchMock = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;
const nodeFetch = require("node-fetch");

const expect = chai.expect;

const generateExpectedClient = require("./lib/generateExpectedClient");

// The Chronicle Console we are going to test.
const ChronicleConsole = require("../dist/chronicleconsole");

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
        fetchMock.restore();
        fetchMock.post(SERVER, 200);
        consoleMock.enabled(false);
        consoleMock.historyClear();

        // Build a mock for the window.navigator
        global.window = new MockBrowser().getWindow();

        // Add the window navigator to the expected info
        const expectedClient = generateExpectedClient(global.window.navigator);
        EXPECTED_BODIES[0].client = expectedClient;
        EXPECTED_BODIES[1].client = expectedClient;

        const config = {
            server: SERVER,
            app: APP,
            clientInfo: {},
            toConsole: true, // Regular console is enabled, though nothing should be added
            globalConsole: consoleMock.create()
        };
        ChronicleConsole.init(config);
    });

    it("logs to the server NOT to the client console", () => {
        ChronicleConsole.action("login", "Logindetails");
        ChronicleConsole.action("click", "clickTarget");

        const history = consoleMock.history();
        expect(history)
            .to.be.an("array")
            .and.have.length(0);

        const fetchedCalls = fetchMock.calls();

        expect(fetchedCalls)
            .to.be.an("array")
            .of.length(2);

        fetchedCalls.forEach((call, idx) => {
            const pkg = call[1];
            expect(pkg.method).to.equal(EXPECTED_METHOD);
            expect(pkg.headers).to.deep.equal(EXPECTED_HEADERS);
            expect(pkg.body).to.equal(JSON.stringify(EXPECTED_BODIES[idx]));
        });
    });
});
