import typescript from "rollup-plugin-typescript2";

export default [
    {
        input: "src/index.ts",
        output: {
            file: "dist/chronicleconsole.js",
            format: "umd",
            name: "ChronicleConsole"
        },
        watch: {
            include: "src/**",
            clearScreen: true
        },
        plugins: [typescript()]
    }
];
