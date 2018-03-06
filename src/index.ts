import Chronicle from "./Chronicle";
import ArgHelpers from "./ArgHelpers";
import EnvironmentParser from "./EnvironmentParser";
import GroupStack from "./GroupStack";

const argHelpers = new ArgHelpers();
const environmentParser = new EnvironmentParser();
const groupStack = new GroupStack();

// DO NOT export default (as this will cause the export to occur as an Object.default)
export default new Chronicle(argHelpers, environmentParser, groupStack);
