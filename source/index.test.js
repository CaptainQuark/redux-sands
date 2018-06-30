import ReduxWrapper from "./index";

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

test("instantiate", () => {
  expect(wrapper).toBeDefined();
});

test("correct type export", () => {
  expect(wrapper.types().update).toMatch(/TEST_UPDATE/);
});
