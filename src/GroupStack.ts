/**
 * console.group() and console.groupCollapsed() add log elements
 * to a nested stack.
 *
 * console.groupEnd() removes that set of logs from the stack
 */

export default class GroupStack {
    private _stack = [];

    addGroup() {
        // Add an array to the stack
        this._stack.unshift([]);
    }

    removeGroup() {
        return this._stack.shift();
    }

    /**
     * Push a log item onto the current group
     *
     * @param logItem object
     */
    pushLog(logItem) {
        this._stack[0].push(logItem);
    }

    isEmpty() {
        return this._stack.length === 0;
    }
}
