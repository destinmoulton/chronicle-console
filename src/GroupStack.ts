class GroupStack {
    private _stack = [];

    addGroup() {
        // Add an array to the stack
        this._stack.unshift([]);
    }

    pushLog(logItem) {
        this._stack[0].push(logItem);
    }
}

export default new GroupStack();
