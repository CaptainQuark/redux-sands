/**
 * @jest-environment jsdom
 */
import React from "react";
import ReactDOM from "react-dom";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, render, configure } from "enzyme";
import AppReduxContainer from "./App";
import App from "./App/component";
import Home from "./Home";
import Settings from "./Settings";

/*
 *
 * Setup.
 *
 */

configure({ adapter: new Adapter() });
const wrapper = mount(<AppReduxContainer />);

/*
 *
 * Tests.
 *
 */

describe("<AppReduxContainer/>", () => {
  it("should render AppReduxContainer", () => {
    expect(wrapper).toBeTruthy();
    //console.log(wrapper.children().debug());
  });

  it("should contain <Home/>", () => {
    expect(wrapper.find(Home).length).toEqual(1);
  });

  it("should contain init props in <Home/>", () => {
    //console.log(wrapper.find(Home).children().debug());
    expect(
      wrapper
        .find(Home)
        .children()
        .prop("count")
    ).toEqual(5);
  });
});

describe("<Settings>", () => {
  const settings = wrapper.find(Settings).children();
  it("should have all props (incl. imported)", () => {
    expect(settings.prop("isOn")).toEqual(true);
    expect(settings.prop("count")).toEqual(5);
  });
});
