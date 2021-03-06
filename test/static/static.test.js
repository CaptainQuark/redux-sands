import ReduxWrapper from "../../source/index";
import component from "../runtime/Home/component";

/*
 *
 * Setup.
 *
 */

let wrapper = null;

/*
 *
 * Tests.
 *
 */

/*
 * Init.
 */

describe("Init", () => {
  test("instantiate", () => {
    wrapper = new ReduxWrapper({ called: "test" });
    expect(wrapper).toBeDefined();
  });

  test("Wrong constructor", () => {
    expect(() => new ReduxWrapper()).toThrow();
  });
});

/*
 * Adding.
 */

describe("Adding'", () => {
  test("correct add-return", () => {
    expect(wrapper.add({ update: (state, action) => ({ ...state, ...action }) })).toEqual(wrapper);
    expect(wrapper.add({ remove: (state, { remove }) => ({ ...state, remove }) })).toEqual(wrapper);
  });

  test("add initState", () => {
    expect(wrapper.add({ initState: { count: 0 } })).toEqual(wrapper);
    expect(wrapper.initState.count).toEqual(Number(0));
  });

  test("added reducer", () => {
    expect(wrapper.actionReducers["TEST_UPDATE"].name).toMatch(/update/);
    expect(wrapper.actionReducers["TEST_UPDATE"].isReducable).toEqual(true);
    expect(wrapper.actionReducers["TEST_UPDATE"].f).toBeTruthy();

    expect(wrapper.actionReducers["TEST_REMOVE"].name).toMatch(/remove/);
    expect(wrapper.actionReducers["TEST_REMOVE"].isReducable).toEqual(true);
    expect(wrapper.actionReducers["TEST_REMOVE"].f).toBeTruthy();
  });

  test("added component", () => {
    expect(wrapper.add({ component })).toEqual(wrapper);
    expect(wrapper.component).toEqual(component);
  });
});

/*
 * Exports from ReduxWrapper.
 */

describe("Exports to integrate with store", () => {
  test("correct type export", () => {
    expect(wrapper.types()).toEqual({ update: "TEST_UPDATE", remove: "TEST_REMOVE" });
  });

  test("reducer exported", () => {
    expect(wrapper.reducer).toBeTruthy();
  });

  test("saga should be null", () => {
    expect(wrapper.saga.length).toEqual(Number(0));
  });

  test("mapStateToProps", () => {
    const stateMap = wrapper.mapStateToProps({ other: { persons: 5 }, test: { count: 0 } });
    expect(stateMap).toEqual({ count: 0 });
  });

  test("connection", () => {
    expect(wrapper.connection).toBeTruthy();
  });
});

/*
 * Internal action reducers.
 */

describe("Internal values", () => {
  test("Correct state", () => {
    expect(wrapper.initState.count).toEqual(Number(0));
  });

  test("Correct actionReducer", () => {
    expect(wrapper.actionReducers["TEST_UPDATE"].name).toMatch(/update/);
    expect(wrapper.actionReducers["TEST_UPDATE"].isReducable).toEqual(true);
    expect(wrapper.actionReducers["TEST_UPDATE"].f).toBeTruthy();
  });

  test("_bind()", () => {
    expect(wrapper._bind()).toEqual(undefined);
  });
});

/*
 * Static type creators.
 */

describe("Create types-helpers", () => {
  test("Correct actionReducer", () => {
    expect(ReduxWrapper._createType({ _id: "settings", actionKey: "update" })).toMatch(/SETTINGS_UPDATE/);
  });

  test("Correct external types w/o saga", () => {
    const tuple = ReduxWrapper._createExternalTypes({ namespace: "app", fName: "update", _id: "settings" });
    expect(tuple.basic).toMatch(/APP_UPDATE/);
    expect(tuple.proxy).toMatch(/SETTINGS_PROXY_APP_UPDATE/);
  });

  test("Correct external types w saga", () => {
    const tuple = ReduxWrapper._createExternalTypes({
      namespace: "app",
      fName: "update",
      _id: "settings",
      withSaga: true
    });
    expect(tuple.basic).toMatch(/APP_UPDATE/);
    expect(tuple.proxy).toMatch(/SETTINGS_PROXY_APP_UPDATE/);
    expect(tuple.saga.req).toMatch(/SAGA_REQ_APP_UPDATE/);
    expect(tuple.saga.rec).toMatch(/SAGA_REC_APP_UPDATE/);
  });

  test("Correct _extractImportReducerParams with String", () => {
    const names = ReduxWrapper._extractImportReducerParams("update");
    expect(names.fName).toMatch(/update/);
    expect(names.exposedName).toMatch(/update/);
    expect(names.withSaga).toEqual(false);
  });

  test("Correct _extractImportReducerParams with valid Object", () => {
    const names = ReduxWrapper._extractImportReducerParams({ origin: "update", as: "otherUpdate" });
    expect(names.fName).toMatch(/update/);
    expect(names.exposedName).toMatch(/otherUpdate/);
    expect(names.withSaga).toEqual(false);
  });

  test("Correct _extractImportReducerParams with corrupt Object", () => {
    expect(() => ReduxWrapper._extractImportReducerParams({ as: "otherUpdate" })).toThrow();
    expect(() => ReduxWrapper._extractImportReducerParams({ origin: "otherUpdate" })).toThrow();
    expect(() => ReduxWrapper._extractImportReducerParams({})).toThrow();
    expect(() => ReduxWrapper._extractImportReducerParams(false)).toThrow();
  });
});

/*
 * Saga.
 */

describe("Saga'", () => {
  const wrapper = new ReduxWrapper({ called: "saga" });

  test("corrupt addition of saga", () => {
    expect(() => wrapper._addSaga({ update: { wrongFn: () => {} } })).toThrow();
  });
});
