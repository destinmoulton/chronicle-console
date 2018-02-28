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

| Option          | Required | Description                                                                  | Default                     |
| --------------- | -------- | ---------------------------------------------------------------------------- | --------------------------- |
| `server`        | \*       | The URL of the Chronicle Logger.                                             |                             |
| `app`           | \*       | The name of this app.                                                        |                             |
| `env`           |          | Environment information.                                                     | `window.navigator`          |
| `toConsole`     |          | Show messages in regular console.                                            | `true`                      |
| `globalize`     |          | Overwrite the global console object.                                         | `true`                      |
| `consoleObject` |          | A console object.<br>Useful for testing/mocking.                             | `console`                   |
| `methodsToLog`  |          | Array of methods that are logged.<br>Does **not** effect `toConsole` option. | `["action","error","warn"]` |
| `customMethods` |          | Array of strings for custom logging methods.                                 | `[]`                        |

### License

Chronicle Console is released under the MIT License.
