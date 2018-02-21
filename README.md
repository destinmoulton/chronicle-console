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

### Configuration

| Option        | Required | Description                                                                   | Default                           |
| ------------- | -------- | ----------------------------------------------------------------------------- | --------------------------------- |
| server        | \*       | The URL of the Chronicle Logger.                                              |                                   |
| app           | \*       | The name of this app.                                                         |                                   |
| env           |          | Environment information.                                                      | `window.navigator`                |
| toConsole     |          | Show messages in regular console.                                             | false                             |
| globalize     |          | Overwrite the global console object.                                          | true                              |
| consoleObject |          | A console object. Useful for testing/mocking the console.                     | `console`                         |
| methodsToLog  |          | Array of methods that are logged. Note: does **not** effect toConsole option. | ["action","error","warn","trace"] |

### License

Chronicle Console is released under the MIT License.
