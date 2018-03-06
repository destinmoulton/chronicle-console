const chai = require("chai");
const fetchMock = require("fetch-mock");

const expect = chai.expect;

const ChronicleMockConsole = require("./lib/ChronicleMockConsole");

// The object to test
const chronicleConsole = require("../dist/chronicleconsole");

const SERVER = "https://apiserver.com/test/";
const APP = "Test Unlogged Methods";

const mockConsole = ChronicleMockConsole();

const UNLOGGED_METHODS = [
    "clear",
    "count",
    "dir",
    "dirxml",
    "profile",
    "profileEnd",
    "timeStamp"
];

// Just make sure args are being passed to the console methods
describe("Unlogged Console Methods", () => {
    UNLOGGED_METHODS.forEach(method => {
        describe("console." + method, () => {
            beforeEach(() => {
                // Monitor all POSTs
                fetchMock.restore();
                fetchMock.post(SERVER, 200);
                mockConsole.historyClear();
                const config = {
                    server: SERVER,
                    app: APP,
                    toConsole: true,
                    consoleObject: mockConsole
                };

                chronicleConsole.init(config);
            });

            it("called correctly", () => {
                const params = ["A String", { an: "object" }, ["array"], 0];
                chronicleConsole[method].apply(this, params);

                const history = mockConsole.history();
                expect(history)
                    .to.be.an("array")
                    .and.have.length(1);
                expect(history[0].method).to.be.equal(method);

                const fetchedCalls = fetchMock.calls();

                expect(fetchedCalls, "Mocked fetch failed.")
                    .to.be.an("array")
                    .that.is.length(0);
            });
        });
    });
});
