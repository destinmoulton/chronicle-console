const chai = require("chai");
const mockConsole = require("console-mock");
const mockFetch = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;

const expect = chai.expect;

const generateExpectedClient = require("./lib/generateExpectedClient");

const chronicleLogger = require("../dist/chronicleconsole");
const TEST_MODES = require("./data/testmodes");

const APP = "TEST TRACE APP";
const SERVER = "https://servername.com";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

describe("ChronicleLogger .trace()", () => {
    TEST_MODES.forEach(mode => {
        describe(mode.title, () => {
            beforeEach(() => {
                // Monitor all POSTs
                mockFetch.restore();
                mockFetch.post(SERVER, 200);
                mockConsole.enabled(false);
                mockConsole.historyClear();

                // Build a mock for the window.navigator
                mockWindow = new MockBrowser().getWindow();
                global.navigator = mockWindow.navigator;

                let methodsToLog = [];

                if (mode.logEnabled) {
                    methodsToLog = ["trace"];
                }

                const config = {
                    server: SERVER,
                    app: APP,
                    toConsole: mode.consoleEnabled,
                    consoleObject: mockConsole.create(),
                    globalize: false,
                    methodsToLog
                };

                chronicleLogger.init(config);
            });

            it("console.trace()", () => {
                chronicleLogger.trace();

                const history = mockConsole.history();
                if (mode.consoleEnabled) {
                    expect(history)
                        .to.be.an("array")
                        .and.have.length(1);
                } else {
                    expect(history)
                        .to.be.an("array")
                        .and.have.length(0);
                }

                const fetchedCalls = mockFetch.calls();
                if (!mode.logEnabled) {
                    expect(fetchedCalls, "Mocked fetch failed.").to.be.an(
                        "array"
                    ).that.is.empty;
                } else {
                    expect(fetchedCalls, "Mocked fetch failed.")
                        .to.be.an("array")
                        .that.is.length(1);

                    fetchedCalls.forEach((call, index) => {
                        const res = call[1];
                        const { app, client, type, data, trace } = JSON.parse(
                            res.body
                        );
                        expect(call[0]).to.equal(SERVER);
                        expect(res.method).to.equal(EXPECTED_METHOD);
                        expect(res.headers).to.deep.equal(EXPECTED_HEADERS);
                        expect(app).to.equal(APP);
                        expect(type).to.equal("trace");
                        expect(data[0])
                            .to.be.an("array")
                            .to.be.length.gt(4);
                        expect(client).to.deep.equal(
                            generateExpectedClient(global.navigator)
                        );
                        expect(trace).to.be.length.gt(4);
                    });
                }
            });
        });
    });
});
