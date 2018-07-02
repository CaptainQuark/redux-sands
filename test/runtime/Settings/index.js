import ReduxWrapper from "../../../source";
import component from "./component";

const wrapper = new ReduxWrapper({ called: "settings" });
wrapper
  .add({ initState: { isOn: true } })
  .add({ component })
  .import({
    state: {
      home: ["count"]
    }
  });

/*
 *
 * Exports.
 *
 */

export default wrapper.connection;
export const reducer = wrapper.reducer;
export const saga = wrapper.saga;
