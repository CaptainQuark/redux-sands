import ReduxWrapper from "../../../source";
import component from "./component";

const wrapper = new ReduxWrapper({ called: "home" });

wrapper
  .add({ initState: { count: 5 } })
  .add({ component })
  .add({
    decrement: {
      fn: (state, by) => ({ ...state, count: state.count - value }),
      withSaga: {
        takeEvery: function*(action) {
          const { put, result } = action;
          console.log("Home : saga : action -", action);
          put({ ...result, by: 1 });
        },
        andSagaEffects: ["take", "put", "apply", "cps"]
      }
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
