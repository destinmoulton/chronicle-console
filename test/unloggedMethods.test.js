const chai = require("chai");

const expect = chai.expect;

const ChronicleMockConsole = require("./lib/ChronicleMockConsole");

// The object to test
const chronicleConsole = require("../index");

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
                mockConsole.historyClear();
                const config = {
                    server: SERVER,
                    app: APP,
                    clientInfo: {},
                    toConsole: true,
                    globalConsole: mockConsole
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
            });
        });
    });
});
