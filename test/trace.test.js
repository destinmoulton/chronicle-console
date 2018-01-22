const chai = require("chai");
const consoleMock = require("console-mock");
const fetchMock = require("fetch-mock");

const expect = chai.expect;

const chronicleLogger = require("../index");

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

fetchMock.post(SERVER, "*");
describe("ChronicleLogger .trace()", () => {
    TESTS.forEach(test => {
        describe("Logs trace to server", () => {
            beforeEach(() => {
                fetchMock.reset();
                consoleMock.enabled(false);
                consoleMock.historyClear();
                const config = {
                    server: SERVER,
                    app: APP,
                    clientInfo: {},
                    toConsole: test.consoleEnabled,
                    globalConsole: consoleMock.create()
                };

                chronicleLogger.init(config);
            });

            it(test.name, () => {
                chronicleLogger.trace();

                const history = consoleMock.history();
                if (test.consoleEnabled) {
                    expect(history)
                        .to.be.an("array")
                        .and.have.length(1);
                } else {
                    expect(history)
                        .to.be.an("array")
                        .and.have.length(0);
                }

                const fetchedCalls = fetchMock.calls();

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
                    expect(body.info).to.be.an("array").that.is.not.empty;
                });
            });
        });
    });
});
