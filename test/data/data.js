module.exports = [
    {
        name: "Empty Data Objects [No Server, Yes Console]",
        params: ["", {}, [], undefined, null],
        shouldLogToServer: false
    },
    {
        name: "Single Number",
        params: [987654321],
        shouldLogToServer: true
    },
    {
        name: "Single String",
        params: ["AllGoodDogs with Spaces"],
        shouldLogToServer: true
    },
    {
        name: "Single Array of Numbers",
        params: [[1, 2, 3]],
        shouldLogToServer: true
    },
    {
        name: "Single Array of Strings",
        params: [["one", "two", "three"]],
        shouldLogToServer: true
    },
    {
        name: "Single Array of Single Object",
        params: [[{ one: 1, two: 2, three: 3 }]],
        shouldLogToServer: true
    },
    {
        name: "Single Array of Multiple Objects",
        params: [[{ one: 1, two: 2, three: 3 }, { alpha: "a", beta: "b" }]],
        shouldLogToServer: true
    },
    {
        name: "Single Object",
        params: [{ one: 1, two: 2, three: 3 }],
        shouldLogToServer: true
    },
    {
        name: "Single Object with Array Property",
        params: [{ alpha: "a", beta: "b", testArray: [1, 2, 3] }],
        shouldLogToServer: true
    },
    {
        name: "Pre-defined Params",
        params: [
            9876,
            ["one", "two", "three"],
            "A string.",
            { alpha: [0, 1, 2], beta: "Beta string.", theta: 1234 }
        ],
        shouldLogToServer: true
    },
    {
        name: "Pre-defined with Empty Params",
        params: [
            9876,
            null,
            ["one", "two", "three"],
            {},
            "A string.",
            [],
            { alpha: [0, 1, 2], beta: "Beta string.", theta: 1234 },
            "",
            undefined
        ],
        shouldLogToServer: true
    }
];
