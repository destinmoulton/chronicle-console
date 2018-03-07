const chai = require("chai");
const mockConsole = require("console-mock");
const mockFetch = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;

const expect = chai.expect;

const generateExpectedClient = require("./lib/generateExpectedClient");

const chronicleLogger = require("../dist/chronicleconsole");

const APP = "TEST TRACE APP";
const SERVER = "https://servername.com";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

const TESTS = [
    { name: "DOES log to the console.", consoleEnabled: true },
    {
        name: "Does NOT log to the console.",
        consoleEnabled: false
    }
];

describe("ChronicleLogger .trace()", () => {
    TESTS.forEach(test => {
        describe("Logs trace to server", () => {
            beforeEach(() => {
                mockFetch.restore();
                mockFetch.post(SERVER, "*");
                mockConsole.enabled(false);
                mockConsole.historyClear();

                // Build a mock for the window.navigator
                global.window = new MockBrowser().getWindow();

                const config = {
                    server: SERVER,
                    app: APP,
                    clientInfo: {},
                    toConsole: test.consoleEnabled,
                    globalConsole: mockConsole.create()
                };

                chronicleLogger.init(config);
            });

            it(test.name, () => {
                chronicleLogger.trace();

                const history = mockConsole.history();
                if (test.consoleEnabled) {
                    expect(history)
                        .to.be.an("array")
                        .and.have.length(1);
                } else {
                    expect(history)
                        .to.be.an("array")
                        .and.have.length(0);
                }

                const fetchedCalls = mockFetch.calls();

                expect(fetchedCalls, "Mocked fetch failed.")
                    .to.be.an("array")
                    .that.is.length(1);

                fetchedCalls.forEach((call, index) => {
                    const details = call[1];
                    const body = JSON.parse(details.body);
                    expect(call[0]).to.equal(SERVER);
                    expect(details.method).to.equal(EXPECTED_METHOD);
                    expect(details.headers).to.deep.equal(EXPECTED_HEADERS);
                    expect(body.app).to.equal(APP);
                    expect(body.type).to.equal("trace");
                    expect(body.data).to.be.an("array").that.is.not.empty;
                    expect(body.client).to.deep.equal(
                        generateExpectedClient(global.window.navigator)
                    );
                });
            });
        });
    });
});
