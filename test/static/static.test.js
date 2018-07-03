import ReduxWrapper from "../../source/index";

/*
 *
 * Setup.
 *
 */

const wrapper = new ReduxWrapper({ called: "test" });
wrapper.add({ update: (state, action) => ({ ...state, ...action }) });

/*
 *
 * Tests.
 *
 */

describe("Init", () => {
  test("instantiate", () => {
    expect(wrapper).toBeDefined();
  });
});

describe("Exports to integrate with store", () => {
  test("correct type export", () => {
    expect(wrapper.types().update).toMatch(/TEST_UPDATE/);
  });

  test("reducer exported", () => {
    expect(wrapper.reducer).toBeTruthy();
  });

  test("saga should be null", () => {
    expect(wrapper.saga.length).toEqual(Number(0));
  });
});

describe("Internal values", () => {
  test("Correct actionReducer", () => {
    expect(wrapper.actionReducers["TEST_UPDATE"].name).toMatch(/update/);
    expect(wrapper.actionReducers["TEST_UPDATE"].isReducable).toEqual(true);
    expect(wrapper.actionReducers["TEST_UPDATE"].f).toBeTruthy();
  });
});

describe("Adding'", () => {
  test("correct add-return", () => {
    expect(wrapper.add({ remove: (state, { remove }) => ({ ...state, remove }) })).toEqual(wrapper);
  });

  test("add initState", () => {
    expect(wrapper.add({ initState: { count: 0 } })).toEqual(wrapper);
    expect(wrapper.initState.count).toEqual(Number(0));
  });

  test("added reducer", () => {
    expect(wrapper.actionReducers["TEST_REMOVE"].name).toMatch(/remove/);
    expect(wrapper.actionReducers["TEST_REMOVE"].isReducable).toEqual(true);
    expect(wrapper.actionReducers["TEST_REMOVE"].f).toBeTruthy();
  });
});
