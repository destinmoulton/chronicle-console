module.exports = [
    {
        name: "Empty Data Objects [No Server, Yes Console]",
        params: ["", {}, [], undefined, null],
        expectations: {
            shouldLogToServer: false,
            numberLoggedParameters: 0
        }
    },
    {
        name: "Single Number",
        params: [987654321],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },
    {
        name: "Single String",
        params: ["AllGoodDogs with Spaces"],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },
    {
        name: "Single Array of Numbers",
        params: [[1, 2, 3]],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },
    {
        name: "Single Array of Strings",
        params: [["one", "two", "three"]],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },
    {
        name: "Single Object",
        params: [{ one: 1, two: 2, three: 3 }],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },
    {
        name: "Single Array of Single Object",
        params: [[{ one: 1, two: 2, three: 3 }]],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },
    {
        name: "Single Array of Multiple Objects",
        params: [[{ one: 1, two: 2, three: 3 }, { alpha: "a", beta: "b" }]],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },

    {
        name: "Single Object with Array Property",
        params: [{ alpha: "a", beta: "b", testArray: [1, 2, 3] }],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 1
        }
    },
    {
        name: "Pre-defined Params",
        params: [
            9876,
            ["one", "two", "three"],
            "A string.",
            { alpha: [0, 1, 2], beta: "Beta string.", theta: 1234 }
        ],
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 4
        }
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
        expectations: {
            shouldLogToServer: true,
            numberLoggedParameters: 4
        }
    }
];
