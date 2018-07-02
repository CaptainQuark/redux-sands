import ReduxWrapper from "../../source/index";
import component from "./component";

const wrapper = new ReduxWrapper({ called: "home" });
wrapper.add({ initState: { count: 5 } }).add({ component });

/*
 *
 * Exports.
 *
 */

export default wrapper.connection;
export const reducer = wrapper.reducer;
