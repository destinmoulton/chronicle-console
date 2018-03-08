### Chronicle Console

### Usage

Log user actions:

```
console.action("login");
console.action("click", "information button");
```

Standard console logging is also sent to the server:

```
console.assert(<predicate>, "Message on failure");
console.log("message");
console.error("Error!");
```

### Collected Data

Along with the data (strings, numbers, arrays, or objects), a stack trace is taken and logged when each enabled method is called. As such, you don't need to create an additional console.trace() call and can likely leave `trace` out of the `methodsToLog` array.

### Configuration

| Option          | Required | Description                                                                     | Default                     |
| --------------- | -------- | ------------------------------------------------------------------------------- | --------------------------- |
| `server`        | \*       | The URL of the Chronicle Logger.                                                |                             |
| `app`           | \*       | The name of this app.                                                           |                             |
| `env`           |          | Environment information.                                                        | `window.navigator`          |
| `toConsole`     |          | Show messages in regular console.                                               | `true`                      |
| `globalize`     |          | Overwrite the global console object.                                            | `false`                     |
| `consoleObject` |          | A console object.<br>Useful for testing/mocking.                                | `console`                   |
| `methodsToLog`  |          | Array of methods that are logged.<br>Does **not** effect `toConsole` option.    | `["action","error","warn"]` |
| `customMethods` |          | Array of strings for custom logging methods.<br>Do not include in methodsToLog. | `[]`                        |

### methodsToLog

The methodsToLog configuration option is used to determine which standard console methods are logged. Many apps will probably not want to store `console.log()` messages, however `console.error` and the custom `console.action` are useful for tracking bugs and user actions.

### Stack Traces

Every log method includes a stack trace, this means that you don't need to call the console.trace() command to get a trace.

### Custom Methods

You can easily add your own custom logging method names.

```
const config = {
    server: "https://xyz.chronicle.logging.server.com",
    app: "My App",
    globalize: true,
    methodsToLog: ["error", "warn"],
    customMethods: ["crash"]
};

ChronicleConsole.init(config);

ChronicleConsole.crash("The system has crashed!");
console.crash("Frontend has crashed");
// Logs crash to server but does NOT log to console
// Includes a stack trace
```

### License

Chronicle Console is released under the MIT License.
