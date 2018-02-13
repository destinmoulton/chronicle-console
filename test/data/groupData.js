const METHODS = {
    log: ["Alpha", [1, 2, 3]],
    info: [{ a: "First", b: "Second" }, "Beta"],
    warn: [["c", "b", "a"], { one: 1, two: 2 }],
    error: ["ERROR: ", "SOMETHING WENT WRONG!"],
    table: [{ a: "alpha", b: "beta" }, "omega", 8]
};

const METHOD_ARR = Object.keys(METHODS).map(key => {
    return { type: key, log: METHODS[key] };
});

const TESTS = [
    {
        title: "Flat group (depth 1).",
        sequence: ["group", ...Object.keys(METHODS), "groupEnd"],
        expectedData: { type: "group", log: METHOD_ARR }
    },
    {
        title: "Nested group (depth 2).",
        sequence: [
            "group",
            "warn",
            "error",
            "table",
            "group",
            "log",
            "info",
            "groupEnd",
            "info",
            "groupEnd"
        ],
        expectedData: {
            type: "group",
            log: [
                ...METHOD_ARR.slice(2),
                { type: "group", log: METHOD_ARR.slice(0, 2) },
                ...METHOD_ARR.slice(1, 2)
            ]
        }
    },
    {
        title: "Nested group (depth 3).",
        sequence: [
            "group",
            "log",
            "info",
            "group",
            "group",
            "warn",
            "table",
            "groupEnd",
            "info",
            "groupEnd",
            "error",
            "groupEnd"
        ],
        expectedData: {
            type: "group",
            log: [
                ...METHOD_ARR.slice(0, 2),
                {
                    type: "group",
                    log: [
                        {
                            type: "group",
                            log: [...METHOD_ARR.slice(2, 3), METHOD_ARR[4]]
                        },
                        METHOD_ARR[1]
                    ]
                },
                METHOD_ARR[3]
            ]
        }
    },
    {
        title: "Nested group and groupCollapsed (depth 3).",
        sequence: [
            "groupCollapsed",
            "log",
            "info",
            "group",
            "groupCollapsed",
            "warn",
            "groupEnd",
            "group",
            "table",
            "groupEnd",
            "info",
            "groupEnd",
            "error",
            "groupEnd"
        ],
        expectedData: {
            type: "group",
            log: [
                ...METHOD_ARR.slice(0, 2),
                {
                    type: "group",
                    log: [
                        {
                            type: "group",
                            log: [...METHOD_ARR.slice(2, 3)]
                        },
                        {
                            type: "group",
                            log: [METHOD_ARR[4]]
                        },

                        METHOD_ARR[1]
                    ]
                },
                METHOD_ARR[3]
            ]
        }
    }
];

module.exports = {
    METHODS,
    TESTS
};
